import type { PersistedState } from '@/lib/storage'
import { pathTitle } from '@/data/careerPaths'
import { skillById, skillName } from '@/data/skills'
import { roadmapForPath } from '@/data/roadmaps'
import { resolveRoadmap } from '@/domain/roadmap'
import { projectTemplateById } from '@/data/projects'
import { projectProgress } from '@/domain/projects'
import { experimentById } from '@/data/experiments'
import { questionById } from '@/data/interviewQuestions'
import { trackTitle } from '@/data/interviewTracks'
import { computeSignals } from '@/domain/signals'
import { modeShapes } from '@/domain/energy'
import { todayIso } from '@/lib/utils'

/**
 * The AI Companion's context engine.
 *
 * PathFinder knows where you are; ChatGPT and Claude are good at thinking. This
 * turns the first into a prompt you can paste into the second. Everything here
 * is pure local computation — no network, no keys, no backend, and nothing is
 * ever sent anywhere by this app.
 *
 * Two rules govern what goes in:
 *
 *  1. Only what's relevant to the question being asked. A prompt that dumps
 *     someone's entire history buries the actual question and wastes the
 *     model's attention.
 *
 *  2. Never anything the user didn't intend to share. Work-authorisation notes,
 *     location, and their private reflections on difficulty stay out — see
 *     EXCLUDED below. The user can always add anything they want by hand,
 *     because the prompt is editable before it's copied.
 */

/**
 * Deliberately never included in a generated prompt:
 *   - work authorisation status and timeline notes (§5 — sensitive, and
 *     irrelevant to every prompt here)
 *   - location preferences
 *   - the free-text reflections attached to experiments, unless the action is
 *     specifically about reflecting
 * The user can paste any of it themselves. We just won't do it for them.
 */

export type PromptKind =
  | 'learn_skill'
  | 'hint'
  | 'quiz'
  | 'review_project'
  | 'interview'
  | 'career_reflection'
  | 'next_step'
  | 'low_energy'

export interface PromptAction {
  kind: PromptKind
  title: string
  /** One line explaining what this gets you. */
  description: string
  /** Shown when the action can't be built yet, instead of a broken prompt. */
  unavailableReason?: string
}

export interface BuiltPrompt {
  kind: PromptKind
  title: string
  text: string
  /** Plain-language list of what was included, so nothing is a surprise. */
  includes: string[]
}

// ─── Snapshot ────────────────────────────────────────────────────────────────

interface Snapshot {
  name: string | null
  primaryPath: string | null
  exploringPaths: string[]
  currentSkill: { name: string; why: string; practiceTask: string } | null
  completedSkills: string[]
  roadmapLine: string | null
  project: { title: string; done: number; total: number; nextMilestone: string | null } | null
  interview: { track: string; question: string; guidance: string[] } | null
  interviewReady: number
  experiments: { title: string; enjoyment: number; wantMore: number }[]
  energy: string | null
  mode: string
  topSignals: { path: string; score: number; strength: string }[]
}

