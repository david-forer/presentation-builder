// Style presets for Presentation Builder
// Sourced from frontend-slides STYLE_PRESETS.md
// Each preset defines fonts, colors, signature CSS, and AI prompt guidance

function responsiveTypography(scale = 1) {
  const s = (min, max) => `clamp(${Math.round(min * scale)}px, ${(min * scale / 16 + (max - min) * scale / 100).toFixed(2)}rem + ${((max - min) * scale / 100 * 2).toFixed(2)}vw, ${Math.round(max * scale)}px)`;
  return `
    .slide h1 { font-size: ${s(40, 72)}; }
    .slide h2 { font-size: ${s(32, 52)}; }
    .slide h3 { font-size: ${s(26, 42)}; }
    .slide p { font-size: ${s(16, 26)}; }
    .slide .subtitle { font-size: ${s(18, 30)}; }
    .big-statement { font-size: ${s(32, 56)}; }
    .stat-number { font-size: ${s(48, 84)}; }
    .stat-label { font-size: ${s(14, 22)}; }
    .compare-card h4 { font-size: ${s(20, 30)}; }
    .feature-card h4 { font-size: ${s(16, 24)}; }
    .feature-card p { font-size: ${s(13, 17)}; }
    .flow-step { font-size: ${s(14, 22)}; }
    .quote p { font-size: ${s(20, 32)}; }
    .quote cite { font-size: ${s(14, 22)}; }
    .principle h4 { font-size: ${s(20, 30)}; }
    .principle p { font-size: ${s(14, 20)}; }

    @media (max-height: 700px) {
      .slide { padding: 40px; }
      .slide h1 { font-size: ${s(32, 56)}; margin-bottom: 20px; }
      .slide h2 { font-size: ${s(26, 42)}; margin-bottom: 20px; }
      .comparison { gap: 24px; }
      .feature-grid { gap: 20px; }
    }
    @media (max-height: 600px) {
      .slide { padding: 30px; }
      .slide h1 { font-size: ${s(28, 48)}; margin-bottom: 16px; }
      .slide h2 { font-size: ${s(22, 36)}; margin-bottom: 16px; }
      .stat-number { font-size: ${s(36, 64)}; }
      .big-statement { font-size: ${s(24, 42)}; }
    }
    @media (max-height: 500px) {
      .slide { padding: 20px; }
      .slide h1 { font-size: ${s(24, 40)}; margin-bottom: 12px; }
      .slide h2 { font-size: ${s(20, 32)}; margin-bottom: 12px; }
      .stat-number { font-size: ${s(28, 52)}; }
      .big-statement { font-size: ${s(20, 36)}; }
    }`;
}

