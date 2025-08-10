import { BirthsignCard } from '@/features/birthsigns/components/BirthsignCard'
import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface BirthsignSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
}

export function BirthsignSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: BirthsignSearchCardProps) {
  const birthsigns = useBirthsignsStore(state => state.data)

  // Find the full birthsign record from the store
  const fullBirthsign = findItemInStore(birthsigns, item.originalData)

  if (!fullBirthsign) {
    // Log error for debugging but don't show a card
    console.error('Birthsign not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalBirthsignsInStore: birthsigns.length,
      firstFewBirthsigns: birthsigns.slice(0, 3).map(birthsign => ({
        id: birthsign.id,
        name: birthsign.name,
      })),
    })
    return null
  }

  return (
    <BirthsignCard
      originalBirthsign={fullBirthsign}
      isExpanded={isExpanded}
      onToggle={onToggle}
      className={className}
      showToggle={false}
    />
  )
}
