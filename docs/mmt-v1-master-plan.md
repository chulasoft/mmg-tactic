# Magic Maidens Tactic — V1 Master Design & Implementation Plan

> **Handoff document.** Written for an AI implementer (Claude Opus) continuing work on an existing React JSX artifact.
> **Read this entire document before writing any code.**

---

## 0. Project Context

### 0.1 What this is
A **single-file React JSX artifact** (runs in Claude Chat artifact viewer, also deployable to GitHub Pages / Vercel later). A tactical, turn-based, story-driven RPG inspired by **Gloomhaven's ritual pacing** — original IP called *Magic Maidens* by the user (solo creator, communicates in Thai, code/content in English).

### 0.2 Current file
`magic-maidens-tactic.jsx` (~84KB). Working. Do **not** rewrite from scratch — extend and refactor incrementally. The file currently contains:

- `CSS` string constant (custom properties + keyframes + utility classes)
- Data: `HEROES` (8), `CARDS` (88 = 11/hero), `MONSTERS` (5), `SCENARIOS` (2), `NARR` (story slides)
- Engine utils: `heroStats`, `applyCard`, `bfsMove`, `getAttackRange`, `enemyAI`
- `useReducer` global state (`INIT` + `reducer`)
- `useTypewriter` hook (line-by-line, cursor drifts right)
- Screens: `TitleScreen`, `NarratorScreen` (multi-type: whisper/narr/party/chapter), `BattleScreen`, `KnowledgeScreen`, `AdminScreen`
- `App` root with `renderScreen()` switch (NO useMemo — that caused a stale-state bug, keep it as a plain function call)

