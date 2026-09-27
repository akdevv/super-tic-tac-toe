import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  canPlay,
  newGame,
  play,
  type GameState,
  type Player,
  type Result,
} from './game.ts'

/** Fresh game with the first small-board results set, rest open. */
function withBoards(results: Result[]): GameState {
  return {
    ...newGame(),
    boards: [...results, ...Array(9).fill(null)].slice(0, 9),
  }
}

/** Board `board` with the given cells pre-filled. */
function withCells(
  s: GameState,
  board: number,
  marks: (Player | null)[],
): GameState {
  const cells = s.cells.slice()
  marks.forEach((m, i) => (cells[board * 9 + i] = m))
  return { ...s, cells }
}

test('first move can go anywhere, then sends opponent to matching board', () => {
  const s = play(newGame(), 0, 4)
  assert.equal(s.cells[4], 'X')
  assert.equal(s.turn, 'O')
  assert.equal(s.activeBoard, 4)
  assert.equal(canPlay(s, 0, 0), false)
  assert.equal(canPlay(s, 4, 0), true)
})

test('rejects occupied cells, wrong board, and moves after game end', () => {
  let s = play(newGame(), 4, 4) // O sent to board 4
  assert.throws(() => play(s, 4, 4)) // occupied
  assert.throws(() => play(s, 0, 0)) // wrong board
  s = { ...s, winner: 'X' }
  assert.throws(() => play(s, 4, 0))
})

test('winning a small board closes it', () => {
  let s = withCells(newGame(), 0, ['X', 'X'])
  s = play(s, 0, 2)
  assert.equal(s.boards[0], 'X')
  s = { ...s, activeBoard: null }
  assert.equal(canPlay(s, 0, 5), false)
})

test('full small board with no line is a draw', () => {
  // prettier-ignore
  let s = withCells(newGame(), 0, ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null])
  s = play(s, 0, 8)
  assert.equal(s.boards[0], 'draw')
})

test('being sent to a closed board allows playing anywhere', () => {
  const s = play(withBoards([null, null, null, null, 'O']), 0, 4)
  assert.equal(s.activeBoard, null)
  assert.equal(canPlay(s, 1, 0), true)
  assert.equal(canPlay(s, 4, 0), false)
})

test('three small boards in a row wins the game', () => {
  let s = withBoards(['X', 'X'])
  s = withCells(s, 2, ['X', 'X'])
  s = play(s, 2, 2)
  assert.equal(s.winner, 'X')
})

test('drawn small boards do not count toward a line', () => {
  let s = withBoards(['draw', 'X'])
  s = withCells(s, 2, ['X', 'X'])
  s = play(s, 2, 2)
  assert.equal(s.winner, null)
})

test('all boards decided with no line is a draw', () => {
  let s = withBoards(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X'])
  s = withCells(s, 8, ['X', 'X'])
  s = play(s, 8, 2)
  assert.equal(s.winner, 'draw')
})

test('play does not mutate the previous state', () => {
  const s = newGame()
  play(s, 0, 0)
  assert.deepEqual(s, newGame())
})
