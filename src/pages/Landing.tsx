import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LEVELS, type Level } from '../lib/bot.ts'
import type { Player } from '../lib/game.ts'

export default function Landing() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(false)
  const [level, setLevel] = useState<Level>('medium')
  const [side, setSide] = useState<Player>('X')

  async function playOnline() {
    setCreating(true)
    setError(false)
    try {
      const { createGame } = await import('../lib/online.ts')
      navigate(`/game/${await createGame()}`)
    } catch (e) {
      console.error(e)
      setError(true)
      setCreating(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Super Tic-Tac-Toe</h1>
      <div className="flex gap-4">
        <Link to="/game" className="border px-3 py-1">
          Local game
        </Link>
        <button
          className="border px-3 py-1 disabled:opacity-40"
          disabled={creating}
          onClick={playOnline}
        >
          {creating ? 'Creating…' : 'Play online'}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select
          aria-label="Bot difficulty"
          className="border px-2 py-1"
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          {Object.keys(LEVELS).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          aria-label="Your side"
          className="border px-2 py-1"
          value={side}
          onChange={(e) => setSide(e.target.value as Player)}
        >
          <option value="X">Play as X</option>
          <option value="O">Play as O</option>
        </select>
        <Link to={`/game?bot=${level}&me=${side}`} className="border px-3 py-1">
          Play vs bot
        </Link>
      </div>
      {error && (
        <p className="text-red-600">Couldn't create a game. Try again.</p>
      )}
    </main>
  )
}
