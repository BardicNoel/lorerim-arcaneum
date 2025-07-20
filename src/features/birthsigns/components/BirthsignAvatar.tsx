import React from 'react'
import { EntityAvatar } from '@/shared/components/generic'

interface BirthsignAvatarProps {
  birthsignName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Birthsign-specific avatar component that uses the generic EntityAvatar.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function BirthsignAvatar({
  birthsignName,
  size = 'md',
  className,
}: BirthsignAvatarProps) {
  return (
    <EntityAvatar
      entityName={birthsignName}
      entityType="birthsign"
      size={size}
      className={className}
    />
  )
} 