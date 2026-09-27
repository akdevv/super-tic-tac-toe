import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  canPlay,
  newGame,
  play,
  replay,
  type GameState,
  type Player,
  type Result,
} from '../../../src/game/engine.ts'

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

test('rejects out-of-range and non-integer indices', () => {
  const s = play(newGame(), 4, 0) // O forced to board 0
  // cell 9 of board 0 would alias board 1, cell 0
  for (const [b, c] of [
    [0, 9],
    [0, -1],
    [-1, 0],
    [9, 0],
    [0, 0.5],
    [0.5, 0],
    [0, NaN],
  ]) {
    assert.equal(canPlay(s, b, c), false, `${b},${c}`)
    assert.throws(() => play(s, b, c))
  }
})

test('replay rebuilds the same state as playing moves', () => {
  const direct = play(play(play(newGame('O'), 4, 0), 0, 8), 8, 4)
  assert.deepEqual(replay('O', [36, 8, 76]), direct)
})

test('replay: an illegal move loses the game for its maker', () => {
  // X plays board 4 cell 0 (O must play board 0), O plays board 5 instead.
  assert.equal(replay('X', [36, 45]).winner, 'X')
  assert.equal(replay('X', [36, 36]).winner, 'X') // occupied
  assert.equal(replay('X', [81]).winner, 'O') // out of range
  assert.equal(replay('X', [-1]).winner, 'O')
  assert.equal(replay('X', [1.5]).winner, 'O')
})

test('replay ignores moves after the game ends', () => {
  // Random legal game to completion.
  const moves: number[] = []
  let s = newGame()
  while (!s.winner) {
    const legal = [...Array(81).keys()].filter((i) =>
      canPlay(s, Math.floor(i / 9), i % 9),
    )
    const i = legal[Math.floor(Math.random() * legal.length)]
    s = play(s, Math.floor(i / 9), i % 9)
    moves.push(i)
  }
  assert.deepEqual(replay('X', moves), s)
  const junk = [...Array(81).keys()] // would be illegal if applied
  assert.deepEqual(replay('X', [...moves, ...junk]), s)
})
