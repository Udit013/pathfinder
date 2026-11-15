import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Card } from '@/ui/Card'
import {
  allTopics,
  masteryLabels,
  phases,
  topicCheckId,
  tracks,
  type Domain,
  type Mastery,
  type RoleId,
} from '@/data/engineeringRoadmap'
import { Label, MasteryBadge, RoleChips } from '../parts'
import { Section, Toggles } from '../common'
import { roleLabels, stepOfTopic, useChecklist } from '../shared'
import type { Destination } from '../nav'
import { cn } from '@/lib/utils'

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

export function TopicsView({ go }: { go: (to: Destination) => void }) {
  const { checked } = useChecklist()
  const [query, setQuery] = useState('')
  const [mastery, setMastery] = useState<Mastery | 'all'>('all')
  const [role, setRole] = useState<RoleId | 'all'>('all')

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return allTopics.filter((t) => {
      if (mastery !== 'all' && t.mastery !== mastery) return false
      if (role !== 'all' && !t.roles.includes(role)) return false
      const hay = `${t.name} ${t.domain} ${t.what}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [query, mastery, role])

  const byDomain = domainOrder
    .map((domain) => ({ domain, topics: filtered.filter((t) => t.domain === domain) }))
    .filter((g) => g.topics.length > 0)

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-ink-soft">
        All {allTopics.length} topics in one place, grouped by area. Use this when you want to jump straight to
        something — every topic opens at its place in the learning path.
      </p>

      <Card className="space-y-3 p-4">
        <label htmlFor="topic-search" className="sr-only">
          Search topics
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input
            id="topic-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — try “sql”, “docker” or “rag”"
            className="min-h-11 w-full rounded-full border border-line bg-surface py-2 pr-4 pl-9 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </div>
        <Toggles
          label="Depth"
          value={mastery}
          onChange={setMastery}
          options={[
            { id: 'all', label: 'Any depth' },
            ...(Object.keys(masteryLabels) as Mastery[]).map((m) => ({
              id: m,
              label: masteryLabels[m].label,
              count: allTopics.filter((t) => t.mastery === m).length,
            })),
          ]}
        />
        <Toggles
          label="Role"
          value={role}
          onChange={setRole}
          options={[{ id: 'all', label: 'Any role' }, ...(Object.keys(roleLabels) as RoleId[]).map((r) => ({ id: r, label: roleLabels[r] }))]}
        />
        <p className="text-xs text-ink-faint" role="status">
          {filtered.length} of {allTopics.length} topics
        </p>
      </Card>

      {byDomain.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
          No topics match. Try a broader search or clear a filter.
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {byDomain.map((group) => (
          <Card key={group.domain} className="p-4">
            <p className="font-medium text-ink">{group.domain}</p>
            <ul className="mt-2 space-y-1">
              {group.topics.map((t) => {
                const step = stepOfTopic.get(t.id)!
                const done = checked.has(topicCheckId(t.id))
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => go({ tab: 'path', step: step.id, topic: t.id })}
                      className="flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sunken"
                    >
                      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', masteryDot[t.mastery])} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block leading-snug', done ? 'text-ink-faint line-through' : 'text-ink')}>{t.name}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-2">
                          <MasteryBadge mastery={t.mastery} />
                          <RoleChips roles={t.roles} />
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-sunken px-2 py-0.5 text-xs text-ink-soft">Step {step.number}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        ))}
      </div>

      <Section title="Timeline and dependencies" summary="How the steps line up over the weeks, and which steps each one builds on.">
        <Card className="overflow-x-auto p-4">
          <div className="min-w-[44rem]">
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
        <div className="grid gap-2 sm:grid-cols-2">
          {phases.map((p) => (
            <div key={p.id} className="rounded-xl border border-line px-3 py-2 text-sm">
              <span className="font-medium text-ink">
                Step {p.number}. {p.title}
              </span>
              <span className="block text-xs text-ink-faint">
                {p.dependsOn.length === 0
                  ? 'No prerequisites'
                  : `Needs: ${p.dependsOn.map((id) => `Step ${phases.find((x) => x.id === id)?.number}`).join(', ')}`}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shared core vs role-specific" summary="What all four roles must master, and what depends on the role you’re aiming at.">
        <SharedVsSpecific />
      </Section>
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
        className={cn('h-5 rounded-md', tone === 'phase' ? 'bg-accent/80' : 'bg-spark-soft ring-1 ring-spark/40 ring-inset')}
        style={{ gridColumn: `${start + 2} / ${Math.min(end, TOTAL_WEEKS) + 2}` }}
        aria-label={`${label}: weeks ${start} to ${end}`}
      />
    </li>
  )
}

function SharedVsSpecific() {
  const roleIds: RoleId[] = ['swe', 'fullstack', 'fde', 'ai']
  const shared = allTopics.filter((t) => t.roles.length === 4 && t.mastery === 'must')
  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">The shared core is what all four roles must master. Everything else depends on which role you’re aiming at.</p>
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
                        <span className="text-ink-faint" aria-label="Not needed">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
