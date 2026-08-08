import type { Resource, ResourceKind } from '@/types'
import { resources } from '@/data/resources'

/**
 * The browsable library.
 *
 * Everywhere else in PathFinder, resources arrive two or three at a time,
 * chosen for where you already are (see `pickForSkill`). That is the right
 * default and it stays the default. This module powers the one place that
 * deliberately breaks it: a page for when you want to look at everything on
 * purpose, rather than being handed the next step.
 *
 * The distinction matters. "Here is the next thing" and "here is the shelf" are
 * different needs, and the failure mode of career apps is answering the first
 * with the second.
 *
 * Topics are derived from `skillIds` rather than stored on each entry, so a
 * resource can never drift out of sync with the skills it teaches. The first
 * skill listed wins — entries are authored with the primary skill first.
 */

export type TopicId =
  | 'roadmaps'
  | 'foundations'
  | 'programming'
  | 'dsa'
  | 'web'
  | 'system-design'
  | 'sql'
  | 'analytics'
  | 'statistics'
  | 'ml'
  | 'ai'
  | 'cloud'
  | 'security'
  | 'business'
  | 'interview'
  | 'datasets'

export interface Topic {
  id: TopicId
  label: string
  /** Shown under the heading — what this group is for, in one line. */
  blurb: string
}

/** Display order. Roughly the order someone would actually need them. */
export const topics: Topic[] = [
  {
    id: 'roadmaps',
    label: 'Start here — roadmaps',
    blurb: 'Maps of what exists, so you can stop guessing what to learn next.',
  },
  {
    id: 'foundations',
    label: 'Computer science foundations',
    blurb: 'The groundwork the rest of it assumes you already have.',
  },
  {
    id: 'programming',
    label: 'Programming and tooling',
    blurb: 'Python, Git, testing, debugging — the daily mechanics of the job.',
  },
  {
    id: 'dsa',
    label: 'Data structures and algorithms',
    blurb: 'Pattern practice for coding interviews. Depth beats volume here.',
  },
  {
    id: 'web',
    label: 'Web and full-stack',
    blurb: 'Building things people can open in a browser.',
  },
  {
    id: 'system-design',
    label: 'System design',
    blurb: 'How large systems fit together, and how to talk about them.',
  },
  {
    id: 'sql',
    label: 'SQL and databases',
    blurb: 'The highest-leverage skill across engineering, data and analytics.',
  },
  {
    id: 'analytics',
    label: 'Analytics and BI',
    blurb: 'Spreadsheets, dashboards, metrics, and making a number mean something.',
  },
  {
    id: 'statistics',
    label: 'Statistics and maths',
    blurb: 'What the models are doing underneath, and when not to trust them.',
  },
  {
    id: 'ml',
    label: 'Machine learning',
    blurb: 'From first models to putting one in front of real users.',
  },
  {
    id: 'ai',
    label: 'AI and LLMs',
    blurb: 'Transformers, RAG, agents and evaluation — the fastest-moving section.',
  },
  {
    id: 'cloud',
    label: 'Cloud and DevOps',
    blurb: 'Where the code runs once it leaves your laptop.',
  },
  {
    id: 'security',
    label: 'Security',
    blurb: 'Defensive fundamentals, and legal places to practise.',
  },
  {
    id: 'business',
    label: 'Product, business and consulting',
    blurb: 'Cases, strategy, stakeholders — the non-technical half of technical work.',
  },
  {
    id: 'interview',
    label: 'Interviews, resume and job search',
    blurb: 'Preparing for the conversation, not just the problem.',
  },
  {
    id: 'datasets',
    label: 'Datasets and practice data',
    blurb: 'Real data to build portfolio projects on.',
  },
]

export const topicById = new Map(topics.map((topic) => [topic.id, topic]))

/**
 * Every skill belongs to exactly one topic. `validateContent` checks that this
 * covers the whole skill list, so adding a skill without placing it here fails
 * loudly in development instead of quietly emptying a section.
 */
const topicOfSkill: Record<string, TopicId> = {
  // Foundations
  'programming-fundamentals': 'foundations',
  'networking-basics': 'foundations',
  'linux-cli': 'foundations',

  // Programming and tooling
  'python-basics': 'programming',
  'python-intermediate': 'programming',
  scripting: 'programming',
  'version-control': 'programming',
  'testing-code': 'programming',
  debugging: 'programming',

  // DSA
  'data-structures': 'dsa',

  // Web
  'html-css': 'web',
  javascript: 'web',
  react: 'web',
  accessibility: 'web',
  apis: 'web',

  // System design
  'system-design-intro': 'system-design',

  // SQL and databases
  'sql-basics': 'sql',
  'sql-joins': 'sql',
  'sql-advanced': 'sql',
  databases: 'sql',
  'data-modeling': 'sql',
  dbt: 'sql',
  'etl-pipelines': 'sql',
  orchestration: 'sql',
  'testing-data': 'sql',

  // Analytics and BI
  spreadsheets: 'analytics',
  'data-viz': 'analytics',
  'bi-tools': 'analytics',
  'metric-definition': 'analytics',
  'funnel-analysis': 'analytics',
  experimentation: 'analytics',
  pandas: 'analytics',

  // Statistics
  'descriptive-stats': 'statistics',
  'inferential-stats': 'statistics',

  // ML
  'ml-foundations': 'ml',
  'model-evaluation': 'ml',
  mlops: 'ml',

  // AI and LLMs
  'prompt-engineering': 'ai',
  'rag-systems': 'ai',
  'eval-design': 'ai',

  // Cloud and DevOps
  'cloud-basics': 'cloud',
  docker: 'cloud',
  'ci-cd': 'cloud',
  'infrastructure-as-code': 'cloud',
  observability: 'cloud',

  // Security
  'security-fundamentals': 'security',
  'threat-detection': 'security',

  // Product, business and consulting
  'product-sense': 'business',
  'user-research': 'business',
  prioritization: 'business',
  'requirements-gathering': 'business',
  'process-mapping': 'business',
  'project-management': 'business',
  'business-acumen': 'business',
  'financial-modeling': 'business',
  'risk-communication': 'business',
  'structured-problem-solving': 'business',
  'stakeholder-comms': 'business',
  'writing-clearly': 'business',
  presenting: 'business',

  // Interviews and job search
  'interview-practice': 'interview',
  'resume-writing': 'interview',
}

