import { useMemo, useState } from 'react'
import { Check, Clock, Copy } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import { Badge } from '@/ui/Badge'
import { Button } from '@/ui/Button'
import { EmptyState } from '@/ui/States'
import { selectJobAction } from '@/domain/planToday'
import { useAppStore } from '@/lib/store/useAppStore'
import { formatMinutes, todayIso } from '@/lib/utils'

/**
 * §7 — exactly one job-search action. One is the point: a list of twelve is
 * what made the search exhausting in the first place.
 */
export function JobAction() {
  const networking = useAppStore((state) => state.networking)
  const applications = useAppStore((state) => state.applications)
  const logNetworking = useAppStore((state) => state.logNetworking)
  const [copied, setCopied] = useState(false)
  const date = todayIso()

  const hasStaleApplications = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86_400_000
    return applications.some(
      (application) =>
        application.outcome === 'open' &&
        application.stage === 'applied' &&
        application.dateApplied !== null &&
        new Date(application.dateApplied).getTime() < weekAgo,
    )
  }, [applications])

  const completedQuestIds = useMemo(
    () => networking.map((entry) => entry.questId).filter((id): id is string => Boolean(id)),
    [networking],
  )

  const pick = useMemo(
    () => selectJobAction({ date, completedQuestIds, hasStaleApplications }),
    [date, completedQuestIds, hasStaleApplications],
  )

  const doneToday = useMemo(
    () => networking.some((entry) => entry.occurredOn === date),
    [networking, date],
  )

  if (!pick) {
    return (
      <section>
        <SectionHeading title="One job action" />
        <EmptyState
          title="You’ve worked through the outreach actions here."
          body="More arrive with the job-search tools. Logging your own outreach still counts."
        />
      </section>
    )
  }

  const { quest, reason } = pick

  const copyTemplate = async () => {
    if (!quest.templateHint) return
    try {
      await navigator.clipboard.writeText(quest.templateHint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section>
      <SectionHeading title="One job action" hint={reason} />
      <Card className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{quest.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{quest.detail}</p>
          </div>
          <Badge tone="neutral">
            <Clock className="size-3" aria-hidden />
            {formatMinutes(quest.estimatedMinutes)}
          </Badge>
        </div>

        {quest.templateHint ? (
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-xs font-medium text-accent-ink hover:underline">
              A starting point you should rewrite
            </summary>
            <div className="mt-2 rounded-xl border border-line bg-sunken p-3">
              <p className="text-[0.8125rem] leading-relaxed whitespace-pre-line text-ink-soft">
                {quest.templateHint}
              </p>
              <Button variant="ghost" size="sm" className="mt-2 -ml-1.5" onClick={copyTemplate}>
                {copied ? (
                  <>
                    <Check className="size-3.5" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden />
                    Copy
                  </>
                )}
              </Button>
              <p className="mt-2 text-xs text-ink-faint">
                Change the wording. A message that sounds templated is worse than none.
              </p>
            </div>
          </details>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          {doneToday ? (
            <p className="flex items-center gap-2 text-sm font-medium text-positive-ink">
              <Check className="size-4" aria-hidden />
              Logged today. That counts.
            </p>
          ) : (
            <Button
              variant="secondary"
              onClick={() =>
                logNetworking({
                  kind: quest.id === 'n-follow-up' ? 'follow_up' : 'message_sent',
                  personOrGroup: 'Logged from Today',
                  questId: quest.id,
                  label: quest.title,
                })
              }
            >
              I did this
            </Button>
          )}
        </div>
      </Card>
    </section>
  )
}
