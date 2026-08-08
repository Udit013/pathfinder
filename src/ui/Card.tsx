import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'default' | 'accent' | 'sunken' | 'spark'

const tones: Record<Tone, string> = {
  default: 'bg-surface border-line',
  accent: 'bg-accent-soft border-transparent',
  sunken: 'bg-sunken border-line',
  spark: 'bg-spark-soft border-transparent',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  /** Slightly stronger elevation for the one thing that matters on a page. */
  elevated?: boolean
  children: ReactNode
}

export function Card({ tone = 'default', elevated, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border',
        tones[tone],
        elevated ? 'shadow-md' : 'shadow-xs',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  title,
  hint,
  action,
  className,
}: {
  title: string
  hint?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-3 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-faint uppercase">
          {title}
        </h2>
        {hint ? <p className="mt-1 text-sm text-ink-soft">{hint}</p> : null}
      </div>
      {action}
    </div>
  )
}
