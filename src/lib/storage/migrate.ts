import { SCHEMA_VERSION, reconcileState, type PersistedState } from './schema'

type Migration = (state: PersistedState) => PersistedState

/**
 * Keyed by the version being migrated FROM. To add one: bump SCHEMA_VERSION,
 * then add an entry here for the previous version.
 *
 * Example:
 *   2: (state) => ({ ...state, someNewField: [] }),
 */
const migrations: Record<number, Migration> = {}

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
