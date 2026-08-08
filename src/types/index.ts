/**
 * PathFinder data model.
 *
 * Split deliberately into two halves:
 *
 *   CONTENT  — ships with the app, immutable, keyed by stable id. Lives in
 *              `src/data`. Never persisted (only ids are).
 *   USER     — everything the person generates. Lives in localStorage behind
 *              the storage adapter. References content by id.
 *
 * Derived values (XP totals, career signals, today's plan, wins summaries) are
 * NOT types in the persisted state — they are computed in `src/domain` so they
 * can never drift from the evidence they came from.
 */

// ─── Shared primitives ───────────────────────────────────────────────────────

/** ISO-8601 timestamp, e.g. "2026-08-07T14:03:00.000Z". */
export type IsoDateTime = string
/** ISO-8601 calendar date, e.g. "2026-08-07". Local to the user. */
export type IsoDate = string

export type Rating1to5 = 1 | 2 | 3 | 4 | 5

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type EnergyLevel = 'low' | 'okay' | 'good' | 'high'

/** How much the app should ask of the user today (§8). */
export type WorkloadMode = 'light' | 'normal' | 'deep'

// ─── CONTENT: career paths ───────────────────────────────────────────────────

export type CareerCategoryId = 'data' | 'software' | 'business' | 'beyond_tech'

export interface CareerCategory {
  id: CareerCategoryId
  label: string
  /** Short framing sentence shown above the group on Explore. */
  blurb: string
  /** True when the category is explicitly presented as non-exhaustive (§9). */
  openEnded: boolean
}

/**
 * The identity of a career path — enough to list it, group it, compare it, and
 * let someone say "I'm curious about that one".
 *
 * Kept separate from `CareerPathDetail` so the catalog can be complete before
 * every path has its full write-up. A path with no detail yet renders as
 * "we're still writing this one up" rather than as invented filler.
 */
export interface CareerPathSummary {
  id: string
  categoryId: CareerCategoryId
  title: string
  /** One line, plain English, no jargon. Used on cards. */
  tagline: string
  entryLevelTitles: string[]
  commonTools: string[]
  /** Skill ids from `src/data/skills`. */
  coreSkillIds: string[]
  /** Other career path ids that share most of their skills. */
  adjacentPathIds: string[]
}

/** §10 — the full career path page. Added per path as it is written. */
export interface CareerPathDetail {
  id: string
  /** §10 "What is it?" — a few plain-English paragraphs. */
  whatItIs: string[]
  /** §10 "What does a normal day look like?" */
  typicalDay: string[]
  /** §10 "What do people actually produce?" */
  deliverables: string[]
  /** Preparation framing only — never a hiring promise (§4). */
  preparation: {
    estimatedMonthsMin: number
    estimatedMonthsMax: number
    /** Exactly what that estimate covers, so it can't read as a guarantee. */
    scopeNote: string
  }
  interviewFormat: string[]
  portfolioExpectations: string[]
  advantages: string[]
  challenges: string[]
  enjoyIf: string[]
  dislikeIf: string[]
  /** Resource ids from `src/data/resources`. */
  starterResourceIds: string[]
  /** Experiment ids that give first-hand exposure to this path (§11). */
  experimentIds: string[]
  /** Roadmap id, when a learning path exists for this career yet. */
  roadmapId?: string
}

/** A path whose write-up exists. Assembled at read time from the two halves. */
export type CareerPath = CareerPathSummary & CareerPathDetail

// ─── CONTENT: market data (§29) ──────────────────────────────────────────────

/**
 * These three tiers are never mixed or averaged together in the UI.
 */
export type SalaryTier = 'entry_level' | 'median' | 'general_market'

/**
 * A single sourced compensation/market figure.
 *
 * `status` gates rendering: only `verified` points may display numbers, and
 * only alongside their source and access date. Seed data ships as
 * `needs_sourcing` with null figures rather than invented ones (§28, §29).
 */
