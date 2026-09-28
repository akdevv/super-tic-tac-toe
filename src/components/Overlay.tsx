import type { ReactNode } from 'react'

/** A panel covering the LCD, for pause and help screens. */
export function ScreenOverlay({
  title,
  label = title,
  children,
}: {
  /** Visible heading; leave out when the content brings its own. */
  title?: string
  label?: string
  children: ReactNode
}) {
  return (
    <div
      role="dialog"
      aria-label={label}
      className="bg-lcd-0/95 land:gap-2 land:p-2 absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 overflow-y-auto p-2.5 sm:p-4"
    >
      {title && <p className="text-xs">{title}</p>}
      {children}
    </div>
  )
}

/** Game-over box floating over the board. Clicking it hides it. */
export function ResultBanner({
  icon,
  title,
  hint,
  onDismiss,
}: {
  icon?: ReactNode
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
        {icon}
        <span className="text-xs sm:text-sm">{title}</span>
        <span className="animate-blink text-lcd-2 text-[7px] leading-loose sm:text-[8px]">
          {hint}
        </span>
      </button>
    </div>
  )
}

/** Small notice floating over the bottom of the board (hints, warnings). */
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
