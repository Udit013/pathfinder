import { useState } from 'react'
import { Check, Copy, Download, Eye, EyeOff, Table2 } from 'lucide-react'
import { Card } from '@/ui/Card'
import { Button } from '@/ui/Button'
import { datasetToCsv, tableToCsv, type Dataset } from '@/data/datasets'

const PREVIEW_ROWS = 12

/**
 * The dataset for an experiment.
 *
 * Previewed in-app so nothing has to be installed to start, and downloadable as
 * CSV so the actual work can happen in real tools — which is the point, since
 * the experiment is meant to feel like the job rather than like a quiz.
 *
 * The "what's in here" spoiler is collapsed by default. It exists so someone who
 * gets genuinely stuck can keep going rather than abandon the experiment, which
 * would teach them nothing about fit.
 */
export function DatasetViewer({ dataset }: { dataset: Dataset }) {
  const [copied, setCopied] = useState(false)
  const [spoiled, setSpoiled] = useState(false)
  const [activeTable, setActiveTable] = useState(0)

  const table = dataset.tables[activeTable] ?? dataset.tables[0]
  if (!table) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tableToCsv(table))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const download = () => {
    const blob = new Blob([datasetToCsv(dataset)], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${dataset.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Table2 className="size-4 text-ink-faint" aria-hidden />
            {dataset.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{dataset.description}</p>
          <p className="mt-1.5 text-xs text-ink-faint">
            {table.rows.length.toLocaleString()} rows · {table.columns.length} columns
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={copy}>
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? 'Copied' : 'Copy CSV'}
          </Button>
          <Button size="sm" variant="secondary" onClick={download}>
            <Download className="size-3.5" aria-hidden />
            Download
          </Button>
        </div>
      </div>

      {dataset.tables.length > 1 ? (
        <div className="flex gap-1 px-4 pb-2">
          {dataset.tables.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveTable(index)}
              className={
                index === activeTable
                  ? 'rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-ink'
                  : 'rounded-full px-3 py-1 text-xs text-ink-soft hover:bg-sunken'
              }
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}

      {/* Wide tables scroll inside their own container, never the page. */}
      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-max text-left text-xs">
          <caption className="sr-only">
            First {PREVIEW_ROWS} rows of {table.name}
          </caption>
          <thead className="bg-sunken">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-3 py-2 font-medium whitespace-nowrap text-ink-soft"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {table.rows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-1.5 whitespace-nowrap text-ink tabular-nums"
                  >
                    {cell === null || cell === '' ? (
                      <span className="text-ink-faint italic">null</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-line bg-sunken px-4 py-3">
        <p className="text-xs text-ink-faint">
          Showing the first {PREVIEW_ROWS} of {table.rows.length.toLocaleString()} rows. Download or
          copy to work with all of it.
        </p>

        <button
          type="button"
          onClick={() => setSpoiled(!spoiled)}
          className="-ml-2 mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-ink-soft hover:bg-surface hover:text-ink"
        >
          {spoiled ? <EyeOff className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
          {spoiled ? 'Hide what’s in here' : 'Stuck? Reveal what’s in this data'}
        </button>

        {spoiled ? (
          <p className="animate-rise mt-2 rounded-lg border border-line bg-surface p-3 text-xs leading-relaxed text-ink-soft">
            {dataset.spoiler}
          </p>
        ) : null}
      </div>
    </Card>
  )
}
