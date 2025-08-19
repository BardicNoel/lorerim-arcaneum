// Note: We're not using useVirtualizer directly in the engine class
// It's used in the React hooks instead
import type { 
  MasonryVirtualizerConfig, 
  VirtualizationState, 
  VirtualizationMetrics,
  ItemPosition,
  PreMeasurementConfig
} from '../types/virtualization'
import { HeightMeasurer } from './HeightMeasurer'
import { PositionCache } from './PositionCache'
import { PerformanceMonitor } from '../utils/performanceUtils'
import { calculateResponsiveColumns } from '../utils/layoutUtils'

/**
 * Core masonry virtualization engine
 */
export class MasonryVirtualizer {
  private config: MasonryVirtualizerConfig
  private heightMeasurer: HeightMeasurer
  private positionCache: PositionCache
  private performanceMonitor: PerformanceMonitor
  private containerRef: React.RefObject<HTMLElement>
  private items: any[] = []
  private keyExtractor: (item: any) => string
  private onStateChange?: (state: VirtualizationState) => void
  private onMetricsChange?: (metrics: VirtualizationMetrics) => void
  private preMeasuredHeights: Map<string, number> = new Map()
  private preMeasurementConfig: PreMeasurementConfig

  constructor(
    config: MasonryVirtualizerConfig,
    containerRef: React.RefObject<HTMLElement>,
    keyExtractor: (item: any) => string
  ) {
    this.config = config
    this.containerRef = containerRef
    this.keyExtractor = keyExtractor
    this.heightMeasurer = new HeightMeasurer()
    this.positionCache = new PositionCache(config.columns, config.gap)
    this.performanceMonitor = new PerformanceMonitor()
    
    // Initialize pre-measurement config
    this.preMeasurementConfig = config.preMeasurement || {
      enabled: true,
      maxItemsToMeasure: 20,
      showLoadingScreen: true,
      showProgress: true
    }
  }

  /**
   * Initialize virtualizer with items
   */
  initialize(items: any[]): void {
    this.items = items
    this.positionCache.clear()
    this.heightMeasurer.clear()
    this.performanceMonitor.reset()
    
    // Calculate initial positions with estimated heights
    this.calculateInitialPositions()
  }

  /**
   * Calculate initial positions using estimated heights
   */
  private calculateInitialPositions(): void {
    const itemsWithHeights = this.items.map((item, index) => ({
      key: this.keyExtractor(item),
      height: this.config.estimatedItemHeight
    }))

    this.positionCache.calculatePositions(itemsWithHeights)
    this.updateState()
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MasonryVirtualizerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.positionCache.updateConfig(this.config.columns, this.config.gap)
    this.calculateInitialPositions()
  }

  /**
   * Handle container resize
   */
  handleResize(containerWidth: number, maxColumnWidth?: number): void {
    const newColumns = calculateResponsiveColumns(
      containerWidth,
      maxColumnWidth || 0,
      this.config.columns
    )

    if (newColumns !== this.config.columns) {
      this.updateConfig({ columns: newColumns })
    }
  }

  /**
   * Measure item height and update positions
   */
  async measureItemHeight(element: HTMLElement, item: any): Promise<void> {
    const key = this.keyExtractor(item)
    
    try {
      const height = await this.heightMeasurer.measureHeight(element, key)
      
      // Update position cache
      this.positionCache.updateItemHeight(key, height)
      
      // Recalculate positions if needed
      if (this.positionCache.getStats().isDirty) {
        this.recalculatePositions()
      }
      
      this.updateState()
    } catch (error) {
      console.warn('Failed to measure item height:', error)
    }
  }

  /**
   * Recalculate all positions
   */
  private recalculatePositions(): void {
    const itemsWithHeights = this.items.map((item, index) => {
      const key = this.keyExtractor(item)
      const height = this.getItemHeight(key)
      return { key, height }
    })

    this.positionCache.calculatePositions(itemsWithHeights)
  }

  /**
   * Get visible items for current scroll position
   */
  getVisibleItems(scrollTop: number, containerHeight: number): Array<{
    item: any
    position: ItemPosition
    key: string
  }> {
    console.log('🔍 [MasonryVirtualizer] getVisibleItems called', {
      scrollTop,
      containerHeight,
      itemsCount: this.items.length,
      positionsCount: this.positionCache['positions'].size,
      preMeasuredHeightsCount: this.preMeasuredHeights.size
    })

    const visibleItems = this.positionCache.getVisibleItems(
      scrollTop,
      containerHeight,
      this.config.overscan
    )

    console.log('🔍 [MasonryVirtualizer] PositionCache returned', {
      visibleItemsCount: visibleItems.length,
      firstVisibleKey: visibleItems[0]?.key || 'none'
    })

    const result = visibleItems.map(({ key, position }) => {
      const item = this.items.find(item => this.keyExtractor(item) === key)
      return { item, position, key }
    }).filter(result => result.item !== undefined)

    console.log('🔍 [MasonryVirtualizer] Final result', {
      resultCount: result.length,
      firstItemId: result[0]?.item?.id || 'none'
    })

    return result
  }

