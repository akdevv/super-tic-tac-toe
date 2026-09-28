import { useSyncExternalStore } from 'react'
import { toggleVibration, vibration } from '../feedback/haptics.ts'
import type { Setting } from '../feedback/setting.ts'
import { sound, toggleSound } from '../feedback/sfx.ts'
import { Slot } from './Menu.tsx'
import { useMenu, type MenuEntry } from './useMenu.ts'

const useSetting = (s: Setting) => useSyncExternalStore(s.subscribe, s.get)

const toggle = (name: string, on: boolean) => (
  <>
    <span className="inline-block w-[10ch]">{name}</span>‹
    <Slot chars={3}>{on ? 'on' : 'off'}</Slot>›
  </>
)

export function useSettingsMenu(onBack: () => void, onAbout: () => void) {
  const soundOn = useSetting(sound)
  const vibrationOn = useSetting(vibration)
  const entries: MenuEntry[] = [
    {
      label: toggle('sound', soundOn),
      hint: 'M KEY ALSO TOGGLES SOUND',
      onSelect: toggleSound,
      onLeft: toggleSound,
      onRight: toggleSound,
    },
    {
      label: toggle('vibration', vibrationOn),
      hint: 'ON PHONES THAT SUPPORT IT',
      onSelect: toggleVibration,
      onLeft: toggleVibration,
      onRight: toggleVibration,
    },
    { label: 'about', hint: 'WHO MADE THIS', onSelect: onAbout },
    { label: 'back', onSelect: onBack },
  ]
  return { entries, ...useMenu(entries, onBack) }
}
