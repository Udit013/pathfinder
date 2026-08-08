import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Sparkles, X } from 'lucide-react'
import type { PromptKind } from '@/domain/aiContext'
import { aiTools, availableActions, buildPrompt } from '@/domain/aiContext'
import { Button } from '@/ui/Button'
import { Badge } from '@/ui/Badge'
import { useAppStore } from '@/lib/store/useAppStore'
import { cn } from '@/lib/utils'

/**
 * The AI Companion (§25).
 *
 * PathFinder is not an AI and does not talk to one. It knows where you are, so
 * it writes the question — you take it to ChatGPT or Claude, which are good at
 * answering. No API, no key, no backend, and nothing leaves the device unless
 * the person pastes it somewhere themselves.
 *
 * The prompt is always shown and always editable before copying. Generating
 * text on someone's behalf and hiding it would be the wrong shape for this.
 */
export function AiCompanion({
  open,
  onClose,
  initialKind,
}: {
  open: boolean
  onClose: () => void
  initialKind?: PromptKind
}) {
  const state = useAppStore()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [kind, setKind] = useState<PromptKind | null>(initialKind ?? null)
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)

  const actions = useMemo(() => availableActions(state), [state])
  const built = useMemo(() => (kind ? buildPrompt(kind, state) : null), [kind, state])

  // Regenerate the draft when a different action is chosen, but never overwrite
  // edits the user has already made to the current one.
  useEffect(() => {
    if (built) setDraft(built.text)
    setCopied(false)
  }, [built])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Focus the panel so screen readers announce it and Escape works at once.
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) setKind(initialKind ?? null)
  }, [open, initialKind])

  if (!open) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-companion-title"
        tabIndex={-1}
        className={cn(
          'animate-rise relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-canvas shadow-lg focus:outline-none',
          'rounded-t-panel sm:max-w-2xl sm:rounded-panel',
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-line px-5 py-4">
          <span
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink"
            aria-hidden
          >
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="ai-companion-title" className="font-display text-lg leading-tight text-ink">
              Ask ChatGPT or Claude
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              PathFinder writes the question using what it knows about where you are. You take it
              to the AI you already use.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-sunken hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {/* Action picker */}
          <fieldset>
            <legend className="text-xs tracking-[0.14em] text-ink-faint uppercase">
              What do you want help with?
            </legend>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {actions.map((action) => {
                const disabled = Boolean(action.unavailableReason)
                const selected = kind === action.kind
                return (
                  <button
                    key={action.kind}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    onClick={() => setKind(action.kind)}
                    title={action.unavailableReason}
                    className={cn(
                      'rounded-card border p-3 text-left transition-all duration-150',
                      'active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55',
                      selected
                        ? 'border-accent bg-accent-soft'
                        : 'border-line bg-surface hover:border-line-strong',
                    )}
                  >
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        selected ? 'text-accent-ink' : 'text-ink',
                      )}
                    >
                      {action.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-ink-soft">
                      {action.unavailableReason ?? action.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* The prompt */}
          {built ? (
            <div className="animate-rise mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="ai-prompt"
                  className="text-xs tracking-[0.14em] text-ink-faint uppercase"
                >
                  Your prompt — edit it freely
                </label>
                {draft !== built.text ? (
                  <button
                    type="button"
                    onClick={() => setDraft(built.text)}
                    className="text-xs font-medium text-accent-ink hover:underline"
                  >
                    Reset to generated
                  </button>
                ) : null}
              </div>

              <textarea
                id="ai-prompt"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={12}
                spellCheck={false}
                className={cn(
                  'mt-2 w-full rounded-card border border-line bg-surface p-3.5',
                  'font-mono text-[0.8125rem] leading-relaxed text-ink',
                  'focus:border-accent focus:outline-none',
                )}
              />

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-ink-faint">Includes:</span>
                {built.includes.map((item) => (
                  <Badge key={item} tone="neutral">
                    {item}
                  </Badge>
                ))}
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                Your work-authorisation notes, location, and private reflections are deliberately
                left out. Add anything you want by editing above — nothing is sent anywhere by
                PathFinder either way.
              </p>
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-ink-soft">
              Pick one above and PathFinder will write the prompt for you.
            </p>
          )}
        </div>

        {/* Actions */}
        {built ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-line bg-sunken px-5 py-3.5">
            <Button onClick={copy}>
              {copied ? (
                <>
                  <Check className="size-4" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" aria-hidden />
                  Copy prompt
                </>
              )}
            </Button>

            {aiTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4',
                  'text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink',
                )}
              >
                Open {tool.label}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ))}

            <p className="w-full text-xs text-ink-faint sm:w-auto sm:flex-1 sm:text-right">
              Copy first — the link just opens the site.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
