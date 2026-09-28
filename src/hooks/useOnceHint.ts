import { useEffect, useState } from 'react'

function seen(key: string) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return true // storage blocked: can't remember it, so don't nag every visit
  }
}

function markSeen(key: string) {
  try {
    localStorage.setItem(key, '1')
  } catch {
    // ignore
  }
}

/**
 * A hint shown to first-time players until they act on it or `ms` passes,
 * then never again in this browser. The clock only runs while `active`
 * (e.g. once the board is actually on screen).
 */
export function useOnceHint(key: string, ms = 8000, active = true) {
  const [pending, setShow] = useState(() => !seen(key))
  const show = pending && active

  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => {
      markSeen(key)
      setShow(false)
    }, ms)
    return () => clearTimeout(t)
  }, [show, key, ms])

  const dismiss = () => {
    markSeen(key)
    setShow(false)
  }
  return [show, dismiss] as const
}
