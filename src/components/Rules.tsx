import type { ReactNode } from 'react'
import { sfx } from '../audio/sfx.ts'
import type { Player } from '../game/engine.ts'
import { RULE_PAGES } from '../hooks/useRules.ts'
import Sprite from './Sprite.tsx'

// Mini board diagrams for the rules. Marks are 9-char strings, row by row.

function Small({
  marks = '.........',
  lit,
  hot,
  className = '',
}: {
  marks?: string
  lit?: boolean
  /** Cell to point at (blinks). */
  hot?: number
  className?: string
}) {
  return (
    <div
      className={`grid aspect-square grid-cols-3 gap-px p-px ${
        lit ? 'bg-lcd-2/45' : 'bg-lcd-1'
      } ${className}`}
    >
      {[...marks].map((m, i) => (
        <div
          key={i}
          className={`flex items-center justify-center ${
            lit ? 'bg-lcd-soft' : 'bg-lcd-0'
          } ${i === hot ? 'animate-blink outline-lcd-3 z-10 outline-1' : ''}`}
        >
          {m !== '.' && (
            <Sprite
              p={m as Player}
              className={`w-[72%] ${m === 'X' ? 'text-lcd-3' : 'text-lcd-2'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Won({ p, className = '' }: { p: Player; className?: string }) {
  return (
    <div
      className={`bg-lcd-0 outline-lcd-1 flex aspect-square items-center justify-center outline-1 ${className}`}
    >
      <Sprite p={p} className="text-lcd-3 w-[72%]" />
    </div>
  )
}

/** 3x3 of small boards. Each entry: marks string, or 'X'/'O' for a won board. */
function Big({
  boards,
  lit = [],
  className = '',
}: {
  boards: string[]
  lit?: number[]
  className?: string
}) {
  return (
    <div className={`grid grid-cols-3 gap-[3px] ${className}`}>
      {boards.map((b, i) =>
        b === 'X' || b === 'O' ? (
          <Won key={i} p={b} />
        ) : (
          <Small key={i} marks={b} lit={lit.includes(i)} />
        ),
      )}
    </div>
  )
}

const Arrow = () => (
  <span aria-hidden="true" className="text-lcd-2 text-[10px]">
    ▶
  </span>
)

const EMPTY = '.........'

const PAGES: { title: string; art: ReactNode; text: ReactNode }[] = [
  {
    title: 'THE BIG BOARD',
    art: (
      <Big
        className="w-[46cqw]"
        boards={[
          'X',
          EMPTY,
          '..O......',
          '.O.......',
          'X',
          EMPTY,
          '..O......',
          EMPTY,
          'X',
        ]}
      />
    ),
    text: (
      <>
        9 small boards make one big board.
        <br />
        Win <em className="text-lcd-3 not-italic">
          3 small boards in a row
        </em>{' '}
        to win the game.
      </>
    ),
  },
  {
    title: 'YOUR MOVE SENDS',
    art: (
      <div className="flex items-center gap-3">
        <Small className="w-[22cqw]" marks="..X......" hot={2} />
        <Arrow />
        <Big className="w-[38cqw]" boards={Array(9).fill(EMPTY)} lit={[2]} />
      </div>
    ),
    text: (
      <>
        The cell you pick sends your opponent to the{' '}
        <em className="text-lcd-3 not-italic">same spot</em> on the big board.
        That board lights up.
      </>
    ),
  },
  {
    title: 'TAKE A SMALL BOARD',
    art: (
      <div className="flex items-center gap-3">
        <Small className="w-[24cqw]" marks="XXX.O.O.." />
        <Arrow />
        <Won className="w-[24cqw]" p="X" />
      </div>
    ),
    text: (
      <>
        <em className="text-lcd-3 not-italic">3 in a row</em> wins a small board
        and closes it. A full board with no line counts for nobody.
      </>
    ),
  },
  {
    title: 'FREE MOVE',
    art: (
      <Big
        className="w-[46cqw]"
        boards={[EMPTY, EMPTY, EMPTY, EMPTY, 'O', EMPTY, EMPTY, EMPTY, EMPTY]}
        lit={[0, 1, 2, 3, 5, 6, 7, 8]}
      />
    ),
    text: (
      <>
        Sent to a closed board? You can play in{' '}
        <em className="text-lcd-3 not-italic">any open board</em> instead.
      </>
    ),
  },
]

/** Illustrated how-to-play, one rule per page. State comes from useRules. */
export default function Rules({
  page,
  setPage,
  onDone,
}: {
  page: number
  setPage: (p: number) => void
  onDone: () => void
}) {
  const { title, art, text } = PAGES[page]
  const last = page === RULE_PAGES - 1
  const navBtn =
    'flex min-h-9 min-w-9 items-center justify-center px-2 text-[8px] enabled:cursor-pointer disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-lcd-3'
  return (
    <section
      aria-label="How to play"
      className="land:gap-1 land:py-0 flex h-full flex-col items-center justify-between gap-2 py-1 text-center"
    >
      <p className="text-[10px] sm:text-[11px]">
        <span className="text-lcd-2">{page + 1}.</span> {title}
      </p>
      <div className="flex flex-1 items-center justify-center">{art}</div>
      <p
        aria-live="polite"
        className="text-lcd-2 land:leading-relaxed max-w-[92%] text-[8px] leading-loose sm:text-[9px]"
      >
        {text}
      </p>
      <nav className="flex items-center gap-2" aria-label="Rule pages">
        <button
          type="button"
          className={navBtn}
          disabled={page === 0}
          onClick={() => {
            sfx.move()
            setPage(page - 1)
          }}
          aria-label="Previous rule"
        >
          ◀
        </button>
        <span className="flex gap-1.5" aria-hidden="true">
          {PAGES.map((_, i) => (
            <span
              key={i}
              className={`size-1.5 ${i === page ? 'bg-lcd-3' : 'bg-lcd-1'}`}
            />
          ))}
        </span>
        <button
          type="button"
          className={navBtn}
          onClick={() => {
            if (last) return onDone()
            sfx.move()
            setPage(page + 1)
          }}
          aria-label={last ? 'Done' : 'Next rule'}
        >
          {last ? 'DONE' : '▶'}
        </button>
      </nav>
    </section>
  )
}
