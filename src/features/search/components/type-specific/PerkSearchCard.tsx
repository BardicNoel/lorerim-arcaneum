import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface PerkSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | 'masonry'
}

export function PerkSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: PerkSearchCardProps) {
  const perkTrees = usePerkTreesStore(state => state.data)

  // Find the full perk tree record from the store
  const fullPerkTree = findItemInStore(perkTrees, item.originalData)

  if (!fullPerkTree) {
    // Log error for debugging but don't show a card
    console.error('Perk tree not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalPerkTreesInStore: perkTrees.length,
      firstFewPerkTrees: perkTrees.slice(0, 3).map(tree => ({
        treeId: tree.treeId,
        treeName: tree.treeName || tree.name,
      })),
    })
    return null
  }

  // Count total perks in the tree
  const totalPerks = fullPerkTree.perks?.length || 0

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
              {(fullPerkTree.treeName || fullPerkTree.name).charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">
              {fullPerkTree.treeName || fullPerkTree.name}
            </h3>
            {fullPerkTree.category && (
              <span className="text-sm text-muted-foreground">
                {fullPerkTree.category}
              </span>
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        {fullPerkTree.treeDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {fullPerkTree.treeDescription}
          </p>
        )}

        {totalPerks > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Perks:</span> {totalPerks} total
          </div>
        )}
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {/* Sample perks */}
        {fullPerkTree.perks && fullPerkTree.perks.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">
              Sample Perks
            </h5>
            <div className="flex flex-wrap gap-1">
              {fullPerkTree.perks.slice(0, 6).map((perk, idx) => (
                <span
                  key={`${perk.edid}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-muted rounded"
                >
                  {perk.name}
                </span>
              ))}
              {fullPerkTree.perks.length > 6 && (
                <span className="inline-block px-2 py-1 text-xs bg-muted rounded text-muted-foreground">
                  +{fullPerkTree.perks.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {fullPerkTree.tags && fullPerkTree.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {fullPerkTree.tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
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
