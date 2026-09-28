import { useEffect, useRef } from 'react'
import { sfx } from '../audio/sfx.ts'
import type { MenuEntry } from '../hooks/useMenu.ts'

/** A D-pad driven list with the classic ▶ cursor. State comes from useMenu. */
export function Menu({
  entries,
  sel,
  setSel,
  label,
}: {
  entries: MenuEntry[]
  sel: number
  setSel: (i: number) => void
  label: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  // Keep DOM focus on the selected entry so screen readers follow along.
  useEffect(() => {
    refs.current[sel]?.focus({ preventScroll: true })
  }, [sel])

  return (
    <div className="flex flex-col items-center">
      <ul role="menu" aria-label={label} className="flex w-fit flex-col">
        {entries.map((e, i) => (
          <li key={i} role="none">
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="menuitem"
              disabled={e.disabled}
              tabIndex={i === sel ? 0 : -1}
              onClick={() => {
                sfx.select()
                e.onSelect()
              }}
              onMouseEnter={() => !e.disabled && setSel(i)}
              onFocus={() => setSel(i)}
              className="disabled:text-lcd-1 land:min-h-7 flex min-h-8 w-full items-center gap-3 px-2 text-left text-[10px] uppercase focus-visible:outline-none enabled:cursor-pointer sm:text-[11px] @max-[18rem]:min-h-[30px]"
            >
              <span
                aria-hidden="true"
                className={`w-3 ${i === sel ? '' : 'invisible'}`}
              >
                ▶
              </span>
              {e.label}
            </button>
          </li>
        ))}
      </ul>
      <p
        aria-live="polite"
        className="text-lcd-2 land:mt-1 mt-3 min-h-4 text-center text-[7px] leading-relaxed sm:text-[8px] @max-[18rem]:mt-1.5"
      >
        {entries[sel]?.hint}
      </p>
    </div>
  )
}

/** Fixed-width slot (the pixel font is monospace) so options don't jiggle. */
export function Slot({ chars, children }: { chars: number; children: string }) {
  return (
    <span className="inline-block text-center" style={{ width: `${chars}ch` }}>
      {children}
    </span>
  )
}
