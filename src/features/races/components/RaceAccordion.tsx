import React from 'react'
import { GenericAccordionCard } from '@/shared/components/generic'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'
import { 
  renderRaceHeader, 
  renderRaceCollapsedContent, 
  renderRaceExpandedContent 
} from './RaceAccordionRenderers'

interface RaceAccordionProps {
  item: PlayerCreationItem
  originalRace?: Race
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

/**
 * Race-specific accordion component that uses the generic GenericAccordionCard.
 * This maintains backward compatibility while leveraging the generic component.
 */
export function RaceAccordion({ 
  item, 
  originalRace, 
  isExpanded = false, 
  onToggle, 
  className 
}: RaceAccordionProps) {
  return (
    <GenericAccordionCard
      item={item}
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      renderHeader={(item) => renderRaceHeader(item, originalRace)}
      renderCollapsedContent={(item) => renderRaceCollapsedContent(item, originalRace)}
      renderExpandedContent={(item) => renderRaceExpandedContent(item, originalRace)}
      className={className}
    />
  )
} 