import { useEffect, useMemo, useReducer } from 'react'
import { Link, useSearchParams } from 'react-router'
import Board from '../components/Board.tsx'
import { LEVELS, type Level, type Move } from '../game/bot.ts'
import { other, type Player } from '../game/engine.ts'
import {
  canUndo,
  loadGame,
  loadScore,
  reducer,
  saveGame,
  saveScore,
  stateOf,
} from '../game/localGame.ts'

// Even touching sessionStorage/localStorage can throw when storage is blocked.
const noStore = { getItem: () => null, setItem() {}, removeItem() {} }
function storage(kind: 'sessionStorage' | 'localStorage') {
  try {
    return window[kind]
  } catch {
    return noStore
  }
}

/** Reads the mode from the URL; remounts the game when it changes. */
export default function Game() {
  const [params] = useSearchParams()
  const levelParam = params.get('bot') ?? ''
  const level = Object.hasOwn(LEVELS, levelParam) ? (levelParam as Level) : null
  const me: Player = params.get('me') === 'O' ? 'O' : 'X'
  const bot = level ? other(me) : null
  const mode = level ? `bot-${level}-${me}` : 'local'
  // Score is per difficulty, not per side, since it's kept as you/bot.
  const scoreMode = level ? `bot-${level}` : 'local'
  return (
    <LocalGamePage
      key={mode}
      bot={bot}
      level={level}
      mode={mode}
      scoreMode={scoreMode}
    />
  )
}

interface Props {
  bot: Player | null
  level: Level | null
  mode: string
  scoreMode: string
}

function LocalGamePage({ bot, level, mode, scoreMode }: Props) {
  const [g, dispatch] = useReducer(reducer, null, () => ({
    bot,
    first: 'X' as Player,
    moves: [],
    ...loadGame(storage('sessionStorage'), mode),
    score: loadScore(storage('localStorage'), scoreMode),
  }))
  const s = useMemo(() => stateOf(g), [g])
  const botThinking = bot !== null && !s.winner && s.turn === bot

  useEffect(() => saveGame(storage('sessionStorage'), mode, g), [mode, g])
  useEffect(
    () => saveScore(storage('localStorage'), scoreMode, g.score),
    [scoreMode, g.score],
  )

  useEffect(() => {
    if (!botThinking || !level) return
    const worker = new Worker(
      new URL('../game/bot.worker.ts', import.meta.url),
      { type: 'module' },
    )
    worker.onmessage = (e: MessageEvent<Move>) =>
      dispatch({ type: 'move', cell: e.data[0] * 9 + e.data[1] })
    worker.postMessage({ state: s, ms: LEVELS[level] })
    // Undo/restart/leaving mid-think kills the stale search.
    return () => worker.terminate()
  }, [botThinking, level, s])

  let status: string
  if (s.winner === 'draw') status = 'Draw!'
  else if (s.winner)
    status = bot
      ? s.winner === bot
        ? 'Bot wins.'
        : 'You win!'
      : `${s.winner} wins!`
  else {
    status = botThinking
      ? 'Bot is thinking…'
      : bot
        ? 'Your turn'
        : `${s.turn} to move`
    if (s.activeBoard === null) status += ' (any board)'
  }

  const n = (k: string) => g.score[k] ?? 0
  const score = bot
    ? `You (${other(bot)}) ${n('you')} · ${level} bot ${n('bot')} · Draws ${n('draw')}`
    : `X ${n('X')} · O ${n('O')} · Draws ${n('draw')}`

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Link to="/" className="underline">
        Back home
      </Link>
      <p>{score}</p>
      <p className="text-xl font-bold">{status}</p>

      <Board
        state={s}
        locked={botThinking}
        onPlay={(b, c) => dispatch({ type: 'move', cell: b * 9 + c })}
      />

      <div className="flex gap-4">
        <button
          className="border px-3 py-1 disabled:opacity-40"
          disabled={!canUndo(g)}
          onClick={() => dispatch({ type: 'undo' })}
        >
          Undo
        </button>
        <button
          className="border px-3 py-1"
          onClick={() => dispatch({ type: 'restart' })}
        >
          New game
        </button>
        <button
          className="border px-3 py-1"
          onClick={() => dispatch({ type: 'resetScore' })}
        >
          Reset score
        </button>
      </div>
    </main>
  )
}
