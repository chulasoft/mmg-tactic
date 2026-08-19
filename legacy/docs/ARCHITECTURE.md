# ARCHITECTURE — How the system fits together

> Reading order: [`../CONTEXT.md`](../CONTEXT.md) → [`SKILL.md`](SKILL.md) →
> **this file** → [`STYLE_GUIDE.md`](STYLE_GUIDE.md) → [`FEATURE.md`](FEATURE.md)
> → [`DATABASE.md`](DATABASE.md) → [`TODO.md`](TODO.md).
> Read this before changing structure, the build, or state flow.

---

## 1. Runtime model

There is no framework runtime and no bundler. The page boots like this:

```
index.html
  ├─ inline <style>   boot screen (gold shimmer bar)
  ├─ <script> CDN     react@18.3.1 UMD           → window.React
  ├─ <script> CDN     react-dom@18.3.1 UMD        → window.ReactDOM
  ├─ <script> app.js  the compiled game bundle
  └─ <script> poller  hides the boot screen once #root has children
```

`index.html` also installs a global `error` handler and `window.__bootFail(msg)`
so a CDN/network failure shows a friendly message instead of a blank screen.

`app.js` ends with a mount stub that calls
`ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App))`.

**Two target runtimes, one source:**

| Runtime | Consumes | React comes from | Icons | Portraits |
|---|---|---|---|---|
| Deployed site | `app.js` | UMD globals | inlined SVG (`icons.js`) | relative `asset-tactic/` |
| Claude artifact | `.jsx` directly | ESM `import ... from "react"` | `lucide-react` import | absolute CDN URL |

---

## 2. Directory layout

```
index.html            boot + script loading
app.js                GENERATED — do not edit
src/
  magic-maidens-tactic.jsx   source of truth (CSS, DATA, ENGINE, STATE, SCREENS, App)
  icons.js                   inline SVG components matching the lucide-react names used
  build.js                   Babel transform: strip imports, inline icons, rewrite asset base
docs/                        this documentation set
asset-tactic/         hero portraits, referenced by the GH base
asset-sound/          audio stems — not referenced by any code yet
.nojekyll             disable Jekyll on GitHub Pages
```

---

## 3. The build (`src/build.js`)

`app.js` is produced by a single Babel pass over the source. The script:

1. Reads `src/magic-maidens-tactic.jsx`.
2. **Strips** the `import ... from "react"` and `import { ... } from
   "lucide-react"` lines (globals/inlined icons replace them).
3. Rewrites `export default function App()` → `function App()`.
4. **Rewrites the portrait base** `const GH = '<absolute CDN>'` →
   `const GH = 'asset-tactic/'` so the deployed site uses the bundled images.
5. Prepends a preamble that destructures the React hooks from the `React` global
   and inlines `src/icons.js`.
6. Appends the mount stub.
7. Transforms with `@babel/preset-react` (classic runtime) +
   `@babel/preset-env` (esmodules target) and writes `app.js`.

```bash
npm install --no-save @babel/core @babel/preset-react @babel/preset-env
node src/build.js       # ✅ app.js built — ~130KB
```

Because the transform is deterministic, the only diff between rebuilds should be
the code you actually changed. Commit the `.jsx` and the regenerated `app.js`
together.

---

## 4. State architecture

All game state is a **single reducer** (`useReducer(reducer, INIT)`) held at the
`App` root and threaded to every screen as `{state, dispatch}` props. There is no
context, no Redux, no external store.

```
App (useReducer)
 └─ renderScreen()  ← plain switch on state.screen (NOT useMemo)
     ├─ TitleScreen
     ├─ NarratorScreen
     ├─ BattleScreen
     ├─ KnowledgeScreen
     └─ AdminScreen
```

`state.screen` is the router. `dispatch({type:'GO', to:'battle'})` navigates.

### Reducer actions (current)

| Action | Effect |
|---|---|
| `GO` | change `screen` (records `prevScreen`) |
| `SELECT_PARTY_HERO` | toggle a hero in `party` (max 4) |
| `START_GAME` | build hero + enemy units from a scenario, enter battle |
| `SELECT_HERO` | pick the active hero (player phase only) |
| `SELECT_CARD` | play a card → `applyCard`, recompute move/attack range, heal floater |
| `MOVE_HERO` | move active hero, recompute ranges |
| `ATTACK` | resolve damage, push damage floater + hit flash, log |
| `END_HERO_TURN` | mark hero done; if all done → build `enemyQueue`, start enemy phase |
| `ENEMY_STEP` | apply one queued enemy action (move + optional attack) |
| `END_ENEMY_PHASE` | reset heroes for the next round, clear flags |
| `CLEAR_BANNER` / `CLEAR_CARD_FLOURISH` / `REMOVE_FLOATER` | tear down transient FX |
| `SET_LEVEL` | admin: set a hero's `partyLevels` override |
| `SET_GOD` | admin: toggle god mode |
| `SET_KB_TAB` / `SET_KB_HERO` | Knowledge Base navigation |
| `SET_NARRATOR` | set narrator slide index |
| `ADMIN_MSG` | transient admin toast |
| `RESET` | restore `INIT` |

Full `state` shape and unit shapes are in [`DATABASE.md`](DATABASE.md).

---

## 5. Battle data flow

A battle is a **grid of tiles + an absolute-positioned token overlay**. Tokens are
not rendered inside tile cells; they live in an overlay layer positioned by
`left:x*TILE; top:y*TILE` with CSS transitions — this makes movement glide and
keeps hit-shake/z-index clean (`TILE = 38`).

Per-turn player loop:

```
SELECT_HERO → SELECT_CARD (required before acting) → MOVE_HERO and/or ATTACK
            → END_HERO_TURN
```

When every hero is `done`, `END_HERO_TURN` precomputes the **entire enemy phase**
as an ordered `enemyQueue` and flips `phaseAnimating` on. A `useEffect` in
`BattleScreen` replays the queue one entry at a time with timed `ENEMY_STEP`
dispatches (staggered), so the enemy phase plays out visibly instead of resolving
in a single synchronous tick. `END_ENEMY_PHASE` then resets heroes for the next
round.

Transient feedback (`floaters`, `hitFlash`, `playingCard`, `banner`) lives in
state and is torn down by timed follow-up dispatches (`REMOVE_FLOATER`,
`CLEAR_BANNER`, `CLEAR_CARD_FLOURISH`). All animations have a
`prefers-reduced-motion` branch in the `CSS` string.

### Engine functions (pure, in the ENGINE section)

- `heroStats(hero, level)` / `calcStat(base, rate, lv)` — level-scaled stats.
- `getHeroCards(heroId, level)` — the unlocked card pool at a level.
- `applyCard(unit, card)` — apply a card's `fx[]` (buff / heal / DR / extra action).
- `bfsMove(unit, all, w, h, walls)` — reachable tiles via BFS within `mvLeft`.
- `getAttackRange(unit, targets)` — Manhattan-range targets.
- `enemyAI(enemy, heroes, all, w, h, walls)` — pick nearest hero, path toward it,
  attack if in range.

---

## 6. Deployment

Static hosting, **no build command**. Publish directory is the repo root.

- **GitHub Pages:** `main` branch, `/ (root)`. `.nojekyll` keeps files served
  as-is. Live at `https://chulasoft.github.io/mmg-tactic/`.
- **Netlify / Vercel / Cloudflare Pages:** no build command, publish `/`.

`app.js` is committed so the site works with zero pipeline. The only reason to run
Node is to regenerate `app.js` after editing the source.

Next: [`STYLE_GUIDE.md`](STYLE_GUIDE.md).
