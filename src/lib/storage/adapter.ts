import type { PersistedState } from './schema'

/**
 * The single seam between PathFinder's UI and where data lives.
 *
 * Phase 1 ships a localStorage implementation. Swapping in IndexedDB or a
 * Supabase-backed adapter later must not require touching any component — the
 * interface is async for exactly that reason, even though localStorage is not.
 */
export interface StorageAdapter {
  readonly name: string
  load(): Promise<PersistedState | null>
  save(state: PersistedState): Promise<void>
  clear(): Promise<void>
}

/**
 * Thrown when saved data exists but can't be read. Distinct from "no data" on
 * purpose: the UI has to tell the user, because the alternative is someone
 * opening the app to a blank slate with no idea why.
 */
export class CorruptDataError extends Error {
  /** Where the unreadable copy was moved to, so it isn't simply gone. */
  readonly backupKey: string

  constructor(backupKey: string) {
    super('Saved data could not be read.')
    this.name = 'CorruptDataError'
    this.backupKey = backupKey
  }
}

export class StorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Storage is unavailable in this browser.')
    this.name = 'StorageUnavailableError'
    this.cause = cause
  }
}
