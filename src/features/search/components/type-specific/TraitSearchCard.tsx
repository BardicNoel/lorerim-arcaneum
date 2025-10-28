import { TraitAccordion } from '@/features/traits/components/TraitAccordion'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import { traitToPlayerCreationItem } from '@/shared/utils'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface TraitSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
}

export function TraitSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: TraitSearchCardProps) {
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

  // Convert trait to PlayerCreationItem format and use the feature's TraitAccordion
  const traitAsPlayerCreationItem = traitToPlayerCreationItem(fullTrait)

  return (
    <TraitAccordion
      item={{
        ...traitAsPlayerCreationItem,
        originalTrait: fullTrait,
      }}
      className={className}
      allTraitIds={traits.map(t => t.id)}
      disableHover={false}
      showBuildControls={false}
    />
  )
}
