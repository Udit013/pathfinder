import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Clock, Hammer, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { ProjectTemplate } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { ProgressBar } from '@/ui/Progress'
import { BuildDoodle, SproutDoodle } from '@/ui/Doodles'
import { projectTemplates, projectTemplateById } from '@/data/projects'
import { careerPathSummaries, pathTitle } from '@/data/careerPaths'
import { skillName } from '@/data/skills'
import {
  emptyFilters,
  filterProjects,
  projectProgress,
  projectSkillIds,
  timeBuckets,
  type ProjectFilters,
} from '@/domain/projects'
import { useAppStore } from '@/lib/store/useAppStore'
import { useProjectRecommendations } from '@/lib/store/selectors'
import { cn } from '@/lib/utils'

/**
 * Build (§16).
 *
 * Ordered so choosing is easy: what you're already making, then one or two
 * suggestions that fit what you've learned, then the full library behind a
 * filter panel that starts closed.
 *
 * The page is explicit that a small number of finished projects is the goal.
 * Nothing here counts projects started, and nothing nudges toward a second one
 * while a first is open.
 */
export function BuildPage() {
  const projects = useAppStore((state) => state.projects)
  const { recommendations, holdReason } = useProjectRecommendations()

  const [filters, setFilters] = useState<ProjectFilters>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const mine = projects.filter((project) => !project.completedAt)
  const finished = projects.filter((project) => project.completedAt)

  const filtered = useMemo(() => filterProjects(projectTemplates, filters), [filters])
  const activeFilterCount = Object.values(filters).filter((value) => value !== null).length

  return (
    <div className="mx-auto w-full max-w-3xl space-y-9 pt-2">
      <header className="animate-rise flex items-start gap-4">
        <BuildDoodle className="hidden size-14 shrink-0 sm:block" />
        <div>
          <h1 className="font-display text-2xl leading-tight text-ink">Build something</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Projects are how you stop describing your skills and start showing them. You need one or
            two good ones — not ten. One finished project beats five abandoned tutorials, every
            time.
          </p>
        </div>
      </header>

      {/* What's underway */}
      {mine.length > 0 ? (
        <section>
          <SectionHeading title="You're making" hint="Pick up where you left off." />
          <div className="stagger space-y-2.5">
            {mine.map((instance) => {
              const template = instance.templateId
                ? projectTemplateById(instance.templateId)
                : undefined
              const progress = projectProgress(instance, template)
              return (
                <Card key={instance.id} className="lift p-4">
                  <Link to={`/build/${instance.id}`} className="block">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-lg text-ink">
                        {template?.title ?? instance.customTitle ?? 'Your project'}
                      </p>
                      <p className="text-xs tabular-nums text-ink-faint">
                        {progress.done} of {progress.total} steps
                      </p>
                    </div>
                    <ProgressBar
                      value={progress.fraction}
                      label="Project progress"
                      tone="positive"
                      className="mt-2.5"
                    />
                    <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink">
                      Carry on
                      <ArrowRight className="size-3.5" aria-hidden />
                    </p>
                  </Link>
                </Card>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Finished — the actual scoreboard */}
      {finished.length > 0 ? (
        <section>
          <SectionHeading title="You finished" hint="This is the number that matters." />
          <div className="space-y-2">
            {finished.map((instance) => {
              const template = instance.templateId
                ? projectTemplateById(instance.templateId)
                : undefined
              return (
                <Card key={instance.id} tone="spark" className="lift p-4">
                  <Link to={`/build/${instance.id}`} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface">
                      <Check className="size-4 text-positive" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base text-spark-ink">
                        {template?.title ?? instance.customTitle ?? 'Your project'}
                      </span>
                      <span className="text-xs text-spark-ink/75">
                        Done. That exists because of you.
                      </span>
                    </span>
                  </Link>
                </Card>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Suggestions, or a nudge to finish what's open */}
      {holdReason ? (
        <Card tone="sunken" className="flex items-start gap-3 p-4">
          <SproutDoodle className="size-10 shrink-0" />
          <div>
            <p className="text-sm font-medium text-ink">Nothing new suggested right now</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{holdReason}</p>
          </div>
        </Card>
      ) : recommendations.length > 0 ? (
        <section>
          <SectionHeading
            title="Good fits for you right now"
            hint="Chosen from what you've actually learned — not the whole library."
          />
          <div className="stagger space-y-2.5">
            {recommendations.map(({ project, reason, readySkills, totalSkills }) => (
              <ProjectCard
                key={project.id}
                project={project}
                highlight
                reason={reason}
                readiness={`${readySkills} of ${totalSkills} skills already underway`}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* The library, behind a closed panel */}
      <section>
        <SectionHeading
          title="The whole library"
          hint={`${projectTemplates.length} projects. Deliberately few — chosen carefully, not scraped.`}
          action={
            <Button
              variant={activeFilterCount > 0 ? 'soft' : 'ghost'}
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="size-3.5" aria-hidden />
              Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
          }
        />

        {filtersOpen ? (
          <Card tone="sunken" className="animate-rise mb-3 space-y-4 p-4">
            <FilterRow
              label="Direction"
              options={careerPathSummaries
                .filter((path) => projectTemplates.some((p) => p.careerPathIds.includes(path.id)))
                .map((path) => ({ value: path.id, label: path.title }))}
              value={filters.careerPathId}
              onChange={(careerPathId) => setFilters({ ...filters, careerPathId })}
            />
            <FilterRow
              label="Difficulty"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={filters.difficulty}
              onChange={(difficulty) =>
                setFilters({ ...filters, difficulty: difficulty as ProjectFilters['difficulty'] })
              }
            />
            <FilterRow
              label="Time you have"
              options={timeBuckets.map((bucket) => ({
                value: String(bucket.hours ?? 'any'),
                label: bucket.label,
              }))}
              value={filters.maxHours === null ? null : String(filters.maxHours)}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  maxHours: value === null || value === 'any' ? null : Number(value),
                })
              }
            />
            <FilterRow
              label="Skill you want to practise"
              options={projectSkillIds()
                .map((id) => ({ value: id, label: skillName(id) }))
                .sort((a, b) => a.label.localeCompare(b.label))}
              value={filters.skillId}
              onChange={(skillId) => setFilters({ ...filters, skillId })}
            />

            {activeFilterCount > 0 ? (
              <Button variant="ghost" size="sm" className="-ml-1.5" onClick={() => setFilters(emptyFilters)}>
                Clear filters
              </Button>
            ) : null}
          </Card>
        ) : null}

        {filtered.length === 0 ? (
          <Card tone="sunken" className="p-5 text-center">
            <p className="font-display text-lg text-ink">Nothing matches all of that.</p>
            <p className="mt-1.5 text-sm text-ink-soft">
              Try loosening one filter — the library is small on purpose.
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => setFilters(emptyFilters)}>
              Clear filters
            </Button>
          </Card>
        ) : (
          <div className="stagger grid gap-2.5 sm:grid-cols-2">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <p className="pb-2 text-center text-xs leading-relaxed text-ink-faint">
        Two or three finished projects is a portfolio. Ten half-built ones is a browser history.
      </p>
    </div>
  )
}

function ProjectCard({
  project,
  highlight,
  reason,
  readiness,
}: {
  project: ProjectTemplate
  highlight?: boolean
  reason?: string
  readiness?: string
}) {
  const existing = useAppStore((state) =>
    state.projects.find((entry) => entry.templateId === project.id),
  )

  return (
    <Card
      tone={highlight ? 'accent' : 'default'}
      className={cn('lift p-4', highlight && 'border-transparent')}
    >
      <Link to={`/build/library/${project.id}`} className="block">
        {reason ? (
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-ink/80">
            <Sparkles className="size-3" aria-hidden />
            {reason}
          </p>
        ) : null}

        <p
          className={cn(
            'font-display text-base leading-snug',
            highlight ? 'text-accent-ink' : 'text-ink',
          )}
        >
          {project.title}
        </p>
        <p
          className={cn(
            'mt-1 text-[0.8125rem] leading-snug',
            highlight ? 'text-accent-ink/85' : 'text-ink-soft',
          )}
        >
          {project.whatYouWillBuild}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">
            <Clock className="size-3" aria-hidden />~{project.estimatedHours}h
          </Badge>
          <Badge tone="neutral">{project.difficulty}</Badge>
          {existing?.completedAt ? (
            <Badge tone="positive">
              <Check className="size-3" aria-hidden />
              Finished
            </Badge>
          ) : existing ? (
            <Badge tone="caution">
              <Hammer className="size-3" aria-hidden />
              Underway
            </Badge>
          ) : null}
        </div>

        {readiness ? (
          <p className="mt-2 text-xs text-accent-ink/75">{readiness}</p>
        ) : (
          <p className="mt-2 text-xs text-ink-faint">
            {project.careerPathIds.slice(0, 2).map(pathTitle).join(' · ')}
          </p>
        )}
      </Link>
    </Card>
  )
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string | null) => void
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs tracking-[0.14em] text-ink-faint uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition-all duration-150 active:scale-[0.97]',
                selected
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
