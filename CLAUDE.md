# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Crossroads: India 1790–1947** — a collection of browser-based interactive history games for SOCI 274. Each game places students in an "impossible choice" scenario from Indian colonial/independence history. Six games span 1790–1947; three are live, three are in concept/design phase.

## Tech Stack

Pure static site: vanilla HTML5, CSS3, and ES6 JavaScript. No build system, no package.json, no bundler, no framework. Serve any game by opening its `index.html` directly in a browser or hosting on GitHub Pages.

## Development

**Running locally:** Open any game's `index.html` in a browser. No server required.

**Testing:** Manual playthrough is the only validation method. Play through a full run, checking stat updates, win/loss triggers, and narrative flow.

**Deploying:** Push static files. The hub page is `index.html` at the repo root.

## Repository Structure

```
index.html                      # Hub page — timeline linking to all games
last-maharaja/                  # Game 1 (1790-1857) — LIVE
  script.js                     #   All game logic + event definitions in one file
bengal1905/                     # Game 2 (1905-1908) — LIVE
  static/content.js             #   Story graph, scene definitions, stat effects
  static/index.html             #   Entry point (note: inside static/)
redaction-desk/                 # Game 3 (1919) — LIVE
  game.js                       #   Game engine, state management
  content.js                    #   Dispatch data, phrases, glossary
salt-march-logistics/idea.md    # Game 4 (1930) — CONCEPT ONLY
the-pact/idea.md                # Game 5 (1932) — CONCEPT ONLY
two-flags/idea.md               # Game 6 (1937-1946) — CONCEPT ONLY
more-ideas.md                   # Additional game concepts (4 more ideas)
```

Each game folder contains an `idea.md` design document describing historical context, mechanics, win/loss conditions, and aesthetic direction. Read `idea.md` before building or modifying a game.

## Architecture Patterns

**Game state** is a plain JS object held in memory (resets on page reload, no persistence):
```js
let state = { treasury: 50, britishFavor: 50, loyalty: 50, year: 1790, ... };
```

**Content is separated from engine.** Narrative text, events, and scenario graphs live in dedicated content files (`content.js`), while game loop and DOM manipulation live in engine files (`game.js` / `script.js`). When adding events or narrative, edit content files; when changing mechanics, edit engine files.

**Screen management** uses show/hide on DOM sections (no routing library).

**Event/scenario structures** differ per game:
- **Last Maharaja:** Binary left/right choices on event cards with stat effects `{ treasury: -15, britishFavor: 25, loyalty: -10 }`
- **Bengal 1905:** Branching scenario graph with `options[]` arrays, each option having effects, flags, and a `next` scene ID
- **Redaction Desk:** Dispatches with `{curly-brace}` marked phrases in body text; each phrase has risk/truth impact values

**Stat systems** are the core mechanic. Every game tracks 2-4 numeric stats (0–100) with color-coded severity and trend arrows. A stat hitting a threshold triggers game over. Design choices so they create tension between stats (raising one lowers another).

## Design Principles

- **Impossible choices:** Almost every decision should raise one stat while lowering another. The point is that colonial-era constraints were structural, not personal failings.
- **No "good" ending:** Compromises carry hidden costs. Epilogues reveal long-term consequences.
- **Each game has a distinct visual identity:** Mughal court elegance (Last Maharaja), colonial bureaucracy parchment (Bengal 1905), walnut desk / typewriter newsprint (Redaction Desk). Match the aesthetic described in `idea.md`.
- **Fonts via Google Fonts:** Cinzel + Lato (hub, Last Maharaja), Crimson Pro + Playfair Display (Bengal 1905), Courier Prime + Playfair Display (Redaction Desk).
- **Educational integration:** Glossary tooltips for historical terms, advisor framing for multiple perspectives, historical notes on events.
