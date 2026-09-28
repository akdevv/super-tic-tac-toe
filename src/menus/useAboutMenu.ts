import { useMenu, type MenuEntry } from './useMenu.ts'

const GITHUB_URL = 'https://github.com/akdevv'

export function useAboutMenu(onBack: () => void) {
  const entries: MenuEntry[] = [
    {
      label: 'more by akdevv',
      hint: 'OPENS GITHUB.COM/AKDEVV',
      onSelect: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer'),
    },
    { label: 'back', onSelect: onBack },
  ]
  return { entries, ...useMenu(entries, onBack) }
}
