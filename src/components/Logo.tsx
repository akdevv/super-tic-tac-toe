// Logo: a 19x19 pixel tic-tac-toe grid, X winning on the diagonal.
// public/favicon.svg is the same art; keep them in sync.

const X = ['#...#', '.#.#.', '..#..', '.#.#.', '#...#']
const O = ['.###.', '#...#', '#...#', '#...#', '.###.']
const LAYOUT = [
  [X, null, O],
  [null, X, null],
  [O, null, X],
]
const CELL = [1, 7, 13] // top-left pixel of each 5x5 cell
const LINES = [6, 12] // grid line positions

function pixels(mark: string[], ox: number, oy: number) {
  return mark.flatMap((row, y) =>
    [...row].flatMap((ch, x) => (ch === '#' ? [[ox + x, oy + y]] : [])),
  )
}

/** The pixel mark. `plate` draws the dark LCD square behind it. */
export function LogoMark({
  className = '',
  plate = false,
}: {
  className?: string
  plate?: boolean
}) {
  return (
    <svg
      viewBox="0 0 19 19"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {plate && <rect width="19" height="19" rx="2" fill="#0f380f" />}
      <g fill="#306230">
        {LINES.map((p) => (
          <g key={p}>
            <rect x={p} y="1" width="1" height="17" />
            <rect x="1" y={p} width="17" height="1" />
          </g>
        ))}
      </g>
      {LAYOUT.flatMap((row, r) =>
        row.map((mark, c) =>
          mark ? (
            <g key={`${r}${c}`} fill={mark === X ? '#9bbc0f' : '#8bac0f'}>
              {pixels(mark, CELL[c], CELL[r]).map(([x, y]) => (
                <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />
              ))}
            </g>
          ) : null,
        ),
      )}
    </svg>
  )
}

/** Title-screen lockup: mark above the stacked wordmark. */
export function LogoLockup() {
  return (
    <div className="land:gap-2 flex flex-col items-center gap-2.5 text-center @max-[18rem]:gap-1.5">
      <LogoMark className="land:hidden size-10 sm:size-14 @max-[18rem]:size-8 @max-[14rem]:hidden" />
      <h1 className="flex flex-col items-center gap-1.5 leading-none">
        <span className="text-lcd-2 text-[10px] tracking-[0.5em] sm:text-xs">
          SUPER
        </span>
        <span className="text-base sm:text-lg">TIC·TAC·TOE</span>
      </h1>
    </div>
  )
}
