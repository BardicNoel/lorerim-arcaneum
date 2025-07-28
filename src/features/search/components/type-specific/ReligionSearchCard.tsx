import { ReligionAccordion } from '@/features/religions/components/ReligionAccordion'
import type { Religion as FeatureReligion } from '@/features/religions/types'
import type { Religion as SharedReligion } from '@/shared/data/schemas'
import { useReligionsStore } from '@/shared/stores/religionsStore'
import { useState } from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface ReligionSearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function ReligionSearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: ReligionSearchCardProps) {
  const religions = useReligionsStore(state => state.data)
  const [isExpanded, setIsExpanded] = useState(false)

  console.log('ReligionSearchCard Debug:', { item, religions })

  // Find the full religion record from the store
  const fullReligion = findItemInStore(religions, item.originalData) as
    | SharedReligion
    | undefined

  // Debug logging to understand the data matching
  console.log('ReligionSearchCard Debug:', {
    searchItemName: item.name,
    searchItemId: item.id,
    searchItemOriginalData: item.originalData,
    foundReligionName: fullReligion?.name,
    foundReligionId: fullReligion?.id,
    totalReligionsInStore: religions.length,
    firstFewReligions: religions
      .slice(0, 3)
      .map(r => ({ name: r.name, id: r.id })),
  })

  if (!fullReligion) {
    // Fallback to default card if religion not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Religion not found in store
        </p>
      </div>
    )
  }

  // Handle accordion toggle separately from card selection
  const handleAccordionToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Convert the shared Religion type to the feature Religion type
  const religionAsFeatureReligion: FeatureReligion = {
    name: fullReligion.name,
    type: fullReligion.type || fullReligion.pantheon || 'Unknown',
    blessing: {
      spellId: fullReligion.blessing?.spellId || '',
      spellName: fullReligion.blessing?.spellName || '',
      effects: fullReligion.blessing?.effects || [],
    },
    boon1: {
      spellId: fullReligion.boon1?.spellId || '',
      spellName: fullReligion.boon1?.spellName || '',
      effects: fullReligion.boon1?.effects || [],
    },
    boon2: {
      spellId: fullReligion.boon2?.spellId || '',
      spellName: fullReligion.boon2?.spellName || '',
      effects: fullReligion.boon2?.effects || [],
    },
    tenet: {
      spellId: fullReligion.tenet?.spellId || '',
      spellName: fullReligion.tenet?.spellName || '',
      header: fullReligion.tenet?.header || '',
      description: fullReligion.tenet?.description || '',
      effects: fullReligion.tenet?.effects || [],
    },
    favoredRaces: fullReligion.favoredRaces || [],
    worshipRestrictions: fullReligion.worshipRestrictions || [],
  }

  // Convert the religion to PlayerCreationItem format for ReligionAccordion
  const religionAsPlayerCreationItem = {
    id: fullReligion.id || fullReligion.name,
    name: fullReligion.name,
    description: fullReligion.tenet?.description || '',
    category: fullReligion.type || fullReligion.pantheon || '',
    tags: fullReligion.favoredRaces || fullReligion.tags || [],
    type: 'religion' as const,
    summary: fullReligion.tenet?.description || '',
    effects: [
      // Include tenet effects
      ...(fullReligion.tenet?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || '',
      })) || []),
      // Include blessing effects if available
      ...(fullReligion.blessing?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || '',
      })) || []),
    ],
  }

  // Render the existing ReligionAccordion with the full religion data
  return (
    <div className={className} onClick={onClick}>
      <ReligionAccordion
        item={religionAsPlayerCreationItem}
        originalReligion={religionAsFeatureReligion}
        isExpanded={isExpanded}
        onToggle={handleAccordionToggle}
        className="w-full"
        showBlessings={true}
        showTenets={true}
        showBoons={true}
        showFavoredRaces={true}
        disableHover={false}
        showToggle={false}
      />
    </div>
  )
}
