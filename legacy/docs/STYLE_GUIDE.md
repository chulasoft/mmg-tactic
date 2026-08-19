# STYLE GUIDE — Coding conventions

> Reading order: [`../CONTEXT.md`](../CONTEXT.md) → [`SKILL.md`](SKILL.md) →
> [`ARCHITECTURE.md`](ARCHITECTURE.md) → **this file** → [`FEATURE.md`](FEATURE.md)
> → [`DATABASE.md`](DATABASE.md) → [`TODO.md`](TODO.md).
> Read this before writing code.

These conventions are specific to this repo. When in doubt, match the surrounding
code — it is consistent, and consistency beats personal preference here.

---

## 1. File & module rules

- **Everything game-related goes in `src/magic-maidens-tactic.jsx`.** No new
  logic files. `src/icons.js` holds only inline SVG icon components;
  `src/build.js` holds only the build.
- The file is organized top-to-bottom in banner-comment sections
  (`STYLES → DATA → ENGINE → STATE → helpers → SCREENS → APP ROOT`). Add new code
  inside the section it belongs to; keep the ordering.
- **Never hand-edit `app.js`.** It is generated.

---

## 2. React conventions

- **Function components only.** Props are destructured in the signature:
  `function BattleScreen({state, dispatch}) { ... }`.
- **All hooks at the very top, before any conditional `return`.** This is a hard
  rule (React #310). No `useState`/`useEffect`/`useMemo`/`useRef` inside `if`,
  loops, or after an early return.
- **`renderScreen()` stays a plain function call, not `useMemo`.** Memoizing it
  reintroduces a stale-state bug.
- State changes go through `dispatch(action)` only. Do not mutate `state`;
  the reducer spreads a fresh object (`const s = {...state}`) and returns new
  arrays/objects for anything it touches.
- Side effects that drive timed animation (enemy-step replay, floater/banner
  teardown) live in `useEffect` with cleanup that clears the timers.

---

## 3. String & content conventions

- **No raw newlines inside single-quoted strings.** Multi-line story text uses
  `\n`. This is enforced by pain — a raw newline crashed the app.
- Use unicode escapes for typography in JS strings: em-dash `—`, curly
  apostrophe `’`, curly quotes `“ ”`, star `✶`, check `✓`, arrow
  `→`.
- **Never put a `\uXXXX` escape in a JSX *text node*.** JSX text is not a JS
  string literal — an escape there renders **literally** on screen (you see the
  characters `✶`, not `✶`). In JSX text, write the actual glyph
  (`✶ A Tactical RPG ✶`) or wrap it in an expression (`{'✶'}`). Escapes are
  only for real JS strings — array/`log` entries, template literals, and ternary
  results inside `{}`. Quick check: `grep -n '\\u[0-9A-Fa-f]\{4\}'` and confirm
  every hit sits inside quotes/backticks, never as bare tag content.
- Story voice: protagonist is **"you"**, never named, never gendered; present
  tense, second person, restrained. Match existing `NARR` entries.

---

## 4. Styling conventions

All CSS lives in the `CSS` template-string constant and is injected via
`<style>{CSS}</style>`. Two styling channels:

1. **Utility classes** in `CSS` for anything reused (`.btn`, `.panel`, `.token`,
   `.tile`, `.floater`, `.chip`, `.narrator-txt`, keyframes, etc.).
2. **Inline `style={{...}}`** for one-off, component-local layout.

### Locked design tokens (CSS custom properties)

```
--bg #070612   --bg2 #0d0b22   --panel #131130   --panel2 #1b1945
--teal #2dd4bf  --gold #fbbf24  --purple #8b5cf6  --red #f87171  --green #4ade80
--txt #e2e0f5   --txt2 #94a3b8  --txt3 #64748b
--border rgba(255,255,255,.07)  --b2 rgba(255,255,255,.14)
```

**One accent per semantic role — do not reassign:**

| Color | Meaning |
|---|---|
| `--teal` | player / heroes / movement |
| `--red` | enemy / attack / danger |
| `--gold` | primary accent, ULT cards, victory |
| `--purple` | dev / admin surface |
| `--green` | healing / positive deltas |

### Typography

- **Fraunces** (serif) — display, headings, story text (italic), and all numbers
  (`font-variant-numeric: tabular-nums`). Classes: `.heading`, `.heading-italic`,
  `.display-num`, `.narrator-txt`.
- **Outfit** (sans) — UI, labels, body. Class: `.label-xs` for uppercase micro
  labels.
- Both fonts are imported at the top of the `CSS` string. Do not add new fonts.

### Radius & shape (locked)

- Cards / panels: `10–12px`. Chips: `6–7px`. Tokens / avatars: full circle.
- Tone: **matte dark + gold**, modern cinematic — *not* medieval/ornate.
- **Do not add:** glassmorphism panels, parallax, marquees, or purple glows
  outside the dev/admin surface.

---

## 5. Assets & images

- Portraits are referenced through the `GH` base constant (`${GH}01elena.png`).
  Keep filenames zero-padded and lowercase (`01elena.png` … `08mei.png`).
- **Every `<img>` needs an `onError` handler** that hides it (or shows the hero
  emoji `ic`): `onError={e => e.target.style.display='none'}`.
- Portrait crop is `object-fit:cover; object-position:20% 10%` everywhere — faces
  sit left-of-center in the source art. Do not change the crop.

---

## 6. Animation

- Every animation defined in `CSS` must have a `prefers-reduced-motion: reduce`
  fallback (instant or near-instant). There are already media-query blocks for
  floaters, tokens, card flourish, and banners — extend them.
- Timed teardown of FX is done by dispatching a follow-up action from a
  `setTimeout` inside `useEffect`, never by mutating state directly.

---

## 7. Naming

- Data objects use terse, established keys (`n` name, `hp/at/mv/rg` stats,
  `cl` color, `ic` icon, `img`, `bi` bio, `pl` play-tip, `fx` effects). Follow the
  existing shorthand rather than inventing verbose names — see
  [`DATABASE.md`](DATABASE.md) for the full key legend.
- Reducer action types are `SCREAMING_SNAKE_CASE` verbs (`SELECT_CARD`,
  `END_HERO_TURN`).
- Component names are `PascalCase` and screens end in `Screen`.

Next: [`FEATURE.md`](FEATURE.md).
