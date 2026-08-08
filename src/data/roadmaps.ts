import type { Roadmap, RoadmapNode } from '@/types'

/**
 * Roadmaps (§13).
 *
 * Our own representation, not a copy of anyone else's. Two things shape it:
 *
 *  1. `tier` is the visual band — roughly "what you'd sensibly do around the
 *     same time". `dependsOn` is the real constraint, and only names skills
 *     that genuinely make this one easier. Over-specifying dependencies turns a
 *     map into a queue, and a queue is what makes people give up.
 *
 *  2. `importance` is honest. Most roadmaps imply everything is required, which
 *     is how a learning path becomes a source of guilt. CORE is the short list
 *     you actually need; USEFUL will come up; OPTIONAL is genuinely optional and
 *     is labelled that way in the UI.
 *
 * Paths without a roadmap yet render an honest empty state rather than a
 * generic one — a wrong map is worse than no map.
 */

/** Small helper so the node lists below stay readable. */
function node(
  skillId: string,
  tier: number,
  importance: RoadmapNode['importance'],
  dependsOn: string[] = [],
): RoadmapNode {
  return { id: skillId, skillId, importance, tier, dependsOn }
}

export const roadmaps: Roadmap[] = [
  // ── Data Analyst ───────────────────────────────────────────────────────────
  {
    id: 'rm-data-analyst',
    careerPathId: 'data-analyst',
    title: 'Data Analyst',
    intro:
      'The short version: get good at SQL, learn to tell whether a number means anything, and learn to present it. Everything else is supporting cast. You do not need all of this to apply — the core path is about four months of steady work.',
    nodes: [
      node('spreadsheets', 0, 'core'),
      node('business-acumen', 0, 'core'),

      node('sql-basics', 1, 'core'),
      node('descriptive-stats', 1, 'core'),

      node('sql-joins', 2, 'core', ['sql-basics']),
      node('data-viz', 2, 'core', ['descriptive-stats']),

      node('python-basics', 3, 'useful'),
      node('bi-tools', 3, 'core', ['sql-basics', 'data-viz']),
      node('metric-definition', 3, 'useful', ['sql-joins']),

      node('pandas', 4, 'useful', ['python-basics']),
      node('sql-advanced', 4, 'useful', ['sql-joins']),
      node('stakeholder-comms', 4, 'core'),

      node('inferential-stats', 5, 'useful', ['descriptive-stats']),
      node('funnel-analysis', 5, 'optional', ['sql-joins']),
      node('version-control', 5, 'useful'),

      node('writing-clearly', 6, 'core'),
      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── BI Analyst ─────────────────────────────────────────────────────────────
  {
    id: 'rm-bi-analyst',
    careerPathId: 'bi-analyst',
    title: 'BI Analyst',
    intro:
      'Weighted toward the tool and toward definitions. The technical bar is lower than data engineering; the bar for precision and for getting people to agree is higher.',
    nodes: [
      node('spreadsheets', 0, 'core'),
      node('business-acumen', 0, 'core'),

      node('sql-basics', 1, 'core'),
      node('data-viz', 1, 'core'),

      node('sql-joins', 2, 'core', ['sql-basics']),
      node('bi-tools', 2, 'core', ['sql-basics', 'data-viz']),

      node('data-modeling', 3, 'core', ['sql-joins']),
      node('metric-definition', 3, 'core', ['sql-joins']),

      node('sql-advanced', 4, 'useful', ['sql-joins']),
      node('stakeholder-comms', 4, 'core'),
      node('descriptive-stats', 4, 'useful'),

      node('version-control', 5, 'useful'),
      node('testing-data', 5, 'optional', ['sql-joins']),

      node('writing-clearly', 6, 'useful'),
      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── Product Analyst ────────────────────────────────────────────────────────
  {
    id: 'rm-product-analyst',
    careerPathId: 'product-analyst',
    title: 'Product Analyst',
    intro:
      'SQL plus the statistics to know when a result is real, plus the judgement to pick the right question. The statistics matter more here than in general analytics, because you will be asked to declare whether something worked.',
    nodes: [
      node('business-acumen', 0, 'core'),
      node('product-sense', 0, 'core'),

      node('sql-basics', 1, 'core'),
      node('descriptive-stats', 1, 'core'),

      node('sql-joins', 2, 'core', ['sql-basics']),
      node('data-viz', 2, 'useful'),

      node('funnel-analysis', 3, 'core', ['sql-joins']),
      node('inferential-stats', 3, 'core', ['descriptive-stats']),
      node('metric-definition', 3, 'core', ['sql-joins']),

      node('experimentation', 4, 'core', ['inferential-stats']),
      node('sql-advanced', 4, 'useful', ['sql-joins']),
      node('python-basics', 4, 'useful'),

      node('user-research', 5, 'optional'),
      node('pandas', 5, 'optional', ['python-basics']),
      node('stakeholder-comms', 5, 'core'),

      node('writing-clearly', 6, 'core'),
      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── Data Engineer ──────────────────────────────────────────────────────────
  {
    id: 'rm-data-engineer',
    careerPathId: 'data-engineer',
    title: 'Data Engineer',
    intro:
      'A software engineering path that happens to be about data. Longer than the analyst routes and less crowded at the other end. Python and SQL first — everything after assumes both.',
    nodes: [
      node('sql-basics', 0, 'core'),
      node('python-basics', 0, 'core'),
      node('linux-cli', 0, 'useful'),

      node('sql-joins', 1, 'core', ['sql-basics']),
      node('version-control', 1, 'core'),

      node('python-intermediate', 2, 'core', ['python-basics']),
      node('sql-advanced', 2, 'core', ['sql-joins']),
      node('pandas', 2, 'useful', ['python-basics']),

      node('data-modeling', 3, 'core', ['sql-joins']),
      node('etl-pipelines', 3, 'core', ['python-basics', 'sql-joins']),

      node('cloud-basics', 4, 'core', ['linux-cli']),
      node('orchestration', 4, 'core', ['etl-pipelines']),
      node('testing-data', 4, 'core', ['sql-joins']),

      node('docker', 5, 'useful', ['linux-cli']),
      node('dbt', 5, 'useful', ['sql-advanced', 'version-control']),
      node('apis', 5, 'useful', ['python-intermediate']),
      node('testing-code', 5, 'useful', ['python-intermediate']),

      node('ci-cd', 6, 'optional', ['version-control', 'testing-code']),
      node('observability', 6, 'optional', ['cloud-basics']),

      node('resume-writing', 7, 'core'),
      node('interview-practice', 7, 'core'),
    ],
  },

  // ── Analytics Engineer ─────────────────────────────────────────────────────
  {
    id: 'rm-analytics-engineer',
    careerPathId: 'analytics-engineer',
    title: 'Analytics Engineer',
    intro:
      'Software engineering practice applied to analytics. Most people arrive here from an analyst role rather than directly, so the SQL bar is assumed high from the start.',
    nodes: [
      node('sql-basics', 0, 'core'),
      node('business-acumen', 0, 'useful'),

      node('sql-joins', 1, 'core', ['sql-basics']),
      node('version-control', 1, 'core'),

      node('sql-advanced', 2, 'core', ['sql-joins']),
      node('data-modeling', 2, 'core', ['sql-joins']),

      node('dbt', 3, 'core', ['sql-advanced', 'version-control']),
      node('testing-data', 3, 'core', ['sql-joins']),
      node('metric-definition', 3, 'core', ['sql-joins']),

      node('python-basics', 4, 'useful'),
      node('writing-clearly', 4, 'core'),
      node('cloud-basics', 4, 'useful'),

      node('ci-cd', 5, 'optional', ['version-control', 'testing-data']),
      node('bi-tools', 5, 'useful', ['sql-basics']),

      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── Data Scientist ─────────────────────────────────────────────────────────
  {
    id: 'rm-data-scientist',
    careerPathId: 'data-scientist',
    title: 'Data Scientist',
    intro:
      'The longest path here, and the most competitive at entry level. Statistics is the part people skip and the part interviews punish. Be honest with yourself about whether you enjoy it before committing a year.',
    nodes: [
      node('python-basics', 0, 'core'),
      node('sql-basics', 0, 'core'),
      node('descriptive-stats', 0, 'core'),

      node('pandas', 1, 'core', ['python-basics']),
      node('sql-joins', 1, 'core', ['sql-basics']),
      node('data-viz', 1, 'core'),

      node('inferential-stats', 2, 'core', ['descriptive-stats']),
      node('python-intermediate', 2, 'useful', ['python-basics']),

      node('ml-foundations', 3, 'core', ['pandas', 'inferential-stats']),
      node('experimentation', 3, 'core', ['inferential-stats']),

      node('model-evaluation', 4, 'core', ['ml-foundations']),
      node('version-control', 4, 'core'),
      node('stakeholder-comms', 4, 'core'),

      node('mlops', 5, 'optional', ['model-evaluation']),
      node('data-structures', 5, 'optional', ['python-intermediate']),
      node('writing-clearly', 5, 'core'),

      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── Business Analyst ───────────────────────────────────────────────────────
  {
    id: 'rm-business-analyst',
    careerPathId: 'business-analyst',
    title: 'Business Analyst',
    intro:
      'The least technical path here and the most dependent on communication. The technical skills are a means of being credible; the communication skills are the job.',
    nodes: [
      node('business-acumen', 0, 'core'),
      node('spreadsheets', 0, 'core'),

      node('process-mapping', 1, 'core'),
      node('stakeholder-comms', 1, 'core'),

      node('requirements-gathering', 2, 'core', ['stakeholder-comms']),
      node('sql-basics', 2, 'useful'),

      node('structured-problem-solving', 3, 'core'),
      node('writing-clearly', 3, 'core'),
      node('data-viz', 3, 'useful'),

      node('sql-joins', 4, 'optional', ['sql-basics']),
      node('presenting', 4, 'useful', ['writing-clearly']),
      node('project-management', 4, 'useful', ['stakeholder-comms']),

      node('descriptive-stats', 5, 'optional'),
      node('bi-tools', 5, 'optional', ['sql-basics', 'data-viz']),

      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },

  // ── Software Engineer ──────────────────────────────────────────────────────
  {
    id: 'rm-software-engineer',
    careerPathId: 'software-engineer',
    title: 'Software Engineer',
    intro:
      'Build things, break them, fix them. The fundamentals matter more than the framework, and two finished projects will do more for you than six tutorials.',
    nodes: [
      node('programming-fundamentals', 0, 'core'),
      node('linux-cli', 0, 'useful'),

      node('version-control', 1, 'core'),
      node('debugging', 1, 'core', ['programming-fundamentals']),
      node('sql-basics', 1, 'core'),

      node('html-css', 2, 'useful'),
      node('sql-joins', 2, 'core', ['sql-basics']),

      node('apis', 3, 'core', ['programming-fundamentals']),
      node('testing-code', 3, 'core', ['programming-fundamentals']),
      node('javascript', 3, 'useful', ['html-css']),
      node('databases', 3, 'core', ['sql-joins']),

      node('data-structures', 4, 'core', ['programming-fundamentals']),
      node('react', 4, 'useful', ['javascript']),

      node('system-design-intro', 5, 'useful', ['apis', 'databases']),
      node('docker', 5, 'useful', ['linux-cli']),
      node('ci-cd', 5, 'optional', ['version-control', 'testing-code']),
      node('accessibility', 5, 'optional', ['html-css']),

      node('resume-writing', 6, 'core'),
      node('interview-practice', 6, 'core'),
    ],
  },
]

const roadmapByPath = new Map(roadmaps.map((roadmap) => [roadmap.careerPathId, roadmap]))

export function roadmapForPath(pathId: string): Roadmap | undefined {
  return roadmapByPath.get(pathId)
}

export function roadmapById(id: string): Roadmap | undefined {
  return roadmaps.find((roadmap) => roadmap.id === id)
}

export function hasRoadmap(pathId: string): boolean {
  return roadmapByPath.has(pathId)
}
