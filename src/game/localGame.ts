import {
  canPlay,
  newGame,
  other,
  play,
  replay,
  type GameState,
  type Player,
} from './engine.ts'

/** Keys: X/O/draw in 2-player, you/bot/draw vs bot. */
export type Score = Record<string, number>

export interface LocalGame {
  /** null = 2-player. */
  bot: Player | null
  first: Player
  moves: number[]
  score: Score
}

export type Action =
  | { type: 'move'; cell: number }
  | { type: 'undo' }
  | { type: 'restart' }
  | { type: 'resetScore' }

export const stateOf = (g: LocalGame): GameState => replay(g.first, g.moves)

const moverOf = (g: LocalGame, i: number) => (i % 2 ? other(g.first) : g.first)

export function canUndo(g: LocalGame): boolean {
  return !stateOf(g).winner && g.moves.some((_, i) => moverOf(g, i) !== g.bot)
}

export function reducer(g: LocalGame, action: Action): LocalGame {
  switch (action.type) {
    case 'move': {
      const s = stateOf(g)
      const board = Math.floor(action.cell / 9)
      // Stale moves (e.g. a late bot reply) are ignored.
      if (!canPlay(s, board, action.cell - board * 9)) return g
      const moves = [...g.moves, action.cell]
      const winner = replay(g.first, moves).winner
      if (!winner) return { ...g, moves }
      const key = !g.bot
        ? winner
        : winner === 'draw'
          ? 'draw'
          : winner === g.bot
            ? 'bot'
            : 'you'
      return {
        ...g,
        moves,
        score: { ...g.score, [key]: (g.score[key] ?? 0) + 1 },
      }
    }
    case 'undo': {
      if (!canUndo(g)) return g
      const moves = g.moves.slice()
      while (moves.length && moverOf(g, moves.length - 1) === g.bot) moves.pop()
      moves.pop()
      return { ...g, moves }
    }
    case 'restart':
      return { ...g, first: other(g.first), moves: [] }
    case 'resetScore':
      return { ...g, score: {} }
  }
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const GAME_KEY = 'sttt:game'
export const GAME_TTL = 60 * 60 * 1000

function read(store: Store, key: string): unknown {
  try {
    return JSON.parse(store.getItem(key) ?? 'null')
  } catch {
    return null
  }
}

function write(store: Store, key: string, value: unknown) {
  try {
    store.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or blocked: play on unsaved
  }
}

export function saveGame(
  store: Store,
  mode: string,
  g: LocalGame,
  now = Date.now(),
) {
  write(store, GAME_KEY, { mode, first: g.first, moves: g.moves, savedAt: now })
}

export function loadGame(
  store: Store,
  mode: string,
  now = Date.now(),
): Pick<LocalGame, 'first' | 'moves'> | null {
  const d = read(store, GAME_KEY) as {
    mode?: unknown
    first?: unknown
    moves?: unknown
    savedAt?: unknown
  } | null
  if (!d || typeof d.savedAt !== 'number' || now - d.savedAt > GAME_TTL) {
    try {
      store.removeItem(GAME_KEY)
    } catch {
      // storage blocked
    }
    return null
  }
  if (d.mode !== mode || (d.first !== 'X' && d.first !== 'O')) return null
  if (!Array.isArray(d.moves) || d.moves.length > 81) return null
  const first: Player = d.first
  const moves = d.moves as unknown[]
  let s = newGame(first)
  for (const m of moves) {
    if (typeof m !== 'number') return null
    const board = Math.floor(m / 9)
    if (!canPlay(s, board, m - board * 9)) return null
    s = play(s, board, m - board * 9)
  }
  return { first, moves: moves as number[] }
}

const scoreKey = (mode: string) => `sttt:score:${mode}`

export function saveScore(store: Store, mode: string, score: Score) {
  write(store, scoreKey(mode), score)
}

export function loadScore(store: Store, mode: string): Score {
  const d = read(store, scoreKey(mode))
  if (!d || typeof d !== 'object') return {}
  return Object.fromEntries(
    Object.entries(d).filter(
      ([k, v]) =>
        ['X', 'O', 'you', 'bot', 'draw'].includes(k) &&
        Number.isSafeInteger(v) &&
        v >= 0,
    ),
  )
}
