import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface DestinySearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list'
}

export function DestinySearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: DestinySearchCardProps) {
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

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <AccordionCard.Header>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            {fullDestiny.icon ? (
              <img
                src={fullDestiny.icon}
                alt={fullDestiny.name}
                className="w-6 h-6 object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {fullDestiny.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">{fullDestiny.name}</h3>
            {fullDestiny.category && (
              <span className="text-sm text-muted-foreground">
                {fullDestiny.category}
              </span>
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        {fullDestiny.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {fullDestiny.description}
          </p>
        )}
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {fullDestiny.effects && fullDestiny.effects.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Effects</h5>
            <div className="space-y-1">
              {fullDestiny.effects.map((effect, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  • {effect}
                </div>
              ))}
            </div>
          </div>
        )}

        {fullDestiny.tags && fullDestiny.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {fullDestiny.tags.map((tag, idx) => (
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
      </AccordionCard.Details>
    </AccordionCard>
  )
}
