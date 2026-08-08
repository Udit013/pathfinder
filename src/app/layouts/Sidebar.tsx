import { NavLink } from 'react-router'
import { brand } from '@/config/brand'
import { navItems } from '@/app/navigation'
import { useProfile, useShowUpDays, useXp } from '@/lib/store/selectors'
import { useAppStore } from '@/lib/store/useAppStore'
import { ProgressBar } from '@/ui/Progress'
import { cn, pluralize } from '@/lib/utils'

export function Sidebar() {
  const profile = useProfile()
  const { xp, current, next, fraction } = useXp()
  const showUpDays = useShowUpDays()
  const showShowUpCount = useAppStore((state) => state.preferences.showShowUpCount)

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="px-5 pt-6 pb-5">
        <p className="font-display text-lg leading-none tracking-tight text-ink">{brand.name}</p>
        {profile?.name ? (
          <p className="mt-1.5 truncate text-xs text-ink-faint">{profile.name}</p>
        ) : null}
      </div>

      <nav aria-label="Main" className="flex-1 px-2.5">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                title={item.purpose}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-accent-soft font-medium text-accent-ink'
                      : 'text-ink-soft hover:bg-sunken hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn('size-4 shrink-0', isActive ? 'text-accent' : 'text-ink-faint')}
                      aria-hidden
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Growth summary. Counts up only — never a streak that can be lost (§22). */}
      <div className="m-2.5 rounded-card bg-sunken p-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">{current.title}</span>
          <span className="text-xs tabular-nums text-ink-faint">{xp} XP</span>
        </div>
        <ProgressBar
          value={fraction}
          label={next ? `Progress toward ${next.title}` : 'All milestones reached'}
          className="mt-2.5"
        />
        {showShowUpCount ? (
          <p className="mt-2.5 text-xs text-ink-faint">
            You&rsquo;ve shown up {pluralize(showUpDays, 'day')} this week.
          </p>
        ) : null}
      </div>
    </aside>
  )
}
