import { other, replay, type GameState, type Player } from '../game/engine.ts'

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const GAME_ID_LENGTH = 10

export function newGameId(): string {
  let id = ''
  while (id.length < GAME_ID_LENGTH) {
    for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
      // 248 = 4 × 62: skipping higher bytes avoids modulo bias.
      if (byte < 248 && id.length < GAME_ID_LENGTH) id += ALPHABET[byte % 62]
    }
  }
  return id
}

/** Also guards Firebase paths against '/', '.', '#', '$', '[' and ']'. */
export const isGameId = (s: string) => /^[A-Za-z0-9]{10}$/.test(s)

/** `games/{id}`; database.rules.json enforces seats, turns and timing. */
export interface OnlineGame {
  players: { X: string; O?: string }
  first: Player
  /** Two digits per move: cell index 0-80. */
  moves: string
  score: { X: number; O: number; draw: number }
  /** true = online, number = server time they disconnected. */
  presence?: Record<string, true | number>
  /** Loser's mark after a resign or a claimed disconnect. */
  forfeit?: Player
}

/** Must match database.rules.json. */
export const FORFEIT_AFTER = 60_000
export const IDLE_TIMEOUT = 10 * 60_000

export const encodeMove = (board: number, cell: number) =>
  String(board * 9 + cell).padStart(2, '0')

export const decodeMoves = (moves: string) =>
  (moves.match(/../g) ?? []).map(Number)

/** A result on the board beats a forfeit. */
export function onlineState(g: OnlineGame): GameState {
  const s = replay(g.first, decodeMoves(g.moves))
  return !s.winner && g.forfeit ? { ...s, winner: other(g.forfeit) } : s
}

export function seatOf(g: OnlineGame, uid: string): Player | null {
  return g.players.X === uid ? 'X' : g.players.O === uid ? 'O' : null
}
