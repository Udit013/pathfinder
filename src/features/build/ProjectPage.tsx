import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Clock,
  FileText,
  Play,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react'
import type { ProjectInstance, ProjectTemplate } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { ProgressBar } from '@/ui/Progress'
import { EmptyState } from '@/ui/States'
import { TextInput } from '@/ui/Field'
import { FreeResources } from '@/ui/ResourceLinks'
import { ConfettiDoodle } from '@/ui/Doodles'
import { projectTemplateById, projectTemplates } from '@/data/projects'
import { resourcesByIds, resourcesForSkills } from '@/data/resources'
import { datasetById } from '@/data/datasets'
import { skillName } from '@/data/skills'
import { pathTitle } from '@/data/careerPaths'
import { cheerFor, projectProgress } from '@/domain/projects'
import { useAppStore } from '@/lib/store/useAppStore'
import { useProject, useProjectForTemplate } from '@/lib/store/selectors'
import { DatasetViewer } from '@/features/explore/DatasetViewer'
import { cn } from '@/lib/utils'

/**
 * A project, whether being browsed or being built (§16).
 *
 * One page for both, because the difference is only whether an instance exists.
 * Splitting them would mean maintaining the same content twice.
 */
export function ProjectPage() {
  const { projectId, templateId } = useParams()

  const instanceById = useProject(projectId ?? '')
  const template = templateId
    ? projectTemplateById(templateId)
    : instanceById?.templateId
      ? projectTemplateById(instanceById.templateId)
      : undefined
  const instanceForTemplate = useProjectForTemplate(template?.id ?? '')
  const instance = instanceById ?? instanceForTemplate

  if (!template) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="We don’t have a project with that name."
          action={<ButtonLink to="/build">Back to Build</ButtonLink>}
        />
      </div>
    )
  }

  return <ProjectView template={template} instance={instance ?? null} />
}

