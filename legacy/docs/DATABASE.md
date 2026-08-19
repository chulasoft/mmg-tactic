# DATABASE — Data shapes

> Reading order: [`../CONTEXT.md`](../CONTEXT.md) → [`SKILL.md`](SKILL.md) →
> [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`STYLE_GUIDE.md`](STYLE_GUIDE.md) →
> [`FEATURE.md`](FEATURE.md) → **this file** → [`TODO.md`](TODO.md).
> Read this before touching the data layer.

There is **no database** and (per the hard rules) **no `localStorage`**. "Data"
here means: the static content tables in the source, the in-memory reducer state,
the on-disk assets, and the *planned* CSV save format. All shapes below come from
`src/magic-maidens-tactic.jsx`.

Keys are deliberately terse. Legend for the common shorthand:

| Key | Meaning | Key | Meaning |
|---|---|---|---|
| `id` | stable id | `n` | display name |
| `hp` | hit points | `at` | attack |
| `mv` | movement | `rg` | attack range |
| `cl` | accent color | `ic` | emoji icon |
| `img` | portrait URL | `r` | role label |
| `t` | archetype tag | `bi` | biography |
| `pl` | play-style tip | `growth` | per-10-level growth rates |
| `mhp` | max HP (unit) | `dr` | damage reduction |
| `fx` | card effects | `lv` | unlock level |
| `tp` | card type `N`/`U` | `d` | card description |

---

## 1. Static content tables

### `HEROES` — 8 entries

```js
{
  id:'elena', n:'Elena', r:'Mage Fighter', t:'Balanced',
  cl:'#2dd4bf', ic:'⚔', img:`${GH}01elena.png`,
  hp:25, at:4, mv:3, rg:1,
  growth:{ hp:5, at:4, mv:.33, rg:0 },   // added per 10 levels
  bi:'…background…',
  pl:'…how to play this hero…'
}
```

The eight ids (party order / portrait order): `elena, yumi, lilith, aria, freya,
nia, seraphina, mei`. Portraits map to `01elena.png … 08mei.png`.

### `CARDS` — object keyed by hero id, 11 cards each (88 total)

```js
CARDS.elena = [
  { id:'MF_N01', lv:1, tp:'N', n:'Runic Strike', d:'+2 ATK this turn',
    fx:[ {t:'B', s:'at', v:2} ] },
  …
]
```

- `id` — `<HEROPREFIX>_<N|U><NN>` (e.g. `MF_N01`, `MF_U11`). `N` = normal,
  `U` = ultimate.
- `lv` — the hero level at which the card unlocks (`getHeroCards` filters
  `c.lv <= level`).
- `tp` — `'N'` normal or `'U'` ultimate (ULT gets gold treatment in the UI).
- `fx[]` — effect list, applied by `applyCard`:

| `t` | Meaning | Fields |
|---|---|---|
| `B` | stat **buff** this turn | `s:'at'|'mv'|'rg'`, `v:number` |
| `H` | **heal** HP | `v:number` (`v:999` = full heal) |
| `D` | gain **damage reduction** | `v:number` |
| `X` | **extra action** | `s:'at'|'mv'`, `v:number` |

### `MONSTERS` — 5 entries

```js
{ id:'goblin', n:'Goblin Scout', hp:8, at:2, mv:4, rg:1,
  cl:'#86efac', ic:'👺', desc:'…bestiary text…' }
```

Ids: `goblin, demon, rat, mage, brute`.

### `SCENARIOS` — 2 entries

```js
{
  id:'c1', title:'Chapter I — The Burning Hour',
  story:[],                       // reserved (empty today) — see FEATURE.md
  objective:'DEFEAT ALL ENEMIES', // gold intro banner text
  events:[],                      // mid-battle triggers (Phase 3) — schema below
  outro:[ 'line one\nline two', … ],  // post-victory narration slides (typewriter)
  defeat:'…\n…',                  // shown on the defeat overlay
  win:'Defeat all 4 enemies.', lose:'All heroes are defeated.',
  w:14, h:10,                     // grid size
  walls:[ [x,y], … ],             // impassable tiles
  heroStarts:[ {x,y}, … ],        // up to 4 spawn points
  enemies:[ {x, y, type:'goblin'}, … ]   // type → MONSTERS id
}
```

