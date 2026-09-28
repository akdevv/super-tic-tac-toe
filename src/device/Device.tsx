import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { haptic } from '../feedback/haptics.ts'
import { sfx } from '../feedback/sfx.ts'
import { LogoMark } from '../screen/Logo.tsx'
import { DPad, FaceButtons, PillKey, Stripes } from './Controls.tsx'
import { useKeyboard, type Pad, type PadKey } from './pad.ts'

type Led = 'on' | 'blink' | 'off'

export default function Device({
  children,
  title,
  pad,
  led = 'on',
  ledLabel = 'POWER',
  glow,
}: {
  children: ReactNode
  title?: string
  pad?: Pad
  led?: Led
  ledLabel?: string
  glow?: 'start'
}) {
  useEffect(() => {
    document.title = title
      ? `${title} · Super Tic-Tac-Toe`
      : 'Super Tic-Tac-Toe'
  }, [title])

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
        <div
          style={{ gridArea: 'screen' }}
          className="bezel land:w-[calc(100svh-126px)] land:px-3.5 land:pt-2 land:pb-3.5 rounded-[10px] px-3.5 pt-2.5 pb-3.5 sm:px-5 sm:pt-3 sm:pb-5"
        >
          <div className="land:mb-2 mb-2.5 flex items-center gap-2.5 sm:mb-3">
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                aria-hidden="true"
                className="well flex size-2.75 items-center justify-center rounded-full"
              >
                <span
                  className={`size-1.75 rounded-full ${
                    led === 'off'
                      ? 'bg-[#43222a]'
                      : 'bg-led shadow-[0_0_6px_1px_rgb(255_59_59/0.65),inset_0_1px_0_rgb(255_255_255/0.45)]'
                  } ${led === 'blink' ? 'animate-blink' : ''}`}
                />
              </span>
              <span className="font-case text-ink-dim text-[9px] font-semibold tracking-widest italic">
                {ledLabel}
              </span>
            </span>
            <Stripes className="flex-1" />
            <span className="font-case text-ink-dim text-[9px] font-extrabold tracking-[0.12em] whitespace-nowrap italic">
              PIXEL MATRIX
            </span>
            <Stripes className="w-5 sm:w-8" />
          </div>
          <div className="lcd text-lcd-3 land:p-2.5 rounded-sm p-2.5 sm:p-4">
            {/* Same size on every page: square board + 52px of score and status lines. */}
            <div className="@container">
              <div className="flex h-[calc(100cqw+52px)] flex-col overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/"
          style={{ gridArea: 'brand' }}
          className="font-case text-ink-dim hover:text-ink focus-visible:outline-lcd-3 land:hidden tiny:hidden short:mt-2.5 mt-4 flex w-fit items-center gap-2 rounded-sm text-[15px] leading-none font-extrabold tracking-[0.02em] italic focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base"
        >
          <LogoMark className="size-6" plate />
          SUPER TIC-TAC-TOE
        </Link>

        {pad && (
          <>
            <div
              style={{ gridArea: 'dpad' }}
              className="land:mt-0 land:self-center short:mt-3 short:zoom-[0.86] tiny:mt-2 tiny:zoom-[0.74] mt-5 justify-self-start sm:mt-6"
            >
              <DPad keyProps={key} />
            </div>
            <div
              style={{ gridArea: 'face' }}
              className="land:mt-0 land:self-center short:mt-3 short:zoom-[0.86] tiny:mt-2 tiny:zoom-[0.74] mt-5 justify-self-end sm:mt-6"
            >
              <FaceButtons keyProps={key} labels={pad.labels} />
            </div>
            {/* Shifted left to clear the speaker grille and the B label. */}
            <div
              style={{ gridArea: 'select' }}
              className="land:m-0 land:translate-x-0 land:self-end land:justify-self-center short:mt-2 short:zoom-[0.9] tiny:mt-1.5 tiny:zoom-[0.8] mt-3 mr-2.5 -translate-x-10 justify-self-end sm:mr-3.5"
            >
              <PillKey
                name="SELECT"
                label={pad.labels?.select}
                {...key('select')}
              />
            </div>
            <div
              style={{ gridArea: 'start' }}
              className="land:m-0 land:translate-x-0 land:self-end land:justify-self-center short:mt-2 short:zoom-[0.9] tiny:mt-1.5 tiny:zoom-[0.8] mt-3 ml-2.5 -translate-x-10 justify-self-start sm:ml-3.5"
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

        <span
          aria-hidden="true"
          className="land:hidden tiny:hidden font-case short:bottom-1 sm:short:bottom-1 pointer-events-none absolute bottom-2.5 left-6 text-[8px] font-extrabold tracking-[0.3em] text-[#1c1b23] italic [text-shadow:0_1px_0_rgb(255_255_255/0.07)] sm:bottom-3.5 sm:left-8"
        >
          AKDEVV
        </span>

        <div
          aria-hidden="true"
          className="land:hidden tiny:hidden absolute right-7 bottom-10 flex rotate-[-28deg] gap-1.75 sm:right-9 sm:bottom-12"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="well h-10 w-1.25 rounded-full" />
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
