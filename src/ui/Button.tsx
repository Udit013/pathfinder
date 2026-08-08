import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[background-color,color,box-shadow,transform] duration-150 ' +
  'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 ' +
  'whitespace-nowrap select-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white shadow-xs hover:bg-accent-hover',
  secondary:
    'bg-surface text-ink border border-line hover:border-line-strong hover:bg-sunken shadow-xs',
  ghost: 'text-ink-soft hover:text-ink hover:bg-sunken',
  soft: 'bg-accent-soft text-accent-ink hover:bg-accent-soft-hover',
  danger: 'bg-critical-soft text-critical-ink hover:brightness-[0.97]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
}

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
}: CommonProps & { to: string }) {
  return (
    <Link
      to={to}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {children}
    </Link>
  )
}
