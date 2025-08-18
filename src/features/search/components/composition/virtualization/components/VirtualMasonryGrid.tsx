import React, { useCallback, useEffect, useRef } from 'react'
import { useMasonryVirtualizer } from '../hooks/useMasonryVirtualizer'
import { VirtualItem } from './VirtualItem'
import { VirtualizationLoadingScreen } from './VirtualizationLoadingScreen'
import type { MasonryVirtualizerConfig, PreMeasurementConfig } from '../types/virtualization'

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
  preMeasurement?: PreMeasurementConfig
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
  preMeasurement = {
    enabled: true,
    maxItemsToMeasure: 20,
    showLoadingScreen: true,
    showProgress: true
  },
}: VirtualMasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)

  // Virtualization configuration
  const config: Partial<MasonryVirtualizerConfig> = {
    columns,
    gap,
    overscan,
    estimatedItemHeight,
    preMeasurement,
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
    isPreMeasuring,
    preMeasurementProgress,
    preMeasurementError,
  } = useMasonryVirtualizer(items, keyExtractor, config, renderItem)

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

  // Log rendering state
  useEffect(() => {
    console.log('📱 [Grid] Rendering virtual container', {
      isPreMeasuring,
      opacity: isPreMeasuring ? 0 : 1,
      visibleItemsCount: visibleItems.length,
      totalHeight: getTotalHeight()
    })
  }, [isPreMeasuring, visibleItems.length, getTotalHeight])

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

  // Show loading screen during pre-measurement
  if (isPreMeasuring && preMeasurement.showLoadingScreen) {
    return (
      <VirtualizationLoadingScreen
        message="Measuring content layout for optimal performance..."
        showProgress={preMeasurement.showProgress}
        progress={preMeasurementProgress}
        totalItems={Math.min(items.length, preMeasurement.maxItemsToMeasure)}
      />
    )
  }

  // Show error if pre-measurement failed
  if (preMeasurementError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-destructive/10 rounded-lg">
        <div className="text-center">
          <p className="text-destructive mb-2">Pre-measurement failed</p>
          <p className="text-sm text-muted-foreground">{preMeasurementError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
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
        className="relative overflow-auto transition-opacity duration-300"
        style={{ 
          height: '100vh',
          opacity: isPreMeasuring ? 0 : 1
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
          {visibleItems.map(({ item, position, key }) => {
            return renderVirtualItem({ item, position, key })
          })}

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
