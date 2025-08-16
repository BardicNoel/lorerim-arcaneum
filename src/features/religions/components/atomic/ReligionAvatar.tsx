import { EntityAvatar } from '@/shared/components/generic/EntityAvatar'
import { getDataUrl } from '@/shared/utils/baseUrl'

interface ReligionAvatarProps {
  religionName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

// Religion avatar file mapping
const religionAvatarMap: Record<string, string> = {
  // Add religion avatars as they become available
  // Example: 'Akatosh': 'akatosh.svg',
}

/**
 * Religion-specific avatar component that uses the generic EntityAvatar.
 * Handles religion-specific image source logic.
 */
export function ReligionAvatar({
  religionName,
  size = '2xl',
  className,
}: ReligionAvatarProps) {
  const avatarFileName = religionAvatarMap[religionName]
  const imgSrc = avatarFileName 
    ? getDataUrl(`assets/religion-avatar/${avatarFileName}`)
    : undefined

  return (
    <EntityAvatar
      imgSrc={imgSrc}
      alt={religionName}
      size={size}
      className={className}
    />
  )
}
