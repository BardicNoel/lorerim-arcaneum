import React, { useCallback, useEffect, useRef } from 'react'
import { useMasonryVirtualizer } from '../hooks/useMasonryVirtualizer'
import { VirtualItem } from './VirtualItem'
import type { MasonryVirtualizerConfig } from '../types/virtualization'

export interface VirtualMasonryGridProps<T> {
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

export function VirtualMasonryGrid<T>({
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
  estimatedItemHeight = 200,
  showPerformanceMetrics = false,
}: VirtualMasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)

  // Virtualization configuration
  const config: Partial<MasonryVirtualizerConfig> = {
    columns,
    gap,
    overscan,
    estimatedItemHeight,
  }

  // Use virtualization hook
  const {
    containerRef: virtualContainerRef,
    state,
    metrics,
    handleScroll,
    measureItemHeight,
    getVisibleItems,
    getTotalHeight,
    getPerformanceStats,
  } = useMasonryVirtualizer(items, keyExtractor, config)

  // Get visible items for rendering
  const visibleItems = getVisibleItems()

  // Handle infinite scroll
  useEffect(() => {
    if (!loadMore || !hasMore || !loadMoreTriggerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && loadMore) {
            loadMore()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreTriggerRef.current)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

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
        <div>Total Items: {metrics.totalItems}</div>
        <div>Visible Items: {metrics.visibleItems}</div>
        <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
        <div>FPS: {metrics.scrollFPS}</div>
        <div>Render Time: {metrics.renderTime.toFixed(2)}ms</div>
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
        ref={virtualContainerRef}
        className="relative overflow-auto"
        style={{ height: '100vh' }}
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

          {/* Load more trigger */}
          {hasMore && (
            <div
              ref={loadMoreTriggerRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '20px',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
