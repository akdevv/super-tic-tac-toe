import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { haptic } from '../audio/haptics.ts'
import { sfx, toggleSound } from '../audio/sfx.ts'
import { LogoMark } from './Logo.tsx'

export type PadKey =
  'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select'

/** What each console key does on the current screen. Missing = disabled. */
export type Pad = Partial<Record<PadKey, () => void>> & {
  labels?: Partial<Record<'a' | 'b' | 'start' | 'select', string>>
}

const KEYMAP: Record<string, PadKey> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'a',
  ' ': 'a',
  Backspace: 'b',
  Escape: 'start',
  h: 'select',
  '?': 'select',
}

/** Keyboard -> pad. Enter/Space on a focused button stay native clicks. */
function useKeyboard(pad: Pad | undefined, onPress: (k: PadKey) => void) {
  const latest = useRef({ pad, onPress })
  useEffect(() => {
    latest.current = { pad, onPress }
  })
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'm' || e.key === 'M') return toggleSound()
      const key = KEYMAP[e.key]
      if (!key) return
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)
        return
      const onControl =
        el instanceof HTMLButtonElement || el instanceof HTMLAnchorElement
      if (key === 'a' && onControl) return
      const action = latest.current.pad?.[key]
      e.preventDefault()
      if (!action) return
      latest.current.onPress(key)
      action()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

type Led = 'on' | 'blink' | 'off'

/**
 * The handheld console. The screen shows `children`; the D-pad, A/B and
 * START/SELECT keys (and the keyboard) drive `pad`.
 */
