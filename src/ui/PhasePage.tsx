import type { ReactNode } from 'react'
import { Card } from './Card'

/**
 * An honest stand-in for an area that hasn't been built yet.
 *
 * It says what will be here and what it's for. It never renders fake data or
 * dead controls, because a demo that pretends to work is worse than a page that
 * admits it doesn't.
 */
export function PhasePage({
  title,
  intro,
  building,
  aside,
}: {
  title: string
  intro: string
  building: { title: string; body: string }[]
  aside?: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pt-2">
      <header>
        <h1 className="font-display text-2xl leading-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{intro}</p>
      </header>

      {aside}

      <Card tone="sunken" className="p-5">
        <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">Being built here</p>
        <ul className="mt-3 space-y-3.5">
          {building.map((item) => (
            <li key={item.title}>
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
