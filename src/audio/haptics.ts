import { WebHaptics, type HapticInput } from 'web-haptics'
import { createSetting } from './setting.ts'

// Vibration feedback for phones (web-haptics). Android uses the Vibration
// API; iOS only allows haptics inside a real tap, so call these from click
// handlers where possible. Desktop: no-op.

export const vibration = createSetting('sttt:vibration')

let instance: WebHaptics | null = null

function buzz(input: HapticInput, intensity?: number) {
  if (!vibration.get() || typeof window === 'undefined') return
  instance ??= new WebHaptics()
  instance.trigger(input, intensity ? { intensity } : undefined)
}

/** Flips vibration; a tap confirms it's back on. */
export function toggleVibration() {
  vibration.set(!vibration.get())
  if (vibration.get()) haptic.place()
}

export const haptic = {
  /** Pressing a console key. */
  key: () => buzz([{ duration: 10 }], 0.35),
  /** Your mark lands. */
  place: () => buzz([{ duration: 18 }], 0.6),
  /** Tapped somewhere you can't play. */
  blocked: () => buzz('error'),
  /** A small board was won. */
  board: () => buzz('nudge'),
  win: () => buzz('success'),
  lose: () =>
    buzz([
      { duration: 60, intensity: 0.9 },
      { delay: 70, duration: 140, intensity: 0.6 },
    ]),
  draw: () => buzz([{ duration: 40 }, { delay: 70, duration: 40 }]),
}
