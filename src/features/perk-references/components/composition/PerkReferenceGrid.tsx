import React from 'react'
import { PerkReferenceGridItem } from '../atomic/PerkReferenceGridItem'
import type { PerkReferenceItem } from '../../types'

interface PerkReferenceGridProps {
  items: PerkReferenceItem[]
  selectedItem?: PerkReferenceItem | null
  onItemSelect: (item: PerkReferenceItem) => void
  className?: string
  showAddToBuild?: boolean
}

export function PerkReferenceGrid({
  items,
  selectedItem,
  onItemSelect,
  className,
  showAddToBuild = true,
}: PerkReferenceGridProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className="cursor-pointer transition-transform hover:scale-[1.02] relative"
          >
            <PerkReferenceGridItem
              item={item}
              isSelected={selectedItem?.id === item.id}
              showAddToBuild={showAddToBuild}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No perks found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
} 