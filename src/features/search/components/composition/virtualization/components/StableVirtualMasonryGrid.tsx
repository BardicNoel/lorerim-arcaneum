import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useMasonryVirtualizer } from '../hooks/useMasonryVirtualizer'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { VirtualItem } from './VirtualItem'
import type { MasonryVirtualizerConfig, PreMeasurementConfig } from '../types/virtualization'
import { getQuickEstimate } from '../utils/heightEstimator'

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
  useDynamicHeightEstimation?: boolean
  preMeasurement?: PreMeasurementConfig
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
  useDynamicHeightEstimation = true,
  preMeasurement,
}: StableVirtualMasonryGridProps<T>) {

  // Calculate dynamic estimated height if enabled
  const dynamicEstimatedHeight = useMemo(() => {
    if (!useDynamicHeightEstimation || items.length === 0) {
      return estimatedItemHeight
    }
    
    // For items with type property, use dynamic estimation
    if (items[0] && typeof items[0] === 'object' && 'type' in items[0]) {
      const heights = items.map(item => getQuickEstimate(item as any))
      const averageHeight = heights.reduce((sum, height) => sum + height, 0) / heights.length
      const result = Math.round(averageHeight)
      
      // Debug logging for height estimation
      if (showPerformanceMetrics) {
        console.log('[DynamicHeightEstimation]', {
          itemCount: items.length,
          heights: heights.slice(0, 5), // Show first 5 heights
          averageHeight: result,
          originalEstimate: estimatedItemHeight
        })
      }
      
      return result
    }
    
    return estimatedItemHeight
  }, [items, useDynamicHeightEstimation, estimatedItemHeight, showPerformanceMetrics])

  // Virtualization configuration (memoized to prevent unnecessary re-initialization)
  const config: MasonryVirtualizerConfig = useMemo(() => ({
    columns,
    gap,
    overscan,
    estimatedItemHeight: dynamicEstimatedHeight,
    containerWidth: 0, // Will be set by the hook
    preMeasurement,
  }), [columns, gap, overscan, dynamicEstimatedHeight, preMeasurement])

  // Use the improved virtualization hook
  const {
    containerRef,
    state,
    metrics,
    containerWidth,
    handleScroll,
    measureItemHeight,
    getVisibleItems,
    getTotalHeight,
    getPerformanceStats,
    isPreMeasuring,
    preMeasurementProgress,
    preMeasurementError,
  } = useMasonryVirtualizer(items, keyExtractor, config, renderItem)

  // Get visible items for rendering
  const [visibleItems, setVisibleItems] = useState<Array<{ item: T; position: any; key: string }>>([])

  // Track previous items to detect changes
  const prevItemsRef = useRef<T[]>([])
  
  // Reset virtualization when items change (e.g., filters change)
  useEffect(() => {
    const itemsChanged = items.length !== prevItemsRef.current.length || 
      items.some((item, index) => keyExtractor(item) !== keyExtractor(prevItemsRef.current[index]))
    
    if (itemsChanged && prevItemsRef.current.length > 0) {
      console.log('[StableVirtualMasonryGrid] Items changed, resetting virtualization')
      // Note: useMasonryVirtualizer doesn't have reset/scrollToTop methods
      // The virtualization will handle item changes automatically
    }
    
    prevItemsRef.current = items
  }, [items, keyExtractor])

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
            <div>Height Measurements: {stats.heightMeasurer?.totalMeasurements || 0}</div>
            <div>Stable Measurements: {stats.heightMeasurer?.stableMeasurements || 0}</div>
            <div>Average Height: {stats.heightMeasurer?.averageHeight?.toFixed(0) || 0}</div>
            <div>Total Positions: {stats.positionCache?.totalPositions || 0}</div>
            <div>Total Height: {stats.positionCache?.totalHeight?.toFixed(0) || 0}</div>

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

  // Create a key that changes when items change to force re-render
  const containerKey = useMemo(() => {
    return items.length > 0 ? `${items.length}-${keyExtractor(items[0])}` : 'empty'
  }, [items, keyExtractor])

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
        key={containerKey}
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
