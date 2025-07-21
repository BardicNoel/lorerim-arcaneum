import React from 'react'
import { cn } from '@/lib/utils'
import { getAvatarFileName } from '@/shared/config/avatars'

/**
 * Entity type definitions for avatar mapping
 */
export type EntityType = 'race' | 'religion' | 'trait' | 'destiny' | 'birthsign'

/**
 * Avatar size options
 */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Centralized avatar management for all entity types.
 * Provides consistent avatar display with fallback behavior.
 *
 * @param entityName - The name of the entity
 * @param entityType - The type of entity (race, religion, trait, destiny)
 * @param size - The size of the avatar
 * @param className - Additional CSS classes
 */
interface EntityAvatarProps {
  entityName: string
  entityType: EntityType
  size?: AvatarSize
  className?: string
}

// Size classes for consistent sizing
const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

// Text size classes for fallback avatars
const textSizeClasses: Record<AvatarSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
}

export function EntityAvatar({
  entityName,
  entityType,
  size = 'md',
  className,
}: EntityAvatarProps) {
  const avatarFileName = getAvatarFileName(entityType, entityName)
  const [imageError, setImageError] = React.useState(false)

  // Fallback to first letter avatar if no image or error
  if (!avatarFileName || imageError) {
    return (
      <div
        className={cn(
          'bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground',
          sizeClasses[size],
          className
        )}
      >
        <span className={cn(textSizeClasses[size])}>
          {entityName.charAt(0)}
        </span>
      </div>
    )
  }

  // Return image avatar
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-muted flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/${entityType === 'birthsign' ? 'sign-avatar' : `${entityType}-avatar`}/${avatarFileName}`}
        alt={`${entityName} avatar`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
}
