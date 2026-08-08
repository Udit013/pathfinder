import { create } from 'zustand'
import type {
  CareerExperimentResponse,
  CheckIn,
  EnergyLevel,
  ExperimentRatings,
  NetworkingActivity,
  NetworkingKind,
  ProgressEvent,
  ProgressEventKind,
  QuestCompletion,
  UserPreferences,
  UserProfile,
  WorkloadMode,
} from '@/types'
import {
  createEmptyState,
  parseImport,
  storage,
  StorageUnavailableError,
  type PersistedState,
} from '@/lib/storage'
import { debounce, newId, todayIso } from '@/lib/utils'
import { xpTable } from '@/domain/xp'

type HydrationStatus = 'loading' | 'ready' | 'error'

/** Transient UI state — never persisted. */
interface EphemeralState {
  status: HydrationStatus
  /** Human error copy for the shell to render (§35). Progress is never lost. */
  storageError: string | null
  /** Set when a load succeeded but something was off, e.g. newer schema. */
  storageWarning: string | null
  /** Today's mode when the user has nudged it away from their energy level. */
  modeOverride: WorkloadMode | null
  /** Queue of "+25 XP" style toasts (§31). */
  celebrations: { id: string; label: string; xp: number }[]
}

interface Actions {
  hydrate(): Promise<void>

  completeOnboarding(input: {
    profile: Omit<UserProfile, 'createdAt' | 'onboardingCompletedAt'>
  }): void
  updateProfile(patch: Partial<UserProfile>): void
  updatePreferences(patch: Partial<UserPreferences>): void

  /** Records today's energy, replacing any earlier answer for the same day. */
  recordEnergy(energy: EnergyLevel, options?: { roughDay?: boolean }): void
  setModeOverride(mode: WorkloadMode | null): void

  /** Marks a quest done, awarding XP through the progress ledger. */
  completeQuest(input: {
    questId: string
    title: string
    xp: number
    lightened: boolean
    careerPathIds: string[]
    skillIds: string[]
  }): void

  // ── Career exploration (Phase 2) ───────────────────────────────────────────

  /** Adds or removes a path from what the user is exploring. Never destructive. */
  togglePathInterest(pathId: string): void
  /** Sets which path drives Today. Changing it is expected, not a failure (§3). */
  setPrimaryPath(pathId: string | null): void
  /** Sets a path aside without deleting the evidence gathered for it. */
  dismissPath(pathId: string): void
  restorePath(pathId: string): void

  /** Creates the response record when an experiment is opened. Idempotent. */
  startExperiment(input: { experimentId: string; careerPathIds: string[] }): void
  toggleExperimentStep(input: { experimentId: string; stepId: string }): void
  /** Reveals one more hint for a step. Hints are never all shown at once. */
  revealHint(input: { experimentId: string; stepId: string }): void
  /** Submits ratings, completing the experiment and updating signals (§12). */
  completeExperiment(input: {
    experimentId: string
    title: string
    careerPathIds: string[]
    ratings: ExperimentRatings
    reflection?: string
  }): void

  /** Logs a networking action against an optional networking quest. */
  logNetworking(input: {
    kind: NetworkingKind
    personOrGroup: string
    questId?: string
    label: string
    notes?: string
  }): void

  /** Appends to the progress ledger and queues a celebration. */
  recordEvent(input: {
    kind: ProgressEventKind
    label: string
    subjectId?: string
    careerPathIds?: string[]
    skillIds?: string[]
    xp?: number
  }): void
  dismissCelebration(id: string): void

  exportState(): PersistedState
  importState(raw: string): { ok: true; warning?: string } | { ok: false; error: string }
  resetState(): Promise<void>
  clearStorageMessages(): void
}

export type AppStore = PersistedState & EphemeralState & Actions

const ephemeralDefaults: EphemeralState = {
  status: 'loading',
  storageError: null,
  storageWarning: null,
  modeOverride: null,
  celebrations: [],
}

/**
 * Persistence is a debounced side effect rather than middleware so the write
 * always goes through the StorageAdapter seam (§26) and a failure can be
 * surfaced to the user instead of thrown into the void.
 */
function createPersister(getState: () => AppStore, onError: (message: string) => void) {
  return debounce(() => {
    const state = getState()
    if (state.status !== 'ready') return
    const snapshot = extractPersisted(state)
    void storage.save(snapshot).catch((error: unknown) => {
      onError(
        error instanceof StorageUnavailableError
          ? "PathFinder can't save right now — your browser is blocking storage or is out of space. Your work in this tab is still here."
          : "Something went wrong while saving. Your work in this tab is still here.",
      )
    })
  }, 400)
}

