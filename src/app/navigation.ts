import {
  Compass,
  Hammer,
  Map as MapIcon,
  Settings,
  Sparkles,
  Sun,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** One line explaining the area, shown on hover and to screen readers. */
  description: string
  /** Present in the mobile bottom bar (§32 — five tabs, no more). */
  mobile: boolean
}

export const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Today',
    icon: Sun,
    description: 'What to do next, sized to the energy you have',
    mobile: true,
  },
  {
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    description: 'Career directions, and small experiments to try them',
    mobile: true,
  },
  {
    to: '/roadmap',
    label: 'Roadmap',
    icon: MapIcon,
    description: 'The skills for the direction you are exploring',
    mobile: true,
  },
  {
    to: '/build',
    label: 'Build',
    icon: Hammer,
    description: 'Projects that become evidence of what you can do',
    mobile: false,
  },
  {
    to: '/jobs',
    label: 'Jobs',
    icon: Briefcase,
    description: 'Applications, outreach, and interview preparation',
    mobile: true,
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: Sparkles,
    description: 'What you have learned, tried, and discovered',
    mobile: true,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Preferences and your data',
    mobile: false,
  },
]

export const mobileNavItems = navItems.filter((item) => item.mobile)
