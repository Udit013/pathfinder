import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Resource } from '@/types'
import type { ResourcePick } from '@/data/resources'
import { SectionHeading } from './Card'
import { ResourceRow } from './ResourceLinks'
import { cn } from '@/lib/utils'

/**
 * The curated view of the resource library.
 *
 * The library holds hundreds of entries. This shows three: one to START, one to
 * PRACTISE with, and optionally one to go DEEPER — with everything else folded
 * away behind a link. The whole point of PathFinder is to reduce decision
 * fatigue, and a wall of twenty courses does the opposite.
 *
 * If you are tempted to raise these numbers, that is the moment to remember
 * that "where do I even start?" is the feeling this product exists to remove.
 */

const roleLabels: Record<string, { label: string; hint: string }> = {
  start: { label: 'Start here', hint: 'Open this one first.' },
  practice: { label: 'Then practise', hint: 'Where you actually build the skill.' },
  deeper: { label: 'Go deeper', hint: 'When the basics have landed.' },
}

export function CuratedResources({
  pick,
  title = 'Free resources',
}: {
  pick: ResourcePick
  title?: string
}) {
  const [expanded, setExpanded] = useState(false)

  if (pick.primary.length === 0 && pick.more.length === 0) return null

  return (
    <section>
      <SectionHeading
        title={title}
        hint="Chosen for where you are — not the whole library. Everything opens in a new tab."
      />

      <div className="space-y-3">
        {pick.start ? <Slot resource={pick.start} role="start" featured /> : null}
        {pick.practice ? <Slot resource={pick.practice} role="practice" /> : null}
        {pick.deeper ? <Slot resource={pick.deeper} role="deeper" /> : null}
      </div>

      {pick.more.length > 0 ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className={cn(
              '-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2',
              'text-sm font-medium text-accent-ink transition-colors hover:bg-accent-soft',
            )}
          >
            {expanded
              ? 'Show fewer'
              : `See ${pick.more.length} more free resource${pick.more.length === 1 ? '' : 's'} →`}
          </button>

          {expanded ? (
            <ul className="animate-rise mt-2 space-y-2">
              {pick.more.map((resource) => (
                <ResourceRow key={resource.id} resource={resource} />
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <p className="mt-2.5 text-xs text-ink-faint">
        Links last checked{' '}
        {[...pick.primary, ...pick.more]
          .map((resource) => resource.lastVerified)
          .filter(Boolean)
          .sort()
          .at(-1) ?? 'not yet'}
        . If one has moved, it&rsquo;s the link that&rsquo;s wrong, not you.
      </p>
    </section>
  )
}

function Slot({
  resource,
  role,
  featured,
}: {
  resource: Resource
  role: keyof typeof roleLabels | string
  featured?: boolean
}) {
  const meta = roleLabels[role] ?? roleLabels.start!

  return (
    <div>
      <p
        className={cn(
          'mb-1.5 flex items-center gap-1.5 text-xs font-medium',
          featured ? 'text-accent-ink' : 'text-ink-faint',
        )}
      >
        {featured ? <Sparkles className="size-3" aria-hidden /> : null}
        {meta.label}
        <span className="font-normal text-ink-faint">— {meta.hint}</span>
      </p>
      <ul>
        <ResourceRow resource={resource} />
      </ul>
    </div>
  )
}
