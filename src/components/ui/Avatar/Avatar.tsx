type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  // Source for the initials — typically a user's display name. Falls back
  // to a generic "?" when missing/blank so the circle never renders empty.
  name?: string
  size?: AvatarSize
  className?: string
  // Forwarded for accessibility — mirrors the underlying author's name so
  // screen readers announce something meaningful on the byline chip.
  title?: string
}

// Pull up to two leading uppercase letters. Hyphenated and whitespace-
// separated names both collapse cleanly: "Ada Lovelace" -> "AL",
// "jane-doe" -> "JD", "x" -> "X". Returns "?" when there's nothing to use.
function getInitials(name: string | undefined): string {
  if (!name) return '?'
  const cleaned = name.trim()
  if (!cleaned) return '?'

  const parts = cleaned.split(/[\s-]+/).filter(Boolean)
  if (parts.length === 0) return '?'

  const first = parts[0].charAt(0)
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ''
  return (first + second).toUpperCase()
}

// Size → dimension + font-size map. Kept here rather than in Tailwind
// classes so the chip stays a true square at every breakpoint.
const sizeStyles: Record<AvatarSize, { box: string; text: string }> = {
  sm: { box: 'w-8 h-8',  text: 'text-xs' },
  md: { box: 'w-10 h-10', text: 'text-sm' },
  lg: { box: 'w-16 h-16', text: 'text-xl' },
}

function Avatar({
  name,
  size = 'sm',
  className = '',
  title,
}: AvatarProps) {
  const s = sizeStyles[size]
  const initials = getInitials(name)

  const wrapperClasses = [
    s.box,
    // Matches the existing blog list chip: primary→accent gradient, white
    // initial, perfectly round. `shrink-0` so it stays a circle when
    // squeezed into a flex byline.
    'shrink-0',
    'rounded-full',
    'bg-gradient-to-br from-primary to-accent',
    'flex items-center justify-center',
    'text-white font-semibold',
    s.text,
    'select-none',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={wrapperClasses}
      role="img"
      // Prefer the explicit title (e.g. author name) so the byline reads
      // naturally to screen readers; fall back to initials when missing.
      aria-label={title ?? (name ? `${name} avatar` : 'avatar')}
    >
      {initials}
    </span>
  )
}

export default Avatar
