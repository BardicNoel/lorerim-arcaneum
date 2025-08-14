import {
  ReligionCard,
  ReligionSheet,
} from '@/features/religions/components/composition'
import type { Religion as FeatureReligion } from '@/features/religions/types'
import { mapSharedReligionToFeatureReligion } from '@/features/religions/utils/religionMapper'
import type { Religion as SharedReligion } from '@/shared/data/schemas'
import { useReligionsStore } from '@/shared/stores/religionsStore'
import { useState } from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface ReligionSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
}

export function ReligionSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: ReligionSearchCardProps) {
  const religions = useReligionsStore(state => state.data)
  const [selectedReligion, setSelectedReligion] =
    useState<FeatureReligion | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Find the full religion record from the store
  const fullReligion = findItemInStore(religions, item.originalData) as
    | SharedReligion
    | undefined

  if (!fullReligion) {
    // Log error for debugging but don't show a card
    console.error('Religion not found in store:', {
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

  const handleOpenDetails = (id: string) => {
    setSelectedReligion(religionAsFeatureReligion)
    setIsSheetOpen(true)
  }

  // Render the new ReligionCard with the full religion data
  return (
    <div className={className}>
      <ReligionCard
        originalReligion={religionAsFeatureReligion}
        className="w-full"
        onOpenDetails={handleOpenDetails}
        showToggle={true}
      />
      <ReligionSheet
        religion={selectedReligion}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  )
}
