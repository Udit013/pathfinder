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
  const { shape } = useTodayMode()

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

      <ExplorationNudge />

      <InterviewNudge />

      <p className="pt-2 text-center text-xs text-ink-faint">
        {shape.label} day — {shape.contains.length} things, and none of them are mandatory.
      </p>
    </div>
  )
}
