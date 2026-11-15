import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react'
import { Badge } from '@/ui/Badge'
import { Card } from '@/ui/Card'
import { resourcesByIds } from '@/data/resources'
import type { Resource } from '@/types'
import {
  masteryLabels,
  projectCheckId,
  type CopyPrompt,
  type Mastery,
  type RoadmapProject,
  type RoleId,
} from '@/data/engineeringRoadmap'
import {
  bucketLabels,
  bucketOf,
  formatOf,
  hasFreeCredential,
  roleLabels,
  statusLabels,
  useChecklist,
  type Bucket,
  type Format,
  type StepStatus,
} from './shared'
import { credentialLabels, resourceKindLabels } from '@/types'
import { cn, formatMinutes } from '@/lib/utils'

const masteryTone: Record<Mastery, 'accent' | 'positive' | 'neutral' | 'spark'> = {
  must: 'accent',
  working: 'positive',
  awareness: 'neutral',
  optional: 'spark',
}

export function MasteryBadge({ mastery }: { mastery: Mastery }) {
  return (
    <Badge tone={masteryTone[mastery]} className="shrink-0">
      <span title={masteryLabels[mastery].hint}>{masteryLabels[mastery].label}</span>
    </Badge>
  )
}

/** Shows "All roles" for the shared core rather than four chips. */
export function RoleChips({ roles }: { roles: RoleId[] }) {
  if (roles.length === 4) {
    return <span className="text-xs text-ink-faint">All roles</span>
  }
  return (
    <span className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <span key={role} className="rounded-full border border-line px-2 py-0.5 text-[0.6875rem] text-ink-soft">
          {roleLabels[role]}
        </span>
      ))}
    </span>
  )
}

// ─── Checklist ───────────────────────────────────────────────────────────────

/**
 * A real checkbox semantics-wise (role + aria-checked + Space/Enter via
 * button), with a 44px target, persisted to the local store.
 */
export function CheckItem({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className?: string
}) {
  const { checked, toggle } = useChecklist()
  const on = checked.has(id)
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => toggle(id)}
      className={cn(
        'group flex min-h-11 w-full items-start gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-sunken',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
          on ? 'border-positive-strong bg-positive-strong text-white' : 'border-line-strong bg-surface',
        )}
      >
        {on ? <Check className="size-3.5" /> : null}
      </span>
      <span className={cn('leading-relaxed', on ? 'text-ink-faint line-through decoration-ink-faint/50' : 'text-ink-soft')}>
        {children}
      </span>
    </button>
  )
}

// ─── Resources ───────────────────────────────────────────────────────────────

/**
 * Compact links into the shared, verified library. Cost and credential are
 * separate claims, shown separately — "free to learn" never implies "free
 * certificate".
 */
