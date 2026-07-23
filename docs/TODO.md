# TODO — Prioritised backlog

> Reading order: [`../CONTEXT.md`](../CONTEXT.md) → [`SKILL.md`](SKILL.md) →
> [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`STYLE_GUIDE.md`](STYLE_GUIDE.md) →
> [`FEATURE.md`](FEATURE.md) → [`DATABASE.md`](DATABASE.md) → **this file**.
> Read this when picking up the next task.

Priority order follows the master plan's engineering sequence
([`mmt-v1-master-plan.md`](mmt-v1-master-plan.md) §9). Do the phases in order —
later phases build on earlier ones. Every task inherits the **global definition of
done** in [`SKILL.md`](SKILL.md): rebuild succeeds, zero console errors, hooks
before returns, no raw newlines, `<img>` fallbacks, reduced-motion branch,
inspectable from Admin.

Status keys: **P0** = do next, **P1** = high, **P2** = medium, **P3** = later.

---

## P0 — Phase 2: Battle intro sequence

Entering a chapter should feel like a moment. See plan §3, and
[`FEATURE.md`](FEATURE.md) → Not started.

- [ ] Add `introStage:'map'|'heroes'|'enemies'|'objective'|'done'` to state,
      progressed by chained timeouts in a `BattleScreen` `useEffect`.
- [ ] Map reveal — tiles fade in as a diagonal wave (`animation-delay:(x+y)*28ms`).
- [ ] Hero spawn — tokens scale in one-by-one with a teal ring + name plate.
- [ ] Enemy warp-in — visually distinct (light-slit expand + red shimmer),
      lore-consistent ("they simply arrive").
- [ ] Objective banner + Round 1 banner, then unlock control.
- [ ] Any click skips cleanly to `done`. Admin jump replays intro (full or ½-speed;
      document the choice).

Reuse the existing token-overlay layer and banner infra
([`ARCHITECTURE.md`](ARCHITECTURE.md) §5).

---

## P1 — Phase 3: Events, post-battle, progression

The largest phase; sub-split it. See plan §4. Also authors Chapter-1 content
(plan §8) — follow the content rules in [`STYLE_GUIDE.md`](STYLE_GUIDE.md).

**3a — Mid-battle event system**
- [ ] `events:[]` per scenario with triggers `roundStart`, `enemiesRemaining`,
      `heroHpBelowPct`, `enemyDefeated`, `turnCount`.
- [ ] Actions `narrator`, `spawn` (reuse warp-in), `dialogue` (speech bubble).
- [ ] `checkEvents(state)` after every state-changing battle action; queue matches
      into `pendingEvents`; replay sequentially; mark `firedEvents`.
- [ ] Ship Chapter 1 with the three example events wired.

**3b — Post-battle victory flow** — ✅ base loop shipped
- [x] Replaced the instant win modal → `PostBattle`: EXP tally → outro narration →
      Title (`SCENARIOS[0].outro`).
- [x] Defeat flow: fatalistic line (`SCENARIOS[].defeat`) → Retry.
- [ ] Still TODO: victory banner sweep, animated EXP-bar/count-up, card-unlock
      reveal, save prompt (folds into Phase 5).

**3c — EXP & leveling** — ✅ core shipped
- [x] `progress` slice: `heroExp:{}`, `chaptersCleared:[]` (in `INIT`).
- [x] `expToLevel(exp)` isolated in `core/engine.mjs`; `+10`/survivor via
      `awardChapter`; covered by `tests/engine.test.mjs`.
- [x] Battle start derives level from `heroExp`; admin `partyLevels` override wins.
- [ ] Full persistent/transient nesting (`progress/ui/battle/fx`) — light seam is
      in place (`state.progress` + `serialize/hydrateProgress`); nest fully later.

---

## P2 — Phase 4: Guided tutorial (Chapter 1)

Spotlight-driven, semi-forced. See plan §5.
- [ ] `tutorial:{active,phase,step,waiting}` in state (admin-toggleable).
- [ ] Layout tour → object tour → 5 guided actions (Select → Card → Move → Attack
      → End Turn), each gated on the real action firing (`lastAction`).
- [ ] Spotlight via box-shadow punch-through; click-blocker except the target.
- [ ] Only when `scenario.tut === true` and `chaptersCleared` is empty; never
      re-triggers after c1 clear. "Skip Tutorial" always visible.

---

## P2 — Phase 5: Deck select & save/load

See plan §6.
- [ ] Pre-battle deck select for c2+ (choose exactly 5 cards/hero; c1 auto-equips).
- [ ] `missionDecks:{heroId:[cardIds]}`; battle uses these hands.
- [ ] CSV save (Blob download) + load (file input) + SHA-256 checksum + version
      guard. Schema in [`DATABASE.md`](DATABASE.md) §4. Reject tampered files.
- [ ] Title screen gains "Load Game" and "Continue — Chapter N".

---

## P3 — UI/UX refinements (fold into their host phase)

See plan §7.
- [ ] Card hand as a bottom-center fan (rotate/overlap, rise on hover).
- [ ] Threat range on enemy hover (faint red BFS reach).
- [ ] HP bars over damaged tokens on the board.
- [ ] Log entries slide in + color-code by kind.
- [ ] Keyboard: Esc closes overlays, Enter advances narrator.

---

## P3 — Audio

Assets are staged in `asset-sound/` but nothing plays them
([`DATABASE.md`](DATABASE.md) §3). Out of scope in the V1 plan (§10) — schedule
only after the phases above.
- [ ] Decide a lightweight audio manager (single `Audio` per track, mute toggle in
      Admin, respect an off-by-default preference).
- [ ] Wire `00Intro` (title), `00Victory` (win), battle stems `01`/`02`.
- [ ] Add `onError`-style graceful degradation if a track fails to load.

---

## Housekeeping / polish (small, anytime)

- [ ] Consider adding a `.gitignore` for `node_modules/` (created transiently by
      the build's `npm install`).
- [ ] When Phase 3 lands, fill the empty `SCENARIOS[].story` arrays and add
      per-scenario objective banner text.

---

## Explicitly out of scope for V1 (plan §10)

Per-hero side stories, field/farm mode, multiple save slots, Thai UI
localization, Chapter 3–4 content, and a mobile-first layout overhaul. Keep the
layout usable at ≥1024px, graceful at 768px — but do not build these yet.
