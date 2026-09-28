import assert from 'node:assert/strict'
import { test } from 'node:test'
import { gameSound } from '../../../src/feedback/gameSound.ts'
import {
  newGame,
  play,
  type GameState,
  type Player,
} from '../../../src/game/engine.ts'

const snap = (s: GameState, moveCount: number) => ({ s, moveCount })

/** Board 0 has two X's in the top row; X to move. */
function nearSmallWin(): GameState {
  const s = newGame()
  const cells = s.cells.slice()
  cells[0] = 'X'
  cells[1] = 'X'
  return { ...s, cells }
}

test('a move plays the mover’s place sound', () => {
  const a = newGame()
  const b = play(a, 4, 4) // X moves
  assert.equal(gameSound(snap(a, 0), snap(b, 1), null), 'placeX')
  const c = play(b, 4, 0) // O moves
  assert.equal(gameSound(snap(b, 1), snap(c, 2), null), 'placeO')
})

test('winning a small board plays the board jingle instead', () => {
  const a = nearSmallWin()
  const b = play(a, 0, 2)
  assert.equal(b.boards[0], 'X')
  assert.equal(gameSound(snap(a, 2), snap(b, 3), null), 'board')
})

test('game result: win, lose from your side, draw', () => {
  const a = newGame()
  const won = (w: GameState['winner']) => ({ ...a, winner: w })
  assert.equal(gameSound(snap(a, 5), snap(won('X'), 6), null), 'win') // 2P
  assert.equal(gameSound(snap(a, 5), snap(won('X'), 6), 'X'), 'win')
  assert.equal(gameSound(snap(a, 5), snap(won('X'), 6), 'O' as Player), 'lose')
  assert.equal(gameSound(snap(a, 5), snap(won('draw'), 6), 'X'), 'draw')
  // Forfeit: winner appears with no new move.
  assert.equal(gameSound(snap(a, 5), snap(won('O'), 5), 'O'), 'win')
})

test('no sound when nothing changed, or on undo', () => {
  const a = newGame()
  const b = play(a, 4, 4)
  assert.equal(gameSound(snap(b, 1), snap(b, 1), null), null)
  assert.equal(gameSound(snap(b, 1), snap(a, 0), null), null) // undo
})

test('board clearing plays the start jingle only when asked (online rematch)', () => {
  const a = newGame()
  const b = play(a, 4, 4)
  assert.equal(gameSound(snap(b, 1), snap(a, 0), 'X', true), 'start')
  assert.equal(gameSound(snap(b, 1), snap(a, 0), 'X', false), null)
})