export function topicForSkill(skillId: string): TopicId | null {
  return topicOfSkill[skillId] ?? null
}

/** Kinds that decide a topic regardless of which skills they touch. */
const topicOfKind: Partial<Record<ResourceKind, TopicId>> = {
  roadmap: 'roadmaps',
  dataset: 'datasets',
  mock_interview: 'interview',
  job_simulation: 'interview',
}

export function topicForResource(resource: Resource): TopicId {
  const byKind = topicOfKind[resource.kind]
  if (byKind) return byKind

  for (const skillId of resource.skillIds) {
    const topic = topicOfSkill[skillId]
    if (topic) return topic
  }

  // Career-level entries with no skills attached — compensation data, the
  // roadmap.sh index. They are orientation, so they sit with the maps.
  return 'roadmaps'
}

// ─── Filtering ───────────────────────────────────────────────────────────────

export interface LibraryFilters {
  search: string
  careerPathId: string | null
  kind: ResourceKind | null
  /** Only entries that produce a certificate or badge at no cost. */
  freeCertificateOnly: boolean
  /** Only entries that directly help in an interview. */
  interviewOnly: boolean
}

export const emptyFilters: LibraryFilters = {
  search: '',
  careerPathId: null,
  kind: null,
  freeCertificateOnly: false,
  interviewOnly: false,
}

export function hasActiveFilters(filters: LibraryFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.careerPathId !== null ||
    filters.kind !== null ||
    filters.freeCertificateOnly ||
    filters.interviewOnly
  )
}

/** Credentials that are genuinely free. `free_course_paid_certificate` is not. */
const freeCredentials = new Set(['free_certificate', 'free_badge', 'free_completion_record'])

export function isFreeCredential(resource: Resource): boolean {
  return freeCredentials.has(resource.credential)
}

function matchesSearch(resource: Resource, query: string): boolean {
  const haystack = [
    resource.title,
    resource.provider,
    resource.note ?? '',
    ...resource.tags,
    ...resource.skillIds,
  ]
    .join(' ')
    .toLowerCase()

  // Every word must appear somewhere, so "free sql" narrows rather than widens.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

export function filterResources(filters: LibraryFilters): Resource[] {
  const query = filters.search.trim()

  return resources.filter((resource) => {
    if (query && !matchesSearch(resource, query)) return false
    if (filters.careerPathId && !resource.careerPathIds.includes(filters.careerPathId)) return false
    if (filters.kind && resource.kind !== filters.kind) return false
    if (filters.freeCertificateOnly && !isFreeCredential(resource)) return false
    if (filters.interviewOnly && resource.interviewRelevance < 2) return false
    return true
  })
}

// ─── Grouping ────────────────────────────────────────────────────────────────

const priorityWeight: Record<Resource['priority'], number> = { s: 0, a: 1, b: 2, optional: 3 }

export interface TopicGroup {
  topic: Topic
  resources: Resource[]
}

/** Groups into display order, dropping topics with nothing in them. */
export function groupByTopic(list: Resource[]): TopicGroup[] {
  const buckets = new Map<TopicId, Resource[]>()
  for (const resource of list) {
    const id = topicForResource(resource)
    const bucket = buckets.get(id)
    if (bucket) bucket.push(resource)
    else buckets.set(id, [resource])
  }

  return topics
    .map((topic) => ({
      topic,
      resources: (buckets.get(topic.id) ?? []).sort(
        (a, b) =>
          priorityWeight[a.priority] - priorityWeight[b.priority] ||
          b.interviewRelevance - a.interviewRelevance ||
          a.title.localeCompare(b.title),
      ),
    }))
    .filter((group) => group.resources.length > 0)
}

export interface LibraryStats {
  total: number
  free: number
  freeCredential: number
  lastChecked: string | null
}

export function libraryStats(list: Resource[] = resources): LibraryStats {
  return {
    total: list.length,
    free: list.filter((resource) => resource.cost === 'free' && resource.verified).length,
    freeCredential: list.filter(isFreeCredential).length,
    lastChecked:
      list
        .map((resource) => resource.lastVerified)
        .filter((date): date is string => Boolean(date))
        .sort()
        .at(-1) ?? null,
  }
}
