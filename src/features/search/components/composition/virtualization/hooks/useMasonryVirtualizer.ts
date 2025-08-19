import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { 
  MasonryVirtualizerConfig, 
  VirtualizationState, 
  VirtualizationMetrics,
  ItemPosition 
} from '../types/virtualization'
import { MasonryVirtualizer } from '../engine/MasonryVirtualizer'
import { debounce, throttle } from '../utils/performanceUtils'
import { usePreMeasurement } from './usePreMeasurement'

/**
 * Hook for masonry virtualization
 */
export function useMasonryVirtualizer<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config: Partial<MasonryVirtualizerConfig> = {},
  renderItem?: (item: T) => React.ReactNode
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const virtualizerRef = useRef<MasonryVirtualizer | null>(null)
  
  const [state, setState] = useState<VirtualizationState>({
    visibleRange: { start: 0, end: 0 },
    scrollTop: 0,
    containerHeight: 0,
    itemPositions: new Map(),
    isPreMeasuring: false,
    preMeasuredHeights: new Map(),
    preMeasurementProgress: 0,
    preMeasurementError: null
  })
  
  const [metrics, setMetrics] = useState<VirtualizationMetrics>({
    totalItems: 0,
    visibleItems: 0,
    memoryUsage: 0,
    renderTime: 0,
    scrollFPS: 0
  })

  const [containerWidth, setContainerWidth] = useState(0)

  // Default configuration
  const defaultConfig: MasonryVirtualizerConfig = {
    columns: 3,
    gap: 12,
    overscan: 5,
    estimatedItemHeight: 200,
    ...config
  }

  // Pre-measurement hook
  const preMeasurementConfig = config.preMeasurement || {
    enabled: true,
    maxItemsToMeasure: 20,
    showLoadingScreen: true,
    showProgress: true
  }

  // Memoize the pre-measurement config to prevent infinite re-renders
  const preMeasurementConfigMemo = useMemo(() => ({
    maxItemsToMeasure: preMeasurementConfig.maxItemsToMeasure,
    columnWidth: containerWidth || 300, // fallback
    renderItem: renderItem || (() => null),
    keyExtractor
  }), [preMeasurementConfig.maxItemsToMeasure, containerWidth, renderItem, keyExtractor])

  const { isMeasuring, measuredHeights, progress, error } = usePreMeasurement(
    items,
    preMeasurementConfigMemo
  )

  // Initialize virtualizer
  useEffect(() => {
    if (!containerRef.current) return

    virtualizerRef.current = new MasonryVirtualizer(
      defaultConfig,
      containerRef as React.RefObject<HTMLElement>,
      keyExtractor
    )

    virtualizerRef.current.onStateChangeCallback(setState)
    virtualizerRef.current.onMetricsChangeCallback(setMetrics)

    return () => {
      virtualizerRef.current?.destroy()
      virtualizerRef.current = null
    }
  }, [keyExtractor])

  // Update items when they change
  useEffect(() => {
    console.log('🔍 [Virtualizer] Items changed, initializing virtualizer', {
      itemsCount: items.length,
      hasVirtualizer: !!virtualizerRef.current,
      firstItem: items[0] ? keyExtractor(items[0]) : 'none'
    })
    
    virtualizerRef.current?.initialize(items)
  }, [items, keyExtractor])

  // Update virtualizer with measured heights
  useEffect(() => {
    console.log('🔍 [Virtualizer] measuredHeights changed', {
      measuredHeightsSize: measuredHeights.size,
      hasVirtualizer: !!virtualizerRef.current,
      firstHeight: Array.from(measuredHeights.entries())[0] || 'none'
    })
    
    if (virtualizerRef.current && measuredHeights.size > 0) {
      console.log('🔍 [Virtualizer] Calling setPreMeasuredHeights')
      virtualizerRef.current.setPreMeasuredHeights(measuredHeights)
    }
  }, [measuredHeights])

  // Update state with pre-measurement info
  useEffect(() => {
    console.log('🔍 [Virtualizer] Updating state with pre-measurement info', {
      isMeasuring,
      measuredHeightsSize: measuredHeights.size,
      progress,
      error
    })
    
    setState(prev => ({
      ...prev,
      isPreMeasuring: isMeasuring,
      preMeasuredHeights: measuredHeights,
      preMeasurementProgress: progress,
      preMeasurementError: error
    }))
  }, [isMeasuring, measuredHeights, progress, error])

  // Handle container resize
  const handleResize = useCallback(
    debounce(() => {
      if (!containerRef.current || !virtualizerRef.current) return

      const width = containerRef.current.offsetWidth
      setContainerWidth(width)
      
      virtualizerRef.current.handleResize(width, config.maxColumnWidth)
    }, 100),
    [config.maxColumnWidth]
  )

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Handle scroll events
  const handleScroll = useCallback(
    throttle((event: React.UIEvent<HTMLDivElement>) => {
      if (!virtualizerRef.current || !containerRef.current) return

      const scrollTop = event.currentTarget.scrollTop
      const containerHeight = containerRef.current.clientHeight

      virtualizerRef.current.handleScroll(scrollTop, containerHeight)
    }, 16), // ~60fps
    []
  )

  // Measure item height
  const measureItemHeight = useCallback(async (element: HTMLElement, item: T) => {
    await virtualizerRef.current?.measureItemHeight(element, item)
  }, [])

  // Scroll to item
  const scrollToItem = useCallback((index: number) => {
    virtualizerRef.current?.scrollToItem(index)
  }, [])

  // Get visible items
  const getVisibleItems = useCallback(() => {
    // Only block rendering during the initial pre-measurement pass
    // Keep showing items on subsequent re-measurements (e.g., width changes)
    if (preMeasurementConfig.enabled && isMeasuring && measuredHeights.size === 0) {
      console.log('🔍 [Virtualizer] Blocking rendering during initial pre-measurement')
      return []
    }
    
    if (!virtualizerRef.current || !containerRef.current) {
      console.log('🔍 [Virtualizer] No virtualizer or container ref')
      return []
    }

    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight

    console.log('🔍 [Virtualizer] Getting visible items', {
      scrollTop,
      containerHeight,
      isMeasuring,
      measuredHeightsSize: measuredHeights.size
    })

    const visibleItems = virtualizerRef.current.getVisibleItems(scrollTop, containerHeight)
    
    console.log('🔍 [Virtualizer] Visible items result', {
      visibleItemsCount: visibleItems.length,
      firstItem: visibleItems[0]?.item?.id || 'none'
    })
    
    return visibleItems
  }, [isMeasuring, preMeasurementConfig.enabled, measuredHeights.size])

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<MasonryVirtualizerConfig>) => {
    virtualizerRef.current?.updateConfig(newConfig)
  }, [])

  // Get performance stats
  const getPerformanceStats = useCallback(() => {
    return virtualizerRef.current?.getPerformanceStats()
  }, [])

  // Get total height
  const getTotalHeight = useCallback(() => {
    return virtualizerRef.current?.getTotalHeight() || 0
  }, [])

  // Get column layouts
  const getColumnLayouts = useCallback(() => {
    return virtualizerRef.current?.getColumnLayouts() || []
  }, [])

  return {
    // Refs
    containerRef,
    
    // State
    state,
    metrics,
    containerWidth,
    
    // Pre-measurement state
    isPreMeasuring: isMeasuring,
    preMeasurementProgress: progress,
    preMeasurementError: error,
    
    // Actions
    handleScroll,
    measureItemHeight,
    scrollToItem,
    updateConfig,
    
    // Getters
    getVisibleItems,
    getTotalHeight,
    getColumnLayouts,
    getPerformanceStats,
    
    // Configuration
    config: defaultConfig
  }
}

