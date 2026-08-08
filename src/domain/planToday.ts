import type { DailyQuestTemplate, QuestCompletion, UserProfile, WorkloadMode } from '@/types'
import { dailyQuests } from '@/data/quests'

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
  /** Skills currently in progress on the roadmap, newest first (Phase 3). */
  currentSkillIds?: string[]
}): QuestPick | null {
  const { date, mode, budgetMinutes, profile, completions, currentSkillIds = [] } = input

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
      // Highest priority: practice for a skill the user has actually started on
      // their roadmap. Following what someone chose beats following our order.
      quests: available.filter(
        (quest) =>
          quest.skillIds.some((skillId) => currentSkillIds.includes(skillId)) && fits(quest),
      ),
      reason: 'Practice for the skill you’re working on',
    },
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

