import { ExternalLink, Info } from 'lucide-react'
import { Card } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import {
  demandForPath,
  formatSalaryRange,
  marketDataForPath,
  salaryTierExplanations,
  salaryTierLabels,
} from '@/data/marketData'
import { formatDate } from '@/lib/utils'

/**
 * Salary and market context (§4, §29).
 *
 * This component will not render a number without a source, a geography, an
 * experience level, and an access date beside it. When the data hasn't been
 * sourced yet it says so plainly — which is a worse-looking panel and a far more
 * honest one, because someone might make a real decision on this.
 */
export function MarketDataPanel({ pathId }: { pathId: string }) {
  const points = marketDataForPath(pathId)
  const demand = demandForPath(pathId)

  const verified = points.filter(
    (point) => point.status === 'verified' && point.salaryMin !== null && point.salaryMax !== null,
  )
  const missing = points.filter((point) => point.status !== 'verified')

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg text-ink">Pay and market context</h2>

      {verified.length > 0 ? (
        <div className="mt-4 space-y-4">
          {verified.map((point) => (
            <div key={point.id} className="rounded-xl border border-line bg-sunken p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Badge tone="neutral">{salaryTierLabels[point.tier]}</Badge>
                <span className="text-lg font-medium tabular-nums text-ink">
                  {formatSalaryRange(point)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {salaryTierExplanations[point.tier]}
              </p>

              <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs text-ink-faint sm:grid-cols-2">
                <div>
                  <dt className="inline font-medium">Location: </dt>
                  <dd className="inline">{point.location}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Experience: </dt>
                  <dd className="inline">{point.experienceLevelNote}</dd>
                </div>
              </dl>

              <p className="mt-2 text-xs text-ink-faint">
                Source:{' '}
                {point.sourceUrl ? (
                  <a
                    href={point.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-accent-ink hover:underline"
                  >
                    {point.source}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  point.source
                )}
                {point.accessedAt ? ` — accessed ${formatDate(point.accessedAt)}` : null}
                {point.publishedAt ? `, published ${formatDate(point.publishedAt)}` : null}
              </p>

              {point.limitations ? (
                <p className="mt-2 flex gap-1.5 text-xs leading-relaxed text-ink-faint">
                  <Info className="mt-0.5 size-3 shrink-0" aria-hidden />
                  <span>{point.limitations}</span>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {missing.length > 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-line p-4">
          <p className="text-sm font-medium text-ink">
            We haven&rsquo;t sourced salary data for this path yet.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Rather than show you a number nobody checked, this is deliberately empty. A plausible
            invented range is worse than no range — you might plan around it.
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-ink-faint">
            When looking this up yourself: check the geography, check whether it&rsquo;s an
            entry-level figure or a median across all experience levels, and note that sites which
            infer salaries from user submissions tend to skew high. Government labour statistics are
            usually the most reliable starting point.
          </p>
        </div>
      ) : null}

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-sm font-medium text-ink">Demand</p>
        {demand?.status === 'verified' && demand.summary ? (
          <>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{demand.summary}</p>
            <p className="mt-1.5 text-xs text-ink-faint">
              Source: {demand.source}
              {demand.accessedAt ? ` — accessed ${formatDate(demand.accessedAt)}` : null}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Not yet sourced. Job-posting counts on major boards, filtered to entry level and your
            location, are a rough but honest way to check this yourself.
          </p>
        )}
      </div>
    </Card>
  )
}
