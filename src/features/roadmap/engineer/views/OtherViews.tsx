import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ProgressBar } from '@/ui/Progress'
import { resources } from '@/data/resources'
import {
  allTopics,
  interviewTypes,
  jobCheckId,
  jobReadiness,
  masteryLabels,
  phases,
  readyCheckId,
  referencedResourceIds,
  specializations,
  topicCheckId,
  tracks,
  type Mastery,
  type RoleId,
} from '@/data/engineeringRoadmap'
import { Bullets, CheckItem, GroupedResources, Label, MasteryBadge, ProjectCard, StatusChip } from '../parts'
import { Table, Toggles, TrackCard } from '../common'
import { formatLabels, formatOf, hasFreeCredential, levels, roleLabels, stepStatus, useChecklist, type Format } from '../shared'
import type { Destination } from '../nav'

// ═══ Projects ════════════════════════════════════════════════════════════════

export function ProjectsView({ go }: { go: (to: Destination) => void }) {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-ink-soft">
        Each project builds on the last, from a tested CLI to production AI. Projects 3, 5 and 7, plus your capstone,
        are the four to pin on GitHub. Everything runs locally for free; cloud is used deliberately in Project 6,
        inside AWS’s free plan.
      </p>
      {levels.map(({ level }) => {
        const inLevel = phases.filter((p) => p.level === level && p.project)
        if (inLevel.length === 0) return null
        return (
          <section key={level} className="space-y-3">
            <SectionHeading title={`${level} projects`} />
            {inLevel.map((p) => (
              <div key={p.id}>
                <button
                  type="button"
                  onClick={() => go({ tab: 'path', step: p.id, part: 'build' })}
                  className="mb-1.5 inline-flex min-h-9 items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                >
                  From Step {p.number}: {p.title}
                  <ArrowRight className="size-3" aria-hidden />
                </button>
                <ProjectCard project={p.project!} />
              </div>
            ))}
          </section>
        )
      })}
      <section className="space-y-3">
        <SectionHeading title="Role capstones" hint="Build the one for your primary role in Step 8." />
        {specializations.map((spec) => (
          <ProjectCard key={spec.capstone.id} project={spec.capstone} />
        ))}
      </section>
    </div>
  )
}

// ═══ Roles ═══════════════════════════════════════════════════════════════════

export function RolesView() {
  const [role, setRole] = useState<RoleId>('swe')
  const spec = specializations.find((s) => s.id === role)!

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-soft">
        Steps 0–7 are shared, and that foundation is most of the work. Specialise in Step 8: pick one primary role and,
        if you like, one secondary. Trying to prepare equally for all four is how people end up ready for none.
      </p>
      <Toggles label="Role" value={role} onChange={setRole} options={specializations.map((s) => ({ id: s.id, label: s.title }))} />

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
        <Table headers={['Round', 'What they test', 'How to prepare']} rows={spec.interviewLoop.map((r) => [r.round, r.whatTheyTest, r.howToPrepare])} />
      </section>

      <section>
        <SectionHeading title="Role resources" />
        <Card className="p-4">
          <GroupedResources ids={spec.resourceIds} />
        </Card>
      </section>
    </div>
  )
}

// ═══ Interviews ══════════════════════════════════════════════════════════════

