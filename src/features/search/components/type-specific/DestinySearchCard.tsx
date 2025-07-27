import { DestinyCard } from '@/features/destiny/components/composition/DestinyCard'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface DestinySearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function DestinySearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: DestinySearchCardProps) {
  const destinyNodes = useDestinyNodesStore(state => state.data)

  // Find the full destiny node record from the store
  const fullDestiny = findItemInStore(destinyNodes, item.originalData)

  if (!fullDestiny) {
    // Fallback to default card if destiny node not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Destiny node not found in store
        </p>
      </div>
    )
  }

  // Convert the destiny node to PlayerCreationItem format for DestinyCard
  const destinyAsPlayerCreationItem = {
    id: fullDestiny.id || fullDestiny.edid || fullDestiny.name,
    name: fullDestiny.name,
    description: fullDestiny.description || '',
    category: fullDestiny.category || '',
    tags: fullDestiny.tags || [],
    type: 'destiny' as const,
    imageUrl: fullDestiny.icon,
    effects: fullDestiny.effects,
  }

  // Render the existing DestinyCard with the full destiny data
  return (
    <div className={className} onClick={onClick}>
      <DestinyCard
        item={destinyAsPlayerCreationItem}
        isSelected={isSelected}
        originalNode={fullDestiny}
        allNodes={destinyNodes}
        viewMode="grid"
      />
    </div>
  )
}
