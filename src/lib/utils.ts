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

/**
 * The Today greeting. Uses the name sparingly — a warm "Hey Sam 👋" once at the
 * top of the day, not sprinkled through the interface where it would start to
 * feel like a mail merge.
 */
export function friendlyGreeting(name: string | undefined, now: Date = new Date()): string {
  const first = name?.trim().split(' ')[0]
  const hour = now.getHours()
  if (!first) return hour < 5 ? 'Still up?' : 'Hey there'
  if (hour < 5) return `Still up, ${first}?`
  if (hour < 12) return `Morning, ${first}`
  return `Hey ${first}`
}

/**
 * Rotating subheadings, so the second line under the greeting stays fresh
 * without ever nagging. Chosen by day so it's stable within a session.
 *
 * Every one of these has to pass the same test: would this still feel kind on a
 * day when nothing went right?
 */
const daySubheadings = [
  "Ready for today's little adventure?",
  'No pressure. Just one small step.',
  "Let's see what today has for you.",
  "Small things count. That's the whole idea.",
  "You don't have to figure everything out today.",
  'One step is a perfectly good day.',
  'Whatever you manage today is enough.',
]

export function subheadingForDay(now: Date = new Date()): string {
  const index = Math.floor(now.getTime() / 86_400_000) % daySubheadings.length
  return daySubheadings[index] ?? daySubheadings[0]!
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
