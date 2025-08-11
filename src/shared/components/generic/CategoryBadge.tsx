import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

/**
 * Entity type definitions for category styling
 */
export type EntityType = 'race' | 'religion' | 'trait' | 'destiny'

/**
 * Badge size options
 */
export type BadgeSize = 'sm' | 'md' | 'lg'

/**
 * Consistent category styling across all features.
 * Provides type-safe category display with entity-specific styling.
 *
 * @param category - The category name to display
 * @param categoryType - The type of entity (race, religion, trait, destiny)
 * @param size - The size of the badge
 * @param className - Additional CSS classes
 */
interface CategoryBadgeProps {
  category: string
  categoryType: EntityType
  size?: BadgeSize
  className?: string
}

// Category styling for different entity types
const categoryStyles: Record<EntityType, Record<string, string>> = {
  race: {
    Human: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    Elf: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    Beast:
      'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  },
  religion: {
    Divine:
      'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    Daedric: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    Tribunal: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    Ancestor:
      'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  },
  trait: {
    // Add trait categories as they become available
    // Example: 'Combat': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
  },
  destiny: {
    // Add destiny categories as they become available
    // Example: 'Warrior': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
  },
}

// Size classes for consistent sizing
const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

// Default fallback styling for unknown categories
const defaultCategoryStyle =
  'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'

export function CategoryBadge({
  category,
  categoryType,
  size = 'md',
  className,
}: CategoryBadgeProps) {
  // Get the appropriate styling for this entity type and category
  const entityStyles = categoryStyles[categoryType]
  const categoryStyle = entityStyles[category] || defaultCategoryStyle

  return (
    <Badge
      variant="outline"
      className={cn(
        categoryStyle,
        sizeClasses[size],
        'font-medium transition-colors',
        className
      )}
    >
      {category}
    </Badge>
  )
}
