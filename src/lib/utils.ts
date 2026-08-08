import type { IsoDate } from '@/types'

type ClassValue = string | false | null | undefined

/** Minimal class joiner. Deliberately not tailwind-merge — we don't need it. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}

/** Stable-enough ids for local-only data. */
export function newId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${random}`
}

/** Today in the user's own timezone — not UTC, which would shift the day. */
export function todayIso(now: Date = new Date()): IsoDate {
  const offsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

export function daysAgoIso(days: number, now: Date = new Date()): IsoDate {
  return todayIso(new Date(now.getTime() - days * 86_400_000))
}

export function greetingFor(now: Date = new Date()): string {
  const hour = now.getHours()
  if (hour < 5) return 'Still up'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (rest === 0) return `${hours} hr`
  return `${hours} hr ${rest} min`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Trailing-edge debounce, used for persistence writes. */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): ((...args: Args) => void) & { flush(): void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending: Args | null = null

  const run = () => {
    timer = null
    if (pending) {
      const args = pending
      pending = null
      fn(...args)
    }
  }

  const debounced = (...args: Args) => {
    pending = args
    if (timer) clearTimeout(timer)
    timer = setTimeout(run, waitMs)
  }

  debounced.flush = () => {
    if (timer) clearTimeout(timer)
    run()
  }

  return debounced
}
