import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'

/**
 * Applies the persisted theme preference to <html>, following the OS when set
 * to "system". Mounted once by the app root.
 */
export function useThemeEffect(): void {
  const theme = useAppStore((state) => state.preferences.theme)

  useEffect(() => {
    const root = document.documentElement
    const query = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && query.matches)
      root.classList.toggle('dark', dark)
      root.style.colorScheme = dark ? 'dark' : 'light'
    }

    apply()
    if (theme !== 'system') return
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [theme])
}
