import { useMemo } from 'react'
import type {
  CareerExperimentResponse,
  CareerSignal,
  CheckIn,
  Roadmap,
  SkillProgress,
  WorkloadMode,
} from '@/types'
import { computeSignals, suggestedNextExperiment } from '@/domain/signals'
import { currentSkillIds, resolveRoadmap, type RoadmapProgress } from '@/domain/roadmap'
import { roadmapForPath } from '@/data/roadmaps'
import { todayIso } from '@/lib/utils'
import { milestoneProgress, showUpDaysThisWeek, totalXp } from '@/domain/xp'
import { modeForEnergy, minuteBudget, modeShapes } from '@/domain/energy'
import { useAppStore } from './useAppStore'

/**
 * Derived reads live here so no component computes progress itself. Everything
 * is recomputed from the ledger, which keeps Progress explainable (§12, §21).
 */

export function useProfile() {
  return useAppStore((state) => state.profile)
}

export function useHasOnboarded(): boolean {
  return useAppStore((state) => Boolean(state.profile?.onboardingCompletedAt))
}

export function useTodayCheckIn(): CheckIn | null {
  const checkIns = useAppStore((state) => state.checkIns)
  const date = todayIso()
  return useMemo(() => checkIns.find((entry) => entry.date === date) ?? null, [checkIns, date])
}

export interface TodayMode {
  mode: WorkloadMode
  shape: (typeof modeShapes)[WorkloadMode]
  /** Minutes the plan may fill, already clamped to stated capacity. */
  budgetMinutes: number
  /** False until the user answers the energy check-in. */
  fromCheckIn: boolean
  overridden: boolean
}

export function useTodayMode(): TodayMode {
  const checkIn = useTodayCheckIn()
  const override = useAppStore((state) => state.modeOverride)
  const weekdayMinutes = useAppStore((state) => state.profile?.weekdayMinutes ?? 60)

  const base: WorkloadMode = checkIn ? modeForEnergy(checkIn.energy) : 'normal'
  const mode = override ?? (checkIn?.roughDay ? 'light' : base)

  return {
    mode,
    shape: modeShapes[mode],
    budgetMinutes: minuteBudget(mode, weekdayMinutes),
    fromCheckIn: Boolean(checkIn),
    overridden: override !== null,
  }
}

export function useXp() {
  const events = useAppStore((state) => state.events)
  return useMemo(() => {
    const xp = totalXp(events)
    return { ...milestoneProgress(xp), eventCount: events.length }
  }, [events])
}

export function useShowUpDays(): number {
  const events = useAppStore((state) => state.events)
  return useMemo(() => showUpDaysThisWeek(events), [events])
}

/** Whether the user has generated any activity at all — drives empty states. */
export function useHasActivity(): boolean {
  return useAppStore((state) => state.events.length > 0)
}

// ─── Career exploration ──────────────────────────────────────────────────────

/**
 * Career Signals, recomputed from evidence on every read. Never stored, so a
 * signal can't survive the activity that produced it being changed.
 */
export function useSignals(): CareerSignal[] {
  const experimentResponses = useAppStore((state) => state.experimentResponses)
  const skillProgress = useAppStore((state) => state.skillProgress)
  const projects = useAppStore((state) => state.projects)
  const events = useAppStore((state) => state.events)

  return useMemo(
    () => computeSignals({ experimentResponses, skillProgress, projects, events }),
    [experimentResponses, skillProgress, projects, events],
  )
}

export function useSignalFor(pathId: string): CareerSignal | null {
  const signals = useSignals()
  return useMemo(
    () => signals.find((signal) => signal.careerPathId === pathId) ?? null,
    [signals, pathId],
  )
}

export function useExperimentResponse(experimentId: string): CareerExperimentResponse | null {
  const responses = useAppStore((state) => state.experimentResponses)
  return useMemo(
    () => responses.find((response) => response.experimentId === experimentId) ?? null,
    [responses, experimentId],
  )
}

export interface ExperimentTally {
  completedIds: string[]
  startedIds: string[]
  completedCount: number
}

export function useExperimentTally(): ExperimentTally {
  const responses = useAppStore((state) => state.experimentResponses)
  return useMemo(() => {
    const completedIds = responses
      .filter((response) => response.completedAt !== null)
      .map((response) => response.experimentId)
    const startedIds = responses
      .filter((response) => response.completedAt === null)
      .map((response) => response.experimentId)
    return { completedIds, startedIds, completedCount: completedIds.length }
  }, [responses])
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

/**
 * The roadmap the user is following, resolved against their skill progress.
 * Null when they haven't chosen a direction or the path has no roadmap yet.
 */
export function useActiveRoadmap(): { roadmap: Roadmap; progress: RoadmapProgress } | null {
  const primaryPathId = useAppStore((state) => state.profile?.primaryPathId)
  const skillProgress = useAppStore((state) => state.skillProgress)

  return useMemo(() => {
    if (!primaryPathId) return null
    const roadmap = roadmapForPath(primaryPathId)
    if (!roadmap) return null
    return { roadmap, progress: resolveRoadmap(roadmap, skillProgress) }
  }, [primaryPathId, skillProgress])
}

export function useSkillProgress(skillId: string): SkillProgress | null {
  const entries = useAppStore((state) => state.skillProgress)
  return useMemo(
    () => entries.find((entry) => entry.skillId === skillId) ?? null,
    [entries, skillId],
  )
}

/** Skills currently underway, newest first. Drives Today's quest selection. */
export function useCurrentSkillIds(): string[] {
  const skillProgress = useAppStore((state) => state.skillProgress)
  return useMemo(() => currentSkillIds(skillProgress), [skillProgress])
}

/** The single most useful next experiment, with the reason it was chosen. */
export function useSuggestedExperiment() {
  const signals = useSignals()
  const { completedIds } = useExperimentTally()
  const activePathIds = useAppStore((state) => state.profile?.activePathIds)

  return useMemo(
    () => suggestedNextExperiment(signals, activePathIds ?? [], completedIds),
    [signals, activePathIds, completedIds],
  )
}
