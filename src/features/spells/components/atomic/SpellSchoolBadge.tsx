import { cn } from '@/lib/utils'

interface SpellSchoolBadgeProps {
  school: string
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

const schoolColors: Record<string, string> = {
  'Alteration': 'bg-blue-500 text-white',
  'Conjuration': 'bg-purple-500 text-white',
  'Destruction': 'bg-red-500 text-white',
  'Illusion': 'bg-indigo-500 text-white',
  'Restoration': 'bg-green-500 text-white',
  'Mysticism': 'bg-yellow-500 text-white',
}

export function SpellSchoolBadge({ 
  school, 
  size = 'md', 
  variant = 'default',
  className 
}: SpellSchoolBadgeProps) {
  const colorClass = schoolColors[school] || 'bg-gray-500 text-white'
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        variant === 'default' ? colorClass : variantClasses[variant],
        className
      )}
    >
      {school}
    </span>
  )
}
