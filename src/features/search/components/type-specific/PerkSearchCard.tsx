import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface PerkSearchCardProps {
  item: SearchableItem
  className?: string
}

export function PerkSearchCard({ item, className }: PerkSearchCardProps) {
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

  // Render a perk tree card for search results
  return (
    <div
      className={`p-4 border rounded-lg bg-card shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-foreground">
              {fullPerkTree.treeName || fullPerkTree.name}
            </h3>
            {fullPerkTree.treeDescription && (
              <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                {fullPerkTree.treeDescription}
              </p>
            )}
          </div>
          {fullPerkTree.category && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {fullPerkTree.category}
            </span>
          )}
        </div>

        {/* Perk count */}
        {totalPerks > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Perks:</span> {totalPerks} total
          </div>
        )}

        {/* Sample perks (first 3) */}
        {fullPerkTree.perks && fullPerkTree.perks.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Sample perks:
            </div>
            <div className="flex flex-wrap gap-1">
              {fullPerkTree.perks.slice(0, 3).map((perk, idx) => (
                <span
                  key={`${perk.edid}-${idx}`}
                  className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded"
                >
                  {perk.name}
                </span>
              ))}
              {fullPerkTree.perks.length > 3 && (
                <span className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded">
                  +{fullPerkTree.perks.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {fullPerkTree.tags && fullPerkTree.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {fullPerkTree.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
              >
                {tag}
              </span>
            ))}
            {fullPerkTree.tags.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                +{fullPerkTree.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
