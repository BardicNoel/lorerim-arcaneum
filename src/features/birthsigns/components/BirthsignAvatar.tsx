import React from 'react'
import { EntityAvatar } from '@/shared/components/generic'
import { cn } from '@/lib/utils'
import { birthsignGroupStyles } from '../config/birthsignConfig'

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
  const groupStyle = group ? birthsignGroupStyles[group] : undefined
  const borderColorClass = groupStyle?.text || 'text-foreground'

  return (
    <EntityAvatar
      entityName={birthsignName}
      entityType="birthsign"
      size={size}
      className={cn(
        // Solid circle background with colored outline using currentColor
        'border-2 border-current p-1 rounded-full bg-background dark:bg-input/30 shadow-sm',
        borderColorClass,
        className
      )}
    />
  )
}