export interface MarketDataPoint {
  id: string
  careerPathId: string
  /** Geographic scope of the figure, e.g. "United States". Never implied. */
  location: string
  tier: SalaryTier
  experienceLevelNote: string
  currency: 'USD'
  salaryMin: number | null
  salaryMax: number | null
  status: 'verified' | 'needs_sourcing'
  /** Publisher name, e.g. "US Bureau of Labor Statistics". */
  source: string | null
  sourceUrl: string | null
  /** When the figure was read from the source. */
  accessedAt: IsoDate | null
  /** Publication date of the underlying data, when it differs from access. */
  publishedAt?: IsoDate | null
  notes?: string
  /** What this figure does NOT tell the user. Always rendered when present. */
  limitations?: string
}

export interface DemandContext {
  careerPathId: string
  summary: string | null
  status: 'verified' | 'needs_sourcing'
  source: string | null
  sourceUrl: string | null
  accessedAt: IsoDate | null
}

// ─── CONTENT: skills, roadmaps, resources ────────────────────────────────────

export type SkillCategory =
  | 'foundation'
  | 'data'
  | 'programming'
  | 'analytics'
  | 'engineering'
  | 'ml'
  | 'business'
  | 'communication'
  | 'job_search'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  /** Why this is worth the user's time, in their terms. */
  whyItMatters: string
  difficulty: Difficulty
  estimatedHours: number
  /** Skill ids that make this much easier to learn first. */
  prerequisiteSkillIds: string[]
  resourceIds: string[]
  /** A concrete thing to do once, to know it stuck. */
  practiceTask: string
}

/** How much a node actually matters — users need not complete everything (§13). */
export type NodeImportance = 'core' | 'useful' | 'optional'

/**
 * A node's state on the roadmap, derived from SkillProgress plus dependencies.
 * "locked" means "easier after its prerequisites" — the UI must never present
 * it as a prohibition, and a locked node is always still openable (§13).
 */
export type NodeState = 'locked' | 'available' | 'in_progress' | 'completed'

export interface RoadmapNode {
  id: string
  skillId: string
  importance: NodeImportance
  /** Node ids in the same roadmap that unlock this one. */
  dependsOn: string[]
  /** Vertical band for layout — 0 is the roadmap's foundation. */
  tier: number
}

export interface Roadmap {
  id: string
  careerPathId: string
  title: string
  intro: string
  nodes: RoadmapNode[]
}

/** Explicit, so an unverified resource can never masquerade as free (§14). */
export type ResourceCost = 'free' | 'free_tier' | 'paid'

/**
 * Explicit about YouTube rather than a generic "video", because the type badge
 * is shown to the user and "YouTube" tells them what they're about to open.
 */
export type ResourceKind =
  | 'course'
  | 'interactive'
  | 'docs'
  | 'article'
  | 'youtube_video'
  | 'youtube_playlist'
  | 'book'
  | 'practice'
  | 'dataset'
  | 'roadmap'

export interface Resource {
  id: string
  title: string
  provider: string
  url: string
  kind: ResourceKind
  skillIds: string[]
  careerPathIds: string[]
  difficulty: Difficulty
  /** Always displayed with a "~" — these are approximations, not promises. */
  estimatedMinutes: number
  /** Set when the length couldn't be measured, e.g. an open-ended playlist. */
  durationNote?: string
  cost: ResourceCost
  /**
   * True only once the URL has been confirmed to resolve and the content
   * confirmed reachable without payment. Until then the UI must not assert that
   * the resource is free (§14).
   */
  verified: boolean
  /** When the entry was last checked. Null when never checked. */
  lastVerified: IsoDate | null
  /** Anything the user should know before clicking — account needed, ads, etc. */
  accessNote?: string
  note?: string
}

