import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

// Pure presentational component for perk count display
interface SkillPerkCountBadgeProps {
  count: string
  size?: 'sm' | 'md' | 'lg'
}

export function SkillPerkCountBadge({ count, size = 'sm' }: SkillPerkCountBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }
  
  return (
    <Badge 
      variant="secondary" 
      className={cn("bg-purple-100 text-purple-800 border-purple-200", sizeClasses[size])}
    >
      {count} Perks
    </Badge>
  )
} 