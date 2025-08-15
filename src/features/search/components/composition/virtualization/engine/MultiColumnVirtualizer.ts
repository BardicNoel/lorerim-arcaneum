import type { ItemPosition, VirtualizationState, MasonryVirtualizerConfig, ResponsiveConfig } from '../types/virtualization'
import { PositionCache } from './PositionCache'
import { HeightMeasurer } from './HeightMeasurer'
import { ResponsiveColumnManager } from './ResponsiveColumnManager'

export class MultiColumnVirtualizer<T> {
  private config: MasonryVirtualizerConfig
  private positionCache: PositionCache
  private heightMeasurer: HeightMeasurer
  private responsiveManager: ResponsiveColumnManager
  private items: T[] = []
  private keyExtractor: (item: T) => string

  constructor(config: MasonryVirtualizerConfig) {
    this.config = config
    
    // Create responsive column manager
    const responsiveConfig: ResponsiveConfig = {
      defaultColumns: config.columns,
      maxColumnWidth: config.maxColumnWidth || 400,
      gap: config.gap,
      breakpoints: config.breakpoints || [],
      enableSmoothTransitions: true,
      transitionDuration: 300
    }
    
    this.responsiveManager = new ResponsiveColumnManager(responsiveConfig)
    this.positionCache = new PositionCache(config.columns, config.gap)
    this.heightMeasurer = new HeightMeasurer()
    this.keyExtractor = () => ''
  }

  public initializeVirtualizer(
    items: T[],
    keyExtractor: (item: T) => string,
    scrollElement: HTMLDivElement | null
  ): void {
    this.items = items
    this.keyExtractor = keyExtractor

    // Initialize layout with all items
    this.initializeLayout()
  }

  private initializeLayout(): void {
    console.log(`[initializeLayout] Starting with ${this.items.length} items`)
    
    // Clear existing layout
    this.positionCache.clear()
    this.heightMeasurer.clear()

    // Place all items initially with estimated heights, but use a better distribution strategy
    this.items.forEach((item, index) => {
      const itemKey = this.keyExtractor(item)
      
      // Use round-robin for initial distribution to ensure even spread
      const columnIndex = index % this.config.columns
      const position = this.positionCache.addItemToColumn(itemKey, this.config.estimatedItemHeight, index, columnIndex)
      
      // DEBUG: Log initial distribution
      if (index < 10) { // Only log first 10 to avoid spam
        console.log(`[initializeLayout] Item ${index} (${itemKey}) initially placed in column ${columnIndex}`)
      }
      
      // Store initial position
      this.heightMeasurer.setInitialHeight(itemKey, this.config.estimatedItemHeight)
    })
    
    console.log(`[initializeLayout] Placed all ${this.items.length} items initially`)
    console.log(`[initializeLayout] Final column heights:`, this.positionCache.getColumnHeights())
  }



  public updateItemHeight(itemKey: string, height: number): void {
    // Get current position before update
    const oldPosition = this.positionCache.getPosition(itemKey)
    
    // Update height measurer immediately
    this.heightMeasurer.updateHeight(itemKey, height)
    
    // Update position cache immediately for better responsiveness
    this.positionCache.updateItemHeight(itemKey, height)
    
    // Get new position after update
    const newPosition = this.positionCache.getPosition(itemKey)
    if (Math.random() < 0.05) { // Only log 5% of updates to reduce spam
      console.log(`[MultiColumnVirtualizer] Height update for ${itemKey}:`, {
        oldHeight: oldPosition?.height,
        newHeight: height,
        oldColumn: oldPosition?.column,
        newColumn: newPosition?.column,
        oldTop: oldPosition?.top,
        newTop: newPosition?.top
      })
    }
  }

