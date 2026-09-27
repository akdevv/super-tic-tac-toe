import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bestMove, legalMoves } from './bot.ts'
import { canPlay, newGame, play, type GameState, type Player } from './game.ts'

function withCells(s: GameState, board: number, marks: (Player | null)[]) {
  const cells = s.cells.slice()
  marks.forEach((m, i) => (cells[board * 9 + i] = m))
  return { ...s, cells }
}

test('legal moves respect the forced board', () => {
  assert.equal(legalMoves(newGame()).length, 81)
  assert.equal(legalMoves(play(newGame(), 0, 4)).length, 9)
})

test('easy and searched bots only ever make legal moves', () => {
  for (let g = 0; g < 20; g++) {
    let s = newGame(g % 2 ? 'X' : 'O')
    while (!s.winner) {
      const [b, c] = bestMove(s, s.turn === 'X' ? 0 : 3)
      assert.ok(canPlay(s, b, c), `illegal ${b},${c}`)
      s = play(s, b, c)
    }
  }
})

test('refuses to move in a finished game', () => {
  assert.throws(() => bestMove({ ...newGame(), winner: 'X' }, 10))
})

test('does not mutate the state it searches from', () => {
  const s = play(newGame(), 4, 4)
  const copy = structuredClone(s)
  bestMove(s, 50)
  assert.deepEqual(s, copy)
})

test('takes a game-winning move', () => {
  // X has boards 1 and 2, and two in a row on board 0.
  let s: GameState = {
    ...newGame(),
    boards: [null, 'X', 'X', null, null, null, null, null, null],
  }
  s = withCells(s, 0, ['X', 'X'])
  assert.deepEqual(bestMove(s, 300), [0, 2])
})

test("blocks the opponent's game-winning move", () => {
  // O to move in board 0, where X threatens cell 0 to win the game. Every
  // other O move sends X to a closed board = free move = X plays 0 and wins.
  let s: GameState = {
    ...newGame(),
    turn: 'O',
    activeBoard: 0,
    // prettier-ignore
    boards: [null, 'X', 'X', null, 'draw', 'draw', null, 'draw', 'draw'],
  }
  s = withCells(s, 0, [null, null, null, 'X', null, null, 'X'])
  assert.deepEqual(bestMove(s, 500), [0, 0])
})