export const resourceKindLabels: Record<ResourceKind, string> = {
  course: 'Course',
  interactive: 'Interactive',
  docs: 'Documentation',
  article: 'Article',
  youtube_video: 'YouTube',
  youtube_playlist: 'YouTube playlist',
  book: 'Book',
  practice: 'Practice',
  dataset: 'Dataset',
  roadmap: 'Roadmap',
}

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

// ─── CONTENT: career experiments (§11) ───────────────────────────────────────

export interface ExperimentStep {
  id: string
  title: string
  detail: string
  /** Progressive hints — revealed one at a time, never all at once. */
  hints: string[]
}

export interface CareerExperiment {
  id: string
  title: string
  /** Career path ids this experiment provides evidence for. */
  careerPathIds: string[]
  /** The situation, written as a real request from a real workplace. */
  scenario: string
  objective: string
  estimatedMinutes: number
  difficulty: Difficulty
  /** Skill ids the user will brush against. */
  skillIds: string[]
  steps: ExperimentStep[]
  /** In-app fixture id, so the Lab works with no downloads (see §data). */
  datasetId?: string
  resourceIds: string[]
  /** What "done" looks like, so the user isn't left guessing. */
  doneWhen: string
}

// ─── CONTENT: quests, projects, interviews, networking ───────────────────────

export type QuestKind = 'learn' | 'practice' | 'explore' | 'build' | 'job_search' | 'reflect'

export interface DailyQuestTemplate {
  id: string
  title: string
  /** The concrete outcome, e.g. "Find the top 5 products by revenue". */
  objective: string
  kind: QuestKind
  skillIds: string[]
  careerPathIds: string[]
  /** Sub-skills practised, listed on the quest card (§15). */
  practises: string[]
  estimatedMinutes: number
  xp: number
  resourceIds: string[]
  /** The exercise itself — what the user actually does. */
  task: string
  /** Smallest honest version of this quest, for light days (§8). */
  lighterVariant?: string
}

export interface ProjectMilestoneTemplate {
  id: string
  title: string
  detail: string
  estimatedHours: number
}

export interface ProjectTemplate {
  id: string
  title: string
  careerPathIds: string[]
  difficulty: Difficulty
  estimatedHours: number
  /** The real problem, not a tutorial premise. */
  problem: string
  whyItMatters: string
  skillIds: string[]
  skillsDemonstrated: string[]
  datasetSuggestion: string
  architecture: string[]
  milestones: ProjectMilestoneTemplate[]
  deliverables: string[]
  readmeChecklist: string[]
  /** Guidance on how to phrase this — never a pre-written lie. */
  resumeBulletGuidance: string[]
  portfolioPresentation: string[]
}

export type InterviewTrack =
  | 'sql'
  | 'python'
  | 'statistics'
  | 'data_analysis'
  | 'machine_learning'
  | 'behavioral'
  | 'case_study'
  | 'product_analytics'
  | 'data_engineering'
  | 'general_technical'

/** Understanding before recall (§19). */
export type PrepStage = 'understand' | 'practice' | 'solve' | 'explain' | 'interview'

export interface InterviewQuestion
{
  id: string
  track: InterviewTrack
  stage: PrepStage
  prompt: string
  difficulty: Difficulty
  /** What a good answer covers — points to reason about, not a script. */
  whatGoodLooksLike: string[]
  followUps: string[]
  skillIds: string[]
}

export interface NetworkingQuest {
  id: string
  title: string
  detail: string
  estimatedMinutes: number
  xp: number
  /** A starting point the user rewrites in their own voice. */
  templateHint?: string
}

// ─── USER: profile & constraints ─────────────────────────────────────────────

/**
 * User-declared constraints only. PathFinder uses these to filter and frame
 * what it shows. It NEVER interprets them legally, never computes eligibility,
 * and always defers to the user's DSO and official USCIS guidance (§5).
 */
