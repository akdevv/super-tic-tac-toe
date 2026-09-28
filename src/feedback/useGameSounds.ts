import { useEffect, useRef } from 'react'
import type { GameState, Player } from '../game/engine.ts'
import { gameSound } from './gameSound.ts'
import { haptic } from './haptics.ts'
import { sfx } from './sfx.ts'

// Placing a mark vibrates from the tap handler only, so opponent moves don't buzz.
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

export function blocked() {
  sfx.blocked()
  haptic.blocked()
}

/** Sounds for board changes from anyone; silent for the state a page opens with. */
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
