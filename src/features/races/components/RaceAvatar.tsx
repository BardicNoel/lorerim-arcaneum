import React from 'react'
import { EntityAvatar } from '@/shared/components/generic'

interface RaceAvatarProps {
  raceName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Race-specific avatar component that uses the generic EntityAvatar.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function RaceAvatar({ raceName, size = 'md', className }: RaceAvatarProps) {
  return (
    <EntityAvatar
      entityName={raceName}
      entityType="race"
      size={size}
      className={className}
    />
  )
} 