### 0.3 Hard constraints
- **Single .jsx file**, default export `App`. No external CSS files.
- **React rules of hooks**: ALL hooks at top of component, before ANY conditional return. (This bug — hooks inside `if` blocks — crashed the artifact once already with React error #310. Never repeat.)
- **No raw newlines inside single-quoted JS strings.** Story text uses `\n` escapes. (This crashed the artifact once with "Invalid or unexpected token". Never repeat.)
- **No localStorage / sessionStorage** (blocked in artifact sandbox). Save = file download; Load = file upload.
- Allowed imports: `react`, `lucide-react` (already in use), `framer-motion` (available — currently unused, MAY adopt for game-feel work), `recharts` (available if needed).
- Images load from `https://chulasoft.github.io/magic-maidens-tactic/asset-tactic/01elena.png` … `08mei.png`. Every `<img>` needs `onError` fallback (hide or emoji).
- Portrait crop: `object-fit: cover; object-position: 20% 10%` — faces sit left-of-center in the artwork. Keep this everywhere.

### 0.4 Design language (already established — do not change)
- **Fonts:** `Fraunces` (italic, display/story/numbers) + `Outfit` (UI/labels/body). Google Fonts import already in CSS string.
- **Palette:** bg `#070612`, panel `#131130`, gold accent `#fbbf24`, teal `#2dd4bf` (player), red `#f87171` (enemy), purple `#8b5cf6` (dev/admin). One accent per semantic role — locked.
- **Tone:** dark cinematic fantasy, modern (NOT medieval/ornate). Story text = Fraunces italic, left-aligned, novel-style, line-by-line typewriter.
- **Radius scale:** cards/panels 10–12px, chips 6–7px, tokens/avatars full circle. Locked.

### 0.5 Lore (secret — for the implementer's understanding only, NEVER revealed in Chapter 1 content)
The protagonist ("you", never named, gender never stated) is the **Supreme Leader** who led eight chosen heroes against a Demon Lord in the future. The Demon Lord wields **reality-manipulation** magic; completing its incantation would let it rewrite past/memory/present/future. The only counter cost a number of souls: **four companions sacrificed themselves** to break the spell — temporarily. The backlash rewound time. Only the protagonist retains memories, but fragmented: the Supreme Leader consciousness hasn't fully awakened in this past body.

**Chapter 1 reveals almost nothing.** The protagonist knows only: *"my team had eight people, not counting me — I can almost see their faces, almost recall their names."* Faces blur at the edges; names sit behind the teeth. The FOUR heroes the player does NOT pick at party select = the four who sacrificed themselves (this is why the table only has four people — elegant mechanical/story unity; never state it explicitly).

Story unfolds across **~4 chapters**, each revealing one more piece AND teaching one new game system.

---

## 1. Current State Audit

### Working ✅
| Feature | Notes |
|---|---|
| Line-by-line typewriter narrator | `useTypewriter` — cursor drifts right, click to skip, click again to advance |
| Multi-type narrator slides | `whisper` (black screen), `narr` (typewriter), `party` (selection interlude with intro), `chapter` (title card) |
| Party select mid-story | 8 portrait cards (2:5 ratio), pick 4, stats strip, tutorial hint bar |
| Battle grid | 14×10, walls, zone tints, BFS movement, Manhattan attack range |
| Card/ATP system | Play 1 card/turn → stat buffs / heal / DR / extra ATP |
| Enemy AI | Move toward nearest hero, attack if in range |
| Win/Lose overlay | Basic modal |
| Knowledge Base | Heroes tab (portrait grid → detail 2-col), Monsters tab, Mechanics tab |
| Admin panel | Quick navigate, jump-to-battle, hero level selector (1–30), god mode, state inspector, reset |

### Missing ❌ (this plan's scope)
| Gap | Severity |
|---|---|
| Damage numbers / hit feedback | 🔴 Critical — combat feels dead |
| Phase transition banners | 🔴 Critical — no ritual |
| Battle intro sequence (map/unit spawn ceremony) | 🔴 High |
| Mid-battle event system | 🔴 High — core of "storytelling during levels" |
| Post-battle story + EXP/rewards | 🔴 High — no narrative closure, no progression |
| Guided tutorial (Chapter 1) | 🟡 High |
| Pre-battle deck select | 🟡 Medium |
| Save/Load via CSV file | 🟡 Medium |
| Framer Motion adoption | 🟢 As-needed per feature |

---

## 2. PHASE 1 — Game Feel Layer (build first)

**Goal:** every combat interaction produces visible, satisfying feedback. This phase transforms testing pleasure immediately and everything later builds on it.

### 2.1 Floating damage numbers
- New state slice: `floaters: [{id, x, y, text, color, kind}]` in reducer (or a lightweight local state inside BattleScreen with a custom event bus — reducer is cleaner, keep it there).
- On `ATTACK` resolve: push `{text:'-'+dmg, color:'#fff', kind:'dmg'}` at target tile. On heal (card fx H): `{text:'+'+n, color:'#4ade80', kind:'heal'}`. On big hit (dmg ≥ 5): gold `#fbbf24` + slightly larger.
- Render layer: absolutely-positioned div over the board grid (`pointer-events:none`), each floater positioned by `tile * TILE_SIZE`, animating `translateY(-26px)` + fade over **900ms**, then auto-removed (setTimeout dispatch `REMOVE_FLOATER` or filter by timestamp).
- Typography: **Fraunces italic bold**, `font-variant-numeric: tabular-nums`, size `.85rem` normal / `1.05rem` big-hit.
- CSS keyframe:
```css
@keyframes floatUp {
  0%   { opacity:0; transform:translateY(4px) scale(.7); }
  15%  { opacity:1; transform:translateY(0)   scale(1.1); }
  30%  { transform:translateY(-4px) scale(1); }
  100% { opacity:0; transform:translateY(-26px); }
}
```

### 2.2 Hit flash + shake
- When a unit takes damage add a transient class/state `hit:true` for 220ms.
- Token CSS: flash `filter: brightness(2.2)` first 80ms + shake keyframe:
```css
@keyframes hitShake {
  0%,100% { transform:translateX(0); }
  25% { transform:translateX(-2px); }
  75% { transform:translateX(2px); }
}
```
- Implementation: store `lastHitId + lastHitAt` in state; token compares and applies class if `Date.now() - lastHitAt < 250`. Or simpler: a `hitFlash` Set of unit ids cleared by timeout dispatch.

### 2.3 Death dissolve
- Dead unit is NOT removed instantly. Add `dying:true` for 400ms, then filter out.
- CSS: `transition: opacity .4s, transform .4s; opacity:0; transform:scale(.55) rotate(8deg)`.
- Sequence on kill: hit flash (80ms) → damage number rises → dissolve begins at 150ms.

### 2.4 Card play flourish
- When player clicks a card: card element clone (or an overlay copy) scales up to center-screen (~1.4×) with a gold glow, holds **500ms**, then shrinks toward the hero token and fades. Meanwhile the buff applies.
- Simple implementation: state `playingCard: {card, heroId} | null`; overlay component renders it with CSS animation; timeout clears after 800ms. Board input is NOT locked (snappy players can continue).
- CSS:
```css
@keyframes cardFlourish {
  0%   { transform:translate(-50%,-50%) scale(.6); opacity:0; }
  20%  { transform:translate(-50%,-50%) scale(1.15); opacity:1; }
  70%  { transform:translate(-50%,-50%) scale(1.05); opacity:1; }
  100% { transform:translate(-50%,-50%) scale(.4) translateY(60px); opacity:0; }
}
```
- Overlay shows: card name (Fraunces italic, gold if ULT), effect text, thin gold border, `box-shadow: 0 0 60px rgba(251,191,36,.25)`.

### 2.5 Smooth movement
- Hero move: instead of teleporting to the clicked tile, animate. Cheapest robust approach: tokens rendered in an **absolute-positioned overlay layer** above the grid (not inside tile cells), positioned by `left: x*TILE; top: y*TILE` with `transition: left .28s ease, top .28s ease`. Grid cells keep click handlers; tokens are the visual layer.
- This refactor also fixes z-index/overflow issues and makes hit-shake cleaner. **Recommended: do this refactor as part of Phase 1.**

### 2.6 Phase transition banner
- On phase change (player→enemy, enemy→player/new round): full-width banner sweeps across mid-screen:
  - "ENEMY PHASE" — red tint, `◆` prefix
  - "ROUND 02 — PLAYER PHASE" — teal tint
- 1100ms total: slide in from left (250ms), hold (600ms), slide out right (250ms). Board input locked during banner (`phaseAnimating` flag in state).
- Typography: Outfit, 800 weight, letterspacing .3em, uppercase, size ~1.1rem; thin horizontal rules extending both sides.
- Enemy actions should be **sequenced**, not instant: after banner, each enemy acts with ~450ms stagger (move animates via 2.5's transition, then attack feedback plays). Implement with an async action queue: reducer stores pending enemy actions; a `useEffect` in BattleScreen plays them one-by-one with timeouts, dispatching per-enemy results. (This is the biggest engineering item of Phase 1 — currently the whole enemy phase resolves synchronously in one reducer case. Split it: `BEGIN_ENEMY_PHASE` computes the action list → component replays → `ENEMY_ACTION_STEP` applies each → `END_ENEMY_PHASE` resets for next round.)

### 2.7 Acceptance criteria (Phase 1)
- [ ] Attacking shows damage number + hit flash + shake on target
- [ ] Kills dissolve over ~400ms, never pop out of existence
- [ ] Card play shows center-screen flourish without blocking input
- [ ] Heroes glide between tiles (280ms), enemies too
- [ ] Phase changes announce with a sweep banner; enemy turns play out visibly one enemy at a time
- [ ] All animations respect `prefers-reduced-motion` (wrap in media query or JS check — provide instant fallbacks)
- [ ] No hooks-in-conditionals; no raw newlines in strings; file still loads in artifact viewer

---

## 3. PHASE 2 — Battle Intro Sequence

**Goal:** entering a chapter is a *moment* — Gloomhaven's "setting up the board" ritual, digitized.

### 3.1 Sequence (total ~4.5s, skippable by click → jump to end state)
1. **Chapter card already exists** (NarratorScreen `chapter` type) → on tap, transition to battle
2. **Map reveal** (~1.2s): tiles fade in as a diagonal wave from top-left (`animation-delay: (x+y) * 28ms`, each tile `tilePop` scale .7→1 + fade). Walls pop slightly later with a heavier settle.
3. **Hero spawn** (~1.6s): heroes appear one-by-one (350ms apart): token scales in with a teal ring pulse + small name-plate ("ELENA") appears above for 700ms then fades.
4. **Enemy spawn** (~1.2s): enemies **warp in** — this matches the lore (monsters "simply arrive"). Effect: a vertical light-slit expands into the token (scaleX 0→1 with bright flash), red shimmer ring. Stagger 250ms.
5. **Objective banner** (~1s): "DEFEAT ALL ENEMIES" sweeps like the phase banner, gold tint.
6. **Round 1 banner** → control unlocked.

### 3.2 Implementation notes
- State: `introStage: 'map'|'heroes'|'enemies'|'objective'|'done'` progressed by chained timeouts in a `useEffect` (cancel on unmount / on skip-click).
- Any click during intro → `introStage:'done'` instantly, all units visible.
- Reuse the token-overlay layer from 2.5 — spawn animations are per-token CSS classes keyed by stage + index.

### 3.3 Acceptance criteria
- [ ] Fresh battle plays full intro; any click skips cleanly to playable state
- [ ] Enemy warp-in visually distinct from hero spawn (lore-consistent)
- [ ] Retry/admin-jump also plays intro (or a 50%-speed short version — implementer's choice, document it)

---

## 4. PHASE 3 — Event System, Post-Battle, Progression

### 4.1 Battle event system (core of mid-level storytelling)
Add `events: []` to each scenario. Schema:
```js
events: [
  {
    id: 'c1_e1',
    trigger: { type:'roundStart', value:2 },          // fires at start of round 2
    action:  { type:'narrator',
               lines:['The fire spreads.','More of them are coming.'] },
    once: true,
  },
  {
    id: 'c1_e2',
    trigger: { type:'enemiesRemaining', value:1 },
    action:  { type:'spawn', warp:true,
               units:[{type:'goblin', x:12, y:2}, {type:'rat', x:12, y:8}] },
    once: true,
  },
  {
    id: 'c1_e3',
    trigger: { type:'heroHpBelowPct', value:35 },      // any hero drops below 35%
    action:  { type:'dialogue', speakerHeroId:'auto',  // auto = the hurt hero
               text:'I\'m fine. Keep pushing.' },
    once: true,
  },
]
```
- **Trigger types (v1):** `roundStart`, `enemiesRemaining`, `heroHpBelowPct`, `enemyDefeated` (by monster type), `turnCount`.
- **Action types (v1):**
  - `narrator` — dim board, show 1–3 typewriter lines in a compact lower-third panel (reuse `useTypewriter`), click to advance/dismiss. Board locked while open.
  - `spawn` — warp-in animation from 3.1 step 4, log line "Something arrives."
  - `dialogue` — small speech bubble anchored above the speaker's token (portrait chip + text), auto-dismiss 3s or on click.
- Engine: after every state-changing battle action, run `checkEvents(state)`; matched + un-consumed events queue into `pendingEvents`; BattleScreen plays them sequentially (same async queue infra as enemy phase). Mark consumed ids in `firedEvents: []`.
- Ship Chapter 1 with **at least the three example events above** wired and working.

### 4.2 Post-battle sequence (victory)
Replace the current instant win-modal with a staged flow:
1. **Last-kill beat:** on the killing blow, freeze board input, play kill feedback at 0.5× speed feel (just add 400ms extra delay before next step — no real slow-mo engine needed).
2. **Victory banner** (gold sweep, "VICTORY").
3. **EXP tally screen** (new full overlay):
   - Each surviving hero row: portrait, name, EXP bar animating fill, "+12 EXP" count-up (number rolls over ~800ms/hero, staggered).
   - Level-up moment: bar fills → burst flash → "LEVEL 5 → 6" with stat deltas listed (`HP +2  ATK +1`) in colored chips.
   - Card unlock ceremony: if the new level crosses a card's `lv` threshold, show the card back-flip reveal (rotateY 180°, gold glow if ULT): "NEW CARD — Forceful Strike".
4. **Post-battle narrator:** 2–4 typewriter slides continuing the story (per-scenario `outro: []` lines — write Chapter 1's outro: the fires die down; the villagers stare at the party; the protagonist looks at the space where the monsters appeared and feels — for half a second — that they've *stood in this exact moment before*; cut).
5. **Save prompt panel:** "Record your progress" → Save (CSV download, see 6.2) / Continue without saving.
6. Return to Title (Chapter 2 unlocked) — or straight into Chapter 2's narrator if the player chooses "Continue".

**Defeat flow:** dark banner ("DEFEAT"), one short narrator line (fatalistic, hints the whisper: *"…once more…"*), Retry / Return-to-title. No EXP.

### 4.3 EXP & leveling model
- `progress` slice in state: `{ heroExp: {heroId: totalExp}, chaptersCleared: ['c1'], }`
- EXP award: `+10` per surviving hero per chapter (bonus objectives later).
- Level from EXP: simple curve `level = 1 + floor(exp / 10)` capped 30 (tune later; keep the function isolated: `expToLevel(exp)`).
- `heroStats(h, lv)` already exists — party units at battle start must use computed level from `heroExp` (fall back to admin's `partyLevels` override if set — admin override wins for testing).

### 4.4 Acceptance criteria
- [ ] Chapter 1 fires: round-2 narrator event, reinforcement warp-in at 1 enemy left, low-HP dialogue
- [ ] Victory → banner → EXP tally with count-up → level-up + card unlock ceremony when thresholds crossed → outro narrator → save prompt
- [ ] Defeat → banner → short line → retry works
- [ ] EXP persists in state across chapters within a session

---

## 5. PHASE 4 — Guided Tutorial (Chapter 1)

**Goal:** hand-holding, semi-forced, spotlight-driven. The player cannot click the wrong thing.

### 5.1 Structure — three stages inside the Chapter 1 battle
1. **Layout tour** (after battle intro, before round 1): 4 steps — spotlight each zone (party panel, board, card hand, top bar) with a popup explaining it. "Next" button advances. Board locked.
2. **Object tour:** 3 steps — heroes (teal ring), enemies (red border), walls; plus move/attack tile-highlight explanation.
3. **Guided actions** (semi-forced): 5 steps. Each step:
   - Popup states the exact task ("Click Elena on the board")
   - **Spotlight** = box-shadow punch-through overlay (`box-shadow: 0 0 0 4000px rgba(0,0,0,.72)`) positioned over the allowed element via `getBoundingClientRect`
   - A click-blocker div covers everything EXCEPT the allowed target (raise target's z-index above blocker)
   - "Next" is disabled with a pulsing "waiting…" state until the game action actually fires
   - Steps: Select hero → Play a card → Move → Attack → End Turn
   - Wire via a `Tutorial.done(eventName)` style notification: reducer cases for SELECT_HERO / SELECT_CARD / MOVE_HERO / ATTACK / END_HERO_TURN set `lastAction: name`; tutorial component watches it.
4. Completion popup: "Card → Move → Attack → End Turn. The rest is instinct." (lore flavor: her body remembers) → tutorial dismissed, normal play.

### 5.2 Story integration
Frame the tutorial as **muscle memory**: popup copy in the guided stage can carry flavor, e.g. *"Your hand moves before the thought completes."* Tutorial = the protagonist's body remembering what the mind forgot. Keep copy terse.

### 5.3 Rules
- Tutorial state lives in reducer (`tutorial: {active, phase, step, waiting}`) so admin can toggle/skip.
- "Skip Tutorial" always visible (small ghost button).
- Only triggers when `scenario.tut === true` AND `chaptersCleared` is empty.
- ALL hooks in the tutorial component at top level (see §0.3).

### 5.4 Acceptance criteria
- [ ] Cannot click anything outside the spotlighted target during guided steps
- [ ] Next unlocks only after the real action fires
- [ ] Skip works at any point; tutorial never re-triggers after c1 clear

---

## 6. PHASE 5 — Deck Select & Save/Load

### 6.1 Pre-battle deck select (Chapter 2+)
- New screen between narrator and battle: for each party hero, choose **exactly 5 cards** from their unlocked pool (Chapter 1 auto-equips all lv-1 cards and skips this screen).
- Layout: hero tabs across top (portrait chips) → card grid for active hero → selected cards shown as a mini-fan at bottom. Counter "3/5". Confirm disabled until every hero has 5.
- Unlocked pool = `getHeroCards(heroId, level)` from current EXP-level.
- Selected decks stored in state `missionDecks: {heroId: [cardIds]}`; battle uses these instead of the full pool.
- ULT cards get gold treatment in the picker; picking 5 normals is legal (no forced composition).

### 6.2 Save / Load (CSV file, no localStorage)
- **Save** = generate CSV text → trigger download (`Blob` + `URL.createObjectURL` + programmatic `<a download>` click). Filename `magic-maidens-save.csv`.
- CSV format (line-oriented, simple):
```
section,key,value
meta,version,1
meta,savedAt,<ISO date>
progress,chaptersCleared,c1
exp,elena,20
exp,yumi,20
party,member,elena
party,member,yumi
...
checksum,sha,<hex>
```
- **Checksum:** SHA-256 of the payload rows + salt `magicmaidens` via `crypto.subtle.digest`. On load, recompute and reject mismatch with a friendly error toast.
- **Load** = hidden `<input type="file">`, parse, validate checksum + version, hydrate `progress`, `heroExp`, `party`. Title screen gains a "Load Game" button (file picker) and shows "Continue — Chapter N" if a session already has progress.
- Save prompts appear ONLY at post-battle (see 4.2) and on the Title screen (manual save if progress exists).

### 6.3 Acceptance criteria
- [ ] c2+ shows deck select; battle hands contain exactly the chosen 5
- [ ] Save downloads a CSV; Load restores progress; tampered file rejected
- [ ] c1 skips deck select entirely

---

## 7. UI/UX Refinements (apply during relevant phases)

1. **Card hand as bottom fan (during Phase 1 refactor or Phase 5):** move the selected hero's cards from the right sidebar into a bottom-center horizontal fan (slight rotation per card, overlap, rise on hover `translateY(-14px)`). The right sidebar keeps hero stats + log. Cards are the fantasy — make them the hero of the layout. Mobile: fan becomes horizontal scroll strip.
2. **Threat range on hover:** hovering an enemy token tints its movement+attack reach in faint red (`rgba(248,113,113,.08)`) — Fire Emblem-style tactical reading. Compute with the same BFS.
3. **Selected-hero reachable hint:** after card play, before pressing anything, faintly show move range (existing behavior) — keep, but add a subtle pulse on the outer edge tiles.
4. **HP bars over tokens:** thin 3px bar directly above each token on the board (not only sidebar), color-shifting green→amber→red. Show only when damaged (hp < mhp) to reduce noise.
5. **Log polish:** newest entry slides in (translateX 8px→0, 150ms); color-code by kind (attack red-ish, heal green, system dim).
6. **Focus/keyboard affordances:** Escape closes overlays; Enter advances narrator. Cheap wins.
7. **Reduced motion:** global check — `window.matchMedia('(prefers-reduced-motion: reduce)')` → a `reducedMotion` boolean in context/state; every animation path branches to instant.
8. **Do NOT add:** marquees, parallax, purple glows, glassmorphism panels. The established language is matte dark + gold. Keep it.

---

## 8. Data & Content To Author (Chapter 1 complete package)

The implementer must WRITE this content (English, tone-matched to existing NARR — restrained, second person, present tense, line-broken for the typewriter):

1. **c1 `events`** — the 3 events in §4.1 (write the narrator lines / dialogue text).
2. **c1 `outro`** — 3–4 post-battle narrator slides (see beat sketch in §4.2 step 4).
3. **Defeat line** — 1 slide.
4. **Tutorial copy** — all popup texts for §5.1 (terse; sprinkle 2–3 muscle-memory flavor lines).
5. **Objective banner text** per scenario (`'DEFEAT ALL ENEMIES'` for c1/c2).

Rules for story content:
- Protagonist = "you". Never named. Never gendered. Never reveals lore beyond Chapter-1 knowledge (§0.5).
- The number eight is mentioned at most once more if at all — it's already established. Don't hammer it.
- All strings single-quoted with `\n` escapes, `\u2014` for em-dash, `\u2019` etc. for curly quotes. NO raw newlines.

---

## 9. Engineering Order & Definition of Done

```
Phase 1  Game Feel        ← start here
  1a. Token overlay layer refactor (absolute-positioned tokens, transitions)
  1b. Damage floaters + hit flash + death dissolve
  1c. Card flourish
  1d. Phase banners + async enemy-turn queue
Phase 2  Battle intro sequence
Phase 3  Events + post-battle + EXP  (largest phase; sub-split if needed:
         3a events, 3b victory flow, 3c EXP/levels/unlocks)
Phase 4  Tutorial
Phase 5  Deck select + Save/Load
UI/UX    items fold into their host phases (fan-hand → 1 or 5; threat-hover → 1; HP-over-token → 1)
```

**Global Definition of Done (every phase):**
- Artifact loads with zero console errors in Claude Chat viewer
- No hooks after conditional returns anywhere
- No raw newlines inside JS string literals
- Every `<img>` has `onError` fallback
- Reduced-motion branch exists for new animations
- Admin panel updated if new state needs inspection/jumping (e.g., "Jump to EXP screen", "Fire event X" buttons are welcome)
- File size target: stay under ~160KB; if content pushes past it, propose splitting data (e.g., trimming KB bios) before splitting the file

**Testing路径 (manual):** Title → New Campaign → whisper → narr slides (typewriter + skip both work) → party intro → pick 4 → remaining slides → chapter card → battle intro → tutorial (c1) → play with all feedback visible → trigger all 3 events → win → EXP/unlock → outro → save → load from Title → c2 deck select → battle.

---

## 10. Out of Scope (V1) — do not build yet
- Side stories per hero, Field/farm mode (planned V1.x)
- Sound/music
- Multiple save slots
- Localization (Thai UI)
- Chapter 3–4 content (structure must support them; content later)
- Mobile-first layout overhaul (keep it usable at ≥1024px; graceful at 768px)

---

*End of plan. Questions the implementer may decide autonomously: exact easing curves, stagger timings ±30%, internal naming. Questions that need the creator: any new story beats beyond §8, any change to lore, any new hero/card data.*
