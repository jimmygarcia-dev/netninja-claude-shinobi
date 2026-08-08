interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'black' | 'white'
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-200 outline-none focus:ring-3 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
  
  const variantClasses = {
    primary: 'bg-gradient-to-b from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 focus:ring-primary/30 border-b-4 border-primary/60',
    secondary: 'bg-gradient-to-b from-secondary to-secondary/80 text-white dark:text-black hover:from-secondary/90 hover:to-secondary/70 focus:ring-secondary/30 border-b-4 border-secondary/60',
    success: 'bg-gradient-to-b from-success to-success/80 text-white hover:from-success/90 hover:to-success/70 focus:ring-success/30 border-b-4 border-success/60',
    warning: 'bg-gradient-to-b from-warning to-warning/80 text-white hover:from-warning/90 hover:to-warning/70 focus:ring-warning/30 border-b-4 border-warning/60',
    danger: 'bg-gradient-to-b from-danger to-danger/80 text-white hover:from-danger/90 hover:to-danger/70 focus:ring-danger/30 border-b-4 border-danger/60',
    black: 'bg-gradient-to-b from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900 focus:ring-black/30 border-b-4 border-black',
    white: 'bg-gradient-to-b from-white to-gray-100 text-black hover:from-gray-50 hover:to-gray-200 focus:ring-white/30 border-b-4 border-gray-300'
  }

  const buttonClass = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button