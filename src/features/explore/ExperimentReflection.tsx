import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { CareerExperiment, ExperimentRatings, Rating1to5 } from '@/types'
import { Card, SectionHeading } from '@/ui/Card'
import { Button } from '@/ui/Button'
import { TextArea } from '@/ui/Field'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'

/**
 * The reflection after an experiment (§11).
 *
 * This is the actual instrument of the product: the ratings here become the
 * evidence behind Career Signals (§12). So the questions are about the
 * experience, never about performance — there is no "how well did you do?",
 * because how well you did on your first attempt predicts nothing about fit.
 *
 * Difficulty is asked but deliberately excluded from the signal score. It's
 * shown back to the user separately, with the point made explicitly that hard
 * is not the same as wrong.
 */

interface Question {
  key: keyof ExperimentRatings
  question: string
  low: string
  high: string
  note?: string
}

const questions: Question[] = [
  {
    key: 'enjoyment',
    question: 'Did you enjoy it?',
    low: 'Not at all',
    high: 'A lot',
  },
  {
    key: 'curiosity',
    question: 'Did it make you curious to know more?',
    low: 'Not really',
    high: 'Very',
  },
  {
    key: 'difficulty',
    question: 'How hard did it feel?',
    low: 'Straightforward',
    high: 'Really hard',
    note: 'This one doesn’t count toward your signal. Difficulty usually fades; interest usually doesn’t.',
  },
  {
    key: 'wantMore',
    question: 'Would you want to do more of this kind of work?',
    low: 'No',
    high: 'Yes',
  },
  {
    key: 'professionally',
    question: 'Could you see yourself doing this professionally?',
    low: 'Can’t see it',
    high: 'Easily',
  },
]

export function ExperimentReflection({
  experiment,
  existing,
  existingReflection,
  onDone,
}: {
  experiment: CareerExperiment
  existing: ExperimentRatings | null
  existingReflection?: string
  onDone: () => void
}) {
  const completeExperiment = useAppStore((state) => state.completeExperiment)

  const [ratings, setRatings] = useState<Partial<ExperimentRatings>>(existing ?? {})
  const [note, setNote] = useState(existingReflection ?? '')
  const [saved, setSaved] = useState(existing !== null)

  const complete = questions.every((question) => ratings[question.key] !== undefined)

  const submit = () => {
    if (!complete) return
    completeExperiment({
      experimentId: experiment.id,
      title: experiment.title,
      careerPathIds: experiment.careerPathIds,
      ratings: ratings as ExperimentRatings,
      reflection: note,
    })
    setSaved(true)
    onDone()
  }

  return (
    <section>
      <SectionHeading
        title="How did that feel?"
        hint="There are no wrong answers here — this is evidence about you, not a test."
      />

      <Card className="p-5">
        <div className="space-y-5">
          {questions.map((question) => (
            <div key={question.key}>
              <p className="text-sm font-medium text-ink">{question.question}</p>
              <RatingScale
                label={question.question}
                value={ratings[question.key] ?? null}
                onChange={(value) =>
                  setRatings((current) => ({ ...current, [question.key]: value }))
                }
                low={question.low}
                high={question.high}
              />
              {question.note ? (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-faint">{question.note}</p>
              ) : null}
            </div>
          ))}

          <TextArea
            label="Anything you noticed?"
            hint="Optional, and one sentence is plenty. Future you will find this more useful than you expect."
            value={note}
            rows={3}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Lost track of time on the SQL part. Hated writing the summary."
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button onClick={submit} disabled={!complete}>
            {saved ? 'Update my answers' : 'Save reflection'}
          </Button>

          {saved ? (
            <p className="flex items-center gap-1.5 text-sm text-positive-ink">
              <Check className="size-4" aria-hidden />
              Saved. Another piece of the puzzle.
            </p>
          ) : !complete ? (
            <p className="text-xs text-ink-faint">Answer all five to save.</p>
          ) : null}
        </div>

        {saved ? (
          <div className="animate-rise mt-4 rounded-xl bg-sunken p-4">
            <p className="text-sm text-ink-soft">
              This is now part of your career signals — and you can see exactly how it counted.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              <Link
                to="/progress"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink hover:underline"
              >
                See your signals
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
              <Link
                to="/explore/lab"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
              >
                Try another experiment
              </Link>
            </div>
          </div>
        ) : null}
      </Card>
    </section>
  )
}

/**
 * A 1–5 scale. Rendered as a radiogroup with labelled ends, because a bare row
 * of numbers means nothing without knowing which direction is which.
 */
export function RatingScale({
  label,
  value,
  onChange,
  low,
  high,
}: {
  label: string
  value: Rating1to5 | null
  onChange: (value: Rating1to5) => void
  low: string
  high: string
}) {
  return (
    <div className="mt-2">
      <div className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {([1, 2, 3, 4, 5] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            aria-label={`${option} out of 5`}
            onClick={() => onChange(option)}
            className={cn(
              'h-10 flex-1 rounded-xl border text-sm font-medium transition-all duration-150',
              'active:scale-[0.97]',
              value === option
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface text-ink-soft hover:border-line-strong',
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-faint">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}
