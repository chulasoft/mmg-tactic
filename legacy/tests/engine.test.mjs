/**
 * Pure-engine tests. Run with:  node --test
 * No dependencies — uses node's built-in test runner + assert.
 *
 * These lock the gameplay math so refactors (and the upcoming EXP / event
 * work) can't silently change combat behavior.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  calcStat, heroStats, expToLevel, EXP_PER_CHAPTER,
  applyCard, bfsMove, getAttackRange, enemyAI,
  awardChapter, serializeProgress, hydrateProgress,
} from '../src/core/engine.mjs'

// A tiny hero fixture mirroring the DATA shape.
const elena = { hp: 25, at: 4, mv: 3, rg: 1, growth: { hp: 5, at: 4, mv: .33, rg: 0 } }

test('calcStat rounds base + rate scaled per 10 levels', () => {
  assert.equal(calcStat(25, 5, 1), 25)   // level 1 = base
  assert.equal(calcStat(25, 5, 11), 30)  // +5 over 10 levels
})

test('heroStats scales hp/at, floors mv/rg growth', () => {
  const s1 = heroStats(elena, 1)
  assert.deepEqual(s1, { hp: 25, at: 4, mv: 3, rg: 1 })
  const s11 = heroStats(elena, 11)
  assert.equal(s11.hp, 30)
  assert.equal(s11.at, 8)
  assert.equal(s11.mv, 3)  // .33 * 10 / 10 = 0.33 → floor 0
  assert.equal(s11.rg, 1)  // 0 growth
})

test('expToLevel follows the +10-per-level curve, capped at 30', () => {
  assert.equal(expToLevel(0), 1)
  assert.equal(expToLevel(9), 1)
  assert.equal(expToLevel(10), 2)
  assert.equal(expToLevel(25), 3)
  assert.equal(expToLevel(10_000), 30)
  assert.equal(expToLevel(undefined), 1)
  assert.equal(EXP_PER_CHAPTER, 10)
})

test('applyCard: buff, heal (incl. full), damage-reduction, extra action', () => {
  const unit = { at: 4, mv: 3, rg: 1, hp: 10, mhp: 25, dr: 0 }
  const buff = applyCard(unit, { id: 'c', fx: [{ t: 'B', s: 'at', v: 2 }] })
  assert.equal(buff.at, 6)
  assert.equal(buff.atkLeft, 1)
  assert.equal(buff.cardPlayed, 'c')

  const heal = applyCard(unit, { id: 'h', fx: [{ t: 'H', v: 4 }] })
  assert.equal(heal.hp, 14)
  const full = applyCard(unit, { id: 'f', fx: [{ t: 'H', v: 999 }] })
  assert.equal(full.hp, 25)                       // clamped to mhp
  const overheal = applyCard({ ...unit, hp: 24 }, { id: 'o', fx: [{ t: 'H', v: 99 }] })
  assert.equal(overheal.hp, 25)

  const dr = applyCard(unit, { id: 'd', fx: [{ t: 'D', v: 1 }] })
  assert.equal(dr.dr, 1)
  const extra = applyCard(unit, { id: 'x', fx: [{ t: 'X', s: 'at', v: 1 }] })
  assert.equal(extra.atkLeft, 2)
})

test('bfsMove respects mvLeft, walls, and occupied tiles', () => {
  const unit = { x: 0, y: 0, mvLeft: 2 }
  const reach = bfsMove(unit, [unit], 5, 5, [])
  // Manhattan disk of radius 2 minus origin = 5 tiles.
  assert.equal(reach.length, 5)
  // A wall at (1,0) removes that tile and anything only reachable through it.
  const walled = bfsMove(unit, [unit], 5, 5, [[1, 0]])
  assert.ok(!walled.some(t => t.x === 1 && t.y === 0))
  // An occupied tile is not a valid destination.
  const blocked = bfsMove(unit, [unit, { x: 1, y: 0 }], 5, 5, [])
  assert.ok(!blocked.some(t => t.x === 1 && t.y === 0))
})

test('getAttackRange returns targets within Manhattan range, excluding self tile', () => {
  const unit = { x: 2, y: 2, rg: 1 }
  const targets = [{ id: 'a', x: 2, y: 3 }, { id: 'b', x: 4, y: 2 }, { id: 'c', x: 2, y: 2 }]
  const inRange = getAttackRange(unit, targets)
  assert.deepEqual(inRange.map(t => t.id), ['a'])
})

test('enemyAI moves toward the nearest hero and attacks when in range', () => {
  const enemy = { id: 'e0', x: 0, y: 0, at: 3, mv: 5, rg: 1 }
  const heroes = [{ id: 'far', x: 9, y: 9, hp: 10, dr: 0 }, { id: 'near', x: 3, y: 0, hp: 10, dr: 0 }]
  const all = [enemy, ...heroes]
  const r = enemyAI(enemy, heroes, all, 12, 12, [])
  assert.equal(r.targetId, 'near')          // picks the closer hero
  assert.ok(r.movedEnemy.x <= 3)            // advances toward it
})

test('enemyAI applies damage reduction and never deals below 1', () => {
  const enemy = { id: 'e0', x: 0, y: 0, at: 3, mv: 0, rg: 1 }
  const hero = { id: 'h', x: 1, y: 0, hp: 10, dr: 5 }   // dr exceeds atk
  const r = enemyAI(enemy, [hero], [enemy, hero], 5, 5, [])
  assert.equal(r.dmg, 1)                     // clamped to 1
  assert.equal(r.attackedHero.hp, 9)
})

test('awardChapter grants EXP to survivors, records level-ups, marks cleared, no mutation', () => {
  const progress = { heroExp: { elena: 5 }, chaptersCleared: [] }
  const { progress: next, award } = awardChapter(progress, 'c1', ['elena', 'yumi'])
  assert.equal(next.heroExp.elena, 15)       // 5 → 15
  assert.equal(next.heroExp.yumi, 10)        // 0 → 10
  assert.deepEqual(next.chaptersCleared, ['c1'])
  const elena = award.find(a => a.heroId === 'elena')
  assert.deepEqual(elena, { heroId: 'elena', gained: 10, fromLv: 1, toLv: 2 })
  // inputs untouched
  assert.equal(progress.heroExp.elena, 5)
  assert.deepEqual(progress.chaptersCleared, [])
  // clearing the same chapter again does not duplicate
  const again = awardChapter(next, 'c1', ['elena'])
  assert.deepEqual(again.progress.chaptersCleared, ['c1'])
})

test('serializeProgress / hydrateProgress round-trip the persistent slice', () => {
  const state = { party: ['elena', 'yumi'], progress: { heroExp: { elena: 20 }, chaptersCleared: ['c1'] }, junk: 1 }
  const data = serializeProgress(state)
  assert.equal(data.version, 1)
  assert.deepEqual(data.party, ['elena', 'yumi'])
  assert.deepEqual(data.heroExp, { elena: 20 })
  const blank = { party: [], progress: { heroExp: {}, chaptersCleared: [] }, junk: 2 }
  const restored = hydrateProgress(blank, data)
  assert.deepEqual(restored.party, ['elena', 'yumi'])
  assert.deepEqual(restored.progress.heroExp, { elena: 20 })
  assert.deepEqual(restored.progress.chaptersCleared, ['c1'])
  assert.equal(restored.junk, 2)             // untouched fields preserved
})
