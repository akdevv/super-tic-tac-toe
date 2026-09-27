import { useState } from 'react'
import { Link } from 'react-router'
import { canPlay, newGame, play } from '../lib/game.ts'

const range9 = [...Array(9).keys()]

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

      <div className="grid grid-cols-3 gap-2">
        {range9.map((b) => {
          const result = s.boards[b]
          const playable = !s.winner && !result && (s.activeBoard ?? b) === b
          return (
            <div
              key={b}
              className={`relative grid grid-cols-3 gap-0.5 p-1 ${playable ? 'bg-yellow-200' : 'bg-gray-300'}`}
            >
              {range9.map((c) => (
                <button
                  key={c}
                  aria-label={`Board ${b + 1}, cell ${c + 1}`}
                  disabled={!canPlay(s, b, c)}
                  onClick={() => move(b, c)}
                  className={`size-8 bg-white font-bold sm:size-10 ${s.cells[b * 9 + c] === 'X' ? 'text-red-600' : 'text-blue-600'} enabled:hover:bg-yellow-100`}
                >
                  {s.cells[b * 9 + c]}
                </button>
              ))}
              {result && (
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-white/80 text-6xl font-bold ${result === 'X' ? 'text-red-600' : result === 'O' ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {result === 'draw' ? '–' : result}
                </div>
              )}
            </div>
          )
        })}
      </div>

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
