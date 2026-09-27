import { canPlay, type GameState } from '../lib/game.ts'

const range9 = [...Array(9).keys()]

interface Props {
  state: GameState
  onPlay: (board: number, cell: number) => void
  /** Disables all cells, e.g. when it's not your turn online. */
  locked?: boolean
}

export default function Board({ state: s, onPlay, locked }: Props) {
  return (
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
                disabled={locked || !canPlay(s, b, c)}
                onClick={() => onPlay(b, c)}
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
  )
}
