import { LocalStorageAdapter } from './localStorageAdapter'
import type { StorageAdapter } from './adapter'
import { SCHEMA_VERSION, looksLikePersistedState, reconcileState, type PersistedState } from './schema'
import { migrate } from './migrate'

export type { StorageAdapter } from './adapter'
export { StorageUnavailableError } from './adapter'
export type { PersistedState } from './schema'
export { SCHEMA_VERSION, STORAGE_KEY, createEmptyState, defaultPreferences } from './schema'

/**
 * The app talks to this, not to a concrete adapter. Replace the single
 * assignment below to move PathFinder onto IndexedDB or a server.
 */
export const storage: StorageAdapter = new LocalStorageAdapter()

// ─── Export / import (§26 — the user owns their data) ────────────────────────

export function serializeForExport(state: PersistedState): string {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
}

export function exportFilename(now: Date = new Date()): string {
  const date = now.toISOString().slice(0, 10)
  return `pathfinder-backup-${date}.json`
}

export type ImportResult =
  | { ok: true; state: PersistedState; warning?: string }
  | { ok: false; error: string }

export function parseImport(raw: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: "That file isn't valid JSON. Try exporting it again." }
  }

  if (!looksLikePersistedState(parsed)) {
    return { ok: false, error: "That doesn't look like a PathFinder backup." }
  }

  const { state, warning } = migrate(parsed)
  return { ok: true, state: reconcileState({ ...state, schemaVersion: SCHEMA_VERSION }), warning }
}
