import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: 'Human' | 'Elf' | 'Beast'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const categoryStyles: Record<'Human' | 'Elf' | 'Beast', string> = {
  Human: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  Elf: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  Beast: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={cn(
        categoryStyles[category],
        sizeClasses[size],
        'font-medium transition-colors',
        className
      )}
    >
      {category}
    </Badge>
  )
} 