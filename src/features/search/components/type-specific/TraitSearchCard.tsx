import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface TraitSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | 'masonry'
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

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <AccordionCard.Header>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-muted-foreground">
              {fullTrait.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">{fullTrait.name}</h3>
            {fullTrait.category && (
              <span className="text-sm text-muted-foreground">
                {fullTrait.category}
              </span>
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        {fullTrait.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {fullTrait.description}
          </p>
        )}
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {fullTrait.tags && fullTrait.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {fullTrait.tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-muted rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {fullTrait.description && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Description</h5>
            <p className="text-sm text-muted-foreground">
              {fullTrait.description}
            </p>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
