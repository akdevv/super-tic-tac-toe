import type { Player } from '../game/engine.ts'

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
