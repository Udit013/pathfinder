import { useSearchParams } from 'react-router'

/**
 * Everything about where you are in the roadmap lives in the URL — tab, step,
 * part of the step, and open topic — so any view can be bookmarked or shared,
 * and the browser's back button walks back through it.
 */

export const tabs = [
  { id: 'start', label: 'Start here' },
  { id: 'path', label: 'Learning path' },
  { id: 'topics', label: 'All topics' },
  { id: 'projects', label: 'Projects' },
  { id: 'roles', label: 'Roles' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'resources', label: 'Resources' },
  { id: 'progress', label: 'Progress' },
] as const

export type TabId = (typeof tabs)[number]['id']

/** Earlier names for tabs, so links from before the reorganisation still land. */
const aliases: Record<string, TabId> = { overview: 'start', map: 'topics', phases: 'path' }

export const parts = [
  { id: 'learn', label: 'Learn' },
  { id: 'build', label: 'Build' },
  { id: 'check', label: 'Check yourself' },
  { id: 'ai', label: 'Use AI' },
] as const

export type PartId = (typeof parts)[number]['id']

export interface Destination {
  tab: TabId
  step?: string
  part?: PartId
  topic?: string
}

export function useRoadmapNav() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab') ?? 'start'
  const tab: TabId = tabs.some((t) => t.id === raw) ? (raw as TabId) : (aliases[raw] ?? 'start')
  const rawPart = params.get('part')
  const part: PartId = parts.some((p) => p.id === rawPart) ? (rawPart as PartId) : 'learn'

  const go = (to: Destination, options: { scroll?: boolean } = {}) => {
    const next: Record<string, string> = {}
    if (to.tab !== 'start') next.tab = to.tab
    if (to.step) next.step = to.step
    if (to.part && to.part !== 'learn') next.part = to.part
    if (to.topic) next.topic = to.topic
    setParams(next)
    if (options.scroll !== false) window.scrollTo({ top: 0 })
  }

  return { tab, step: params.get('step'), part, topic: params.get('topic'), go }
}
