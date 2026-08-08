import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { brand } from '@/config/brand'
import { Button } from '@/ui/Button'
import { ErrorNotice } from '@/ui/States'
import { Badge } from '@/ui/Badge'
import { PathDoodle, SparkDoodle } from '@/ui/Doodles'
import { ChoiceCard, TextInput } from '@/ui/Field'
import { careerCategories, pathsByCategory } from '@/data/careerPaths'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'
import {
  authorizationDisclaimer,
  goalOptions,
  situationOptions,
  timeOptions,
  workAuthSuggestions,
} from './content'

interface Draft {
  name: string
  situation: string
  goals: string[]
  weekdayMinutes: number
  interestPathIds: string[]
  primaryPathId: string | null
  authStatus: string
  authTimelineNote: string
  requiresSponsorship: boolean | null
  locations: string
}

const emptyDraft: Draft = {
  name: '',
  situation: '',
  goals: [],
  weekdayMinutes: 45,
  interestPathIds: [],
  primaryPathId: null,
  authStatus: '',
  authTimelineNote: '',
  requiresSponsorship: null,
  locations: '',
}

type StepId =
  | 'welcome'
  | 'situation'
  | 'goals'
  | 'time'
  | 'interests'
  | 'first'
  | 'constraints'
  | 'ready'

const stepOrder: StepId[] = [
  'welcome',
  'situation',
  'goals',
  'time',
  'interests',
  'first',
  'constraints',
  'ready',
]

