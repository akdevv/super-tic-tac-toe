import type { ReactNode } from 'react'
import type { Pad } from '../device/pad.ts'
import { sfx } from '../feedback/sfx.ts'
import { ScreenOverlay } from '../screen/Overlay.tsx'
import About from './About.tsx'
import { Menu } from './Menu.tsx'
import Rules from './Rules.tsx'
import { useAboutMenu } from './useAboutMenu.ts'
import { useRules } from './useRules.ts'
import { useSettingsMenu } from './useSettingsMenu.tsx'

type Screen = 'pause' | 'settings' | 'about' | 'help'

/** The settings, about and help screens reached from a game's pause menu. */
export function useGameMenus(show: (s: Screen | null) => void) {
  const close = () => show(null)
  const closeOverlay = () => {
    sfx.back()
    close()
  }
  const about = useAboutMenu(() => show('settings'))
  const settings = useSettingsMenu(
    () => show('pause'),
    () => {
      about.setSel(0)
      show('about')
    },
  )
  const rules = useRules(close)
  const labels = { a: 'OK', b: 'BACK', start: 'RESUME' }

  const pads: Record<'settings' | 'about' | 'help', Pad> = {
    settings: { ...settings.pad, start: closeOverlay, labels },
    about: { ...about.pad, start: closeOverlay, labels },
    help: rules.pad,
  }
  const screens: Partial<Record<string, ReactNode>> = {
    settings: (
      <ScreenOverlay title="SETTINGS">
        <Menu label="Settings" {...settings} />
      </ScreenOverlay>
    ),
    about: (
      <ScreenOverlay label="About">
        <About {...about} />
      </ScreenOverlay>
    ),
    help: (
      <ScreenOverlay label="How to play">
        <Rules {...rules} />
      </ScreenOverlay>
    ),
  }

  return {
    pads,
    closeOverlay,
    openHelp: () => {
      sfx.select()
      show('help')
    },
    openSettings: () => {
      settings.setSel(0)
      show('settings')
    },
    render: (overlay: string | null) => (overlay ? screens[overlay] : null),
  }
}
