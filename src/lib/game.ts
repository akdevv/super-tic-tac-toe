export type Player = 'X' | 'O'
export type Result = Player | 'draw' | null

export interface GameState {
  /** 81 cells, index = board * 9 + cell. Boards and cells are numbered 0-8, left to right, top to bottom. */
  cells: (Player | null)[]
  /** Result of each small board. */
  boards: Result[]
  turn: Player
  /** Board the current player must play in; null = any open board. */
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

export function canPlay(s: GameState, board: number, cell: number): boolean {
  return (
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
    turn: s.turn === 'X' ? 'O' : 'X',
    // Sent to a closed (won or full) board = play anywhere.
    activeBoard: boards[cell] === null ? cell : null,
    // Drawn small boards count for nobody; all decided with no line = draw.
    winner:
      lineWinner(boards) ?? (boards.every((b) => b !== null) ? 'draw' : null),
  }
}
