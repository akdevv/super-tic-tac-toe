import type { Player } from '../game/engine.ts'

// 9x9 pixel art, '#' = lit pixel.
const SPRITES: Record<Player | 'draw', string[]> = {
  X: [
    '##.....##',
    '###...###',
    '.###.###.',
    '..#####..',
    '...###...',
    '..#####..',
    '.###.###.',
    '###...###',
    '##.....##',
  ],
  O: [
    '..#####..',
    '.#######.',
    '###...###',
    '##.....##',
    '##.....##',
    '##.....##',
    '###...###',
    '.#######.',
    '..#####..',
  ],
  draw: [
    '.........',
    '.........',
    '#########',
    '#########',
    '.........',
    '#########',
    '#########',
    '.........',
    '.........',
  ],
}

/** Pixel-art mark. Colour comes from `currentColor`, size from className. */
export default function Sprite({
  p,
  className = '',
}: {
  p: Player | 'draw'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {SPRITES[p].flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '#' ? (
            <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />
          ) : null,
        ),
      )}
    </svg>
  )
}

/** Draw symbol: a small X and O side by side, "shared, nobody won". */
export function DrawMark({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center gap-[12%] ${className}`}
    >
      <Sprite p="X" className="w-[44%]" />
      <Sprite p="O" className="w-[44%]" />
    </span>
  )
}