export function OnboardingFlow() {
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((state) => state.completeOnboarding)
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<Draft>(emptyDraft)

  const step = stepOrder[index] ?? 'welcome'

  // Corrupt or unreadable saved data drops the user here, at the welcome
  // screen. Without this they would just see a fresh start with no explanation
  // — which is precisely the silent data loss the quarantine exists to avoid.
  const storageError = useAppStore((state) => state.storageError)
  const clearStorageMessages = useAppStore((state) => state.clearStorageMessages)
  const patch = (values: Partial<Draft>) => setDraft((current) => ({ ...current, ...values }))

  const selectedPaths = useMemo(
    () =>
      careerCategories
        .flatMap((category) => pathsByCategory(category.id))
        .filter((path) => draft.interestPathIds.includes(path.id)),
    [draft.interestPathIds],
  )

  const canAdvance = (() => {
    switch (step) {
      case 'goals':
        return draft.goals.length > 0
      case 'interests':
        return draft.interestPathIds.length > 0
      default:
        return true
    }
  })()

  const finish = () => {
    const trimmedLocations = draft.locations
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    completeOnboarding({
      profile: {
        name: draft.name.trim(),
        situation: draft.situation || undefined,
        goals: draft.goals,
        initialInterestPathIds: draft.interestPathIds,
        activePathIds: draft.interestPathIds,
        primaryPathId: draft.primaryPathId,
        weekdayMinutes: draft.weekdayMinutes,
        locationPreferences: trimmedLocations,
        workAuthorization: draft.authStatus.trim()
          ? {
              status: draft.authStatus.trim(),
              timelineNote: draft.authTimelineNote.trim() || undefined,
              requiresSponsorship: draft.requiresSponsorship,
            }
          : undefined,
      },
    })
    navigate('/', { replace: true })
  }

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <div
        className={cn(
          'mx-auto flex w-full max-w-xl flex-1 flex-col px-5 py-8 sm:py-14',
          // The first and last screens read better as a single centred block.
          (step === 'welcome' || step === 'ready') && 'justify-center',
        )}
      >
        {storageError ? (
          <div className="mb-6">
            <ErrorNotice message={storageError} onDismiss={clearStorageMessages} />
          </div>
        ) : null}

        {/* Progress: dots, not a percentage. Nothing here is a race. */}
        {step !== 'welcome' ? (
          <div className="mb-8 flex items-center gap-1.5" aria-hidden>
            {stepOrder.slice(1).map((id, dotIndex) => (
              <span
                key={id}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  dotIndex < index ? 'bg-accent' : 'bg-line',
                )}
              />
            ))}
          </div>
        ) : null}

        <div
          key={step}
          className={cn(
            'animate-rise',
            step !== 'welcome' && step !== 'ready' && 'flex-1',
          )}
        >
          {/* The very first thing anyone sees. A greeting and one question —
              never a dashboard, and never a form. */}
          {step === 'welcome' ? (
            <div className="text-center">
              <PathDoodle className="mx-auto mb-5 h-20 w-32 text-ink-faint" />

              <h1 className="font-display text-3xl leading-tight text-ink sm:text-[2.5rem]">
                Welcome to {brand.name} <span aria-hidden>🌱</span>
              </h1>

              <p className="font-display mx-auto mt-4 max-w-sm text-lg leading-snug text-ink-soft">
                You don&rsquo;t need to have everything figured out.
                <br />
                Let&rsquo;s find your next step together.
              </p>

              <form
                className="mx-auto mt-8 max-w-xs text-left"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (draft.name.trim()) setIndex(index + 1)
                }}
              >
                <TextInput
                  label="What should we call you?"
                  value={draft.name}
                  autoFocus
                  autoComplete="given-name"
                  onChange={(event) => patch({ name: event.target.value })}
                  placeholder="Your name"
                />
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className="mt-3"
                  disabled={!draft.name.trim()}
                >
                  Let&rsquo;s begin
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </form>

              <p className="mx-auto mt-5 max-w-xs text-xs leading-relaxed text-ink-faint">
                Six short questions after this, no wrong answers, and everything stays on this
                device.
              </p>
            </div>
          ) : null}

          {step === 'situation' ? (
            <StepFrame
              title={`Nice to meet you, ${draft.name.trim().split(' ')[0]}.`}
              subtitle="Where are you right now? Optional — it only changes the tone of a few things."
            >
              <div role="radiogroup" aria-label="Your situation" className="space-y-2">
                {situationOptions.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    selected={draft.situation === option.value}
                    onToggle={() =>
                      patch({ situation: draft.situation === option.value ? '' : option.value })
                    }
                    title={option.label}
                  />
                ))}
              </div>
            </StepFrame>
          ) : null}

          {step === 'goals' ? (
            <StepFrame
              title="What do you want out of this?"
              subtitle="Pick as many as are true. This shapes what gets suggested first."
            >
              <div role="group" aria-label="Your goals" className="space-y-2">
                {goalOptions.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    multi
                    selected={draft.goals.includes(option.value)}
                    onToggle={() => patch({ goals: toggleInList(draft.goals, option.value) })}
                    title={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </StepFrame>
          ) : null}

          {step === 'time' ? (
            <StepFrame
              title="How much time do you realistically have on a weekday?"
              subtitle="Be honest rather than ambitious — this is the number your days get built around, and a small one works fine."
            >
              <div role="radiogroup" aria-label="Daily time available" className="space-y-2">
                {timeOptions.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    selected={draft.weekdayMinutes === option.value}
                    onToggle={() => patch({ weekdayMinutes: option.value })}
                    title={option.label}
                    description={option.description}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-ink-faint">
                On low-energy days PathFinder will ask for less than this, not more.
              </p>
            </StepFrame>
          ) : null}

          {step === 'interests' ? (
            <StepFrame
              title="Which of these sound interesting?"
              subtitle="Curiosity is enough — you don't need to know anything about them yet. Two or three is a good start, and you'll try small experiments before committing to any of them."
            >
              <div className="space-y-7">
                {careerCategories.map((category) => (
                  <section key={category.id}>
                    <div className="mb-2.5">
                      <h3 className="text-sm font-semibold text-ink">{category.label}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                        {category.blurb}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {pathsByCategory(category.id).map((path) => (
                        <ChoiceCard
                          key={path.id}
                          multi
                          selected={draft.interestPathIds.includes(path.id)}
                          onToggle={() =>
                            patch({
                              interestPathIds: toggleInList(draft.interestPathIds, path.id),
                            })
                          }
                          title={path.title}
                          description={path.tagline}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </StepFrame>
          ) : null}

          {step === 'first' ? (
            <StepFrame
              title="Which one should we start with?"
              subtitle="This only decides what shows up on Today first. Choosing it commits you to nothing — you can switch or explore several at once."
            >
              <div role="radiogroup" aria-label="Starting direction" className="space-y-2">
                <ChoiceCard
                  selected={draft.primaryPathId === null}
                  onToggle={() => patch({ primaryPathId: null })}
                  title="I’m not sure yet — start me with exploring"
                  description="You’ll get experiments across the areas you picked, and a direction can emerge from what you actually enjoy."
                />
                {selectedPaths.map((path) => (
                  <ChoiceCard
                    key={path.id}
                    selected={draft.primaryPathId === path.id}
                    onToggle={() => patch({ primaryPathId: path.id })}
                    title={path.title}
                    description={path.tagline}
                  />
                ))}
              </div>
            </StepFrame>
          ) : null}

          {step === 'constraints' ? (
            <StepFrame
              title="Anything that limits which jobs make sense?"
              subtitle="All optional. Skip this entirely if you'd rather."
            >
              <div className="space-y-5">
                <TextInput
                  label="Work authorisation"
                  hint="In your own words — e.g. “F-1 OPT”. PathFinder stores this as a note, nothing more."
                  value={draft.authStatus}
                  onChange={(event) => patch({ authStatus: event.target.value })}
                  placeholder="e.g. F-1 OPT"
                  list="pf-auth-suggestions"
                />
                <datalist id="pf-auth-suggestions">
                  {workAuthSuggestions.map((suggestion) => (
                    <option key={suggestion} value={suggestion} />
                  ))}
                </datalist>

                <TextInput
                  label="Anything about your timeline you want to remember"
                  hint="A note to yourself. PathFinder never calculates dates or eligibility from this."
                  value={draft.authTimelineNote}
                  onChange={(event) => patch({ authTimelineNote: event.target.value })}
                  placeholder="e.g. Need to sort out next steps before next summer"
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink">Will you need visa sponsorship?</p>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Sponsorship">
                    {[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' },
                      { value: null, label: 'Not sure' },
                    ].map((option) => (
                      <button
                        key={String(option.value)}
                        type="button"
                        role="radio"
                        aria-checked={draft.requiresSponsorship === option.value}
                        onClick={() => patch({ requiresSponsorship: option.value })}
                        className={cn(
                          'rounded-full border px-4 py-1.5 text-sm transition-colors',
                          draft.requiresSponsorship === option.value
                            ? 'border-accent bg-accent-soft font-medium text-accent-ink'
                            : 'border-line bg-surface text-ink-soft hover:border-line-strong',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <TextInput
                  label="Locations that work for you"
                  hint="Comma separated. Include “Remote” if that counts."
                  value={draft.locations}
                  onChange={(event) => patch({ locations: event.target.value })}
                  placeholder="e.g. Remote, New York, Boston"
                />

                <p className="rounded-card border border-line bg-sunken p-3.5 text-xs leading-relaxed text-ink-soft">
                  {authorizationDisclaimer}
                </p>
              </div>
            </StepFrame>
          ) : null}

          {step === 'ready' ? (
            <div>
              <SparkDoodle className="mb-4 size-14" />
              <h1 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
                That&rsquo;s everything, {draft.name.trim().split(' ')[0] || 'friend'}.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Here&rsquo;s what happens next, and what it&rsquo;s for:
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  {
                    title: 'Every day, one small thing',
                    body: 'Today shows you a single quest sized to the energy you actually have — not a backlog.',
                  },
                  {
                    title: 'Try the work before choosing it',
                    body: 'Short experiments let you feel what these jobs are like. What you enjoy becomes evidence.',
                  },
                  {
                    title: 'Direction emerges, it isn’t assigned',
                    body: 'PathFinder shows signals based on what you did — never a personality test, never a prediction.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                      <Check className="size-3 text-accent-ink" strokeWidth={3} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink">{item.title}</span>
                      <span className="block text-sm text-ink-soft">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {selectedPaths.length > 0 ? (
                <div className="mt-7">
                  <p className="mb-2 text-xs tracking-[0.14em] text-ink-faint uppercase">
                    Exploring to begin with
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPaths.map((path) => (
                      <Badge key={path.id} tone="accent">
                        {path.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Controls */}
        {/* Sticky, because the longer steps otherwise bury the way forward. */}
        <div
          className={cn(
            'sticky bottom-0 mt-8 flex items-center gap-3 bg-canvas/90 py-3 backdrop-blur-sm',
            'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
            step === 'welcome' && 'justify-center',
          )}
        >
          {index > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setIndex(index - 1)}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
          ) : null}
          {step !== 'welcome' ? <div className="flex-1" /> : null}
          {step === 'constraints' ? (
            <Button variant="ghost" size="md" onClick={() => setIndex(index + 1)}>
              Skip
            </Button>
          ) : null}
          {step === 'welcome' ? null : step === 'ready' ? (
            <Button size="lg" onClick={finish}>
              Open {brand.name}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button size="md" disabled={!canAdvance} onClick={() => setIndex(index + 1)}>
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepFrame({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h1 className="font-display text-2xl leading-tight text-ink">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  )
}
