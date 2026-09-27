import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import Board from '../components/Board.tsx'
import type { GameState } from '../lib/game.ts'
import {
  getUid,
  joinGame,
  rematch,
  replay,
  sendMove,
  trackPresence,
  watchGame,
  type OnlineGame as Game,
} from '../lib/online.ts'

function Page({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Link to="/" className="underline">
        Back home
      </Link>
      {children}
    </main>
  )
}

export default function OnlineGame() {
  const id = useParams().id!
  const [uid, setUid] = useState<string>()
  const [game, setGame] = useState<Game | null>() // undefined = loading
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getUid().then(setUid)
  }, [])
  useEffect(() => watchGame(id, setGame), [id])

  const me =
    game && uid
      ? game.players.X === uid
        ? 'X'
        : game.players.O === uid
          ? 'O'
          : null
      : undefined
  const isPlayer = me === 'X' || me === 'O'

  // Claim the open seat. Losing the race just leaves you a spectator.
  const canJoin = me === null && !game?.players.O
  useEffect(() => {
    if (canJoin) joinGame(id).catch(() => {})
  }, [canJoin, id])

  useEffect(() => {
    if (isPlayer && uid) return trackPresence(id, uid)
  }, [isPlayer, id, uid])

  if (game === undefined || !uid) return <Page>Loading…</Page>
  if (game === null) return <Page>Game not found.</Page>

  let s: GameState
  try {
    s = replay(game)
  } catch {
    return <Page>This game has an invalid move and can't be shown.</Page>
  }

  const opponent = me === 'X' ? game.players.O : game.players.X
  const opponentOffline = isPlayer && opponent && !game.presence?.[opponent]

  let status: string
  if (!game.players.O) {
    status = isPlayer ? 'Waiting for an opponent to open the link…' : 'Joining…'
  } else if (s.winner === 'draw') {
    status = 'Draw!'
  } else if (s.winner) {
    status = !isPlayer
      ? `${s.winner} wins!`
      : s.winner === me
        ? 'You win!'
        : 'You lose.'
  } else {
    status = !isPlayer
      ? `${s.turn} to move`
      : s.turn === me
        ? 'Your turn'
        : "Opponent's turn"
    if (s.activeBoard === null) status += ' (any board)'
  }

  return (
    <Page>
      <p>
        {isPlayer ? `You are ${me}` : 'Watching'} · X {game.score.X} · O{' '}
        {game.score.O} · Draws {game.score.draw}
      </p>
      <p className="text-xl font-bold">{status}</p>
      {opponentOffline && (
        <p className="text-red-600">Opponent is disconnected.</p>
      )}

      <Board
        state={s}
        locked={!isPlayer || s.turn !== me || !game.players.O}
        onPlay={(b, c) => sendMove(id, game, b, c)}
      />

      <div className="flex gap-4">
        <button
          className="border px-3 py-1"
          onClick={() =>
            navigator.clipboard
              .writeText(location.href)
              .then(() => setCopied(true))
          }
        >
          {copied ? 'Link copied!' : 'Copy invite link'}
        </button>
        {isPlayer && s.winner && (
          <button
            className="border px-3 py-1"
            // Both players may click; the second one is rejected by the rules.
            onClick={() => rematch(id, game, s.winner!).catch(() => {})}
          >
            Rematch
          </button>
        )}
      </div>
    </Page>
  )
}
