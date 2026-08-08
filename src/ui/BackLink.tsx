import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The one back link used everywhere.
 *
 * Exists for two reasons: consistency (every page returns the same way), and
 * touch. The inline version of this was 20px tall — under the 24px minimum and
 * genuinely fiddly on a phone. The negative margin keeps it visually where it
 * was while giving it a comfortable hit area.
 */
export function BackLink({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        '-mx-2 -my-1.5 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 py-1.5',
        'text-sm text-ink-soft transition-colors hover:bg-sunken hover:text-ink',
        className,
      )}
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      {children}
    </Link>
  )
}
