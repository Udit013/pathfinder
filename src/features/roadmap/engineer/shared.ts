import type { RoleId } from '@/data/engineeringRoadmap'
import { useAppStore } from '@/lib/store/useAppStore'

/** Kept out of parts.tsx so that file exports only components (Fast Refresh). */
export const roleLabels: Record<RoleId, string> = {
  swe: 'SWE / SDE',
  fullstack: 'Backend / Full-stack',
  fde: 'FDE',
  ai: 'AI Engineer',
}

export function useChecklist() {
  const checked = useAppStore((state) => state.engineeringChecklist)
  const toggle = useAppStore((state) => state.toggleEngineeringItem)
  return { checked: new Set(checked), toggle }
}
