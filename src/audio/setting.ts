// A remembered on/off setting (sound, vibration) that React can subscribe to.

export interface Setting {
  get: () => boolean
  set: (on: boolean) => void
  subscribe: (fn: () => void) => () => void
}

export function createSetting(key: string, defaultOn = true): Setting {
  let on = defaultOn
  try {
    const saved = localStorage.getItem(key)
    if (saved !== null) on = saved === '1'
  } catch {
    // storage blocked: use the default
  }
  const listeners = new Set<() => void>()
  return {
    get: () => on,
    set(value) {
      on = value
      try {
        localStorage.setItem(key, value ? '1' : '0')
      } catch {
        // not remembered, still works for this visit
      }
      listeners.forEach((fn) => fn())
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}
