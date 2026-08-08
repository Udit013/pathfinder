import { useLocation } from 'react-router'
import { ButtonLink } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { PathDoodle } from '@/ui/Doodles'
import { navItems } from '@/app/navigation'

/**
 * A wrong URL used to silently redirect to Today, which is disorienting — you
 * click a stale bookmark and land somewhere with no explanation. This says what
 * happened, blames the link rather than the person, and offers the way onward.
 */
export function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="mx-auto w-full max-w-lg pt-6 text-center">
      <PathDoodle className="mx-auto h-20 w-32 text-ink-faint" />

      <h1 className="font-display mt-4 text-2xl leading-tight text-ink">
        That path doesn&rsquo;t go anywhere.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        There&rsquo;s nothing at <code className="rounded bg-sunken px-1.5 py-0.5 text-xs">{location.pathname}</code>.
        Most likely the link is old rather than anything you did wrong.
      </p>

      <ButtonLink to="/" size="lg" className="mt-5">
        Take me to Today
      </ButtonLink>

      <Card tone="sunken" className="mt-7 p-4 text-left">
        <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">Or go somewhere useful</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <ButtonLink to={item.to} variant="ghost" size="sm" className="w-full justify-start">
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
