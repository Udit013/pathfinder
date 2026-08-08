import type { NodeImportance, NodeState, Roadmap, RoadmapNode, SkillProgress } from '@/types'
import { skillById } from '@/data/skills'

/**
 * Roadmap state (§13).
 *
 * "Locked" here means "this will be much easier after its prerequisites",
 * never "you are forbidden". The UI says so, and every locked node can still be
 * opened and started — someone who already knows a prerequisite from elsewhere
 * should not have to fake their way past our graph.
 *
 * Progress is measured against CORE nodes only. Counting optional nodes in the
 * denominator would mean the map can never be finished, which is precisely the
 * feeling this product is trying to avoid.
 */

export interface ResolvedNode {
  node: RoadmapNode
  state: NodeState
  /** Prerequisite skill ids not yet completed. Empty when unlocked. */
  missingPrerequisites: string[]
  /** Resolved skill; undefined only if content is inconsistent. */
  skill: ReturnType<typeof skillById>
}

export interface ResolvedTier {
  tier: number
  nodes: ResolvedNode[]
}

export interface RoadmapProgress {
  tiers: ResolvedTier[]
  nodes: ResolvedNode[]
  /** Completed / total, over CORE nodes only. */
  coreCompleted: number
  coreTotal: number
  fraction: number
  /** Total hours remaining across unfinished core nodes. */
  coreHoursRemaining: number
  /** What to do next: in-progress first, then the cheapest available core node. */
  suggested: ResolvedNode | null
}

function stateFor(
  node: RoadmapNode,
  progress: Map<string, SkillProgress>,
  completed: Set<string>,
): { state: NodeState; missing: string[] } {
  const own = progress.get(node.skillId)
  if (own?.state === 'completed') return { state: 'completed', missing: [] }

  const missing = node.dependsOn.filter((skillId) => !completed.has(skillId))
  if (own?.state === 'in_progress') return { state: 'in_progress', missing }
  return { state: missing.length > 0 ? 'locked' : 'available', missing }
}

export function resolveRoadmap(
  roadmap: Roadmap,
  skillProgress: SkillProgress[],
): RoadmapProgress {
  const progress = new Map(skillProgress.map((entry) => [entry.skillId, entry]))
  const completed = new Set(
    skillProgress.filter((entry) => entry.state === 'completed').map((entry) => entry.skillId),
  )

  const nodes: ResolvedNode[] = roadmap.nodes.map((node) => {
    const { state, missing } = stateFor(node, progress, completed)
    return {
      node,
      state,
      missingPrerequisites: missing,
      skill: skillById(node.skillId),
    }
  })

  const tierNumbers = [...new Set(nodes.map((entry) => entry.node.tier))].sort((a, b) => a - b)
  const tiers: ResolvedTier[] = tierNumbers.map((tier) => ({
    tier,
    nodes: nodes.filter((entry) => entry.node.tier === tier),
  }))

  const core = nodes.filter((entry) => entry.node.importance === 'core')
  const coreCompleted = core.filter((entry) => entry.state === 'completed').length
  const coreHoursRemaining = core
    .filter((entry) => entry.state !== 'completed')
    .reduce((sum, entry) => sum + (entry.skill?.estimatedHours ?? 0), 0)

  // Finish what's started before starting something new; otherwise take the
  // smallest available core node, because momentum matters more than order.
  const inProgress = nodes.find((entry) => entry.state === 'in_progress')
  const nextAvailable = core
    .filter((entry) => entry.state === 'available')
    .sort(
      (a, b) =>
        a.node.tier - b.node.tier ||
        (a.skill?.estimatedHours ?? 0) - (b.skill?.estimatedHours ?? 0),
    )[0]

  return {
    tiers,
    nodes,
    coreCompleted,
    coreTotal: core.length,
    fraction: core.length === 0 ? 0 : coreCompleted / core.length,
    coreHoursRemaining,
    suggested: inProgress ?? nextAvailable ?? null,
  }
}

export const importanceLabels: Record<NodeImportance, string> = {
  core: 'Core',
  useful: 'Useful',
  optional: 'Optional',
}

export const importanceExplanations: Record<NodeImportance, string> = {
  core: 'You will be expected to have this.',
  useful: 'It will come up, and it makes you better. Not a blocker.',
  optional: 'Genuinely optional. Skip it without guilt unless it interests you.',
}

export const nodeStateLabels: Record<NodeState, string> = {
  locked: 'Easier later',
  available: 'Ready',
  in_progress: 'In progress',
  completed: 'Done',
}

/**
 * Skills the user has underway, across every roadmap. Used by Today so quests
 * follow what someone is actually working on rather than a fixed order.
 */
export function currentSkillIds(skillProgress: SkillProgress[]): string[] {
  return skillProgress
    .filter((entry) => entry.state === 'in_progress')
    .sort((a, b) => (b.startedAt ?? '').localeCompare(a.startedAt ?? ''))
    .map((entry) => entry.skillId)
}
