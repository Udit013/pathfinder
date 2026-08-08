import { Mic } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { ButtonLink } from '@/ui/Button'
import { useNextInterviewAction } from '@/lib/store/selectors'

/**
 * Today's third slot: one interview question.
 *
 * Small on purpose — a single question you could answer out loud while making
 * coffee. It appears every day because interview fluency comes from frequency,
 * not from one heroic session the night before.
 */
export function InterviewNudge() {
  const next = useNextInterviewAction()
  if (!next) return null

  return (
    <section>
      <SectionHeading title="One interview question" hint={next.reason} />
      <Card className="lift p-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-soft text-sky-ink"
            aria-hidden
          >
            <Mic className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug font-medium text-ink">{next.question.prompt}</p>
            <p className="mt-1 text-xs text-ink-faint">
              {next.track.track.title} · try answering it out loud before you look at anything
            </p>

            <ButtonLink
              to={`/interview/${next.track.track.id}/${next.question.id}`}
              size="sm"
              variant="secondary"
              className="mt-3"
            >
              Have a go
            </ButtonLink>
          </div>
        </div>
      </Card>
    </section>
  )
}
