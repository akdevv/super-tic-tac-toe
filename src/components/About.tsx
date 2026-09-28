import type { MenuEntry } from '../hooks/useMenu.ts'
import { Menu } from './Menu.tsx'

/** Credits screen, reached from SETTINGS › ABOUT. Menu state from useAboutMenu. */
export default function About(menu: {
  entries: MenuEntry[]
  sel: number
  setSel: (i: number) => void
}) {
  return (
    <section
      aria-label="About"
      className="flex h-full flex-col items-center justify-center-safe gap-8 text-center @max-[18rem]:gap-6"
    >
      <div className="flex flex-col items-center gap-3">
        <p className="text-lcd-2 text-[8px] tracking-[0.3em]">A GAME BY</p>
        <p className="text-lg tracking-[0.1em] @max-[18rem]:text-base">
          AKDEVV
        </p>
      </div>
      <Menu label="About" {...menu} />
    </section>
  )
}