function snapshot(state: PersistedState): Snapshot {
  const profile = state.profile

  const primaryPathId = profile?.primaryPathId ?? null
  const roadmap = primaryPathId ? roadmapForPath(primaryPathId) : undefined
  const resolved = roadmap ? resolveRoadmap(roadmap, state.skillProgress) : null

  const inProgress = state.skillProgress.find((entry) => entry.state === 'in_progress')
  const currentSkillData = inProgress ? skillById(inProgress.skillId) : undefined

  const completedSkills = state.skillProgress
    .filter((entry) => entry.state === 'completed')
    .map((entry) => skillName(entry.skillId))

  const openProject = state.projects.find((entry) => !entry.completedAt)
  const projectTemplate = openProject?.templateId
    ? projectTemplateById(openProject.templateId)
    : undefined
  const projectStats = openProject ? projectProgress(openProject, projectTemplate) : null
  const nextMilestone = projectStats?.nextMilestoneId
    ? (projectTemplate?.milestones.find((m) => m.id === projectStats.nextMilestoneId)?.title ?? null)
    : null

  // The most recently touched interview question that isn't finished.
  const openPrep = [...state.interviewPrep]
    .filter((entry) => entry.stage !== 'interview')
    .sort((a, b) => b.lastPractisedAt.localeCompare(a.lastPractisedAt))[0]
  const openQuestion = openPrep ? questionById(openPrep.questionId) : undefined

  const checkIn = state.checkIns.find((entry) => entry.date === todayIso())

  const signals = computeSignals({
    experimentResponses: state.experimentResponses,
    skillProgress: state.skillProgress,
    projects: state.projects,
    events: state.events,
  })

  return {
    name: profile?.name?.trim().split(' ')[0] ?? null,
    primaryPath: primaryPathId ? pathTitle(primaryPathId) : null,
    exploringPaths: (profile?.activePathIds ?? []).map(pathTitle),
    currentSkill: currentSkillData
      ? {
          name: currentSkillData.name,
          why: currentSkillData.whyItMatters,
          practiceTask: currentSkillData.practiceTask,
        }
      : null,
    completedSkills,
    roadmapLine: resolved
      ? `${resolved.coreCompleted} of ${resolved.coreTotal} core skills done`
      : null,
    project:
      openProject && projectStats
        ? {
            title: projectTemplate?.title ?? openProject.customTitle ?? 'a project',
            done: projectStats.done,
            total: projectStats.total,
            nextMilestone,
          }
        : null,
    interview: openQuestion
      ? {
          track: trackTitle(openQuestion.track),
          question: openQuestion.prompt,
          guidance: openQuestion.whatGoodLooksLike,
        }
      : null,
    interviewReady: state.interviewPrep.filter((entry) => entry.stage === 'interview').length,
    experiments: state.experimentResponses
      .filter((entry) => entry.completedAt && entry.ratings)
      .slice(-4)
      .map((entry) => ({
        title: experimentById(entry.experimentId)?.title ?? entry.experimentId,
        enjoyment: entry.ratings!.enjoyment,
        wantMore: entry.ratings!.wantMore,
      })),
    energy: checkIn ? (checkIn.roughDay ? 'low (rough day)' : checkIn.energy) : null,
    mode: modeShapes[checkIn?.roughDay ? 'light' : 'normal'].label,
    topSignals: signals.slice(0, 3).map((signal) => ({
      path: pathTitle(signal.careerPathId),
      score: signal.score,
      strength: signal.strength,
    })),
  }
}

// ─── Prompt construction ─────────────────────────────────────────────────────

const GUIDANCE_SOCRATIC =
  "I'm learning this, so please don't just hand me the answer. Ask me questions, give me one hint at a time, and let me work it out. If I'm clearly stuck after a couple of tries, then explain it."

function section(title: string, lines: (string | null | undefined)[]): string | null {
  const kept = lines.filter((line): line is string => Boolean(line))
  if (kept.length === 0) return null
  return `${title}\n${kept.map((line) => `- ${line}`).join('\n')}`
}

function whereIAm(snap: Snapshot, options: { skill?: boolean; project?: boolean; signals?: boolean } = {}) {
  return section('## Where I am in my career exploration', [
    snap.primaryPath ? `Currently focused on: ${snap.primaryPath}` : null,
    snap.exploringPaths.length > 1 ? `Also exploring: ${snap.exploringPaths.join(', ')}` : null,
    options.skill !== false && snap.currentSkill ? `Currently learning: ${snap.currentSkill.name}` : null,
    options.skill !== false && snap.roadmapLine ? `Roadmap progress: ${snap.roadmapLine}` : null,
    options.skill !== false && snap.completedSkills.length > 0
      ? `Skills I've covered: ${snap.completedSkills.join(', ')}`
      : null,
    options.project && snap.project
      ? `Building: ${snap.project.title} (${snap.project.done} of ${snap.project.total} steps done)`
      : null,
    options.signals && snap.topSignals.length > 0
      ? `What I've enjoyed most so far, by my own ratings: ${snap.topSignals
          .map((s) => `${s.path} (${s.score}/5)`)
          .join(', ')}`
      : null,
  ])
}

function assemble(parts: (string | null)[]): string {
  return parts.filter(Boolean).join('\n\n')
}

