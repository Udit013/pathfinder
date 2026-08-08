import type {
  CareerExperimentResponse,
  CareerSignal,
  ProgressEvent,
  ProjectInstance,
  SignalEvidence,
  SignalStrength,
  SkillProgress,
} from '@/types'
import { careerPathSummaries, pathTitle } from '@/data/careerPaths'
import { careerExperiments, experimentById } from '@/data/experiments'

/**
 * Career Signals (§12).
 *
 * What this is: a summary of what the user has actually done and how they said
 * it felt. What this is NOT: a prediction, a personality type, or a
 * recommendation. Every number here traces back to a specific thing the user
 * did, and the UI is required to show that trace.
 *
 * Design decisions worth keeping:
 *
 *  1. `difficulty` is recorded but never scored. Finding something hard is not
 *     evidence of poor fit — often the opposite. It is surfaced separately.
 *
 *  2. Low evidence is stated, never smoothed over. Below MIN_CONFIDENT_SAMPLES
 *     the strength is capped at "emerging" no matter how high the ratings, so a
 *     single enthusiastic afternoon can't masquerade as a life direction.
 *
 *  3. Skills, projects and quests contribute, but are capped well below
 *     experiments. Doing a thing tells you less about fit than doing it and
 *     then telling us how it felt.
 */

/** Experiments needed before a signal can read as more than "emerging". */
export const MIN_CONFIDENT_SAMPLES = 3

const RATING_WEIGHTS = {
  enjoyment: 0.3,
  wantMore: 0.3,
  professionally: 0.2,
  curiosity: 0.2,
} as const

/** Ceilings so activity can nudge a signal but never manufacture one. */
const SKILL_BONUS_PER_SKILL = 0.12
const SKILL_BONUS_CAP = 0.4
const PROJECT_BONUS_PER_PROJECT = 0.2
const PROJECT_BONUS_CAP = 0.4
const QUEST_BONUS_PER_QUEST = 0.04
const QUEST_BONUS_CAP = 0.25

export interface SignalInputs {
  experimentResponses: CareerExperimentResponse[]
  skillProgress: SkillProgress[]
  projects: ProjectInstance[]
  events: ProgressEvent[]
}

function ratingScore(ratings: NonNullable<CareerExperimentResponse['ratings']>): number {
  return (
    ratings.enjoyment * RATING_WEIGHTS.enjoyment +
    ratings.wantMore * RATING_WEIGHTS.wantMore +
    ratings.professionally * RATING_WEIGHTS.professionally +
    ratings.curiosity * RATING_WEIGHTS.curiosity
  )
}

function strengthFor(score: number, sampleSize: number): SignalStrength {
  if (sampleSize < MIN_CONFIDENT_SAMPLES) return 'emerging'
  if (score >= 4) return 'strong'
  if (score >= 3) return 'moderate'
  return 'emerging'
}

/**
 * Computes one signal per career path the user has any evidence for. Paths with
 * no evidence are omitted entirely rather than shown as zero — an untried path
 * is unknown, not bad, and a chart full of empty bars implies otherwise.
 */
