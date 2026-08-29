import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { sprintDisclaimer, sprintSections, sprintSubtitle, sprintTitle, type SprintBlock } from '@/data/jobSearchSprint'
import { cn } from '@/lib/utils'

/**
 * The 30-Day Job Search Sprint — a reference guide, not a feature.
 *
 * PathFinder removed job tracking, Kanban boards and networking logs earlier
 * on, deliberately: turning the search itself into another dashboard to
 * maintain works against the reason this app exists. This page respects that.
 * It holds no state — no saved companies, no logged outreach, nothing that
 * persists. It is long-form reading, reachable from Interview Prep, and
 * nothing here writes to the store.
 */
export function JobSearchSprintPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
      <Link
        to="/interview"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Interview prep
      </Link>

      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">{sprintTitle}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{sprintSubtitle}</p>
      </header>

      <Card tone="sunken" className="p-4">
        <p className="text-sm leading-relaxed text-ink-soft">
          This is reading, not a tracker. PathFinder does not log your applications, save your
          target companies, or record your outreach anywhere — that state stayed deliberately out
          of this app. Keep your own spreadsheet, as the guide itself recommends below.
        </p>
        <p className="mt-2.5 text-xs leading-relaxed text-ink-faint">
          A note on the numbers: {sprintDisclaimer} PathFinder has not independently verified these
          figures — they are shown as the source described them, not as PathFinder&rsquo;s own
          research.
        </p>
      </Card>

      {sprintSections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20">
          <SectionHeading title={section.title} />
          <div className="space-y-3">
            {section.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
        </section>
      ))}

      <p className="pt-2 text-xs leading-relaxed text-ink-faint">
        Templates above are starting points — adapt them with real specifics before sending.
        A message that reads like a template performs like a mass application.
      </p>
    </div>
  )
}

function Block({ block }: { block: SprintBlock }) {
  switch (block.kind) {
    case 'p':
      return <p className="text-sm leading-relaxed text-ink-soft">{block.text}</p>

    case 'callout':
      return (
        <p className="font-display text-base leading-snug text-ink" role="heading" aria-level={3}>
          {block.text}
        </p>
      )

    case 'list':
      return (
        <ul className="space-y-1.5">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <Card tone="sunken" className="overflow-x-auto p-0">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                {block.headers.map((header, index) => (
                  <th
                    key={index}
                    className={cn(
                      'p-3 text-left text-xs font-semibold tracking-[0.08em] text-ink-faint uppercase',
                      index === 0 && 'w-1/4',
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex > 0 ? 'border-t border-line' : undefined}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        'p-3 align-top leading-relaxed text-ink-soft',
                        cellIndex === 0 && 'font-medium text-ink',
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )
  }
}
