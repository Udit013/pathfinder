import type { Resource } from '@/types'
import {
  phases,
  projectCheckId,
  readyCheckId,
  topicCheckId,
  type Level,
  type RoadmapPhase,
  type RoleId,
} from '@/data/engineeringRoadmap'
import { useAppStore } from '@/lib/store/useAppStore'

/** Kept out of parts.tsx so that file exports only components (Fast Refresh). */
export const roleLabels: Record<RoleId, string> = {
  swe: 'SWE / SDE',
  fullstack: 'Backend / Full-stack',
  fde: 'FDE',
  ai: 'AI Engineer',
}

export function useChecklist() {
  const checked = useAppStore((state) => state.engineeringChecklist)
  const toggle = useAppStore((state) => state.toggleEngineeringItem)
  return { checked: new Set(checked), toggle }
}

// ─── Steps: status, skipping, "where am I" ───────────────────────────────────

export const levels: { level: Level; blurb: string }[] = [
  { level: 'Beginner', blurb: 'Set up, then write real programs' },
  { level: 'Intermediate', blurb: 'How computers work, web apps, databases' },
  { level: 'Advanced', blurb: 'Scale, production and AI' },
  { level: 'Job-ready', blurb: 'Specialise, polish, interview' },
]

/**
 * Skipping is stored in the same checklist array as ticks, under its own
 * namespace, so it needs no schema change and travels with export/import.
 */
export const skipId = (phaseId: string) => `s:${phaseId}`

export type StepStatus = 'done' | 'skipped' | 'in-progress' | 'not-started'

export const statusLabels: Record<StepStatus, string> = {
  done: 'Done',
  skipped: 'Skipped',
  'in-progress': 'In progress',
  'not-started': 'Not started',
}

/**
 * A step is done when every exit criterion ("ready to move on when…") is
 * ticked — the same list doubles as the placement check, so testing out of a
 * step and finishing it are the same action.
 */
export function stepStatus(phase: RoadmapPhase, checked: Set<string>): StepStatus {
  if (checked.has(skipId(phase.id))) return 'skipped'
  const exit = phase.readyWhen.map((_, index) => readyCheckId(phase.id, index))
  if (exit.length > 0 && exit.every((id) => checked.has(id))) return 'done'
  const started =
    exit.some((id) => checked.has(id)) ||
    phase.topics.some((topic) => checked.has(topicCheckId(topic.id))) ||
    (phase.project ? checked.has(projectCheckId(phase.project.id)) : false)
  return started ? 'in-progress' : 'not-started'
}

/** The first step that isn't done or skipped — where "Continue" goes. */
export function currentStep(checked: Set<string>): RoadmapPhase {
  return (
    phases.find((phase) => {
      const status = stepStatus(phase, checked)
      return status !== 'done' && status !== 'skipped'
    }) ??
    phases[phases.length - 1]!
  )
}

/** Which step a topic lives in. */
export const stepOfTopic = new Map(
  phases.flatMap((phase) => phase.topics.map((topic) => [topic.id, phase] as const)),
)
export const topicById = new Map(phases.flatMap((phase) => phase.topics.map((topic) => [topic.id, topic] as const)))

// ─── Resources: what to open first ───────────────────────────────────────────

export type Bucket = 'start' | 'practice' | 'deeper' | 'reference'

export const bucketLabels: Record<Bucket, { label: string; hint: string }> = {
  start: { label: 'Start here', hint: 'Beginner-friendly — open one of these first' },
  practice: { label: 'Practise', hint: 'Exercises, projects and challenges' },
  deeper: { label: 'Go deeper', hint: 'Once the basics have landed' },
  reference: { label: 'Reference', hint: 'Look things up as you need them' },
}

/** Uses the role and kind each resource already carries in the library. */
export function bucketOf(resource: Resource): Bucket {
  if (resource.role === 'start') return 'start'
  if (
    resource.role === 'practice' ||
    resource.role === 'project' ||
    resource.role === 'interview' ||
    resource.role === 'credential' ||
    resource.kind === 'practice' ||
    resource.kind === 'interactive' ||
    resource.kind === 'job_simulation' ||
    resource.kind === 'mock_interview'
  ) {
    return 'practice'
  }
  if (resource.role === 'deeper' || resource.difficulty === 'advanced') return 'deeper'
  return 'reference'
}

export type Format = 'video' | 'course' | 'practice' | 'reading'

export const formatLabels: Record<Format, string> = {
  video: 'Videos & playlists',
  course: 'Courses',
  practice: 'Practice & projects',
  reading: 'Reading & docs',
}

export function formatOf(resource: Resource): Format {
  if (resource.kind.startsWith('youtube_')) return 'video'
  if (resource.kind === 'course') return 'course'
  if (
    resource.kind === 'practice' ||
    resource.kind === 'interactive' ||
    resource.kind === 'job_simulation' ||
    resource.kind === 'mock_interview' ||
    resource.kind === 'dataset' ||
    (resource.kind === 'github' && resource.role === 'project')
  ) {
    return 'practice'
  }
  return 'reading'
}

export function hasFreeCredential(resource: Resource): boolean {
  return (
    resource.credential === 'free_certificate' ||
    resource.credential === 'free_badge' ||
    resource.credential === 'free_completion_record'
  )
}