  public getVisibleItems(scrollTop: number, viewportHeight: number): Array<{ item: T; position: ItemPosition; key: string }> {
    const result: Array<{ item: T; position: ItemPosition; key: string }> = []

    // If no items, return empty array
    if (this.items.length === 0) {
      return result
    }

    // Calculate visible range with overscan
    const visibleStart = Math.max(0, scrollTop - this.config.overscan * 100)
    const visibleEnd = scrollTop + viewportHeight + this.config.overscan * 100

    // Find items in visible range
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const key = this.keyExtractor(item)
      const position = this.positionCache.getPosition(key)
      
      if (position) {
        const itemTop = position.top
        const itemBottom = itemTop + position.height
        
        // Check if item is in visible range
        if (itemBottom >= visibleStart && itemTop <= visibleEnd) {
          result.push({ item, position, key })
        }
      }
    }

    // DEBUG: Log final result
    console.log(`[getVisibleItems] Found ${result.length} visible items`)

    return result
  }

  public getVisibleRange(scrollTop: number, viewportHeight: number): { start: number; end: number } {
    // Find items that are visible in the viewport
    const start = this.findItemIndexAtPosition(scrollTop)
    const end = this.findItemIndexAtPosition(scrollTop + viewportHeight)
    
    return {
      start: Math.max(0, start - this.config.overscan),
      end: Math.min(this.items.length - 1, end + this.config.overscan)
    }
  }

  private findItemIndexAtPosition(scrollTop: number): number {
    // Binary search to find the item at a given scroll position
    let left = 0
    let right = this.items.length - 1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const item = this.items[mid]
      const key = this.keyExtractor(item)
      const position = this.positionCache.getPosition(key)

      if (!position) {
        left = mid + 1
        continue
      }

      const itemTop = position.top
      const itemBottom = itemTop + position.height

      if (scrollTop >= itemTop && scrollTop < itemBottom) {
        return mid
      } else if (scrollTop < itemTop) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    }

    return Math.min(left, this.items.length - 1)
  }

  public getItemPosition(itemKey: string): ItemPosition | undefined {
    return this.positionCache.getPosition(itemKey)
  }

  public getTotalHeight(): number {
    return this.positionCache.getTotalHeight()
  }

  public updateConfig(newConfig: Partial<MasonryVirtualizerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Update responsive manager
    if (newConfig.columns || newConfig.maxColumnWidth || newConfig.gap) {
      const responsiveConfig: Partial<ResponsiveConfig> = {
        defaultColumns: newConfig.columns || this.config.columns,
        maxColumnWidth: newConfig.maxColumnWidth || this.config.maxColumnWidth || 400,
        gap: newConfig.gap || this.config.gap,
        breakpoints: newConfig.breakpoints || this.config.breakpoints || []
      }
      this.responsiveManager.updateConfig(responsiveConfig)
    }
    
    // Update position cache with current columns
    const currentColumns = this.responsiveManager.getCurrentColumns()
    this.positionCache.updateConfig(currentColumns, newConfig.gap || this.config.gap)
    
    // Reinitialize layout with new config
    this.initializeLayout()
  }

  public getColumnInfo(columnIndex: number) {
    return this.positionCache.getColumnInfo(columnIndex)
  }

  public getShortestColumn(): number {
    return this.positionCache.getShortestColumn()
  }

  public getCurrentColumns(): number {
    return this.responsiveManager.getCurrentColumns()
  }

  public observeContainer(element: HTMLElement): void {
    this.responsiveManager.observeElement(element)
  }

  public addColumnChangeCallback(callback: (event: any) => void): void {
    this.responsiveManager.addChangeCallback(callback)
  }

  public getStats() {
    return {
      totalItems: this.items.length,
      totalPositions: this.positionCache.getStats().totalPositions,
      heightMeasurements: this.heightMeasurer.getStats(),
      columnHeights: this.positionCache.getColumnHeights()
    }
  }

  public destroy(): void {
    this.heightMeasurer.destroy()
    this.responsiveManager.destroy()
  }

  public reset(): void {
    // Clear all cached data and reinitialize
    this.positionCache.clear()
    this.heightMeasurer.clear()
    this.initializeLayout()
  }
}
