import type { ReactNode } from 'react'
import type { Result } from '../game/engine.ts'
import Sprite, { DrawMark } from './Sprite.tsx'

export function ScreenOverlay({
  title,
  label = title,
  children,
}: {
  title?: string
  label?: string
  children: ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-label={label}
      className="bg-lcd-0/95 land:gap-2 land:p-2 absolute inset-0 z-20 flex flex-col items-center justify-center-safe gap-3 overflow-y-auto p-2.5 sm:p-4"
    >
      {title && <p className="text-xs">{title}</p>}
      {children}
    </div>
  )
}

export function ResultBanner({
  winner,
  title,
  hint,
  onDismiss,
}: {
  winner: NonNullable<Result>
  title: string
  hint: string
  onDismiss: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`${title}. Hide this message to see the board.`}
        className="animate-pop border-lcd-3 bg-lcd-0 pointer-events-auto flex cursor-pointer flex-col items-center gap-3 border-2 px-5 py-4 text-center shadow-[0_0_0_4px_var(--color-lcd-0),0_0_0_6px_var(--color-lcd-1)] focus-visible:outline-none"
      >
        {winner === 'draw' ? (
          <DrawMark className="animate-pop text-lcd-3 w-16" />
        ) : (
          <Sprite p={winner} className="animate-pop text-lcd-3 size-10" />
        )}
        <span className="text-xs sm:text-sm">{title}</span>
        <span className="animate-blink text-lcd-2 text-[7px] leading-loose sm:text-[8px]">
          {hint}
        </span>
      </button>
    </div>
  )
}

export function ScreenChip({
  children,
  blink,
}: {
  children: ReactNode
  blink?: boolean
}) {
  return (
    <p
      role="status"
      className={`border-lcd-3 bg-lcd-0 pointer-events-none absolute inset-x-0 bottom-2 z-10 mx-auto w-fit max-w-[90%] border px-2.5 py-1.5 text-center text-[7px] leading-relaxed sm:text-[8px] ${
        blink ? 'animate-blink' : ''
      }`}
    >
      {children}
    </p>
  )
}