export function availableActions(state: PersistedState): PromptAction[] {
  const snap = snapshot(state)

  return [
    {
      kind: 'learn_skill',
      title: 'Teach me this skill',
      description: 'A beginner-friendly explanation of what you’re learning, plus a small exercise.',
      unavailableReason: snap.currentSkill
        ? undefined
        : 'Start a skill on your Roadmap and this will fill itself in.',
    },
    {
      kind: 'hint',
      title: 'Give me a hint',
      description: 'For when you’re stuck. Asks for a nudge rather than the answer.',
    },
    {
      kind: 'quiz',
      title: 'Quiz me',
      description: 'One question at a time on what you’ve recently learned.',
      unavailableReason:
        snap.completedSkills.length > 0 || snap.currentSkill
          ? undefined
          : 'Learn or start a skill first, so there’s something to be quizzed on.',
    },
    {
      kind: 'review_project',
      title: 'Review my project',
      description: 'Honest feedback on what’s strong, what’s weak, and what to fix.',
      unavailableReason: snap.project
        ? undefined
        : 'Start a project in Build and this will know what to ask about.',
    },
    {
      kind: 'interview',
      title: 'Interview me',
      description: 'A mock interview for your direction, focused on what you’re learning.',
      unavailableReason: snap.primaryPath
        ? undefined
        : 'Pick a direction in Explore so the interview can be for something specific.',
    },
    {
      kind: 'career_reflection',
      title: 'Is this direction right for me?',
      description: 'Thinks through fit using what you’ve actually enjoyed and struggled with.',
      unavailableReason:
        snap.experiments.length > 0 || snap.topSignals.length > 0
          ? undefined
          : 'Try a career experiment first — otherwise there’s nothing to reason from.',
    },
    {
      kind: 'next_step',
      title: 'Help me pick what to do next',
      description: 'One realistic thing, based on where you are and how much time you have.',
    },
    {
      kind: 'low_energy',
      title: 'I’m low on energy today',
      description: 'One small thing you could actually finish today.',
    },
  ]
}

