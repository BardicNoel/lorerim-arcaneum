import { useCallback, useRef, useState, useEffect } from 'react'
import { MultiColumnVirtualizer } from '../engine/MultiColumnVirtualizer'
import type { VirtualizationState, MasonryVirtualizerConfig } from '../types/virtualization'

export function useMultiColumnVirtualization<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config: MasonryVirtualizerConfig
) {
  const [virtualizationState, setVirtualizationState] = useState<VirtualizationState>({
    visibleRange: { start: 0, end: 0 },
    scrollTop: 0,
    containerHeight: 0,
    itemPositions: new Map()
  })

  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const virtualizerRef = useRef<MultiColumnVirtualizer<T> | null>(null)

  // Initialize virtualizer with items
  useEffect(() => {
    if (!containerRef.current) return

    virtualizerRef.current = new MultiColumnVirtualizer(config)
    
    // Initialize with items immediately if available
    if (items.length > 0) {
      virtualizerRef.current.initializeVirtualizer(items, keyExtractor, containerRef.current)
    }

    return () => {
      virtualizerRef.current?.destroy()
      virtualizerRef.current = null
    }
  }, [config, items, keyExtractor])

  // Handle container resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !virtualizerRef.current) return

    const width = containerRef.current.offsetWidth
    setContainerWidth(width)
    
    // Update config with new container width
    virtualizerRef.current.updateConfig({ ...config, containerWidth: width })
  }, [config])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!virtualizerRef.current || !containerRef.current) return

    const scrollTop = event.currentTarget.scrollTop
    const containerHeight = containerRef.current.clientHeight

    // Update state
    setVirtualizationState(prev => ({
      ...prev,
      scrollTop,
      containerHeight
    }))
  }, [])

  // Get visible items
  const getVisibleItems = useCallback(() => {
    if (!virtualizerRef.current || !containerRef.current) return []

    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight

    return virtualizerRef.current.getVisibleItems(scrollTop, containerHeight)
  }, [])

  // Measure item height with immediate update
  const measureItemHeight = useCallback((element: HTMLElement, item: T) => {
    if (!virtualizerRef.current) return

    const height = element.offsetHeight
    const itemKey = keyExtractor(item)
    
    // Update immediately for better responsiveness during scrolling
    virtualizerRef.current.updateItemHeight(itemKey, height)
  }, [keyExtractor])

  // Get total height
  const getTotalHeight = useCallback(() => {
    return virtualizerRef.current?.getTotalHeight() || 0
  }, [])

  // Get performance stats
  const getPerformanceStats = useCallback(() => {
    return virtualizerRef.current?.getStats()
  }, [])

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<MasonryVirtualizerConfig>) => {
    virtualizerRef.current?.updateConfig(newConfig)
  }, [])

  return {
    // Refs
    containerRef,
    
    // State
    state: virtualizationState,
    containerWidth,
    
    // Actions
    handleScroll,
    measureItemHeight,
    updateConfig,
    
    // Getters
    getVisibleItems,
    getTotalHeight,
    getPerformanceStats,
    
    // Configuration
    config
  }
}

