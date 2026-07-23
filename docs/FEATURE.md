# FEATURE — Status & code mapping

> Reading order: [`../CONTEXT.md`](../CONTEXT.md) → [`SKILL.md`](SKILL.md) →
> [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`STYLE_GUIDE.md`](STYLE_GUIDE.md) →
> **this file** → [`DATABASE.md`](DATABASE.md) → [`TODO.md`](TODO.md).
> Read this to know what is done, stubbed, or locked, and where it lives.

Line numbers are approximate anchors in `src/magic-maidens-tactic.jsx`; search by
symbol name if they have drifted. The full design intent for each phase is in
[`mmt-v1-master-plan.md`](mmt-v1-master-plan.md).

---

## Legend

- ✅ **Shipped** — working in the current build.
- 🟡 **Stub / partial** — present but incomplete or placeholder.
- ⬜ **Not started** — planned, no code yet.
- 🔒 **Locked** — intentionally fixed; change only with the creator's sign-off.

---

## Shipped ✅

| Feature | Where | Notes |
|---|---|---|
| Screen router | `App` / `renderScreen()` | plain switch on `state.screen` (not memoized) |
| Title screen | `TitleScreen` | floating hero backdrop, New Campaign / Knowledge / Admin |
| Typewriter narrator | `useTypewriter`, `NarratorScreen` | line-by-line, click to skip, click to advance |
| Multi-type slides | `NARR`, `NarratorScreen` | `whisper` / `narr` / `party` / `chapter` |
| Party select (pick 4 of 8) | `NarratorScreen` party slide, `SELECT_PARTY_HERO` | portrait cards, stats strip |
| Battle grid | `BattleScreen` | 14×10, walls, zone tints, `TILE=38` |
| Token overlay movement | `.board-token` layer | absolute-positioned tokens glide between tiles |
| BFS movement | `bfsMove`, `MOVE_HERO` | reachable tiles within `mvLeft` |
| Manhattan attack range | `getAttackRange`, `ATTACK` | |
| Card / action system | `CARDS`, `applyCard`, `SELECT_CARD` | 1 card/turn → buff / heal / DR / extra action |
| Enemy AI | `enemyAI` | move toward nearest hero, strike if in range |
| Sequenced enemy phase | `enemyQueue`, `ENEMY_STEP`, `phaseAnimating` | plays out one enemy at a time via timed replay |
| Damage floaters | `floaters`, `.floater`, `REMOVE_FLOATER` | rising tabular-nums numbers |
| Hit flash + shake | `hitFlash`, `.board-token.flashing` | |
| Death dissolve | `.board-token.dying` | fades/scales out instead of popping |
| Card-play flourish | `playingCard`, `.card-flourish` | center-screen card reveal |
| Phase banners | `banner`, `.phase-banner`, `CLEAR_BANNER` | sweep on phase change |
| Pure engine module + tests | `src/core/engine.mjs`, `tests/engine.test.mjs` | run `node --test`; build inlines it |
| EXP & progression (persistent slice) | `state.progress`, `awardChapter`, `expToLevel` | +10 EXP/survivor/chapter; battle level derived from EXP (admin override wins) |
| Save/Load seam (functions only) | `serializeProgress` / `hydrateProgress` | boundary ready; no UI/CSV yet (Phase 5) |
| Chapter 1 complete loop | `PostBattle`, `SCENARIOS[0].outro/defeat` | victory → EXP tally → outro narration → Title; defeat → line → Retry |
| Battle intro ceremony | `state.introStage`, `SET_INTRO`, intro effect in `BattleScreen` | map reveal wave → hero spawn (name plates) → enemy warp-in → objective + round-1 banners; click-to-skip; reduced-motion jumps to playable |
| Knowledge Base | `KnowledgeScreen` | Heroes / Monsters / Mechanics tabs |
| Admin / dev tools | `AdminScreen` | quick-nav, jump-to-battle, per-hero level select, god mode, live state inspector, reset |
| Reduced-motion support | `CSS` media queries | floaters, tokens, flourish, banners |
| Graceful image fallback | `onError` on every `<img>` | |
| Local portrait loading | `GH` base + `build.js` rewrite | site uses bundled `asset-tactic/` images |

This is **Phase 1 (Game Feel) complete** per the master plan.

---

## Stub / partial 🟡

| Feature | Where | Gap |
|---|---|---|
| Victory ceremony | `PostBattle` | EXP tally + outro shipped, but no animated bar fill / card-unlock reveal / save prompt yet (Phase 3/5) |
| Mid-battle events | `SCENARIOS[].events` | schema field exists (empty); evaluator + runner not built (Phase 3) |
| Second chapter | `SCENARIOS[1]` (`c2`) | board/enemies + empty `outro` defined; no deck-select, events, or narrative yet |

---

## Not started ⬜ (planned)

Grouped by master-plan phase. Details and acceptance criteria live in the plan;
prioritised order is in [`TODO.md`](TODO.md).

| Phase | Feature | Notes |
|---|---|---|
| 3 | Mid-battle event system | `events[]` per scenario (`roundStart`, `enemiesRemaining`, `heroHpBelowPct`, …). Not present. |
| 3 | Post-battle victory flow | banner → EXP tally count-up → level-up → card-unlock ceremony → outro narrator → save prompt. |
| 3 | EXP & leveling / progression | `heroExp`, `expToLevel`, `chaptersCleared`. Not present; battles use `partyLevels` admin override or Lv 1. |
| 4 | Guided tutorial (Chapter 1) | spotlight + semi-forced steps. Not present. |
| 5 | Pre-battle deck select | choose 5 cards/hero for c2+. Not present. |
| 5 | Save / Load via CSV file | Blob download + file-upload restore + checksum. Not present. |
| — | Audio | `asset-sound/` stems exist (`00Intro`, `00`, `00Victory`, `01`, `02`) but **no audio code**. Out of scope in V1 plan; assets are staged for later. |
| — | UI/UX refinements | bottom card-fan hand, threat-range on hover, HP bars over tokens, log slide-in, keyboard affordances. |

---

## Locked 🔒 (do not change without creator sign-off)

- **The eight heroes** and their identity/stat/growth design (`HEROES`).
- **The design language** — palette, fonts, radius, matte-dark-plus-gold tone
  (see [`STYLE_GUIDE.md`](STYLE_GUIDE.md)).
- **Chapter-1 lore boundary** — Chapter 1 reveals almost nothing; the deeper lore
  stays hidden (master plan §0.5).
- **The hard engineering rules** (single file, hooks-before-returns, no raw
  newlines, no `localStorage`, img `onError`, portrait crop).

Next: [`DATABASE.md`](DATABASE.md).
