import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Check, ChevronDown } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ProgressBar } from '@/ui/Progress'
import { BackLink } from '@/ui/BackLink'
import { resources } from '@/data/resources'
import {
  aiModes,
  aiRules,
  allChecklistIds,
  allProjects,
  allTopics,
  doNotTrustAiFor,
  fastLane,
  interviewTypes,
  jobCheckId,
  jobReadiness,
  masteryLabels,
  phases,
  primaryStack,
  principles,
  readyCheckId,
  referencedResourceIds,
  reviewingAiCode,
  revisionSystem,
  roadmapSubtitle,
  roadmapTitle,
  schedules,
  specializations,
  topicCheckId,
  tracks,
  weeklyShape,
  type Domain,
  type Mastery,
  type RoadmapPhase,
  type RoadmapTopic,
  type RoleId,
} from '@/data/engineeringRoadmap'
import {
  Bullets,
  CheckItem,
  Label,
  MasteryBadge,
  ProjectCard,
  PromptCard,
  ResourceLinks,
  RoleChips,
} from './parts'
import { roleLabels, useChecklist } from './shared'
import { cn } from '@/lib/utils'

/**
 * The Engineer's Roadmap (SWE/SDE, Backend/Full-stack, FDE, AI Engineer).
 *
 * Long-form and deliberately comprehensive — the opposite of the rest of
 * PathFinder's "one thing at a time" — so it's split into tabs, each answering
 * one question: what's the plan, what depends on what, what do I do this week,
 * what do I build, what does my role need, how do I interview, where do I
 * learn it, and how far have I got.
 *
 * The tab lives in the URL (?tab=phases) so any view can be linked or
 * bookmarked, and the browser back button behaves.
 */

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'map', label: 'Skill map' },
  { id: 'phases', label: 'Phases' },
  { id: 'projects', label: 'Projects' },
  { id: 'roles', label: 'Roles' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'resources', label: 'Resources' },
  { id: 'progress', label: 'Progress' },
] as const

type TabId = (typeof tabs)[number]['id']

export function EngineerRoadmapPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: TabId = tabs.some((t) => t.id === requested) ? (requested as TabId) : 'overview'

  const { checked } = useChecklist()
  const totalIds = useMemo(() => allChecklistIds(), [])
  const done = totalIds.filter((id) => checked.has(id)).length

  const go = (next: TabId) => {
    setParams(next === 'overview' ? {} : { tab: next })
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pt-2">
      <BackLink to="/roadmap">Roadmap</BackLink>

      <header>
        <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{roadmapTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{roadmapSubtitle}</p>
        <div className="mt-3 flex max-w-md items-center gap-3">
          <ProgressBar value={done / totalIds.length} label="Engineer’s Roadmap progress" tone="positive" />
          <span className="shrink-0 text-xs tabular-nums text-ink-faint">
            {done} / {totalIds.length}
          </span>
        </div>
      </header>

      {/* Tabs — scroll horizontally on small screens instead of wrapping into a wall. */}
      <nav
        aria-label="Roadmap sections"
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex w-max gap-1 rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => go(t.id)}
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
        {tab === 'overview' ? <Overview onGo={go} /> : null}
        {tab === 'map' ? <SkillMap onGo={go} /> : null}
        {tab === 'phases' ? <Phases /> : null}
        {tab === 'projects' ? <Projects /> : null}
        {tab === 'roles' ? <Roles /> : null}
        {tab === 'interviews' ? <Interviews /> : null}
        {tab === 'resources' ? <Directory /> : null}
        {tab === 'progress' ? <Progress /> : null}
      </section>
    </div>
  )
}

// ═══ Overview ════════════════════════════════════════════════════════════════

