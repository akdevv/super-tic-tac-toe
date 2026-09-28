import { WebHaptics, type HapticInput } from 'web-haptics'
import { createSetting } from './setting.ts'

// iOS only allows haptics inside a real tap, so trigger from click handlers.

export const vibration = createSetting('sttt:vibration')

let instance: WebHaptics | null = null

function buzz(input: HapticInput, intensity?: number) {
  if (!vibration.get() || typeof window === 'undefined') return
  instance ??= new WebHaptics()
  instance.trigger(input, intensity ? { intensity } : undefined)
}

export function toggleVibration() {
  vibration.set(!vibration.get())
  if (vibration.get()) haptic.place()
}

export const haptic = {
  key: () => buzz([{ duration: 10 }], 0.35),
  place: () => buzz([{ duration: 18 }], 0.6),
  blocked: () => buzz('error'),
  board: () => buzz('nudge'),
  win: () => buzz('success'),
  lose: () =>
    buzz([
      { duration: 60, intensity: 0.9 },
      { delay: 70, duration: 140, intensity: 0.6 },
    ]),
  draw: () => buzz([{ duration: 40 }, { delay: 70, duration: 40 }]),
}
