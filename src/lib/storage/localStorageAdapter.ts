import { StorageUnavailableError, type StorageAdapter } from './adapter'
import { migrate } from './migrate'
import { STORAGE_KEY, looksLikePersistedState, type PersistedState } from './schema'

function isStorageAvailable(): boolean {
  try {
    const probe = '__pathfinder_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/**
 * localStorage-backed adapter. Single key, JSON envelope, versioned.
 *
 * Reads are forgiving on purpose: corrupt or foreign data resolves to `null`
 * so the app starts fresh rather than white-screening. The caller decides
 * whether to surface that.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name = 'localStorage'
  private readonly key: string

  constructor(key: string = STORAGE_KEY) {
    this.key = key
  }

  async load(): Promise<PersistedState | null> {
    if (!isStorageAvailable()) throw new StorageUnavailableError()

    const raw = window.localStorage.getItem(this.key)
    if (!raw) return null

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return null
    }

    if (!looksLikePersistedState(parsed)) return null
    return migrate(parsed).state
  }

  async save(state: PersistedState): Promise<void> {
    if (!isStorageAvailable()) throw new StorageUnavailableError()
    try {
      window.localStorage.setItem(this.key, JSON.stringify(state))
    } catch (cause) {
      // Almost always a quota error. Surfaced so the UI can say something true.
      throw new StorageUnavailableError(cause)
    }
  }

  async clear(): Promise<void> {
    if (!isStorageAvailable()) return
    window.localStorage.removeItem(this.key)
  }
}
