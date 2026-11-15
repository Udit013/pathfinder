import { phases } from './phases'
import { interviewTypes, jobReadiness, specializations, tracks } from './extras'
import type { Mastery, RoadmapProject, RoadmapTopic } from './types'

export * from './types'
export * from './extras'
export { phases }

/** Every topic, in phase order. */
export const allTopics: RoadmapTopic[] = phases.flatMap((phase) => phase.topics)

/** Every project: the phase projects, then the role capstones. */
export const allProjects: RoadmapProject[] = [
  ...phases.flatMap((phase) => (phase.project ? [phase.project] : [])),
  ...specializations.map((spec) => spec.capstone),
]

export const masteryLabels: Record<Mastery, { label: string; hint: string }> = {
  must: { label: 'Must master', hint: 'Deep understanding — explain it, build it, debug it' },
  working: { label: 'Working knowledge', hint: 'Use it competently and explain the trade-offs' },
  awareness: { label: 'Awareness only', hint: 'Know what it is and when it would come up' },
  optional: { label: 'Optional / specialisation', hint: 'Only if your target role asks for it' },
}

// ─── Checklist ids ───────────────────────────────────────────────────────────
//
// The Progress tab persists ticked ids. They are namespaced so a topic and a
// readiness item can never collide, and derived from stable content ids so
// reordering the page never moves someone's ticks onto the wrong item.

export const topicCheckId = (topicId: string) => `t:${topicId}`
export const projectCheckId = (projectId: string) => `p:${projectId}`
export const readyCheckId = (phaseId: string, index: number) => `r:${phaseId}:${index}`
export const jobCheckId = (itemId: string) => `j:${itemId}`

export function allChecklistIds(): string[] {
  return [
    ...allTopics.map((topic) => topicCheckId(topic.id)),
    ...allProjects.map((project) => projectCheckId(project.id)),
    ...phases.flatMap((phase) => phase.readyWhen.map((_, index) => readyCheckId(phase.id, index))),
    ...jobReadiness.flatMap((group) => group.items.map((item) => jobCheckId(item.id))),
  ]
}

/** Every resource id the roadmap cites. Checked against the library in dev. */
export function referencedResourceIds(): string[] {
  return [
    ...allTopics.flatMap((topic) => topic.resourceIds),
    ...allProjects.flatMap((project) => project.resourceIds),
    ...tracks.flatMap((track) => track.resourceIds),
    ...specializations.flatMap((spec) => spec.resourceIds),
    ...interviewTypes.flatMap((type) => type.resourceIds),
  ]
}
