import { canPlay, type GameState } from './engine.ts'

// Keyboard / D-pad cursor over the board, seen as one 9x9 grid.
// Cells are indexed like everywhere else: board * 9 + cell.

export type Dir = 'up' | 'down' | 'left' | 'right'

/** Cell index -> [row, col] on the 9x9 grid. */
export function toRowCol(i: number): [number, number] {
  const board = Math.floor(i / 9)
  const cell = i % 9
  return [
    Math.floor(board / 3) * 3 + Math.floor(cell / 3),
    (board % 3) * 3 + (cell % 3),
  ]
}

/** [row, col] on the 9x9 grid -> cell index. */
export function fromRowCol(row: number, col: number): number {
  const board = Math.floor(row / 3) * 3 + Math.floor(col / 3)
  return board * 9 + (row % 3) * 3 + (col % 3)
}

const clamp = (n: number) => Math.min(8, Math.max(0, n))

/** One step in `dir`, stopping at the edges. */
export function moveCursor(i: number, dir: Dir): number {
  const [row, col] = toRowCol(i)
  const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0
  const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0
  return fromRowCol(clamp(row + dr), clamp(col + dc))
}

/** Like moveCursor, but never leaves `board` (the forced board, if any). */
export function moveWithin(i: number, dir: Dir, board: number | null): number {
  const next = moveCursor(i, dir)
  return board === null || Math.floor(next / 9) === board ? next : i
}

// Centre first, then the rest in reading order.
const PREFERRED = [4, 0, 1, 2, 3, 5, 6, 7, 8]

/** Where the cursor should land when play moves to `board`. */
export function cursorInBoard(s: GameState, board: number): number {
  const cell = PREFERRED.find((c) => canPlay(s, board, c)) ?? 4
  return board * 9 + cell
}

/**
 * Keeps the cursor useful after a move: jump into the forced board if it
 * isn't already there, otherwise stay put.
 */
export function followPlay(s: GameState, cursor: number): number {
  if (s.activeBoard === null) return cursor
  return Math.floor(cursor / 9) === s.activeBoard
    ? cursor
    : cursorInBoard(s, s.activeBoard)
}
