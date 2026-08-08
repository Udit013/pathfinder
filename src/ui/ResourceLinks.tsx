import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileCode2,
  Code2,
  GraduationCap,
  Map as MapIcon,
  Mic,
  MousePointerClick,
  Play,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { difficultyLabels, resourceKindLabels, type Resource, type ResourceKind } from '@/types'
import { Card, SectionHeading } from './Card'
import { cn, formatMinutes } from '@/lib/utils'

const kindIcons: Record<ResourceKind, LucideIcon> = {
  course: GraduationCap,
  interactive: MousePointerClick,
  docs: FileCode2,
  article: BookOpen,
  youtube_video: Play,
  youtube_playlist: Play,
  youtube_channel: Play,
  book: BookOpen,
  practice: MousePointerClick,
  dataset: FileCode2,
  roadmap: MapIcon,
  github: Code2,
  job_simulation: Briefcase,
  mock_interview: Mic,
}

/**
 * One resource, one click away.
 *
 * PathFinder's job is to be the navigation layer — so the user should never
 * have to go and search for the thing we just told them to learn. Everything
 * needed to decide whether to open it (what it is, who made it, how long, what
 * level, what it costs) is on the row before they click.
 */
export function ResourceRow({ resource }: { resource: Resource }) {
  const Icon = kindIcons[resource.kind]
  const isYouTube = resource.kind === 'youtube_video' || resource.kind === 'youtube_playlist'

  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          'group flex items-start gap-3 rounded-card border border-line bg-surface p-3.5',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'hover:border-line-strong hover:shadow-sm',
        )}
      >
        <span
          className={cn(
            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
            isYouTube ? 'bg-spark-soft text-spark-ink' : 'bg-accent-soft text-accent-ink',
          )}
          aria-hidden
        >
          <Icon className="size-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-snug font-medium text-ink">{resource.title}</span>

          {/* Provider · type · time · level — the four things worth knowing. */}
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-faint">
            <span className="text-ink-soft">{resource.provider}</span>
            <span aria-hidden>·</span>
            <span>{resourceKindLabels[resource.kind]}</span>
            <span aria-hidden>·</span>
            <span>~{formatMinutes(resource.estimatedMinutes)}</span>
            <span aria-hidden>·</span>
            <span>{difficultyLabels[resource.difficulty]}</span>
            {resource.cost === 'free' && resource.verified ? (
              <>
                <span aria-hidden>·</span>
                <span className="text-positive-ink">Free</span>
              </>
            ) : null}
            {!resource.verified ? (
              <>
                <span aria-hidden>·</span>
                <span title="We haven't confirmed this link or its price yet.">
                  Not yet checked
                </span>
              </>
            ) : null}
          </span>

          {resource.durationNote ? (
            <span className="mt-1 block text-xs text-ink-faint">{resource.durationNote}</span>
          ) : null}

          {resource.note ? (
            <span className="mt-1.5 block text-[0.8125rem] leading-snug text-ink-soft">
              {resource.note}
            </span>
          ) : null}

          {resource.accessNote ? (
            <span className="mt-1 block text-xs text-ink-faint">{resource.accessNote}</span>
          ) : null}
        </span>

        <span
          className={cn(
            'mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            'bg-sunken text-ink-soft transition-colors',
            'group-hover:bg-accent group-hover:text-white',
          )}
        >
          <span className="hidden sm:inline">Open</span>
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </a>
    </li>
  )
}

/**
 * A titled block of resources for a skill or task. Renders nothing when there
 * are none, rather than an empty heading.
 */
export function FreeResources({
  resources,
  title = 'Free resources',
  hint,
  bare,
}: {
  resources: Resource[]
  title?: string
  hint?: string
  /** Omits the surrounding card, for use inside one. */
  bare?: boolean
}) {
  if (resources.length === 0) return null

  const allFreeAndVerified = resources.every(
    (resource) => resource.cost === 'free' && resource.verified,
  )

  const body = (
    <>
      <SectionHeading
        title={title}
        hint={
          hint ??
          (allFreeAndVerified
            ? 'All free. Opens in a new tab — no searching required.'
            : 'Opens in a new tab. Check the notes before you commit time.')
        }
      />
      <ul className="space-y-2">
        {resources.map((resource) => (
          <ResourceRow key={resource.id} resource={resource} />
        ))}
      </ul>
      <p className="mt-2.5 text-xs text-ink-faint">
        Links last checked{' '}
        {resources
          .map((resource) => resource.lastVerified)
          .filter(Boolean)
          .sort()
          .at(-1) ?? 'not yet'}
        . If one has moved, it&rsquo;s the link that&rsquo;s wrong, not you.
      </p>
    </>
  )

  if (bare) return <section>{body}</section>

  return (
    <Card tone="sunken" className="p-4">
      {body}
    </Card>
  )
}
