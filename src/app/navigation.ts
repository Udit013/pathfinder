import {
  Compass,
  Hammer,
  Library,
  Map as MapIcon,
  MessagesSquare,
  Sparkles,
  Sun,
  type LucideIcon,
} from 'lucide-react'

/**
 * The whole of the main navigation. Identical on desktop and mobile.
 *
 * The first six read as a journey rather than a menu:
 *   Today → Explore → Roadmap → Build → Interview → Progress
 *
 * Resources sits last, slightly apart from that arc, because it is a shelf
 * rather than a step — somewhere to go when you already know what you want.
 * Keeping it out of the journey is deliberate: the flow should keep handing you
 * one thing at a time, and this is the escape hatch from that, not the default.
 *
 * Settings still isn't here. It's housekeeping, not a destination, so it lives
 * as a single quiet icon in the header.
 */
export interface NavItem {
  to: string
  label: string
  /** Shorter label for the mobile bar, where six items have to fit. */
  shortLabel?: string
  icon: LucideIcon
  /** One line answering "why am I here?" — shown on the page, not just on hover. */
  purpose: string
}

export const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Today',
    icon: Sun,
    purpose: 'One small thing to do, sized to the energy you have',
  },
  {
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    purpose: 'Find directions worth trying, and try them for real',
  },
  {
    to: '/roadmap',
    label: 'Roadmap',
    icon: MapIcon,
    purpose: 'The skills behind the direction you picked',
  },
  {
    to: '/build',
    label: 'Build',
    icon: Hammer,
    purpose: 'Turn what you learned into something you can show',
  },
  {
    to: '/interview',
    label: 'Interview Prep',
    shortLabel: 'Interview',
    icon: MessagesSquare,
    purpose: 'Practise saying it out loud, before it counts',
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: Sparkles,
    purpose: 'Everything you have learned, tried, and made',
  },
  {
    to: '/resources',
    label: 'Resources',
    icon: Library,
    purpose: 'The whole free library, for when you want to browse it yourself',
  },
]

export function purposeFor(pathname: string): string | null {
  const exact = navItems.find((item) => item.to === pathname)
  if (exact) return exact.purpose
  const nested = navItems.find((item) => item.to !== '/' && pathname.startsWith(item.to))
  return nested?.purpose ?? null
}
