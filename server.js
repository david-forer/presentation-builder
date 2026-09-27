require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const { getPreset, getPresetList } = require('./presets');

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
// Set OUTPUT_DIR in .env to keep decks outside the packaged app folder
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, 'output');
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'presentation.html');

// Load template once at startup
const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const VALID_SLIDE_COUNTS = [3, 5, 7, 10, 12, 15];
const MAX_NOTES_LENGTH = 50000;

app.post('/generate', async (req, res) => {
  const { notes, slideCount, preset: presetKey, theme } = req.body;

  // Backward compat: accept "theme" if "preset" not provided
  const resolvedKey = presetKey || theme || 'bold-signal';
  const preset = getPreset(resolvedKey);

  if (!notes || !slideCount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!VALID_SLIDE_COUNTS.includes(Number(slideCount))) {
    return res.status(400).json({ error: 'Invalid slide count' });
  }

  if (notes.length > MAX_NOTES_LENGTH) {
    return res.status(400).json({ error: 'Notes too long (max 50,000 characters)' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
  }

  const prompt = buildPrompt(notes, slideCount, preset);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'server-side-fallback-2026-07-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-5-5',
        max_tokens: 16000,
        output_config: { effort: 'high' },
        fallbacks: 'default',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic API error:', err);
      return res.status(500).json({ error: 'AI request failed' });
    }

    const data = await response.json();
    if (data.stop_reason === 'refusal') {
      console.error('Anthropic refusal:', data.stop_details);
      return res.status(500).json({ error: 'AI declined this request' });
    }
    // Opus 5 returns thinking blocks before the answer, so read the text block by type
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const slidesHtml = extractSlides(textBlock ? textBlock.text : '');

    if (!slidesHtml) {
      return res.status(500).json({ error: 'Failed to generate slides' });
    }

    // Build CSS variables string from preset
    const vars = preset.cssVariables;
    const cssVarLines = Object.entries(vars).map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `--${prop}: ${v};`;
    }).join('\n      ');

    // Build final HTML from template
    const title = notes.split('\n')[0].substring(0, 60) || 'Presentation';
    const html = TEMPLATE
      .replace('{{TITLE}}', escapeHtml(title))
      .replace('{{FONT_IMPORTS}}', preset.fontImports)
      .replace('{{CSS_VARIABLES}}', cssVarLines)
      .replace('{{PRESET_CSS}}', preset.extraCSS)
      .replace('{{PRESET_NAME}}', resolvedKey)
      .replace('{{SLIDES}}', slidesHtml);

    // Save to output folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || 'presentation';
    const filename = `${safeTitle}_${slideCount}slides_${timestamp}.html`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
    console.log(`Saved: output/${filename}`);

    res.json({ html, filename });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPrompt(notes, slideCount, preset) {
  return `Generate ${slideCount} presentation slides from these notes. Return ONLY the slide HTML, nothing else.

## VISUAL STYLE
${preset.promptGuidance}

NOTES:
---
${notes}
---

## OUTPUT FORMAT (STRICT)
Return ONLY <section> elements. No DOCTYPE, no <html>, no <head>, no <body>, no <script>, no <style>.
Just the raw slide sections that will be injected into a template.

## SLIDE FORMAT
Each slide must be a <section> with these attributes:
- class="slide" (required)
- data-chapter="Chapter Name" (for sidebar navigation)
- data-notes="DETAILED speaker notes" (for presenter - see below)
- data-transition="fade|scale|slide-up|stagger" (for animation)

First slide must also have class="slide active".

## NARRATIVE CRAFT (CRITICAL)
Before writing any HTML, plan the narrative arc of your ${slideCount} slides:

**Story structure:**
- Start with WHY, not what — establish emotional connection before details
- First 2-3 slides must hook attention and establish credibility or urgency
- Place your strongest material (best data, biggest insight) in the middle third
- End with clarity: clear takeaway, call to action, or inspiring vision
- Each slide must build naturally to the next — no orphaned ideas

**Headline writing:**
- Every slide title must be an ASSERTIVE CLAIM, not a generic label
- GOOD: "We've Grown 40% Month-Over-Month for 6 Months"
- BAD: "Traction" or "Our Growth"
- GOOD: "Manual Processes Cost Teams 20 Hours per Week"
- BAD: "The Problem"
- The headline alone should tell the story if someone only reads titles

**Emotional resonance:**
- Include at least one human moment: a customer quote, a founding insight, or a vivid scenario
- Use specific numbers and names over vague claims ("saved Acme Corp $2M/year" not "saves money")
- Contrast creates drama: before/after, old way/new way, problem/solution

**Content density:**
- One idea per slide, ruthlessly enforced
- Max 30-40 words per slide (headlines + body combined)
- 40-60% of each slide should be whitespace
- If content doesn't fit, split into two slides — never cram
- Prefer visual components (stat cards, flow diagrams) over bullet points

## SPEAKER NOTES (CRITICAL)
The data-notes attribute must contain BULLET POINTS for quick glancing while presenting.
Format as actionable phrases separated by " • " (bullet with spaces).

RULES:
- Use " • " to separate each point (4-6 bullets per slide)
- Each point is 8-15 words — enough context to be useful
- Include WHAT to say + WHY or HOW
- Start with action: "Explain...", "Ask audience...", "Mention that...", "Emphasize..."
- Add specifics: names, numbers, examples to reference
- Last bullet = transition cue to next slide

Example:
<section class="slide active" data-chapter="Introduction" data-notes="Open with provocative question: how many hours wasted on repetitive tasks? • Let the silence land for 3 seconds • Reveal title as the solution they've been looking for • Mention this framework saved our team 20 hours/week • → Next: defining the core problem" data-transition="slide-up">
  <h1>Title Here</h1>
  <p class="subtitle">Subtitle</p>
</section>

## TRANSITIONS (choose based on content)
- slide-up: Title slides, big statements, impact slides
- scale: Flow diagrams, process slides
- stagger: Grids, lists (add class="stagger-item" style="--i:0" to each child, increment --i)
- fade: Everything else (default)

## SLIDE ROLES (REQUIRED)
Classify each slide into exactly ONE role:

| Role | Layout | Accent Color | Max Density |
|------|--------|--------------|-------------|
| Punch | Centered, max 2 lines, large type | amber (#f59e0b) or purple (#a855f7) | 12 words total |
| Structure | Left-aligned, diagram or stack | cyan (#00d4ff) | 5 labeled elements |
| Evidence | Grid or card layout, numbers dominate | purple (#a855f7) | 4 metrics/cards |
| Flow | Horizontal/vertical pipeline, arrows | green (#22c55e) | 5 elements |
| Reflection | Minimal, centered, soft | amber (#f59e0b) | 12 words total |

ROLE RULES:
- Do NOT use the same role more than twice in a row
- Apply the accent color PER SLIDE based on its role using inline style
- Add data-role="RoleName" attribute to each section
- Use the role to determine which component/layout to use

## AVAILABLE COMPONENTS (use CSS classes, styles are pre-defined)

**Big Statement:** <div class="big-statement">Your <span class="accent">key point</span> here</div>

**Stat Card:**
<div class="stat-card"><span class="stat-number">85%</span><span class="stat-label">Description</span></div>

**Comparison Grid:**
<div class="comparison">
  <div class="compare-card negative"><h4>Before</h4><p>Old way</p></div>
  <div class="compare-card positive"><h4>After</h4><p>New way</p></div>
</div>

**Feature Grid (use stagger):**
<div class="feature-grid">
  <div class="feature-card stagger-item" style="--i:0"><h4>Feature</h4><p>Description</p></div>
</div>

**Flow Diagram:**
<div class="flow">
  <div class="flow-step">Step 1</div><div class="flow-arrow">→</div><div class="flow-step">Step 2</div>
</div>

**Quote:**
<blockquote class="quote"><span class="quote-mark">"</span><p>Quote text</p><cite>— Attribution</cite></blockquote>

**Timeline (use stagger):**
<div class="timeline">
  <div class="timeline-item stagger-item" style="--i:0"><span class="timeline-date">Q1</span><span class="timeline-event">Event</span></div>
</div>

**Stack/Layers:**
<div class="stack-diagram"><div class="stack-layer"><h4>Layer</h4><p>Description</p></div></div>

**Problem List:**
<div class="problem-grid"><div class="problem-item"><p>Problem</p></div></div>

**Principles/Three Column:**
<div class="principles"><div class="principle"><h4>Title</h4><p>Description</p></div></div>

**Metric Bar:**
<div class="metric-bar"><div class="metric-fill" style="width: 75%"></div><span class="metric-label">75%</span></div>

**Logo Grid:**
<div class="logo-grid"><div class="logo-item">Company</div></div>

## WHAT TO AVOID
- Bullet point dumps (use visual components instead)
- Generic slide titles ("Problem", "Solution", "Team") — make claims instead
- Walls of text or more than 40 words per slide
- Repeating the same component layout on consecutive slides
- Decorative elements that don't inform

## SLIDE STRUCTURE FOR ${slideCount} SLIDES
${getSlideStructure(slideCount)}

Return ONLY the HTML. No explanations, no markdown code blocks.`;
}

function getSlideStructure(count) {
  if (count === 3) {
    return `1. Title/Hook: Bold opening that captures attention
2. Core Message: Main content with supporting visuals
3. Takeaway: Summary or call to action`;
  }
  if (count === 5) {
    return `1. Title/Hook: Bold opening with key value proposition
2. Problem/Context: Why this matters, establish urgency
3. Solution/Approach: How you solve it, key benefits
4. Evidence/Proof: Data, traction, or validation
5. Takeaway/Ask: Summary, next steps, or call to action`;
  }
  if (count === 7) {
    return `1. Title/Hook: Bold opening, capture attention immediately
2. Problem: The pain point with tangible impact
3. Solution: Your approach and why it works
4. How It Works: Product/service details, key features
5. Traction/Proof: Evidence it works - data, customers, results
6. Differentiation: Why you vs alternatives
7. Takeaway/Ask: Clear call to action or inspiring vision`;
  }
  if (count === 10) {
    return `1. Title/Hook: Bold opening statement or vision
2. Problem: The pain point with data and urgency
3. Agitate: Why current solutions fail, what's at stake
4. Solution: Your approach and unique insight
5. How It Works: Product details, key workflow
6. Benefits: Value delivered, ROI, outcomes
7. Traction: Growth metrics, customer validation
8. Market/Opportunity: Size, timing, why now
9. Team/Credibility: Why you can execute
10. Ask/Vision: Clear CTA or inspiring future state`;
  }
  if (count === 12) {
    return `1. Title/Hook: Bold opening statement with tagline
2. Problem: The pain point - make it visceral
3. Agitate: Cost of inaction, why this matters now
4. Solution Overview: Your approach in one sentence
5. How It Works: Core product/service walkthrough
6. Key Features: 3 differentiating capabilities
7. Benefits: Tangible outcomes and ROI
8. Traction: Growth metrics, logos, testimonials
9. Market Opportunity: TAM/SAM/SOM with timing
10. Competition: Positioning and moat
11. Team: Founders and key expertise
12. Ask/Vision: Funding ask, use of funds, and vision`;
  }
  // count === 15
  return `1. Title/Hook: Bold opening with memorable tagline
2. The Problem: Pain point with data and emotion
3. Agitate: Why current solutions fail
4. Market Timing: Why now is the moment
5. Solution Overview: Your approach summarized
6. Product Deep Dive: How it works step by step
7. Key Features: Top 3 differentiators
8. Benefits & ROI: Quantified value delivered
9. Case Study: Customer success story
10. Traction: Metrics, growth, momentum
11. Market Size: TAM/SAM/SOM breakdown
12. Competition: Landscape and positioning
13. Business Model: Revenue streams, unit economics
14. Team: Founders, advisors, key hires
15. The Ask: Funding, use of funds, milestones, vision`;
}

function extractSlides(text) {
  // Remove markdown code blocks if present
  let content = text.replace(/```(?:html)?\s*/gi, '').replace(/```/g, '').trim();

  // Extract all <section> elements
  const sectionMatches = content.match(/<section[\s\S]*?<\/section>/gi);
  if (sectionMatches && sectionMatches.length > 0) {
    return sectionMatches.join('\n\n    ');
  }

  // If no sections found but content looks like HTML, return as-is
  if (content.includes('<section')) {
    return content;
  }

  return null;
}

// Return available presets
app.get('/presets', (req, res) => {
  res.json(getPresetList());
});

// List all saved presentations from output/
app.get('/list', (req, res) => {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.html'));
  const presentations = files.map(f => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f));
    return { filename: f, createdAt: stat.mtime.toISOString() };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(presentations);
});

// Serve individual presentation files from output/
app.get('/output/:filename', (req, res) => {
  const filepath = path.join(OUTPUT_DIR, path.basename(req.params.filename));
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Not found' });
  res.sendFile(filepath);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Presentations saved to: ${OUTPUT_DIR}`);
});
