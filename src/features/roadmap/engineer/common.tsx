import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/ui/Card'
import { tracks } from '@/data/engineeringRoadmap'
import { Bullets, GroupedResources, Label } from './parts'
import { cn } from '@/lib/utils'

/** A simple data table that scrolls inside its own box on small screens. */
export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {headers.map((h) => (
              <th key={h} className="p-2.5 text-left text-xs font-semibold tracking-[0.06em] text-ink-faint uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i > 0 ? 'border-t border-line' : undefined}>
              {row.map((cell, j) => (
                <td key={j} className={cn('p-2.5 align-top leading-relaxed', j === 0 ? 'font-medium text-ink' : 'text-ink-soft')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A collapsible section with a one-line summary, so long reference material
 * is one click away instead of in the way. Native <details>: keyboard and
 * screen-reader support come for free.
 */
export function Section({
  title,
  summary,
  defaultOpen,
  children,
}: {
  title: string
  summary: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details className="group rounded-card border border-line bg-surface" open={defaultOpen}>
      <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="font-display block text-lg leading-snug text-ink">{title}</span>
          <span className="mt-0.5 block text-sm text-ink-soft">{summary}</span>
        </span>
        <ChevronDown className="mt-1.5 size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-5 border-t border-line p-4">{children}</div>
    </details>
  )
}

/** One of the two side tracks (DSA, interview practice), expandable. */
export function TrackCard({ trackId, defaultOpen }: { trackId: string; defaultOpen?: boolean }) {
  const track = tracks.find((t) => t.id === trackId)!
  const [open, setOpen] = useState(Boolean(defaultOpen))
  return (
    <Card tone="spark" className="p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span>
          <span className="text-xs tracking-[0.12em] text-spark-ink/70 uppercase">
            Runs alongside the steps · weeks {track.weekStart}–{track.weekEnd}
          </span>
          <span className="font-display mt-0.5 block text-lg leading-snug text-spark-ink">{track.title}</span>
          <span className="mt-0.5 block text-xs text-spark-ink/80">{track.hours}</span>
        </span>
        <ChevronDown className={cn('mt-1 size-4 shrink-0 text-spark-ink transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open ? (
        <div className="mt-3 space-y-4">
          <p className="text-sm leading-relaxed text-spark-ink/90">{track.summary}</p>
          <Table headers={['When', 'Focus', 'Milestone']} rows={track.steps.map((s) => [s.weeks, s.focus, s.milestone])} />
          <div>
            <Label>Method</Label>
            <div className="mt-1.5">
              <Bullets items={track.method} />
            </div>
          </div>
          <div className="rounded-xl bg-surface p-3">
            <GroupedResources ids={track.resourceIds} />
          </div>
        </div>
      ) : null}
    </Card>
  )
}

/** Toggle-button group for in-page filters. */
export function Toggles<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            'min-h-9 rounded-full border px-3.5 text-sm transition-colors',
            value === option.id
              ? 'border-accent bg-accent-soft font-medium text-accent-ink'
              : 'border-line bg-surface text-ink-soft hover:text-ink',
          )}
        >
          {option.label}
          {option.count !== undefined ? <span className="ml-1 tabular-nums text-ink-faint">{option.count}</span> : null}
        </button>
      ))}
    </div>
  )
}
