import { cn } from '@/lib/utils'

interface SpellLevelBadgeProps {
  level: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-border bg-background text-foreground',
  ghost: 'bg-muted text-muted-foreground',
}

const levelColors: Record<string, string> = {
  'Novice': 'bg-gray-500 text-white',
  'Apprentice': 'bg-green-500 text-white',
  'Adept': 'bg-blue-500 text-white',
  'Expert': 'bg-purple-500 text-white',
  'Master': 'bg-yellow-500 text-black',
}

const levelOrder = {
  'Novice': 1,
  'Apprentice': 2,
  'Adept': 3,
  'Expert': 4,
  'Master': 5,
}

export function SpellLevelBadge({ 
  level, 
  size = 'md', 
  variant = 'default',
  className 
}: SpellLevelBadgeProps) {
  const colorClass = levelColors[level] || 'bg-gray-500 text-white'
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        variant === 'default' ? colorClass : variantClasses[variant],
        className
      )}
      title={`Level ${levelOrder[level as keyof typeof levelOrder] || 0}`}
    >
      {level}
    </span>
  )
}
