import React from 'react'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'

type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  disabled?: boolean
  className?: string
}

// Per-variant colour map. Pairs each theme colour with a readable text colour
// and a tinted background so badges work on both light and dark surfaces.
const variantStyles: Record<
  BadgeVariant,
  { bg: string; text: string; border: string }
> = {
  primary:   { bg: 'bg-primary/15',     text: 'text-primary',   border: 'border-primary/40' },
  secondary: { bg: 'bg-secondary/15',   text: 'text-secondary', border: 'border-secondary/40' },
  success:   { bg: 'bg-success/15',     text: 'text-success',   border: 'border-success/40' },
  danger:    { bg: 'bg-danger/15',      text: 'text-danger',    border: 'border-danger/40' },
  warning:   { bg: 'bg-warning/15',     text: 'text-warning',   border: 'border-warning/40' },
}

// Size tokens control padding and font-size. Defaults to `md` when no
// preference is passed.
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

function Badge({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: BadgeProps) {
  const v = variantStyles[variant]

  const classes = [
    'inline-flex items-center justify-center',
    'rounded-full border',
    'font-medium',
    v.bg,
    v.text,
    v.border,
    sizeStyles[size],
    disabled ? 'opacity-50' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

export default Badge