export function buildPrompt(kind: PromptKind, state: PersistedState): BuiltPrompt {
  const snap = snapshot(state)
  const who = snap.name ? `My name is ${snap.name}. ` : ''

  switch (kind) {
    case 'learn_skill': {
      const skill = snap.currentSkill
      return {
        kind,
        title: 'Teach me this skill',
        includes: ['Your current skill', 'Your direction', 'Skills you’ve already covered'],
        text: assemble([
          `${who}I'm learning **${skill?.name ?? 'a new skill'}** and I'd like you to teach it to me in a beginner-friendly way.`,
          whereIAm(snap),
          skill ? section('## Why I’m learning it', [skill.why]) : null,
          section('## What I’d like from you', [
            'Explain it from the beginning, assuming I know the surrounding basics but not this.',
            'Use a concrete example rather than an abstract definition.',
            'Then give me one small exercise I can do in about 20 minutes, and wait for my attempt before telling me the answer.',
            skill ? `For reference, my app suggests this practice task: "${skill.practiceTask}"` : null,
          ]),
          GUIDANCE_SOCRATIC,
        ]),
      }
    }

    case 'hint': {
      return {
        kind,
        title: 'Give me a hint',
        includes: ['Your current skill', 'Your direction', 'A space to describe your problem'],
        text: assemble([
          `${who}I'm stuck on something and I want a hint, not the answer.`,
          whereIAm(snap),
          section('## What I’m working on', [
            '<< Describe the problem here — paste your code, query, or question. >>',
          ]),
          section('## What I’d like from you', [
            'Give me ONE hint that moves me forward, then stop and wait.',
            'Ask me what I think the next step is.',
            'Only give me the full answer if I ask for it directly, or if I’ve tried three times and I’m still stuck.',
          ]),
        ]),
      }
    }

    case 'quiz': {
      const topics = [snap.currentSkill?.name, ...snap.completedSkills].filter(Boolean)
      return {
        kind,
        title: 'Quiz me',
        includes: ['Skills you’ve completed', 'Your current skill'],
        text: assemble([
          `${who}I'd like you to quiz me on what I've been learning.`,
          section('## What I’ve been learning', [
            topics.length > 0 ? topics.join(', ') : 'General fundamentals for my direction',
            snap.primaryPath ? `In the context of a ${snap.primaryPath} role` : null,
          ]),
          section('## How I’d like the quiz to work', [
            'Ask me ONE question at a time and wait for my answer.',
            'Start easy and get harder based on how I do.',
            'After each answer, tell me briefly what I got right and what I missed.',
            'If I get something wrong, ask a follow-up that helps me see why rather than just correcting me.',
            'Keep it to about 10 questions unless I say otherwise.',
          ]),
        ]),
      }
    }

    case 'review_project': {
      const project = snap.project
      return {
        kind,
        title: 'Review my project',
        includes: ['Your current project', 'Its progress', 'Skills it practises'],
        text: assemble([
          `${who}I'd like honest feedback on a project I'm building.`,
          whereIAm(snap, { project: true }),
          section('## The project', [
            project ? `Title: ${project.title}` : null,
            project ? `Progress: ${project.done} of ${project.total} steps done` : null,
            project?.nextMilestone ? `Next step: ${project.nextMilestone}` : null,
            '<< Paste your README, code, or a description of what you built here. >>',
          ]),
          section('## What I’d like from you', [
            'Tell me what is genuinely strong about it.',
            'Tell me what is weak, specifically, and why it matters.',
            'Give me the two or three changes that would most improve it.',
            'Be honest rather than encouraging — I would rather hear it from you than from an interviewer.',
            'Then tell me how someone reviewing this for an entry-level role would read it.',
          ]),
        ]),
      }
    }

    case 'interview': {
      const focus = [snap.currentSkill?.name, ...snap.completedSkills.slice(0, 4)].filter(Boolean)
      return {
        kind,
        title: 'Interview me',
        includes: ['Your direction', 'Skills you’re learning', 'Your interview progress'],
        text: assemble([
          `${who}I'd like you to interview me for a ${snap.primaryPath ?? 'technical'} role.`,
          whereIAm(snap),
          snap.interview
            ? section('## A question I’ve been practising', [
                `${snap.interview.track}: ${snap.interview.question}`,
              ])
            : null,
          section('## How I’d like it to work', [
            focus.length > 0 ? `Focus on: ${focus.join(', ')}` : null,
            'Ask me ONE question at a time and wait for my answer — like a real interview.',
            'Ask at least one follow-up to each answer, especially if I was vague.',
            'Include a behavioural question as well as technical ones.',
            'At the end, tell me honestly where I was weakest and what to practise.',
            'Please be realistic about the level — I am applying for entry-level roles.',
          ]),
        ]),
      }
    }

    case 'career_reflection': {
      return {
        kind,
        title: 'Is this direction right for me?',
        includes: [
          'Directions you’re exploring',
          'Experiments you rated',
          'Your career signals',
          'Skills you’ve covered',
        ],
        text: assemble([
          `${who}I'm trying to work out whether ${snap.primaryPath ?? 'the direction I’m exploring'} is actually a good fit for me, and I'd like you to help me think it through.`,
          whereIAm(snap, { signals: true }),
          snap.experiments.length > 0
            ? section(
                '## Small experiments I tried, and how they felt (1–5)',
                snap.experiments.map(
                  (experiment) =>
                    `"${experiment.title}" — enjoyment ${experiment.enjoyment}/5, would want more of this ${experiment.wantMore}/5`,
                ),
              )
            : null,
          section('## What I’d like from you', [
            'Ask me questions before giving me an opinion — at least three.',
            'Then tell me honestly what my ratings suggest, including anything that points away from this direction.',
            'Name what would be worth testing next to find out more.',
            'Please do not tell me to simply follow my passion. I need something practical.',
          ]),
        ]),
      }
    }

    case 'next_step': {
      return {
        kind,
        title: 'Help me pick what to do next',
        includes: ['Your direction', 'Current skill', 'Open project', 'Energy today'],
        text: assemble([
          `${who}I'd like help choosing ONE realistic thing to do next.`,
          whereIAm(snap, { project: true }),
          section('## Today', [
            snap.energy ? `My energy today: ${snap.energy}` : null,
            snap.project?.nextMilestone
              ? `My project's next step: ${snap.project.nextMilestone}`
              : null,
            snap.interview ? `An interview question I've left half-finished: ${snap.interview.question}` : null,
          ]),
          section('## What I’d like from you', [
            'Suggest ONE thing, not a list.',
            'Make it something I could genuinely finish today given my energy.',
            'Tell me briefly why that one and not the others.',
            'Do not give me a plan for the week. Just the next thing.',
          ]),
        ]),
      }
    }

    case 'low_energy': {
      return {
        kind,
        title: 'I’m low on energy today',
        includes: ['Your current skill', 'Open project', 'Energy today'],
        text: assemble([
          `${who}I'm low on energy today but I don't want to lose momentum entirely.`,
          whereIAm(snap, { project: true }),
          section('## What I’d like from you', [
            'Suggest ONE small thing — something that would take 15 to 20 minutes at most.',
            'It should be genuinely useful, not busywork.',
            'Please do not suggest a plan, a list, or a way to "make up" for a slow day.',
            'If your honest answer is that I should rest instead, say that.',
          ]),
        ]),
      }
    }
  }
}

/** Deep links. These only open the site — nothing is transmitted (§25). */
export const aiTools = [
  { id: 'chatgpt' as const, label: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'claude' as const, label: 'Claude', url: 'https://claude.ai/new' },
]
