import { TraitCard } from '@/features/traits/components/TraitCard'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface TraitSearchCardProps {
  item: SearchableItem
  className?: string
}

export function TraitSearchCard({ item, className }: TraitSearchCardProps) {
  const traits = useTraitsStore(state => state.data)

  // Find the full trait record from the store
  const fullTrait = findItemInStore(traits, item.originalData)

  if (!fullTrait) {
    // Log error for debugging but don't show a card
    console.error('Trait not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalTraitsInStore: traits.length,
      firstFewTraits: traits.slice(0, 3).map(trait => ({
        id: trait.id,
        name: trait.name,
      })),
    })
    return null
  }

  // Convert the trait to PlayerCreationItem format for TraitCard
  const traitAsPlayerCreationItem = {
    id: fullTrait.id || fullTrait.edid || fullTrait.name,
    name: fullTrait.name,
    description: fullTrait.description || '',
    category: fullTrait.category || '',
    tags: fullTrait.tags || [],
    type: 'trait' as const,
  }

  // Render the existing TraitCard with the full trait data
  return (
    <div className={className}>
      <TraitCard item={traitAsPlayerCreationItem} />
    </div>
  )
}
