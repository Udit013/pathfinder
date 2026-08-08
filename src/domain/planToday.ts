import type {
  DailyQuestTemplate,
  NetworkingQuest,
  QuestCompletion,
  UserProfile,
  WorkloadMode,
} from '@/types'
import { dailyQuests } from '@/data/quests'
import { networkingQuests } from '@/data/networking'

/**
 * Choosing what to put in front of the user today (§7, §8).
 *
 * Deterministic for a given day, so reloading the page never reshuffles the
 * plan out from under someone. Nothing here escalates: a light day cannot be
 * handed a two-hour quest, and running out of matching quests produces an
 * honest empty result rather than a repeat.
 */

/** Small stable hash, so the same date + set yields the same pick. */
function hash(input: string): number {
  let value = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return Math.abs(value)
}

function pickStable<T>(items: T[], seed: string): T | null {
  if (items.length === 0) return null
  return items[hash(seed) % items.length] ?? null
}

export interface QuestPick {
  quest: DailyQuestTemplate
  /** True when the light variant should be shown instead of the full task. */
  lightened: boolean
  /** Why this one — shown to the user so the choice isn't a black box. */
  reason: string
}

/** Minutes a quest asks for, accounting for the lighter variant. */
function effortMinutes(quest: DailyQuestTemplate, lightened: boolean): number {
  if (!lightened) return quest.estimatedMinutes
  return Math.max(10, Math.round(quest.estimatedMinutes * 0.5))
}

export function selectQuest(input: {
  date: string
  mode: WorkloadMode
  budgetMinutes: number
  profile: UserProfile | null
  completions: QuestCompletion[]
}): QuestPick | null {
  const { date, mode, budgetMinutes, profile, completions } = input

  const doneQuestIds = new Set(
    completions.filter((entry) => entry.completedAt).map((entry) => entry.questId),
  )
  const available = dailyQuests.filter((quest) => !doneQuestIds.has(quest.id))
  if (available.length === 0) return null

  const activePathIds = profile?.activePathIds ?? []
  const primaryPathId = profile?.primaryPathId ?? null

  // On a light day, prefer quests that have a genuinely smaller version.
  const lightDay = mode === 'light'

  const fits = (quest: DailyQuestTemplate) => {
    const lightened = lightDay && Boolean(quest.lighterVariant)
    return effortMinutes(quest, lightened) <= budgetMinutes
  }

  const tiers: { quests: DailyQuestTemplate[]; reason: string }[] = [
    {
      quests: available.filter(
        (quest) => primaryPathId && quest.careerPathIds.includes(primaryPathId) && fits(quest),
      ),
      reason: 'Next step on the direction you’re starting with',
    },
    {
      quests: available.filter(
        (quest) =>
          quest.careerPathIds.some((id) => activePathIds.includes(id)) && fits(quest),
      ),
      reason: 'Relevant to what you said you’re curious about',
    },
    {
      // Path-agnostic quests (job search, reflection) suit anyone.
      quests: available.filter((quest) => quest.careerPathIds.length === 0 && fits(quest)),
      reason: 'Useful whichever direction you go',
    },
    {
      quests: available.filter(fits),
      reason: 'A good general starting point',
    },
    {
      // Nothing fits the budget — offer the smallest thing rather than nothing.
      quests: [...available].sort((a, b) => a.estimatedMinutes - b.estimatedMinutes).slice(0, 3),
      reason: 'The smallest thing available today',
    },
  ]

  for (const tier of tiers) {
    const quest = pickStable(tier.quests, `${date}:${tier.reason}`)
    if (quest) {
      return {
        quest,
        lightened: lightDay && Boolean(quest.lighterVariant),
        reason: tier.reason,
      }
    }
  }

  return null
}

export interface JobActionPick {
  quest: NetworkingQuest
  reason: string
}

export function selectJobAction(input: {
  date: string
  /** Ids of networking quests already logged, so we don't repeat one. */
  completedQuestIds: string[]
  /** Whether there is anything waiting on a follow-up. */
  hasStaleApplications: boolean
}): JobActionPick | null {
  const done = new Set(input.completedQuestIds)
  const available = networkingQuests.filter((quest) => !done.has(quest.id))
  if (available.length === 0) return null

  if (input.hasStaleApplications) {
    const followUp = available.find((quest) => quest.id === 'n-follow-up')
    if (followUp) {
      return { quest: followUp, reason: 'Something has gone quiet — worth one nudge' }
    }
  }

  const quest = pickStable(available, `${input.date}:job`)
  return quest ? { quest, reason: 'One small move on the search' } : null
}
