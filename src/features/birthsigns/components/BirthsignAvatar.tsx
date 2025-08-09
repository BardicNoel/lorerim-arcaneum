import React from 'react'
import { EntityAvatar } from '@/shared/components/generic'
import { cn } from '@/lib/utils'

interface BirthsignAvatarProps {
  birthsignName: string
  group?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

/**
 * Birthsign-specific avatar component that uses the generic EntityAvatar.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function BirthsignAvatar({
  birthsignName,
  group,
  size = '2xl',
  className,
}: BirthsignAvatarProps) {
  return (
    <EntityAvatar
      entityName={birthsignName}
      entityType="birthsign"
      size={size}
      className={cn(
        // Solid circle background and high-contrast ring that adapts to theme
        'rounded-full bg-background dark:bg-input/30 shadow-sm border-2 border-black dark:border-white p-[2px]',
        className
      )}
      imageClassName={cn(
        // Scale icon to be very close to the ring
        'scale-110'
      )}
    />
  )
}
