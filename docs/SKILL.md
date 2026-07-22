---
name: magic-maidens-tactic
description: >-
  Work on Magic Maidens Tactic — a single-file React (useReducer) tactical,
  turn-based RPG that runs in the browser and inside the Claude artifact viewer.
  Use when editing game logic, data (heroes/cards/monsters/scenarios), story
  narration, battle feel, or the build. Enforces the project's hard rules:
  edit src/magic-maidens-tactic.jsx (never app.js), all hooks before conditional
  returns, no raw newlines in single-quoted strings, no localStorage, img
  onError fallbacks, and a locked design language.
---

# Skill: Magic Maidens Tactic

> **Prerequisite:** read [`../CONTEXT.md`](../CONTEXT.md) first. This file is the
> detailed map. When you finish here, continue to
> [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`STYLE_GUIDE.md`](STYLE_GUIDE.md) →
> [`FEATURE.md`](FEATURE.md) → [`DATABASE.md`](DATABASE.md) → [`TODO.md`](TODO.md).

This document doubles as a portable skill. Copy this folder's `SKILL.md` into
`.claude/skills/magic-maidens-tactic/SKILL.md` to have it auto-load as a skill.

---

## What you are working on

A tactical RPG in **one React file**. React 18 is a UMD global from a CDN — there
is no bundler and no runtime `node_modules`. The source targets two runtimes at
once:

- **The deployed static site** (GitHub Pages / Netlify / Vercel) via the compiled
  `app.js`.
- **The Claude artifact viewer** via the raw `.jsx` (ESM imports of `react` +
  `lucide-react`).

`src/build.js` bridges the two: it strips the ESM imports, inlines the SVG icon
set, supplies React globals, and rewrites the absolute portrait CDN URL to a
relative `asset-tactic/` path for the site build.

---

## The map — where things live in `src/magic-maidens-tactic.jsx`

The file is ~1700 lines, organized top to bottom in labelled banner sections:

| Section | What it holds |
|---|---|
| `import` lines | `react` + `lucide-react` (stripped for the site build) |
| `CSS` | one template-string constant: custom properties, keyframes, utility classes |
| **DATA** | `GH` (portrait base URL), `HEROES` (8), `CARDS` (88 = 11/hero), `MONSTERS` (5), `SCENARIOS` (2), `NARR` (story slides) |
| **ENGINE** | `getHeroCards`, `calcStat`, `heroStats`, `applyCard`, `bfsMove`, `getAttackRange`, `enemyAI` |
| **STATE** | `INIT` object + `reducer(state, action)` — the single source of game state |
| helpers | `useTypewriter` hook, `Btn`, `Panel` presentational components |
| **SCREENS** | `TitleScreen`, `NarratorScreen`, `BattleScreen`, `KnowledgeScreen`, `AdminScreen` |
| **APP ROOT** | `App` — `useReducer(reducer, INIT)` + `renderScreen()` switch |

`renderScreen()` is a **plain function call, not `useMemo`** — memoizing it caused
a stale-state bug. Keep it a plain call.

Full data shapes are in [`DATABASE.md`](DATABASE.md); the reducer action list and
data flow are in [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## Hard rules (repeated on purpose — these are load-bearing)

1. **Edit `src/magic-maidens-tactic.jsx` only. Never hand-edit `app.js`** — it is
   generated. Rebuild with `node src/build.js`.
2. **One file, `export default function App()`.** No new logic files, no external
   CSS.
3. **All hooks at the top of a component, before any conditional `return`.**
   (Crashed with React #310 once.)
4. **No raw newlines in single-quoted strings.** Use `\n`, `—`, `’`.
   (Crashed with "Invalid or unexpected token" once.)
5. **No `localStorage` / `sessionStorage`.** Save = file download; load = file
   upload.
6. **Every `<img>` has an `onError` fallback**; portrait crop stays
   `object-position:20% 10%`.
7. **Design language is locked** — palette, fonts, radius, tone. See
   [`STYLE_GUIDE.md`](STYLE_GUIDE.md). One accent per semantic role:
   `--teal` player, `--red` enemy, `--gold` accent/ULT, `--purple` dev/admin,
   `--green` heal.
8. **Extend, don't rewrite.**

---

## Standard workflow

1. Read `CONTEXT.md` (done) and the relevant deeper doc for your task.
2. Make the change in `src/magic-maidens-tactic.jsx`.
3. If the change adds inspectable state, add an Admin panel hook for it.
4. **Rebuild:** `node src/build.js` (install babel once — see below).
5. **Verify:** serve with `python3 -m http.server 8000`, open it, confirm zero
   console errors and that the Title → battle path works.
6. Commit **both** the `.jsx` and the regenerated `app.js`.

```bash
npm install --no-save @babel/core @babel/preset-react @babel/preset-env
node src/build.js
```

## Global definition of done (every change)

- `node src/build.js` succeeds; site loads with zero console errors.
- No hooks after a conditional return anywhere.
- No raw newlines inside JS string literals.
- Every new `<img>` has an `onError` fallback.
- New animations branch on `prefers-reduced-motion`.
- New state is inspectable/reachable from the Admin panel.
- Bundle stays under ~160 KB; if content pushes past, propose trimming data
  before splitting the file.

---

## Content authoring rules (story / narration)

- Protagonist is always **"you"** — never named, never gendered.
- Never reveal lore beyond Chapter-1 knowledge (the secret lore is for the
  implementer only; see the master plan §0.5).
- All strings single-quoted with `\n` escapes; em-dash `—`, curly quote
  `’`. No raw newlines.
- Match the existing `NARR` tone: restrained, second person, present tense,
  line-broken for the typewriter.

---

## Decisions you can make alone vs. must escalate

- **Autonomous:** easing curves, stagger timings (±30%), internal naming,
  refactors that preserve behavior.
- **Escalate to the creator (Soft):** new story beats, any lore change, new
  hero/card/monster data, anything that changes the locked design language.

Next: [`ARCHITECTURE.md`](ARCHITECTURE.md).
