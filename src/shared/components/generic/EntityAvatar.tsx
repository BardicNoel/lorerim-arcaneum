import { cn } from '@/lib/utils'
import { getDataUrl } from '@/shared/utils/baseUrl'
import React from 'react'

/**
 * Entity type definitions for avatar mapping
 */
export type EntityType = 'race' | 'religion' | 'trait' | 'destiny' | 'birthsign'

/**
 * Avatar size options
 */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

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

// Avatar file mapping for different entity types
const entityAvatarMaps: Record<EntityType, Record<string, string>> = {
  race: {
    Altmer: 'altmer.svg',
    Argonian: 'argonian.svg',
    Bosmer: 'woodelf.svg',
    Breton: 'breton.svg',
    Dunmer: 'dunmer.svg',
    Imperial: 'imperial.svg',
    Khajiit: 'khajit.svg',
    Nord: 'nord.svg',
    Orsimer: 'orc.svg',
    Redguard: 'redguard.svg',
  },
  religion: {
    // Add religion avatars as they become available
  },
  trait: {
    // Add trait avatars as they become available
  },
  destiny: {
    // Add destiny avatars as they become available
  },
  birthsign: {
    // Case-sensitive filenames must match assets in public/assets/sign-avatar/
    Warrior: 'Warrior.svg',
    Lady: 'Lady.svg',
    Lord: 'Lord.svg',
    Steed: 'Steed.svg',
    Mage: 'Mage.svg',
    Apprentice: 'Apprentice.svg',
    Atronach: 'Atronach.svg',
    Ritual: 'Ritual.svg',
    Thief: 'Thief.svg',
    Lover: 'Lover.svg',
    Shadow: 'Shadow.svg',
    Tower: 'Tower.svg',
    Serpent: 'Serpent.svg',
  },
}

// Size classes for consistent sizing
const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-16 h-16', // 64px (w-16 = 4rem = 64px)
  '3xl': 'w-24 h-24', // 96px (w-24 = 6rem = 96px)
  '4xl': 'w-32 h-32', // 128px (w-32 = 8rem = 128px)
}

// Text size classes for fallback avatars
const textSizeClasses: Record<AvatarSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

export function EntityAvatar({
  entityName,
  entityType,
  size = 'md',
  className,
}: EntityAvatarProps) {
  const avatarMap = entityAvatarMaps[entityType]
  const avatarFileName = avatarMap[entityName]
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
  // Neutral background; icon itself will invert in dark mode for contrast
  const containerBgClass = 'bg-muted'

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center',
        containerBgClass,
        sizeClasses[size],
        className
      )}
    >
      <img
        src={getDataUrl(
          `assets/${entityType === 'birthsign' ? 'sign-avatar' : `${entityType}-avatar`}/${avatarFileName}`
        )}
        alt={`${entityName} avatar`}
        className="w-full h-full object-contain dark:invert"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
}
