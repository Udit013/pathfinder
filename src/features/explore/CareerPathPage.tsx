import { Link, useParams } from 'react-router'
import {
  Check,
  Clock,
  FlaskConical,
  Plus,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { BackLink } from '@/ui/BackLink'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { AskAiButton } from '@/features/ai/AskAiButton'
import { EmptyState } from '@/ui/States'
import { FreeResources } from '@/ui/ResourceLinks'
import { pathById, pathTitle } from '@/data/careerPaths'
import { fullPathById } from '@/data/careerPathDetails'
import { experimentsForPath } from '@/data/experiments'
import { pickForCareerPath, resourcesByIds } from '@/data/resources'
import { useAppStore } from '@/lib/store/useAppStore'
import { useProfile, useSignalFor } from '@/lib/store/selectors'
import { MarketDataPanel } from './MarketDataPanel'
import { SignalBars } from './SignalBars'
import { formatMinutes } from '@/lib/utils'

/**
 * A career path page (§10).
 *
 * The most important element is the TRY IT button, not the reading — the whole
 * product thesis is that you cannot decide this from a description.
 */
export function CareerPathPage() {
  const { pathId = '' } = useParams()
  const summary = pathById(pathId)
  const path = fullPathById(pathId)
  const signal = useSignalFor(pathId)
  const profile = useProfile()

  const togglePathInterest = useAppStore((state) => state.togglePathInterest)
  const setPrimaryPath = useAppStore((state) => state.setPrimaryPath)
  const dismissPath = useAppStore((state) => state.dismissPath)

  if (!summary) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="We don’t have a path with that name."
          body="It may have been renamed."
          action={<ButtonLink to="/explore">Back to Explore</ButtonLink>}
        />
      </div>
    )
  }

  const isActive = profile?.activePathIds.includes(pathId) ?? false
  const isPrimary = profile?.primaryPathId === pathId
  const experiments = experimentsForPath(pathId)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pt-2">
      <BackLink to="/explore">Explore</BackLink>

      <header>
        <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
          {summary.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{summary.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant={isActive ? 'soft' : 'primary'} onClick={() => togglePathInterest(pathId)}>
            {isActive ? (
              <>
                <Check className="size-4" aria-hidden />
                Exploring this
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden />
                Explore this
              </>
            )}
          </Button>
          {!isPrimary ? (
            <Button variant="secondary" onClick={() => setPrimaryPath(pathId)}>
              <Star className="size-4" aria-hidden />
              Follow on Today
            </Button>
          ) : (
            <Badge tone="accent" className="self-center">
              <Star className="size-3" aria-hidden />
              Today follows this
            </Badge>
          )}
          <Button variant="ghost" onClick={() => dismissPath(pathId)}>
            <X className="size-4" aria-hidden />
            Not for me
          </Button>
        </div>
      </header>

      {/* TRY IT — deliberately above the reading material (§10). */}
      {experiments.length > 0 ? (
        <Card tone="accent" elevated className="p-5">
          <p className="text-xs tracking-[0.14em] text-accent-ink/70 uppercase">Try it first</p>
          <p className="mt-1.5 font-display text-lg leading-snug text-accent-ink">
            You can&rsquo;t tell from reading whether you&rsquo;d like this.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-accent-ink/85">
            Spend {formatMinutes(experiments[0]?.estimatedMinutes ?? 45)} doing a small piece of the
            actual work, then tell us how it felt. That&rsquo;s worth more than the whole page below.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ButtonLink to={`/explore/lab/${experiments[0]?.id ?? ''}`}>
              <FlaskConical className="size-4" aria-hidden />
              Try a mini experiment
            </ButtonLink>
            {experiments.length > 1 ? (
              <ButtonLink to="/explore/lab" variant="secondary">
                See all {experiments.length}
              </ButtonLink>
            ) : null}
          </div>
        </Card>
      ) : null}

      {signal ? <SignalBars signals={[signal]} title="Your signal for this path" /> : null}

      <div className="flex justify-center">
        <AskAiButton kind="career_reflection" label="Ask AI if this fits me" />
      </div>

      {!path ? (
        <Card tone="sunken" className="p-5">
          <p className="text-sm font-medium text-ink">
            The full write-up for this path is still being written.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Rather than fill this page with generic text, here&rsquo;s what we do know about it —
            and the experiments above still work.
          </p>
          <div className="mt-4 space-y-3">
            <Facts summary={summary} />
          </div>
        </Card>
      ) : (
        <>
          <Section title="What is it?">
            {path.whatItIs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-ink-soft">
                {paragraph}
              </p>
            ))}
          </Section>

          <Section title="What does a normal day look like?">
            <List items={path.typicalDay} />
          </Section>

          <Section title="What do people actually produce?">
            <List items={path.deliverables} />
          </Section>

          <Card className="p-5">
            <Facts summary={summary} />
          </Card>

          <MarketDataPanel pathId={pathId} />

          <Section title="Preparation">
            <Card tone="sunken" className="p-4">
              <p className="text-sm font-medium text-ink">
                Roughly {path.preparation.estimatedMonthsMin}–{path.preparation.estimatedMonthsMax}{' '}
                months
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {path.preparation.scopeNote}
              </p>
            </Card>
          </Section>

          <Section title="How interviews work">
            <List items={path.interviewFormat} />
          </Section>

          <Section title="What a portfolio needs">
            <List items={path.portfolioExpectations} />
          </Section>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-positive-ink">
                <ThumbsUp className="size-4" aria-hidden />
                What&rsquo;s good about it
              </p>
              <List items={path.advantages} className="mt-2" />
            </Card>
            <Card className="p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-caution-ink">
                <ThumbsDown className="size-4" aria-hidden />
                What&rsquo;s hard about it
              </p>
              <List items={path.challenges} className="mt-2" />
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm font-medium text-ink">You might enjoy this if</p>
              <List items={path.enjoyIf} className="mt-2" />
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-ink">You might dislike this if</p>
              <List items={path.dislikeIf} className="mt-2" />
            </Card>
          </div>

          <FreeResources
            resources={(() => {
              const chosen = resourcesByIds(path.starterResourceIds)
              const seen = new Set(chosen.map((r) => r.id))
              return [...chosen, ...pickForCareerPath(pathId, 4).filter((r) => !seen.has(r.id))].slice(0, 4)
            })()}
            title="Where to start"
            hint="Free, and enough to find out whether the foundations interest you."
          />

          {summary.adjacentPathIds.length > 0 ? (
            <section>
              <SectionHeading
                title="Close to this"
                hint="These share most of their skills — trying one tells you something about the others."
              />
              <div className="flex flex-wrap gap-2">
                {summary.adjacentPathIds.map((id) => (
                  <Link
                    key={id}
                    to={`/explore/${id}`}
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {pathTitle(id)}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      {experiments.length > 0 ? (
        <section>
          <SectionHeading title="Experiments for this path" />
          <div className="space-y-2">
            {experiments.map((experiment) => (
              <Link
                key={experiment.id}
                to={`/explore/lab/${experiment.id}`}
                className="flex items-start gap-3 rounded-card border border-line bg-surface p-3.5 transition-colors hover:border-line-strong"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                  <FlaskConical className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{experiment.title}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-faint">
                    <Clock className="size-3" aria-hidden />
                    {formatMinutes(experiment.estimatedMinutes)} · {experiment.difficulty}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionHeading title={title} />
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

function List({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 py-1 text-sm leading-relaxed text-ink-soft">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Facts({ summary }: { summary: NonNullable<ReturnType<typeof pathById>> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">Entry-level titles</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {summary.entryLevelTitles.join(' · ')}
        </p>
      </div>
      <div>
        <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">Common tools</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {summary.commonTools.join(' · ')}
        </p>
      </div>
    </div>
  )
}
