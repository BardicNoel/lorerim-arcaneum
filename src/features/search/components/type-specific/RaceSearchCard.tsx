import { RaceCard } from '@/features/races-v2/components/composition/RaceCard'
import { useRacesStore } from '@/shared/stores/racesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface RaceSearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function RaceSearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: RaceSearchCardProps) {
  const races = useRacesStore(state => state.data)

  // Find the full race record from the store
  const fullRace = findItemInStore(races, item.originalData)

  if (!fullRace) {
    // Fallback to default card if race not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">Race not found in store</p>
      </div>
    )
  }

  // Render the existing RaceCard with the full race data
  return (
    <div className={className} onClick={onClick}>
      <RaceCard
        originalRace={fullRace}
        isSelected={isSelected}
        showToggle={false} // Disable the add to build toggle for search results
      />
    </div>
  )
}
