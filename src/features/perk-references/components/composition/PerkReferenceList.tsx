import React from 'react'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { PerkReferenceListItem } from '../atomic/PerkReferenceListItem'
import type { PerkReferenceItem } from '../../types'

interface PerkReferenceListProps {
  items: PerkReferenceItem[]
  selectedItem?: PerkReferenceItem | null
  onItemSelect: (item: PerkReferenceItem) => void
  className?: string
  showAddToBuild?: boolean
  height?: string
}

export function PerkReferenceList({
  items,
  selectedItem,
  onItemSelect,
  className,
  showAddToBuild = true,
  height = 'calc(100vh-300px)',
}: PerkReferenceListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* List Layout */}
      <ScrollArea className={height}>
        <div className="space-y-1 pr-4">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => onItemSelect(item)}
              className="cursor-pointer transition-colors hover:bg-muted/50 rounded-lg"
            >
              <PerkReferenceListItem
                item={item}
                isSelected={selectedItem?.id === item.id}
                showAddToBuild={showAddToBuild}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

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