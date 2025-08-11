import { EntityAvatar } from '@/shared/components/generic/EntityAvatar'

interface ReligionAvatarProps {
  religionName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

/**
 * Religion-specific avatar component that uses the generic EntityAvatar.
 * This maintains consistency with other entity avatars while providing religion-specific functionality.
 */
export function ReligionAvatar({
  religionName,
  size = '2xl',
  className,
}: ReligionAvatarProps) {
  return (
    <EntityAvatar
      entityName={religionName}
      entityType="religion"
      size={size}
      className={className}
    />
  )
}
