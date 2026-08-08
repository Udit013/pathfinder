import { Card } from '@/ui/Card'
import { SproutDoodle } from '@/ui/Doodles'
import { AskAiButton } from '@/features/ai/AskAiButton'
import { EnergyCheckIn } from './EnergyCheckIn'
import { TodaysQuest } from './TodaysQuest'
import { ExplorationNudge } from './ExplorationNudge'
import { InterviewNudge } from './InterviewNudge'
import { useProfile, useTodayCheckIn, useTodayMode } from '@/lib/store/selectors'
import { friendlyGreeting, subheadingForDay } from '@/lib/utils'

/**
 * §7 — the most important page. Opening it should answer "what do I do now?"
 * before any scrolling, and never present more than one of each kind of thing.
 */
export function TodayPage() {
  const profile = useProfile()
  const checkIn = useTodayCheckIn()
  const { shape, mode } = useTodayMode()
  const lightDay = mode === 'light'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 pt-2">
      <header className="animate-rise">
        <h1 className="font-display text-2xl leading-tight text-ink sm:text-[1.9rem]">
          {friendlyGreeting(profile?.name)}{' '}
          <span className="animate-wave" aria-hidden>
            👋
          </span>
        </h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          {checkIn?.roughDay
            ? "Today doesn't need to be productive. Let's just keep the path open."
            : subheadingForDay()}
        </p>
      </header>

      <EnergyCheckIn />

      <TodaysQuest />

      {/*
        Low-energy days hide the rest of the day entirely.

        Not "collapse into a smaller list" — actually gone. Showing someone three
        unfinished things while they've just told you they're running on empty is
        the exact moment this product could start feeling like every other one.
        One thing, and permission to stop.
      */}
      {lightDay ? (
        <Card tone="sunken" className="p-5 text-center">
          <SproutDoodle className="mx-auto size-10" />
          <p className="font-display mt-2 text-lg text-ink">That&rsquo;s the whole day.</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
            The rest is put away for now. It&rsquo;ll be here tomorrow, exactly as you left it —
            nothing expires and nothing is lost.
          </p>
          <details className="group mt-4">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center rounded-full px-3 text-sm font-medium text-ink-soft hover:text-ink">
              Show me the rest anyway
            </summary>
            <div className="animate-rise mt-4 space-y-8 text-left">
              <ExplorationNudge />
              <InterviewNudge />
            </div>
          </details>
        </Card>
      ) : (
        <>
          <ExplorationNudge />
          <InterviewNudge />
        </>
      )}

      <div className="flex justify-center pt-1">
        <AskAiButton
          kind={lightDay ? 'low_energy' : 'next_step'}
          variant="ghost"
          label={lightDay ? 'Ask AI for one small thing' : 'Ask AI what to do next'}
        />
      </div>

      <p className="pt-2 text-center text-xs leading-relaxed text-ink-faint">
        {lightDay
          ? 'Whatever you manage today is enough. Genuinely.'
          : `${shape.label} day — nothing here is mandatory.`}
      </p>
    </div>
  )
}
