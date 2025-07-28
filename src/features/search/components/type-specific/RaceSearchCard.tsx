import { RaceAccordion } from '@/features/races-v2/components/composition/RaceAccordion'
import type { Race as RaceV2Type } from '@/features/races-v2/types'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useState } from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface RaceSearchCardProps {
  item: SearchableItem
  className?: string
}

export function RaceSearchCard({ item, className }: RaceSearchCardProps) {
  const races = useRacesStore(state => state.data)
  const [isExpanded, setIsExpanded] = useState(false)

  // Find the full race record from the store
  const fullRace = findItemInStore(races, item.originalData)

  if (!fullRace) {
    // Log error for debugging but don't show a card
    console.error('Race not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalRacesInStore: races.length,
      firstFewRaces: races.slice(0, 3).map(race => ({
        edid: race.edid,
        name: race.name,
      })),
    })
    return null
  }

  // Handle accordion toggle
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Convert the race to PlayerCreationItem format for RaceAccordion
  const raceAsPlayerCreationItem = {
    id: fullRace.id || fullRace.edid || fullRace.name,
    name: fullRace.name,
    description: fullRace.description || '',
    summary: fullRace.description || '',
    category: fullRace.category || '',
    tags: fullRace.tags || [],
    type: 'race' as const,
    effects: [],
  }

  // Render the existing RaceAccordion with the full race data
  return (
    <div className={className}>
      <RaceAccordion
        item={{
          ...raceAsPlayerCreationItem,
          originalRace: fullRace as unknown as RaceV2Type,
        }}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        showToggle={false} // Disable the add to build toggle for search results
        disableHover={false} // Enable hover for better UX
        className="w-full"
      />
    </div>
  )
}
