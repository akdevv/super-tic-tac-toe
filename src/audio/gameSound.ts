import { other, type GameState, type Player } from '../game/engine.ts'

export type GameSound =
  'win' | 'lose' | 'draw' | 'board' | 'placeX' | 'placeO' | 'start'

interface Snapshot {
  s: GameState
  moveCount: number
}

/**
 * Which sound a board change deserves, if any. `me` is your mark against
 * the CPU or online (null in 2-player, where any win gets the win jingle).
 * `resetSound`: play the start jingle when the board clears (online rematch).
 */
export function gameSound(
  before: Snapshot,
  after: Snapshot,
  me: Player | null,
  resetSound = false,
): GameSound | null {
  const { s } = after
  if (!before.s.winner && s.winner) {
    if (s.winner === 'draw') return 'draw'
    return me && s.winner !== me ? 'lose' : 'win'
  }
  if (after.moveCount > before.moveCount) {
    const decided = (g: GameState) => g.boards.filter(Boolean).length
    if (decided(s) > decided(before.s)) return 'board'
    return other(s.turn) === 'X' ? 'placeX' : 'placeO' // turn already flipped
  }
  if (resetSound && after.moveCount === 0 && before.moveCount > 0)
    return 'start'
  return null
}
