import type { Resource } from '@/types'

/**
 * The resource library.
 *
 * ── How this is curated ─────────────────────────────────────────────────────
 *
 * The database is allowed to be large. What the user sees is not. Every entry
 * carries a `priority` and a `role`, and the UI uses those to show two to four
 * resources at a time — normally one to START, one to PRACTISE, and optionally
 * one to go DEEPER. Nobody should ever open PathFinder and face a course
 * catalogue.
 *
 * ── What `verified: true` means ─────────────────────────────────────────────
 *
 * The URL was fetched on `lastVerified` and resolved successfully. For sites
 * that block automated requests, it was opened in a real browser and the page
 * title read back. Anything that could not be confirmed either way is either
 * excluded or carries `verified: false`, and the UI will not call it free.
 *
 * ── Cost vs credential ──────────────────────────────────────────────────────
 *
 * These are separate fields on purpose. "The course is free" and "the
 * certificate is free" are different claims, and conflating them is the single
 * most common error in free-certificate lists. `credential` is only set to
 * `free_certificate` where the provider issues one at no cost.
 */

/** Date the current verification sweep was run. */
export const VERIFIED = '2026-08-08'

/** Defaults so each entry only states what's distinctive about it. */
export function res(input: Partial<Resource> & Pick<Resource, 'id' | 'title' | 'provider' | 'url' | 'kind'>): Resource {
  return {
    skillIds: [],
    careerPathIds: [],
    difficulty: 'beginner',
    estimatedMinutes: 60,
    cost: 'free',
    verified: true,
    lastVerified: VERIFIED,
    credential: 'no_certificate',
    priority: 'b',
    role: 'reference',
    interviewRelevance: 0,
    projectRelevance: 0,
    official: false,
    tags: [],
    ...input,
  }
}
