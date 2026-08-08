import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

/**
 * §34 — an empty area is an invitation, never a void. Every empty state names
 * the thing that will appear here and offers the first step.
 */
export function EmptyState({
  icon,
  illustration,
  title,
  body,
  action,
  className,
}: {
  icon?: ReactNode
  /** A doodle. Preferred over `icon` — an empty page is where warmth matters most. */
  illustration?: ReactNode
  title: string
  body?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'animate-rise flex flex-col items-center rounded-card border border-dashed border-line bg-surface/50 px-6 py-10 text-center',
        className,
      )}
    >
      {illustration ? (
        <div className="mb-3">{illustration}</div>
      ) : icon ? (
        <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
          {icon}
        </div>
      ) : null}
      <p className="font-display text-lg text-ink">{title}</p>
      {body ? <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

/** §35 — errors are human, and always say the progress is safe. */
export function ErrorNotice({
  message,
  onDismiss,
  tone = 'critical',
}: {
  message: string
  onDismiss?: () => void
  tone?: 'critical' | 'caution'
}) {
  return (
    <Card
      role="alert"
      className={cn(
        'flex items-start gap-3 p-3.5 text-sm',
        tone === 'critical'
          ? 'border-transparent bg-critical-soft text-critical-ink'
          : 'border-transparent bg-caution-soft text-caution-ink',
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
      ) : null}
    </Card>
  )
}

export function LoadingScreen({ label = 'Getting your things together…' }: { label?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-canvas">
      <div
        className="size-6 animate-spin rounded-full border-2 border-line border-t-accent"
        aria-hidden
      />
      <p className="text-sm text-ink-faint" role="status">
        {label}
      </p>
    </div>
  )
}
