import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const control =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink ' +
  'placeholder:text-ink-faint transition-colors hover:border-line-strong ' +
  'focus:border-accent focus:outline-none focus-visible:outline-none'

export function Field({
  label,
  hint,
  children,
  htmlFor,
  className,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
  htmlFor?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint ? <p className="text-xs leading-relaxed text-ink-soft">{hint}</p> : null}
      {children}
    </div>
  )
}

export function TextInput({
  label,
  hint,
  className,
  ...rest
}: { label: string; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <input id={id} className={control} {...rest} />
    </Field>
  )
}

export function TextArea({
  label,
  hint,
  className,
  rows = 3,
  ...rest
}: { label: string; hint?: ReactNode } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Field label={label} hint={hint} htmlFor={id} className={className}>
      <textarea id={id} rows={rows} className={cn(control, 'resize-y')} {...rest} />
    </Field>
  )
}

/**
 * A selectable card. Used everywhere the user picks from a small set — it reads
 * as a choice rather than a form control, which suits onboarding.
 */
export function ChoiceCard({
  selected,
  onToggle,
  title,
  description,
  meta,
  multi,
  disabled,
}: {
  selected: boolean
  onToggle: () => void
  title: string
  description?: string
  meta?: ReactNode
  /** Renders as a checkbox rather than a radio for screen readers. */
  multi?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-card border p-3.5 text-left',
        'transition-[border-color,background-color,box-shadow] duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        selected
          ? 'border-accent bg-accent-soft shadow-xs'
          : 'border-line bg-surface hover:border-line-strong hover:bg-sunken',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex size-4.5 shrink-0 items-center justify-center border transition-colors',
          multi ? 'rounded-[0.3rem]' : 'rounded-full',
          selected ? 'border-accent bg-accent text-white' : 'border-line-strong bg-surface',
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-sm font-medium',
            selected ? 'text-accent-ink' : 'text-ink',
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-soft">
            {description}
          </span>
        ) : null}
        {meta ? <span className="mt-2 flex flex-wrap gap-1.5">{meta}</span> : null}
      </span>
    </button>
  )
}
