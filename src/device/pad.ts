import { useEffect, useRef } from 'react'
import { toggleSound } from '../feedback/sfx.ts'

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
export function useKeyboard(
  pad: Pad | undefined,
  onPress: (k: PadKey) => void,
) {
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
