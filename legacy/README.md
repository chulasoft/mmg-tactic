# Magic Maidens Tactic

A tactical, turn-based, story-driven RPG.
**Eight warriors. One truth. No mercy.**

> You wake at a tavern table with one certainty and no explanation for it:
> your team had eight people, not counting you.
> Four are sitting with you. The rest are faces you can almost see.

> **New here? Read [`CONTEXT.md`](CONTEXT.md) first.** It is the mandatory
> starting point for every contributor and AI agent — what the project is,
> the hard rules, and where to read next. Do not touch code before reading it.

---

## Play

**▶ [Play in your browser](https://chulasoft.github.io/mmg-tactic/)**

No install, no build step. Open `index.html` and it runs.

---

## What's in the game

| System | Description |
|---|---|
| **Story mode** | Line-by-line typewriter narration, novel-style. Click to skip typing, click again to advance. |
| **Party selection** | Choose 4 companions from 8 heroes — mid-story, as part of the narrative. |
| **Tactical combat** | 14×10 grid, BFS pathfinding movement, Manhattan attack range, terrain walls. |
| **Ability cards** | 88 cards (11 per hero). Play one per turn for stat buffs, healing, damage reduction, or extra actions. |
| **Enemy AI** | Enemies path toward the nearest hero and strike when in range — played out one unit at a time. |
| **Knowledge Base** | Full hero profiles with card lists, monster bestiary, and mechanics reference. |
| **Dev tools** | Screen jumping, battle skipping, hero level editor (1–30), god mode, live state inspector. |

### Heroes

Elena · Yumi · Lilith · Aria · Freya · Nia · Seraphina · Mei

Each has distinct stats (HP / ATK / MOV / RNG), a growth curve, a background, and a card pool that unlocks with level.

---

## Controls

- **Click a hero** (board or party panel) to select them
- **Play a card** — required before acting each turn
- **Click a teal tile** to move · **click a red-highlighted enemy** to attack
- **End Turn** passes to the next hero; when all have acted, the enemy phase plays out

---

## Project structure

```
.
├── CONTEXT.md      ★ Mandatory first read — project brief + hard rules
├── index.html      Entry point — boot screen, CDN React, mounts the game
├── app.js          Compiled bundle (generated — do not edit by hand)
├── src/
│   ├── magic-maidens-tactic.jsx   Source of truth
│   ├── icons.js                   Inline SVG icon set (replaces lucide-react)
│   └── build.js                   Compiles src → app.js
├── docs/
│   ├── SKILL.md                   Detailed map + hard rules (skill format)
│   ├── ARCHITECTURE.md            How the system fits together
│   ├── STYLE_GUIDE.md             Coding conventions
│   ├── FEATURE.md                 Feature status + code mapping
│   ├── DATABASE.md                Data shapes (state / assets / save)
│   ├── TODO.md                    Prioritised backlog
│   └── mmt-v1-master-plan.md      Full design & implementation roadmap
├── asset-tactic/   Hero portraits (01elena.png … 08mei.png)
├── asset-sound/    Music / SFX stems (not yet wired — see docs/TODO.md)
└── .nojekyll       Tells GitHub Pages to serve files as-is
```

**Editing the game:** change `src/magic-maidens-tactic.jsx`, then rebuild:

```bash
npm install --no-save @babel/core @babel/preset-react @babel/preset-env
node src/build.js
```

`app.js` is committed so the site works without a build pipeline.

---

## Deploy to GitHub Pages

1. Create a repository and push these files to the `main` branch
2. **Settings → Pages → Source:** `Deploy from a branch`
3. **Branch:** `main`, **Folder:** `/ (root)` → Save
4. Wait ~1 minute, then open `https://YOUR-USERNAME.github.io/REPO-NAME/`

Also deploys as-is to Netlify, Vercel, or Cloudflare Pages — no build command, publish directory `/`.

### Running locally

Because the browser blocks `file://` module loading in some setups, serve over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Tech

- React 18 (UMD from CDN — no bundler, no `node_modules` at runtime)
- Single-file architecture with `useReducer` for all game state
- Inline SVG icons, zero runtime dependencies
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) + [Outfit](https://fonts.google.com/specimen/Outfit) (UI)

Hero artwork ships in [`asset-tactic/`](asset-tactic/) and loads by relative path; every `<img>` degrades gracefully (hides) if a portrait is missing. The `.jsx` source keeps an absolute CDN URL so it also runs inside the Claude artifact viewer — `src/build.js` rewrites that to the relative path for the deployed bundle.

Music and SFX stems live in [`asset-sound/`](asset-sound/) but are **not wired into the game yet** — see [`docs/TODO.md`](docs/TODO.md).

---

## Roadmap

Full plan in [`docs/mmt-v1-master-plan.md`](docs/mmt-v1-master-plan.md); live feature status in [`docs/FEATURE.md`](docs/FEATURE.md); prioritised backlog in [`docs/TODO.md`](docs/TODO.md). Current status:

- [x] **Phase 1 — Game feel:** damage numbers, hit flash, death dissolve, card flourish, animated movement, phase banners, sequenced enemy turns
- [ ] **Phase 2 — Battle intro:** map reveal wave, hero spawn ceremony, enemy warp-in
- [ ] **Phase 3 — Events & progression:** mid-battle story triggers, post-battle narration, EXP and card unlocks
- [ ] **Phase 4 — Guided tutorial**
- [ ] **Phase 5 — Deck building & save/load**

---

## Credits

Original IP, story, and design by **Soft**.