function ProjectView({
  template,
  instance,
}: {
  template: ProjectTemplate
  instance: ProjectInstance | null
}) {
  const navigate = useNavigate()
  const startProject = useAppStore((state) => state.startProject)
  const toggleMilestone = useAppStore((state) => state.toggleMilestone)
  const updateProject = useAppStore((state) => state.updateProject)
  const removeProject = useAppStore((state) => state.removeProject)

  const [repoUrl, setRepoUrl] = useState(instance?.repoUrl ?? '')
  const [confirmRemove, setConfirmRemove] = useState(false)

  const progress = projectProgress(
    instance ?? { id: '', templateId: template.id, startedAt: '', completedAt: null, milestones: [] },
    template,
  )

  const dataset = template.datasetId ? datasetById(template.datasetId) : undefined
  const resources = (() => {
    const chosen = resourcesByIds(template.resourceIds)
    const seen = new Set(chosen.map((resource) => resource.id))
    return [
      ...chosen,
      ...resourcesForSkills(template.skillIds, 4).filter((resource) => !seen.has(resource.id)),
    ].slice(0, 4)
  })()

  const begin = () => {
    const id = startProject({
      templateId: template.id,
      title: template.title,
      milestoneIds: template.milestones.map((milestone) => milestone.id),
      careerPathIds: template.careerPathIds,
      skillIds: template.skillIds,
    })
    navigate(`/build/${id}`, { replace: true })
  }

  const firstMilestone = template.milestones[0]

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pt-2">
      <Link
        to="/build"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Build
      </Link>

      <header className="animate-rise">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">
            <Clock className="size-3" aria-hidden />~{template.estimatedHours} hours
          </Badge>
          <Badge tone="neutral">{template.difficulty}</Badge>
          {instance?.completedAt ? <Badge tone="positive">Finished</Badge> : null}
        </div>

        <h1 className="font-display mt-3 text-2xl leading-tight text-ink sm:text-3xl">
          {template.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{template.whatYouWillBuild}</p>
        <p className="mt-2 text-xs text-ink-faint">
          Good for: {template.careerPathIds.map(pathTitle).join(' · ')}
        </p>
      </header>

      {/* Finished state — celebrate properly, once. */}
      {instance?.completedAt ? (
        <Card tone="spark" className="animate-rise relative overflow-hidden p-5 text-center">
          <ConfettiDoodle className="mx-auto size-12" />
          <p className="font-display mt-1 text-xl text-spark-ink">You finished it.</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-spark-ink/85">
            That is a real thing that exists because you made it. Most people never get here — the
            gap between started and finished is where almost everyone stops.
          </p>
        </Card>
      ) : null}

      {/* Why it matters */}
      <section>
        <SectionHeading title="Why this one" />
        <Card className="space-y-3 p-5">
          <p className="text-sm leading-relaxed text-ink-soft">{template.problem}</p>
          <p className="text-sm leading-relaxed text-ink-soft">{template.whyItMatters}</p>
        </Card>
      </section>

      {/* Skills practised */}
      <section>
        <SectionHeading title="What you'll practise" />
        <Card className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {template.skillIds.map((skillId) => (
              <Link key={skillId} to="/roadmap">
                <Badge tone="accent">{skillName(skillId)}</Badge>
              </Link>
            ))}
          </div>
          <ul className="mt-3.5 space-y-1.5">
            {template.skillsDemonstrated.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Start here / milestones */}
      {!instance ? (
        <Card tone="accent" elevated className="p-5">
          <p className="text-xs tracking-[0.14em] text-accent-ink/70 uppercase">Start here</p>
          <p className="font-display mt-1.5 text-lg leading-snug text-accent-ink">
            {firstMilestone?.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-accent-ink/85">
            {firstMilestone?.detail}
          </p>
          <p className="mt-2.5 text-xs text-accent-ink/75">
            About {firstMilestone?.estimatedHours} hour
            {firstMilestone && firstMilestone.estimatedHours === 1 ? '' : 's'}. You&rsquo;ll have:{' '}
            {firstMilestone?.youWillHave}
          </p>
          <Button size="lg" className="mt-4" onClick={begin}>
            <Play className="size-4" aria-hidden />
            Start this project
          </Button>
        </Card>
      ) : (
        <section>
          <SectionHeading
            title="Steps"
            hint="Each one ends in something that exists. Tick them off as you go."
            action={
              <span className="text-xs tabular-nums text-ink-faint">
                {progress.done} of {progress.total}
              </span>
            }
          />
          <ProgressBar
            value={progress.fraction}
            label="Project progress"
            tone="positive"
            className="mb-3"
          />

          <div className="space-y-2.5">
            {template.milestones.map((milestone, index) => {
              const state = instance.milestones.find(
                (entry) => entry.milestoneId === milestone.id,
              )?.state
              const done = state === 'done'
              const isNext = progress.nextMilestoneId === milestone.id

              return (
                <Card
                  key={milestone.id}
                  className={cn(
                    'p-4 transition-colors',
                    done && 'bg-positive-soft',
                    isNext && !done && 'border-accent shadow-xs',
                  )}
                >
                  <div className="flex gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={done}
                      aria-label={`Mark "${milestone.title}" as done`}
                      onClick={() =>
                        toggleMilestone({
                          projectId: instance.id,
                          milestoneId: milestone.id,
                          milestoneTitle: milestone.title,
                          projectTitle: template.title,
                          totalMilestones: template.milestones.length,
                          careerPathIds: template.careerPathIds,
                          skillIds: template.skillIds,
                        })
                      }
                      className={cn(
                        'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-150 active:scale-90',
                        done
                          ? 'border-positive bg-positive text-white'
                          : 'border-line-strong bg-surface hover:border-accent',
                      )}
                    >
                      {done ? (
                        <Check className="animate-check size-3.5" strokeWidth={3} aria-hidden />
                      ) : null}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            done ? 'text-positive-ink' : 'text-ink',
                          )}
                        >
                          <span className="text-ink-faint">{index + 1}. </span>
                          {milestone.title}
                        </p>
                        {isNext && !done ? <Badge tone="accent">Next</Badge> : null}
                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {milestone.detail}
                      </p>

                      <p className="mt-1.5 text-xs text-ink-faint">
                        ~{milestone.estimatedHours}h · You&rsquo;ll have: {milestone.youWillHave}
                      </p>

                      {done ? (
                        <p className="animate-rise mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-positive-ink">
                          <Sparkles className="size-3" aria-hidden />
                          {cheerFor(index)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Data + resources */}
      {dataset ? (
        <section>
          <SectionHeading title="Data to use" hint="Already here — nothing to hunt down." />
          <DatasetViewer dataset={dataset} />
        </section>
      ) : template.datasetSuggestion ? (
        <Card tone="sunken" className="p-4">
          <p className="text-sm font-medium text-ink">Data</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{template.datasetSuggestion}</p>
        </Card>
      ) : null}

      <FreeResources
        resources={resources}
        title="Free resources for this build"
        hint="Opens in a new tab. Looking things up mid-project is the job, not cheating."
      />

      {/* Outcome */}
      <section>
        <SectionHeading title="What you'll have at the end" />
        <Card tone="sunken" className="p-5">
          <p className="flex gap-2.5 text-sm leading-relaxed text-ink">
            <Target className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            {template.outcome}
          </p>
          <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
            {template.deliverables.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-ink-soft">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* README checklist */}
      <section>
        <SectionHeading
          title="README checklist"
          hint="The README is what most people will actually read. Treat it as the deliverable."
        />
        <Card className="p-5">
          <ul className="space-y-2">
            {template.readmeChecklist.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <ClipboardList className="mt-0.5 size-3.5 shrink-0 text-ink-faint" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Resume guidance */}
      <section>
        <SectionHeading
          title="Putting it on your resume"
          hint="Guidance on the shape of an honest bullet — not a line to copy."
        />
        <Card className="p-5">
          <ul className="space-y-3">
            {template.resumeBulletGuidance.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <FileText className="mt-0.5 size-3.5 shrink-0 text-ink-faint" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-caution-soft p-3 text-xs leading-relaxed text-caution-ink">
            Never claim a business outcome a personal project did not have. Interviewers ask a
            follow-up question, and an inflated bullet costs you more than a modest one ever would.
          </p>
        </Card>
      </section>

      <section>
        <SectionHeading title="Showing it off" />
        <Card className="p-5">
          <ul className="space-y-2">
            {template.portfolioPresentation.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-spark" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Where it lives + housekeeping */}
      {instance ? (
        <section>
          <SectionHeading title="Where it lives" />
          <Card className="space-y-4 p-5">
            <TextInput
              label="Repository or live link"
              hint="So future you can find it when a recruiter asks."
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              onBlur={() => updateProject({ projectId: instance.id, patch: { repoUrl } })}
              placeholder="https://github.com/…"
            />

            <div className="border-t border-line pt-4">
              {confirmRemove ? (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-ink-soft">
                    Remove this project? Everything you already earned stays.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      removeProject(instance.id)
                      navigate('/build')
                    }}
                  >
                    Remove
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(false)}>
                    Keep it
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="-ml-1.5" onClick={() => setConfirmRemove(true)}>
                  <Trash2 className="size-3.5" aria-hidden />
                  Put this one down
                </Button>
              )}
              <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">
                Stopping a project is a decision, not a failure. Your XP, wins, and signals all stay
                exactly as they are.
              </p>
            </div>
          </Card>
        </section>
      ) : null}

      {/* Other projects, kept small */}
      <section>
        <SectionHeading title="Other projects" />
        <div className="flex flex-wrap gap-2">
          {projectTemplates
            .filter((other) => other.id !== template.id)
            .slice(0, 5)
            .map((other) => (
              <Link
                key={other.id}
                to={`/build/library/${other.id}`}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                {other.title}
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
