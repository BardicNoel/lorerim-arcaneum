import React from 'react'
import type { PlayerCreationItem } from './types'

interface ItemGridProps<T extends PlayerCreationItem> {
  items: T[]
  viewMode: 'grid' | 'list'
  onItemSelect: (item: T) => void
  selectedItem?: T | null
  renderItemCard: (item: T, isSelected: boolean) => React.ReactNode
  className?: string
}

export function ItemGrid<T extends PlayerCreationItem>({
  items,
  viewMode,
  onItemSelect,
  selectedItem,
  renderItemCard,
  className
}: ItemGridProps<T>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Items Display */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'space-y-3'
        }
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemSelect(item)}
            className="cursor-pointer transition-transform hover:scale-[1.02] relative"
          >
            {renderItemCard(item, selectedItem?.id === item.id)}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your criteria.</p>
        </div>
      )}
    </div>
  )
} 