import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { ProgressBar } from '@/ui/Progress'
import { BackLink } from '@/ui/BackLink'
import { allChecklistIds, phases, roadmapSubtitle, roadmapTitle } from '@/data/engineeringRoadmap'
import { currentStep, stepStatus, useChecklist } from './shared'
import { tabs, useRoadmapNav } from './nav'
import { StartView } from './views/StartView'
import { PathView } from './views/PathView'
import { TopicsView } from './views/TopicsView'
import { InterviewsView, ProgressView, ProjectsView, ResourcesView, RolesView } from './views/OtherViews'
import { cn } from '@/lib/utils'

/**
 * The Engineer's Roadmap (SWE/SDE, Backend/Full-stack, FDE, AI Engineer).
 *
 * Organised around three questions, in this order:
 *   1. Where do I start?   — "Start here": choose a starting point, see how the
 *      levels connect, and skip what you already know.
 *   2. What do I do next?  — "Learning path": one step at a time, each split
 *      into Learn · Build · Check yourself · Use AI, with prev/next.
 *   3. What do I use?      — every topic's free resources are grouped into
 *      Start here / Practise / Go deeper / Reference.
 * The other tabs are ways to look at the same content differently: by topic,
 * by project, by role, by interview type, by resource format, by progress.
 *
 * All navigation state is in the URL (see nav.ts), so any view is shareable.
 */
export function EngineerRoadmapPage() {
  const { tab, step, part, topic, go } = useRoadmapNav()
  const { checked } = useChecklist()
  const totalIds = useMemo(() => allChecklistIds(), [])
  const done = totalIds.filter((id) => checked.has(id)).length
  const current = currentStep(checked)
  const started = phases.some((p) => stepStatus(p, checked) !== 'not-started')

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pt-2">
      <BackLink to="/roadmap">Roadmap</BackLink>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{roadmapTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{roadmapSubtitle}</p>
          <div className="mt-3 flex max-w-md items-center gap-3">
            <ProgressBar value={done / totalIds.length} label="Engineer’s Roadmap progress" tone="positive" />
            <span className="shrink-0 text-xs tabular-nums text-ink-faint">
              {done} / {totalIds.length} ticked
            </span>
          </div>
        </div>
        {started && tab !== 'path' ? (
          <button
            type="button"
            onClick={() => go({ tab: 'path', step: current.id })}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Continue: Step {current.number}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : null}
      </header>

      {/* Sections — scroll sideways on small screens rather than wrapping into a wall. */}
      <nav aria-label="Roadmap sections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
        <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => go({ tab: t.id, step: t.id === 'path' ? (step ?? current.id) : undefined })}
              className={cn(
                'min-h-9 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors',
                tab === t.id ? 'bg-accent-soft font-medium text-accent-ink' : 'text-ink-soft hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <section aria-label={tabs.find((t) => t.id === tab)?.label}>
        {tab === 'start' ? <StartView go={go} /> : null}
        {tab === 'path' ? <PathView step={step} part={part} topic={topic} go={go} /> : null}
        {tab === 'topics' ? <TopicsView go={go} /> : null}
        {tab === 'projects' ? <ProjectsView go={go} /> : null}
        {tab === 'roles' ? <RolesView /> : null}
        {tab === 'interviews' ? <InterviewsView /> : null}
        {tab === 'resources' ? <ResourcesView go={go} /> : null}
        {tab === 'progress' ? <ProgressView go={go} /> : null}
      </section>
    </div>
  )
}
