import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Clock, Hammer, Info, Lock, Target, X } from 'lucide-react'
import type { ResolvedNode } from '@/domain/roadmap'
import { importanceExplanations, importanceLabels } from '@/domain/roadmap'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { AskAiButton } from '@/features/ai/AskAiButton'
import { TextArea } from '@/ui/Field'
import { FreeResources } from '@/ui/ResourceLinks'
import { resourcesByIds, resourcesForSkill } from '@/data/resources'
import { skillName } from '@/data/skills'
import { projectTemplates } from '@/data/projects'
import { useAppStore } from '@/lib/store/useAppStore'
import { useSkillProgress } from '@/lib/store/selectors'
import { cn } from '@/lib/utils'

/**
 * The detail panel for a skill (§13).
 *
 * Everything §13 asks for: why it matters, estimated time, difficulty,
 * prerequisites, free resources, a practice task, and its state. The resources
 * are the reason this exists — the whole point is that "learn SQL joins" comes
 * with somewhere to actually go.
 */
export function SkillDetail({
  entry,
  careerPathId,
  onClose,
}: {
  entry: ResolvedNode
  careerPathId: string
  onClose: () => void
}) {
  const { node, state, skill, missingPrerequisites } = entry
  const progress = useSkillProgress(node.skillId)
  const setSkillState = useAppStore((store) => store.setSkillState)
  const setSkillNote = useAppStore((store) => store.setSkillNote)
  const toggleSkillResource = useAppStore((store) => store.toggleSkillResource)

  const [note, setNote] = useState(progress?.note ?? '')
  const [noteOpen, setNoteOpen] = useState(Boolean(progress?.note))

  if (!skill) return null

  // Explicit picks lead, then anything else tagged for this skill.
  const pinned = resourcesByIds(skill.resourceIds)
  const seen = new Set(pinned.map((resource) => resource.id))
  const resources = [
    ...pinned,
    ...resourcesForSkill(skill.id, 6).filter((resource) => !seen.has(resource.id)),
  ].slice(0, 4)

  const done = progress?.completedResourceIds ?? []

  // Projects that practise this skill — at most two, so it stays a nudge.
  const relatedProjects = projectTemplates
    .filter((project) => project.skillIds.includes(skill.id))
    .slice(0, 2)

  return (
    <div className="animate-rise">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl leading-snug text-ink">{skill.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone={node.importance === 'core' ? 'accent' : 'neutral'}>
              {importanceLabels[node.importance]}
            </Badge>
            <Badge tone="neutral">
              <Clock className="size-3" aria-hidden />~{skill.estimatedHours} hours
            </Badge>
            <Badge tone="neutral">{skill.difficulty}</Badge>
            {state === 'completed' ? <Badge tone="positive">Done</Badge> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close skill detail"
          className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-sunken hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{skill.whyItMatters}</p>

      <p className="mt-2.5 flex gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Info className="mt-0.5 size-3 shrink-0" aria-hidden />
        <span>{importanceExplanations[node.importance]}</span>
      </p>

      {/* Prerequisites — framed as "easier after", never as a barrier. */}
      {missingPrerequisites.length > 0 ? (
        <div className="mt-4 rounded-xl border border-line bg-sunken p-3.5">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Lock className="size-3.5 text-ink-faint" aria-hidden />
            Easier after {missingPrerequisites.map(skillName).join(' and ')}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Not a rule. If you already know this from somewhere else, start it now — nothing is
            stopping you.
          </p>
        </div>
      ) : null}

      {/* State controls */}
      <div className="mt-4 flex flex-wrap gap-2">
        {state !== 'in_progress' && state !== 'completed' ? (
          <Button
            onClick={() =>
              setSkillState({
                skillId: skill.id,
                name: skill.name,
                state: 'in_progress',
                careerPathIds: [careerPathId],
              })
            }
          >
            Start this
          </Button>
        ) : null}

        {state !== 'completed' ? (
          <Button
            variant={state === 'in_progress' ? 'primary' : 'secondary'}
            onClick={() =>
              setSkillState({
                skillId: skill.id,
                name: skill.name,
                state: 'completed',
                careerPathIds: [careerPathId],
              })
            }
          >
            <Check className="size-4" aria-hidden />
            Mark as learned
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() =>
              setSkillState({
                skillId: skill.id,
                name: skill.name,
                state: 'in_progress',
                careerPathIds: [careerPathId],
              })
            }
          >
            Back to in progress
          </Button>
        )}
      </div>

      {state === 'completed' ? (
        <p className="mt-2 text-xs text-ink-faint">
          Going back to revise costs you nothing — the XP stays either way.
        </p>
      ) : null}

      {/* Practice task */}
      <div className="mt-5 rounded-xl border border-line bg-surface p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <Target className="size-4 text-accent" aria-hidden />
          One task to know it stuck
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{skill.practiceTask}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <AskAiButton kind="learn_skill" label="Teach me this" />
          <AskAiButton kind="hint" label="I'm stuck" variant="ghost" />
        </div>
      </div>

      {/* Resources — the reason this panel exists */}
      <div className="mt-5">
        {resources.length > 0 ? (
          <>
            <FreeResources
              bare
              resources={resources}
              title="Free resources"
              hint="Everything you need for this skill. Opens in a new tab — no searching required."
            />
            <div className="mt-3 space-y-1.5">
              <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">
                Keep your place
              </p>
              {resources.map((resource) => (
                <label
                  key={resource.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft"
                >
                  <input
                    type="checkbox"
                    checked={done.includes(resource.id)}
                    onChange={() =>
                      toggleSkillResource({ skillId: skill.id, resourceId: resource.id })
                    }
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className={cn(done.includes(resource.id) && 'line-through opacity-60')}>
                    {resource.title}
                  </span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-card border border-dashed border-line p-4">
            <p className="text-sm font-medium text-ink">
              We haven&rsquo;t curated resources for this one yet.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              Rather than pad this out with links nobody checked, it&rsquo;s empty. The practice
              task above still works, and roadmap.sh is a reasonable place to look meanwhile.
            </p>
            <a
              href="https://roadmap.sh/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-block text-sm font-medium text-accent-ink hover:underline"
            >
              roadmap.sh ↗
            </a>
          </div>
        )}
      </div>

      {/* Skill → Project. Where a skill turns into evidence someone can look at. */}
      {relatedProjects.length > 0 ? (
        <div className="mt-5 rounded-card border border-line bg-spark-soft p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-spark-ink">
            <Hammer className="size-4" aria-hidden />
            Turn this into something you can show
          </p>
          <p className="mt-1 text-xs leading-relaxed text-spark-ink/80">
            Practising is good. A finished project is what someone else can actually look at.
          </p>
          <div className="mt-2.5 space-y-1.5">
            {relatedProjects.map((project) => (
              <Link
                key={project.id}
                to={`/build/library/${project.id}`}
                className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-ink transition-colors hover:text-accent-ink"
              >
                <span className="min-w-0 flex-1 truncate">{project.title}</span>
                <span className="shrink-0 text-xs text-ink-faint">~{project.estimatedHours}h</span>
                <ArrowRight className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Personal note */}
      <div className="mt-5">
        {noteOpen ? (
          <TextArea
            label="Where you got to"
            hint="For future you. One line is plenty."
            value={note}
            rows={2}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => setSkillNote({ skillId: skill.id, note })}
            placeholder="e.g. Joins make sense, window functions do not yet."
          />
        ) : (
          <Button variant="ghost" size="sm" className="-ml-1.5" onClick={() => setNoteOpen(true)}>
            Add a note
          </Button>
        )}
      </div>
    </div>
  )
}
