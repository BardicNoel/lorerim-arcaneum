import React from 'react'
import { CategoryBadge as GenericCategoryBadge } from '@/shared/components/generic'

interface CategoryBadgeProps {
  category: 'Human' | 'Elf' | 'Beast'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Race-specific category badge component that uses the generic CategoryBadge.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function CategoryBadge({
  category,
  size = 'md',
  className,
}: CategoryBadgeProps) {
  return (
    <GenericCategoryBadge
      category={category}
      categoryType="race"
      size={size}
      className={className}
    />
  )
}
