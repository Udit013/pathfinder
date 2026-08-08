import { useMemo, useState } from 'react'
import { Check, Clock, Feather } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { EmptyState } from '@/ui/States'
import { FreeResources } from '@/ui/ResourceLinks'
import { resourcesByIds, resourcesForSkills } from '@/data/resources'
import { selectQuest } from '@/domain/planToday'
import { lighterMode } from '@/domain/energy'
import { useAppStore } from '@/lib/store/useAppStore'
import { useCurrentSkillIds, useProfile, useTodayMode } from '@/lib/store/selectors'
import { formatMinutes, todayIso } from '@/lib/utils'

export function TodaysQuest() {
  const profile = useProfile()
  const { mode, budgetMinutes } = useTodayMode()
  const completions = useAppStore((state) => state.questCompletions)
  const setModeOverride = useAppStore((state) => state.setModeOverride)
  const completeQuest = useAppStore((state) => state.completeQuest)
  const currentSkillIds = useCurrentSkillIds()
  const date = todayIso()

  const [started, setStarted] = useState(false)

  const pick = useMemo(
    () => selectQuest({ date, mode, budgetMinutes, profile, completions, currentSkillIds }),
    [date, mode, budgetMinutes, profile, completions, currentSkillIds],
  )

  const alreadyDone = useMemo(
    () =>
      pick
        ? completions.some(
            (entry) => entry.questId === pick.quest.id && entry.completedAt !== null,
          )
        : false,
    [pick, completions],
  )

  if (!pick) {
    return (
      <section aria-labelledby="todays-quest">
        <SectionHeading title="Today's quest" />
        <EmptyState
          title="You’ve finished everything seeded so far."
          body="More quests arrive as the roadmap fills in. In the meantime, try a career experiment or work on a project."
        />
      </section>
    )
  }

  const { quest, lightened, reason } = pick
  const task = lightened && quest.lighterVariant ? quest.lighterVariant : quest.task
  const minutes = lightened ? Math.max(10, Math.round(quest.estimatedMinutes * 0.5)) : quest.estimatedMinutes
  // Explicitly chosen resources first, then the best remaining ones for the
  // skills involved — so every quest offers a way in, never a dead end.
  const questResources = (() => {
    const chosen = resourcesByIds(quest.resourceIds)
    const seen = new Set(chosen.map((resource) => resource.id))
    const filler = resourcesForSkills(quest.skillIds, 4).filter(
      (resource) => !seen.has(resource.id),
    )
    return [...chosen, ...filler].slice(0, 4)
  })()

  const complete = () =>
    completeQuest({
      questId: quest.id,
      title: quest.title,
      xp: quest.xp,
      lightened,
      careerPathIds: quest.careerPathIds,
      skillIds: quest.skillIds,
    })

  return (
    <section aria-labelledby="todays-quest">
      <SectionHeading title="Today's quest" hint={reason} />

      <Card elevated className="overflow-hidden">
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">
              <Clock className="size-3" aria-hidden />
              {formatMinutes(minutes)}
            </Badge>
            <Badge tone="spark">+{quest.xp} XP</Badge>
            {lightened ? (
              <Badge tone="neutral">
                <Feather className="size-3" aria-hidden />
                Lighter version
              </Badge>
            ) : null}
          </div>

          <h2 id="todays-quest" className="font-display mt-3 text-xl leading-snug text-ink">
            {quest.title}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{quest.objective}</p>

          {quest.practises.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">You&rsquo;ll practise</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {quest.practises.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {started || alreadyDone ? (
            <div className="animate-rise mt-5 space-y-4 border-t border-line pt-4">
              <div>
                <p className="text-xs tracking-[0.14em] text-ink-faint uppercase">The task</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{task}</p>
              </div>

              <FreeResources
                bare
                resources={questResources}
                title="Free resources"
                hint="Everything you need for this task. Opens in a new tab."
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-sunken px-5 py-3.5">
          {alreadyDone ? (
            <p className="flex items-center gap-2 text-sm font-medium text-positive-ink">
              <Check className="size-4" aria-hidden />
              Done today.
            </p>
          ) : started ? (
            <Button onClick={complete}>
              <Check className="size-4" aria-hidden />
              Mark complete
            </Button>
          ) : (
            <Button onClick={() => setStarted(true)}>Start quest</Button>
          )}

          {!alreadyDone && mode !== 'light' ? (
            <Button variant="ghost" size="md" onClick={() => setModeOverride(lighterMode(mode))}>
              Make this lighter
            </Button>
          ) : null}
        </div>
      </Card>
    </section>
  )
}
