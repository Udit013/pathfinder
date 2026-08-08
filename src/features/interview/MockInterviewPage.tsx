import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Mic, RefreshCw, Timer } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button, ButtonLink } from '@/ui/Button'
import { ProgressBar } from '@/ui/Progress'
import { ConfettiDoodle } from '@/ui/Doodles'
import { EmptyState } from '@/ui/States'
import { trackTitle } from '@/data/interviewTracks'
import { buildMockInterview } from '@/domain/interview'
import { useAppStore } from '@/lib/store/useAppStore'
import { useInterviewTracks } from '@/lib/store/selectors'

/**
 * Mock interview (§19).
 *
 * One question at a time, no guidance visible, no going back. The discomfort is
 * the feature — answering cold is a different skill from answering prepared, and
 * it is the one the real thing tests.
 *
 * There is no grading. Afterwards you mark which ones felt shaky, and those are
 * what you go and work on.
 */
export function MockInterviewPage() {
  const tracks = useInterviewTracks()
  const setQuestionStage = useAppStore((state) => state.setQuestionStage)

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000))
  const [index, setIndex] = useState(0)
  const [shaky, setShaky] = useState<Set<string>>(new Set())
  const [finished, setFinished] = useState(false)

  const questions = useMemo(
    () => buildMockInterview({ ranked: tracks, count: 5, seed }),
    [tracks, seed],
  )

  const restart = () => {
    setSeed(Math.floor(Math.random() * 1000))
    setIndex(0)
    setShaky(new Set())
    setFinished(false)
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl pt-2">
        <EmptyState
          title="Nothing to ask you yet."
          body="Pick a direction on Explore and the mock interview will draw from the topics that matter for it."
          action={<ButtonLink to="/explore">Choose a direction</ButtonLink>}
        />
      </div>
    )
  }

  const question = questions[index]

  // ── Finished ───────────────────────────────────────────────────────────────
  if (finished || !question) {
    const shakyQuestions = questions.filter((item) => shaky.has(item.id))

    return (
      <div className="mx-auto w-full max-w-3xl space-y-7 pt-2">
        <Link
          to="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Interview prep
        </Link>

        <Card tone="spark" className="animate-rise p-6 text-center">
          <ConfettiDoodle className="mx-auto size-12" />
          <p className="font-display mt-1 text-xl text-spark-ink">That&rsquo;s the whole set.</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-spark-ink/85">
            You just answered five questions cold. That is genuinely harder than the real thing,
            where you get a warm-up and a human being being kind to you.
          </p>
        </Card>

        {shakyQuestions.length > 0 ? (
          <section>
            <SectionHeading
              title="What felt shaky"
              hint="Not a score. Just the useful part — these are what to go and work on."
            />
            <div className="space-y-2">
              {shakyQuestions.map((item) => (
                <Card key={item.id} className="lift p-4">
                  <Link to={`/interview/${item.track}/${item.id}`} className="flex items-start gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{item.prompt}</span>
                      <span className="mt-1 block text-xs text-ink-faint">
                        {trackTitle(item.track)}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden />
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <Card tone="sunken" className="p-5 text-center">
            <p className="text-sm text-ink-soft">
              You didn&rsquo;t flag any as shaky. Either that went well, or you were being generous
              with yourself — both are fine.
            </p>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={restart}>
            <RefreshCw className="size-4" aria-hidden />
            Another set
          </Button>
          <ButtonLink to="/interview" variant="secondary">
            Back to topics
          </ButtonLink>
        </div>
      </div>
    )
  }

  // ── In progress ────────────────────────────────────────────────────────────
  const isLast = index === questions.length - 1

  const advance = (wasShaky: boolean) => {
    if (wasShaky) {
      setShaky((current) => new Set(current).add(question.id))
    } else {
      // Answering cleanly under mock conditions is real evidence — record it,
      // but never downgrade someone who was already further along.
      setQuestionStage({
        questionId: question.id,
        stage: 'explain',
        trackId: question.track,
        trackTitle: trackTitle(question.track),
        prompt: question.prompt,
        skillIds: question.skillIds,
      })
    }
    if (isLast) setFinished(true)
    else setIndex(index + 1)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-2">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Leave
        </Link>
        <span className="text-xs tabular-nums text-ink-faint">
          {index + 1} of {questions.length}
        </span>
      </div>

      <ProgressBar value={(index + 1) / questions.length} label="Mock interview progress" />

      <Card elevated className="animate-rise p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">
            <Mic className="size-3" aria-hidden />
            {trackTitle(question.track)}
          </Badge>
          <Badge tone="neutral">{question.difficulty}</Badge>
        </div>

        <p className="font-display mt-4 text-xl leading-snug text-ink sm:text-2xl">
          {question.prompt}
        </p>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-faint">
          <Timer className="size-3" aria-hidden />
          Answer out loud. No notes, no looking anything up.
        </p>
      </Card>

      <div className="space-y-2">
        <p className="text-center text-sm text-ink-soft">How did that one go?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => advance(true)}>
            That felt shaky
          </Button>
          <Button onClick={() => advance(false)}>
            <Check className="size-4" aria-hidden />
            That went fine
          </Button>
        </div>
        <p className="text-center text-xs text-ink-faint">
          Nothing is scored. This only decides what gets suggested next.
        </p>
      </div>
    </div>
  )
}
