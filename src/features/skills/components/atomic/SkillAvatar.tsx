import { EntityAvatar } from '@/shared/components/generic/EntityAvatar'
import { getDataUrl } from '@/shared/utils/baseUrl'

interface SkillAvatarProps {
  skillName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

// Skill avatar file mapping
const skillAvatarMap: Record<string, string> = {
  // Case-sensitive filenames must match assets in public/assets/skills/
  Alchemy: 'alchemy.svg',
  Alteration: 'alteration.svg',
  Block: 'block.svg',
  Conjuration: 'conjuration.svg',
  Destruction: 'destruction.svg',
  Enchanting: 'enchanting.svg',
  Evasion: 'evasion.svg',
  Finesse: 'finesse.svg',
  'Heavy Armor': 'heavyarmor.svg',
  Illusion: 'illusion.svg',
  Marksman: 'marksman.svg',
  'One-handed': 'one-handed.svg',
  Restoration: 'restoration.svg',
  Smithing: 'smithing.svg',
  Sneak: 'sneak.svg',
  Speech: 'speech.svg',
  'Two-handed': 'two-handed.svg',
  Wayfarer: 'wayfarer.svg',
}

/**
 * Skill-specific avatar component that uses the generic EntityAvatar.
 * Handles skill-specific image source logic and includes the border styling.
 */
export function SkillAvatar({
  skillName,
  size = 'md',
  className,
}: SkillAvatarProps) {
  const avatarFileName = skillAvatarMap[skillName]
  const imgSrc = avatarFileName 
    ? getDataUrl(`assets/skills/${avatarFileName}`)
    : undefined

  return (
    <EntityAvatar
      imgSrc={imgSrc}
      alt={skillName}
      size={size}
      className={className}
      showBorder={true}
    />
  )
}
