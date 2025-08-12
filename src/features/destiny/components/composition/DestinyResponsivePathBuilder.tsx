import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { DestinyPathBuilder } from './DestinyPathBuilder'
import { DestinyMobileStepper } from './DestinyMobileStepper'

interface DestinyResponsivePathBuilderProps {
  onPathChange?: (path: any[]) => void
  onPathComplete?: (path: any[]) => void
  className?: string
  compact?: boolean
}

export function DestinyResponsivePathBuilder(props: DestinyResponsivePathBuilderProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (isDesktop) {
    return <DestinyPathBuilder {...props} />
  }

  return <DestinyMobileStepper />
}
