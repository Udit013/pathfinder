import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * Catches render errors so one broken page can't blank the whole app.
 *
 * It has a second job, specific to deploying a code-split SPA: when a new
 * version ships, a tab that's been open since before the deploy still points
 * at the old route chunks, which no longer exist. Opening a lazy route then
 * fails to load its module. A reload fetches the new index.html and its
 * matching chunks, so for that one failure we reload automatically — once,
 * guarded by a timestamp so a genuinely missing chunk can't cause a loop.
 */

const RELOAD_KEY = 'pathfinder:chunk-reload-at'
const RELOAD_WINDOW_MS = 10_000

function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to fetch/i.test(
    message,
  )
}

function reloadedRecently(): boolean {
  try {
    const at = Number(sessionStorage.getItem(RELOAD_KEY))
    return Number.isFinite(at) && Date.now() - at < RELOAD_WINDOW_MS
  } catch {
    // Storage blocked: don't risk a reload loop.
    return true
  }
}

interface State {
  error: unknown
}

export class ErrorBoundary extends Component<{ children: ReactNode; fullPage?: boolean }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (isStaleChunkError(error) && !reloadedRecently()) {
      try {
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
      } catch {
        return
      }
      window.location.reload()
      return
    }
    // No telemetry by design — nothing leaves the device. The console is for
    // anyone debugging locally.
    console.error('PathFinder hit an error rendering this page.', error, info.componentStack)
  }

  render() {
    if (this.state.error === null) return this.props.children

    const stale = isStaleChunkError(this.state.error)
    return (
      <div
        role="alert"
        className={
          this.props.fullPage
            ? 'flex min-h-dvh items-center justify-center bg-canvas p-6'
            : 'mx-auto w-full max-w-xl pt-10'
        }
      >
        <div className="rounded-card border border-line bg-surface p-6 text-center">
          <p className="font-display text-xl text-ink">
            {stale ? 'PathFinder was updated while this tab was open.' : 'Something went wrong on this page.'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {stale
              ? 'Reloading picks up the new version. Your progress is saved in this browser and won’t be affected.'
              : 'Your progress is saved in this browser and is safe. Reloading usually fixes it; if it keeps happening, the rest of the app still works.'}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Reload
            </button>
            {/* A plain link, not a router Link: this may render outside the router. */}
            <a
              href="/"
              className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-ink-soft hover:text-ink"
            >
              Go to Today
            </a>
          </div>
        </div>
      </div>
    )
  }
}
