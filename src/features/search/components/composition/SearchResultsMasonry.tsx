import React, { useState, useEffect } from 'react'
import Masonry from 'react-masonry-css'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List, LayoutGrid } from 'lucide-react'
import { SearchCard } from '../atomic/SearchCard'
import type { SearchableItem } from '../../model/SearchModel'
import './search-masonry.css'

interface SearchResultsMasonryProps {
  items: SearchableItem[]
  className?: string
  viewMode?: 'grid' | 'list' | 'masonry'
  onViewModeChange?: (mode: 'grid' | 'list' | 'masonry') => void
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
}

export function SearchResultsMasonry({
  items,
  className,
  viewMode = 'masonry',
  onViewModeChange,
}: SearchResultsMasonryProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Auto-expand all items when in masonry view
  useEffect(() => {
    if (viewMode === 'masonry') {
      const allItemIds = new Set(items.map(item => item.id))
      setExpandedItems(allItemIds)
    }
  }, [viewMode, items])

  // Handle accordion expansion
  const handleItemToggle = (itemId: string) => {
    // In masonry view, items should always be expanded, so we don't allow toggling
    if (viewMode === 'masonry') {
      return
    }

    const newExpanded = new Set(expandedItems)

    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
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
        <div className="flex items-center justify-between mb-4">
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
              variant={viewMode === 'masonry' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('masonry')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Masonry
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
      {viewMode === 'masonry' ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="search-masonry-grid"
          columnClassName="search-masonry-grid_column"
        >
          {items.map(item => (
            <div key={item.id} className="mb-4">
              <SearchCard
                item={item}
                isExpanded={true}
                onToggle={() => {}} // No-op in masonry view
                viewMode="masonry"
              />
            </div>
          ))}
        </Masonry>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        </div>
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