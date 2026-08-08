import type { Resource, ResourcePriority, ResourceRole } from '@/types'
import { foundationResources } from './foundations'
import { engineeringResources } from './engineering'
import { dataResources } from './data'
import { aiResources } from './ai'
import { careerResources } from './careers'

export { VERIFIED } from './shared'

/**
 * The whole library. Large on purpose; almost none of it is shown at once.
 *
 * Everything the UI displays goes through `pickForSkill` or `pickFor`, which
 * return at most a handful. If you find yourself rendering `resources` directly,
 * that is the bug.
 */
export const resources: Resource[] = [
  ...foundationResources,
  ...engineeringResources,
  ...dataResources,
  ...aiResources,
  ...careerResources,
]

const byId = new Map(resources.map((resource) => [resource.id, resource]))

export function resourceById(id: string): Resource | undefined {
  return byId.get(id)
}

export function resourcesByIds(ids: string[]): Resource[] {
  return ids.map((id) => byId.get(id)).filter((resource): resource is Resource => Boolean(resource))
}

// ─── Ordering ────────────────────────────────────────────────────────────────

const priorityWeight: Record<ResourcePriority, number> = { s: 0, a: 1, b: 2, optional: 3 }

/** Sequence order: what you open first, then practise with, then go deeper on. */
const roleWeight: Record<ResourceRole, number> = {
  start: 0,
  practice: 1,
  project: 2,
  interview: 3,
  deeper: 4,
  reference: 5,
  credential: 6,
}

function compare(a: Resource, b: Resource): number {
  return (
    priorityWeight[a.priority] - priorityWeight[b.priority] ||
    roleWeight[a.role] - roleWeight[b.role] ||
    a.estimatedMinutes - b.estimatedMinutes
  )
}

// ─── Curated selection ───────────────────────────────────────────────────────

export interface ResourcePick {
  /** One thing to open first. */
  start: Resource | null
  /** One thing to practise with. */
  practice: Resource | null
  /** Optional — only when there's something genuinely worth going deeper on. */
  deeper: Resource | null
  /** Everything else for this skill, behind "see more". */
  more: Resource[]
  /** Flat list of what to show by default, already ordered. */
  primary: Resource[]
}

const EMPTY: ResourcePick = { start: null, practice: null, deeper: null, more: [], primary: [] }

/**
 * The core of the "don't build a course catalogue" rule.
 *
 * Returns at most three resources to show, plus the rest hidden behind a link.
 * A time budget shrinks it further — if someone has 45 minutes, a 100-hour
 * course is not a useful suggestion, however good it is.
 */
export function pickForSkill(
  skillId: string,
  options: { maxMinutes?: number; careerPathId?: string | null } = {},
): ResourcePick {
  const { maxMinutes, careerPathId } = options

  const relevant = resources
    .filter((resource) => resource.skillIds.includes(skillId))
    .sort((a, b) => {
      // Nudge resources matching the user's direction upward, without letting
      // that outrank a clearly better general resource.
      const aMatch = careerPathId && a.careerPathIds.includes(careerPathId) ? -0.5 : 0
      const bMatch = careerPathId && b.careerPathIds.includes(careerPathId) ? -0.5 : 0
      return compare(a, b) + aMatch - bMatch
    })

  if (relevant.length === 0) return EMPTY

  const fitsBudget = (resource: Resource) =>
    maxMinutes === undefined || resource.estimatedMinutes <= maxMinutes * 3

  const take = (roles: ResourceRole[], used: Set<string>, requireBudget = true) =>
    relevant.find(
      (resource) =>
        roles.includes(resource.role) &&
        !used.has(resource.id) &&
        (!requireBudget || fitsBudget(resource)),
    ) ?? null

  const used = new Set<string>()

  const start = take(['start', 'reference'], used) ?? take(['start', 'reference'], used, false)
  if (start) used.add(start.id)

  const practice = take(['practice', 'project', 'interactive' as ResourceRole], used)
  if (practice) used.add(practice.id)

  // Only offer "deeper" when it's genuinely a step up, not just another link.
  const deeper = relevant.find(
    (resource) =>
      !used.has(resource.id) &&
      (resource.role === 'deeper' || resource.role === 'project') &&
      (resource.priority === 's' || resource.priority === 'a'),
  ) ?? null
  if (deeper) used.add(deeper.id)

  const primary = [start, practice, deeper].filter((r): r is Resource => Boolean(r))
  const more = relevant.filter((resource) => !used.has(resource.id))

  return { start, practice, deeper, more, primary }
}

/** Same shape, across several skills — used by quests, projects and experiments. */
export function pickForSkills(
  skillIds: string[],
  options: { maxMinutes?: number; careerPathId?: string | null; limit?: number } = {},
): Resource[] {
  const { limit = 3 } = options
  const seen = new Set<string>()
  const picked: Resource[] = []

  for (const skillId of skillIds) {
    for (const resource of pickForSkill(skillId, options).primary) {
      if (seen.has(resource.id)) continue
      seen.add(resource.id)
      picked.push(resource)
    }
  }

  return picked.sort(compare).slice(0, limit)
}

/** Resources for a career path, for the path page. Kept to a handful. */
export function pickForCareerPath(pathId: string, limit = 4): Resource[] {
  return resources
    .filter((resource) => resource.careerPathIds.includes(pathId))
    .sort(compare)
    .slice(0, limit)
}

/** Interview-shaped resources for a track. */
export function pickForInterview(skillIds: string[], pathId: string | null, limit = 3): Resource[] {
  return resources
    .filter(
      (resource) =>
        resource.interviewRelevance >= 2 &&
        (resource.skillIds.some((id) => skillIds.includes(id)) ||
          (pathId !== null && resource.careerPathIds.includes(pathId))),
    )
    .sort((a, b) => b.interviewRelevance - a.interviewRelevance || compare(a, b))
    .slice(0, limit)
}

/** Project-shaped resources — datasets, simulations, build platforms. */
export function pickProjectResources(skillIds: string[], limit = 3): Resource[] {
  return resources
    .filter(
      (resource) => resource.projectRelevance >= 2 && resource.skillIds.some((id) => skillIds.includes(id)),
    )
    .sort((a, b) => b.projectRelevance - a.projectRelevance || compare(a, b))
    .slice(0, limit)
}

// ─── Library statistics, used by Settings and the validator ──────────────────

export function libraryStats() {
  const freeCertificates = resources.filter(
    (resource) => resource.credential === 'free_certificate',
  ).length
  const badges = resources.filter(
    (resource) =>
      resource.credential === 'free_badge' || resource.credential === 'free_completion_record',
  ).length
  const noCertificate = resources.filter(
    (resource) => resource.credential === 'no_certificate',
  ).length
  const verified = resources.filter((resource) => resource.verified).length
  const tracks = new Set(resources.flatMap((resource) => resource.careerPathIds))

  return {
    total: resources.length,
    verified,
    freeCertificates,
    badges,
    noCertificate,
    fullyFree: resources.filter((resource) => resource.cost === 'free').length,
    freeTier: resources.filter((resource) => resource.cost === 'free_tier').length,
    tracks: tracks.size,
  }
}
