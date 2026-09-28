export type Player = 'X' | 'O'
export type Result = Player | 'draw' | null

export interface GameState {
  /** index = board * 9 + cell, both 0-8 in reading order. */
  cells: (Player | null)[]
  boards: Result[]
  turn: Player
  /** null = any open board. */
  activeBoard: number | null
  winner: Result
}

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function lineWinner(squares: Result[]): Player | null {
  for (const [a, b, c] of LINES) {
    const v = squares[a]
    if ((v === 'X' || v === 'O') && v === squares[b] && v === squares[c]) {
      return v
    }
  }
  return null
}

export function newGame(first: Player = 'X'): GameState {
  return {
    cells: Array(81).fill(null),
    boards: Array(9).fill(null),
    turn: first,
    activeBoard: null,
    winner: null,
  }
}

export const other = (p: Player): Player => (p === 'X' ? 'O' : 'X')

const inRange = (n: number) => Number.isInteger(n) && n >= 0 && n < 9

export function canPlay(s: GameState, board: number, cell: number): boolean {
  return (
    inRange(board) &&
    inRange(cell) &&
    s.winner === null &&
    s.boards[board] === null &&
    (s.activeBoard === null || s.activeBoard === board) &&
    s.cells[board * 9 + cell] === null
  )
}

export function play(s: GameState, board: number, cell: number): GameState {
  if (!canPlay(s, board, cell)) throw new Error('Illegal move')

  const cells = s.cells.slice()
  cells[board * 9 + cell] = s.turn

  const small = cells.slice(board * 9, board * 9 + 9)
  const boards = s.boards.slice()
  boards[board] = lineWinner(small) ?? (small.every(Boolean) ? 'draw' : null)

  return {
    cells,
    boards,
    turn: other(s.turn),
    activeBoard: boards[cell] === null ? cell : null,
    winner:
      lineWinner(boards) ?? (boards.every((b) => b !== null) ? 'draw' : null),
  }
}

/** An illegal move loses the game for whoever made it. */
export function replay(first: Player, moves: number[]): GameState {
  let s = newGame(first)
  for (const i of moves) {
    if (s.winner) break
    const board = Math.floor(i / 9)
    const cell = i - board * 9
    if (!canPlay(s, board, cell)) return { ...s, winner: other(s.turn) }
    s = play(s, board, cell)
  }
  return s
}
