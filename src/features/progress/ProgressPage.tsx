import { FlaskConical, Sparkles } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ProgressBar } from '@/ui/Progress'
import { EmptyState } from '@/ui/States'
import { ButtonLink } from '@/ui/Button'
import { PhasePage } from '@/ui/PhasePage'
import { SignalBars } from '@/features/explore/SignalBars'
import { useAppStore } from '@/lib/store/useAppStore'
import { useExperimentTally, useShowUpDays, useSignals, useXp } from '@/lib/store/selectors'
import { experimentById } from '@/data/experiments'
import { formatDate, pluralize } from '@/lib/utils'

/**
 * Progress (§12, §18, §21).
 *
 * Phase 2 delivers the signals and the evidence trail behind them. The wins log
 * and reflection history land with Phase 5 and 6 — until then this page shows
 * what it genuinely has rather than padding.
 */
export function ProgressPage() {
  const signals = useSignals()
  const { xp, current, next, fraction, xpToNext } = useXp()
  const showUpDays = useShowUpDays()
  const showShowUpCount = useAppStore((state) => state.preferences.showShowUpCount)
  const events = useAppStore((state) => state.events)
  const { completedIds } = useExperimentTally()
  const responses = useAppStore((state) => state.experimentResponses)

  const hasActivity = events.length > 0

  if (!hasActivity) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 pt-2">
        <header>
          <h1 className="font-display text-2xl leading-tight text-ink">Progress</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Evidence of what you&rsquo;ve learned, tried, and discovered — built from what you
            actually did, so it holds up on the days your confidence doesn&rsquo;t.
          </p>
        </header>
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="Nothing to show yet — which is just where everyone starts."
          body="Complete a quest or try one experiment, and this page starts filling in with the evidence."
          action={<ButtonLink to="/explore/lab">Try an experiment</ButtonLink>}
        />
      </div>
    )
  }

  const recent = [...events].reverse().slice(0, 12)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-9 pt-2">
      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">Progress</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Everything here is derived from what you did. Nothing is a guess about you.
        </p>
      </header>

      {/* Growth — counts up only. */}
      <Card className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-lg text-ink">{current.title}</p>
          <p className="text-sm tabular-nums text-ink-soft">{xp} XP</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">{current.note}</p>
        <ProgressBar
          value={fraction}
          label={next ? `Progress toward ${next.title}` : 'All milestones reached'}
          className="mt-3"
        />
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-ink-faint">
          {next ? <span>{xpToNext} XP until {next.title}</span> : <span>Every milestone reached.</span>}
          {showShowUpCount ? (
            <span>You&rsquo;ve shown up {pluralize(showUpDays, 'day')} this week.</span>
          ) : null}
        </div>
      </Card>

      <SignalBars signals={signals} />

      {/* Experiments and their reflections. */}
      {completedIds.length > 0 ? (
        <section>
          <SectionHeading
            title="Experiments you've tried"
            hint="What you said afterwards, in your own words."
          />
          <div className="space-y-2.5">
            {responses
              .filter((response) => response.completedAt)
              .reverse()
              .map((response) => {
                const experiment = experimentById(response.experimentId)
                if (!experiment) return null
                return (
                  <Card key={response.id} className="p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{experiment.title}</p>
                      <p className="text-xs text-ink-faint">
                        {response.completedAt ? formatDate(response.completedAt) : null}
                      </p>
                    </div>
                    {response.ratings ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tone={response.ratings.enjoyment >= 4 ? 'positive' : 'neutral'}>
                          Enjoyment {response.ratings.enjoyment}/5
                        </Badge>
                        <Badge tone={response.ratings.wantMore >= 4 ? 'positive' : 'neutral'}>
                          Want more {response.ratings.wantMore}/5
                        </Badge>
                        <Badge tone="neutral">
                          Difficulty {response.ratings.difficulty}/5
                        </Badge>
                      </div>
                    ) : null}
                    {response.reflection ? (
                      <p className="mt-2.5 border-l-2 border-line pl-3 text-sm leading-relaxed text-ink-soft italic">
                        &ldquo;{response.reflection}&rdquo;
                      </p>
                    ) : null}
                  </Card>
                )
              })}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={<FlaskConical className="size-5" />}
          title="No experiments yet."
          body="These are what turn activity into a signal about what suits you."
          action={<ButtonLink to="/explore/lab">Open the Career Lab</ButtonLink>}
        />
      )}

      {/* The raw ledger — everything above traces back to this. */}
      <section>
        <SectionHeading title="Recent activity" hint="Every point of XP came from one of these." />
        <Card className="divide-y divide-line p-0">
          {recent.map((event) => (
            <div key={event.id} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
              <p className="min-w-0 flex-1 truncate text-sm text-ink">{event.label}</p>
              <p className="shrink-0 text-xs tabular-nums text-ink-faint">
                +{event.xp} · {formatDate(event.occurredAt)}
              </p>
            </div>
          ))}
        </Card>
      </section>

      <PhasePage
        title="Still coming"
        intro="The rest of this page arrives with the later phases."
        building={[
          {
            title: 'A wins log',
            body: 'Applications, replies, conversations, and interviews — because offers are not the only measure of progress.',
          },
          {
            title: 'Skills and projects over time',
            body: 'A growing map of what you can demonstrate, not just what you have read.',
          },
          {
            title: 'Weekly reflections',
            body: 'Short answers you gave weeks ago, surfaced when they turn out to matter.',
          },
        ]}
      />
    </div>
  )
}
