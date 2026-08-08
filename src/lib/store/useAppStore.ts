import { create } from 'zustand'
import type {
  CareerExperimentResponse,
  CheckIn,
  EnergyLevel,
  ExperimentRatings,
  InterviewPrepProgress,
  PrepStage,
  ProgressEvent,
  ProgressEventKind,
  ProjectInstance,
  QuestCompletion,
  Rating1to5,
  SkillProgress,
  SkillState,
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

  // ── Roadmap (Phase 3) ──────────────────────────────────────────────────────

  /** Moves a skill between states. Un-completing is allowed and costs nothing. */
  setSkillState(input: {
    skillId: string
    name: string
    state: SkillState
    careerPathIds?: string[]
  }): void
  /** Marks a resource read/watched, so returning to a skill shows where you got to. */
  toggleSkillResource(input: { skillId: string; resourceId: string }): void
  setSkillNote(input: { skillId: string; note: string }): void

  // ── Build (Phase 4) ────────────────────────────────────────────────────────

  /** Starts a project from a template. Returns the instance id. */
  startProject(input: {
    templateId: string
    title: string
    milestoneIds: string[]
    careerPathIds: string[]
    skillIds: string[]
  }): string
  /** Toggles a milestone. Completing the last one completes the project. */
  toggleMilestone(input: {
    projectId: string
    milestoneId: string
    milestoneTitle: string
    projectTitle: string
    totalMilestones: number
    careerPathIds: string[]
    skillIds: string[]
  }): void
  updateProject(input: { projectId: string; patch: Partial<ProjectInstance> }): void
  /** Abandoning is allowed and costs nothing already earned. */
  removeProject(projectId: string): void

  // ── Interview Prep (Phase 5) ───────────────────────────────────────────────

  /** Moves a question up the ladder. Never moves it down without being asked. */
  setQuestionStage(input: {
    questionId: string
    stage: PrepStage
    trackId: string
    trackTitle: string
    prompt: string
    skillIds: string[]
  }): void
  setQuestionConfidence(input: { questionId: string; confidence: Rating1to5 | null }): void
  setQuestionNote(input: { questionId: string; note: string }): void

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

    // ── Roadmap ──────────────────────────────────────────────────────────────

    setSkillState({ skillId, name, state, careerPathIds }) {
      const entries = get().skillProgress
      const existing = entries.find((entry) => entry.skillId === skillId)
      if (existing?.state === state) return

      const now = new Date().toISOString()
      const updated: SkillProgress = {
        skillId,
        state,
        startedAt: existing?.startedAt ?? (state === 'not_started' ? null : now),
        completedAt: state === 'completed' ? now : null,
        note: existing?.note,
        completedResourceIds: existing?.completedResourceIds ?? [],
      }

      mutate({
        skillProgress: existing
          ? entries.map((entry) => (entry.skillId === skillId ? updated : entry))
          : [...entries, updated],
      })

      // XP is awarded once per transition into a state, and never taken back —
      // going back to "in progress" to revise something must not feel like a
      // penalty (§21).
      const alreadyAwarded = (kind: 'skill_started' | 'skill_completed') =>
        get().events.some((event) => event.kind === kind && event.subjectId === skillId)

      if (state === 'in_progress' && !alreadyAwarded('skill_started')) {
        get().recordEvent({
          kind: 'skill_started',
          label: `Started learning ${name}`,
          subjectId: skillId,
          skillIds: [skillId],
          careerPathIds: careerPathIds ?? [],
        })
      }
      if (state === 'completed' && !alreadyAwarded('skill_completed')) {
        get().recordEvent({
          kind: 'skill_completed',
          label: name,
          subjectId: skillId,
          skillIds: [skillId],
          careerPathIds: careerPathIds ?? [],
        })
      }
    },

    toggleSkillResource({ skillId, resourceId }) {
      const entries = get().skillProgress
      const existing = entries.find((entry) => entry.skillId === skillId)

      const base: SkillProgress = existing ?? {
        skillId,
        state: 'in_progress',
        startedAt: new Date().toISOString(),
        completedAt: null,
        completedResourceIds: [],
      }

      const done = base.completedResourceIds.includes(resourceId)
      const updated: SkillProgress = {
        ...base,
        completedResourceIds: done
          ? base.completedResourceIds.filter((id) => id !== resourceId)
          : [...base.completedResourceIds, resourceId],
      }

      mutate({
        skillProgress: existing
          ? entries.map((entry) => (entry.skillId === skillId ? updated : entry))
          : [...entries, updated],
      })
    },

    setSkillNote({ skillId, note }) {
      const entries = get().skillProgress
      const existing = entries.find((entry) => entry.skillId === skillId)
      const updated: SkillProgress = {
        ...(existing ?? {
          skillId,
          state: 'in_progress',
          startedAt: new Date().toISOString(),
          completedAt: null,
          completedResourceIds: [],
        }),
        note: note.trim() || undefined,
      }
      mutate({
        skillProgress: existing
          ? entries.map((entry) => (entry.skillId === skillId ? updated : entry))
          : [...entries, updated],
      })
    },

    // ── Build ────────────────────────────────────────────────────────────────

    startProject({ templateId, title, milestoneIds, careerPathIds, skillIds }) {
      const existing = get().projects.find(
        (project) => project.templateId === templateId && !project.completedAt,
      )
      if (existing) return existing.id

      const instance: ProjectInstance = {
        id: newId('proj'),
        templateId,
        startedAt: new Date().toISOString(),
        completedAt: null,
        milestones: milestoneIds.map((milestoneId) => ({
          milestoneId,
          state: 'todo' as const,
          completedAt: null,
        })),
      }

      mutate({ projects: [...get().projects, instance] })
      get().recordEvent({
        kind: 'project_started',
        label: `Started building ${title}`,
        subjectId: instance.id,
        careerPathIds,
        skillIds,
      })
      return instance.id
    },

    toggleMilestone({
      projectId,
      milestoneId,
      milestoneTitle,
      projectTitle,
      totalMilestones,
      careerPathIds,
      skillIds,
    }) {
      const project = get().projects.find((entry) => entry.id === projectId)
      if (!project) return

      const current = project.milestones.find((entry) => entry.milestoneId === milestoneId)
      const wasDone = current?.state === 'done'
      const now = new Date().toISOString()

      const milestones = project.milestones.map((entry) =>
        entry.milestoneId === milestoneId
          ? {
              ...entry,
              state: wasDone ? ('todo' as const) : ('done' as const),
              completedAt: wasDone ? null : now,
            }
          : entry,
      )

      const doneCount = milestones.filter((entry) => entry.state === 'done').length
      const nowComplete = doneCount === totalMilestones && totalMilestones > 0

      mutate({
        projects: get().projects.map((entry) =>
          entry.id === projectId
            ? {
                ...entry,
                milestones,
                // Un-ticking the last milestone reopens the project rather than
                // leaving it falsely finished.
                completedAt: nowComplete ? (entry.completedAt ?? now) : null,
              }
            : entry,
        ),
      })

      // XP only on the way forward, and only once per milestone.
      if (!wasDone) {
        const alreadyAwarded = get().events.some(
          (event) => event.kind === 'project_milestone' && event.subjectId === milestoneId,
        )
        if (!alreadyAwarded) {
          get().recordEvent({
            kind: 'project_milestone',
            label: milestoneTitle,
            subjectId: milestoneId,
            careerPathIds,
            skillIds,
          })
        }

        if (nowComplete) {
          const alreadyCompleted = get().events.some(
            (event) => event.kind === 'project_completed' && event.subjectId === projectId,
          )
          if (!alreadyCompleted) {
            get().recordEvent({
              kind: 'project_completed',
              label: projectTitle,
              subjectId: projectId,
              careerPathIds,
              skillIds,
            })
          }
        }
      }
    },

    updateProject({ projectId, patch }) {
      mutate({
        projects: get().projects.map((project) =>
          project.id === projectId ? { ...project, ...patch } : project,
        ),
      })
    },

    removeProject(projectId) {
      // The progress ledger is append-only, so XP and wins already earned stay.
      mutate({ projects: get().projects.filter((project) => project.id !== projectId) })
    },

    // ── Interview Prep ───────────────────────────────────────────────────────

    setQuestionStage({ questionId, stage, trackId, trackTitle, prompt, skillIds }) {
      const entries = get().interviewPrep
      const existing = entries.find((entry) => entry.questionId === questionId)
      if (existing?.stage === stage) return

      const updated: InterviewPrepProgress = {
        questionId,
        stage,
        confidence: existing?.confidence ?? null,
        lastPractisedAt: new Date().toISOString(),
        note: existing?.note,
      }

      mutate({
        interviewPrep: existing
          ? entries.map((entry) => (entry.questionId === questionId ? updated : entry))
          : [...entries, updated],
      })

      // XP once per question reaching the top of the ladder, and once per
      // question ever being practised. Revisiting is free.
      const awarded = (kind: 'interview_practised' | 'interview_topic_completed', id: string) =>
        get().events.some((event) => event.kind === kind && event.subjectId === id)

      if (!awarded('interview_practised', questionId)) {
        get().recordEvent({
          kind: 'interview_practised',
          label: prompt.length > 60 ? `${prompt.slice(0, 57)}…` : prompt,
          subjectId: questionId,
          skillIds,
        })
      }

      if (stage === 'interview' && !awarded('interview_topic_completed', trackId)) {
        // Only celebrate the track once most of it is genuinely interview-ready.
        const trackQuestionIds = get()
          .interviewPrep.filter((entry) => entry.stage === 'interview')
          .map((entry) => entry.questionId)
        if (trackQuestionIds.length >= 3) {
          get().recordEvent({
            kind: 'interview_topic_completed',
            label: `${trackTitle} — interview-ready`,
            subjectId: trackId,
            skillIds,
          })
        }
      }
    },

    setQuestionConfidence({ questionId, confidence }) {
      const entries = get().interviewPrep
      const existing = entries.find((entry) => entry.questionId === questionId)
      const updated: InterviewPrepProgress = {
        questionId,
        stage: existing?.stage ?? 'understand',
        confidence,
        lastPractisedAt: new Date().toISOString(),
        note: existing?.note,
      }
      mutate({
        interviewPrep: existing
          ? entries.map((entry) => (entry.questionId === questionId ? updated : entry))
          : [...entries, updated],
      })
    },

    setQuestionNote({ questionId, note }) {
      const entries = get().interviewPrep
      const existing = entries.find((entry) => entry.questionId === questionId)
      const updated: InterviewPrepProgress = {
        questionId,
        stage: existing?.stage ?? 'understand',
        confidence: existing?.confidence ?? null,
        lastPractisedAt: new Date().toISOString(),
        note: note.trim() || undefined,
      }
      mutate({
        interviewPrep: existing
          ? entries.map((entry) => (entry.questionId === questionId ? updated : entry))
          : [...entries, updated],
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
