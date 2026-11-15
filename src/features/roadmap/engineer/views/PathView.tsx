import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Link2 } from 'lucide-react'
import { Card } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ProgressBar } from '@/ui/Progress'
import {
  phases,
  readyCheckId,
  topicCheckId,
  tracks,
  type RoadmapPhase,
  type RoadmapTopic,
} from '@/data/engineeringRoadmap'
import { Bullets, CheckItem, GroupedResources, Label, MasteryBadge, ProjectCard, PromptCard, RoleChips, StatusChip } from '../parts'
import { Table } from '../common'
import { currentStep, levels, skipId, stepOfTopic, stepStatus, topicById, useChecklist } from '../shared'
import { parts, type Destination, type PartId } from '../nav'
import { cn } from '@/lib/utils'

export function PathView({
  step,
  part,
  topic,
  go,
}: {
  step: string | null
  part: PartId
  topic: string | null
  go: (to: Destination, options?: { scroll?: boolean }) => void
}) {
  const { checked } = useChecklist()
  const phase = phases.find((p) => p.id === step) ?? currentStep(checked)
  const [stepsOpen, setStepsOpen] = useState(false)

  const open = (to: Omit<Destination, 'tab'>, scroll = true) => {
    setStepsOpen(false)
    go({ tab: 'path', ...to }, { scroll })
  }

  return (
    <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:items-start lg:gap-6">
      {/* Step list: a sidebar on desktop, a disclosure on phones. */}
      <nav aria-label="Steps" className="mb-5 lg:sticky lg:top-20 lg:mb-0">
        <button
          type="button"
          onClick={() => setStepsOpen(!stepsOpen)}
          aria-expanded={stepsOpen}
          className="flex min-h-11 w-full items-center justify-between rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink lg:hidden"
        >
          All 9 steps
          <ChevronDown className={cn('size-4 text-ink-faint transition-transform', stepsOpen && 'rotate-180')} aria-hidden />
        </button>
        <div className={cn('mt-2 space-y-4 lg:mt-0 lg:block', stepsOpen ? 'block' : 'hidden')}>
          {levels.map(({ level }) => (
            <div key={level}>
              <p className="px-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-faint uppercase">{level}</p>
              <ul className="mt-1 space-y-0.5">
                {phases
                  .filter((p) => p.level === level)
                  .map((p) => {
                    const status = stepStatus(p, checked)
                    const active = p.id === phase.id
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          aria-current={active ? 'step' : undefined}
                          onClick={() => open({ step: p.id })}
                          className={cn(
                            'flex min-h-11 w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
                            active ? 'bg-accent-soft' : 'hover:bg-sunken',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold',
                              status === 'done'
                                ? 'bg-positive-strong text-white'
                                : status === 'skipped'
                                  ? 'bg-sunken text-ink-faint'
                                  : active
                                    ? 'bg-accent text-white'
                                    : 'bg-sunken text-ink-soft',
                            )}
                          >
                            {status === 'done' ? <Check className="size-3" aria-hidden /> : p.number}
                          </span>
                          <span className={cn('leading-snug', active ? 'font-medium text-accent-ink' : 'text-ink-soft', status === 'skipped' && 'line-through')}>
                            {p.title}
                            <span className="sr-only"> — {status}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <StepDetail phase={phase} part={part} topic={topic} open={open} />
    </div>
  )
}

function StepDetail({
  phase,
  part,
  topic,
  open,
}: {
  phase: RoadmapPhase
  part: PartId
  topic: string | null
  open: (to: Omit<Destination, 'tab'>, scroll?: boolean) => void
}) {
  const { checked, toggle } = useChecklist()
  const status = stepStatus(phase, checked)
  const index = phases.indexOf(phase)
  const prev = phases[index - 1]
  const next = phases[index + 1]
  const topicsDone = phase.topics.filter((t) => checked.has(topicCheckId(t.id))).length
  const alongside = tracks.filter((t) => t.weekStart < phase.weekEnd && t.weekEnd > phase.weekStart)

  return (
    <article aria-labelledby="step-title" className="min-w-0 space-y-5">
      {/* Header */}
      <header className="rounded-card border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
          <span className="font-semibold tracking-[0.12em] uppercase">
            Step {phase.number} · {phase.level}
          </span>
          <StatusChip status={status} />
        </div>
        <h2 id="step-title" className="font-display mt-1.5 text-2xl leading-tight text-ink">
          {phase.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{phase.tagline}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-faint">
          <span>
            Weeks {phase.weekStart}–{phase.weekEnd} at 20 h/week
          </span>
          <span>{phase.hours}</span>
          <span className="tabular-nums">
            {topicsDone}/{phase.topics.length} topics learned
          </span>
        </p>
        <ProgressBar
          value={phase.topics.length ? topicsDone / phase.topics.length : 0}
          label={`Step ${phase.number} topic progress`}
          tone="positive"
          className="mt-2 max-w-sm"
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-sunken p-3">
            <Label>Why this comes now</Label>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{phase.whyNow}</p>
            {phase.dependsOn.length > 0 ? (
              <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
                Builds on:
                {phase.dependsOn.map((id) => {
                  const dep = phases.find((p) => p.id === id)
                  return dep ? (
                    <button
                      key={id}
                      type="button"
                      onClick={() => open({ step: id })}
                      className="rounded-full border border-line bg-surface px-2 py-0.5 text-ink-soft hover:text-ink"
                    >
                      Step {dep.number}
                    </button>
                  ) : null
                })}
              </p>
            ) : null}
          </div>
          <div className="rounded-xl bg-sunken p-3">
            <Label>What it leads to</Label>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{phase.leadsTo}</p>
            {alongside.length > 0 ? (
              <p className="mt-2 text-xs text-ink-faint">
                Running alongside: {alongside.map((t) => t.title).join(' · ')}
              </p>
            ) : null}
          </div>
        </div>

        {status !== 'done' ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-faint">Already know this?</span>
            <button type="button" onClick={() => open({ step: phase.id, part: 'check' })} className="font-medium text-accent-ink hover:underline">
              Check yourself
            </button>
            <span className="text-ink-faint" aria-hidden>
              or
            </span>
            <button
              type="button"
              aria-pressed={checked.has(skipId(phase.id))}
              onClick={() => toggle(skipId(phase.id))}
              className="font-medium text-accent-ink hover:underline"
            >
              {checked.has(skipId(phase.id)) ? 'Un-skip this step' : 'skip it'}
            </button>
          </div>
        ) : null}
      </header>

      {/* The four parts of every step */}
      <nav aria-label={`Step ${phase.number} sections`} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
        <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1">
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-current={part === p.id ? 'page' : undefined}
              onClick={() => open({ step: phase.id, part: p.id }, false)}
              className={cn(
                'min-h-9 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors',
                part === p.id ? 'bg-accent-soft font-medium text-accent-ink' : 'text-ink-soft hover:text-ink',
              )}
            >
              {p.label}
              {p.id === 'learn' ? <span className="ml-1 text-ink-faint">{phase.topics.length}</span> : null}
            </button>
          ))}
        </div>
      </nav>

      {part === 'learn' ? <LearnPart phase={phase} topic={topic} open={open} /> : null}
      {part === 'build' ? <BuildPart phase={phase} /> : null}
      {part === 'check' ? <CheckPart phase={phase} /> : null}
      {part === 'ai' ? <AiPart phase={phase} /> : null}

      {/* Prev / next */}
      <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4">
        {prev ? (
          <button type="button" onClick={() => open({ step: prev.id })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-sm text-ink-soft hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden />
            Step {prev.number}: {prev.title}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button type="button" onClick={() => open({ step: next.id })} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover">
            Next: Step {next.number}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </article>
  )
}

// ─── Learn ───────────────────────────────────────────────────────────────────

function LearnPart({
  phase,
  topic,
  open,
}: {
  phase: RoadmapPhase
  topic: string | null
  open: (to: Omit<Destination, 'tab'>, scroll?: boolean) => void
}) {
  return (
    <div className="space-y-5">
      <details className="group rounded-xl border border-line bg-surface">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
          Week-by-week plan for this step
          <ChevronDown className="size-4 text-ink-faint transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-line p-3">
          <Table headers={['When', 'Focus', 'Milestone']} rows={phase.weekPlan.map((w) => [w.weeks, w.focus, w.milestone])} />
        </div>
      </details>

      <div>
        <p className="text-sm text-ink-soft">
          Work through these in order. Open a topic to see what it is, why it matters, and which free resource to start with.
          Tick it once you can explain it and have built something with it.
        </p>
        <ol className="mt-3 space-y-2">
          {phase.topics.map((t, index) => (
            <TopicStep key={t.id} topic={t} index={index} autoOpen={t.id === topic} open={open} />
          ))}
        </ol>
      </div>
    </div>
  )
}

function TopicStep({
  topic,
  index,
  autoOpen,
  open,
}: {
  topic: RoadmapTopic
  index: number
  autoOpen: boolean
  open: (to: Omit<Destination, 'tab'>, scroll?: boolean) => void
}) {
  const [expanded, setExpanded] = useState(autoOpen)
  const { checked, toggle } = useChecklist()
  const on = checked.has(topicCheckId(topic.id))

  // Deep links (?topic=…) open the topic and bring it into view.
  useEffect(() => {
    if (!autoOpen) return
    setExpanded(true)
    document.getElementById(`topic-${topic.id}`)?.scrollIntoView({ block: 'start' })
  }, [autoOpen, topic.id])

  return (
    <li id={`topic-${topic.id}`} className="scroll-mt-20 rounded-xl border border-line bg-surface">
      <div className="flex items-start gap-1 p-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={on}
          aria-label={`Mark "${topic.name}" as learned`}
          onClick={() => toggle(topicCheckId(topic.id))}
          className="flex size-11 shrink-0 items-center justify-center"
        >
          <span
            aria-hidden
            className={cn(
              'flex size-6 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
              on ? 'border-positive-strong bg-positive-strong text-white' : 'border-line-strong bg-surface text-ink-soft',
            )}
          >
            {on ? <Check className="size-3.5" /> : index + 1}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex min-h-11 flex-1 items-start justify-between gap-2 py-1.5 text-left"
        >
          <span className="min-w-0">
            <span className={cn('block text-sm font-medium', on ? 'text-ink-faint' : 'text-ink')}>{topic.name}</span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <MasteryBadge mastery={topic.mastery} />
              <RoleChips roles={topic.roles} />
            </span>
          </span>
          <ChevronDown className={cn('mt-1 size-4 shrink-0 text-ink-faint transition-transform', expanded && 'rotate-180')} aria-hidden />
        </button>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-line px-4 py-3 text-sm leading-relaxed">
          {topic.buildsOn?.length ? (
            <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
              <Link2 className="size-3.5" aria-hidden />
              Builds on:
              {topic.buildsOn.map((id) => {
                const dep = topicById.get(id)
                const depStep = stepOfTopic.get(id)
                return dep && depStep ? (
                  <button
                    key={id}
                    type="button"
                    onClick={() => open({ step: depStep.id, topic: id }, false)}
                    className="rounded-full border border-line px-2 py-0.5 text-ink-soft hover:text-ink"
                  >
                    {dep.name}
                    {depStep.id !== stepOfTopic.get(topic.id)?.id ? ` (Step ${depStep.number})` : ''}
                  </button>
                ) : null
              })}
            </p>
          ) : null}
          <div>
            <Label>What it is, and how it works</Label>
            <p className="mt-1 text-ink-soft">{topic.what}</p>
          </div>
          <div>
            <Label>Why it matters</Label>
            <p className="mt-1 text-ink-soft">{topic.why}</p>
          </div>
          {topic.tradeoffs ? (
            <div>
              <Label>Trade-offs</Label>
              <p className="mt-1 text-ink-soft">{topic.tradeoffs}</p>
            </div>
          ) : null}
          <div className="rounded-lg bg-sunken p-3">
            <Label>Prove it</Label>
            <p className="mt-1 text-ink-soft">{topic.practice}</p>
          </div>
          <div>
            <Label>Learn it free</Label>
            <div className="mt-2">
              <GroupedResources ids={topic.resourceIds} />
            </div>
          </div>
        </div>
      ) : null}
    </li>
  )
}

// ─── Build, Check, AI ────────────────────────────────────────────────────────

function BuildPart({ phase }: { phase: RoadmapPhase }) {
  return (
    <div className="space-y-5">
      {phase.project ? (
        <ProjectCard project={phase.project} />
      ) : (
        <Card tone="sunken" className="p-4 text-sm text-ink-soft">
          This step’s project is your role capstone — see the Roles tab.
        </Card>
      )}
      <Card className="p-4">
        <Label>Mini-exercises</Label>
        <div className="mt-2">
          <Bullets items={phase.miniExercises} />
        </div>
      </Card>
    </div>
  )
}

function CheckPart({ phase }: { phase: RoadmapPhase }) {
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <Label>Ready to move on when…</Label>
        <p className="mt-1 text-xs text-ink-faint">Tick all of these and this step counts as done. It doubles as the placement check if you already know this material.</p>
        <div className="mt-1 -ml-2">
          {phase.readyWhen.map((item, index) => (
            <CheckItem key={index} id={readyCheckId(phase.id, index)}>
              {item}
            </CheckItem>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <Label>Interview questions this step prepares you for</Label>
        <div className="mt-2">
          <Bullets items={phase.interview.questions} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          <Badge tone="neutral" className="mr-1.5">
            Expected depth
          </Badge>
          {phase.interview.depth}
        </p>
      </Card>
    </div>
  )
}

function AiPart({ phase }: { phase: RoadmapPhase }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <p className="mb-1.5 text-sm font-medium text-positive-ink">Do</p>
          <Bullets items={phase.ai.do} tone="positive" />
        </Card>
        <Card className="p-4">
          <p className="mb-1.5 text-sm font-medium text-critical-ink">Don’t</p>
          <Bullets items={phase.ai.dont} tone="critical" />
        </Card>
      </div>
      <div className="space-y-2">
        <Label>Prompts you can copy</Label>
        {phase.ai.prompts.map((prompt) => (
          <PromptCard key={prompt.label} prompt={prompt} />
        ))}
      </div>
    </div>
  )
}
