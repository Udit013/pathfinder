import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  label,
  tone = 'accent',
  className,
}: {
  /** 0–1. */
  value: number
  /** Accessible name — required, since the bar alone means nothing. */
  label: string
  tone?: 'accent' | 'positive' | 'spark'
  className?: string
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  const fill =
    tone === 'positive' ? 'bg-positive' : tone === 'spark' ? 'bg-spark' : 'bg-accent'

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-sunken', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', fill)}
        style={{ width: `${pct}%`, transitionTimingFunction: 'var(--ease-out-soft)' }}
      />
    </div>
  )
}
