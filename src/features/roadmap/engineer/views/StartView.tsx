import { ArrowRight, BookOpen, Briefcase, CheckCircle2, Hammer, Sparkles, Sprout } from 'lucide-react'
import { Card, SectionHeading } from '@/ui/Card'
import {
  aiModes,
  aiRules,
  doNotTrustAiFor,
  fastLane,
  phases,
  primaryStack,
  principles,
  readyCheckId,
  reviewingAiCode,
  revisionSystem,
  schedules,
  weeklyShape,
} from '@/data/engineeringRoadmap'
import { Bullets, CheckItem, Label, StatusChip } from '../parts'
import { Section, Table } from '../common'
import { bucketLabels, currentStep, levels, skipId, stepStatus, useChecklist, type Bucket } from '../shared'
import type { Destination } from '../nav'
import { cn } from '@/lib/utils'

export function StartView({ go }: { go: (to: Destination) => void }) {
  const { checked, toggle } = useChecklist()
  const current = currentStep(checked)
  const anyProgress = phases.some((p) => stepStatus(p, checked) !== 'not-started')

  return (
    <div className="space-y-9">
      {/* Hero */}
      <Card tone="accent" className="p-5 sm:p-6">
        <p className="font-display text-xl leading-snug text-accent-ink sm:text-2xl">
          Become a job-ready engineer, one step at a time.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-accent-ink/85">
          Nine steps in order, from your first program to production AI systems. Each step tells you what to
          learn, which free resource to open first, what to build, and how to know you’re ready to move on.
          Interview practice runs alongside from week 3 — nothing is crammed at the end.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => go({ tab: 'path', step: current.id })}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            {anyProgress ? `Continue: Step ${current.number}` : 'Start at Step 0'}
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <a
            href="#placement"
            className="inline-flex min-h-11 items-center rounded-full border border-accent/30 bg-surface px-5 text-sm font-medium text-accent-ink"
          >
            Skip what I already know
          </a>
        </div>
      </Card>

      {/* Choose a starting point */}
      <section>
        <SectionHeading title="1 · Choose your starting point" hint="Pick whichever sounds most like you. You can change your mind at any time." />
        <div className="grid gap-3 md:grid-cols-3">
          <StartCard
            icon={<Sprout className="size-5" aria-hidden />}
            title="I’m new to programming"
            body="Start at Step 0 and go in order. Every step assumes only the ones before it."
            action="Start at Step 0"
            onClick={() => go({ tab: 'path', step: 'phase-0' })}
          />
          <StartCard
            icon={<CheckCircle2 className="size-5" aria-hidden />}
            title="I already know some of this"
            body="Take the quick placement check below. Tick what you can already do, and the path starts at your first gap."
            action="Do the placement check"
            href="#placement"
          />
          <StartCard
            icon={<Briefcase className="size-5" aria-hidden />}
            title="I’m aiming at a specific role"
            body="See what SWE, Full-stack, FDE and AI Engineer roles add on top of the shared path, and how they interview."
            action="Compare roles"
            onClick={() => go({ tab: 'roles' })}
          />
        </div>
      </section>

      {/* How it's organised */}
      <section>
        <SectionHeading
          title="2 · How the path is organised"
          hint="Four levels, nine steps. Each step builds on the ones before it — click any step to open it."
        />
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {levels.map(({ level, blurb }, index) => (
            <li key={level} className="rounded-card border border-line bg-surface p-4">
              <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">
                Level {index + 1} · {level}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{blurb}</p>
              <ul className="mt-3 space-y-1.5">
                {phases
                  .filter((p) => p.level === level)
                  .map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => go({ tab: 'path', step: p.id })}
                        className={cn(
                          'flex min-h-11 w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-sunken',
                          p.id === current.id && 'bg-accent-soft',
                        )}
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sunken text-xs font-semibold text-ink-soft">
                          {p.number}
                        </span>
                        <span className="min-w-0 flex-1 leading-snug text-ink">{p.title}</span>
                        <StatusChip status={stepStatus(p, checked)} />
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-ink-soft">
          Alongside the steps, two tracks run the whole way through:{' '}
          <button type="button" onClick={() => go({ tab: 'interviews' })} className="font-medium text-accent-ink hover:underline">
            DSA practice and interview practice
          </button>
          .
        </p>
      </section>

      {/* How each step works */}
      <section>
        <SectionHeading title="3 · How every step is laid out" hint="The same four parts, in the same order, every time." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <BookOpen className="size-4" aria-hidden />, title: 'Learn', body: 'Topics in order. Each says what it is, why it matters, what it builds on, and which free resource to open first.' },
            { icon: <Hammer className="size-4" aria-hidden />, title: 'Build', body: 'One project that proves the step, plus small exercises.' },
            { icon: <CheckCircle2 className="size-4" aria-hidden />, title: 'Check yourself', body: 'A short "ready to move on when…" list, and the interview questions this step prepares you for.' },
            { icon: <Sparkles className="size-4" aria-hidden />, title: 'Use AI', body: 'How to use AI here without skipping the learning — with prompts you can copy.' },
          ].map((item) => (
            <Card key={item.title} className="p-4">
              <p className="flex items-center gap-2 font-medium text-ink">
                <span className="flex size-7 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">{item.icon}</span>
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </Card>
          ))}
        </div>
        <Card tone="sunken" className="mt-3 p-4">
          <Label>Resources are labelled so the first click is obvious</Label>
          <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {(Object.keys(bucketLabels) as Bucket[]).map((bucket) => (
              <div key={bucket} className="flex gap-2 text-sm">
                <dt className="w-24 shrink-0 font-medium text-ink">{bucketLabels[bucket].label}</dt>
                <dd className="text-ink-soft">{bucketLabels[bucket].hint}</dd>
              </div>
            ))}
            <div className="flex gap-2 text-sm">
              <dt className="w-24 shrink-0 font-medium text-positive-ink">Free certificate</dt>
              <dd className="text-ink-soft">The certificate itself costs nothing — paid ones are labelled separately</dd>
            </div>
          </dl>
        </Card>
      </section>

      {/* Placement */}
      <section id="placement" className="scroll-mt-20">
        <SectionHeading
          title="4 · Skip what you already know"
          hint="For each step, tick what you can honestly already do. When every box is ticked, that step counts as done and the path moves you on. Or skip a step outright."
        />
        <div className="space-y-2">
          {phases.map((p) => {
            const status = stepStatus(p, checked)
            const skipped = checked.has(skipId(p.id))
            return (
              <details key={p.id} className="group rounded-xl border border-line bg-surface">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sunken text-xs font-semibold text-ink-soft">
                    {p.number}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-ink">{p.title}</span>
                  <StatusChip status={status} />
                </summary>
                <div className="border-t border-line p-3">
                  <p className="text-xs text-ink-faint">I can already…</p>
                  <div className="-ml-2">
                    {p.readyWhen.map((item, index) => (
                      <CheckItem key={index} id={readyCheckId(p.id, index)}>
                        {item}
                      </CheckItem>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={skipped}
                      onClick={() => toggle(skipId(p.id))}
                      className={cn(
                        'inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors',
                        skipped ? 'border-accent bg-accent-soft font-medium text-accent-ink' : 'border-line text-ink-soft hover:text-ink',
                      )}
                    >
                      {skipped ? 'Skipped — undo' : 'Skip this step anyway'}
                    </button>
                    <button
                      type="button"
                      onClick={() => go({ tab: 'path', step: p.id })}
                      className="inline-flex min-h-10 items-center text-sm font-medium text-accent-ink hover:underline"
                    >
                      Look at Step {p.number} first →
                    </button>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{fastLane}</p>
      </section>

      {/* Reference guidance — preserved, but out of the way */}
      <section className="space-y-3">
        <SectionHeading title="Before you start — guidance worth reading once" />
        <Section title="How to study" summary="The principles behind the path, realistic timelines, a typical week, and how to revise.">
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-line p-3">
                <p className="font-medium text-ink">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
          <div>
            <Label>Realistic timelines</Label>
            <p className="mt-1 mb-2 text-sm text-ink-soft">
              Week numbers on this page assume 20 hours a week. Pick the pace you can sustain, not the one that sounds impressive.
            </p>
            <Table
              headers={['Pace', 'Hours', 'Full path', 'Ready to apply for SWE roles', 'Note']}
              rows={schedules.map((s) => [s.pace, s.hours, s.fullPath, s.sweReady, s.note])}
            />
          </div>
          <div>
            <Label>A typical 20-hour week</Label>
            <div className="mt-2">
              <Table headers={['Block', 'Hours', 'What']} rows={weeklyShape.map((w) => [w.block, w.hours, w.what])} />
            </div>
          </div>
          <div>
            <Label>Revision and assessment</Label>
            <p className="mt-1 mb-2 text-sm text-ink-soft">Without a revision system, month-one material is gone by month six.</p>
            <div className="grid gap-3 md:grid-cols-3">
              {revisionSystem.map((r) => (
                <div key={r.cadence} className="rounded-xl border border-line p-3">
                  <p className="font-medium text-ink">{r.cadence}</p>
                  <div className="mt-2">
                    <Bullets items={r.what} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="How to use AI without depending on it" summary="Three modes, seven rules, what not to trust it with, and how to review what it writes.">
          <div className="grid gap-3 md:grid-cols-3">
            {aiModes.map((m) => (
              <div key={m.mode} className="rounded-xl border border-line p-3">
                <p className="font-medium text-ink">{m.mode}</p>
                <p className="mt-1 text-xs text-ink-faint">{m.when}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.rule}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>The rules</Label>
              <div className="mt-2">
                <Bullets items={aiRules} tone="positive" />
              </div>
            </div>
            <div>
              <Label>Don’t trust AI alone for</Label>
              <div className="mt-2">
                <Bullets items={doNotTrustAiFor} tone="critical" />
              </div>
            </div>
            <div>
              <Label>Reviewing AI-written code</Label>
              <div className="mt-2">
                <Bullets items={reviewingAiCode} />
              </div>
            </div>
          </div>
        </Section>

        <Section title="The stack to learn first" summary="One choice per layer, learned deeply, then expand when a job asks for something else.">
          <p className="text-sm text-ink-soft">Switching stacks mid-roadmap is the most common way to lose months.</p>
          <Table headers={['Layer', 'Learn first', 'Why', 'Add later']} rows={primaryStack.map((s) => [s.layer, s.choice, s.why, s.later])} />
        </Section>
      </section>
    </div>
  )
}

function StartCard({
  icon,
  title,
  body,
  action,
  onClick,
  href,
}: {
  icon: React.ReactNode
  title: string
  body: string
  action: string
  onClick?: () => void
  href?: string
}) {
  const className =
    'flex min-h-11 items-center gap-1 text-sm font-medium text-accent-ink group-hover:underline'
  return (
    <Card className="group flex flex-col p-4">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">{icon}</span>
      <p className="font-display mt-3 text-lg leading-snug text-ink">{title}</p>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{body}</p>
      {href ? (
        <a href={href} className={cn(className, 'mt-2')}>
          {action} <ArrowRight className="size-3.5" aria-hidden />
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cn(className, 'mt-2 text-left')}>
          {action} <ArrowRight className="size-3.5" aria-hidden />
        </button>
      )}
    </Card>
  )
}
