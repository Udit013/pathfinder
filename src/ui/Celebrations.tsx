import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'

/**
 * §31 — quick and subtle. Each toast lives briefly, announces politely, and
 * never blocks anything. Suppressed entirely when the user has turned
 * celebrations down in Settings.
 */
export function Celebrations() {
  const celebrations = useAppStore((state) => state.celebrations)
  const dismiss = useAppStore((state) => state.dismissCelebration)

  useEffect(() => {
    if (celebrations.length === 0) return
    const timers = celebrations.map((item) =>
      setTimeout(() => dismiss(item.id), 2600),
    )
    return () => timers.forEach(clearTimeout)
  }, [celebrations, dismiss])

  if (celebrations.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex flex-col items-center gap-2 px-4 lg:bottom-8"
      aria-live="polite"
      aria-atomic="false"
    >
      {celebrations.slice(-3).map((item) => (
        <div
          key={item.id}
          className="animate-pop flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pr-4 pl-2.5 shadow-md"
        >
          <span className="rounded-full bg-spark-soft px-2 py-0.5 text-xs font-semibold tabular-nums text-spark-ink">
            +{item.xp} XP
          </span>
          <span className="text-sm text-ink">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
