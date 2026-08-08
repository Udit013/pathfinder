import { Link } from 'react-router'
import { ArrowRight, Check, MessagesSquare, Mic } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { ButtonLink } from '@/ui/Button'
import { AskAiButton } from '@/features/ai/AskAiButton'
import { ProgressBar } from '@/ui/Progress'
import { SparkDoodle } from '@/ui/Doodles'
import { stages } from '@/data/interviewTracks'
import { skillName } from '@/data/skills'
import { pathById } from '@/data/careerPaths'
import { useInterviewTracks, useNextInterviewAction, useProfile } from '@/lib/store/selectors'
import { cn } from '@/lib/utils'

/**
 * Interview Prep (§19).
 *
 * Structured so the page answers all three questions immediately: where you are
 * (Interview Prep), why (practise saying it out loud), and what to do next (one
 * highlighted question). Everything else is browsable but secondary.
 */
export function InterviewPage() {
  const profile = useProfile()
  const tracks = useInterviewTracks()
  const next = useNextInterviewAction()

  const primary = profile?.primaryPathId ? pathById(profile.primaryPathId) : null
  const relevant = tracks.filter((track) => track.relevant)
  const others = tracks.filter((track) => !track.relevant)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-9 pt-2">
      <header className="animate-rise">
        <h1 className="font-display text-2xl leading-tight text-ink">Interview prep</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Being good at the work and being good at talking about it are two different skills. This
          is the second one — and it improves faster than almost anything else.
        </p>
        {primary ? (
          <p className="mt-2.5 text-xs text-ink-faint">
            Ordered around {primary.title} and the skills you&rsquo;ve been learning.
          </p>
        ) : null}
      </header>

      {/* The one clear next action */}
      {next ? (
        <Card tone="accent" elevated className="p-5">
          <p className="text-xs tracking-[0.14em] text-accent-ink/70 uppercase">Start here</p>
          <p className="font-display mt-1.5 text-lg leading-snug text-accent-ink">
            {next.question.prompt}
          </p>
          <p className="mt-1.5 text-sm text-accent-ink/85">
            {next.track.track.title} · {next.reason}
          </p>
          <ButtonLink
            to={`/interview/${next.track.track.id}/${next.question.id}`}
            size="lg"
            className="mt-4"
          >
            Work through it
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </Card>
      ) : (
        <Card tone="spark" className="flex items-start gap-3 p-5">
          <SparkDoodle className="size-11 shrink-0" />
          <div>
            <p className="font-display text-lg text-spark-ink">
              You&rsquo;ve been through everything here.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-spark-ink/85">
              Run a mock interview to keep it warm — answering cold is a different skill from
              answering prepared.
            </p>
          </div>
        </Card>
      )}

      {/* Mock interview */}
      <Card className="lift p-4">
        <Link to="/interview/mock" className="flex items-center gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-soft text-sky-ink">
            <Mic className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-display block text-base text-ink">Run a mock interview</span>
            <span className="mt-0.5 block text-sm leading-snug text-ink-soft">
              Five questions, one at a time, no preparation. Uncomfortable on purpose — that&rsquo;s
              what makes it useful.
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-ink-faint" aria-hidden />
        </Link>
      </Card>

      <div className="flex justify-center">
        <AskAiButton kind="interview" label="Have ChatGPT or Claude interview me" />
      </div>

      {/* How the ladder works — explained once, not repeated on every card */}
      <section>
        <SectionHeading
          title="How this works"
          hint="Every question climbs the same five rungs. Memorising answers is what this is designed to prevent."
        />
        <Card tone="sunken" className="p-4">
          <ol className="space-y-2">
            {stages.map((stage, index) => (
              <li key={stage.id} className="flex gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink-faint">
                  {index + 1}
                </span>
                <span>
                  <span className="font-medium text-ink">{stage.label}</span>
                  <span className="text-ink-soft"> — {stage.meaning}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* Tracks that matter to this person */}
      <section>
        <SectionHeading
          title="Your topics"
          hint="Chosen from the direction you're following and the skills you've been learning."
        />
        <div className="stagger space-y-2.5">
          {relevant.map((track) => (
            <TrackCard key={track.track.id} track={track} />
          ))}
        </div>
      </section>

      {others.length > 0 ? (
        <section>
          <SectionHeading title="Everything else" hint="Here if you want it. Not needed for now." />
          <div className="grid gap-2 sm:grid-cols-2">
            {others.map((track) => (
              <Link
                key={track.track.id}
                to={`/interview/${track.track.id}`}
                className="lift flex items-center gap-2 rounded-card border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-soft hover:text-ink"
              >
                <span className="min-w-0 flex-1 truncate">{track.track.title}</span>
                <span className="shrink-0 text-xs text-ink-faint">{track.total}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="pb-2 text-center text-xs leading-relaxed text-ink-faint">
        Nobody feels ready. The goal is being able to think out loud while someone watches — not
        having every answer prepared.
      </p>
    </div>
  )
}

function TrackCard({ track }: { track: ReturnType<typeof useInterviewTracks>[number] }) {
  return (
    <Card className={cn('lift p-4', track.complete && 'bg-positive-soft')}>
      <Link to={`/interview/${track.track.id}`} className="block">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display flex items-center gap-2 text-base text-ink">
              {track.complete ? (
                <Check className="size-4 text-positive" strokeWidth={3} aria-hidden />
              ) : (
                <MessagesSquare className="size-4 text-ink-faint" aria-hidden />
              )}
              {track.track.title}
            </p>
            <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">
              {track.track.purpose}
            </p>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-ink-faint">
            {track.readyCount}/{track.total} ready
          </span>
        </div>

        <ProgressBar
          value={track.fraction}
          label={`${track.track.title} progress`}
          tone={track.complete ? 'positive' : 'accent'}
          className="mt-3"
        />

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Badge tone={track.startedCount > 0 ? 'accent' : 'neutral'}>{track.reason}</Badge>
          {track.matchedSkills.slice(0, 2).map((skillId) => (
            <Badge key={skillId} tone="neutral">
              {skillName(skillId)}
            </Badge>
          ))}
        </div>
      </Link>
    </Card>
  )
}