const PRESETS = {
  // ============================================
  // DARK THEMES
  // ============================================

  'bold-signal': {
    name: 'Bold Signal',
    category: 'dark',
    description: 'Confident, bold, high-impact with colored card focal point',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#1a1a1a',
      fg: '#ffffff',
      accent: '#FF5722',
      muted: '#999999',
      cardBg: '#2d2d2d',
      headingFont: "'Archivo Black', Impact, sans-serif",
      bodyFont: "'Space Grotesk', system-ui, sans-serif"
    },
    extraCSS: `
      .slide h1, .slide h2, .slide h3 { text-transform: uppercase; letter-spacing: 0.02em; }
      .slide h1 .accent, .slide h2 .accent { text-decoration: underline; text-decoration-thickness: 6px; text-underline-offset: 8px; }
      .stat-number { font-family: var(--heading-font); letter-spacing: -0.03em; }
      .big-statement { letter-spacing: -0.02em; }
      .feature-card { border-bottom: 4px solid var(--accent); }
      .slide-area { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%); }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Bold Signal — confident, high-impact dark theme with bold orange (#FF5722) accent. Fonts are Archivo Black (headings, 900 weight) and Space Grotesk (body). Use uppercase for impact, oversized numbers for stats. Bold colored elements as focal points. Use <span class="accent"> on key phrases. Grid-based precise alignment.`
  },

  'electric-studio': {
    name: 'Electric Studio',
    category: 'dark',
    description: 'Bold, clean, professional with split-panel accent bars',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;800&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#0a0a0a',
      fg: '#ffffff',
      accent: '#4361ee',
      muted: '#888888',
      cardBg: '#1a1a1a',
      headingFont: "'Manrope', system-ui, sans-serif",
      bodyFont: "'Manrope', system-ui, sans-serif"
    },
    extraCSS: `
      .feature-card, .compare-card, .stack-layer, .problem-item { border: 1px solid rgba(67,97,238,0.25); box-shadow: 0 0 20px rgba(67,97,238,0.08); }
      .feature-card:hover, .compare-card:hover { box-shadow: 0 0 30px rgba(67,97,238,0.18); }
      .stat-number { background: linear-gradient(135deg, #4361ee, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      .flow-step { border-color: transparent; background: linear-gradient(var(--card-bg), var(--card-bg)) padding-box, linear-gradient(135deg, #4361ee, #00d4ff) border-box; }
      .accent { color: #4361ee; }
      .flow-step { border: 2px solid transparent; }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Electric Studio — bold, clean, professional dark theme with blue (#4361ee) accent. Font is Manrope throughout (800 weight headings). Two-panel split layouts work well. Accent bar on edges. Quote typography as hero element. Minimal, confident spacing. Keep the mood modern and polished.`
  },

  'creative-voltage': {
    name: 'Creative Voltage',
    category: 'dark',
    description: 'Electric blue + neon yellow, bold creative energy',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#1a1a2e',
      fg: '#ffffff',
      accent: '#0066ff',
      muted: '#8888aa',
      cardBg: '#252545',
      headingFont: "'Syne', system-ui, sans-serif",
      bodyFont: "'Space Mono', 'Courier New', monospace",
      highlight: '#d4ff00'
    },
    extraCSS: `
      .slide h1 .accent, .slide h2 .accent { background: #d4ff00; color: #1a1a2e; padding: 0 8px; display: inline-block; }
      .stat-number { color: #d4ff00; font-family: var(--body-font); }
      .feature-card { border-left: 3px solid var(--accent); border-radius: 4px; }
      .flow-step { font-family: var(--body-font); border-style: dashed; }
      .quote-mark { color: #d4ff00; }
      .big-statement { font-family: var(--heading-font); }
      code, .code { background: rgba(0,102,255,0.15); padding: 2px 6px; border-radius: 3px; font-family: var(--body-font); }
      ${responsiveTypography(0.95)}`,
    promptGuidance: `Visual style: Creative Voltage — bold, creative, retro-modern with electric blue (#0066ff) and neon yellow (#d4ff00) on dark. Headings use Syne (700/800), body uses Space Mono (monospace). Highlighted words get a neon yellow background via <span class="accent">. Halftone textures, neon badges. Code-style aesthetic. Edgy creative energy.`
  },

  'dark-botanical': {
    name: 'Dark Botanical',
    category: 'dark',
    description: 'Elegant, sophisticated with warm accents and soft shapes',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#0f0f0f',
      fg: '#e8e4df',
      accent: '#d4a574',
      muted: '#9a9590',
      cardBg: '#1a1a1a',
      headingFont: "'Cormorant', 'Georgia', serif",
      bodyFont: "'IBM Plex Sans', system-ui, sans-serif",
      accentPink: '#e8b4b8',
      accentGold: '#c9b896'
    },
    extraCSS: `
      .slide h1, .slide h2 { font-weight: 400; letter-spacing: 0.03em; }
      .slide h1 { font-style: italic; }
      .stat-number { font-family: var(--heading-font); font-weight: 700; }
      .feature-card, .compare-card { border-radius: 16px; border: 1px solid rgba(212,165,116,0.2); }
      .flow-step { border-color: rgba(212,165,116,0.4); border-width: 1px; }
      .quote { font-family: var(--heading-font); font-style: italic; }
      .quote-mark { color: var(--accent); opacity: 0.6; }
      .timeline-date { background: rgba(212,165,116,0.2); color: var(--accent); }
      ${responsiveTypography(1.05)}`,
    promptGuidance: `Visual style: Dark Botanical — elegant, sophisticated, premium dark theme with warm accents. Colors: warm terracotta (#d4a574), pink (#e8b4b8), gold (#c9b896) on pure black (#0f0f0f). Headings use thin Cormorant serif (italic h1, 400 weight), body uses IBM Plex Sans (300/400). Abstract soft gradient circles as decoration. Generous whitespace, understated luxury.`
  },

  // ============================================
  // LIGHT THEMES
  // ============================================

  'notebook-tabs': {
    name: 'Notebook Tabs',
    category: 'light',
    description: 'Editorial paper with colorful section tabs',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;0,800;1,400&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#f8f6f1',
      fg: '#1a1a1a',
      accent: '#98d4bb',
      muted: '#777777',
      cardBg: '#f0ece4',
      headingFont: "'Bodoni Moda', 'Georgia', serif",
      bodyFont: "'DM Sans', system-ui, sans-serif",
      tabMint: '#98d4bb',
      tabLavender: '#c7b8ea',
      tabPink: '#f4b8c5',
      tabSky: '#a8d8ea',
      tabCream: '#ffe6a7'
    },
    extraCSS: `
      .slide-area { background: #2d2d2d; }
      .slide { background: var(--bg); margin: 0; }
      .slide h1, .slide h2 { letter-spacing: 0.01em; }
      .slide h3 { font-family: var(--body-font); text-transform: uppercase; font-size: clamp(14px, 1.6vw, 18px); letter-spacing: 0.15em; color: var(--muted); }
      .feature-card { background: var(--bg); border: 1px solid #d5d0c8; border-top: 3px solid #98d4bb; border-radius: 2px; }
      .feature-card:nth-child(2) { border-top-color: #c7b8ea; }
      .feature-card:nth-child(3) { border-top-color: #f4b8c5; }
      .compare-card { border-radius: 2px; border-top: 3px solid #a8d8ea; }
      .compare-card.positive { border-top-color: #98d4bb; }
      .compare-card.negative { border-top-color: #f4b8c5; }
      .stat-card { border-bottom: 1px solid #d5d0c8; padding-bottom: 20px; }
      .flow-step { border: 1px solid #d5d0c8; border-radius: 2px; background: var(--bg); }
      .stack-layer { border-left: 3px solid #c7b8ea; background: var(--bg); border-radius: 2px; }
      .timeline-date { background: #98d4bb; color: #1a1a1a; border-radius: 2px; }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Notebook Tabs — editorial, organized, tactile. Cream paper (#f8f6f1) on dark outer (#2d2d2d). Headings use Bodoni Moda serif (400/700), body uses DM Sans. Colorful tab borders on cards: mint (#98d4bb), lavender (#c7b8ea), pink (#f4b8c5), sky (#a8d8ea), cream (#ffe6a7). Use different tab colors on different cards. Ruled-line dividers. Tone: organized, editorial, structured.`
  },

  'pastel-geometry': {
    name: 'Pastel Geometry',
    category: 'light',
    description: 'Friendly pastels with decorative pills and rounded shapes',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#c8d9e6',
      fg: '#2d2d3a',
      accent: '#5a7c6a',
      muted: '#666680',
      cardBg: '#faf9f7',
      headingFont: "'Plus Jakarta Sans', system-ui, sans-serif",
      bodyFont: "'Plus Jakarta Sans', system-ui, sans-serif",
      pillPink: '#f0b4d4',
      pillMint: '#a8d4c4',
      pillSage: '#5a7c6a',
      pillLavender: '#9b8dc4',
      pillViolet: '#7c6aad'
    },
    extraCSS: `
      .slide { background: var(--card-bg); }
      .feature-card, .compare-card, .problem-item { border-radius: 20px; box-shadow: 0 4px 20px rgba(90,124,106,0.08); border: none; background: #fff; }
      .flow-step { border-radius: 50px; border: 2px solid var(--accent); padding: 20px 28px; background: #fff; }
      .flow-arrow { color: var(--accent); }
      .stat-number { color: #7c6aad; }
      .timeline-date { border-radius: 50px; background: #9b8dc4; color: #fff; }
      .accent { color: #5a7c6a; }
      .stack-layer { border-radius: 16px; border-left: 5px solid #f0b4d4; background: #fff; }
      .logo-item { border-radius: 16px; }
      .slide h1, .slide h2 { font-weight: 800; }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Pastel Geometry — friendly, approachable, modern. Pastel blue background (#c8d9e6) with white card (#faf9f7). Font is Plus Jakarta Sans throughout (800 weight headings). Decorative pill shapes and rounded cards (20px radius). Pastel palette: pink (#f0b4d4), mint (#a8d4c4), sage (#5a7c6a), lavender (#9b8dc4), violet (#7c6aad). Use different accent colors on different elements for variety.`
  },

  'split-pastel': {
    name: 'Split Pastel',
    category: 'light',
    description: 'Two-color vertical split with playful badge pills',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#f5e6dc',
      fg: '#1a1a1a',
      accent: '#f0d4e0',
      muted: '#888888',
      cardBg: '#ffffff',
      headingFont: "'Outfit', system-ui, sans-serif",
      bodyFont: "'Outfit', system-ui, sans-serif",
      bgLavender: '#e4dff0',
      badgeMint: '#c8f0d8',
      badgeYellow: '#f0f0c8',
      badgePink: '#f0d4e0'
    },
    extraCSS: `
      .slide:nth-child(even) { background: #e4dff0; }
      .slide:nth-child(odd) { background: #f5e6dc; }
      .slide:nth-child(even) .feature-card, .slide:nth-child(even) .compare-card { background: #fff; }
      .feature-card, .compare-card { border-radius: 16px; border: none; box-shadow: 0 2px 12px rgba(0,0,0,0.06); background: #fff; }
      .accent { background: #c8f0d8; color: #1a1a1a; padding: 2px 10px; border-radius: 50px; display: inline-block; -webkit-text-fill-color: #1a1a1a; }
      .stat-number { color: #1a1a1a; font-weight: 800; }
      .flow-step { border-radius: 50px; background: #f0d4e0; color: #1a1a1a; border: none; font-weight: 600; }
      .flow-arrow { color: #888; }
      .timeline-date { background: #c8f0d8; color: #1a1a1a; border-radius: 50px; }
      .slide h1 { font-weight: 800; }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Split Pastel — playful, modern, friendly. Alternating backgrounds: peach (#f5e6dc) and lavender (#e4dff0). Font is Outfit throughout (800 weight headings). Playful badge pills with mint (#c8f0d8), yellow (#f0f0c8), pink (#f0d4e0) backgrounds. Highlighted words become pill-shaped badges via <span class="accent">. Grid patterns on panels. Rounded CTA buttons.`
  },

  'vintage-editorial': {
    name: 'Vintage Editorial',
    category: 'light',
    description: 'Witty, editorial with geometric shapes and bold borders',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;0,900;1,600&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#f5f3ee',
      fg: '#1a1a1a',
      accent: '#e8d4c0',
      muted: '#555555',
      cardBg: '#ebe8e1',
      headingFont: "'Fraunces', 'Georgia', serif",
      bodyFont: "'Work Sans', system-ui, sans-serif"
    },
    extraCSS: `
      .slide h1 { font-weight: 900; letter-spacing: -0.02em; }
      .slide h2 { font-weight: 700; }
      .slide h1::after { content: ''; display: block; width: 60px; height: 3px; background: var(--fg); margin: 20px auto 0; }
      .big-statement::first-letter { font-size: 1.6em; font-family: var(--heading-font); color: var(--fg); }
      .feature-card { background: transparent; border: none; border-top: 2px solid #1a1a1a; border-radius: 0; padding-top: 24px; }
      .compare-card { border-radius: 4px; border: 2px solid #1a1a1a; }
      .quote { font-family: var(--heading-font); }
      .quote-mark { color: var(--fg); font-family: var(--heading-font); }
      .stat-number { font-family: var(--heading-font); font-weight: 900; color: var(--fg); }
      .timeline-date { background: var(--fg); border-radius: 0; color: #fff; }
      .flow-step { border-radius: 0; border: 2px solid var(--fg); }
      ${responsiveTypography(1.02)}`,
    promptGuidance: `Visual style: Vintage Editorial — witty, confident, personality-driven. Cream background (#f5f3ee) with warm accent (#e8d4c0). Headings use Fraunces (distinctive serif, 700/900 weight), body uses Work Sans. Abstract geometric shapes as decoration (circle outlines + lines + dots, CSS-only). Bold bordered elements. Conversational, witty copy style. No illustrations—only geometric CSS shapes.`
  },

  // ============================================
  // SPECIALTY THEMES
  // ============================================

  'neon-cyber': {
    name: 'Neon Cyber',
    category: 'dark',
    description: 'Futuristic with neon glow, particle backgrounds, grid patterns',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&display=swap" rel="stylesheet"><link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#0a0f1c',
      fg: '#ffffff',
      accent: '#00ffcc',
      muted: '#9ca3af',
      cardBg: '#111827',
      headingFont: "'Clash Display', 'Outfit', system-ui, sans-serif",
      bodyFont: "'Satoshi', 'Outfit', system-ui, sans-serif",
      accentMagenta: '#ff00aa'
    },
    extraCSS: `
      .slide h1, .slide h2 { text-shadow: 0 0 30px rgba(0,255,204,0.3); }
      .accent { color: #00ffcc; text-shadow: 0 0 20px rgba(0,255,204,0.5); }
      .stat-number { color: #ff00aa; text-shadow: 0 0 25px rgba(255,0,170,0.4); font-family: var(--heading-font); }
      .feature-card, .compare-card { border: 1px solid rgba(0,255,204,0.2); background: rgba(17,24,39,0.8); }
      .flow-step { border: 1px solid #00ffcc; box-shadow: 0 0 15px rgba(0,255,204,0.15); }
      .flow-arrow { color: #00ffcc; text-shadow: 0 0 10px rgba(0,255,204,0.5); }
      .big-statement { text-shadow: 0 0 40px rgba(0,255,204,0.2); }
      .quote-mark { color: #ff00aa; text-shadow: 0 0 20px rgba(255,0,170,0.4); }
      .timeline-date { background: #ff00aa; box-shadow: 0 0 15px rgba(255,0,170,0.3); }
      .slide-area { background: #0a0f1c; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Neon Cyber — futuristic, techy, confident. Deep navy (#0a0f1c) with cyan (#00ffcc) and magenta (#ff00aa) neon accents. Headings use Clash Display (bold geometric sans from Fontshare), body uses Satoshi. Neon glow text-shadow effects. Grid pattern background. Use <span class="accent"> for cyan glow, inline style="color: #ff00aa" for magenta highlights. Particle/grid aesthetic.`
  },

  'terminal-green': {
    name: 'Terminal Green',
    category: 'dark',
    description: 'Developer-focused hacker aesthetic with monospace everything',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#0d1117',
      fg: '#c9d1d9',
      accent: '#39d353',
      muted: '#484f58',
      cardBg: '#161b22',
      headingFont: "'JetBrains Mono', 'Courier New', monospace",
      bodyFont: "'JetBrains Mono', 'Courier New', monospace"
    },
    extraCSS: `
      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      .slide h1::before, .slide h2::before { content: '> '; color: var(--accent); opacity: 0.6; }
      .slide h1, .slide h2 { text-align: left; text-transform: none; font-weight: 600; }
      .accent { color: #39d353; }
      .stat-number { color: #39d353; font-weight: 800; }
      .feature-card { background: rgba(57,211,83,0.04); border: 1px solid rgba(57,211,83,0.2); border-radius: 4px; font-family: var(--body-font); }
      .flow-step { border: 1px dashed var(--accent); border-radius: 0; background: transparent; font-family: var(--body-font); }
      .compare-card { border-radius: 4px; border-top: 2px solid var(--accent); }
      .compare-card.negative { border-top-color: #f85149; }
      .quote { font-family: var(--body-font); font-style: normal; }
      .quote-mark { color: var(--accent); }
      .big-statement { font-family: var(--body-font); text-align: left; }
      .big-statement::after { content: '█'; animation: blink 1s step-end infinite; color: var(--accent); margin-left: 4px; }
      .timeline-date { background: transparent; border: 1px solid var(--accent); color: var(--accent); border-radius: 0; }
      .stack-layer { border-radius: 0; border-left: 3px solid var(--accent); }
      ${responsiveTypography(0.9)}`,
    promptGuidance: `Visual style: Terminal Green — developer-focused, hacker aesthetic. GitHub dark (#0d1117) background with terminal green (#39d353). Font is JetBrains Mono throughout (monospace everything). Headings automatically get "> " prompt prefix. Big statements get a blinking cursor. Scan lines effect. Use left-aligned layouts. Cards have dashed/solid green borders. Code syntax styling. Keep text concise and code-like.`
  },

  'swiss-modern': {
    name: 'Swiss Modern',
    category: 'light',
    description: 'Clean, precise, Bauhaus-inspired with visible grid',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=Nunito:wght@400;600&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#ffffff',
      fg: '#000000',
      accent: '#ff3300',
      muted: '#666666',
      cardBg: '#f5f5f5',
      headingFont: "'Archivo', 'Helvetica Neue', sans-serif",
      bodyFont: "'Nunito', system-ui, sans-serif"
    },
    extraCSS: `
      .slide h1, .slide h2 { font-weight: 800; letter-spacing: -0.01em; }
      .slide h1::after { content: ''; display: block; width: 40px; height: 4px; background: var(--accent); margin: 16px auto 0; }
      .accent { color: var(--accent); }
      .stat-number { font-family: var(--heading-font); font-weight: 800; color: var(--accent); }
      .feature-card { border: 1px solid #e0e0e0; border-radius: 0; }
      .compare-card { border-radius: 0; }
      .flow-step { border: 2px solid var(--fg); border-radius: 0; }
      .flow-arrow { color: var(--accent); }
      .timeline-date { background: var(--fg); border-radius: 0; color: #fff; }
      .stack-layer { border-left: 4px solid var(--accent); border-radius: 0; }
      .big-statement { font-family: var(--heading-font); font-weight: 800; }
      .compare-card.negative { border-top: 4px solid var(--accent); }
      .compare-card.positive { border-top: 4px solid var(--fg); }
      ${responsiveTypography(1)}`,
    promptGuidance: `Visual style: Swiss Modern — clean, precise, Bauhaus-inspired. Pure white background, pure black text, red (#ff3300) accent only. Headings use Archivo (800 weight), body uses Nunito. Visible grid, asymmetric layouts, geometric shapes. No rounded corners anywhere — all sharp edges. Minimal decoration. Tone: professional, structured, confident. Use accent sparingly on key data points.`
  },

  'paper-ink': {
    name: 'Paper & Ink',
    category: 'light',
    description: 'Editorial, literary with drop caps and elegant rules',
    fontImports: '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">',
    cssVariables: {
      bg: '#faf9f7',
      fg: '#1a1a1a',
      accent: '#c41e3a',
      muted: '#666666',
      cardBg: '#f0ede8',
      headingFont: "'Cormorant Garamond', 'Georgia', serif",
      bodyFont: "'Source Serif 4', 'Georgia', serif"
    },
    extraCSS: `
      .slide h1 { font-weight: 700; letter-spacing: 0.02em; font-style: italic; }
      .slide h2 { font-weight: 700; }
      .slide p { font-family: var(--body-font); }
      .accent { color: var(--accent); }
      .stat-number { font-family: var(--heading-font); font-weight: 700; color: var(--accent); }
      .feature-card { background: transparent; border-top: 1px solid var(--accent); border-radius: 0; padding-top: 20px; }
      .compare-card { border-radius: 0; }
      .flow-step { border: 1px solid var(--fg); border-radius: 0; background: transparent; }
      .quote { font-family: var(--heading-font); font-style: italic; }
      .quote-mark { color: var(--accent); }
      .big-statement { font-family: var(--heading-font); font-style: italic; }
      .big-statement::first-letter { font-size: 1.8em; color: var(--accent); float: left; margin-right: 4px; line-height: 1; }
      .timeline-date { background: var(--fg); border-radius: 0; color: #fff; }
      .stack-layer { border-left: 3px solid var(--accent); border-radius: 0; }
      ${responsiveTypography(1.03)}`,
    promptGuidance: `Visual style: Paper & Ink — editorial, literary, thoughtful. Warm cream (#faf9f7) background with charcoal (#1a1a1a) text and crimson (#c41e3a) accent. Headings use Cormorant Garamond (italic h1), body uses Source Serif 4 (both serifs). Drop caps on big statements. Pull quotes. Elegant horizontal rules. Tone: thoughtful, academic, warm. No rounded corners — literary precision.`
  }
};

function getPreset(key) {
  if (PRESETS[key]) return PRESETS[key];
  // Backward compat: theme names
  if (key === 'dark') return PRESETS['bold-signal'];
  if (key === 'light') return PRESETS['swiss-modern'];
  return PRESETS['bold-signal'];
}

function getPresetList() {
  return Object.entries(PRESETS).map(([key, p]) => ({
    key,
    name: p.name,
    category: p.category,
    description: p.description
  }));
}

module.exports = { PRESETS, getPreset, getPresetList };
