import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import Board from '../components/Board.tsx'
import { canPlay, other } from '../game/engine.ts'
import {
  connect,
  disconnect,
  forfeit,
  getUid,
  joinGame,
  rematch,
  sendMove,
  serverNow,
  trackPresence,
  watchGame,
} from '../online/firebase.ts'
import {
  FORFEIT_AFTER,
  IDLE_TIMEOUT,
  isGameId,
  onlineState,
  seatOf,
  type OnlineGame as Game,
} from '../online/core.ts'

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
  const id = useParams().id ?? ''
  const validId = isGameId(id)
  const [uid, setUid] = useState<string>()
  const [game, setGame] = useState<Game | null>() // undefined = loading
  const [denied, setDenied] = useState(false)
  const [idle, setIdle] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmResign, setConfirmResign] = useState(false)

  const s = game ? onlineState(game) : null
  const seat = game && uid ? seatOf(game, uid) : null
  const opponent = seat && game ? game.players[other(seat)] : undefined
  const opponentLeftAt = opponent ? game?.presence?.[opponent] : undefined
  const opponentAway =
    typeof opponentLeftAt === 'number' ? opponentLeftAt : null
  const hostOnline = game?.presence?.[game.players.X] === true
  const inPlay = !!seat && !!game?.players.O && !s?.winner && !idle

  // Connection lives only while this page is open and not idle.
  useEffect(() => {
    if (idle) return
    connect()
    return disconnect
  }, [idle])

  useEffect(() => {
    getUid().then(setUid)
  }, [])

  useEffect(() => {
    if (!validId || !uid) return
    return watchGame(id, setGame, () => setDenied(true))
  }, [id, validId, uid])

  // Claim the open seat once the host is online. Losing a race to another
  // guest makes the game unreadable, which shows "full".
  const canJoin =
    !!uid && !!game && seat === null && !game.players.O && hostOnline && !idle
  useEffect(() => {
    if (canJoin) joinGame(id).catch(() => {})
  }, [canJoin, id])

  useEffect(() => {
    if (seat && uid && !idle) return trackPresence(id, uid)
  }, [seat, id, uid, idle])

  // Opponent gone for FORFEIT_AFTER: claim the win (rules verify the time).
  useEffect(() => {
    if (!inPlay || opponentAway === null || !seat) return
    let timer: ReturnType<typeof setTimeout>
    const claim = () =>
      forfeit(id, other(seat)).catch(() => (timer = setTimeout(claim, 5000)))
    timer = setTimeout(
      claim,
      Math.max(0, opponentAway + FORFEIT_AFTER - serverNow()) + 1000,
    )
    return () => clearTimeout(timer)
  }, [inPlay, opponentAway, seat, id])

  // Drop the connection after IDLE_TIMEOUT with nothing happening.
  const activity = `${game?.moves}|${game?.forfeit}|${game?.players.O}`
  useEffect(() => {
    if (idle) return
    const t = setTimeout(() => setIdle(true), IDLE_TIMEOUT)
    return () => clearTimeout(t)
  }, [activity, idle])

  if (!validId) return <Page>Game not found.</Page>
  if (denied)
    return <Page>This game is full. Only its two players can open it.</Page>
  if (game === undefined || !uid || !s) return <Page>Loading…</Page>
  if (game === null) return <Page>Game not found.</Page>

  const byForfeit = !!game.forfeit && s.winner === other(game.forfeit)
  const loserLeft =
    byForfeit &&
    typeof game.presence?.[game.players[game.forfeit!]!] === 'number'

  let status: string
  if (!game.players.O) {
    status = seat
      ? 'Waiting for an opponent. Send them the invite link.'
      : hostOnline
        ? 'Joining…'
        : "The host is away. You'll join when they're back."
  } else if (s.winner === 'draw') {
    status = 'Draw!'
  } else if (s.winner) {
    const how = byForfeit
      ? loserLeft
        ? ' (opponent left)'
        : ' (opponent resigned)'
      : ''
    status =
      s.winner === seat
        ? `You win!${how}`
        : byForfeit && !loserLeft
          ? 'You resigned.'
          : 'You lose.'
  } else {
    status = s.turn === seat ? 'Your turn' : "Opponent's turn"
    if (s.activeBoard === null) status += ' (any board)'
  }

  return (
    <Page>
      <p>
        You are {seat} · X {game.score.X} · O {game.score.O} · Draws{' '}
        {game.score.draw}
      </p>
      <p className="text-xl font-bold">{status}</p>
      {idle && (
        <p className="text-red-600">
          Disconnected after 10 minutes without activity.{' '}
          <button className="underline" onClick={() => setIdle(false)}>
            Reconnect
          </button>
        </p>
      )}
      {inPlay && opponentAway !== null && (
        <p className="text-red-600">
          Opponent disconnected. If they don't return within{' '}
          {FORFEIT_AFTER / 1000}s, you win.
        </p>
      )}

      <Board
        state={s}
        locked={!inPlay || s.turn !== seat}
        onPlay={(b, c) => {
          if (inPlay && s.turn === seat && canPlay(s, b, c))
            sendMove(id, game, b, c).catch(() => {})
        }}
      />

      <div className="flex gap-4">
        {seat && !game.players.O && (
          <button
            className="border px-3 py-1"
            onClick={() =>
              navigator.clipboard
                .writeText(location.href)
                .then(() => setCopied(true))
                .catch(() => {})
            }
          >
            {copied ? 'Link copied!' : 'Copy invite link'}
          </button>
        )}
        {/* Rematch needs the opponent here, or it would forfeit straight away. */}
        {seat && s.winner && !idle && opponentAway === null && (
          <button
            className="border px-3 py-1"
            // Both players may click; the second one is rejected by the rules.
            onClick={() => rematch(id, game, s.winner!).catch(() => {})}
          >
            Rematch
          </button>
        )}
        {inPlay &&
          (confirmResign ? (
            <>
              <button
                className="border border-red-600 px-3 py-1 text-red-600"
                onClick={() => {
                  setConfirmResign(false)
                  forfeit(id, seat!).catch(() => {})
                }}
              >
                Yes, resign
              </button>
              <button
                className="border px-3 py-1"
                onClick={() => setConfirmResign(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="border px-3 py-1"
              onClick={() => setConfirmResign(true)}
            >
              Resign
            </button>
          ))}
      </div>
    </Page>
  )
}
