interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient'
  className?: string
}

function Avatar({ 
  name, 
  size = 'md', 
  variant = 'gradient',
  className = ''
}: AvatarProps) {
  const initial = name.charAt(0).toUpperCase()
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }
  
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white dark:text-black',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-danger text-white',
    gradient: 'bg-gradient-to-br from-primary to-accent text-white'
  }

  const baseClasses = 'rounded-full flex items-center justify-center font-semibold flex-shrink-0'

  const avatarClass = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={avatarClass}>
      {initial}
    </div>
  )
}

export default Avatar