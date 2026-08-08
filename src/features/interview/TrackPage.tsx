import { Link, useParams } from 'react-router'
import { ArrowRight, Check, Info } from 'lucide-react'
import type { InterviewTrack, PrepStage } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { BackLink } from '@/ui/BackLink'
import { Badge } from '@/ui/Badge'
import { ButtonLink } from '@/ui/Button'
import { ProgressBar } from '@/ui/Progress'
import { EmptyState } from '@/ui/States'
import { FreeResources } from '@/ui/ResourceLinks'
import { trackById, stageIndex, stageMeta } from '@/data/interviewTracks'
import { resourcesByIds, resourcesForSkills } from '@/data/resources'
import { skillName } from '@/data/skills'
import { useInterviewTracks, useInterviewPrep } from '@/lib/store/selectors'
import { cn } from '@/lib/utils'

/** One interview topic: its questions, ordered, with where you got to on each. */
export function TrackPage() {
  const { trackId = '' } = useParams()
  const meta = trackById(trackId as InterviewTrack)
  const tracks = useInterviewTracks()
  const prep = useInterviewPrep()

  const progress = tracks.find((track) => track.track.id === trackId)

  if (!meta || !progress) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="We don’t have a topic with that name."
          action={<ButtonLink to="/interview">Back to Interview prep</ButtonLink>}
        />
      </div>
    )
  }

  const resources = (() => {
    const chosen = resourcesByIds(meta.resourceIds)
    const seen = new Set(chosen.map((resource) => resource.id))
    return [
      ...chosen,
      ...resourcesForSkills(meta.skillIds, 4).filter((resource) => !seen.has(resource.id)),
    ].slice(0, 4)
  })()

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pt-2">
      <BackLink to="/interview">Interview prep</BackLink>

      <header className="animate-rise">
        <h1 className="font-display text-2xl leading-tight text-ink">{meta.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{meta.whyItMatters}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {meta.skillIds.map((skillId) => (
            <Link key={skillId} to="/roadmap" className="inline-flex min-h-8 items-center">
              <Badge tone="neutral">{skillName(skillId)}</Badge>
            </Link>
          ))}
        </div>

        <ProgressBar
          value={progress.fraction}
          label={`${meta.title} progress`}
          tone={progress.complete ? 'positive' : 'accent'}
          className="mt-4"
        />
        <p className="mt-2 text-xs text-ink-faint">
          {progress.readyCount} of {progress.total} interview-ready.
          {progress.complete ? ' This topic is in good shape.' : ' Nothing here is a test.'}
        </p>
      </header>

      <Card tone="sunken" className="flex gap-2.5 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
        <div>
          <p className="text-sm font-medium text-ink">How this usually shows up</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{meta.formatNote}</p>
        </div>
      </Card>

      <section>
        <SectionHeading title="Questions" hint="Work through them in any order." />
        <div className="stagger space-y-2.5">
          {progress.questions.map((question) => {
            const entry = prep.find((item) => item.questionId === question.id)
            const stage = entry?.stage ?? null
            const ready = stage ? stageIndex(stage) >= stageIndex('explain') : false

            return (
              <Card key={question.id} className={cn('lift p-4', ready && 'bg-positive-soft')}>
                <Link to={`/interview/${meta.id}/${question.id}`} className="block">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold',
                        ready
                          ? 'bg-positive text-white'
                          : stage
                            ? 'bg-accent-soft text-accent-ink'
                            : 'bg-sunken text-ink-faint',
                      )}
                    >
                      {ready ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : stage ? (
                        stageIndex(stage) + 1
                      ) : (
                        '–'
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug font-medium text-ink">{question.prompt}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone="neutral">{question.difficulty}</Badge>
                        {stage ? (
                          <Badge tone={ready ? 'positive' : 'accent'}>
                            {stageMeta(stage as PrepStage).label}
                          </Badge>
                        ) : (
                          <span className="text-xs text-ink-faint">Not started</span>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      <FreeResources
        resources={resources}
        title="Free practice for this topic"
        hint="Opens in a new tab. Working through real questions beats reading about them."
      />
    </div>
  )
}
