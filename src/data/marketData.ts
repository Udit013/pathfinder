import type { DemandContext, MarketDataPoint, SalaryTier } from '@/types'
import { careerPathSummaries } from './careerPaths'

/**
 * Salary and labour-market data (§29).
 *
 * ── Read this before adding anything ────────────────────────────────────────
 *
 * Every entry below ships as `status: 'needs_sourcing'` with null figures. That
 * is deliberate and it is not an oversight: PathFinder will not display a
 * salary number that nobody checked, and a plausible-looking invented range is
 * worse than an empty state, because someone might plan their year around it.
 *
 * To populate one:
 *   1. Open a primary source. Good ones: the US Bureau of Labor Statistics
 *      Occupational Outlook Handbook, national statistics agencies, published
 *      salary surveys that disclose their methodology.
 *   2. Record the figure, its geography, its experience level, the publication
 *      date, and the date you read it.
 *   3. Set status to 'verified' and fill `source`, `sourceUrl`, `accessedAt`.
 *   4. Fill `limitations` honestly — what the number does NOT tell the reader.
 *
 * Never mix tiers. An entry-level range, a median across all experience levels,
 * and a general market figure are three different claims, and averaging them
 * produces a number that describes nobody.
 *
 * Aggregator sites that infer salaries from user submissions are not primary
 * sources. They can be cited, but say so in `notes` — self-reported data skews
 * high and is not representative.
 */

export const salaryTierLabels: Record<SalaryTier, string> = {
  entry_level: 'Entry-level range',
  median: 'Median (all experience levels)',
  general_market: 'General market range',
}

export const salaryTierExplanations: Record<SalaryTier, string> = {
  entry_level:
    'What people are typically paid starting out. This is the number relevant to a first role.',
  median:
    'The midpoint across everyone in the occupation, including people with decades of experience. It is usually well above what a first role pays.',
  general_market:
    'A broad range across the whole occupation. Useful for scale, not for planning a specific offer.',
}

/**
 * One placeholder per career path, at the tier that actually matters to someone
 * looking for a first role. More tiers can be added per path as they're sourced.
 */
export const marketData: MarketDataPoint[] = careerPathSummaries.map((path) => ({
  id: `md-${path.id}-us-entry`,
  careerPathId: path.id,
  location: 'United States',
  tier: 'entry_level' as const,
  experienceLevelNote: '0–2 years of experience',
  currency: 'USD' as const,
  salaryMin: null,
  salaryMax: null,
  status: 'needs_sourcing' as const,
  source: null,
  sourceUrl: null,
  accessedAt: null,
  publishedAt: null,
  notes: undefined,
  limitations: undefined,
}))

export const demandContext: DemandContext[] = careerPathSummaries.map((path) => ({
  careerPathId: path.id,
  summary: null,
  status: 'needs_sourcing' as const,
  source: null,
  sourceUrl: null,
  accessedAt: null,
}))

export function marketDataForPath(pathId: string): MarketDataPoint[] {
  return marketData.filter((point) => point.careerPathId === pathId)
}

export function demandForPath(pathId: string): DemandContext | undefined {
  return demandContext.find((entry) => entry.careerPathId === pathId)
}

/** Only verified points with actual figures may ever be rendered as numbers. */
export function displayableMarketData(pathId: string): MarketDataPoint[] {
  return marketDataForPath(pathId).filter(
    (point) => point.status === 'verified' && point.salaryMin !== null && point.salaryMax !== null,
  )
}

export function formatSalaryRange(point: MarketDataPoint): string | null {
  if (point.salaryMin === null || point.salaryMax === null) return null
  const format = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: point.currency,
      maximumFractionDigits: 0,
    }).format(value)
  return `${format(point.salaryMin)} – ${format(point.salaryMax)}`
}
