import React, { useState } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import { AccordionGrid } from '@/shared/components/ui/AccordionGrid'
import { SearchCard } from '../atomic/SearchCard'
import type { SearchableItem } from '../../model/SearchModel'

interface SearchResultsAccordionGridProps {
  items: SearchableItem[]
  className?: string
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

export function SearchResultsAccordionGrid({
  items,
  className,
  viewMode = 'grid',
  onViewModeChange,
}: SearchResultsAccordionGridProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Handle accordion expansion (row-based for grid view)
  const handleItemToggle = (itemId: string) => {
    const newExpanded = new Set(expandedItems)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the AccordionGrid columns prop
      const itemIndex = items.findIndex(item => item.id === itemId)
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(rowStartIndex + columns, items.length)

      // Check if any item in the row is currently expanded
      const isRowExpanded = items
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        items.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        items.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.add(item.id)
        })
      }
    } else {
      // In list mode, just toggle the single item
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId)
      } else {
        newExpanded.add(itemId)
      }
    }

    setExpandedItems(newExpanded)
  }

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No results found</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {items.length} result{items.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {viewMode === 'grid' ? (
        <AccordionGrid columns={3} gap="md">
          {items.map(item => {
            const isExpanded = expandedItems.has(item.id)

            return (
              <SearchCard
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleItemToggle(item.id)}
                viewMode="grid"
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const isExpanded = expandedItems.has(item.id)

            return (
              <SearchCard
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleItemToggle(item.id)}
                viewMode="list"
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
