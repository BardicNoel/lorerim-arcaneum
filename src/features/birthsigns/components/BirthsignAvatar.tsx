import { EntityAvatar } from '@/shared/components/generic'
import { getDataUrl } from '@/shared/utils/baseUrl'

interface BirthsignAvatarProps {
  birthsignName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

// Birthsign avatar file mapping
const birthsignAvatarMap: Record<string, string> = {
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
}

/**
 * Birthsign-specific avatar component that uses the generic EntityAvatar.
 * Handles birthsign-specific image source logic.
 */
export function BirthsignAvatar({
  birthsignName,
  size = 'md',
  className,
}: BirthsignAvatarProps) {
  const avatarFileName = birthsignAvatarMap[birthsignName]
  const imgSrc = avatarFileName
    ? getDataUrl(`assets/sign-avatar/${avatarFileName}`)
    : undefined

  return (
    <div className="relative">
      <EntityAvatar
        imgSrc={imgSrc}
        alt={birthsignName}
        size={size}
        className={className}
        imageClassName="scale-[160%]"
        showBorder={false}
      />
      <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white pointer-events-none z-10" />
    </div>
  )
}