export function computeSignals(inputs: SignalInputs): CareerSignal[] {
  const { experimentResponses, skillProgress, projects, events } = inputs

  const completedSkillIds = new Set(
    skillProgress.filter((entry) => entry.state === 'completed').map((entry) => entry.skillId),
  )

  const signals: CareerSignal[] = []

  for (const path of careerPathSummaries) {
    const evidence: SignalEvidence[] = []

    // ── Experiments: the primary evidence ────────────────────────────────────
    const responses = experimentResponses.filter(
      (response) =>
        response.completedAt !== null &&
        response.ratings !== null &&
        response.careerPathIds.includes(path.id),
    )

    let baseScore = 0
    const difficulties: number[] = []

    if (responses.length > 0) {
      let total = 0
      for (const response of responses) {
        const ratings = response.ratings
        if (!ratings) continue
        total += ratingScore(ratings)
        difficulties.push(ratings.difficulty)
      }
      baseScore = total / responses.length

      const enjoyed = responses.filter((response) => (response.ratings?.enjoyment ?? 0) >= 4).length
      const wantMore = responses.filter((response) => (response.ratings?.wantMore ?? 0) >= 4).length
      const professionally = responses.filter(
        (response) => (response.ratings?.professionally ?? 0) >= 4,
      ).length

      evidence.push({
        kind: 'experiment',
        label:
          responses.length === 1
            ? `You completed 1 experiment for ${pathTitle(path.id)}`
            : `You completed ${responses.length} experiments for ${pathTitle(path.id)}`,
        contribution: baseScore,
      })

      const single = responses.length === 1

      if (enjoyed > 0) {
        evidence.push({
          kind: 'experiment',
          label: single ? 'You enjoyed it' : `You enjoyed ${enjoyed} of ${responses.length}`,
          contribution: 0,
        })
      }
      if (wantMore > 0) {
        evidence.push({
          kind: 'experiment',
          label: single
            ? 'You said you’d want to do more of this kind of work'
            : `You wanted more of it after ${wantMore} of ${responses.length}`,
          contribution: 0,
        })
      }
      if (professionally > 0) {
        evidence.push({
          kind: 'experiment',
          label: single
            ? 'You could see yourself doing this professionally'
            : `You could see it professionally after ${professionally} of ${responses.length}`,
          contribution: 0,
        })
      }

      // Name the single experiment that moved this most — it's the most useful
      // thing someone can be told about their own signal.
      const best = [...responses].sort(
        (a, b) => ratingScore(b.ratings!) - ratingScore(a.ratings!),
      )[0]
      const bestExperiment = best ? experimentById(best.experimentId) : undefined
      if (bestExperiment && responses.length > 1) {
        evidence.push({
          kind: 'experiment',
          label: `Rated highest: "${bestExperiment.title}"`,
          contribution: 0,
        })
      }
    }

    // ── Supporting activity: capped, additive ────────────────────────────────
    const relevantSkills = path.coreSkillIds.filter((skillId) => completedSkillIds.has(skillId))
    const skillBonus = Math.min(SKILL_BONUS_CAP, relevantSkills.length * SKILL_BONUS_PER_SKILL)
    if (skillBonus > 0) {
      evidence.push({
        kind: 'skill',
        label:
          relevantSkills.length === 1
            ? 'You’ve completed one of this path’s core skills'
            : `You’ve completed ${relevantSkills.length} of this path’s core skills`,
        contribution: skillBonus,
      })
    }

    const relevantProjects = projects.filter((project) => {
      if (!project.completedAt) return false
      return events.some(
        (event) =>
          event.subjectId === project.id &&
          event.kind === 'project_completed' &&
          event.careerPathIds.includes(path.id),
      )
    })
    const projectBonus = Math.min(
      PROJECT_BONUS_CAP,
      relevantProjects.length * PROJECT_BONUS_PER_PROJECT,
    )
    if (projectBonus > 0) {
      evidence.push({
        kind: 'project',
        label: `You finished ${relevantProjects.length === 1 ? 'a project' : `${relevantProjects.length} projects`} in this area`,
        contribution: projectBonus,
      })
    }

    const questCount = events.filter(
      (event) => event.kind === 'quest_completed' && event.careerPathIds.includes(path.id),
    ).length
    const questBonus = Math.min(QUEST_BONUS_CAP, questCount * QUEST_BONUS_PER_QUEST)
    if (questBonus > 0) {
      evidence.push({
        kind: 'quest',
        label:
          questCount === 1
            ? 'You’ve completed a quest that builds toward it'
            : `You’ve completed ${questCount} quests that build toward it`,
        contribution: questBonus,
      })
    }

    if (evidence.length === 0) continue

    // Supporting activity alone can't invent a signal out of nothing: with no
    // rated experiments it produces a low score that reads as "you've started".
    const rawScore =
      responses.length > 0
        ? baseScore + skillBonus + projectBonus + questBonus
        : Math.min(2.5, skillBonus + projectBonus + questBonus + 1.5)

    const score = Math.max(0, Math.min(5, rawScore))

    signals.push({
      careerPathId: path.id,
      score: Math.round(score * 10) / 10,
      strength: strengthFor(score, responses.length),
      evidence,
      sampleSize: responses.length,
      averageDifficulty:
        difficulties.length > 0
          ? Math.round((difficulties.reduce((sum, value) => sum + value, 0) / difficulties.length) * 10) / 10
          : null,
    })
  }

  return signals.sort((a, b) => b.score - a.score)
}

