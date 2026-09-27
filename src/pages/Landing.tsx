import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function Landing() {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(false)

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
      {error && (
        <p className="text-red-600">Couldn't create a game. Try again.</p>
      )}
    </main>
  )
}