export interface WorkAuthorizationConstraint {
  /** Free-text on purpose — we do not maintain a legal taxonomy. */
  status: string
  /** The user's own note about their timeline. Not a calculation. */
  timelineNote?: string
  requiresSponsorship: boolean | null
}

export interface UserProfile
{
  name: string
  createdAt: IsoDateTime
  /** Where they are right now, in their words. Shapes copy, not logic. */
  situation?: string
  /** What they want out of this, chosen during onboarding. */
  goals: string[]
  /** Career path ids they said they were curious about at the start. */
  initialInterestPathIds: string[]
  /** Ids of career paths currently being explored, most important first. */
  activePathIds: string[]
  /** The one path whose roadmap drives Today. Changeable at any time (§3). */
  primaryPathId: string | null
  workAuthorization?: WorkAuthorizationConstraint
  locationPreferences: string[]
  /** Minutes per weekday the user says they realistically have. */
  weekdayMinutes: number
  onboardingCompletedAt: IsoDateTime | null
}

export interface UserPreferences {
  theme: 'system' | 'light' | 'dark'
  /** Streaks are opt-in and never punitive (§22). */
  showShowUpCount: boolean
  reducedCelebration: boolean
  /** Which AI tool the toolkit buttons favour (§25). */
  preferredAiTool: 'chatgpt' | 'claude'
}

// ─── USER: activity & evidence ───────────────────────────────────────────────

export interface ExperimentRatings {
  enjoyment: Rating1to5
  curiosity: Rating1to5
  /** Recorded but never scored — difficult is not the same as wrong fit. */
  difficulty: Rating1to5
  wantMore: Rating1to5
  professionally: Rating1to5
}

export interface CareerExperimentResponse {
  id: string
  experimentId: string
  /** Denormalised so signals survive content changes. */
  careerPathIds: string[]
  startedAt: IsoDateTime
  completedAt: IsoDateTime | null
  completedStepIds: string[]
  revealedHints: Record<string, number>
  ratings: ExperimentRatings | null
  reflection?: string
}

export type SkillState = 'not_started' | 'in_progress' | 'completed'

export interface SkillProgress {
  skillId: string
  state: SkillState
  startedAt: IsoDateTime | null
  completedAt: IsoDateTime | null
  /** User's own note on where they got to. */
  note?: string
  completedResourceIds: string[]
}

export interface QuestCompletion {
  id: string
  questId: string
  /** The day it was assigned, so Today is stable across reloads. */
  assignedOn: IsoDate
  completedAt: IsoDateTime | null
  skipped: boolean
  xpAwarded: number
  /** Whether the user asked to make it lighter (§7). No judgement attached. */
  lightened: boolean
}

export type MilestoneState = 'todo' | 'in_progress' | 'done'

export interface ProjectMilestoneProgress {
  milestoneId: string
  state: MilestoneState
  completedAt: IsoDateTime | null
}

export interface ProjectInstance {
  id: string
  templateId: string | null
  /** Set when the user invents their own project rather than picking one. */
  customTitle?: string
  startedAt: IsoDateTime
  completedAt: IsoDateTime | null
  milestones: ProjectMilestoneProgress[]
  repoUrl?: string
  liveUrl?: string
  notes?: string
}

// ─── USER: job search ────────────────────────────────────────────────────────

export type ApplicationStage =
  | 'saved'
  | 'applied'
  | 'screen'
  | 'interview'
  | 'final'
  | 'offer'

/** Outcome is tracked separately from stage, so a rejection isn't a "column". */
export type ApplicationOutcome = 'open' | 'rejected' | 'withdrawn' | 'accepted'

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  /** The date the user applied, or saved it. */
  dateApplied: IsoDate | null
  savedAt: IsoDateTime
  url?: string
  source?: string
  resumeVersion?: string
  referral?: string
  stage: ApplicationStage
  outcome: ApplicationOutcome
  nextAction?: string
  followUpOn?: IsoDate
  notes?: string
  /** Whether the posting mentions sponsorship — as recorded by the user. */
  sponsorshipNote?: string
}

