import { SCHEMA_VERSION, reconcileState, type PersistedState } from './schema'

type Migration = (state: PersistedState) => PersistedState

/**
 * Keyed by the version being migrated FROM. To add one: bump SCHEMA_VERSION,
 * then add an entry here for the previous version.
 *
 * Example:
 *   2: (state) => ({ ...state, someNewField: [] }),
 */
const migrations: Record<number, Migration> = {
  /**
   * v1 → v2: job-application tracking was removed from the product.
   *
   * Drops `applications` and `networking`, and rewrites the progress events
   * they produced so XP and history stay intact — the ledger is append-only and
   * a feature being removed must never take someone's earned progress with it.
   */
  1: (state) => {
    const legacy = state as unknown as Record<string, unknown>
    delete legacy.applications
    delete legacy.networking

    return {
      ...state,
      schemaVersion: 2,
      events: state.events.map((event) => {
        const kind = event.kind as string
        if (kind === 'networking_activity' || kind === 'application_submitted') {
          return { ...event, kind: 'concept_understood' as const, label: event.label }
        }
        if (kind === 'application_advanced' || kind === 'interview_completed') {
          return { ...event, kind: 'interview_practised' as const, label: event.label }
        }
        return event
      }),
    }
  },
}

export interface MigrationResult {
  state: PersistedState
  migrated: boolean
  /** Set when the data is newer than this build understands. */
  warning?: string
}

export function migrate(input: PersistedState): MigrationResult {
  let state = input
  let migrated = false

  if (state.schemaVersion > SCHEMA_VERSION) {
    // Fail soft: keep the data, tell the user, don't destructively downgrade.
    return {
      state: reconcileState(state),
      migrated: false,
      warning:
        'This data was saved by a newer version of PathFinder. Some of it may not be shown correctly.',
    }
  }

  while (state.schemaVersion < SCHEMA_VERSION) {
    const step = migrations[state.schemaVersion]
    if (!step) {
      // No path forward — reconcile to the current shape rather than crash.
      return { state: reconcileState(state), migrated: true }
    }
    state = step(state)
    migrated = true
  }

  return { state: reconcileState(state), migrated }
}
