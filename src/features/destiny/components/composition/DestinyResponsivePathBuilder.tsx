import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import type { DestinyNode } from '../../types'
import { DestinyMobileStepper } from './DestinyMobileStepper'
import { DestinyPathBuilder } from './DestinyPathBuilder'

interface DestinyResponsivePathBuilderProps {
  onPathChange?: (path: any[]) => void
  onPathComplete?: (path: any[]) => void
  className?: string
  compact?: boolean
  currentPath?: DestinyNode[] // Add this prop
}

export function DestinyResponsivePathBuilder(
  props: DestinyResponsivePathBuilderProps
) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (isDesktop) {
    return <DestinyPathBuilder {...props} />
  }

  return <DestinyMobileStepper />
}
