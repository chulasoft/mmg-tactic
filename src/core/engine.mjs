/**
 * Pure game engine — no React, no DOM, no timers, no data-table imports.
 *
 * Everything here is deterministic and unit-testable with `node --test`
 * (see tests/engine.test.mjs). The browser build inlines this file via
 * src/build.js, which strips the `export ` keywords and concatenates it ahead
 * of the app source, so these become plain top-level functions in app.js.
 *
 * RULE: keep this file pure. It may take heroes/cards/scenarios as ARGUMENTS,
 * but it must never import or reference the DATA tables or React.
 */

// ── Stats & leveling ────────────────────────────────────────────────
export function calcStat(base, rate, lv) {
  return Math.round(base + rate * (lv - 1) / 10)
}

export function heroStats(h, lv = 1) {
  return {
    hp: calcStat(h.hp, h.growth.hp, lv),
    at: calcStat(h.at, h.growth.at, lv),
    mv: h.mv + Math.floor(h.growth.mv * (lv - 1) / 10),
    rg: h.rg + Math.floor(h.growth.rg * (lv - 1) / 10),
  }
}

// EXP → level. Simple curve, capped at 30 (master plan §4.3).
export function expToLevel(exp = 0) {
  return Math.min(30, 1 + Math.floor((exp || 0) / 10))
}

// EXP awarded to a hero for clearing a chapter (master plan §4.3: +10 each).
export const EXP_PER_CHAPTER = 10

// ── Progression (persistent slice) ──────────────────────────────────
// Award chapter-clear EXP to the surviving heroes and mark the chapter done.
// Pure: takes the `progress` slice + ids, returns a NEW progress + a per-hero
// award summary (for the victory screen). Never mutates its inputs.
export function awardChapter(progress, chapterId, survivorIds) {
  const heroExp = { ...progress.heroExp }
  const award = survivorIds.map(id => {
    const before = heroExp[id] || 0
    const after = before + EXP_PER_CHAPTER
    heroExp[id] = after
    return { heroId: id, gained: EXP_PER_CHAPTER, fromLv: expToLevel(before), toLv: expToLevel(after) }
  })
  const chaptersCleared = progress.chaptersCleared.includes(chapterId)
    ? progress.chaptersCleared
    : [...progress.chaptersCleared, chapterId]
  return { progress: { ...progress, heroExp, chaptersCleared }, award }
}

// ── Save/Load seam (persistent state ⇄ plain data) ──────────────────
// The single boundary the CSV save/load (Phase 5) will use. Kept intentionally
// small and flat now; when state grows to a nested `progress`/`ui`/`battle`
// split, only these two functions change — callers stay the same.
export function serializeProgress(state) {
  return {
    version: 1,
    party: [...(state.party || [])],
    heroExp: { ...(state.progress?.heroExp || {}) },
    chaptersCleared: [...(state.progress?.chaptersCleared || [])],
  }
}

export function hydrateProgress(state, data) {
  return {
    ...state,
    party: Array.isArray(data?.party) ? data.party : state.party,
    progress: {
      heroExp: data?.heroExp || {},
      chaptersCleared: data?.chaptersCleared || [],
    },
  }
}

// ── Cards ───────────────────────────────────────────────────────────
export function applyCard(unit, card) {
  let at = unit.at, mv = unit.mv, rg = unit.rg, hp = unit.hp, mhp = unit.mhp
  let extraAtk = 0, extraMv = 0, dr = unit.dr || 0
  for (const fx of (card.fx || [])) {
    if (fx.t === 'B' && fx.s === 'at') at += fx.v
    if (fx.t === 'B' && fx.s === 'mv') mv += fx.v
    if (fx.t === 'B' && fx.s === 'rg') rg += fx.v
    if (fx.t === 'H') hp = Math.min(mhp, hp + (fx.v === 999 ? mhp : fx.v))
    if (fx.t === 'D') dr += fx.v
    if (fx.t === 'X' && fx.s === 'at') extraAtk += fx.v
    if (fx.t === 'X' && fx.s === 'mv') extraMv += fx.v
  }
  return { ...unit, at, mv, rg, hp, dr, atkLeft: 1 + extraAtk, mvLeft: mv, cardPlayed: card.id }
}

// ── Grid: movement & range ──────────────────────────────────────────
export function bfsMove(unit, all, w, h, walls) {
  const key = (x, y) => `${x},${y}`
  const wall = new Set(walls.map(([x, y]) => key(x, y)))
  const occ = new Set(all.map(u => key(u.x, u.y)))
  const visited = new Set([key(unit.x, unit.y)])
  const queue = [{ x: unit.x, y: unit.y, steps: 0 }]
  const reachable = []
  while (queue.length) {
    const { x, y, steps } = queue.shift()
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny)
      if (nx < 0 || ny < 0 || nx >= w || ny >= h || wall.has(k) || visited.has(k)) continue
      visited.add(k)
      if (!occ.has(k)) {
        if (steps + 1 <= unit.mvLeft) reachable.push({ x: nx, y: ny })
        if (steps + 1 < unit.mvLeft) queue.push({ x: nx, y: ny, steps: steps + 1 })
      }
    }
  }
  return reachable
}

export function getAttackRange(unit, targets) {
  return targets.filter(t => {
    const dist = Math.abs(t.x - unit.x) + Math.abs(t.y - unit.y)
    return dist > 0 && dist <= unit.rg
  })
}

// ── Enemy AI ────────────────────────────────────────────────────────
export function enemyAI(enemy, heroes, all, w, h, walls) {
  const alive = heroes.filter(h => h.hp > 0)
  if (!alive.length) return { movedEnemy: enemy, attackedHero: null, dmg: 0, targetId: null }
  const target = alive.reduce((a, b) =>
    (Math.abs(a.x - enemy.x) + Math.abs(a.y - enemy.y)) <= (Math.abs(b.x - enemy.x) + Math.abs(b.y - enemy.y)) ? a : b)
  const reachable = bfsMove({ ...enemy, mvLeft: enemy.mv }, all, w, h, walls)
  let moved = { ...enemy }
  if (reachable.length) {
    const best = reachable.reduce((a, b) =>
      (Math.abs(a.x - target.x) + Math.abs(a.y - target.y)) <= (Math.abs(b.x - target.x) + Math.abs(b.y - target.y)) ? a : b)
    moved = { ...enemy, x: best.x, y: best.y }
  }
  const dist = Math.abs(moved.x - target.x) + Math.abs(moved.y - target.y)
  if (dist <= moved.rg) {
    const dmg = Math.max(1, moved.at - (target.dr || 0))
    const attackedHero = { ...target, hp: Math.max(0, target.hp - dmg) }
    return { movedEnemy: moved, attackedHero, dmg, targetId: target.id }
  }
  return { movedEnemy: moved, attackedHero: null, dmg: 0, targetId: null }
}