`outro` / `defeat` drive the `PostBattle` flow; `objective` is the intro
ceremony's gold banner. `events` is an empty schema field today — when the event
system (Phase 3) lands it fills with trigger/action objects per master plan §4.1.

### `NARR` — story slides (title-to-battle flow)

```js
{ type:'whisper', tag:'', txt:'“… you must return once more …”' }
{ type:'narr',    tag:'', txt:'line one\n\nline two…' }   // \n only, never raw newlines
{ type:'party',   tag:'Your Companions' }                 // party-select interlude
{ type:'chapter', tag:'', chapterNum:'I', chapterTitle:'…', sub:'…' }
```

`type` drives how `NarratorScreen` renders the slide.

---

## 2. Runtime state (the reducer)

`INIT` is the whole shape; `RESET` returns to it.

```js
{
  screen:'title', prevScreen:null,          // router
  party:[], partyLevels:{},                 // hero ids picked; admin level overrides
  progress:{ heroExp:{}, chaptersCleared:[] },  // persistent slice (save/load seam)
  scenario:null, heroes:[], enemies:[],     // active battle
  selectedHeroId:null, selectedCard:null,
  moveRange:[], atkRange:[],                 // highlighted tiles
  phase:'player', round:1, log:[], result:null,
  introStage:'done',   // battle-intro ceremony: map→heroes→enemies→objective→done
  postBattle:null,     // {award:[...], outroLines:[...]} transient victory data
  godMode:false,
  narratorSlide:0,
  kbTab:'heroes', kbHero:null,              // Knowledge Base nav
  adminMsg:'',
  // transient battle FX
  floaters:[],        // [{id,x,y,text,color,big}]
  hitFlash:{},        // {unitId: timestamp}
  playingCard:null,   // {card, heroCl} — center-screen flourish
  banner:null,        // {text, tone}
  enemyQueue:[],      // precomputed enemy actions to replay
  phaseAnimating:false // input lock during banners / enemy phase
}
```

### Unit shapes (built by `START_GAME`)

**Hero unit** (from `HEROES` + level via `heroStats`):

```js
{ id, n, cl, ic, img,
  hp, at, mv, rg, mhp, dr:0,
  cardPlayed:null, atkLeft:1, mvLeft, done:false,
  x, y, cards:[…unlocked cards…] }
```

**Enemy unit** (from `MONSTERS`):

```js
{ …monster fields…, id:'e0', x, y, mhp, hp, atkLeft:1, mvLeft }
```

`log` is a capped array (newest first, sliced to ~20).

---

## 3. Assets on disk

| Path | Contents | Wired? |
|---|---|---|
| `asset-tactic/01elena.png … 08mei.png` | hero portraits, referenced via `GH` base | ✅ yes |
| `asset-sound/00Intro.mp3` | intro theme | ⬜ not referenced by code |
| `asset-sound/00.mp3` | (stem) | ⬜ |
| `asset-sound/00Victory.mp3` | victory theme | ⬜ |
| `asset-sound/01.mp3`, `02.mp3` | battle stems | ⬜ |

Audio is staged for a future phase — no `Audio`/playback code exists yet
(see [`FEATURE.md`](FEATURE.md) and [`TODO.md`](TODO.md)).

---

## 4. Planned save format (not yet implemented)

Persistence must be **file-based** (no web storage). The master plan (§6.2)
specifies a line-oriented CSV with a checksum:

```
section,key,value
meta,version,1
meta,savedAt,<ISO date>
progress,chaptersCleared,c1
exp,elena,20
party,member,elena
…
checksum,sha,<hex>          # SHA-256 of payload rows + salt, via crypto.subtle
```

Save = `Blob` + `URL.createObjectURL` + programmatic `<a download>`. Load = hidden
`<input type="file">`, parse, verify checksum + version, then hydrate `progress`,
`heroExp`, and `party`. Tampered/mismatched files are rejected with a toast.

Next: [`TODO.md`](TODO.md).
