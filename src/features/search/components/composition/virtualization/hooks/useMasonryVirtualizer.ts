import { useCallback, useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { 
  MasonryVirtualizerConfig, 
  VirtualizationState, 
  VirtualizationMetrics,
  ItemPosition 
} from '../types/virtualization'
import { MasonryVirtualizer } from '../engine/MasonryVirtualizer'
import { debounce, throttle } from '../utils/performanceUtils'

/**
 * Hook for masonry virtualization
 */
export function useMasonryVirtualizer<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config: Partial<MasonryVirtualizerConfig> = {}
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const virtualizerRef = useRef<MasonryVirtualizer | null>(null)
  
  const [state, setState] = useState<VirtualizationState>({
    visibleRange: { start: 0, end: 0 },
    scrollTop: 0,
    containerHeight: 0,
    itemPositions: new Map()
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

  // Initialize virtualizer
  useEffect(() => {
    if (!containerRef.current) return

    virtualizerRef.current = new MasonryVirtualizer(
      defaultConfig,
      containerRef,
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
    virtualizerRef.current?.initialize(items)
  }, [items])

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
    if (!virtualizerRef.current || !containerRef.current) return []

    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight

    return virtualizerRef.current.getVisibleItems(scrollTop, containerHeight)
  }, [])

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

