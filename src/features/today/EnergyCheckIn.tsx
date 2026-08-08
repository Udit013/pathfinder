import { Card } from '@/ui/Card'
import { Button } from '@/ui/Button'
import { energyOptions } from '@/domain/energy'
import { useAppStore } from '@/lib/store/useAppStore'
import { useTodayCheckIn, useTodayMode } from '@/lib/store/selectors'
import { cn, formatMinutes } from '@/lib/utils'

/**
 * §7 quick check-in and §23 rough-day option.
 *
 * Answering changes the size of the day and nothing else. There is no wrong
 * answer here and no copy that treats a low answer as a problem.
 */
export function EnergyCheckIn() {
  const checkIn = useTodayCheckIn()
  const recordEnergy = useAppStore((state) => state.recordEnergy)
  const { shape, budgetMinutes } = useTodayMode()

  return (
    <Card tone="sunken" className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm font-medium text-ink">How&rsquo;s your energy today?</p>
        {checkIn ? (
          <p className="text-xs text-ink-faint">
            {shape.label} day · about {formatMinutes(budgetMinutes)}
          </p>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2" role="radiogroup" aria-label="Energy today">
        {energyOptions.map((option) => {
          const selected = checkIn?.energy === option.value && !checkIn.roughDay
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => recordEnergy(option.value, { roughDay: false })}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border py-2.5 transition-all duration-150',
                'active:scale-[0.97]',
                selected
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-surface hover:border-line-strong',
              )}
            >
              <span className="text-xl leading-none" aria-hidden>
                {option.emoji}
              </span>
              <span
                className={cn(
                  'text-xs',
                  selected ? 'font-medium text-accent-ink' : 'text-ink-soft',
                )}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </div>

      {checkIn?.roughDay ? (
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Today doesn&rsquo;t need to be productive. Let&rsquo;s just keep the path open.
        </p>
      ) : (
        <div className="mt-3 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-xs text-ink-faint">{checkIn ? shape.message : 'Optional — it just sizes the day.'}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => recordEnergy('low', { roughDay: true })}
            className="shrink-0 -ml-2 sm:ml-0"
          >
            I&rsquo;m having a rough day
          </Button>
        </div>
      )}
    </Card>
  )
}