export default function Device({
  children,
  pad,
  led = 'on',
  ledLabel = 'POWER',
  glow,
}: {
  children: ReactNode
  pad?: Pad
  led?: Led
  ledLabel?: string
  /** Makes one key pulse, to point first-time players at it. */
  glow?: 'start'
}) {
  const [pressed, setPressed] = useState<PadKey | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useKeyboard(pad, (k) => {
    sfx.key()
    setPressed(k)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPressed(null), 120)
  })

  const key = (k: PadKey) => ({
    disabled: !pad?.[k],
    onClick: () => {
      haptic.key()
      sfx.key()
      pad?.[k]?.()
    },
    'data-pressed': pressed === k ? '' : undefined,
  })

  return (
    <main className="land:p-2 sm:short:py-4 flex min-h-dvh flex-col items-center justify-center gap-5 px-3 py-4 sm:p-8">
      <div className="shell console-grid land:w-auto land:max-w-none land:rounded-[30px] land:px-6 land:py-4 short:pt-3 short:pb-5 tiny:pb-3 relative w-full rounded-[20px_20px_72px_20px] px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10">
        {/* Screen surround. In landscape its width follows the viewport height. */}
        <div
          style={{ gridArea: 'screen' }}
          className="bezel land:w-[calc(100svh-126px)] land:px-3.5 land:pt-2 land:pb-3.5 rounded-[10px] px-3.5 pt-2.5 pb-3.5 sm:px-5 sm:pt-3 sm:pb-5"
        >
          <div className="land:mb-2 mb-2.5 flex items-center gap-2.5 sm:mb-3">
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                aria-hidden="true"
                className="well flex size-[11px] items-center justify-center rounded-full"
              >
                <span
                  className={`size-[7px] rounded-full ${
                    led === 'off'
                      ? 'bg-[#43222a]'
                      : 'bg-led shadow-[0_0_6px_1px_rgb(255_59_59/0.65),inset_0_1px_0_rgb(255_255_255/0.45)]'
                  } ${led === 'blink' ? 'animate-blink' : ''}`}
                />
              </span>
              <span className="font-case text-ink-dim text-[9px] font-semibold tracking-[0.1em] italic">
                {ledLabel}
              </span>
            </span>
            <Stripes className="flex-1" />
            <span className="font-case text-ink-dim text-[9px] font-extrabold tracking-[0.12em] whitespace-nowrap italic">
              PIXEL MATRIX
            </span>
            <Stripes className="w-5 sm:w-8" />
          </div>
          <div className="lcd text-lcd-3 land:p-2.5 rounded-[4px] p-2.5 sm:p-4">
            {/* Every page gets the same screen size: the game's board (full
                width, square) plus its score strip and status line (52px). */}
            <div className="@container">
              <div className="flex h-[calc(100cqw+52px)] flex-col overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Brand, printed on the case. No room for it in landscape. */}
        <Link
          to="/"
          style={{ gridArea: 'brand' }}
          className="font-case text-ink-dim hover:text-ink focus-visible:outline-lcd-3 land:hidden tiny:hidden short:mt-2.5 mt-4 flex w-fit items-center gap-2 rounded-sm text-[15px] leading-none font-extrabold tracking-[0.02em] italic focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base"
        >
          <LogoMark className="size-[18px]" plate />
          SUPER TIC-TAC-TOE
        </Link>

        {pad && (
          <>
            <div
              style={{ gridArea: 'dpad' }}
              className="land:mt-0 land:self-center short:mt-3 short:[zoom:0.86] tiny:mt-2 tiny:[zoom:0.74] mt-5 justify-self-start sm:mt-6"
            >
              <DPad keyProps={key} />
            </div>
            <div
              style={{ gridArea: 'face' }}
              className="land:mt-0 land:self-center short:mt-3 short:[zoom:0.86] tiny:mt-2 tiny:[zoom:0.74] mt-5 justify-self-end sm:mt-6"
            >
              <FaceButtons keyProps={key} labels={pad.labels} />
            </div>
            {/* Shifted left in portrait to clear the speaker grille and the B label. */}
            <div
              style={{ gridArea: 'select' }}
              className="land:m-0 land:translate-x-0 land:self-end land:justify-self-center short:mt-2 short:[zoom:0.9] tiny:mt-1.5 tiny:[zoom:0.8] mt-3 mr-2.5 -translate-x-10 justify-self-end sm:mr-3.5"
            >
              <PillKey
                name="SELECT"
                label={pad.labels?.select}
                {...key('select')}
              />
            </div>
            <div
              style={{ gridArea: 'start' }}
              className="land:m-0 land:translate-x-0 land:self-end land:justify-self-center short:mt-2 short:[zoom:0.9] tiny:mt-1.5 tiny:[zoom:0.8] mt-3 ml-2.5 -translate-x-10 justify-self-start sm:ml-3.5"
            >
              <PillKey
                name="START"
                label={pad.labels?.start}
                glow={glow === 'start'}
                {...key('start')}
              />
            </div>
          </>
        )}

        {/* Maker's mark moulded into the case: barely there, like a model number. */}
        <span
          aria-hidden="true"
          className="land:hidden tiny:hidden font-case short:bottom-1 sm:short:bottom-1 pointer-events-none absolute bottom-2.5 left-6 text-[8px] font-extrabold tracking-[0.3em] text-[#1c1b23] italic [text-shadow:0_1px_0_rgb(255_255_255/0.07)] sm:bottom-3.5 sm:left-8"
        >
          AKDEVV
        </span>

        {/* Speaker grille, decorative. */}
        <div
          aria-hidden="true"
          className="land:hidden tiny:hidden absolute right-7 bottom-10 flex -rotate-[28deg] gap-[7px] sm:right-9 sm:bottom-12"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="well h-10 w-[5px] rounded-full" />
          ))}
        </div>
      </div>

      {pad && (
        <p className="font-case text-ink-dim land:hidden hidden flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] italic sm:pointer-fine:flex">
          {[
            ['Arrows', 'move'],
            ['Enter', 'A'],
            ['Backspace', 'B'],
            ['Esc', 'Start'],
            ['H', 'Select'],
            ['M', 'Sound'],
          ].map(([k, v]) => (
            <span key={k}>
              <kbd className="bg-shell font-case text-ink rounded-sm px-1.5 py-0.5 not-italic shadow-[0_1px_0_#101016]">
                {k}
              </kbd>{' '}
              {v}
            </span>
          ))}
        </p>
      )}
    </main>
  )
}