export function InterviewsView() {
  const [role, setRole] = useState<RoleId | 'all'>('all')
  const shown = interviewTypes.filter((t) => role === 'all' || t.roles.includes(role))

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-soft">
        Interview prep starts in week 3, not at the end. The two tracks below run alongside the learning path; each
        interview type shows when to start it. Every step’s “Check yourself” part also lists the questions its
        material leads to.
      </p>
      <TrackCard trackId="track-dsa" />
      <TrackCard trackId="track-interview" />

      <SectionHeading title="Interview types, in the order to start them" />
      <Toggles
        label="Filter by role"
        value={role}
        onChange={setRole}
        options={[{ id: 'all', label: 'All roles' }, ...(Object.keys(roleLabels) as RoleId[]).map((r) => ({ id: r, label: roleLabels[r] }))]}
      />

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
              <div className="mt-4 rounded-xl bg-sunken p-3">
                <GroupedResources ids={type.resourceIds} />
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

// ═══ Resources ═══════════════════════════════════════════════════════════════

type FormatFilter = Format | 'all' | 'certificates'

export function ResourcesView({ go }: { go: (to: Destination) => void }) {
  const [filter, setFilter] = useState<FormatFilter>('all')
  const cited = useMemo(() => {
    const ids = new Set(referencedResourceIds())
    return resources.filter((r) => ids.has(r.id))
  }, [])
  const freeCredentials = cited.filter(hasFreeCredential)
  const format = filter === 'all' || filter === 'certificates' ? null : filter
  const certificatesOnly = filter === 'certificates'

  const count = (f: FormatFilter) =>
    f === 'all' ? cited.length : f === 'certificates' ? freeCredentials.length : cited.filter((r) => formatOf(r) === f).length

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-ink-soft">
        Every resource in this roadmap, in learning order — step by step, topic by topic. All are free to learn from.
        Where something needs an account, has a paid tier, or charges for its certificate, the entry says so. Links were
        checked by hand; the full library, with search, is on the{' '}
        <Link to="/resources" className="font-medium text-accent-ink hover:underline">
          Resources page
        </Link>
        .
      </p>

      <Toggles
        label="Show"
        value={filter}
        onChange={setFilter}
        options={(['all', 'video', 'course', 'certificates', 'practice', 'reading'] as const).map((f) => ({
          id: f,
          label: f === 'all' ? 'Everything' : f === 'certificates' ? 'Free certificates' : formatLabels[f],
          count: count(f),
        }))}
      />

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
        <div className="mt-3">
          <GroupedResources ids={['res-docker-compose', 'res-aws-free-tier', 'res-aws-budgets', 'res-ollama']} />
        </div>
      </Card>

      {filter === 'all' ? (
        <section>
          <SectionHeading
            title="Free certificates and badges in this roadmap"
            hint="Only where the credential itself is genuinely free. Paid certification exams (AWS, Kubernetes, Terraform and so on) are optional — a deployed project you can defend counts for more."
          />
          <Card className="p-4">
            <GroupedResources ids={freeCredentials.map((r) => r.id)} />
          </Card>
        </section>
      ) : null}

      {phases.map((p) => {
        const topics = p.topics
          .map((t) => ({ t, ids: t.resourceIds }))
          .filter(({ ids }) =>
            resources.some((r) => ids.includes(r.id) && (!format || formatOf(r) === format) && (!certificatesOnly || hasFreeCredential(r))),
          )
        if (topics.length === 0) return null
        return (
          <section key={p.id}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg text-ink">
                Step {p.number} · {p.title}
              </h3>
              <button type="button" onClick={() => go({ tab: 'path', step: p.id })} className="text-xs font-medium text-accent-ink hover:underline">
                Open step →
              </button>
            </div>
            <div className="space-y-3">
              {topics.map(({ t }) => (
                <div key={t.id} className="rounded-xl border border-line bg-surface p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-ink">{t.name}</span>
                    <MasteryBadge mastery={t.mastery} />
                  </div>
                  <GroupedResources ids={t.resourceIds} format={format} certificatesOnly={certificatesOnly} />
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <section>
        <SectionHeading title="Side tracks" hint="Resources for the DSA and interview tracks that run alongside the steps." />
        <div className="space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="rounded-xl border border-line bg-surface p-3">
              <p className="mb-2 text-sm font-medium text-ink">{track.title}</p>
              <GroupedResources ids={track.resourceIds} format={format} certificatesOnly={certificatesOnly} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══ Progress ════════════════════════════════════════════════════════════════

export function ProgressView({ go }: { go: (to: Destination) => void }) {
  const { checked } = useChecklist()
  const [view, setView] = useState<Mastery>('must')
  const topicsFor = allTopics.filter((t) => t.mastery === view)

  return (
    <div className="space-y-8">
      <Card tone="sunken" className="p-4 text-sm leading-relaxed text-ink-soft">
        Your ticks are saved in this browser only, along with the rest of your PathFinder data. Export a backup from
        Settings if you switch devices. Unticking is free — this is a self-assessment, not a score.
      </Card>

      <section>
        <SectionHeading title="By step" />
        <div className="space-y-2">
          {phases.map((p) => {
            const done = p.topics.filter((t) => checked.has(topicCheckId(t.id))).length
            const ready = p.readyWhen.filter((_, i) => checked.has(readyCheckId(p.id, i))).length
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => go({ tab: 'path', step: p.id })}
                className="block w-full rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
              >
                <span className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-ink">
                    Step {p.number}. {p.title}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs tabular-nums text-ink-faint">
                      {done}/{p.topics.length} topics · {ready}/{p.readyWhen.length} exit criteria
                    </span>
                    <StatusChip status={stepStatus(p, checked)} />
                  </span>
                </span>
                <ProgressBar value={p.topics.length ? done / p.topics.length : 0} label={`Step ${p.number} progress`} tone="positive" className="mt-2" />
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          title="Master now, learn later, recognise only"
          hint="The same topics, grouped by how deeply to learn them. Tick them here or in the learning path — it’s the same checklist."
        />
        <Toggles
          label="Depth"
          value={view}
          onChange={setView}
          options={(Object.keys(masteryLabels) as Mastery[]).map((m) => ({
            id: m,
            label: masteryLabels[m].label,
            count: allTopics.filter((t) => t.mastery === m).length,
          }))}
        />
        <p className="mt-3 mb-2 text-xs text-ink-faint">{masteryLabels[view].hint}</p>
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