export function ResourceLinks({ ids, className }: { ids: string[]; className?: string }) {
  const resources = resourcesByIds([...new Set(ids)])
  if (resources.length === 0) return null
  return (
    <ul className={cn('space-y-1', className)}>
      {resources.map((resource) => {
        const costLabel =
          resource.cost === 'free' ? 'Free' : resource.cost === 'free_tier' ? 'Free tier' : 'Paid'
        const credential =
          resource.credential === 'no_certificate' ? null : credentialLabels[resource.credential]
        return (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-11 items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-sunken"
            >
              <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-ink-faint group-hover:text-accent-ink" aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm leading-snug text-ink group-hover:underline">{resource.title}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-faint">
                  <span>{resource.provider}</span>
                  <span aria-hidden>·</span>
                  <span className={resource.cost === 'free' ? 'text-positive-ink' : undefined}>{costLabel}</span>
                  {credential ? (
                    <>
                      <span aria-hidden>·</span>
                      <span>{credential}</span>
                    </>
                  ) : null}
                </span>
                {resource.accessNote && resource.cost !== 'free' ? (
                  <span className="mt-0.5 block text-xs leading-snug text-ink-faint">{resource.accessNote}</span>
                ) : null}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Copyable AI prompts ─────────────────────────────────────────────────────

export function PromptCard({ prompt }: { prompt: CopyPrompt }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">{prompt.label}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink-soft">{prompt.text}</p>
    </div>
  )
}

// ─── Diagrams ────────────────────────────────────────────────────────────────

/** A linear request/data path. Wraps horizontally on wide screens, stacks on phones. */
export function FlowDiagram({ steps, label }: { steps: string[]; label: string }) {
  return (
    <figure aria-label={label} className="rounded-xl border border-line bg-sunken p-3">
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1.5">
        {steps.map((step, index) => (
          <li key={index} className="flex flex-col items-center gap-1 sm:flex-row sm:gap-1.5">
            <span className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-center text-xs leading-snug text-ink sm:w-auto">
              {step}
            </span>
            {index < steps.length - 1 ? (
              <>
                <ArrowDown className="size-3.5 text-ink-faint sm:hidden" aria-hidden />
                <ArrowRight className="hidden size-3.5 text-ink-faint sm:block" aria-hidden />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </figure>
  )
}

// ─── Projects ────────────────────────────────────────────────────────────────

const levelTone: Record<RoadmapProject['level'], 'neutral' | 'accent' | 'spark' | 'positive'> = {
  Beginner: 'neutral',
  Intermediate: 'accent',
  Advanced: 'spark',
  Production: 'positive',
}

export function ProjectCard({ project }: { project: RoadmapProject }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-display text-lg leading-snug text-ink">{project.title}</h4>
        <Badge tone={levelTone[project.level]}>{project.level}</Badge>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{project.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <span key={item} className="rounded-full bg-sunken px-2.5 py-0.5 text-xs text-ink-soft">
            {item}
          </span>
        ))}
      </div>

      {project.flow ? (
        <div className="mt-3">
          <FlowDiagram steps={project.flow} label={`${project.title} architecture`} />
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Must demonstrate</p>
          <ul className="mt-1.5 space-y-1">
            {project.mustDemonstrate.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          {project.stretch?.length ? (
            <>
              <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Stretch</p>
              <ul className="mt-1.5 space-y-1">
                {project.stretch.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Be ready to explain</p>
          <ul className="mt-1.5 space-y-1">
            {project.talkingPoints.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-spark" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">Resources</p>
          <ResourceLinks ids={project.resourceIds} className="mt-1 -ml-2" />
        </div>
      </div>

      <div className="mt-3 border-t border-line pt-2">
        <CheckItem id={projectCheckId(project.id)}>I shipped this, and can demo and defend it</CheckItem>
      </div>
    </Card>
  )
}

export function Bullets({ items, tone = 'ink' }: { items: string[]; tone?: 'ink' | 'positive' | 'critical' }) {
  const dot = tone === 'positive' ? 'bg-positive' : tone === 'critical' ? 'bg-critical' : 'bg-ink-faint'
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
          <span className={cn('mt-2 size-1 shrink-0 rounded-full', dot)} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.12em] text-ink-faint uppercase">{children}</p>
}

// ─── Step status ─────────────────────────────────────────────────────────────

const statusStyles: Record<StepStatus, string> = {
  done: 'bg-positive-soft text-positive-ink',
  skipped: 'bg-sunken text-ink-soft',
  'in-progress': 'bg-accent-soft text-accent-ink',
  'not-started': 'bg-surface text-ink-faint ring-1 ring-line ring-inset',
}

export function StatusChip({ status }: { status: StepStatus }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium', statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}

// ─── Resources grouped by what to open first ─────────────────────────────────

const bucketOrder: Bucket[] = ['start', 'practice', 'deeper', 'reference']

/**
 * A topic's resources, split into "Start here", "Practise", "Go deeper" and
 * "Reference", so the first click is obvious. Each row shows its format,
 * length and whether it carries a free certificate. `format` narrows it to
 * one kind of resource (the Resources tab's filter).
 */
export function GroupedResources({
  ids,
  format,
  certificatesOnly,
}: {
  ids: string[]
  format?: Format | null
  certificatesOnly?: boolean
}) {
  const resources = resourcesByIds([...new Set(ids)]).filter(
    (resource) =>
      (!format || formatOf(resource) === format) && (!certificatesOnly || hasFreeCredential(resource)),
  )
  if (resources.length === 0) return null
  const groups = bucketOrder
    .map((bucket) => ({ bucket, items: resources.filter((resource) => bucketOf(resource) === bucket) }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.bucket}>
          <p className="text-xs font-semibold text-ink">
            {bucketLabels[group.bucket].label}
            <span className="ml-1.5 font-normal text-ink-faint">— {bucketLabels[group.bucket].hint}</span>
          </p>
          <ul className="mt-1 space-y-0.5">
            {group.items.map((resource) => (
              <GroupedRow key={resource.id} resource={resource} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function GroupedRow({ resource }: { resource: Resource }) {
  const certificate = hasFreeCredential(resource)
  const paidCertificate = resource.credential === 'free_course_paid_certificate'
  const costLabel = resource.cost === 'free' ? 'Free' : resource.cost === 'free_tier' ? 'Free tier' : 'Paid'
  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group -mx-2 flex min-h-11 items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-sunken"
      >
        <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-ink-faint group-hover:text-accent-ink" aria-hidden />
        <span className="min-w-0">
          <span className="block text-sm leading-snug text-ink group-hover:underline">{resource.title}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-ink-faint">
            <span>{resource.provider}</span>
            <span aria-hidden>·</span>
            <span>{resourceKindLabels[resource.kind]}</span>
            <span aria-hidden>·</span>
            <span>~{formatMinutes(resource.estimatedMinutes)}</span>
            <span aria-hidden>·</span>
            <span className={resource.cost === 'free' ? 'text-positive-ink' : undefined}>{costLabel}</span>
            {certificate ? (
              <span className="rounded-full bg-positive-soft px-1.5 py-px text-[0.6875rem] font-medium text-positive-ink">
                {credentialLabels[resource.credential]}
              </span>
            ) : paidCertificate ? (
              <span className="rounded-full bg-sunken px-1.5 py-px text-[0.6875rem] text-ink-soft">
                {credentialLabels[resource.credential]}
              </span>
            ) : null}
          </span>
          {resource.cost !== 'free' && resource.accessNote ? (
            <span className="mt-0.5 block text-xs leading-snug text-ink-faint">{resource.accessNote}</span>
          ) : null}
        </span>
      </a>
    </li>
  )
}
