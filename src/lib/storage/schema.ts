import type {
  CareerExperimentResponse,
  CheckIn,
  InterviewPrepProgress,
  JobApplication,
  NetworkingActivity,
  ProgressEvent,
  ProjectInstance,
  QuestCompletion,
  Reflection,
  SkillProgress,
  UserPreferences,
  UserProfile,
} from '@/types'

/**
 * Bump when the shape of PersistedState changes, and add a migration in
 * `migrate.ts`. Never reuse a version number.
 */
export const SCHEMA_VERSION = 1

export const STORAGE_KEY = 'pathfinder:state:v1'

/**
 * Everything PathFinder keeps about the user. Content (career paths, skills,
 * resources…) is never stored here — only ids referring to it.
 */
export interface PersistedState {
  schemaVersion: number
  /** Last write. Used for the export filename and "last saved" copy. */
  updatedAt: string

  profile: UserProfile | null
  preferences: UserPreferences

  experimentResponses: CareerExperimentResponse[]
  skillProgress: SkillProgress[]
  questCompletions: QuestCompletion[]
  projects: ProjectInstance[]

  applications: JobApplication[]
  networking: NetworkingActivity[]
  interviewPrep: InterviewPrepProgress[]

  checkIns: CheckIn[]
  reflections: Reflection[]
  events: ProgressEvent[]

  /** Ids of experiments/paths the user explicitly set aside. Not a failure. */
  dismissedPathIds: string[]
}

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  showShowUpCount: true,
  reducedCelebration: false,
  preferredAiTool: 'claude',
}

export function createEmptyState(): PersistedState {
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    profile: null,
    preferences: { ...defaultPreferences },
    experimentResponses: [],
    skillProgress: [],
    questCompletions: [],
    projects: [],
    applications: [],
    networking: [],
    interviewPrep: [],
    checkIns: [],
    reflections: [],
    events: [],
    dismissedPathIds: [],
  }
}

/**
 * Structural check only — enough to reject a file that isn't PathFinder data,
 * without turning into a schema validation library.
 */
export function looksLikePersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.schemaVersion === 'number' &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.questCompletions) &&
    typeof candidate.preferences === 'object'
  )
}

/**
 * Fills in anything a hand-edited or older export is missing, so an import can
 * never leave the app with an undefined array to map over.
 */
export function reconcileState(input: PersistedState): PersistedState {
  const empty = createEmptyState()
  return {
    ...empty,
    ...input,
    preferences: { ...empty.preferences, ...input.preferences },
    schemaVersion: SCHEMA_VERSION,
  }
}
