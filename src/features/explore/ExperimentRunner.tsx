import { useState } from 'react'
import { useParams } from 'react-router'
import { Check, Clock, Lightbulb, Target } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { BackLink } from '@/ui/BackLink'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { EmptyState } from '@/ui/States'
import { FreeResources } from '@/ui/ResourceLinks'
import { experimentById } from '@/data/experiments'
import { datasetById } from '@/data/datasets'
import { pickForSkills, resourcesByIds } from '@/data/resources'
import { pathTitle } from '@/data/careerPaths'
import { useAppStore } from '@/lib/store/useAppStore'
import { useExperimentResponse } from '@/lib/store/selectors'
import { DatasetViewer } from './DatasetViewer'
import { ExperimentReflection } from './ExperimentReflection'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * Running a career experiment (§11).
 *
 * Structure: scenario → objective → dataset → steps with progressive hints →
 * reflection. Steps are checkable but never enforced — someone who does the work
 * in their own order and ticks nothing should still be able to reflect, because
 * the reflection is the part that matters.
 */
export function ExperimentRunner() {
  const { experimentId = '' } = useParams()
  const experiment = experimentById(experimentId)
  const response = useExperimentResponse(experimentId)

  const startExperiment = useAppStore((state) => state.startExperiment)
  const toggleStep = useAppStore((state) => state.toggleExperimentStep)
  const revealHint = useAppStore((state) => state.revealHint)

  const [reflecting, setReflecting] = useState(false)

  if (!experiment) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="We don’t have an experiment with that name."
          action={<ButtonLink to="/explore/lab">Back to the Career Lab</ButtonLink>}
        />
      </div>
    )
  }

  const started = Boolean(response)
  const completed = Boolean(response?.completedAt)
  const dataset = experiment.datasetId ? datasetById(experiment.datasetId) : undefined
  const completedStepIds = response?.completedStepIds ?? []

  const resources = (() => {
    const chosen = resourcesByIds(experiment.resourceIds)
    const seen = new Set(chosen.map((resource) => resource.id))
    const curated = pickForSkills(experiment.skillIds, { limit: 3 }).filter(
      (resource) => !seen.has(resource.id),
    )
    return [...chosen, ...curated].slice(0, 3)
  })()

  const begin = () =>
    startExperiment({ experimentId, careerPathIds: experiment.careerPathIds })

  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
      <BackLink to="/explore/lab">Career Lab</BackLink>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">
            <Clock className="size-3" aria-hidden />
            {formatMinutes(experiment.estimatedMinutes)}
          </Badge>
          <Badge tone="neutral">{experiment.difficulty}</Badge>
          {completed ? <Badge tone="positive">Completed</Badge> : null}
        </div>

        <h1 className="font-display mt-3 text-2xl leading-tight text-ink">{experiment.title}</h1>
        <p className="mt-2 text-xs text-ink-faint">
          Gives you evidence about: {experiment.careerPathIds.map(pathTitle).join(' · ')}
        </p>
      </header>

      <Card tone="sunken" className="p-5">
        <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">The situation</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{experiment.scenario}</p>

        <div className="mt-4 flex gap-2.5 border-t border-line pt-4">
          <Target className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-sm font-medium text-ink">What you&rsquo;re trying to do</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{experiment.objective}</p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          <span className="font-medium">Done when:</span> {experiment.doneWhen}
        </p>
      </Card>

      {!started ? (
        <Card elevated className="p-5 text-center">
          <p className="font-display text-lg text-ink">Ready when you are.</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">
            There&rsquo;s no grading and no time limit. If you get a third of the way in and stop,
            that still tells you something worth knowing.
          </p>
          <Button size="lg" className="mt-4" onClick={begin}>
            Start the experiment
          </Button>
        </Card>
      ) : null}

      {started ? (
        <>
          {dataset ? <DatasetViewer dataset={dataset} /> : null}

          <section>
            <SectionHeading
              title="How to work through it"
              hint="Tick them off if it helps. Working in your own order is fine."
            />
            <div className="space-y-2.5">
              {experiment.steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  index={index}
                  step={step}
                  done={completedStepIds.includes(step.id)}
                  revealed={response?.revealedHints[step.id] ?? 0}
                  onToggle={() => toggleStep({ experimentId, stepId: step.id })}
                  onHint={() => revealHint({ experimentId, stepId: step.id })}
                />
              ))}
            </div>
          </section>

          <FreeResources
            resources={resources}
            title="If you need to learn something first"
            hint="Free, and opens in a new tab. Looking things up mid-task is what the job is."
          />

          {reflecting || completed ? (
            <ExperimentReflection
              experiment={experiment}
              existing={response?.ratings ?? null}
              existingReflection={response?.reflection}
              onDone={() => setReflecting(false)}
            />
          ) : (
            <Card tone="accent" className="p-5">
              <p className="font-display text-lg leading-snug text-accent-ink">
                Finished, or finished enough?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-accent-ink/85">
                The reflection is the part that actually builds your career signals — how it felt
                matters more than how far you got.
              </p>
              <Button className="mt-4" onClick={() => setReflecting(true)}>
                How did that feel?
              </Button>
            </Card>
          )}
        </>
      ) : null}
    </div>
  )
}

function StepCard({
  index,
  step,
  done,
  revealed,
  onToggle,
  onHint,
}: {
  index: number
  step: { id: string; title: string; detail: string; hints: string[] }
  done: boolean
  revealed: number
  onToggle: () => void
  onHint: () => void
}) {
  const shown = step.hints.slice(0, revealed)
  const hasMore = revealed < step.hints.length

  return (
    <Card className={cn('p-4', done && 'bg-sunken')}>
      <div className="flex gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Mark "${step.title}" as done`}
          onClick={onToggle}
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
            done ? 'border-accent bg-accent text-white' : 'border-line-strong bg-surface hover:border-accent',
          )}
        >
          {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : null}
        </button>

        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-medium', done ? 'text-ink-soft' : 'text-ink')}>
            <span className="text-ink-faint">{index + 1}. </span>
            {step.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.detail}</p>

          {shown.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {shown.map((hint, hintIndex) => (
                <li
                  key={hint}
                  className="animate-rise flex gap-2 rounded-lg bg-spark-soft p-2.5 text-[0.8125rem] leading-relaxed text-spark-ink"
                >
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>
                    <span className="font-medium">Hint {hintIndex + 1}: </span>
                    {hint}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {hasMore ? (
            <Button variant="ghost" size="sm" className="mt-2 -ml-1.5" onClick={onHint}>
              <Lightbulb className="size-3.5" aria-hidden />
              {revealed === 0 ? 'Give me a hint' : 'Another hint'}
              <span className="text-ink-faint">
                ({step.hints.length - revealed} left)
              </span>
            </Button>
          ) : shown.length > 0 ? (
            <p className="mt-2 text-xs text-ink-faint">That&rsquo;s all the hints for this step.</p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
