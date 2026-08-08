import { Link, NavLink } from 'react-router'
import { Hammer, Settings } from 'lucide-react'
import { brand } from '@/config/brand'
import { useTodayMode } from '@/lib/store/selectors'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * Deliberately thin. On mobile it carries the brand plus the two areas that
 * don't fit in the five-tab bottom bar; on desktop it only shows today's shape.
 * The global "Copy PathFinder Context" action lands here in Phase 7.
 */
export function AppHeader() {
  const { shape, budgetMinutes, fromCheckIn } = useTodayMode()

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-md lg:px-8">
      <Link to="/" className="font-display text-base tracking-tight text-ink lg:hidden">
        {brand.name}
      </Link>

      <div className="flex-1" />

      {fromCheckIn ? (
        <span className="hidden items-center gap-2 text-xs text-ink-faint sm:flex">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          {shape.label} day · about {formatMinutes(budgetMinutes)}
        </span>
      ) : null}

      <div className="flex items-center gap-0.5 lg:hidden">
        {[
          { to: '/build', label: 'Build', icon: Hammer },
          { to: '/settings', label: 'Settings', icon: Settings },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={({ isActive }) =>
              cn(
                'flex size-9 items-center justify-center rounded-full transition-colors',
                isActive ? 'bg-accent-soft text-accent-ink' : 'text-ink-faint hover:bg-sunken',
              )
            }
          >
            <item.icon className="size-4" aria-hidden />
          </NavLink>
        ))}
      </div>
    </header>
  )
}
