import { Check, Circle, Clock, Lock, Play } from 'lucide-react'
import type { ResolvedNode } from '@/domain/roadmap'
import { importanceLabels, nodeStateLabels } from '@/domain/roadmap'
import { cn } from '@/lib/utils'

/**
 * One node in the skill tree.
 *
 * A locked node is still clickable. The lock icon means "this gets easier
 * after its prerequisites", not "you may not". Someone who already knows a
 * prerequisite from elsewhere shouldn't have to game our graph to proceed.
 */
export function SkillNode({
  entry,
  onOpen,
  selected,
}: {
  entry: ResolvedNode
  onOpen: () => void
  selected: boolean
}) {
  const { node, state, skill } = entry
  if (!skill) return null

  const Icon =
    state === 'completed' ? Check : state === 'in_progress' ? Play : state === 'locked' ? Lock : Circle

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      className={cn(
        'group flex w-full items-start gap-2.5 rounded-card border p-3 text-left',
        'transition-[border-color,background-color,box-shadow,transform] duration-150',
        'active:scale-[0.99]',
        state === 'completed' && 'border-positive/40 bg-positive-soft',
        state === 'in_progress' && 'border-accent bg-accent-soft shadow-xs',
        state === 'available' && 'border-line bg-surface hover:border-line-strong hover:shadow-sm',
        state === 'locked' && 'border-dashed border-line bg-surface/60',
        selected && 'ring-2 ring-accent-ring ring-offset-2 ring-offset-canvas',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          state === 'completed' && 'bg-positive text-white',
          state === 'in_progress' && 'bg-accent text-white',
          state === 'available' && 'bg-sunken text-ink-faint',
          state === 'locked' && 'bg-sunken text-ink-faint',
        )}
      >
        <Icon className="size-3.5" strokeWidth={state === 'completed' ? 3 : 2} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-sm leading-snug font-medium',
            state === 'completed' ? 'text-positive-ink' : state === 'locked' ? 'text-ink-soft' : 'text-ink',
          )}
        >
          {skill.name}
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-faint">
          <span
            className={cn(
              node.importance === 'core' && state !== 'completed' && 'text-accent-ink',
              node.importance === 'optional' && 'italic',
            )}
          >
            {importanceLabels[node.importance]}
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />~{skill.estimatedHours}h
          </span>
          {state !== 'available' ? (
            <>
              <span aria-hidden>·</span>
              <span>{nodeStateLabels[state]}</span>
            </>
          ) : null}
        </span>
      </span>
    </button>
  )
}
