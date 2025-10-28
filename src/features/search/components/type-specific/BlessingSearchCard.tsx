import { BlessingCard } from '@/features/religions/components/BlessingCard'
import type { Religion as FeatureReligion } from '@/features/religions/types'
import { mapSharedReligionToFeatureReligion } from '@/features/religions/utils/religionMapper'
import type { Religion as SharedReligion } from '@/shared/data/schemas'
import { useReligionsStore } from '@/shared/stores/religionsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface BlessingSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
}

export function BlessingSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: BlessingSearchCardProps) {
  const religions = useReligionsStore(state => state.data)

  // Find the full religion record from the store
  const fullReligion = findItemInStore(religions, item.originalData) as
    | SharedReligion
    | undefined

  if (!fullReligion) {
    // Log error for debugging but don't show a card
    console.error('Religion not found in store for blessing:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalReligionsInStore: religions.length,
      firstFewReligions: religions.slice(0, 3).map(religion => ({
        id: religion.id,
        name: religion.name,
      })),
    })
    return null
  }

  // Convert the shared Religion type to the feature Religion type
  const religionAsFeatureReligion: FeatureReligion =
    mapSharedReligionToFeatureReligion(fullReligion)

  // Render the BlessingCard without build controls
  return (
    <BlessingCard
      religion={religionAsFeatureReligion}
      className={className}
      onClick={() => {}} // No-op for search results
      showToggle={false} // Disable toggle for search results
    />
  )
}
