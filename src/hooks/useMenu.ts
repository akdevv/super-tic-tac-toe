import { useState, type ReactNode } from 'react'
import { sfx } from '../audio/sfx.ts'
import type { Pad } from '../components/Device.tsx'

export interface MenuEntry {
  label: ReactNode
  onSelect: () => void
  disabled?: boolean
  /** One line shown under the menu while this entry is selected. */
  hint?: string
  /** Left/right on the D-pad, for option rows like "LEVEL ‹ HARD ›". */
  onLeft?: () => void
  onRight?: () => void
}

const withSound = (sound: () => void, fn: () => void) => () => {
  sound()
  fn()
}

/** Selection state for a menu, plus the pad bindings that drive it. */
export function useMenu(entries: MenuEntry[], onBack?: () => void) {
  const [raw, setSel] = useState(0)
  const sel = Math.min(raw, entries.length - 1)
  const entry = entries[sel]

  // Step up/down, wrapping around and skipping disabled entries.
  const move = (step: number) => {
    for (let i = 1; i <= entries.length; i++) {
      const next = (sel + step * i + entries.length * i) % entries.length
      if (!entries[next].disabled) {
        sfx.move()
        return setSel(next)
      }
    }
  }

  const pad: Pad = {
    up: () => move(-1),
    down: () => move(1),
    left: entry?.onLeft && withSound(sfx.move, entry.onLeft),
    right: entry?.onRight && withSound(sfx.move, entry.onRight),
    a:
      entry && !entry.disabled
        ? withSound(sfx.select, entry.onSelect)
        : undefined,
    b: onBack && withSound(sfx.back, onBack),
  }
  return { sel, setSel, pad }
}
