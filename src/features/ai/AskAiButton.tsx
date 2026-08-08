import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { PromptKind } from '@/domain/aiContext'
import { Button } from '@/ui/Button'
import { AiCompanion } from './AiCompanion'
import { cn } from '@/lib/utils'

/**
 * The way into the AI Companion from anywhere.
 *
 * Deliberately not a nav item — navigation stays at six, and this is a tool you
 * reach for while doing something else rather than a place you go. It's placed
 * where a prompt is actually useful: Today, Roadmap, Build, Interview Prep.
 */
export function AskAiButton({
  kind,
  label = 'Ask ChatGPT or Claude',
  variant = 'secondary',
  size = 'sm',
  className,
}: {
  /** Pre-selects the relevant action for wherever this sits. */
  kind?: PromptKind
  label?: string
  variant?: 'secondary' | 'ghost' | 'soft'
  size?: 'sm' | 'md'
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        <Sparkles className="size-3.5" aria-hidden />
        {label}
      </Button>
      <AiCompanion open={open} onClose={() => setOpen(false)} initialKind={kind} />
    </>
  )
}

/** Header version: an icon at rest, labelled for assistive tech. */
export function AskAiIconButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask ChatGPT or Claude"
        title="Ask ChatGPT or Claude"
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full',
          'text-ink-faint transition-colors hover:bg-accent-soft hover:text-accent-ink',
        )}
      >
        <Sparkles className="size-4" aria-hidden />
      </button>
      <AiCompanion open={open} onClose={() => setOpen(false)} />
    </>
  )
}
