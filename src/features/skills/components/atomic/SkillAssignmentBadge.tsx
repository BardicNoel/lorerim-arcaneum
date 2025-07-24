import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

// Pure presentational component for assignment status
interface SkillAssignmentBadgeProps {
  type: 'major' | 'minor' | 'none'
  size?: 'sm' | 'md' | 'lg'
}

export function SkillAssignmentBadge({ type, size = 'sm' }: SkillAssignmentBadgeProps) {
  const styles = {
    major: 'bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-500',
    minor: 'bg-gray-500 text-white hover:bg-gray-600 border-gray-400', 
    none: 'bg-gray-100 text-gray-800 border border-gray-300'
  }
  
  const labels = {
    major: 'Major',
    minor: 'Minor',
    none: 'Unassigned'
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }
  
  return (
    <Badge className={cn(styles[type], sizeClasses[size])}>
      {labels[type]}
    </Badge>
  )
} 