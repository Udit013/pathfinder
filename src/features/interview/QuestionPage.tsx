import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Mic, Timer } from 'lucide-react'
import type { InterviewTrack, PrepStage } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { TextArea } from '@/ui/Field'
import { EmptyState } from '@/ui/States'
import { questionById, questionsForTrack } from '@/data/interviewQuestions'
import { stageIndex, stages, trackById } from '@/data/interviewTracks'
import { nextStage } from '@/domain/interview'
import { useAppStore } from '@/lib/store/useAppStore'
import { useInterviewPrep } from '@/lib/store/selectors'
import { cn } from '@/lib/utils'

/**
 * One question, worked up the ladder (§19).
 *
 * The design constraint: "what good looks like" stays hidden until asked for.
 * Showing it immediately turns the page into something to read, and reading is
 * exactly what fails in a real interview.
 */
export function QuestionPage() {
  const { trackId = '', questionId = '' } = useParams()
  const question = questionById(questionId)
  const meta = trackById(trackId as InterviewTrack)
  const prep = useInterviewPrep()

  const setQuestionStage = useAppStore((state) => state.setQuestionStage)
  const setQuestionNote = useAppStore((state) => state.setQuestionNote)

  const entry = prep.find((item) => item.questionId === questionId)
  const stage = entry?.stage ?? null

  const [revealed, setRevealed] = useState(false)
  const [note, setNote] = useState(entry?.note ?? '')

  if (!question || !meta) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="We don’t have that question."
          action={<ButtonLink to="/interview">Back to Interview prep</ButtonLink>}
        />
      </div>
    )
  }

  const advance = (to: PrepStage) =>
    setQuestionStage({
      questionId: question.id,
      stage: to,
      trackId: meta.id,
      trackTitle: meta.title,
      prompt: question.prompt,
      skillIds: question.skillIds,
    })

  const siblings = questionsForTrack(question.track)
  const index = siblings.findIndex((item) => item.id === question.id)
  const nextQuestion = siblings[index + 1] ?? null
  const upNext = stage ? nextStage(stage) : 'understand'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
      <Link
        to={`/interview/${meta.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {meta.title}
      </Link>

      <header className="animate-rise">
        <Badge tone="neutral">{question.difficulty}</Badge>
        <h1 className="font-display mt-3 text-xl leading-snug text-ink sm:text-2xl">
          {question.prompt}
        </h1>
      </header>

      {/* Try it first. This card comes before any guidance, deliberately. */}
      <Card tone="accent" className="p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-accent-ink">
          <Mic className="size-4" aria-hidden />
          Answer it out loud first
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-accent-ink/85">
          Before reading anything below. Even a bad attempt out loud teaches you more than a good
          answer you read — you find out where you stall, which is the thing you can then fix.
        </p>
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-accent-ink/70">
          <Timer className="size-3" aria-hidden />
          Give it about two minutes.
        </p>
      </Card>

      {/* Guidance, hidden until asked for */}
      <section>
        <SectionHeading title="What a good answer covers" />
        {revealed ? (
          <Card className="animate-rise p-5">
            <ul className="space-y-2">
              {question.whatGoodLooksLike.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-sunken p-3 text-xs leading-relaxed text-ink-faint">
              These are things to reason about, not a script. An answer that sounds recited is worse
              than one that sounds like thinking.
            </p>
            <Button variant="ghost" size="sm" className="mt-2 -ml-1.5" onClick={() => setRevealed(false)}>
              <EyeOff className="size-3.5" aria-hidden />
              Hide it again
            </Button>
          </Card>
        ) : (
          <Card tone="sunken" className="p-5 text-center">
            <p className="text-sm text-ink-soft">Have a go before you look.</p>
            <Button variant="secondary" className="mt-3" onClick={() => setRevealed(true)}>
              <Eye className="size-4" aria-hidden />
              Show me what to cover
            </Button>
          </Card>
        )}
      </section>

      {question.followUps.length > 0 && revealed ? (
        <section className="animate-rise">
          <SectionHeading
            title="Follow-ups to expect"
            hint="This is where memorised answers fall apart. Practise these too."
          />
          <Card className="p-5">
            <ul className="space-y-2">
              {question.followUps.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-spark" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}

      {/* The ladder */}
      <section>
        <SectionHeading
          title="Where are you with this?"
          hint="Move it up when it's true. Nobody is checking, and there's no penalty for moving it back."
        />
        <Card className="p-4">
          <div className="space-y-1.5">
            {stages.map((entryStage) => {
              const reached = stage ? stageIndex(stage) >= stageIndex(entryStage.id) : false
              const isCurrent = stage === entryStage.id
              return (
                <button
                  key={entryStage.id}
                  type="button"
                  onClick={() => advance(entryStage.id)}
                  aria-pressed={isCurrent}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-150 active:scale-[0.99]',
                    isCurrent
                      ? 'border-accent bg-accent-soft'
                      : reached
                        ? 'border-transparent bg-positive-soft'
                        : 'border-line bg-surface hover:border-line-strong',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                      reached ? 'bg-positive text-white' : 'bg-sunken text-ink-faint',
                    )}
                  >
                    {reached ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        isCurrent ? 'text-accent-ink' : reached ? 'text-positive-ink' : 'text-ink',
                      )}
                    >
                      {entryStage.label}
                    </span>
                    <span className="block text-xs leading-relaxed text-ink-soft">
                      {entryStage.meaning}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {upNext ? (
            <Button className="mt-3" fullWidth onClick={() => advance(upNext)}>
              {stage ? `Move up to ${stages.find((s) => s.id === upNext)?.label}` : 'I’ve read it'}
            </Button>
          ) : (
            <p className="mt-3 text-center text-sm font-medium text-positive-ink">
              Interview-ready. That&rsquo;s the top of the ladder.
            </p>
          )}
        </Card>
      </section>

      {/* Personal note */}
      <section>
        <SectionHeading title="Your own notes" hint="The story you'd actually tell, or what you keep forgetting." />
        <TextArea
          label="Notes"
          value={note}
          rows={3}
          onChange={(event) => setNote(event.target.value)}
          onBlur={() => setQuestionNote({ questionId: question.id, note })}
          placeholder="e.g. Use the pipeline project for this one. Remember to say what I'd do differently."
        />
      </section>

      {nextQuestion ? (
        <ButtonLink to={`/interview/${meta.id}/${nextQuestion.id}`} variant="secondary" fullWidth>
          Next question
          <ArrowRight className="size-4" aria-hidden />
        </ButtonLink>
      ) : (
        <ButtonLink to={`/interview/${meta.id}`} variant="secondary" fullWidth>
          Back to {meta.title}
        </ButtonLink>
      )}
    </div>
  )
}
