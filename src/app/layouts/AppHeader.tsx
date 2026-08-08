import { Link, NavLink, useLocation } from 'react-router'
import { Settings } from 'lucide-react'
import { brand } from '@/config/brand'
import { navItems, purposeFor } from '@/app/navigation'
import { useTodayMode } from '@/lib/store/selectors'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * A thin, quiet header whose job is answering "where am I?".
 *
 * On desktop the sidebar already answers it, so this only carries the day's
 * shape and Settings. On mobile it names the current area, because the bottom
 * bar's icons alone are not enough when you have just arrived.
 */
export function AppHeader() {
  const location = useLocation()
  const { shape, budgetMinutes, fromCheckIn } = useTodayMode()

  const current = navItems.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to),
  )
  const purpose = purposeFor(location.pathname)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-md lg:px-8">
      {/* Mobile: where you are. Desktop: the sidebar says it already. */}
      <div className="min-w-0 lg:hidden">
        {location.pathname === '/' ? (
          <Link to="/" className="font-display text-base tracking-tight text-ink">
            {brand.name}
          </Link>
        ) : (
          <p className="font-display truncate text-base text-ink">{current?.label ?? brand.name}</p>
        )}
      </div>

      <p className="hidden min-w-0 truncate text-sm text-ink-soft lg:block">{purpose}</p>

      <div className="flex-1" />

      {fromCheckIn ? (
        <span className="hidden items-center gap-2 text-xs text-ink-faint sm:flex">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          {shape.label} day · about {formatMinutes(budgetMinutes)}
        </span>
      ) : null}

      <NavLink
        to="/settings"
        aria-label="Settings"
        className={({ isActive }) =>
          cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
            isActive ? 'bg-accent-soft text-accent-ink' : 'text-ink-faint hover:bg-sunken hover:text-ink',
          )
        }
      >
        <Settings className="size-4" aria-hidden />
      </NavLink>
    </header>
  )
}
