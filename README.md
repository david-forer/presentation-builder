# Presentation Builder

Presentation Builder turns notes into a finished slide deck. Paste notes, a transcript or an outline, pick how many slides you want and a visual style, and Claude writes the slides and the speaker notes. You get one self-contained HTML file that opens in any browser.

## What it does

- Takes up to 50,000 characters of notes
- Builds 3, 5, 7, 10, 12 or 15 slides
- 12 visual styles, including Bold Signal, Swiss Modern, Terminal Green and Paper & Ink
- Writes speaker notes for every slide
- Saves every deck and lists past decks so you can open them again

## The output

Each deck is a single HTML file with its CSS and JavaScript inline:

- Opens with a double-click, no server needed
- Arrow keys move between slides
- Shows the slide number in the corner
- F goes full screen

## How it works

The app is a small Express server with an optional Electron window. When you click Generate, the server combines your notes, the style's prompt guidance and a slide outline into one request to Claude (`claude-opus-5-5`, set in `server.js`). Claude returns the slides as HTML sections. The server drops them into `templates/presentation.html` with the style's fonts and colors, saves the file and shows it in the preview.

## Setup

You need Node 18 or newer and an Anthropic API key.

```bash
npm install
cp .env.example .env
```

Open `.env` and set `ANTHROPIC_API_KEY`. Decks save to `output/` next to `server.js`. Set `OUTPUT_DIR` in `.env` to save them somewhere else.

## Run it

| Command | What it does |
|---|---|
| `npm start` | Runs the server. Open http://localhost:3000 |
| `npm run electron` | Opens the desktop window |
| `npm run build` | Builds a Windows app in `dist/win-unpacked` |

The desktop build starts `server.js` with your installed Node, so Node has to be on the machine. `npm run build` copies your `.env` into the build folder, so do not share a build.

## Project layout

```
server.js              Express server and the Claude request
presets.js             The 12 styles: fonts, colors, CSS and prompt guidance
templates/             The HTML deck template
public/                The app's own interface
electron-main.js       Desktop wrapper
build.js               Windows build script
PLAN.md, SPEC.txt      Goals and constraints
```

## Credits

The style presets in `presets.js` come from the `STYLE_PRESETS.md` file in the `frontend-slides` project, credited in the file header. Everything else is my own work (David Forer).

## License

MIT. See LICENSE.
