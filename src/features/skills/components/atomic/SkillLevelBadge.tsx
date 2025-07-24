import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

// Pure presentational component for skill level display
interface SkillLevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

export function SkillLevelBadge({ level, size = 'sm' }: SkillLevelBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }
  
  // Only render if level is greater than 0
  if (level <= 0) {
    return null
  }
  
  return (
    <Badge 
      variant="secondary" 
      className={cn("bg-blue-100 text-blue-800 border-blue-200", sizeClasses[size])}
    >
      Min: Level {level}
    </Badge>
  )
} 