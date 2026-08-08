type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'black'
  | 'white'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

// Per-variant colour map. `bg` is the main face, `shadow` is the darker
// underside that creates the 3D lift, `gloss` is the lighter top highlight
// that gives the glossy plastic look, and `ring` tints the focus ring.
const variantStyles: Record<
  ButtonVariant,
  { bg: string; shadow: string; gloss: string; ring: string; text: string }
> = {
  primary:   { bg: 'bg-primary',   shadow: 'bg-primary/70',   gloss: 'bg-white/30',   ring: 'ring-primary/30',   text: 'text-white' },
  secondary: { bg: 'bg-secondary', shadow: 'bg-secondary/70', gloss: 'bg-white/30',   ring: 'ring-secondary/30', text: 'text-white dark:text-black' },
  success:   { bg: 'bg-success',   shadow: 'bg-success/70',   gloss: 'bg-white/30',   ring: 'ring-success/30',   text: 'text-white' },
  warning:   { bg: 'bg-warning',   shadow: 'bg-warning/70',   gloss: 'bg-white/30',   ring: 'ring-warning/30',   text: 'text-white' },
  danger:    { bg: 'bg-danger',    shadow: 'bg-danger/70',    gloss: 'bg-white/30',   ring: 'ring-danger/30',    text: 'text-white' },
  black:     { bg: 'bg-black',     shadow: 'bg-black/70',     gloss: 'bg-white/25',   ring: 'ring-black/30',     text: 'text-white' },
  white:     { bg: 'bg-white',     shadow: 'bg-gray-300',     gloss: 'bg-white/60',   ring: 'ring-black/20',     text: 'text-black' },
}

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const v = variantStyles[variant]

  // The 3D look is built from two stacked layers:
  //   - a "shadow" strip on the bottom (darker shade, no rounding on top)
  //   - the main face on top with rounded corners, gradient + gloss overlay
  // The whole thing is rendered in a wrapper so the shadow sits flush
  // underneath, giving the illusion the button is a physical pill.
  const wrapperClasses = [
    'relative inline-block align-middle',
    'rounded-full',
    // Bottom shadow strip — slightly darker face, sits behind the top
    v.shadow,
    // Press-down state: nudge the whole button down 1px so the shadow shrinks
    'transition-transform duration-150',
    'active:translate-y-0.5',
    'shadow-md shadow-black/20',
    // Focus ring on the wrapper so it surrounds the whole 3D shape
    'focus-within:ring-3 focus-within:' + v.ring,
    // Disabled dims the whole stack
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const faceClasses = [
    'relative',
    'block w-full',
    'px-6 py-3',
    'rounded-full',
    v.bg,
    v.text,
    'font-medium',
    // Inset highlights for the glossy 3D effect:
    //   - top inner highlight (light line near the top edge)
    //   - bottom inner shadow (subtle dark line near the bottom edge)
    "before:content-[''] before:absolute before:inset-0 before:rounded-full",
    "before:bg-gradient-to-b before:from-white/25 before:via-white/5 before:to-transparent",
    "before:pointer-events-none",
    // Reset the native button so the wrapper handles the visual style
    'outline-none border-0',
    'transition-[filter,transform] duration-150',
    'hover:brightness-105',
    'active:brightness-95',
    // Forwards disabled so it greys out
    disabled ? 'pointer-events-none' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      <button
        className={faceClasses}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </span>
  )
}

export default Button