export const strengthLabels: Record<SignalStrength, string> = {
  emerging: 'Emerging signal',
  moderate: 'Moderate signal',
  strong: 'Strong signal',
}

/**
 * The caveat shown alongside every signal. Phrased so it can't be read as a
 * verdict, and so a low signal never reads as a judgement of the person.
 */
export function signalCaveat(signal: CareerSignal): string {
  if (signal.sampleSize === 0) {
    return 'Based on your learning activity so far, not on trying the work itself. Try an experiment to find out how it actually feels.'
  }
  if (signal.sampleSize < MIN_CONFIDENT_SAMPLES) {
    const remaining = MIN_CONFIDENT_SAMPLES - signal.sampleSize
    return `Based on ${signal.sampleSize} experiment${signal.sampleSize === 1 ? '' : 's'} — not enough to mean much yet. ${remaining} more would make this worth reading.`
  }
  return 'Based on what you did and how you said it felt.'
}

/** Copy for the difficulty note, which is deliberately kept out of the score. */
export function difficultyNote(signal: CareerSignal): string | null {
  if (signal.averageDifficulty === null || signal.sampleSize === 0) return null
  if (signal.averageDifficulty >= 4) {
    return 'You found this challenging. That is worth knowing, but it is not the same as a poor fit — difficulty usually fades and interest usually does not.'
  }
  if (signal.averageDifficulty <= 2) {
    return 'You found this straightforward. Worth checking whether that means it suits you or that you have not hit the hard part yet.'
  }
  return null
}

/** The single next thing worth trying, given what has and hasn't been explored. */
export function suggestedNextExperiment(
  signals: CareerSignal[],
  activePathIds: string[],
  completedExperimentIds: string[],
): { experimentId: string; reason: string } | null {
  const done = new Set(completedExperimentIds)

  // Prefer breadth first: an active path with no evidence at all.
  const untried = activePathIds.find(
    (pathId) => !signals.some((signal) => signal.careerPathId === pathId && signal.sampleSize > 0),
  )
  if (untried) {
    const candidate = careerPathSummaries.find((path) => path.id === untried)
    if (candidate) {
      const experiment = findExperimentFor(untried, done)
      if (experiment) {
        return {
          experimentId: experiment,
          reason: `You haven't tried ${candidate.title} yet — worth one experiment before ruling it in or out`,
        }
      }
    }
  }

  // Then depth: shore up the strongest signal that's still thin.
  const thin = signals.find(
    (signal) => signal.sampleSize > 0 && signal.sampleSize < MIN_CONFIDENT_SAMPLES,
  )
  if (thin) {
    const experiment = findExperimentFor(thin.careerPathId, done)
    if (experiment) {
      return {
        experimentId: experiment,
        reason: `Another data point on ${pathTitle(thin.careerPathId)} would make that signal mean something`,
      }
    }
  }

  for (const pathId of activePathIds) {
    const experiment = findExperimentFor(pathId, done)
    if (experiment) {
      return { experimentId: experiment, reason: 'Next one in a direction you’re exploring' }
    }
  }

  return null
}

function findExperimentFor(pathId: string, done: Set<string>): string | null {
  const match = careerExperiments.find(
    (experiment) => experiment.careerPathIds.includes(pathId) && !done.has(experiment.id),
  )
  return match?.id ?? null
}
