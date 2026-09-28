import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  cursorInBoard,
  followPlay,
  fromRowCol,
  moveCursor,
  moveWithin,
  toRowCol,
} from '../../../src/game/cursor.ts'
import { newGame, play } from '../../../src/game/engine.ts'

test('row/col mapping round-trips every cell', () => {
  const seen = new Set<string>()
  for (let i = 0; i < 81; i++) {
    const [r, c] = toRowCol(i)
    assert.ok(r >= 0 && r < 9 && c >= 0 && c < 9)
    assert.equal(fromRowCol(r, c), i)
    seen.add(`${r},${c}`)
  }
  assert.equal(seen.size, 81)
})

test('row/col follows the visual layout', () => {
  assert.deepEqual(toRowCol(0), [0, 0]) // board 0, cell 0
  assert.deepEqual(toRowCol(2), [0, 2]) // board 0, top-right
  assert.deepEqual(toRowCol(9), [0, 3]) // board 1, top-left
  assert.deepEqual(toRowCol(6), [2, 0]) // board 0, bottom-left
  assert.deepEqual(toRowCol(27), [3, 0]) // board 3, top-left
  assert.deepEqual(toRowCol(80), [8, 8])
})

test('moving crosses into neighbouring boards', () => {
  assert.equal(moveCursor(2, 'right'), 9) // board 0 right edge -> board 1
  assert.equal(moveCursor(9, 'left'), 2)
  assert.equal(moveCursor(6, 'down'), 27) // board 0 bottom -> board 3
  assert.equal(moveCursor(27, 'up'), 6)
})

test('moving stops at the outer edges', () => {
  assert.equal(moveCursor(0, 'up'), 0)
  assert.equal(moveCursor(0, 'left'), 0)
  assert.equal(moveCursor(80, 'down'), 80)
  assert.equal(moveCursor(80, 'right'), 80)
})

test('cursorInBoard prefers the centre, then the first open cell', () => {
  const s = newGame()
  assert.equal(cursorInBoard(s, 3), 3 * 9 + 4)
  // X takes board 3's centre; O is sent to board 4. Board 3 centre is taken.
  const t = play(s, 3, 4)
  assert.equal(cursorInBoard({ ...t, activeBoard: null }, 3), 3 * 9 + 0)
})

test('followPlay jumps into the forced board only when needed', () => {
  const s = play(newGame(), 0, 5) // O must play board 5
  assert.equal(followPlay(s, 0), 5 * 9 + 4)
  assert.equal(followPlay(s, 5 * 9 + 2), 5 * 9 + 2) // already there
  assert.equal(followPlay(newGame(), 17), 17) // free move: stay
})

test('moveWithin keeps the cursor inside the forced board', () => {
  assert.equal(moveWithin(2, 'right', 0), 2) // would leave board 0
  assert.equal(moveWithin(1, 'right', 0), 2)
  assert.equal(moveWithin(2, 'right', null), 9) // free move: cross over
})
