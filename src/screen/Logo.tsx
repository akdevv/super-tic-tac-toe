// public/favicon.svg and the PNG icons are this art; keep them in sync.

const X = ['#...#', '.#.#.', '..#..', '.#.#.', '#...#']
const O = ['.###.', '#...#', '#...#', '#...#', '.###.']
const LAYOUT = [
  [X, null, O],
  [null, X, null],
  [O, null, X],
]
const SIZE = 23
const CELL = [0, 8, 16]
const LINES = [7, 15]
// Tight padding for small sizes; app icons use SIZE / plate ≈ 1/φ instead.
const PAD = 2

function pixels(mark: string[], ox: number, oy: number) {
  return mark.flatMap((row, y) =>
    [...row].flatMap((ch, x) => (ch === '#' ? [[ox + x, oy + y]] : [])),
  )
}

export function LogoMark({
  className = '',
  plate = false,
}: {
  className?: string
  plate?: boolean
}) {
  const box = plate ? SIZE + 2 * PAD : SIZE
  return (
    <svg
      viewBox={plate ? `${-PAD} ${-PAD} ${box} ${box}` : `0 0 ${box} ${box}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {plate && (
        <rect
          x={-PAD}
          y={-PAD}
          width={box}
          height={box}
          rx={box * 0.2237}
          fill="#0f380f"
          shapeRendering="geometricPrecision"
        />
      )}
      <g fill="#306230">
        {LINES.map((p) => (
          <g key={p}>
            <rect x={p} y="0" width="1" height={SIZE} />
            <rect x="0" y={p} width={SIZE} height="1" />
          </g>
        ))}
      </g>
      {LAYOUT.flatMap((row, r) =>
        row.map((mark, c) =>
          mark ? (
            <g key={`${r}${c}`} fill={mark === X ? '#9bbc0f' : '#8bac0f'}>
              {pixels(mark, CELL[c] + 1, CELL[r] + 1).map(([x, y]) => (
                <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />
              ))}
            </g>
          ) : null,
        ),
      )}
    </svg>
  )
}

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
