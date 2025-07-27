import React from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { SearchCard } from '../atomic/SearchCard'

interface SimpleSearchResultsGridProps {
  items: SearchableItem[]
  selectedItemId?: string
  onItemSelect?: (item: SearchableItem) => void
  className?: string
}

export function SimpleSearchResultsGrid({
  items,
  selectedItemId,
  onItemSelect,
  className,
}: SimpleSearchResultsGridProps) {
  const handleItemClick = (item: SearchableItem) => {
    onItemSelect?.(item)
  }

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No results found</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {items.map(item => (
        <SearchCard
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onClick={() => handleItemClick(item)}
        />
      ))}
    </div>
  )
} 