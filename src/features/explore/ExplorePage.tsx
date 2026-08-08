import { Link } from 'react-router'
import { ArrowRight, Check, FlaskConical, Plus, RotateCcw, Star } from 'lucide-react'
import type { CareerPathSummary } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { careerCategories, pathById, pathsByCategory } from '@/data/careerPaths'
import { hasDetail } from '@/data/careerPathDetails'
import { experimentsForPath } from '@/data/experiments'
import { useAppStore } from '@/lib/store/useAppStore'
import { useProfile, useSignals, useSuggestedExperiment } from '@/lib/store/selectors'
import { experimentById } from '@/data/experiments'
import { SignalBars } from './SignalBars'
import { cn } from '@/lib/utils'

/**
 * Explore (§9) — "discovering possible futures".
 *
 * Ordered by what actually helps: what you're already exploring, what your
 * activity is saying, then the full catalog. Every category is browsable and
 * "Explore beyond tech" is stated as non-exhaustive.
 */
export function ExplorePage() {
  const profile = useProfile()
  const signals = useSignals()
  const suggestion = useSuggestedExperiment()
  const dismissedPathIds = useAppStore((state) => state.dismissedPathIds)
  const restorePath = useAppStore((state) => state.restorePath)

  const activePathIds = profile?.activePathIds ?? []
  const activePaths = activePathIds
    .map(pathById)
    .filter((path): path is CareerPathSummary => Boolean(path))

  const suggested = suggestion ? experimentById(suggestion.experimentId) : null

  return (
    <div className="mx-auto w-full max-w-3xl space-y-9 pt-2">
      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">Explore</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Directions you could go, and small experiments to find out how each one actually feels.
          Nothing here commits you to anything — and your degree doesn&rsquo;t settle it either.
        </p>
      </header>

      {/* The single most useful action, when there is one. */}
      {suggested && suggestion ? (
        <Card tone="accent" className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs tracking-[0.14em] text-accent-ink/70 uppercase">
                Worth trying next
              </p>
              <p className="mt-1.5 font-display text-lg leading-snug text-accent-ink">
                {suggested.title}
              </p>
              <p className="mt-1 text-sm text-accent-ink/85">{suggestion.reason}.</p>
            </div>
            <ButtonLink to={`/explore/lab/${suggested.id}`} className="shrink-0">
              <FlaskConical className="size-4" aria-hidden />
              Try it
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      {activePaths.length > 0 ? (
        <section>
          <SectionHeading
            title="What you're exploring"
            hint="Add or drop these freely. Dropping one keeps everything you learned."
            action={
              <Link
                to="/explore/lab"
                className="text-sm font-medium text-accent-ink hover:underline"
              >
                Career Lab
              </Link>
            }
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {activePaths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </section>
      ) : null}

      <SignalBars signals={signals} limit={6} />

      {/* The catalog */}
      {careerCategories.map((category) => {
        const paths = pathsByCategory(category.id).filter(
          (path) => !dismissedPathIds.includes(path.id),
        )
        if (paths.length === 0) return null

        return (
          <section key={category.id}>
            <SectionHeading title={category.label} hint={category.blurb} />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {paths.map((path) => (
                <PathCard key={path.id} path={path} />
              ))}
            </div>
            {category.openEnded ? (
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                This list is a starting point, not a boundary. If the thing you&rsquo;re curious
                about isn&rsquo;t here, that&rsquo;s a gap in our catalog rather than a sign it
                isn&rsquo;t worth exploring.
              </p>
            ) : null}
          </section>
        )
      })}

      {dismissedPathIds.length > 0 ? (
        <section>
          <SectionHeading title="Set aside" hint="Nothing was deleted. Bring any of these back." />
          <div className="flex flex-wrap gap-2">
            {dismissedPathIds.map((pathId) => (
              <button
                key={pathId}
                type="button"
                onClick={() => restorePath(pathId)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                {pathById(pathId)?.title ?? pathId}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function PathCard({ path }: { path: CareerPathSummary }) {
  const profile = useProfile()
  const togglePathInterest = useAppStore((state) => state.togglePathInterest)
  const setPrimaryPath = useAppStore((state) => state.setPrimaryPath)

  const isActive = profile?.activePathIds.includes(path.id) ?? false
  const isPrimary = profile?.primaryPathId === path.id
  const experimentCount = experimentsForPath(path.id).length
  const written = hasDetail(path.id)

  return (
    <Card
      className={cn(
        'group relative flex flex-col p-4 transition-[border-color,box-shadow] duration-150',
        isPrimary ? 'border-accent' : 'hover:border-line-strong hover:shadow-sm',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link to={`/explore/${path.id}`} className="min-w-0 flex-1 after:absolute after:inset-0">
          <span className="block text-sm font-medium text-ink group-hover:text-accent-ink">
            {path.title}
          </span>
        </Link>
        {isPrimary ? (
          <Badge tone="accent" className="relative z-10 shrink-0">
            <Star className="size-3" aria-hidden />
            Following
          </Badge>
        ) : null}
      </div>

      <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">{path.tagline}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
        {experimentCount > 0 ? (
          <span>
            {experimentCount} experiment{experimentCount === 1 ? '' : 's'}
          </span>
        ) : null}
        {!written ? <span>Write-up in progress</span> : null}
      </div>

      {/* Relative + z-10 so these stay clickable above the card-wide link. */}
      <div className="relative z-10 mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={isActive ? 'soft' : 'secondary'}
          onClick={() => togglePathInterest(path.id)}
        >
          {isActive ? (
            <>
              <Check className="size-3.5" aria-hidden />
              Exploring
            </>
          ) : (
            <>
              <Plus className="size-3.5" aria-hidden />
              Explore this
            </>
          )}
        </Button>
        {isActive && !isPrimary ? (
          <Button size="sm" variant="ghost" onClick={() => setPrimaryPath(path.id)}>
            Follow on Today
          </Button>
        ) : null}
      </div>
    </Card>
  )
}

/** Small inline link used by Today and the path page. */
export function ExploreMoreLink() {
  return (
    <Link
      to="/explore"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink hover:underline"
    >
      Explore other directions
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  )
}
