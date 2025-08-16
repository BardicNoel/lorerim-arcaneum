import { EntityAvatar } from '@/shared/components/generic'
import { getDataUrl } from '@/shared/utils/baseUrl'

interface RaceAvatarProps {
  raceName: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
}

// Race avatar file mapping
const raceAvatarMap: Record<string, string> = {
  Altmer: 'altmer.svg',
  Argonian: 'argonian.svg',
  Bosmer: 'woodelf.svg',
  Breton: 'breton.svg',
  Dunmer: 'dunmer.svg',
  Imperial: 'imperial.svg',
  Khajiit: 'khajit.svg',
  Nord: 'nord.svg',
  Orsimer: 'orc.svg',
  Redguard: 'redguard.svg',
}

/**
 * Race-specific avatar component that uses the generic EntityAvatar.
 * Handles race-specific image source logic.
 */
export function RaceAvatar({
  raceName,
  size = 'md',
  className,
}: RaceAvatarProps) {
  const avatarFileName = raceAvatarMap[raceName]
  const imgSrc = avatarFileName 
    ? getDataUrl(`assets/race-avatar/${avatarFileName}`)
    : undefined

  return (
    <EntityAvatar
      imgSrc={imgSrc}
      alt={raceName}
      size={size}
      className={className}
    />
  )
}
