import { useSyncExternalStore } from 'react'

/**
 * Bookmarks (the Figma cards' bookmark button), kept per browser. A tiny external store so every
 * bookmark button and the "Saved" tab stay in sync without a context.
 */
const KEY = 'lance:saved'
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}
let cache = read()

function write(next: string[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore: bookmarks still work for this visit */
  }
  listeners.forEach((l) => l())
}

export function toggleSaved(id: string) {
  write(cache.includes(id) ? cache.filter((x) => x !== id) : [...cache, id])
}

export function useSaved() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => cache,
    () => cache,
  )
}
