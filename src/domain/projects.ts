import type { ProjectInstance, ProjectTemplate, SkillProgress, UserProfile } from '@/types'
import { projectTemplates } from '@/data/projects'

/**
 * Choosing what to build (§16).
 *
 * The rule this file exists to enforce: never show the whole library first.
 * A wall of projects turns choosing into the hard part, and choosing is exactly
 * where people stall. So we lead with one or two that fit what the person has
 * actually learned, and keep the rest one click away.
 *
 * The other rule: never nudge someone toward a second project while a first is
 * unfinished. One finished project beats five abandoned ones, and the product
 * should behave as if it believes that.
 */

export interface ProjectRecommendation {
  project: ProjectTemplate
  /** Shown to the user, so the suggestion isn't a black box. */
  reason: string
  /** How many of the project's skills the user has started or finished. */
  readySkills: number
  totalSkills: number
}

export interface RecommendationInput {
  profile: UserProfile | null
  skillProgress: SkillProgress[]
  projects: ProjectInstance[]
}

/**
 * Returns at most two suggestions — or none, when something is already underway.
 */
export function recommendProjects(input: RecommendationInput): {
  recommendations: ProjectRecommendation[]
  /** Set when we're deliberately not recommending anything new. */
  holdReason: string | null
} {
  const { profile, skillProgress, projects } = input

  const inProgress = projects.filter((project) => !project.completedAt)
  if (inProgress.length > 0) {
    return {
      recommendations: [],
      holdReason:
        'You have something underway. Finishing it is worth more than starting another — one finished project beats five abandoned ones.',
    }
  }

  const startedTemplateIds = new Set(
    projects.map((project) => project.templateId).filter((id): id is string => Boolean(id)),
  )

  const touched = new Map(skillProgress.map((entry) => [entry.skillId, entry.state]))
  const activePathIds = profile?.activePathIds ?? []
  const primaryPathId = profile?.primaryPathId ?? null

  const scored = projectTemplates
    .filter((project) => !startedTemplateIds.has(project.id))
    .map((project) => {
      const readySkills = project.skillIds.filter((skillId) => {
        const state = touched.get(skillId)
        return state === 'completed' || state === 'in_progress'
      }).length

      const completedSkills = project.skillIds.filter(
        (skillId) => touched.get(skillId) === 'completed',
      ).length

      const onPrimary = primaryPathId ? project.careerPathIds.includes(primaryPathId) : false
      const onActive = project.careerPathIds.some((id) => activePathIds.includes(id))

      // Skill overlap dominates: the point is "you can start this now", not
      // "this matches your job title".
      const score =
        completedSkills * 3 +
        (readySkills - completedSkills) * 1.5 +
        (onPrimary ? 4 : 0) +
        (onActive ? 2 : 0) +
        // Gently favour smaller projects — finishing matters more than scope.
        Math.max(0, 3 - project.estimatedHours / 8)

      return { project, readySkills, completedSkills, onPrimary, onActive, score }
    })
    .sort((a, b) => b.score - a.score)

  const recommendations = scored.slice(0, 2).map((entry) => ({
    project: entry.project,
    readySkills: entry.readySkills,
    totalSkills: entry.project.skillIds.length,
    reason: reasonFor(entry),
  }))

  return { recommendations, holdReason: null }
}

function reasonFor(entry: {
  readySkills: number
  completedSkills: number
  onPrimary: boolean
  onActive: boolean
  project: ProjectTemplate
}): string {
  if (entry.completedSkills >= 2) {
    return `Uses ${entry.completedSkills} skills you've already learned`
  }
  if (entry.readySkills >= 2) {
    return `Practises what you're working on right now`
  }
  if (entry.onPrimary) {
    return 'Matches the direction you’re following'
  }
  if (entry.onActive) {
    return 'Matches a direction you’re exploring'
  }
  return 'A good first project whichever way you go'
}

// ─── Filtering (§16) ─────────────────────────────────────────────────────────

export interface ProjectFilters {
  careerPathId: string | null
  difficulty: ProjectTemplate['difficulty'] | null
  /** Upper bound in hours. Null means no limit. */
  maxHours: number | null
  skillId: string | null
}

export const emptyFilters: ProjectFilters = {
  careerPathId: null,
  difficulty: null,
  maxHours: null,
  skillId: null,
}

export const timeBuckets = [
  { label: 'A weekend', hours: 10 },
  { label: 'A week or two', hours: 16 },
  { label: 'Longer is fine', hours: null },
] as const

export function filterProjects(
  projects: ProjectTemplate[],
  filters: ProjectFilters,
): ProjectTemplate[] {
  return projects.filter((project) => {
    if (filters.careerPathId && !project.careerPathIds.includes(filters.careerPathId)) return false
    if (filters.difficulty && project.difficulty !== filters.difficulty) return false
    if (filters.maxHours !== null && project.estimatedHours > filters.maxHours) return false
    if (filters.skillId && !project.skillIds.includes(filters.skillId)) return false
    return true
  })
}

/** Every skill any project practises, for the filter control. */
export function projectSkillIds(): string[] {
  return [...new Set(projectTemplates.flatMap((project) => project.skillIds))]
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface ProjectProgress {
  done: number
  total: number
  fraction: number
  /** The next unfinished milestone, or null when everything is done. */
  nextMilestoneId: string | null
  allDone: boolean
}

export function projectProgress(
  instance: ProjectInstance,
  template: ProjectTemplate | undefined,
): ProjectProgress {
  const total = template?.milestones.length ?? instance.milestones.length
  const doneIds = new Set(
    instance.milestones.filter((entry) => entry.state === 'done').map((entry) => entry.milestoneId),
  )
  const next = template?.milestones.find((milestone) => !doneIds.has(milestone.id))

  return {
    done: doneIds.size,
    total,
    fraction: total === 0 ? 0 : doneIds.size / total,
    nextMilestoneId: next?.id ?? null,
    allDone: total > 0 && doneIds.size === total,
  }
}

/**
 * Copy for a completed milestone. Warm, brief, and never implying the next one
 * is now owed (§16, §21).
 */
export const milestoneCheers = [
  'That part exists now.',
  'One piece down.',
  'Nice — that’s real progress.',
  'That’s a bit more evidence.',
  'Good. That was the fiddly one.',
  'Something exists that didn’t before.',
]

export function cheerFor(index: number): string {
  return milestoneCheers[index % milestoneCheers.length] ?? milestoneCheers[0]!
}