  /**
   * Handle scroll event
   */
  handleScroll(scrollTop: number, containerHeight: number): void {
    this.performanceMonitor.updateScrollFPS()
    
    const state: VirtualizationState = {
      visibleRange: this.positionCache.getVisibleRange(scrollTop, containerHeight, this.config.overscan),
      scrollTop,
      containerHeight,
      itemPositions: new Map(this.positionCache['positions'])
    }

    this.updateState(state)
    this.updateMetrics()
  }

  /**
   * Update virtualization state
   */
  private updateState(state?: VirtualizationState): void {
    if (!state) {
      const containerElement = this.containerRef.current
      if (!containerElement) return

      const scrollTop = containerElement.scrollTop
      const containerHeight = containerElement.clientHeight
      
      const visibleRange = this.positionCache.getVisibleRange(scrollTop, containerHeight, this.config.overscan)
      
      console.log('🔍 [MasonryVirtualizer] updateState (no state provided)', {
        scrollTop,
        containerHeight,
        visibleRange,
        positionsCount: this.positionCache['positions'].size
      })
      
      state = {
        visibleRange,
        scrollTop,
        containerHeight,
        itemPositions: new Map(this.positionCache['positions'])
      }
    } else {
      console.log('🔍 [MasonryVirtualizer] updateState (state provided)', {
        visibleRange: state.visibleRange,
        scrollTop: state.scrollTop,
        containerHeight: state.containerHeight
      })
    }

    this.onStateChange?.(state)
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    const stats = this.positionCache.getStats()
    
    const metrics: VirtualizationMetrics = {
      totalItems: this.items.length,
      visibleItems: stats.totalPositions,
      memoryUsage: stats.totalPositions * 1024, // Estimate 1KB per item
      renderTime: this.performanceMonitor.endRenderTimer(),
      scrollFPS: this.performanceMonitor.getCurrentFPS()
    }

    this.onMetricsChange?.(metrics)
  }

  /**
   * Scroll to specific item
   */
  scrollToItem(index: number): void {
    const scrollTop = this.positionCache.scrollToItem(index)
    const containerElement = this.containerRef.current
    
    if (containerElement) {
      containerElement.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  /**
   * Get total height for virtual scrolling
   */
  getTotalHeight(): number {
    return this.positionCache.getTotalHeight()
  }

  /**
   * Get column layouts
   */
  getColumnLayouts() {
    return this.positionCache.getColumnLayouts()
  }

  /**
   * Set state change callback
   */
  onStateChangeCallback(callback: (state: VirtualizationState) => void): void {
    this.onStateChange = callback
  }

  /**
   * Set metrics change callback
   */
  onMetricsChangeCallback(callback: (metrics: VirtualizationMetrics) => void): void {
    this.onMetricsChange = callback
  }

  /**
   * Set pre-measured heights from offscreen measurement
   */
  setPreMeasuredHeights(heights: Map<string, number>): void {
    console.log('🔍 [MasonryVirtualizer] setPreMeasuredHeights called', {
      heightsCount: heights.size,
      firstHeight: Array.from(heights.entries())[0] || 'none'
    })
    
    this.preMeasuredHeights = heights
    this.recalculatePositionsWithPreMeasuredHeights()
  }

  /**
   * Get item height with pre-measured fallback
   */
  getItemHeight(itemKey: string): number {
    // Use pre-measured height if available
    if (this.preMeasuredHeights.has(itemKey)) {
      return this.preMeasuredHeights.get(itemKey)!
    }
    
    // Fall back to estimation for items beyond pre-measured set
    return this.heightMeasurer.estimateHeight(itemKey, this.config.estimatedItemHeight)
  }

  /**
   * Recalculate positions using pre-measured heights
   */
  private recalculatePositionsWithPreMeasuredHeights(): void {
    console.log('🔍 [MasonryVirtualizer] recalculatePositionsWithPreMeasuredHeights called', {
      itemsCount: this.items.length
    })
    
    const itemsWithHeights = this.items.map((item, index) => {
      const key = this.keyExtractor(item)
      const height = this.getItemHeight(key)
      return { key, height }
    })

    console.log('🔍 [MasonryVirtualizer] Items with heights', {
      count: itemsWithHeights.length,
      firstItem: itemsWithHeights[0] || 'none',
      heights: itemsWithHeights.slice(0, 5).map(item => ({ key: item.key, height: item.height }))
    })

    this.positionCache.calculatePositions(itemsWithHeights)
    this.updateState()
    
    console.log('🔍 [MasonryVirtualizer] Recalculation completed')
  }

  /**
   * Get pre-measurement config
   */
  getPreMeasurementConfig(): PreMeasurementConfig {
    return this.preMeasurementConfig
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.heightMeasurer.clear()
    this.positionCache.clear()
    this.performanceMonitor.reset()
    this.preMeasuredHeights.clear()
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      heightMeasurer: this.heightMeasurer.getStats(),
      positionCache: this.positionCache.getStats(),
      performance: {
        averageFPS: this.performanceMonitor.getAverageFPS(),
        currentFPS: this.performanceMonitor.getCurrentFPS()
      }
    }
  }
}
