import type { Pad, PadKey } from './pad.ts'

export function Stripes({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex flex-col gap-0.5 ${className}`}>
      <span className="h-0.5 rounded-full bg-[#a8336a]" />
      <span className="h-0.5 rounded-full bg-[#3d5cb8]" />
    </span>
  )
}

type KeyProps = (k: PadKey) => {
  disabled: boolean
  onClick?: () => void
  'data-pressed'?: string
}

const ARROW = {
  up: 'M4 1.5 L6.5 5.5 L1.5 5.5 Z',
  down: 'M4 6.5 L6.5 2.5 L1.5 2.5 Z',
  left: 'M1.5 4 L5.5 1.5 L5.5 6.5 Z',
  right: 'M6.5 4 L2.5 1.5 L2.5 6.5 Z',
}

export function DPad({ keyProps }: { keyProps: KeyProps }) {
  const arms = [
    { k: 'up', pos: 'left-1/3 top-0 h-1/3 w-1/3 rounded-t-sm' },
    { k: 'down', pos: 'bottom-0 left-1/3 h-1/3 w-1/3 rounded-b-sm' },
    { k: 'left', pos: 'top-1/3 left-0 h-1/3 w-1/3 rounded-l-sm' },
    { k: 'right', pos: 'top-1/3 right-0 h-1/3 w-1/3 rounded-r-sm' },
  ] as const
  return (
    <div className="well relative size-31 shrink-0 rounded-full sm:size-33">
      <div
        className="absolute inset-3"
        style={{
          filter:
            'drop-shadow(0 3px 0 #0b0b0e) drop-shadow(0 5px 6px rgb(0 0 0 / 0.45))',
        }}
      >
        <div className="absolute inset-y-0 left-1/3 w-1/3 rounded-sm bg-linear-to-b from-[#302f39] to-[#1e1d24] shadow-[inset_0_1.5px_0_rgb(255_255_255/0.1)]" />
        <div className="absolute inset-x-0 top-1/3 h-1/3 rounded-sm bg-linear-to-b from-[#2b2a33] to-[#201f26]" />
        <div className="absolute top-1/3 left-1/3 flex size-1/3 items-center justify-center">
          <span className="size-3 rounded-full bg-[#1a1920] shadow-[inset_0_1px_2px_rgb(0_0_0/0.7),0_1px_0_rgb(255_255_255/0.05)]" />
        </div>
        {arms.map(({ k, pos }) => (
          <button
            key={k}
            type="button"
            aria-label={k}
            className={`absolute ${pos} focus-visible:outline-lcd-3 flex items-center justify-center text-[#5d5c6e] focus-visible:outline-2 enabled:cursor-pointer enabled:active:bg-black/25 disabled:text-[#3a3944] data-pressed:bg-black/25`}
            {...keyProps(k)}
          >
            <svg viewBox="0 0 8 8" className="size-2.5" fill="currentColor">
              <path d={ARROW[k]} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export function FaceButtons({
  keyProps,
  labels,
}: {
  keyProps: KeyProps
  labels?: Pad['labels']
}) {
  const face = (k: 'a' | 'b', pos: string) => (
    <div className={`absolute ${pos} flex w-13 flex-col items-center`}>
      <button
        type="button"
        aria-label={`${k.toUpperCase()}${labels?.[k] ? `: ${labels[k]}` : ''}`}
        className="key key-a focus-visible:outline-lcd-3 size-13 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 enabled:cursor-pointer disabled:brightness-[0.88]"
        {...keyProps(k)}
      />
      <span className="font-case text-ink-dim mt-2.5 text-[13px] leading-none font-extrabold italic">
        {k.toUpperCase()}
      </span>
      <span className="font-case text-ink-dim/75 mt-1 min-h-3 text-[9px] leading-none font-semibold tracking-[0.06em] whitespace-nowrap italic">
        {labels?.[k] ?? ''}
      </span>
    </div>
  )
  return (
    <div className="relative h-33.5 w-37.5 shrink-0">
      <span
        aria-hidden="true"
        className="well absolute top-4.5 left-0.5 h-16.5 w-36.5 rotate-[-25deg] rounded-full"
      />
      {face('b', 'top-10.5 left-3')}
      {face('a', 'top-2.5 right-3')}
    </div>
  )
}

export function PillKey({
  name,
  label,
  glow,
  ...props
}: {
  name: string
  label?: string
  glow?: boolean
  disabled: boolean
  onClick?: () => void
  'data-pressed'?: string
}) {
  return (
    <button
      type="button"
      aria-label={label ? `${name}: ${label}` : name}
      className="group focus-visible:outline-lcd-3 flex min-h-11 min-w-16 flex-col items-center justify-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 enabled:cursor-pointer"
      {...props}
    >
      <span
        className={`well flex h-4.75 w-14 rotate-[-25deg] items-center justify-center rounded-full ${
          glow ? 'animate-blink outline-lcd-3 outline-2 outline-offset-2' : ''
        }`}
      >
        <span
          data-pressed={props['data-pressed']}
          className="key key-pill block h-2.5 w-11 rounded-full group-enabled:group-active:translate-y-0.5"
        />
      </span>
      <span className="font-case flex flex-col items-center gap-0.5 leading-none italic">
        <span className="text-ink-dim text-[10px] font-extrabold tracking-widest">
          {name}
        </span>
        <span className="text-ink-dim/70 min-h-2.5 text-[8px] font-semibold tracking-[0.06em]">
          {label && label !== name ? label : ''}
        </span>
      </span>
    </button>
  )
}
