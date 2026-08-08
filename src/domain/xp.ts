import type { ProgressEvent, ProgressEventKind } from '@/types'
import { todayIso } from '@/lib/utils'

/**
 * Gamification (§21, §22).
 *
 * There is no way to lose XP, no lives, no streak reset, and no leaderboard.
 * Everything here only ever counts up.
 */

export const xpTable: Record<ProgressEventKind, number> = {
  quest_completed: 25,
  skill_started: 5,
  skill_completed: 60,
  experiment_completed: 40,
  project_started: 15,
  project_milestone: 35,
  project_completed: 120,
  interview_practised: 20,
  interview_topic_completed: 70,
  reflection_added: 10,
  path_chosen: 15,
  concept_understood: 15,
}

export function totalXp(events: ProgressEvent[]): number {
  return events.reduce((sum, event) => sum + event.xp, 0)
}

/**
 * Milestones are named moments, not levels to grind. Each one describes
 * something the user actually did by the time they reach it.
 */
export interface Milestone {
  xp: number
  title: string
  note: string
}

export const milestones: Milestone[] = [
  { xp: 0, title: 'Starting out', note: 'You opened the door. That is the hard part.' },
  { xp: 100, title: 'Finding your footing', note: 'You have a few real data points about yourself now.' },
  { xp: 300, title: 'Building momentum', note: 'Skills are stacking up and the path is getting clearer.' },
  { xp: 700, title: 'Gathering evidence', note: 'You have things to show, not just things you have read.' },
  { xp: 1200, title: 'Ready to be asked', note: 'You can learn it, build it, and talk about it out loud.' },
  { xp: 2000, title: 'Well underway', note: 'This is what sustained effort looks like from the inside.' },
]

export interface MilestoneProgress {
  current: Milestone
  next: Milestone | null
  xp: number
  /** 0–1 toward the next milestone, or 1 when the last one is reached. */
  fraction: number
  xpToNext: number
}

export function milestoneProgress(xp: number): MilestoneProgress {
  let currentIndex = 0
  for (let index = 0; index < milestones.length; index += 1) {
    const milestone = milestones[index]
    if (milestone && xp >= milestone.xp) currentIndex = index
  }

  const current = milestones[currentIndex] ?? milestones[0]!
  const next = milestones[currentIndex + 1] ?? null

  if (!next) return { current, next: null, xp, fraction: 1, xpToNext: 0 }

  const span = next.xp - current.xp
  const gained = xp - current.xp
  return {
    current,
    next,
    xp,
    fraction: span <= 0 ? 1 : Math.min(1, Math.max(0, gained / span)),
    xpToNext: Math.max(0, next.xp - xp),
  }
}

/**
 * §22 — "You've shown up 4 days this week", never "4-day streak".
 * Counts distinct active days in the trailing 7 days. Missing a day changes
 * nothing except this number, and it can only be recovered by showing up.
 */
export function showUpDaysThisWeek(events: ProgressEvent[], now: Date = new Date()): number {
  const cutoff = now.getTime() - 6 * 86_400_000
  const days = new Set<string>()
  for (const event of events) {
    const time = new Date(event.occurredAt).getTime()
    if (Number.isNaN(time) || time < cutoff) continue
    days.add(todayIso(new Date(time)))
  }
  return days.size
}

/** Micro-interaction copy (§31). Quick, subtle, never a lecture. */
export const celebrationCopy: Partial<Record<ProgressEventKind, string>> = {
  quest_completed: 'Quest complete.',
  skill_completed: 'New skill unlocked.',
  experiment_completed: 'Another piece of the puzzle.',
  project_milestone: "You're building evidence.",
  project_completed: 'That exists now because of you.',
  interview_practised: 'You said it out loud. That is the hard part.',
  interview_topic_completed: 'That topic is yours now.',
  concept_understood: 'That one clicked.',
}
