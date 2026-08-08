import { Link } from 'react-router'
import { Check, Clock, FlaskConical, PlayCircle } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { BackLink } from '@/ui/BackLink'
import { Badge } from '@/ui/Badge'
import { careerExperiments } from '@/data/experiments'
import { pathTitle } from '@/data/careerPaths'
import { useExperimentTally, useProfile } from '@/lib/store/selectors'
import { formatMinutes } from '@/lib/utils'

/**
 * The Career Lab (§11) — the list of experiments.
 *
 * Sorted so what's relevant to the user comes first, but everything stays
 * visible: someone browsing outside their stated interests is exactly the
 * behaviour this product is trying to encourage.
 */
export function CareerLabPage() {
  const profile = useProfile()
  const { completedIds, startedIds } = useExperimentTally()
  const activePathIds = profile?.activePathIds ?? []

  const sorted = [...careerExperiments].sort((a, b) => {
    const aRelevant = a.careerPathIds.some((id) => activePathIds.includes(id)) ? 0 : 1
    const bRelevant = b.careerPathIds.some((id) => activePathIds.includes(id)) ? 0 : 1
    if (aRelevant !== bRelevant) return aRelevant - bRelevant
    const aDone = completedIds.includes(a.id) ? 1 : 0
    const bDone = completedIds.includes(b.id) ? 1 : 0
    if (aDone !== bDone) return aDone - bDone
    return a.estimatedMinutes - b.estimatedMinutes
  })

  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
      <BackLink to="/explore">Explore</BackLink>

      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">Career Lab</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Small pieces of real work, each doable in one sitting. Do one, then tell us how it felt —
          that&rsquo;s what builds your signals, and it&rsquo;s far better evidence than any quiz.
        </p>
        {completedIds.length > 0 ? (
          <p className="mt-2.5 text-sm text-ink-faint">
            You&rsquo;ve completed {completedIds.length} of {careerExperiments.length}.
          </p>
        ) : null}
      </header>

      <SectionHeading title="Experiments" />
      <div className="space-y-2.5">
        {sorted.map((experiment) => {
          const done = completedIds.includes(experiment.id)
          const started = startedIds.includes(experiment.id)
          const relevant = experiment.careerPathIds.some((id) => activePathIds.includes(id))

          return (
            <Card key={experiment.id} className="group p-0 transition-colors hover:border-line-strong">
              <Link to={`/explore/lab/${experiment.id}`} className="flex items-start gap-3.5 p-4">
                <span
                  className={
                    done
                      ? 'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-positive-soft text-positive-ink'
                      : 'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-ink'
                  }
                  aria-hidden
                >
                  {done ? <Check className="size-4" /> : started ? <PlayCircle className="size-4" /> : <FlaskConical className="size-4" />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink group-hover:text-accent-ink">
                    {experiment.title}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-soft">
                    {experiment.objective}
                  </span>

                  <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge tone="neutral">
                      <Clock className="size-3" aria-hidden />
                      {formatMinutes(experiment.estimatedMinutes)}
                    </Badge>
                    <Badge tone="neutral">{experiment.difficulty}</Badge>
                    {done ? <Badge tone="positive">Completed</Badge> : null}
                    {started && !done ? <Badge tone="caution">In progress</Badge> : null}
                    {relevant && !done ? <Badge tone="accent">Matches your interests</Badge> : null}
                  </span>

                  <span className="mt-2 block text-xs text-ink-faint">
                    {experiment.careerPathIds.slice(0, 3).map(pathTitle).join(' · ')}
                  </span>
                </span>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
