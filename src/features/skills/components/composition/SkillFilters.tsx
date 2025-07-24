import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { SkillCategoryBadge } from '../atomic/SkillCategoryBadge'

// Component for skill filtering by category
interface SkillFiltersProps {
  categories: string[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  className?: string
}

export function SkillFilters({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className 
}: SkillFiltersProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(null)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
} 