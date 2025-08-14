import { CategoryBadge as GenericCategoryBadge } from '@/shared/components/generic'

interface ReligionCategoryBadgeProps {
  category: 'Divine' | 'Daedric' | 'Tribunal' | 'Ancestor' | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Religion-specific category badge component that uses the generic CategoryBadge.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function ReligionCategoryBadge({
  category,
  size = 'md',
  className,
}: ReligionCategoryBadgeProps) {
  return (
    <GenericCategoryBadge
      category={category}
      categoryType="religion"
      size={size}
      className={className}
    />
  )
}