function Overview({ onGo }: { onGo: (tab: TabId) => void }) {
  return (
    <div className="space-y-8">
      <Card tone="accent" className="p-5">
        <p className="font-display text-lg leading-snug text-accent-ink">
          Use AI to write code faster — and understand every system that code runs on.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-accent-ink/85">
          Nine phases, built in dependency order, from your first tested program to production AI systems. Two
          interview tracks run alongside from week 3. Every phase ends in something you build, every topic says
          how deep to go, and every link is free and was checked by hand.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onGo('phases')}
            className="inline-flex min-h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Start with Phase 0
          </button>
          <button
            type="button"
            onClick={() => onGo('map')}
            className="inline-flex min-h-10 items-center rounded-full border border-accent/30 bg-surface px-4 text-sm font-medium text-accent-ink"
          >
            See the whole map
          </button>
        </div>
      </Card>

      <section>
        <SectionHeading title="How this roadmap works" />
        <div className="grid gap-3 sm:grid-cols-2">
          {principles.map((p) => (
            <Card key={p.title} className="p-4">
              <p className="font-medium text-ink">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Realistic timelines"
          hint="Week numbers on this page assume 20 hours a week. Pick the pace you can sustain, not the one that sounds impressive."
        />
        <Table
          headers={['Pace', 'Hours', 'Full path', 'Ready to apply for SWE roles', 'Note']}
          rows={schedules.map((s) => [s.pace, s.hours, s.fullPath, s.sweReady, s.note])}
        />
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{fastLane}</p>
      </section>

      <section>
        <SectionHeading title="A typical 20-hour week" />
        <Table headers={['Block', 'Hours', 'What']} rows={weeklyShape.map((w) => [w.block, w.hours, w.what])} />
      </section>

      <section>
        <SectionHeading
          title="Primary stack — learn these deeply first"
          hint="One choice per layer, learned well, then expand when a job asks. Switching stacks mid-roadmap is the most common way to lose months."
        />
        <Table
          headers={['Layer', 'Learn first', 'Why', 'Add later']}
          rows={primaryStack.map((s) => [s.layer, s.choice, s.why, s.later])}
        />
      </section>

      <section>
        <SectionHeading
          title="How to use AI without depending on it"
          hint="Each phase has its own do’s, don’ts and copyable prompts. These are the rules underneath them."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {aiModes.map((m) => (
            <Card key={m.mode} className="p-4">
              <p className="font-medium text-ink">{m.mode}</p>
              <p className="mt-1 text-xs text-ink-faint">{m.when}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.rule}</p>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card tone="sunken" className="p-4">
            <Label>The rules</Label>
            <div className="mt-2">
              <Bullets items={aiRules} tone="positive" />
            </div>
          </Card>
          <Card tone="sunken" className="p-4">
            <Label>Don’t trust AI alone for</Label>
            <div className="mt-2">
              <Bullets items={doNotTrustAiFor} tone="critical" />
            </div>
          </Card>
          <Card tone="sunken" className="p-4">
            <Label>Reviewing AI-written code</Label>
            <div className="mt-2">
              <Bullets items={reviewingAiCode} />
            </div>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeading
          title="Revision and assessment"
          hint="Without a revision system, month-one material is gone by month six."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {revisionSystem.map((r) => (
            <Card key={r.cadence} className="p-4">
              <p className="font-medium text-ink">{r.cadence}</p>
              <div className="mt-2">
                <Bullets items={r.what} />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══ Skill map ═══════════════════════════════════════════════════════════════

const TOTAL_WEEKS = 46

const domainOrder: Domain[] = [
  'Foundations',
  'CS fundamentals',
  'Frontend',
  'Backend & APIs',
  'Databases',
  'System design',
  'Messaging & async',
  'Cloud & DevOps',
  'Security & quality',
  'AI & ML',
  'AI-assisted engineering',
  'Interviews & career',
]

const masteryDot: Record<Mastery, string> = {
  must: 'bg-accent',
  working: 'bg-positive',
  awareness: 'bg-ink-faint',
  optional: 'bg-spark',
}

function SkillMap({ onGo }: { onGo: (tab: TabId) => void }) {
  const { checked } = useChecklist()
  const byDomain = domainOrder
    .map((domain) => ({ domain, topics: allTopics.filter((t) => t.domain === domain) }))
    .filter((group) => group.topics.length > 0)

  const phaseOf = new Map(phases.flatMap((p) => p.topics.map((t) => [t.id, p] as const)))

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading
          title="Timeline and dependencies"
          hint="Each phase builds on the ones it depends on. Phases overlap on purpose, and the two tracks run alongside everything."
        />
        <Card className="overflow-x-auto p-4">
          <div className="min-w-[44rem]">
            {/* Week ruler */}
            <div className="mb-2 grid text-[0.625rem] text-ink-faint" style={{ gridTemplateColumns: `11rem repeat(${TOTAL_WEEKS}, minmax(0, 1fr))` }}>
              <span />
              {Array.from({ length: TOTAL_WEEKS }, (_, w) => (
                <span key={w} className="text-center tabular-nums">
                  {w % 4 === 0 ? w : ''}
                </span>
              ))}
            </div>
            <ul className="space-y-1.5">
              {phases.map((p) => (
                <TimelineRow key={p.id} label={`${p.number}. ${p.title}`} start={p.weekStart} end={p.weekEnd} tone="phase" />
              ))}
              {tracks.map((t) => (
                <TimelineRow key={t.id} label={t.title} start={t.weekStart} end={t.weekEnd} tone="track" />
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-faint">Weeks at 20 hours a week. Shaded bars are continuous tracks.</p>
          </div>
        </Card>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {phases.map((p) => (
            <div key={p.id} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              <span className="font-medium text-ink">
                {p.number}. {p.title}
              </span>
              <span className="block text-xs text-ink-faint">
                {p.dependsOn.length === 0
                  ? 'No prerequisites'
                  : `Needs: ${p.dependsOn.map((id) => `Phase ${phases.find((x) => x.id === id)?.number}`).join(', ')}`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Every topic, by area"
          hint="Colour shows how deeply to learn it. Ticked topics are the ones you’ve marked done in Phases."
        />
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-ink-soft">
          {(Object.keys(masteryLabels) as Mastery[]).map((m) => (
            <span key={m} className="inline-flex items-center gap-1.5">
              <span className={cn('size-2.5 rounded-full', masteryDot[m])} aria-hidden />
              {masteryLabels[m].label}
            </span>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {byDomain.map((group) => (
            <Card key={group.domain} className="p-4">
              <p className="font-medium text-ink">{group.domain}</p>
              <ul className="mt-2 space-y-1">
                {group.topics.map((topic) => (
                  <li key={topic.id} className="flex items-start gap-2 text-sm">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', masteryDot[topic.mastery])} aria-hidden />
                    <span className={cn('leading-snug', checked.has(topicCheckId(topic.id)) ? 'text-ink-faint line-through' : 'text-ink-soft')}>
                      {topic.name}
                      <span className="sr-only"> — {masteryLabels[topic.mastery].label}</span>
                      <span className="ml-1 text-xs text-ink-faint">P{phaseOf.get(topic.id)?.number}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onGo('phases')}
          className="mt-4 text-sm font-medium text-accent-ink hover:underline"
        >
          Open the phases to see what each topic covers →
        </button>
      </section>

      <SharedVsSpecific />
    </div>
  )
}

function TimelineRow({ label, start, end, tone }: { label: string; start: number; end: number; tone: 'phase' | 'track' }) {
  return (
    <li className="grid items-center" style={{ gridTemplateColumns: `11rem repeat(${TOTAL_WEEKS}, minmax(0, 1fr))` }}>
      <span className="truncate pr-2 text-xs text-ink-soft" title={label}>
        {label}
      </span>
      <span
        className={cn(
          'h-5 rounded-md',
          tone === 'phase' ? 'bg-accent/80' : 'bg-spark-soft ring-1 ring-spark/40 ring-inset',
        )}
        style={{ gridColumn: `${start + 2} / ${Math.min(end, TOTAL_WEEKS) + 2}` }}
        aria-label={`${label}: weeks ${start} to ${end}`}
      />
    </li>
  )
}

/** The shared core vs role-specific split, derived from topic roles. */
function SharedVsSpecific() {
  const roleIds: RoleId[] = ['swe', 'fullstack', 'fde', 'ai']
  const shared = allTopics.filter((t) => t.roles.length === 4 && t.mastery === 'must')
  return (
    <section>
      <SectionHeading
        title="Shared core vs role-specific"
        hint="The shared core is what all four roles must master. Everything else depends on which role you’re aiming at."
      />
      <Card tone="sunken" className="p-4">
        <Label>Shared core — {shared.length} must-master topics</Label>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{shared.map((t) => t.name).join(' · ')}</p>
      </Card>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="p-2 text-left text-xs font-semibold text-ink-faint">Beyond the core</th>
              {roleIds.map((r) => (
                <th key={r} className="p-2 text-left text-xs font-semibold text-ink-faint">
                  {roleLabels[r]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTopics
              .filter((t) => !(t.roles.length === 4 && t.mastery === 'must'))
              .map((t) => (
                <tr key={t.id} className="border-b border-line/60">
                  <td className="p-2 text-ink-soft">{t.name}</td>
                  {roleIds.map((r) => (
                    <td key={r} className="p-2">
                      {t.roles.includes(r) ? (
                        <span className={cn('inline-block size-2.5 rounded-full', masteryDot[t.mastery])} title={masteryLabels[t.mastery].label} />
                      ) : (
                        <span className="text-ink-faint" aria-label="Not needed">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ═══ Phases ══════════════════════════════════════════════════════════════════

function Phases() {
  const { checked } = useChecklist()
  // Open the first phase that still has unticked topics.
  const firstOpen =
    phases.find((p) => p.topics.some((t) => !checked.has(topicCheckId(t.id))))?.id ?? phases[0]?.id ?? null
  const [open, setOpen] = useState<string | null>(firstOpen)

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-soft">
        Tick a topic once you can explain it and have built something with it. Each phase’s “ready when” list
        doubles as a placement test — pass it honestly and you can skip ahead.
      </p>
      {tracks.map((track) => (
        <TrackCard key={track.id} trackId={track.id} />
      ))}
      {phases.map((phase) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          open={open === phase.id}
          onToggle={() => setOpen(open === phase.id ? null : phase.id)}
        />
      ))}
    </div>
  )
}

function TrackCard({ trackId }: { trackId: string }) {
  const track = tracks.find((t) => t.id === trackId)!
  const [open, setOpen] = useState(false)
  return (
    <Card tone="spark" className="p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span>
          <span className="text-xs tracking-[0.12em] text-spark-ink/70 uppercase">
            Runs alongside · weeks {track.weekStart}–{track.weekEnd}
          </span>
          <span className="font-display mt-0.5 block text-lg leading-snug text-spark-ink">{track.title}</span>
          <span className="mt-0.5 block text-xs text-spark-ink/80">{track.hours}</span>
        </span>
        <ChevronDown className={cn('mt-1 size-4 shrink-0 text-spark-ink transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open ? (
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-relaxed text-spark-ink/90">{track.summary}</p>
          <Table headers={['When', 'Focus', 'Milestone']} rows={track.steps.map((s) => [s.weeks, s.focus, s.milestone])} />
          <div>
            <Label>Method</Label>
            <div className="mt-1.5">
              <Bullets items={track.method} />
            </div>
          </div>
          <div>
            <Label>Resources</Label>
            <ResourceLinks ids={track.resourceIds} className="mt-1 -ml-2" />
          </div>
        </div>
      ) : null}
    </Card>
  )
}

function PhaseCard({ phase, open, onToggle }: { phase: RoadmapPhase; open: boolean; onToggle: () => void }) {
  const { checked } = useChecklist()
  const topicDone = phase.topics.filter((t) => checked.has(topicCheckId(t.id))).length

  return (
    <Card className={cn('p-0', open && 'shadow-md')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left sm:p-5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-ink">
          {phase.number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display block text-lg leading-snug text-ink">{phase.title}</span>
          <span className="mt-0.5 block text-sm leading-snug text-ink-soft">{phase.tagline}</span>
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
            <span>
              Weeks {phase.weekStart}–{phase.weekEnd}
            </span>
            <span>{phase.hours}</span>
            <span className="tabular-nums">
              {topicDone}/{phase.topics.length} topics
            </span>
          </span>
          <ProgressBar
            value={phase.topics.length ? topicDone / phase.topics.length : 0}
            label={`Phase ${phase.number} topic progress`}
            tone="positive"
            className="mt-2 max-w-xs"
          />
        </span>
        <ChevronDown className={cn('mt-2 size-4 shrink-0 text-ink-faint transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open ? (
        <div className="space-y-6 border-t border-line p-4 sm:p-5">
          {phase.dependsOn.length > 0 ? (
            <p className="text-xs text-ink-faint">
              Builds on:{' '}
              {phase.dependsOn
                .map((id) => {
                  const dep = phases.find((p) => p.id === id)
                  return dep ? `Phase ${dep.number} (${dep.title})` : id
                })
                .join(', ')}
            </p>
          ) : null}

          <div>
            <Label>Week by week</Label>
            <div className="mt-2">
              <Table headers={['When', 'Focus', 'Milestone']} rows={phase.weekPlan.map((w) => [w.weeks, w.focus, w.milestone])} />
            </div>
          </div>

          <div>
            <Label>Topics</Label>
            <div className="mt-2 space-y-2">
              {phase.topics.map((topic) => (
                <TopicRow key={topic.id} topic={topic} />
              ))}
            </div>
          </div>

          {phase.project ? (
            <div>
              <Label>Phase project</Label>
              <div className="mt-2">
                <ProjectCard project={phase.project} />
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Mini-exercises</Label>
              <div className="mt-2">
                <Bullets items={phase.miniExercises} />
              </div>
            </div>
            <div>
              <Label>Interview questions from this phase</Label>
              <div className="mt-2">
                <Bullets items={phase.interview.questions} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-faint">Expected depth: {phase.interview.depth}</p>
            </div>
          </div>

          <div>
            <Label>Using AI in this phase</Label>
            <div className="mt-2 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1.5 text-sm font-medium text-positive-ink">Do</p>
                <Bullets items={phase.ai.do} tone="positive" />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-critical-ink">Don’t</p>
                <Bullets items={phase.ai.dont} tone="critical" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {phase.ai.prompts.map((prompt) => (
                <PromptCard key={prompt.label} prompt={prompt} />
              ))}
            </div>
          </div>

          <div>
            <Label>Ready to move on when…</Label>
            <div className="mt-1 -ml-2">
              {phase.readyWhen.map((item, index) => (
                <CheckItem key={index} id={readyCheckId(phase.id, index)}>
                  {item}
                </CheckItem>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

function TopicRow({ topic }: { topic: RoadmapTopic }) {
  const [open, setOpen] = useState(false)
  const { checked, toggle } = useChecklist()
  const on = checked.has(topicCheckId(topic.id))

  return (
    <div id={`topic-${topic.id}`} className="scroll-mt-20 rounded-xl border border-line bg-surface">
      <div className="flex items-start gap-2 p-2">
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
              'flex size-5 items-center justify-center rounded-md border transition-colors',
              on ? 'border-positive-strong bg-positive-strong text-white' : 'border-line-strong bg-surface',
            )}
          >
            {on ? <Check className="size-3.5" /> : null}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="flex min-h-11 flex-1 items-start justify-between gap-2 py-1.5 text-left"
        >
          <span className="min-w-0">
            <span className={cn('block text-sm font-medium', on ? 'text-ink-faint' : 'text-ink')}>{topic.name}</span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <MasteryBadge mastery={topic.mastery} />
              <RoleChips roles={topic.roles} />
            </span>
          </span>
          <ChevronDown className={cn('mt-1 size-4 shrink-0 text-ink-faint transition-transform', open && 'rotate-180')} aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="space-y-3 border-t border-line px-4 py-3 text-sm leading-relaxed">
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
            <ResourceLinks ids={topic.resourceIds} className="mt-1 -ml-2" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ═══ Projects ════════════════════════════════════════════════════════════════

function Projects() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-soft">
        Each project builds on the last, from a tested CLI to production AI. Projects 3, 5 and 7, plus your
        capstone, are the four to pin on GitHub. Everything runs locally for free; cloud is used deliberately in
        Project 6, inside AWS’s free plan.
      </p>
      {allProjects.map((project, index) => (
        <div key={project.id}>
          {index === phases.filter((p) => p.project).length ? (
            <SectionHeading title="Role capstones" hint="Build the one for your primary role in Phase 8." className="mt-6" />
          ) : null}
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}

// ═══ Roles ═══════════════════════════════════════════════════════════════════

function Roles() {
  const [role, setRole] = useState<RoleId>('swe')
  const spec = specializations.find((s) => s.id === role)!

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-soft">
        Phases 0–7 are shared, and that foundation is most of the work. Specialise in Phase 8: pick one primary role
        and, if you like, one secondary. Trying to prepare equally for all four is how people end up ready for none.
      </p>
      <div role="group" aria-label="Role" className="flex flex-wrap gap-2">
        {specializations.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={role === s.id}
            onClick={() => setRole(s.id)}
            className={cn(
              'min-h-10 rounded-full border px-4 text-sm transition-colors',
              role === s.id ? 'border-accent bg-accent-soft font-medium text-accent-ink' : 'border-line bg-surface text-ink-soft hover:text-ink',
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <Card tone="accent" className="p-5">
        <p className="font-display text-lg leading-snug text-accent-ink">{spec.oneLiner}</p>
        <p className="mt-2 text-sm leading-relaxed text-accent-ink/85">{spec.whatsDifferent}</p>
      </Card>

      <section>
        <SectionHeading title="What to add on top of the shared core" />
        <div className="space-y-2">
          {spec.extraTopics.map((t) => (
            <div key={t.name} className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-line bg-surface p-3">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{t.name}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">{t.note}</span>
              </span>
              <MasteryBadge mastery={t.mastery} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Capstone" />
        <ProjectCard project={spec.capstone} />
      </section>

      <section>
        <SectionHeading title="The interview loop" hint="Typical rounds. Every company varies — check the specific one on Glassdoor once you have an interview." />
        <Table
          headers={['Round', 'What they test', 'How to prepare']}
          rows={spec.interviewLoop.map((r) => [r.round, r.whatTheyTest, r.howToPrepare])}
        />
      </section>

      <section>
        <SectionHeading title="Role resources" />
        <ResourceLinks ids={spec.resourceIds} className="-ml-2" />
      </section>
    </div>
  )
}

// ═══ Interviews ══════════════════════════════════════════════════════════════

function Interviews() {
  const [role, setRole] = useState<RoleId | 'all'>('all')
  const shown = interviewTypes.filter((t) => role === 'all' || t.roles.includes(role))

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-soft">
        Interview prep starts in week 3, not at the end. Each type below shows when to start it. Each phase also
        lists the questions its material leads to.
      </p>
      <TrackCard trackId="track-interview" />
      <TrackCard trackId="track-dsa" />

      <div role="group" aria-label="Filter by role" className="flex flex-wrap gap-2">
        {(['all', 'swe', 'fullstack', 'fde', 'ai'] as const).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={role === r}
            onClick={() => setRole(r)}
            className={cn(
              'min-h-9 rounded-full border px-3.5 text-sm transition-colors',
              role === r ? 'border-accent bg-accent-soft font-medium text-accent-ink' : 'border-line bg-surface text-ink-soft hover:text-ink',
            )}
          >
            {r === 'all' ? 'All roles' : roleLabels[r]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown
          .slice()
          .sort((a, b) => a.startsWeek - b.startsWeek)
          .map((type) => (
            <Card key={type.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg text-ink">{type.name}</h3>
                <Badge tone="neutral">Start in week {type.startsWeek}</Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{type.whatItTests}</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <Label>How to approach it</Label>
                  <div className="mt-1.5">
                    <Bullets items={type.method} />
                  </div>
                </div>
                <div>
                  <Label>Practise on</Label>
                  <div className="mt-1.5">
                    <Bullets items={type.sampleQuestions} />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Label>Resources</Label>
                <ResourceLinks ids={type.resourceIds} className="mt-1 -ml-2" />
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

// ═══ Resource directory ══════════════════════════════════════════════════════

function Directory() {
  const cited = useMemo(() => new Set(referencedResourceIds()), [])
  const freeCredentials = resources.filter(
    (r) => cited.has(r.id) && (r.credential === 'free_certificate' || r.credential === 'free_badge'),
  )
  const byDomain = domainOrder
    .map((domain) => ({ domain, topics: allTopics.filter((t) => t.domain === domain) }))
    .filter((g) => g.topics.length > 0)

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-ink-soft">
        Every resource in this roadmap, organised by topic. All are free to learn from. Where something needs an
        account, has a paid tier, or charges for its certificate, the entry says so. Links were checked by hand —
        the full library, with search and filters, is on the{' '}
        <Link to="/resources" className="font-medium text-accent-ink hover:underline">
          Resources page
        </Link>
        .
      </p>

      <Card tone="sunken" className="p-4">
        <Label>Running cloud projects for free</Label>
        <div className="mt-2">
          <Bullets
            items={[
              'Build everything locally first with Docker Compose — Postgres, Redis, RabbitMQ and your services, at no cost.',
              'Practise Kubernetes on a local kind cluster, or in Killercoda’s browser labs.',
              'Use AWS in a planned window: as of November 2026, a new Free-plan account gets $100 in credits (up to $200) and closes after six months. Around 30 services stay free within monthly limits — Lambda and DynamoDB are the useful ones.',
              'Set a budget alert before creating anything. Run terraform destroy at the end of every session.',
              'For AI features, run open models locally with Ollama instead of paying per token.',
            ]}
          />
        </div>
        <ResourceLinks ids={['res-docker-compose', 'res-aws-free-tier', 'res-aws-budgets', 'res-ollama']} className="mt-2 -ml-2" />
      </Card>

      <section>
        <SectionHeading
          title="Free certificates and badges in this roadmap"
          hint="Only where the credential itself is genuinely free. Paid certification exams (AWS, Kubernetes, Terraform and so on) are optional — a deployed project you can defend counts for more."
        />
        <ResourceLinks ids={freeCredentials.map((r) => r.id)} className="-ml-2" />
      </section>

      {byDomain.map((group) => (
        <section key={group.domain}>
          <SectionHeading title={group.domain} />
          <div className="space-y-3">
            {group.topics.map((topic) => (
              <div key={topic.id} className="rounded-xl border border-line bg-surface p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-ink">{topic.name}</span>
                  <MasteryBadge mastery={topic.mastery} />
                </div>
                <ResourceLinks ids={topic.resourceIds} className="mt-1 -ml-2" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// ═══ Progress ════════════════════════════════════════════════════════════════

function Progress() {
  const { checked } = useChecklist()
  const [view, setView] = useState<Mastery>('must')
  const topicsFor = allTopics.filter((t) => t.mastery === view)

  return (
    <div className="space-y-8">
      <Card tone="sunken" className="p-4 text-sm leading-relaxed text-ink-soft">
        Your ticks are saved in this browser only, along with the rest of your PathFinder data. Export a backup
        from Settings if you switch devices. Unticking is free — this is a self-assessment, not a score.
      </Card>

      <section>
        <SectionHeading title="By phase" />
        <div className="space-y-2">
          {phases.map((p) => {
            const done = p.topics.filter((t) => checked.has(topicCheckId(t.id))).length
            const ready = p.readyWhen.filter((_, i) => checked.has(readyCheckId(p.id, i))).length
            return (
              <div key={p.id} className="rounded-xl border border-line bg-surface p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-ink">
                    {p.number}. {p.title}
                  </span>
                  <span className="text-xs tabular-nums text-ink-faint">
                    {done}/{p.topics.length} topics · {ready}/{p.readyWhen.length} exit criteria
                  </span>
                </div>
                <ProgressBar value={p.topics.length ? done / p.topics.length : 0} label={`Phase ${p.number} progress`} tone="positive" className="mt-2" />
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Master now, learn later, recognise only"
          hint="The same topics, grouped by how deeply to learn them. Tick them here or in Phases — it’s the same checklist."
        />
        <div role="group" aria-label="Depth" className="mb-3 flex flex-wrap gap-2">
          {(Object.keys(masteryLabels) as Mastery[]).map((m) => {
            const count = allTopics.filter((t) => t.mastery === m).length
            return (
              <button
                key={m}
                type="button"
                aria-pressed={view === m}
                onClick={() => setView(m)}
                className={cn(
                  'min-h-9 rounded-full border px-3.5 text-sm transition-colors',
                  view === m ? 'border-accent bg-accent-soft font-medium text-accent-ink' : 'border-line bg-surface text-ink-soft hover:text-ink',
                )}
              >
                {masteryLabels[m].label} <span className="tabular-nums text-ink-faint">{count}</span>
              </button>
            )
          })}
        </div>
        <p className="mb-2 text-xs text-ink-faint">{masteryLabels[view].hint}</p>
        <div className="-ml-2 grid sm:grid-cols-2">
          {topicsFor.map((t) => (
            <CheckItem key={t.id} id={topicCheckId(t.id)}>
              {t.name}
            </CheckItem>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Job-readiness checklist"
          hint="When every box here is honestly ticked, you’re ready to apply with confidence. Start applying for SWE roles once most of it is."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {jobReadiness.map((group) => {
            const done = group.items.filter((i) => checked.has(jobCheckId(i.id))).length
            return (
              <Card key={group.id} className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">{group.title}</p>
                  <span className="text-xs tabular-nums text-ink-faint">
                    {done}/{group.items.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink-faint">{group.hint}</p>
                <div className="mt-2 -ml-2">
                  {group.items.map((item) => (
                    <CheckItem key={item.id} id={jobCheckId(item.id)}>
                      {item.text}
                    </CheckItem>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// ═══ Shared table ════════════════════════════════════════════════════════════

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {headers.map((h) => (
              <th key={h} className="p-2.5 text-left text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i > 0 ? 'border-t border-line' : undefined}>
              {row.map((cell, j) => (
                <td key={j} className={cn('p-2.5 align-top leading-relaxed', j === 0 ? 'font-medium text-ink' : 'text-ink-soft')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
