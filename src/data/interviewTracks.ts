import type { InterviewTrack, PrepStage } from '@/types'

/**
 * Interview preparation tracks (§19).
 *
 * The staged model is the whole point: UNDERSTAND → PRACTISE → SOLVE → EXPLAIN
 * → INTERVIEW. Memorised answers collapse under one follow-up question, so the
 * ladder deliberately ends at "say it out loud, unprepared" rather than at
 * "recall the answer".
 *
 * Tracks connect back to roadmap skills, so Data Analyst → SQL → SQL interview
 * practice is a path the product can actually draw.
 */

export interface TrackMeta {
  id: InterviewTrack
  title: string
  /** One line: what this track is for. */
  purpose: string
  /** Why it's worth the time, in the user's terms. */
  whyItMatters: string
  /** Roadmap skills this track exercises — the Learn → Practise link. */
  skillIds: string[]
  /** Career paths that interview on this. Drives what's shown first. */
  careerPathIds: string[]
  /** How it usually shows up in a real interview. */
  formatNote: string
  resourceIds: string[]
}

export const interviewTracks: TrackMeta[] = [
  {
    id: 'sql',
    title: 'SQL',
    purpose: 'Writing and explaining queries under time pressure.',
    whyItMatters:
      'The most commonly screened skill in data hiring, and the one most likely to be tested live. Being fluent rather than merely capable is the difference.',
    skillIds: ['sql-basics', 'sql-joins', 'sql-advanced'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'product-analyst', 'data-engineer', 'analytics-engineer'],
    formatNote:
      'Usually a shared editor with no autocomplete, 20–40 minutes, someone watching. Talking as you type is expected.',
    resourceIds: ['res-datalemur', 'res-hackerrank-sql', 'res-roadmap-sql-questions', 'res-stratascratch'],
  },
  {
    id: 'python',
    title: 'Python',
    purpose: 'Manipulating data and writing small programs on the spot.',
    whyItMatters:
      'Data roles test practical Python — reading a file, reshaping a frame — rather than algorithms. Engineering roles test both.',
    skillIds: ['python-basics', 'python-intermediate', 'pandas'],
    careerPathIds: ['data-scientist', 'data-engineer', 'software-engineer', 'ml-engineer'],
    formatNote: 'Often a take-home or a shared notebook. Reading your code aloud is part of it.',
    resourceIds: ['res-roadmap-python-questions', 'res-yt-corey-python'],
  },
  {
    id: 'statistics',
    title: 'Statistics',
    purpose: 'Reasoning about uncertainty without hiding behind formulas.',
    whyItMatters:
      'The section candidates most often fail. Interviewers are checking whether you understand what a result means, not whether you can recite a definition.',
    skillIds: ['descriptive-stats', 'inferential-stats'],
    careerPathIds: ['data-scientist', 'product-analyst', 'data-analyst', 'research-analyst'],
    formatNote: 'Conversational. Expect "explain it to a non-technical stakeholder" follow-ups.',
    resourceIds: ['res-yt-statquest-stats'],
  },
  {
    id: 'data_analysis',
    title: 'Data analysis',
    purpose: 'Taking a vague business question and producing a defensible answer.',
    whyItMatters:
      'Closest to the actual job. Interviewers want to see how you narrow an ambiguous question before you touch any data.',
    skillIds: ['business-acumen', 'metric-definition', 'data-viz', 'stakeholder-comms'],
    careerPathIds: ['data-analyst', 'bi-analyst', 'business-analyst', 'product-analyst'],
    formatNote: 'A case, sometimes with a dataset, sometimes purely spoken. 30–45 minutes.',
    resourceIds: ['res-mode-sql', 'res-ft-visual-vocabulary'],
  },
  {
    id: 'product_analytics',
    title: 'Product sense & metrics',
    purpose: 'Deciding what to measure and what a movement in it means.',
    whyItMatters:
      'Product analyst and PM interviews are largely this. It rewards judgement, and judgement is practisable.',
    skillIds: ['product-sense', 'funnel-analysis', 'experimentation', 'metric-definition'],
    careerPathIds: ['product-analyst', 'product-manager', 'data-analyst', 'marketing-analyst'],
    formatNote: 'Open-ended discussion. There is no correct answer, only a defended one.',
    resourceIds: ['res-yt-statquest-stats'],
  },
  {
    id: 'machine_learning',
    title: 'Machine learning',
    purpose: 'Choosing an approach and being honest about how you would judge it.',
    whyItMatters:
      'Interviewers probe for baselines, leakage, and evaluation. Naming a fancy model without those is the classic entry-level failure.',
    skillIds: ['ml-foundations', 'model-evaluation'],
    careerPathIds: ['data-scientist', 'ml-engineer', 'ai-engineer'],
    formatNote: 'A case: "how would you build X?" Expect follow-ups on what could go wrong.',
    resourceIds: ['res-yt-statquest-stats', 'res-kaggle-pandas'],
  },
  {
    id: 'data_engineering',
    title: 'Data engineering',
    purpose: 'Designing pipelines and schemas that survive bad input.',
    whyItMatters:
      'Design questions dominate. The instinct interviewers look for is asking what happens when it fails.',
    skillIds: ['data-modeling', 'etl-pipelines', 'testing-data', 'sql-advanced'],
    careerPathIds: ['data-engineer', 'analytics-engineer'],
    formatNote: 'Whiteboard-style system design plus harder SQL. 45–60 minutes.',
    resourceIds: ['res-mode-sql', 'res-roadmap-sql-questions'],
  },
  {
    id: 'general_technical',
    title: 'General technical',
    purpose: 'Coding and problem-solving under observation.',
    whyItMatters:
      'A separate skill from doing the job. Thinking out loud while stuck is what is actually being assessed.',
    skillIds: ['programming-fundamentals', 'data-structures', 'debugging'],
    careerPathIds: ['software-engineer', 'backend-engineer', 'frontend-engineer', 'ml-engineer'],
    formatNote: 'Live coding, 45 minutes, one or two problems. Silence is the thing to avoid.',
    resourceIds: ['res-yt-mock-interview', 'res-freecodecamp'],
  },
  {
    id: 'behavioral',
    title: 'Behavioural',
    purpose: 'Telling true stories about your own work, clearly.',
    whyItMatters:
      'Every interview includes this, everyone underprepares for it, and it is the easiest section to improve quickly. Worth doing first.',
    skillIds: ['writing-clearly', 'stakeholder-comms', 'interview-practice'],
    careerPathIds: [],
    formatNote: 'Every round, from the recruiter screen onward. 20–45 minutes.',
    resourceIds: ['res-fcc-behavioral', 'res-yt-star-method'],
  },
  {
    id: 'case_study',
    title: 'Case studies',
    purpose: 'Structuring an ambiguous business problem out loud.',
    whyItMatters:
      'Consulting and many business-analyst processes run on this. Structure counts for more than the answer.',
    skillIds: ['structured-problem-solving', 'business-acumen', 'presenting'],
    careerPathIds: ['tech-consultant', 'business-analyst', 'product-manager', 'operations-analyst'],
    formatNote: 'Interactive, 30–40 minutes. You are expected to ask clarifying questions first.',
    resourceIds: ['res-excel-learn'],
  },
]

