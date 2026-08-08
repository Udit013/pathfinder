import type { Resource } from '@/types'

/**
 * Learning resources (§14).
 *
 * PathFinder is the curated navigation layer, not a course platform. We store a
 * pointer plus our own description and never reproduce anyone's content.
 *
 * ── What `verified: true` means here ────────────────────────────────────────
 * Every entry marked verified had its URL checked on the date in
 * `lastVerified`: the URL resolved (HTTP 200 after redirects) and, for YouTube,
 * the video or playlist title and owning channel were read from the page's own
 * metadata — so the id points at the resource this entry claims. Durations
 * marked as measured came from the page; anything else is an approximation and
 * is shown with a "~".
 *
 * `verified: false` means not yet checked. The UI must not assert such an entry
 * is free (§14). Re-verify with `npm run verify:resources` (see scripts/).
 *
 * Anything with a cost that could change (accounts, ads, free tiers) carries an
 * `accessNote` that is shown to the user before they click.
 */

const CHECKED = '2026-08-07'

export const resources: Resource[] = [
  // ── SQL ────────────────────────────────────────────────────────────────────
  {
    id: 'res-sqlbolt',
    title: 'SQLBolt — learn SQL with simple, interactive exercises',
    provider: 'SQLBolt',
    url: 'https://sqlbolt.com/',
    kind: 'interactive',
    skillIds: ['sql-basics', 'sql-joins'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst', 'business-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 180,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Runs entirely in the browser — nothing to install, so you can start in under a minute.',
  },
  {
    id: 'res-mode-sql',
    title: 'SQL Tutorial — from basics through analytics',
    provider: 'Mode',
    url: 'https://mode.com/sql-tutorial/',
    kind: 'course',
    skillIds: ['sql-basics', 'sql-joins', 'sql-advanced'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 420,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Built around business questions rather than syntax, which is much closer to the actual job.',
  },
  {
    id: 'res-kaggle-intro-sql',
    title: 'Intro to SQL',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/intro-to-sql',
    kind: 'interactive',
    skillIds: ['sql-basics', 'sql-joins'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 180,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free Kaggle account required; exercises run in hosted notebooks.',
  },
  {
    id: 'res-yt-fcc-sql',
    title: 'SQL Tutorial — Full Database Course for Beginners',
    provider: 'freeCodeCamp.org (YouTube)',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    kind: 'youtube_video',
    skillIds: ['sql-basics', 'sql-joins', 'databases'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'backend-engineer', 'data-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 261,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'One long sitting, so treat it as a reference to dip into rather than something to finish in a day.',
  },
  {
    id: 'res-yt-ata-sql-basics',
    title: 'SQL Basics for Data Analysts',
    provider: 'Alex The Analyst (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PLUaB-1hjhk8GT6N5ne2qpf603sF26m2PW',
    kind: 'youtube_playlist',
    skillIds: ['sql-basics', 'sql-joins'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'business-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 90,
    durationNote: '4-part series',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Short and aimed squarely at the analyst job rather than at databases in general.',
  },
  {
    id: 'res-roadmap-sql',
    title: 'SQL Roadmap',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/sql',
    kind: 'roadmap',
    skillIds: ['sql-basics', 'sql-joins', 'sql-advanced'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'data-engineer', 'backend-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 20,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Use it for scope and vocabulary — a map of the territory, not a checklist to finish.',
  },

  // ── Python & pandas ────────────────────────────────────────────────────────
  {
    id: 'res-kaggle-pandas',
    title: 'Pandas',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/pandas',
    kind: 'interactive',
    skillIds: ['pandas', 'python-basics'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 240,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free Kaggle account required; exercises run in hosted notebooks.',
  },
  {
    id: 'res-yt-corey-pandas',
    title: 'Pandas Tutorials',
    provider: 'Corey Schafer (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS',
    kind: 'youtube_playlist',
    skillIds: ['pandas'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 300,
    durationNote: 'multi-part series — length approximate',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Unusually clear explanations of why pandas behaves the way it does, not just which method to call.',
  },
  {
    id: 'res-yt-corey-python',
    title: 'Python Tutorials',
    provider: 'Corey Schafer (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    kind: 'youtube_playlist',
    skillIds: ['python-basics', 'python-intermediate'],
    careerPathIds: ['data-scientist', 'data-engineer', 'software-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 420,
    durationNote: 'multi-part series — length approximate',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
  },
  {
    id: 'res-python-docs',
    title: 'The Python Tutorial',
    provider: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/',
    kind: 'docs',
    skillIds: ['python-basics'],
    careerPathIds: ['data-scientist', 'data-engineer', 'software-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 300,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Dry but authoritative. Worth returning to once the basics have clicked.',
  },
  {
    id: 'res-pandas-10min',
    title: '10 minutes to pandas',
    provider: 'pandas (official docs)',
    url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
    kind: 'docs',
    skillIds: ['pandas'],
    careerPathIds: ['data-analyst', 'data-scientist'],
    difficulty: 'beginner',
    estimatedMinutes: 30,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'The fastest honest overview. Optimistically named — budget half an hour.',
  },
  {
    id: 'res-roadmap-python',
    title: 'Python Roadmap',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/python',
    kind: 'roadmap',
    skillIds: ['python-basics', 'python-intermediate'],
    careerPathIds: ['software-engineer', 'data-engineer', 'data-scientist'],
    difficulty: 'beginner',
    estimatedMinutes: 20,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
  },

  // ── Statistics ─────────────────────────────────────────────────────────────
  {
    id: 'res-yt-statquest-stats',
    title: 'Statistics Fundamentals',
    provider: 'StatQuest with Josh Starmer (YouTube)',
    url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9',
    kind: 'youtube_playlist',
    skillIds: ['descriptive-stats', 'inferential-stats'],
    careerPathIds: ['data-scientist', 'data-analyst', 'product-analyst', 'research-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 420,
    durationNote: '62 videos — watch the ones you need',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Short videos, one concept each. The standard recommendation for a reason.',
  },

  // ── Spreadsheets ───────────────────────────────────────────────────────────
  {
    id: 'res-excel-learn',
    title: 'Excel help & learning',
    provider: 'Microsoft',
    url: 'https://support.microsoft.com/excel',
    kind: 'docs',
    skillIds: ['spreadsheets'],
    careerPathIds: ['data-analyst', 'business-analyst', 'financial-analyst', 'operations-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 120,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Reference rather than a course — go looking for one function at a time.',
  },

  // ── BI tools ───────────────────────────────────────────────────────────────
  {
    id: 'res-mslearn-powerbi',
    title: 'Create and use analytics reports with Power BI',
    provider: 'Microsoft Learn',
    url: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/',
    kind: 'course',
    skillIds: ['bi-tools', 'data-viz'],
    careerPathIds: ['bi-analyst', 'data-analyst', 'business-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 480,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free to read. A Microsoft account is only needed to save progress.',
  },

  // ── Data visualisation ─────────────────────────────────────────────────────
  {
    id: 'res-ft-visual-vocabulary',
    title: 'Visual Vocabulary — which chart answers which question',
    provider: 'Financial Times Visual Journalism',
    url: 'https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary',
    kind: 'article',
    skillIds: ['data-viz'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst', 'marketing-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 45,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'One sheet mapping the question you are asking to the chart that answers it.',
  },
  {
    id: 'res-kaggle-dataviz',
    title: 'Data Visualization',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/data-visualization',
    kind: 'interactive',
    skillIds: ['data-viz'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 240,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free Kaggle account required; exercises run in hosted notebooks.',
  },

  // ── Version control ────────────────────────────────────────────────────────
  {
    id: 'res-git-docs',
    title: 'About Git — getting started',
    provider: 'GitHub Docs',
    url: 'https://docs.github.com/en/get-started/using-git/about-git',
    kind: 'docs',
    skillIds: ['version-control'],
    careerPathIds: ['software-engineer', 'data-engineer', 'analytics-engineer', 'data-scientist'],
    difficulty: 'beginner',
    estimatedMinutes: 60,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
  },
  {
    id: 'res-yt-fcc-git',
    title: 'Git and GitHub for Beginners — Crash Course',
    provider: 'freeCodeCamp.org (YouTube)',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    kind: 'youtube_video',
    skillIds: ['version-control'],
    careerPathIds: ['software-engineer', 'data-engineer', 'data-scientist', 'analytics-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 69,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Enough to be dangerous in about an hour, which is the right amount to start with.',
  },
  {
    id: 'res-yt-fcc-git-full',
    title: 'Learn Git — Full Course for Beginners',
    provider: 'freeCodeCamp.org (YouTube)',
    url: 'https://www.youtube.com/watch?v=zTjRZNkhiEU',
    kind: 'youtube_video',
    skillIds: ['version-control'],
    careerPathIds: ['software-engineer', 'data-engineer', 'backend-engineer'],
    difficulty: 'intermediate',
    estimatedMinutes: 224,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'For when the crash course stops being enough — branching, rebasing, and undoing mistakes.',
  },

  // ── General / cross-cutting ────────────────────────────────────────────────
  {
    id: 'res-roadmap-data-analyst',
    title: 'Data Analyst Roadmap',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/data-analyst',
    kind: 'roadmap',
    skillIds: ['sql-basics', 'spreadsheets', 'data-viz', 'descriptive-stats'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'business-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 20,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Worth one read to see the whole shape of the role. Do not treat its size as a to-do list.',
  },
  // ── Interview preparation ──────────────────────────────────────────────────
  {
    id: 'res-datalemur',
    title: 'SQL & data science interview questions',
    provider: 'DataLemur',
    url: 'https://datalemur.com/questions',
    kind: 'practice',
    skillIds: ['sql-basics', 'sql-joins', 'sql-advanced', 'interview-practice'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst', 'bi-analyst'],
    difficulty: 'intermediate',
    estimatedMinutes: 240,
    durationNote: 'question bank — work through a few at a time',
    cost: 'free_tier',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'A large set is free; some questions sit behind a paid tier.',
    note: 'Questions are drawn from real company interviews, which makes the difficulty calibration realistic.',
  },
  {
    id: 'res-stratascratch',
    title: 'Data interview practice problems',
    provider: 'StrataScratch',
    url: 'https://www.stratascratch.com/',
    kind: 'practice',
    skillIds: ['sql-joins', 'sql-advanced', 'pandas', 'interview-practice'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'intermediate',
    estimatedMinutes: 240,
    durationNote: 'question bank',
    cost: 'free_tier',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free account gives access to a subset; the full bank is paid.',
  },
  {
    id: 'res-hackerrank-sql',
    title: 'SQL practice track',
    provider: 'HackerRank',
    url: 'https://www.hackerrank.com/domains/sql',
    kind: 'practice',
    skillIds: ['sql-basics', 'sql-joins', 'sql-advanced', 'interview-practice'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'data-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 300,
    durationNote: 'graded exercise track',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free account required.',
    note: 'Good for building speed on syntax. Less good at teaching you which question to ask.',
  },
  {
    id: 'res-roadmap-sql-questions',
    title: 'SQL interview questions',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/questions/sql',
    kind: 'practice',
    skillIds: ['sql-basics', 'sql-joins', 'interview-practice'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'data-engineer', 'backend-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 60,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Flashcard-style. Good for checking whether you can explain a concept, not just use it.',
  },
  {
    id: 'res-roadmap-python-questions',
    title: 'Python interview questions',
    provider: 'roadmap.sh',
    url: 'https://roadmap.sh/questions/python',
    kind: 'practice',
    skillIds: ['python-basics', 'python-intermediate', 'interview-practice'],
    careerPathIds: ['data-scientist', 'data-engineer', 'software-engineer'],
    difficulty: 'beginner',
    estimatedMinutes: 60,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
  },
  {
    id: 'res-fcc-behavioral',
    title: 'Mastering behavioural interviews for developers',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/news/mastering-behavioral-interviews-for-software-developers/',
    kind: 'article',
    skillIds: ['interview-practice', 'stakeholder-comms'],
    careerPathIds: [],
    difficulty: 'beginner',
    estimatedMinutes: 30,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    note: 'Covers the STAR structure without turning it into a script to memorise.',
  },
  {
    id: 'res-yt-star-method',
    title: 'STAR method: how to answer behavioural questions',
    provider: 'Jay Feng (YouTube)',
    url: 'https://www.youtube.com/watch?v=dRqN4BuhCHU',
    kind: 'youtube_video',
    skillIds: ['interview-practice'],
    careerPathIds: ['data-analyst', 'data-scientist', 'product-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 13,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Short, with worked examples. Watch once before writing your own stories.',
  },
  {
    id: 'res-yt-mock-interview',
    title: 'Software engineering job interview — full mock interview',
    provider: 'freeCodeCamp.org (YouTube)',
    url: 'https://www.youtube.com/watch?v=1qw5ITr3k9E',
    kind: 'youtube_video',
    skillIds: ['interview-practice', 'data-structures'],
    careerPathIds: ['software-engineer', 'backend-engineer', 'frontend-engineer'],
    difficulty: 'intermediate',
    estimatedMinutes: 74,
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
    accessNote: 'Free on YouTube; may show ads.',
    note: 'Watching someone think out loud under pressure is worth more than reading about it.',
  },

  {
    id: 'res-freecodecamp',
    title: 'freeCodeCamp curriculum',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn',
    kind: 'course',
    skillIds: ['html-css', 'javascript', 'python-basics', 'data-viz'],
    careerPathIds: ['frontend-engineer', 'software-engineer', 'data-analyst'],
    difficulty: 'beginner',
    estimatedMinutes: 1200,
    durationNote: 'full curriculum — take one certification at a time',
    cost: 'free',
    verified: true,
    lastVerified: CHECKED,
  },
]

export function resourceById(id: string): Resource | undefined {
  return resources.find((resource) => resource.id === id)
}

export function resourcesByIds(ids: string[]): Resource[] {
  return ids.map(resourceById).filter((resource): resource is Resource => Boolean(resource))
}

/**
 * Resources for a skill, ordered so the fastest way in comes first: something
 * interactive, then a video, then reference material.
 */
const kindPriority: Record<string, number> = {
  interactive: 0,
  youtube_playlist: 1,
  youtube_video: 2,
  course: 3,
  article: 4,
  docs: 5,
  roadmap: 6,
}

export function resourcesForSkill(skillId: string, limit = 4): Resource[] {
  return resources
    .filter((resource) => resource.skillIds.includes(skillId))
    .sort((a, b) => (kindPriority[a.kind] ?? 9) - (kindPriority[b.kind] ?? 9))
    .slice(0, limit)
}

/** Union of resources for several skills, de-duplicated, best-first. */
export function resourcesForSkills(skillIds: string[], limit = 4): Resource[] {
  const seen = new Set<string>()
  const collected: Resource[] = []
  for (const skillId of skillIds) {
    for (const resource of resourcesForSkill(skillId, limit)) {
      if (seen.has(resource.id)) continue
      seen.add(resource.id)
      collected.push(resource)
    }
  }
  return collected
    .sort((a, b) => (kindPriority[a.kind] ?? 9) - (kindPriority[b.kind] ?? 9))
    .slice(0, limit)
}
