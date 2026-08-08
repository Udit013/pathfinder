import type { EnergyLevel, WorkloadMode } from '@/types'

/**
 * Energy adaptation (§8, §23).
 *
 * Rules this file exists to enforce:
 *   - A lighter day is a valid day. No copy here implies otherwise.
 *   - Nothing is ever framed as "behind", "missed", or "lost".
 */

export const energyOptions: { value: EnergyLevel; emoji: string; label: string }[] = [
  { value: 'low', emoji: '😴', label: 'Low' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'high', emoji: '🔥', label: 'High' },
]

export function modeForEnergy(energy: EnergyLevel): WorkloadMode {
  switch (energy) {
    case 'low':
      return 'light'
    case 'okay':
    case 'good':
      return 'normal'
    case 'high':
      return 'deep'
  }
}

export interface ModeShape {
  mode: WorkloadMode
  label: string
  /** The honest ask, shown up front. */
  minutesMin: number
  minutesMax: number
  /** What a day in this mode contains. */
  contains: string[]
  /** Supportive, never corrective. */
  message: string
}

export const modeShapes: Record<WorkloadMode, ModeShape> = {
  light: {
    mode: 'light',
    label: 'Light',
    minutesMin: 20,
    minutesMax: 30,
    contains: ['One short lesson', 'One small practice exercise', 'One job-search action'],
    message: 'A small step still counts.',
  },
  normal: {
    mode: 'normal',
    label: 'Normal',
    minutesMin: 60,
    minutesMax: 90,
    contains: [
      'Learning',
      'Hands-on practice',
      'One career exploration',
      'One application or outreach',
    ],
    message: "A steady day. Nothing dramatic, just forward.",
  },
  deep: {
    mode: 'deep',
    label: 'Deep work',
    minutesMin: 120,
    minutesMax: 180,
    contains: [
      'Project development',
      'Technical preparation',
      'Portfolio work',
      'A few applications',
    ],
    message: 'Good day for the hard thing.',
  },
}

const order: WorkloadMode[] = ['light', 'normal', 'deep']

/** "Make this lighter" — one step down, no commentary, never below light. */
export function lighterMode(mode: WorkloadMode): WorkloadMode {
  const index = order.indexOf(mode)
  return order[Math.max(0, index - 1)] ?? 'light'
}


/**
 * The minute budget today's plan is allowed to fill, clamped by what the user
 * said they realistically have. Their stated capacity always wins.
 */
export function minuteBudget(mode: WorkloadMode, weekdayMinutes: number): number {
  const shape = modeShapes[mode]
  return Math.max(15, Math.min(shape.minutesMax, weekdayMinutes))
}
