import { cn } from '@/lib/utils'
import { schoolBadgeColors, badgeSizeClasses } from '../../config/spellConfig'

interface SpellSchoolBadgeProps {
  school: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-border bg-background text-foreground',
  ghost: 'bg-muted text-muted-foreground',
}

export function SpellSchoolBadge({ 
  school, 
  size = 'md', 
  variant = 'default',
  className 
}: SpellSchoolBadgeProps) {
  const colorClass = schoolBadgeColors[school] || 'bg-gray-500 text-white'
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        badgeSizeClasses[size],
        variant === 'default' ? colorClass : variantClasses[variant],
        className
      )}
    >
      {school}
    </span>
  )
}
