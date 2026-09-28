import { Slot } from '../components/Menu.tsx'
import { useMenu, type MenuEntry } from './useMenu.ts'
import { useSettings } from './useSound.ts'

const onOff = (on: boolean) => <Slot chars={3}>{on ? 'on' : 'off'}</Slot>

// Same-width names so the ‹ ON › columns line up (the pixel font is monospace).
const name = (text: string) => (
  <span className="inline-block w-[10ch]">{text}</span>
)

/** The SETTINGS submenu (sound, vibration), used on the title and pause screens. */
export function useSettingsMenu(onBack: () => void) {
  const { soundOn, vibrationOn, toggleSound, toggleVibration } = useSettings()
  const entries: MenuEntry[] = [
    {
      label: (
        <>
          {name('sound')}‹{onOff(soundOn)}›
        </>
      ),
      hint: 'M KEY ALSO TOGGLES SOUND',
      onSelect: toggleSound,
      onLeft: toggleSound,
      onRight: toggleSound,
    },
    {
      label: (
        <>
          {name('vibration')}‹{onOff(vibrationOn)}›
        </>
      ),
      hint: 'ON PHONES THAT SUPPORT IT',
      onSelect: toggleVibration,
      onLeft: toggleVibration,
      onRight: toggleVibration,
    },
    { label: 'back', onSelect: onBack },
  ]
  return { entries, ...useMenu(entries, onBack) }
}
