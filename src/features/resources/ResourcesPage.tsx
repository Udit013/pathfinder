import { useMemo, useState } from 'react'
import { Award, Library, Search, X } from 'lucide-react'
import { resourceKindLabels, type ResourceKind } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { EmptyState } from '@/ui/States'
import { ResourceRow } from '@/ui/ResourceLinks'
import { careerPathSummaries } from '@/data/careerPaths'
import { resources } from '@/data/resources'
import {
  emptyFilters,
  filterResources,
  groupByTopic,
  hasActiveFilters,
  libraryStats,
  type LibraryFilters,
} from '@/domain/library'
import { cn } from '@/lib/utils'

/**
 * The library (§14, resource library expansion).
 *
 * This page breaks PathFinder's own rule on purpose, and it is the only place
 * that does. Everywhere else you get two or three resources chosen for where
 * you are, because "where do I even start?" is the feeling this product exists
 * to remove. But sometimes you know exactly what you want and just need the
 * shelf — and sending someone to Google for that would be a worse answer.
 *
 * So: the whole thing, organised and searchable, with an honest note at the top
 * that collecting resources is not the same as making progress.
 */
export function ResourcesPage() {
  const [filters, setFilters] = useState<LibraryFilters>(emptyFilters)

  const filtered = useMemo(() => filterResources(filters), [filters])
  const groups = useMemo(() => groupByTopic(filtered), [filtered])
  const stats = useMemo(() => libraryStats(), [])

  const active = hasActiveFilters(filters)
  const update = (patch: Partial<LibraryFilters>) => setFilters({ ...filters, ...patch })

  // Only offer types that actually exist, so no filter can return nothing.
  const kinds = useMemo(() => {
    const present = new Set(resources.map((resource) => resource.kind))
    return (Object.keys(resourceKindLabels) as ResourceKind[]).filter((kind) => present.has(kind))
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pt-2">
      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">Resources</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Every free resource in PathFinder, in one place. {stats.total} of them, each one opened
          and checked by hand rather than collected from a list.
        </p>
      </header>

      <Card tone="accent" className="p-4">
        <p className="text-sm leading-relaxed text-accent-ink">
          One honest warning before you scroll.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-accent-ink/85">
          Reading this page is not progress. Four excellent resources finished will do more for you
          than forty bookmarked, and one project you can talk about will do more than a stack of
          certificates. If you only want to know what to do next, the rest of PathFinder answers
          that in one or two links at a time — that is what it&rsquo;s for.
        </p>
      </Card>

      {/* Search and filters */}
      <Card className="p-4">
        <label htmlFor="library-search" className="sr-only">
          Search resources
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            id="library-search"
            type="search"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Search by name, provider, or skill — try “sql” or “system design”"
            className={cn(
              'min-h-11 w-full rounded-full border border-line bg-surface py-2 pr-4 pl-9',
              'text-sm text-ink placeholder:text-ink-faint',
              'focus:border-accent focus:outline-none',
            )}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="library-track">
            Filter by direction
          </label>
          <select
            id="library-track"
            value={filters.careerPathId ?? ''}
            onChange={(event) => update({ careerPathId: event.target.value || null })}
            className={cn(
              'min-h-11 rounded-full border border-line bg-surface px-3.5 text-sm text-ink',
              'focus:border-accent focus:outline-none',
            )}
          >
            <option value="">Any direction</option>
            {careerPathSummaries.map((path) => (
              <option key={path.id} value={path.id}>
                {path.title}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="library-kind">
            Filter by type
          </label>
          <select
            id="library-kind"
            value={filters.kind ?? ''}
            onChange={(event) => update({ kind: (event.target.value || null) as ResourceKind | null })}
            className={cn(
              'min-h-11 rounded-full border border-line bg-surface px-3.5 text-sm text-ink',
              'focus:border-accent focus:outline-none',
            )}
          >
            <option value="">Any type</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {resourceKindLabels[kind]}
              </option>
            ))}
          </select>

          <Toggle
            pressed={filters.freeCertificateOnly}
            onClick={() => update({ freeCertificateOnly: !filters.freeCertificateOnly })}
          >
            <Award className="size-3.5" aria-hidden />
            Free certificate
          </Toggle>

          <Toggle
            pressed={filters.interviewOnly}
            onClick={() => update({ interviewOnly: !filters.interviewOnly })}
          >
            Helps in interviews
          </Toggle>

          {active ? (
            <button
              type="button"
              onClick={() => setFilters(emptyFilters)}
              className={cn(
                'inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-sm',
                'text-ink-soft transition-colors hover:text-ink',
              )}
            >
              <X className="size-3.5" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-xs text-ink-faint" role="status">
          {active
            ? `${filtered.length} of ${stats.total} resources match.`
            : `${stats.total} resources · ${stats.free} free with no account needed · ${stats.freeCredential} that award a free certificate or badge.`}
        </p>
      </Card>

      {/* Jump links — 16 sections is a lot to scroll past on a phone. */}
      {groups.length > 1 ? (
        <nav aria-label="Jump to section" className="flex flex-wrap gap-1.5">
          {groups.map((group) => (
            <a
              key={group.topic.id}
              href={`#topic-${group.topic.id}`}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5',
                'text-xs text-ink-soft transition-colors hover:border-line-strong hover:text-ink',
              )}
            >
              {group.topic.label}
              <span className="tabular-nums text-ink-faint">{group.resources.length}</span>
            </a>
          ))}
        </nav>
      ) : null}

      {groups.length === 0 ? (
        <EmptyState
          icon={<Library className="size-5" />}
          title="Nothing matches that combination."
          body="Try removing a filter, or searching for a skill name like “sql”, “react” or “statistics”."
        />
      ) : null}

      {groups.map((group) => (
        <section key={group.topic.id} id={`topic-${group.topic.id}`} className="scroll-mt-20">
          <SectionHeading
            title={group.topic.label}
            hint={group.topic.blurb}
            action={
              <Badge tone="neutral">
                {group.resources.length}
                <span className="sr-only"> resources</span>
              </Badge>
            }
          />
          <ul className="space-y-2">
            {group.resources.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} showCredential />
            ))}
          </ul>
        </section>
      ))}

      <p className="pt-2 text-xs leading-relaxed text-ink-faint">
        All links were last checked on {stats.lastChecked ?? 'an unrecorded date'}. Free means free
        to learn from — where a certificate costs money, or an account is needed, the entry says so.
        If a link has moved since, it&rsquo;s the link that&rsquo;s wrong, not you.
      </p>
    </div>
  )
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors',
        pressed
          ? 'border-accent bg-accent-soft text-accent-ink'
          : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
