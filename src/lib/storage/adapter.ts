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

export class StorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('Storage is unavailable in this browser.')
    this.name = 'StorageUnavailableError'
    this.cause = cause
  }
}
