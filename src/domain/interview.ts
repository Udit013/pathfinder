import type {
  InterviewPrepProgress,
  InterviewQuestion,
  InterviewTrack,
  PrepStage,
  SkillProgress,
  UserProfile,
} from '@/types'
import { interviewQuestions } from '@/data/interviewQuestions'
import { interviewTracks, stageIndex, stageOrder, type TrackMeta } from '@/data/interviewTracks'

/**
 * Interview preparation (§19).
 *
 * The connective tissue of the whole product: Explore → Learn → Practise →
 * Build → Interview. Tracks are ordered by what the person actually chose and
 * actually learned, so "Data Analyst → SQL → SQL interview practice" is a path
 * the app draws rather than a coincidence.
 *
 * Progress is measured by how far up the ladder each question has moved, never
 * by how many were "answered" — because there is no answer key, and there
 * shouldn't be one.
 */

export interface TrackProgress {
  track: TrackMeta
  questions: InterviewQuestion[]
  /** Questions that have reached at least "explain". */
  readyCount: number
  /** Questions touched at all. */
  startedCount: number
  total: number
  /** 0–1, weighted by how far up the ladder each question has moved. */
  fraction: number
  /** True once most questions are interview-ready. */
  complete: boolean
}

export function resolveTrack(
  track: TrackMeta,
  prep: InterviewPrepProgress[],
): TrackProgress {
  const questions = interviewQuestions.filter((question) => question.track === track.id)
  const byQuestion = new Map(prep.map((entry) => [entry.questionId, entry]))

  let ladderSum = 0
  let readyCount = 0
  let startedCount = 0

  for (const question of questions) {
    const entry = byQuestion.get(question.id)
    if (!entry) continue
    startedCount += 1
    const reached = stageIndex(entry.stage)
    ladderSum += (reached + 1) / stageOrder.length
    if (reached >= stageIndex('explain')) readyCount += 1
  }

  const total = questions.length
  return {
    track,
    questions,
    readyCount,
    startedCount,
    total,
    fraction: total === 0 ? 0 : ladderSum / total,
    complete: total > 0 && readyCount >= Math.ceil(total * 0.8),
  }
}

export interface RankedTrack extends TrackProgress {
  /** Why this track is being shown where it is. Always surfaced to the user. */
  reason: string
  /** Skills the user has learned that this track exercises. */
  matchedSkills: string[]
  relevant: boolean
}

/**
 * Orders tracks by what this person is actually preparing for.
 *
 * Behavioural is nudged upward for anyone with nothing started, because it
 * appears in every interview, everyone underprepares for it, and it improves
 * faster than anything else on the list — so it's the kindest place to begin.
 */
export function rankTracks(input: {
  profile: UserProfile | null
  skillProgress: SkillProgress[]
  prep: InterviewPrepProgress[]
}): RankedTrack[] {
  const { profile, skillProgress, prep } = input

  const learned = new Set(
    skillProgress
      .filter((entry) => entry.state === 'completed' || entry.state === 'in_progress')
      .map((entry) => entry.skillId),
  )
  const primaryPathId = profile?.primaryPathId ?? null
  const activePathIds = profile?.activePathIds ?? []
  const nothingStarted = prep.length === 0

  return interviewTracks
    .map((track) => {
      const progress = resolveTrack(track, prep)
      const matchedSkills = track.skillIds.filter((skillId) => learned.has(skillId))

      const onPrimary = primaryPathId ? track.careerPathIds.includes(primaryPathId) : false
      const onActive = track.careerPathIds.some((id) => activePathIds.includes(id))
      // An empty careerPathIds means "everyone interviews on this".
      const universal = track.careerPathIds.length === 0

      const score =
        (onPrimary ? 6 : 0) +
        (onActive ? 3 : 0) +
        matchedSkills.length * 2 +
        (universal ? 2 : 0) +
        (universal && nothingStarted ? 3 : 0) +
        // Finish what's started before opening something new.
        (progress.startedCount > 0 && !progress.complete ? 4 : 0)

      const reason = (() => {
        if (progress.startedCount > 0 && !progress.complete) return 'You’ve already started this'
        if (matchedSkills.length > 0) {
          return matchedSkills.length === 1
            ? 'Interviews on a skill you’ve been learning'
            : `Interviews on ${matchedSkills.length} skills you’ve been learning`
        }
        if (universal) return 'Comes up in every interview, whatever the role'
        if (onPrimary) return 'Standard for the direction you’re following'
        if (onActive) return 'Standard for a direction you’re exploring'
        return 'Worth knowing about'
      })()

      return {
        ...progress,
        reason,
        matchedSkills,
        relevant: onPrimary || onActive || universal || matchedSkills.length > 0,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...rest }) => rest)
}

/** The single next thing to do, so Interview Prep has one clear action. */
export function nextInterviewAction(
  ranked: RankedTrack[],
  prep: InterviewPrepProgress[],
): { track: RankedTrack; question: InterviewQuestion; reason: string } | null {
  const touched = new Set(prep.map((entry) => entry.questionId))

  // Prefer resuming something already started over opening a new question.
  for (const track of ranked) {
    const partial = track.questions.find((question) => {
      const entry = prep.find((item) => item.questionId === question.id)
      return entry && stageIndex(entry.stage) < stageIndex('interview')
    })
    if (partial) return { track, question: partial, reason: 'Pick this back up' }
  }

  for (const track of ranked) {
    const untouched = track.questions.find((question) => !touched.has(question.id))
    if (untouched) return { track, question: untouched, reason: track.reason }
  }

  return null
}

export function stageFor(
  questionId: string,
  prep: InterviewPrepProgress[],
): PrepStage | null {
  return prep.find((entry) => entry.questionId === questionId)?.stage ?? null
}

/** Advancing one rung. Returns null when already at the top. */
export function nextStage(stage: PrepStage): PrepStage | null {
  const index = stageIndex(stage)
  return stageOrder[index + 1] ?? null
}

/**
 * Mock interview: a small, realistic set drawn across the tracks that matter to
 * this person. Behavioural always appears, because every real interview has it.
 */
export function buildMockInterview(input: {
  ranked: RankedTrack[]
  count?: number
  seed?: number
}): InterviewQuestion[] {
  const { ranked, count = 5, seed = Date.now() } = input

  const relevant = ranked.filter((track) => track.relevant && track.total > 0)
  const pool = relevant.length > 0 ? relevant : ranked.filter((track) => track.total > 0)

  const picked: InterviewQuestion[] = []
  const used = new Set<string>()

  const pick = (track: RankedTrack, offset: number) => {
    const options = track.questions.filter((question) => !used.has(question.id))
    if (options.length === 0) return
    const question = options[(offset + seed) % options.length]
    if (!question) return
    used.add(question.id)
    picked.push(question)
  }

  // One behavioural question first — that's how real interviews open.
  const behavioural = pool.find((track) => track.track.id === 'behavioral')
  if (behavioural) pick(behavioural, 0)

  let offset = 1
  while (picked.length < count) {
    const before = picked.length
    for (const track of pool) {
      if (picked.length >= count) break
      if (track.track.id === 'behavioral' && picked.length > 0) continue
      pick(track, offset)
    }
    offset += 1
    if (picked.length === before) break // pool exhausted
  }

  return picked.slice(0, count)
}

export function trackForSkill(skillId: string): InterviewTrack | null {
  const match = interviewTracks.find((track) => track.skillIds.includes(skillId))
  return match?.id ?? null
}
