import { useEffect, useState } from 'react'

function seen(key: string) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return true // can't remember it, so don't nag every visit
  }
}

function markSeen(key: string) {
  try {
    localStorage.setItem(key, '1')
  } catch {
    // storage blocked
  }
}

/** Shown until dismissed or `ms` of `active` time passes, then never again. */
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
