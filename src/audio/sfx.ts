import type { Player } from '../game/engine.ts'
import { createSetting } from './setting.ts'

// Chiptune sound effects, synthesized with Web Audio (no audio files).
// Square/triangle waves with quick decays, like an old handheld's speaker.

let ctx: AudioContext | null = null
let master: GainNode | null = null

function audio(): AudioContext | null {
  if (ctx) return ctx
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctx) return null
  ctx = new Ctx()
  master = ctx.createGain()
  master.gain.value = 0.16 // overall volume; individual sounds scale below this
  master.connect(ctx.destination)
  return ctx
}

// Browsers (iOS especially) only start audio inside a user gesture: open it
// on the first tap or key press.
function unlock() {
  const c = audio()
  if (c?.state === 'suspended') c.resume()
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

// --- Sound on/off (remembered) ---

export const sound = createSetting('sttt:sound')

/** Flips sound; a blip confirms it's back on. */
export function toggleSound() {
  sound.set(!sound.get())
  if (sound.get()) sfx.select()
}

// --- Synth ---

interface Opts {
  type?: OscillatorType
  vol?: number
  /** Seconds from now. */
  at?: number
  /** Slide to this frequency over the note. */
  to?: number
}

function tone(freq: number, dur: number, opts: Opts = {}) {
  if (!sound.get()) return
  const c = audio()
  if (!c || !master) return
  if (c.state === 'suspended') c.resume()
  const { type = 'square', vol = 0.4, at = 0, to } = opts
  const t = c.currentTime + at
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
  gain.gain.setValueAtTime(vol, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

/** Notes played back to back: [frequency Hz, seconds]. */
function tune(notes: [number, number][], type: OscillatorType, vol: number) {
  let at = 0
  for (const [freq, dur] of notes) {
    tone(freq, dur, { type, vol, at })
    at += dur
  }
}

// Note frequencies (Hz)
const C4 = 262,
  E4 = 330,
  G4 = 392,
  C5 = 523,
  E5 = 659,
  G5 = 784,
  B5 = 988,
  C6 = 1047,
  E6 = 1319

export const sfx = {
  /** Physical key click. */
  key: () => tone(1800, 0.025, { vol: 0.12 }),
  /** Menu cursor / board cursor step. */
  move: () => tone(880, 0.045, { vol: 0.25 }),
  select: () =>
    tune(
      [
        [B5, 0.05],
        [E6, 0.08],
      ],
      'square',
      0.3,
    ),
  back: () =>
    tune(
      [
        [G5, 0.05],
        [C5, 0.07],
      ],
      'square',
      0.3,
    ),
  /** A mark lands: X rises, O falls, so the two sound different. */
  place: (p: Player) =>
    p === 'X'
      ? tone(660, 0.08, { vol: 0.35, to: 990 })
      : tone(560, 0.08, { vol: 0.35, to: 380 }),
  /** Tapped somewhere you can't play. */
  blocked: () => tone(150, 0.12, { vol: 0.3, to: 110 }),
  undo: () => tone(900, 0.1, { vol: 0.28, to: 450 }),
  /** New round starting. */
  start: () =>
    tune(
      [
        [G4, 0.06],
        [C5, 0.06],
        [E5, 0.1],
      ],
      'square',
      0.3,
    ),
  /** A small board was won. */
  board: () =>
    tune(
      [
        [C5, 0.06],
        [E5, 0.06],
        [G5, 0.1],
      ],
      'square',
      0.32,
    ),
  win: () =>
    tune(
      [
        [C5, 0.09],
        [E5, 0.09],
        [G5, 0.09],
        [C6, 0.28],
      ],
      'square',
      0.35,
    ),
  lose: () =>
    tune(
      [
        [G4, 0.14],
        [E4, 0.14],
        [C4, 0.32],
      ],
      'triangle',
      0.5,
    ),
  draw: () =>
    tune(
      [
        [E5, 0.12],
        [E5, 0.22],
      ],
      'triangle',
      0.45,
    ),
}
