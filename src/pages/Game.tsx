import { useState } from 'react'
import { Link } from 'react-router'
import Board from '../components/Board.tsx'
import { newGame, play } from '../lib/game.ts'

export default function Game() {
  // ponytail: full state history — undo is just pop, 82 states max.
  const [history, setHistory] = useState([newGame()])
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 })
  const s = history[history.length - 1]

  function move(board: number, cell: number) {
    const next = play(s, board, cell)
    setHistory([...history, next])
    if (next.winner)
      setScore({ ...score, [next.winner]: score[next.winner] + 1 })
  }

  function restart() {
    // Starter alternates each game.
    setHistory([newGame(history[0].turn === 'X' ? 'O' : 'X')])
  }

  const status = s.winner
    ? s.winner === 'draw'
      ? 'Draw!'
      : `${s.winner} wins!`
    : `${s.turn} to move${s.activeBoard === null ? ' (any board)' : ''}`

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Link to="/" className="underline">
        Back home
      </Link>
      <p>
        X {score.X} · O {score.O} · Draws {score.draw}
      </p>
      <p className="text-xl font-bold">{status}</p>

      <Board state={s} onPlay={move} />

      <div className="flex gap-4">
        <button
          className="border px-3 py-1 disabled:opacity-40"
          // Finished games are locked so the score can't be counted twice.
          disabled={history.length === 1 || s.winner !== null}
          onClick={() => setHistory(history.slice(0, -1))}
        >
          Undo
        </button>
        <button className="border px-3 py-1" onClick={restart}>
          New game
        </button>
      </div>
    </main>
  )
}
