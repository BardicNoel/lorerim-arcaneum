import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useMultiColumnVirtualization } from '../hooks/useMultiColumnVirtualization'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { VirtualItem } from './VirtualItem'
import type { MasonryVirtualizerConfig } from '../types/virtualization'

export interface StableVirtualMasonryGridProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  loadMore?: () => void
  hasMore?: boolean
  columns?: number
  gap?: number
  maxColumnWidth?: number
  className?: string
  overscan?: number
  estimatedItemHeight?: number
  showPerformanceMetrics?: boolean
}

export function StableVirtualMasonryGrid<T>({
  items,
  keyExtractor,
  renderItem,
  loadMore,
  hasMore = true,
  columns = 3,
  gap = 12,
  maxColumnWidth,
  className = '',
  overscan = 5,
  estimatedItemHeight = 400,
  showPerformanceMetrics = false,
}: StableVirtualMasonryGridProps<T>) {

  // Virtualization configuration (memoized to prevent unnecessary re-initialization)
  const config: MasonryVirtualizerConfig = useMemo(() => ({
    columns,
    gap,
    overscan,
    estimatedItemHeight,
    containerWidth: 0, // Will be set by the hook
  }), [columns, gap, overscan, estimatedItemHeight])

  // Use the improved virtualization hook
  const {
    containerRef,
    state,
    containerWidth,
    handleScroll,
    measureItemHeight,
    getVisibleItems,
    getTotalHeight,
    getPerformanceStats,
  } = useMultiColumnVirtualization(items, keyExtractor, config)

  // Get visible items for rendering
  const [visibleItems, setVisibleItems] = useState<Array<{ item: T; position: any; key: string }>>([])

  // Update visible items when they change or when scroll position changes
  useEffect(() => {
    const items = getVisibleItems()
    setVisibleItems(items)
  }, [getVisibleItems, state.scrollTop, state.containerHeight])

  // Use improved infinite scroll
  const { loadingState, retry } = useInfiniteScroll(
    loadMore || (() => {}),
    hasMore,
    { threshold: 200, debounceDelay: 100 }
  )

  // Handle item height measurement
  const handleItemHeightChange = useCallback(
    async (element: HTMLElement, item: T) => {
      await measureItemHeight(element, item)
    },
    [measureItemHeight]
  )

  // Render individual item with height measurement
  const renderVirtualItem = useCallback(
    ({ item, position, key }: { item: T; position: any; key: string }) => {
      return (
        <VirtualItem
          key={key}
          item={item}
          position={position}
          columns={columns}
          gap={gap}
          renderItem={renderItem}
          onHeightChange={handleItemHeightChange}
        />
      )
    },
    [renderItem, columns, gap, handleItemHeightChange]
  )

  // Render performance metrics
  const renderPerformanceMetrics = () => {
    if (!showPerformanceMetrics) return null

    const stats = getPerformanceStats()
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50">
        <div>Total Items: {items.length}</div>
        <div>Visible Items: {visibleItems.length}</div>
        <div>Container Width: {containerWidth}px</div>
        <div>Scroll Top: {state.scrollTop.toFixed(0)}px</div>
        <div>Total Height: {getTotalHeight().toFixed(0)}px</div>
        <div>Loading: {loadingState.isLoading ? 'Yes' : 'No'}</div>
        {loadingState.hasError && (
          <div className="text-red-400">Error: {loadingState.errorMessage}</div>
        )}
        {stats && (
          <>
            <div>Column Heights: {stats.columnHeights?.join(', ')}</div>
            <div>Height Measurements: {stats.heightMeasurements?.totalMeasurements || 0}</div>
            <div>Debug: First 5 visible items positions</div>
            {visibleItems.slice(0, 5).map(({ item, position, key }) => (
              <div key={key} className="text-xs">
                Item {position.index}: col={position.column}, top={position.top.toFixed(0)}, height={position.height.toFixed(0)}
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    )
  }



  return (
    <div className={className}>
      {/* Performance Metrics */}
      {renderPerformanceMetrics()}

      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ 
          height: 'calc(100vh - 200px)', // Leave space for header/navigation
          minHeight: '400px'
        }}
        onScroll={handleScroll}
      >
        {/* Virtual Content */}
        <div
          style={{
            position: 'relative',
            height: getTotalHeight(),
            width: '100%',
          }}
        >
          {/* Render visible items */}
          {visibleItems.map(({ item, position, key }) =>
            renderVirtualItem({ item, position, key })
          )}

          {/* Loading indicator */}
          {loadingState.isLoading && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="text-sm text-muted-foreground">Loading more items...</div>
            </div>
          )}

          {/* Error indicator */}
          {loadingState.hasError && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
              }}
            >
              <div className="text-sm text-red-600">
                {loadingState.errorMessage}
                <button
                  onClick={retry}
                  className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
