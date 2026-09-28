import { useState } from 'react'
import type { Pad } from '../device/pad.ts'
import { sfx } from '../feedback/sfx.ts'

export const RULE_PAGES = 4

export function useRules(onDone: () => void) {
  const [page, setPage] = useState(0)
  const last = page === RULE_PAGES - 1
  const prev = () => {
    sfx.move()
    setPage(Math.max(0, page - 1))
  }
  const next = () => {
    sfx.move()
    setPage(Math.min(RULE_PAGES - 1, page + 1))
  }
  const done = () => {
    sfx.back()
    setPage(0)
    onDone()
  }

  const pad: Pad = {
    left: page > 0 ? prev : undefined,
    right: last ? undefined : next,
    a: last ? done : next,
    b: page > 0 ? prev : done,
    start: done,
    select: done,
    labels: {
      a: last ? 'DONE' : 'NEXT',
      b: page > 0 ? 'BACK' : 'CLOSE',
      start: 'CLOSE',
      select: 'CLOSE',
    },
  }
  return { page, setPage, done, pad }
}
