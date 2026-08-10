import React from 'react'

type IconVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'

type IconSize = 'sm' | 'md' | 'lg'

interface IconProps {
  children: React.ReactNode
  variant?: IconVariant
  size?: IconSize
  disabled?: boolean
  className?: string
}

// Per-variant colour map. Pairs each theme colour with a readable text colour
// so the icon glyph stays legible against the tinted circular background.
const variantStyles: Record<
  IconVariant,
  { bg: string; text: string }
> = {
  primary:   { bg: 'bg-primary/15',   text: 'text-primary' },
  secondary: { bg: 'bg-secondary/15', text: 'text-secondary' },
  success:   { bg: 'bg-success/15',   text: 'text-success' },
  danger:    { bg: 'bg-danger/15',    text: 'text-danger' },
  warning:   { bg: 'bg-warning/15',   text: 'text-warning' },
}

// Size tokens control the diameter of the circle and the inner icon glyph
// size. Defaults to `md` when no preference is passed.
const sizeStyles: Record<IconSize, string> = {
  sm: 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4',
  md: 'w-12 h-12 [&>svg]:w-6 [&>svg]:h-6',
  lg: 'w-16 h-16 [&>svg]:w-8 [&>svg]:h-8',
}

function Icon({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: IconProps) {
  const v = variantStyles[variant]

  const classes = [
    'inline-flex items-center justify-center',
    'rounded-full',
    'flex-shrink-0',
    v.bg,
    v.text,
    sizeStyles[size],
    disabled ? 'opacity-50' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

export default Icon
