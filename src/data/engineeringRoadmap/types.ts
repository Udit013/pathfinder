/**
 * The Engineer's Roadmap — SWE/SDE, Backend/Full-stack, FDE and AI Engineer.
 *
 * Content only. Every link is a resource id from the shared library
 * (src/data/resources), so links are verified once, shown consistently, and
 * checked for referential integrity by validateContent().
 */

/** How deeply to learn something. Drives what the "master now" view shows. */
export type Mastery = 'must' | 'working' | 'awareness' | 'optional'

export type RoleId = 'swe' | 'fullstack' | 'fde' | 'ai'

/** The four stages the phases are grouped into, from first code to job-ready. */
export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Job-ready'

export type Domain =
  | 'Foundations'
  | 'CS fundamentals'
  | 'Frontend'
  | 'Backend & APIs'
  | 'Databases'
  | 'System design'
  | 'Messaging & async'
  | 'Cloud & DevOps'
  | 'Security & quality'
  | 'AI & ML'
  | 'AI-assisted engineering'
  | 'Interviews & career'

export interface RoadmapTopic {
  id: string
  name: string
  domain: Domain
  mastery: Mastery
  /** Roles this matters to. All four means it's part of the shared core. */
  roles: RoleId[]
  /** What it is, and how it works underneath. */
  what: string
  /** Why it matters and when you'd reach for it. */
  why: string
  tradeoffs?: string
  /** A small, concrete thing to build or do to prove you've got it. */
  practice: string
  resourceIds: string[]
  /**
   * Earlier topics this one relies on. Shown as "Builds on" so it's clear how
   * topics connect; the validator checks each id exists and comes earlier in
   * the path, so the arrows only ever point backwards.
   */
  buildsOn?: string[]
}

export interface WeekStep {
  weeks: string
  focus: string
  milestone: string
}

export interface CopyPrompt {
  label: string
  text: string
}

export interface RoadmapProject {
  id: string
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Production'
  summary: string
  stack: string[]
  /** Linear request/data path, rendered as a flow diagram. */
  flow?: string[]
  mustDemonstrate: string[]
  stretch?: string[]
  /** What you should be able to say about it in an interview. */
  talkingPoints: string[]
  resourceIds: string[]
}

export interface RoadmapPhase {
  id: string
  number: number
  title: string
  tagline: string
  level: Level
  /** Why this step comes at this point — how it connects to what came before. */
  whyNow: string
  /** What this step unlocks next. */
  leadsTo: string
  /** At ~20 hours a week. Used for the timeline. */
  weekStart: number
  weekEnd: number
  hours: string
  dependsOn: string[]
  topics: RoadmapTopic[]
  weekPlan: WeekStep[]
  project?: RoadmapProject
  miniExercises: string[]
  interview: {
    questions: string[]
    depth: string
  }
  ai: {
    do: string[]
    dont: string[]
    prompts: CopyPrompt[]
  }
  /** Exit criteria — doubles as a placement test for skipping the phase. */
  readyWhen: string[]
}

export interface ContinuousTrack {
  id: string
  title: string
  weekStart: number
  weekEnd: number
  hours: string
  summary: string
  steps: WeekStep[]
  method: string[]
  resourceIds: string[]
}

export interface RoleSpecialization {
  id: RoleId
  title: string
  oneLiner: string
  whatsDifferent: string
  extraTopics: { name: string; mastery: Mastery; note: string }[]
  capstone: RoadmapProject
  interviewLoop: { round: string; whatTheyTest: string; howToPrepare: string }[]
  resourceIds: string[]
}

export interface InterviewType {
  id: string
  name: string
  roles: RoleId[]
  startsWeek: number
  whatItTests: string
  method: string[]
  sampleQuestions: string[]
  resourceIds: string[]
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface ChecklistGroup {
  id: string
  title: string
  hint: string
  items: ChecklistItem[]
}
