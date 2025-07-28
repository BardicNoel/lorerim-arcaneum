import { DestinyCard } from '@/features/destiny/components/composition/DestinyCard'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface DestinySearchCardProps {
  item: SearchableItem
  className?: string
}

export function DestinySearchCard({ item, className }: DestinySearchCardProps) {
  const destinyNodes = useDestinyNodesStore(state => state.data)

  // Find the full destiny node record from the store
  const fullDestiny = findItemInStore(destinyNodes, item.originalData)

  if (!fullDestiny) {
    // Log error for debugging but don't show a card
    console.error('Destiny node not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalDestinyNodesInStore: destinyNodes.length,
      firstFewDestinyNodes: destinyNodes.slice(0, 3).map(node => ({
        id: node.id,
        name: node.name,
      })),
    })
    return null
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
    <div className={className}>
      <DestinyCard
        item={destinyAsPlayerCreationItem}
        isSelected={false}
        originalNode={fullDestiny}
        allNodes={destinyNodes}
        viewMode="grid"
      />
    </div>
  )
}
