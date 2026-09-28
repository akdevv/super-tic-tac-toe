import { useEffect, useRef, useSyncExternalStore } from 'react'
import { gameSound } from '../audio/gameSound.ts'
import { haptic, toggleVibration, vibration } from '../audio/haptics.ts'
import type { Setting } from '../audio/setting.ts'
import { sfx, sound, toggleSound } from '../audio/sfx.ts'
import type { GameState, Player } from '../game/engine.ts'

const useSetting = (s: Setting) => useSyncExternalStore(s.subscribe, s.get)

/** Sound and vibration settings plus toggles, kept in sync across the app. */
export function useSettings() {
  return {
    soundOn: useSetting(sound),
    vibrationOn: useSetting(vibration),
    toggleSound,
    toggleVibration,
  }
}

// Sound plus (on phones) a matching vibration. Placing a mark only vibrates
// from the tap handler itself, so the CPU's / opponent's moves don't buzz.
const PLAY = {
  win: () => {
    sfx.win()
    haptic.win()
  },
  lose: () => {
    sfx.lose()
    haptic.lose()
  },
  draw: () => {
    sfx.draw()
    haptic.draw()
  },
  board: () => {
    sfx.board()
    haptic.board()
  },
  placeX: () => sfx.place('X'),
  placeO: () => sfx.place('O'),
  start: sfx.start,
}

/**
 * Plays sounds for things that happen on the board, whoever caused them
 * (you, the CPU or an online opponent). Nothing plays for the state a page
 * opens with, or the first online load.
 */
export function useGameSounds(
  s: GameState | null,
  moveCount: number,
  me: Player | null,
  { resetSound = false } = {},
) {
  const prev = useRef({ s, moveCount })

  useEffect(() => {
    const before = prev.current
    prev.current = { s, moveCount }
    if (!before.s || !s || before.s === s) return
    const sound = gameSound(
      { s: before.s, moveCount: before.moveCount },
      { s, moveCount },
      me,
      resetSound,
    )
    if (sound) PLAY[sound]()
  }, [s, moveCount, me, resetSound])
}
