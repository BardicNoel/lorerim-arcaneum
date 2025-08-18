import { Button } from '@/shared/ui/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { SearchCard } from '../atomic/SearchCard'
import { VirtualMasonryGrid } from './VirtualMasonryGrid'

interface SearchResultsGridProps {
  items: SearchableItem[]
  className?: string
  viewMode?: 'list' | 'grid'
  onViewModeChange?: (mode: 'list' | 'grid') => void
}

export function SearchResultsGrid({
  items,
  className,
  viewMode = 'grid',
  onViewModeChange,
}: SearchResultsGridProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  
  // Progressive loading state
  const [displayedItems, setDisplayedItems] = useState<SearchableItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  
  const INITIAL_BATCH_SIZE = 50
  const BATCH_SIZE = 50

  // Initialize progressive loading when items change
  useEffect(() => {
    const initialItems = items.slice(0, INITIAL_BATCH_SIZE)
    setDisplayedItems(initialItems)
    setHasMore(items.length > INITIAL_BATCH_SIZE)
  }, [items])

  // Auto-expand all items when in grid view
  useEffect(() => {
    if (viewMode === 'grid') {
      const allItemIds = new Set(displayedItems.map(item => item.id))
      setExpandedItems(allItemIds)
    }
  }, [viewMode, displayedItems])

  // Handle accordion expansion
  const handleItemToggle = (itemId: string) => {
    // In grid view, items should always be expanded, so we don't allow toggling
    if (viewMode === 'grid') {
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

  // Load more items function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate async loading (in real implementation, this might be an API call)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const currentCount = displayedItems.length
    const nextBatch = items.slice(currentCount, currentCount + BATCH_SIZE)
    
    setDisplayedItems(prev => [...prev, ...nextBatch])
    setHasMore(currentCount + BATCH_SIZE < items.length)
    setIsLoading(false)
  }, [isLoading, hasMore, displayedItems.length, items])

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
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
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
        <>
          <VirtualMasonryGrid
            key={`grid-${displayedItems.length}-${displayedItems[0]?.id || 'empty'}`}
            items={displayedItems}
            keyExtractor={item => item.id}
            renderItem={item => (
              <SearchCard
                item={item}
                isExpanded={true}
                onToggle={() => {}} // No-op in grid view
                viewMode="grid"
              />
            )}
            loadMore={loadMore}
            hasMore={hasMore}
            columns={3}
            gap={16}
            maxColumnWidth={400}
            useDynamicHeightEstimation={true}
            preMeasurement={{
              enabled: true,
              maxItemsToMeasure: 20,
              showLoadingScreen: true,
              showProgress: true
            }}
          />
          
          {/* Loading indicator for grid view */}
          {isLoading && (
            <div className="text-center py-4 mt-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading more items... ({displayedItems.length}/{items.length})
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          {displayedItems.map(item => {
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
          
          {/* Load more button for list view */}
          {hasMore && (
            <div className="text-center py-4">
              <Button
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? 'Loading...' : `Load More (${displayedItems.length}/${items.length})`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
