import { Clock, Compass, FlaskConical } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ButtonLink } from '@/ui/Button'
import { EmptyState } from '@/ui/States'
import { experimentById } from '@/data/experiments'
import { useSuggestedExperiment, useTodayMode } from '@/lib/store/selectors'
import { formatMinutes } from '@/lib/utils'

/**
 * §7 — exactly one career exploration on Today.
 *
 * On a light day this steps back rather than pushing a 45-minute experiment at
 * someone who said they were running on empty.
 */
export function ExplorationNudge() {
  const suggestion = useSuggestedExperiment()
  const { mode } = useTodayMode()
  const experiment = suggestion ? experimentById(suggestion.experimentId) : null

  if (!experiment || !suggestion) {
    return (
      <section>
        <SectionHeading title="One career exploration" />
        <EmptyState
          icon={<Compass className="size-5" />}
          title="You’ve tried everything in the Lab so far."
          body="More experiments are on the way. In the meantime, your signals on Progress are worth a look."
        />
      </section>
    )
  }

  const tooBigForToday = mode === 'light' && experiment.estimatedMinutes > 35

  return (
    <section>
      <SectionHeading title="One career exploration" hint={suggestion.reason} />
      <Card tone="accent" className="p-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface"
            aria-hidden
          >
            <FlaskConical className="size-4 text-accent" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-accent-ink">{experiment.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-accent-ink/85">
              {experiment.objective}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Badge tone="neutral">
                <Clock className="size-3" aria-hidden />
                {formatMinutes(experiment.estimatedMinutes)}
              </Badge>
              <Badge tone="neutral">{experiment.difficulty}</Badge>
            </div>

            {tooBigForToday ? (
              <p className="mt-2.5 text-xs leading-relaxed text-accent-ink/70">
                Bigger than today needs to be. It&rsquo;ll still be here — starting it and stopping
                partway is also completely fine.
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink to={`/explore/lab/${experiment.id}`} size="sm">
                Try it
              </ButtonLink>
              <ButtonLink to="/explore" size="sm" variant="ghost">
                Browse directions
              </ButtonLink>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
