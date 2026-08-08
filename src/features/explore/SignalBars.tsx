import { useState } from 'react'
import { ChevronDown, FlaskConical } from 'lucide-react'
import type { CareerSignal } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { EmptyState } from '@/ui/States'
import { ButtonLink } from '@/ui/Button'
import { pathTitle } from '@/data/careerPaths'
import { difficultyNote, signalCaveat, strengthLabels } from '@/domain/signals'
import { cn } from '@/lib/utils'

/**
 * Career Signals (§12).
 *
 * Two things this component exists to guarantee:
 *   1. The disclaimer is never separated from the numbers.
 *   2. Every bar can be expanded to show exactly what produced it. A signal you
 *      cannot interrogate is indistinguishable from a horoscope.
 */
export function SignalBars({
  signals,
  title = 'Career signals',
  limit,
}: {
  signals: CareerSignal[]
  title?: string
  limit?: number
}) {
  const shown = limit ? signals.slice(0, limit) : signals

  if (shown.length === 0) {
    return (
      <section>
        <SectionHeading title={title} />
        <EmptyState
          icon={<FlaskConical className="size-5" />}
          title="Try a few experiments and we’ll start seeing patterns."
          body="Signals are built from what you actually did and how you said it felt — so there’s nothing to show until you’ve tried something."
          action={<ButtonLink to="/explore/lab">Open the Career Lab</ButtonLink>}
        />
      </section>
    )
  }

  return (
    <section>
      <SectionHeading
        title={title}
        hint="These are signals based on your activity — not a prediction of your future."
      />
      <Card className="divide-y divide-line p-0">
        {shown.map((signal) => (
          <SignalRow key={signal.careerPathId} signal={signal} />
        ))}
      </Card>
    </section>
  )
}

function SignalRow({ signal }: { signal: CareerSignal }) {
  const [open, setOpen] = useState(false)
  const fraction = Math.min(1, signal.score / 5)
  const note = difficultyNote(signal)

  const tone =
    signal.strength === 'strong'
      ? 'bg-accent'
      : signal.strength === 'moderate'
        ? 'bg-accent/70'
        : 'bg-accent/40'

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group flex w-full items-center gap-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-medium text-ink">
              {pathTitle(signal.careerPathId)}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-ink-soft">
              {signal.score.toFixed(1)}
            </span>
          </span>

          <span className="mt-2 block h-2 w-full overflow-hidden rounded-full bg-sunken">
            <span
              role="progressbar"
              aria-label={`${pathTitle(signal.careerPathId)} signal strength`}
              aria-valuenow={signal.score}
              aria-valuemin={0}
              aria-valuemax={5}
              className={cn('block h-full rounded-full transition-[width] duration-700', tone)}
              style={{ width: `${fraction * 100}%`, transitionTimingFunction: 'var(--ease-out-soft)' }}
            />
          </span>

          <span className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={signal.strength === 'strong' ? 'accent' : 'neutral'}>
              {strengthLabels[signal.strength]}
            </Badge>
            <span className="text-xs text-ink-faint">{signalCaveat(signal)}</span>
          </span>
        </span>

        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-ink-faint transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="animate-rise mt-3 rounded-xl bg-sunken p-3.5">
          <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">Why it looks like this</p>
          <ul className="mt-2 space-y-1.5">
            {signal.evidence.map((item, index) => (
              <li key={`${item.kind}-${index}`} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          {note ? <p className="mt-3 text-xs leading-relaxed text-ink-faint">{note}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
