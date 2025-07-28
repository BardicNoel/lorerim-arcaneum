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
    // Fallback to default card if trait not found
    return (
      <div className={`p-4 border rounded-lg bg-muted ${className}`}>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Trait not found in store
        </p>
      </div>
    )
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
