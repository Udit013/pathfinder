import { Link } from 'react-router'
import { ArrowRight, Route } from 'lucide-react'
import { Card } from '@/ui/Card'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'

/**
 * The way into the Engineer's Roadmap from Roadmap, Resources and Interview
 * Prep.
 *
 * Deliberately imports nothing from the roadmap content: that module is large,
 * and this card appears on pages that shouldn't have to download it. Progress
 * shown here is a count of ticks from the store, not a percentage, for the
 * same reason.
 */
export function EngineerRoadmapCard({
  tab,
  compact,
  className,
}: {
  /** Opens a specific tab, e.g. "interviews" from Interview Prep. */
  tab?: string
  compact?: boolean
  className?: string
}) {
  const ticked = useAppStore((state) => state.engineeringChecklist.length)
  const to = tab ? `/roadmap/engineer?tab=${tab}` : '/roadmap/engineer'

  return (
    <Card tone="sky" className={cn('lift p-0', className)}>
      <Link to={to} className={cn('flex items-center gap-3.5', compact ? 'p-3.5' : 'p-4 sm:p-5')}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-sky-ink">
          <Route className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display block text-base leading-snug text-sky-ink sm:text-lg">
            The Engineer’s Roadmap
          </span>
          <span className="mt-0.5 block text-sm leading-snug text-sky-ink/80">
            SWE · Full-stack · FDE · AI Engineer — a phased, free, project-first path with interview prep built in.
            {ticked > 0 ? ` ${ticked} ticked so far.` : ''}
          </span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-sky-ink/70" aria-hidden />
      </Link>
    </Card>
  )
}
