import { cn } from '@/lib/utils'
import React from 'react'

/**
 * Avatar size options
 */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

/**
 * Pure presentation component for entity avatars.
 * Handles styling, sizing, and fallback behavior.
 * Feature layers are responsible for providing the correct image source.
 *
 * @param imgSrc - The source URL for the avatar image
 * @param alt - Alt text for the image
 * @param size - The size of the avatar
 * @param className - Additional CSS classes for the container
 * @param imageClassName - Additional CSS classes for the image
 * @param showBorder - Whether to show a border around the avatar (useful for skills)
 */
interface EntityAvatarProps {
  imgSrc?: string
  alt: string
  size?: AvatarSize
  className?: string
  imageClassName?: string
  showBorder?: boolean
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
  imgSrc,
  alt,
  size = 'md',
  className,
  imageClassName,
  showBorder = false,
}: EntityAvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  // Fallback to first letter avatar if no image or error
  if (!imgSrc || imageError) {
    return (
      <div
        className={cn(
          // White circular background with black text in both light and dark modes
          'bg-white dark:bg-white text-black dark:text-black rounded-full flex items-center justify-center font-bold',
          sizeClasses[size],
          className
        )}
      >
        <span className={cn(textSizeClasses[size])}>{alt.charAt(0)}</span>
      </div>
    )
  }

  // Return image avatar
  // White circular background across themes; keep icon strokes black (no dark invert)
  const containerBgClass = 'bg-white dark:bg-white'

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center relative',
        containerBgClass,
        sizeClasses[size],
        className
      )}
    >
      {showBorder && (
        <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white pointer-events-none" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          showBorder
            ? 'w-3/4 h-3/4 object-contain'
            : 'w-full h-full object-contain',
          imageClassName
        )}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
}