/** The two coloured pinstripes printed on the screen surround. */
function Stripes({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex flex-col gap-[2px] ${className}`}>
      <span className="h-[2px] rounded-full bg-[#a8336a]" />
      <span className="h-[2px] rounded-full bg-[#3d5cb8]" />
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

/** Cross-shaped D-pad sitting in a round recess. */
function DPad({ keyProps }: { keyProps: KeyProps }) {
  const arms = [
    { k: 'up', pos: 'left-1/3 top-0 h-1/3 w-1/3 rounded-t-[4px]' },
    { k: 'down', pos: 'bottom-0 left-1/3 h-1/3 w-1/3 rounded-b-[4px]' },
    { k: 'left', pos: 'top-1/3 left-0 h-1/3 w-1/3 rounded-l-[4px]' },
    { k: 'right', pos: 'top-1/3 right-0 h-1/3 w-1/3 rounded-r-[4px]' },
  ] as const
  return (
    <div className="well relative size-[124px] shrink-0 rounded-full sm:size-[132px]">
      <div
        className="absolute inset-[12px]"
        // One shadow for the whole cross so the arms read as one piece.
        style={{
          filter:
            'drop-shadow(0 3px 0 #0b0b0e) drop-shadow(0 5px 6px rgb(0 0 0 / 0.45))',
        }}
      >
        <div className="absolute inset-y-0 left-1/3 w-1/3 rounded-[4px] bg-gradient-to-b from-[#302f39] to-[#1e1d24] shadow-[inset_0_1.5px_0_rgb(255_255_255/0.1)]" />
        <div className="absolute inset-x-0 top-1/3 h-1/3 rounded-[4px] bg-gradient-to-b from-[#2b2a33] to-[#201f26]" />
        <div className="absolute top-1/3 left-1/3 flex size-1/3 items-center justify-center">
          <span className="size-3 rounded-full bg-[#1a1920] shadow-[inset_0_1px_2px_rgb(0_0_0/0.7),0_1px_0_rgb(255_255_255/0.05)]" />
        </div>
        {arms.map(({ k, pos }) => (
          <button
            key={k}
            type="button"
            aria-label={k}
            className={`absolute ${pos} focus-visible:outline-lcd-3 flex items-center justify-center text-[#5d5c6e] focus-visible:outline-2 enabled:cursor-pointer enabled:active:bg-black/25 disabled:text-[#3a3944] data-[pressed]:bg-black/25`}
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

/** A and B in a tilted capsule recess, labels printed underneath. */
function FaceButtons({
  keyProps,
  labels,
}: {
  keyProps: KeyProps
  labels?: Pad['labels']
}) {
  const face = (k: 'a' | 'b', pos: string) => (
    <div className={`absolute ${pos} flex w-[52px] flex-col items-center`}>
      <button
        type="button"
        aria-label={`${k.toUpperCase()}${labels?.[k] ? `: ${labels[k]}` : ''}`}
        className="key key-a focus-visible:outline-lcd-3 size-[52px] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 enabled:cursor-pointer disabled:brightness-[0.88]"
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
    <div className="relative h-[134px] w-[150px] shrink-0">
      <span
        aria-hidden="true"
        className="well absolute top-[18px] left-[2px] h-[66px] w-[146px] -rotate-[25deg] rounded-full"
      />
      {face('b', 'top-[42px] left-[12px]')}
      {face('a', 'top-[10px] right-[12px]')}
    </div>
  )
}

/** Slim START / SELECT key in its own slot. */
function PillKey({
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
        className={`well flex h-[19px] w-[56px] -rotate-[25deg] items-center justify-center rounded-full ${
          glow ? 'animate-blink outline-lcd-3 outline-2 outline-offset-2' : ''
        }`}
      >
        <span
          data-pressed={props['data-pressed']}
          className="key key-pill block h-[10px] w-[44px] rounded-full group-enabled:group-active:translate-y-[2px]"
        />
      </span>
      <span className="font-case flex flex-col items-center gap-0.5 leading-none italic">
        <span className="text-ink-dim text-[10px] font-extrabold tracking-[0.1em]">
          {name}
        </span>
        <span className="text-ink-dim/70 min-h-2.5 text-[8px] font-semibold tracking-[0.06em]">
          {label && label !== name ? label : ''}
        </span>
      </span>
    </button>
  )
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Score strip across the top of the screen. */
export function Hud({ items }: { items: [label: string, value: number][] }) {
  return (
    <dl className="text-lcd-2 mb-2.5 flex justify-between text-[8px]">
      {items.map(([label, value]) => (
        <div key={label} className="flex gap-1.5">
          <dt>{label}</dt>
          <dd className="text-lcd-3">{pad2(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** One-line game message under the board. */
export function StatusLine({
  children,
  icon,
}: {
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <p
      role="status"
      className="mt-2.5 flex min-h-5 items-center justify-center gap-2 text-center text-[9px] leading-relaxed whitespace-nowrap uppercase sm:text-[10px] @max-[15rem]:text-[8px]"
    >
      {icon}
      {children}
    </p>
  )
}

/** Centered message screen for loading / not found / errors. */
export function MessageScreen({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center-safe gap-4 px-2 text-center">
      <p className="text-xs leading-relaxed">{title}</p>
      {children && (
        <div className="text-lcd-2 text-[8px] leading-loose">{children}</div>
      )}
    </div>
  )
}