function extractPersisted(state: AppStore): PersistedState {
  return {
    schemaVersion: state.schemaVersion,
    updatedAt: new Date().toISOString(),
    profile: state.profile,
    preferences: state.preferences,
    experimentResponses: state.experimentResponses,
    skillProgress: state.skillProgress,
    questCompletions: state.questCompletions,
    projects: state.projects,
    applications: state.applications,
    networking: state.networking,
    interviewPrep: state.interviewPrep,
    checkIns: state.checkIns,
    reflections: state.reflections,
    events: state.events,
    dismissedPathIds: state.dismissedPathIds,
  }
}

export const useAppStore = create<AppStore>((set, get) => {
  const persist = createPersister(get, (message) => set({ storageError: message }))

  /** Every mutation goes through here so nothing can forget to save. */
  const mutate = (patch: Partial<PersistedState>) => {
    set(patch)
    persist()
  }

  return {
    ...createEmptyState(),
    ...ephemeralDefaults,

    async hydrate() {
      try {
        const loaded = await storage.load()
        if (loaded) {
          set({ ...loaded, status: 'ready' })
        } else {
          set({ ...createEmptyState(), status: 'ready' })
        }
      } catch (error) {
        set({
          ...createEmptyState(),
          status: 'ready',
          storageError:
            error instanceof StorageUnavailableError
              ? "Your browser is blocking local storage, so PathFinder can't remember anything between visits. Everything else still works."
              : 'Something went wrong loading your data. Nothing was deleted — try reloading.',
        })
      }
    },

    completeOnboarding({ profile }) {
      const now = new Date().toISOString()
      mutate({
        profile: { ...profile, createdAt: now, onboardingCompletedAt: now },
      })
      if (profile.primaryPathId) {
        get().recordEvent({
          kind: 'path_chosen',
          label: 'Chose a first direction to explore',
          subjectId: profile.primaryPathId,
          careerPathIds: [profile.primaryPathId],
        })
      }
    },

    updateProfile(patch) {
      const current = get().profile
      if (!current) return
      mutate({ profile: { ...current, ...patch } })
    },

    updatePreferences(patch) {
      mutate({ preferences: { ...get().preferences, ...patch } })
    },

    recordEnergy(energy, options) {
      const date = todayIso()
      const existing = get().checkIns.find((entry) => entry.date === date)
      const entry: CheckIn = {
        id: existing?.id ?? newId('checkin'),
        date,
        energy,
        roughDay: options?.roughDay ?? existing?.roughDay ?? false,
        accomplished: existing?.accomplished,
        feltGood: existing?.feltGood,
        feltHard: existing?.feltHard,
      }
      mutate({
        checkIns: [...get().checkIns.filter((item) => item.date !== date), entry],
      })
      // A fresh answer replaces any manual nudge for the day.
      set({ modeOverride: null })
    },

    setModeOverride(mode) {
      set({ modeOverride: mode })
    },

    completeQuest({ questId, title, xp, lightened, careerPathIds, skillIds }) {
      const already = get().questCompletions.some(
        (entry) => entry.questId === questId && entry.completedAt !== null,
      )
      if (already) return

      const completion: QuestCompletion = {
        id: newId('qc'),
        questId,
        assignedOn: todayIso(),
        completedAt: new Date().toISOString(),
        skipped: false,
        xpAwarded: xp,
        lightened,
      }
      mutate({ questCompletions: [...get().questCompletions, completion] })
      get().recordEvent({
        kind: 'quest_completed',
        label: title,
        subjectId: questId,
        careerPathIds,
        skillIds,
        xp,
      })
    },

    // ── Career exploration ───────────────────────────────────────────────────

    togglePathInterest(pathId) {
      const profile = get().profile
      if (!profile) return
      const active = profile.activePathIds.includes(pathId)
      const activePathIds = active
        ? profile.activePathIds.filter((id) => id !== pathId)
        : [...profile.activePathIds, pathId]

      mutate({
        profile: {
          ...profile,
          activePathIds,
          // Dropping the primary path shouldn't leave Today pointing at nothing.
          primaryPathId: active && profile.primaryPathId === pathId ? null : profile.primaryPathId,
        },
        dismissedPathIds: get().dismissedPathIds.filter((id) => id !== pathId),
      })
    },

    setPrimaryPath(pathId) {
      const profile = get().profile
      if (!profile) return
      if (profile.primaryPathId === pathId) return

      const activePathIds =
        pathId && !profile.activePathIds.includes(pathId)
          ? [...profile.activePathIds, pathId]
          : profile.activePathIds

      mutate({ profile: { ...profile, primaryPathId: pathId, activePathIds } })

      if (pathId) {
        get().recordEvent({
          kind: 'path_chosen',
          label: 'Changed the direction Today follows',
          subjectId: pathId,
          careerPathIds: [pathId],
        })
      }
    },

    dismissPath(pathId) {
      const profile = get().profile
      mutate({
        dismissedPathIds: [...new Set([...get().dismissedPathIds, pathId])],
        profile: profile
          ? {
              ...profile,
              activePathIds: profile.activePathIds.filter((id) => id !== pathId),
              primaryPathId: profile.primaryPathId === pathId ? null : profile.primaryPathId,
            }
          : profile,
      })
    },

    restorePath(pathId) {
      mutate({ dismissedPathIds: get().dismissedPathIds.filter((id) => id !== pathId) })
    },

    startExperiment({ experimentId, careerPathIds }) {
      const existing = get().experimentResponses.find(
        (response) => response.experimentId === experimentId,
      )
      if (existing) return

      const response: CareerExperimentResponse = {
        id: newId('exp'),
        experimentId,
        careerPathIds,
        startedAt: new Date().toISOString(),
        completedAt: null,
        completedStepIds: [],
        revealedHints: {},
        ratings: null,
      }
      mutate({ experimentResponses: [...get().experimentResponses, response] })
    },

    toggleExperimentStep({ experimentId, stepId }) {
      mutate({
        experimentResponses: get().experimentResponses.map((response) => {
          if (response.experimentId !== experimentId) return response
          const done = response.completedStepIds.includes(stepId)
          return {
            ...response,
            completedStepIds: done
              ? response.completedStepIds.filter((id) => id !== stepId)
              : [...response.completedStepIds, stepId],
          }
        }),
      })
    },

    revealHint({ experimentId, stepId }) {
      mutate({
        experimentResponses: get().experimentResponses.map((response) =>
          response.experimentId === experimentId
            ? {
                ...response,
                revealedHints: {
                  ...response.revealedHints,
                  [stepId]: (response.revealedHints[stepId] ?? 0) + 1,
                },
              }
            : response,
        ),
      })
    },

    completeExperiment({ experimentId, title, careerPathIds, ratings, reflection }) {
      const responses = get().experimentResponses
      const existing = responses.find((response) => response.experimentId === experimentId)
      const alreadyComplete = Boolean(existing?.completedAt)
      const now = new Date().toISOString()

      const updated: CareerExperimentResponse = {
        id: existing?.id ?? newId('exp'),
        experimentId,
        careerPathIds,
        startedAt: existing?.startedAt ?? now,
        completedAt: now,
        completedStepIds: existing?.completedStepIds ?? [],
        revealedHints: existing?.revealedHints ?? {},
        ratings,
        reflection: reflection?.trim() || undefined,
      }

      mutate({
        experimentResponses: existing
          ? responses.map((response) => (response.id === existing.id ? updated : response))
          : [...responses, updated],
      })

      // Re-rating an experiment updates the signal but doesn't award XP twice.
      if (!alreadyComplete) {
        get().recordEvent({
          kind: 'experiment_completed',
          label: title,
          subjectId: experimentId,
          careerPathIds,
        })
      }
    },

    logNetworking({ kind, personOrGroup, questId, label, notes }) {
      const activity: NetworkingActivity = {
        id: newId('net'),
        kind,
        personOrGroup,
        occurredOn: todayIso(),
        questId,
        notes,
      }
      mutate({ networking: [...get().networking, activity] })
      get().recordEvent({
        kind: 'networking_activity',
        label,
        subjectId: questId ?? activity.id,
      })
    },

    recordEvent({ kind, label, subjectId, careerPathIds, skillIds, xp }) {
      const event: ProgressEvent = {
        id: newId('evt'),
        kind,
        occurredAt: new Date().toISOString(),
        xp: xp ?? xpTable[kind],
        label,
        careerPathIds: careerPathIds ?? [],
        skillIds: skillIds ?? [],
        subjectId,
      }
      mutate({ events: [...get().events, event] })
      if (!get().preferences.reducedCelebration) {
        set({
          celebrations: [
            ...get().celebrations,
            { id: event.id, label, xp: event.xp },
          ],
        })
      }
    },

    dismissCelebration(id) {
      set({ celebrations: get().celebrations.filter((item) => item.id !== id) })
    },

    exportState() {
      return extractPersisted(get())
    },

    importState(raw) {
      const result = parseImport(raw)
      if (!result.ok) return result
      set({ ...result.state, status: 'ready', storageWarning: result.warning ?? null })
      persist.flush()
      return { ok: true, warning: result.warning }
    },

    async resetState() {
      await storage.clear()
      set({ ...createEmptyState(), ...ephemeralDefaults, status: 'ready' })
    },

    clearStorageMessages() {
      set({ storageError: null, storageWarning: null })
    },
  }
})