export type NetworkingKind =
  | 'message_sent'
  | 'reply_received'
  | 'call_held'
  | 'referral_asked'
  | 'event_attended'
  | 'follow_up'

export interface NetworkingActivity {
  id: string
  kind: NetworkingKind
  personOrGroup: string
  company?: string
  occurredOn: IsoDate
  questId?: string
  notes?: string
}

export interface InterviewPrepProgress {
  questionId: string
  stage: PrepStage
  /** Confidence is self-reported and revisable — never a grade. */
  confidence: Rating1to5 | null
  lastPractisedAt: IsoDateTime
  note?: string
}

// ─── USER: reflection & check-ins (§20) ──────────────────────────────────────

export interface CheckIn {
  id: string
  date: IsoDate
  energy: EnergyLevel
  /** Set when the user explicitly asked for a lighter day (§23). */
  roughDay: boolean
  accomplished?: string
  feltGood?: string
  feltHard?: string
}

export type ReflectionKind = 'daily' | 'weekly' | 'experiment' | 'project' | 'freeform'

export interface Reflection {
  id: string
  kind: ReflectionKind
  createdAt: IsoDateTime
  /** Short prompted answers, keyed by prompt id. Never a long journal form. */
  answers: Record<string, string>
  /** Links the reflection back to what it was about. */
  subjectId?: string
}

// ─── USER: progress ledger ───────────────────────────────────────────────────

export type ProgressEventKind =
  | 'quest_completed'
  | 'skill_started'
  | 'skill_completed'
  | 'experiment_completed'
  | 'project_started'
  | 'project_milestone'
  | 'project_completed'
  | 'application_submitted'
  | 'application_advanced'
  | 'networking_activity'
  | 'interview_completed'
  | 'reflection_added'
  | 'path_chosen'
  | 'concept_understood'

/**
 * Append-only ledger. Every XP point and every win traces back to one of
 * these, which is what makes Progress explainable rather than magical.
 */
export interface ProgressEvent {
  id: string
  kind: ProgressEventKind
  occurredAt: IsoDateTime
  xp: number
  /** Human-readable, already written for display. */
  label: string
  careerPathIds: string[]
  skillIds: string[]
  /** Id of the thing this happened to (quest, skill, application, …). */
  subjectId?: string
}

/** §18 — effort made visible, not just offers. Derived from ProgressEvent. */
export interface WinsLogEntry {
  id: string
  occurredAt: IsoDateTime
  label: string
  category: 'learning' | 'building' | 'opportunity' | 'insight'
  sourceEventId: string
}

// ─── DERIVED: career signals (§12) ───────────────────────────────────────────

export type SignalStrength = 'emerging' | 'moderate' | 'strong'

export interface SignalEvidence {
  kind: 'experiment' | 'skill' | 'project' | 'quest' | 'reflection'
  /** Already phrased for display, e.g. "You enjoyed 4 of 5 analytics experiments". */
  label: string
  /** Contribution to the score, for the "why?" breakdown. */
  contribution: number
}

export interface CareerSignal {
  careerPathId: string
  /** 0–5. Presented as a signal from activity, never as a prediction. */
  score: number
  strength: SignalStrength
  evidence: SignalEvidence[]
  /** How much activity this is based on. Low counts are stated plainly. */
  sampleSize: number
  /** Recorded difficulty, surfaced separately from the score. */
  averageDifficulty: number | null
}

// ─── DERIVED: today's plan (§7, §8) ──────────────────────────────────────────

export interface TodayPlan
{
  date: IsoDate
  mode: WorkloadMode
  /** Total minutes the plan asks for, so the ask is honest up front. */
  totalMinutes: number
  questId: string | null
  explorationExperimentId: string | null
  jobActionId: string | null
  jobActionKind: 'networking' | 'follow_up' | 'apply' | null
}