const byId = new Map(interviewTracks.map((track) => [track.id, track]))

export function trackById(id: InterviewTrack): TrackMeta | undefined {
  return byId.get(id)
}

export function trackTitle(id: InterviewTrack): string {
  return byId.get(id)?.title ?? id
}

/** §19 — the ladder. Each stage names what you can do by the end of it. */
export const stages: {
  id: PrepStage
  label: string
  short: string
  meaning: string
}[] = [
  {
    id: 'understand',
    label: 'Understand',
    short: 'Read it',
    meaning: 'You know what the question is really asking and why it gets asked.',
  },
  {
    id: 'practice',
    label: 'Practise',
    short: 'Try it',
    meaning: 'You have worked through it once, with help if you needed it.',
  },
  {
    id: 'solve',
    label: 'Solve',
    short: 'Alone',
    meaning: 'You can do it without looking anything up.',
  },
  {
    id: 'explain',
    label: 'Explain',
    short: 'Aloud',
    meaning: 'You can talk through your reasoning so someone else follows it.',
  },
  {
    id: 'interview',
    label: 'Interview-ready',
    short: 'Ready',
    meaning: 'You could do it cold, while someone watches, and handle a follow-up.',
  },
]

export const stageOrder: PrepStage[] = stages.map((stage) => stage.id)

export function stageIndex(stage: PrepStage): number {
  return stageOrder.indexOf(stage)
}

export function stageMeta(stage: PrepStage) {
  return stages.find((entry) => entry.id === stage) ?? stages[0]!
}
