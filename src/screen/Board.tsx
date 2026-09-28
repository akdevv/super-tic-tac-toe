import { useEffect, useRef } from 'react'
import { canPlay, type GameState } from '../game/engine.ts'
import Sprite, { DrawMark } from './Sprite.tsx'

const range9 = [...Array(9).keys()]

interface Props {
  state: GameState
  onPlay: (board: number, cell: number) => void
  locked?: boolean
  last?: number
  /** Also the board's single Tab stop. */
  cursor: number
  showCursor?: boolean
  onCursor?: (i: number) => void
  onBlocked?: () => void
}

export default function Board({
  state: s,
  onPlay,
  locked,
  last,
  cursor,
  showCursor,
  onCursor,
  onBlocked,
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const cells = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (root.current?.contains(document.activeElement))
      cells.current[cursor]?.focus({ preventScroll: true })
  }, [cursor])

  return (
    <div
      ref={root}
      role="group"
      aria-label="Game board"
      className="grid aspect-square w-full grid-cols-3 gap-1.5"
    >
      {range9.map((b) => {
        const result = s.boards[b]
        const playable = !s.winner && !result && (s.activeBoard ?? b) === b
        return (
          <div
            key={b}
            className={`relative grid grid-cols-3 gap-px p-0.5 transition-colors ${
              playable ? 'bg-lcd-2/45' : 'bg-lcd-edge'
            }`}
          >
            {range9.map((c) => {
              const i = b * 9 + c
              const mark = s.cells[i]
              const open = !locked && canPlay(s, b, c)
              const here = showCursor && i === cursor
              return (
                <button
                  key={c}
                  ref={(el) => {
                    cells.current[i] = el
                  }}
                  type="button"
                  tabIndex={i === cursor ? 0 : -1}
                  aria-label={`Board ${b + 1}, cell ${c + 1}${mark ? `, ${mark}` : ''}`}
                  aria-disabled={!open}
                  onFocus={() => onCursor?.(i)}
                  onClick={() => (open ? onPlay(b, c) : onBlocked?.())}
                  className={`group focus-visible:outline-lcd-3 relative flex aspect-square items-center justify-center focus-visible:z-10 focus-visible:outline-2 ${
                    i === last
                      ? 'bg-lcd-1'
                      : playable
                        ? 'bg-lcd-soft'
                        : 'bg-lcd-0'
                  } transition-colors ${open ? 'hover:bg-lcd-1 cursor-pointer' : 'cursor-default'} ${
                    here ? 'outline-lcd-3 z-10 outline-2' : ''
                  }`}
                >
                  {mark ? (
                    <Sprite
                      p={mark}
                      className={`w-[70%] ${mark === 'X' ? 'text-lcd-3' : 'text-lcd-2'} ${
                        i === last ? 'animate-pop' : ''
                      }`}
                    />
                  ) : (
                    open && (
                      <Sprite
                        p={s.turn}
                        className={`text-lcd-3 w-[70%] ${
                          here
                            ? 'opacity-40'
                            : 'opacity-0 group-hover:opacity-40 group-focus-visible:opacity-40'
                        }`}
                      />
                    )
                  )}
                </button>
              )
            })}
            {result === 'draw' && (
              <div className="bg-lcd-0 absolute inset-0 flex items-center justify-center">
                <DrawMark className="animate-pop text-lcd-2 w-[62%]" />
                <span className="sr-only">Board {b + 1} drawn</span>
              </div>
            )}
            {(result === 'X' || result === 'O') && (
              <div className="bg-lcd-0 absolute inset-0 flex items-center justify-center">
                <span className="sr-only">
                  Board {b + 1} won by {result}
                </span>
                <Sprite p={result} className="animate-pop text-lcd-3 w-[72%]" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
