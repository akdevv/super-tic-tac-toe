import { other, replay, type GameState, type Player } from '../game/engine.ts'

const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const GAME_ID_LENGTH = 10

/** 10 random alphanumeric chars from the crypto RNG (62^10 ≈ 8×10^17 ids). */
export function newGameId(): string {
  let id = ''
  while (id.length < GAME_ID_LENGTH) {
    for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
      // 248 = 4 × 62: skipping higher bytes keeps every char equally likely.
      if (byte < 248 && id.length < GAME_ID_LENGTH) id += ALPHABET[byte % 62]
    }
  }
  return id
}

/** Also guards Firebase paths: ids can't contain '/', '.', '#', '$', '[' or ']'. */
export const isGameId = (s: string) => /^[A-Za-z0-9]{10}$/.test(s)

/** Shape of `games/{id}`. database.rules.json enforces seats, turns and timing. */
export interface OnlineGame {
  players: { X: string; O?: string }
  /** Who starts the current round; flips each rematch. */
  first: Player
  /** Two digits per move: cell index 0-80 (board * 9 + cell). */
  moves: string
  score: { X: number; O: number; draw: number }
  /** true = online, number = server time they disconnected. */
  presence?: Record<string, true | number>
  /** Loser's mark after a resign or a claimed disconnect. Cleared by rematch. */
  forfeit?: Player
}

/** How long an opponent must be gone before the win can be claimed. Must match database.rules.json. */
export const FORFEIT_AFTER = 60_000
/** Close the connection after this long without game activity. */
export const IDLE_TIMEOUT = 10 * 60_000

export const encodeMove = (board: number, cell: number) =>
  String(board * 9 + cell).padStart(2, '0')

export const decodeMoves = (moves: string) =>
  (moves.match(/../g) ?? []).map(Number)

/** Board state for an online game. A result on the board beats a forfeit. */
export function onlineState(g: OnlineGame): GameState {
  const s = replay(g.first, decodeMoves(g.moves))
  return !s.winner && g.forfeit ? { ...s, winner: other(g.forfeit) } : s
}

export function seatOf(g: OnlineGame, uid: string): Player | null {
  return g.players.X === uid ? 'X' : g.players.O === uid ? 'O' : null
}
