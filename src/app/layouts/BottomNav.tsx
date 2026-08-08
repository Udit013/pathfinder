import { NavLink } from 'react-router'
import { navItems } from '@/app/navigation'
import { cn } from '@/lib/utils'

/**
 * The mobile bar. Every area, because a nav that hides things is a nav you have
 * to learn — and the whole point of this pass is that you never have to wonder
 * where something lives.
 */
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <ul
        className="mx-auto grid max-w-lg"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-w-0 flex-col items-center gap-0.5 px-0.5 py-2 transition-colors',
                  // Seven labels have to share the width. This holds the normal
                  // size on a 375px phone and steps down on narrower ones,
                  // rather than letting "Resources" collide with its neighbour.
                  'text-[clamp(0.5625rem,2.55vw,0.625rem)]',
                  isActive ? 'text-accent-ink' : 'text-ink-faint',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full transition-all duration-200',
                      isActive && 'bg-accent-soft',
                    )}
                  >
                    <item.icon className="size-[1.05rem]" aria-hidden />
                  </span>
                  <span
                    className={cn(
                      'w-full truncate text-center leading-tight',
                      isActive && 'font-semibold',
                    )}
                  >
                    {item.shortLabel ?? item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
