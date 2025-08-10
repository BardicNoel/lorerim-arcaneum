import { EntityAvatar } from '@/shared/components/generic'

interface BirthsignAvatarProps {
  birthsignName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
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
      imageClassName="scale-125"
    />
  )
}
