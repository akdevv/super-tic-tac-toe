import { useMenu, type MenuEntry } from './useMenu.ts'

export const GITHUB_URL = 'https://github.com/akdevv'

/** The ABOUT screen's menu: a link to the developer, and back. */
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
