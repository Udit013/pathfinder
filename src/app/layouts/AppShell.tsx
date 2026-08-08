import { Outlet, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { AppHeader } from './AppHeader'
import { Celebrations } from '@/ui/Celebrations'
import { ErrorNotice } from '@/ui/States'
import { useAppStore } from '@/lib/store/useAppStore'

export function AppShell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const storageError = useAppStore((state) => state.storageError)
  const storageWarning = useAppStore((state) => state.storageWarning)
  const clearStorageMessages = useAppStore((state) => state.clearStorageMessages)

  // Move focus to the top of the content on navigation, so keyboard and screen
  // reader users don't have to walk back through the nav each time.
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-dvh bg-canvas">
      <a
        href="#main"
        className="sr-only-focusable absolute top-3 left-3 z-50 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
      >
        Skip to content
      </a>

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 px-4 pt-5 pb-28 focus:outline-none lg:px-8 lg:pt-7 lg:pb-12"
        >
          <div className="mx-auto w-full max-w-3xl space-y-3">
            {storageError ? (
              <ErrorNotice message={storageError} onDismiss={clearStorageMessages} />
            ) : null}
            {storageWarning ? (
              <ErrorNotice tone="caution" message={storageWarning} onDismiss={clearStorageMessages} />
            ) : null}
          </div>
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <Celebrations />
    </div>
  )
}
