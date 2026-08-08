import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Compass, Map as MapIcon } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ProgressBar } from '@/ui/Progress'
import { EmptyState } from '@/ui/States'
import { ButtonLink } from '@/ui/Button'
import { pathById } from '@/data/careerPaths'
import { roadmaps } from '@/data/roadmaps'
import { importanceExplanations } from '@/domain/roadmap'
import { useActiveRoadmap, useProfile } from '@/lib/store/selectors'
import { SkillNode } from './SkillNode'
import { SkillDetail } from './SkillDetail'
import { cn } from '@/lib/utils'

/**
 * The roadmap (§13).
 *
 * Our own visual representation: a vertical path with tiers as checkpoints,
 * which stays legible on a phone in a way a true node graph does not. The
 * connecting spine carries the progress, so the shape of the page is the
 * progress — no separate chart needed.
 */
export function RoadmapPage() {
  const profile = useProfile()
  const active = useActiveRoadmap()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  if (!profile?.primaryPathId) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pt-2">
        <Header />
        <EmptyState
          icon={<Compass className="size-5" />}
          title="Pick a direction and its map appears here."
          body="You don’t have to be sure. Following one just decides which skills show up — you can switch whenever you like, and nothing is lost when you do."
          action={<ButtonLink to="/explore">Choose a direction</ButtonLink>}
        />
        <AvailableRoadmaps />
      </div>
    )
  }

  if (!active) {
    const path = pathById(profile.primaryPathId)
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pt-2">
        <Header />
        <EmptyState
          icon={<MapIcon className="size-5" />}
          title={`We haven’t built the map for ${path?.title ?? 'this path'} yet.`}
          body="Rather than show you a generic one, it’s empty. A wrong map is worse than no map. Here’s what does exist:"
        />
        <AvailableRoadmaps />
      </div>
    )
  }

  const { roadmap, progress } = active
  const selected = progress.nodes.find((entry) => entry.node.id === selectedNodeId) ?? null

  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
      <Header />

      <Card className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-xl text-ink">{roadmap.title}</h2>
          <p className="text-sm tabular-nums text-ink-soft">
            {progress.coreCompleted} of {progress.coreTotal} core skills
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{roadmap.intro}</p>
        <ProgressBar
          value={progress.fraction}
          label={`${roadmap.title} core skill progress`}
          tone="positive"
          className="mt-3"
        />
        <p className="mt-2 text-xs text-ink-faint">
          Progress counts core skills only, so the map can actually be finished.
          {progress.coreHoursRemaining > 0
            ? ` Roughly ${progress.coreHoursRemaining} hours of core learning left — an estimate, not a deadline.`
            : ' You have covered every core skill here.'}
        </p>
      </Card>

      {progress.suggested?.skill ? (
        <Card tone="accent" className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.14em] text-accent-ink/70 uppercase">
                {progress.suggested.state === 'in_progress' ? 'Carry on with' : 'Next up'}
              </p>
              <p className="mt-1 font-display text-lg leading-snug text-accent-ink">
                {progress.suggested.skill.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNodeId(progress.suggested?.node.id ?? null)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Open
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>
        </Card>
      ) : null}

      {/* Detail panel sits above the tree on mobile so the selection is visible
          without scrolling; on desktop it becomes a sticky sidebar. */}
      <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:items-start lg:gap-6">
        <div className="order-2 lg:order-1">
          <SectionHeading
            title="The map"
            hint="Locked means “easier later”, never “not allowed”. You do not have to complete all of it."
          />

          <div className="relative">
            {/* The spine. Decorative — the tier headings carry the structure. */}
            <div
              className="absolute top-2 bottom-2 left-[0.9375rem] w-px bg-line sm:left-[1.4375rem]"
              aria-hidden
            />

            <ol className="space-y-6">
              {progress.tiers.map((tier, index) => {
                const allDone = tier.nodes.every((entry) => entry.state === 'completed')
                return (
                  <li key={tier.tier} className="relative pl-9 sm:pl-14">
                    <span
                      aria-hidden
                      className={cn(
                        'absolute top-1 left-0 flex size-8 items-center justify-center rounded-full border text-xs font-semibold sm:size-12 sm:text-sm',
                        allDone
                          ? 'border-positive-strong bg-positive-strong text-white'
                          : 'border-line bg-surface text-ink-faint',
                      )}
                    >
                      {index + 1}
                    </span>

                    <div className="grid gap-2 pt-1 sm:grid-cols-2">
                      {tier.nodes.map((entry) => (
                        <SkillNode
                          key={entry.node.id}
                          entry={entry}
                          selected={entry.node.id === selectedNodeId}
                          onOpen={() =>
                            setSelectedNodeId(
                              entry.node.id === selectedNodeId ? null : entry.node.id,
                            )
                          }
                        />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Legend */}
          <div className="mt-6 rounded-card border border-line bg-sunken p-4">
            <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">What the labels mean</p>
            <dl className="mt-2 space-y-1.5">
              {(['core', 'useful', 'optional'] as const).map((importance) => (
                <div key={importance} className="flex gap-2 text-sm">
                  <dt className="w-16 shrink-0 font-medium text-ink">
                    {importance[0]?.toUpperCase()}
                    {importance.slice(1)}
                  </dt>
                  <dd className="text-ink-soft">{importanceExplanations[importance]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="order-1 mb-6 lg:sticky lg:top-20 lg:order-2 lg:mb-0">
          {selected ? (
            <Card elevated className="p-5">
              <SkillDetail
                entry={selected}
                careerPathId={roadmap.careerPathId}
                onClose={() => setSelectedNodeId(null)}
              />
            </Card>
          ) : (
            <Card tone="sunken" className="hidden p-5 lg:block">
              <p className="text-sm font-medium text-ink">Pick a skill</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                Each one shows why it matters, roughly how long it takes, free places to learn it,
                and one task to check it stuck.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header>
      <h1 className="font-display text-2xl leading-tight text-ink">Roadmap</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
        The skills behind the direction you&rsquo;re following, in an order that makes each one
        easier than it would have been alone.
      </p>
    </header>
  )
}

/** Honest list of what's actually been built, so the empty states aren't dead ends. */
function AvailableRoadmaps() {
  return (
    <section>
      <SectionHeading title="Maps that exist so far" />
      <div className="flex flex-wrap gap-2">
        {roadmaps.map((roadmap) => (
          <Link
            key={roadmap.id}
            to={`/explore/${roadmap.careerPathId}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            {roadmap.title}
            <Badge tone="neutral">
              {roadmap.nodes.filter((node) => node.importance === 'core').length} core
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  )
}
