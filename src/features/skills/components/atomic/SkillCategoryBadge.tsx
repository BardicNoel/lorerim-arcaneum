import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

// Pure presentational component for category display
interface SkillCategoryBadgeProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
}

export function SkillCategoryBadge({ category, size = 'sm' }: SkillCategoryBadgeProps) {
  const categoryStyles = {
    Combat: 'bg-red-100 text-red-800 border-red-200',
    Magic: 'bg-blue-100 text-blue-800 border-blue-200',
    Stealth: 'bg-green-100 text-green-800 border-green-200',
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        categoryStyles[category as keyof typeof categoryStyles] || 'bg-gray-100 text-gray-800 border-gray-300', 
        sizeClasses[size]
      )}
    >
      {category}
    </Badge>
  )
} 