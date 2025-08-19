import type { ItemPosition, ColumnLayout } from '../types/virtualization'
import { calculateColumnHeights, findShortestColumn } from '../utils/layoutUtils'

/**
 * Position cache for tracking item positions in masonry layout
 */
export class PositionCache {
  private positions: Map<string, ItemPosition> = new Map()
  private columnHeights: number[] = []
  private columns: number = 3
  private gap: number = 12
  private totalHeight: number = 0
  private dirty: boolean = false

  constructor(columns: number = 3, gap: number = 12) {
    this.columns = columns
    this.gap = gap
    this.columnHeights = Array.from({ length: columns }, () => 0)
  }

  /**
   * Set item position
   */
  setPosition(key: string, position: ItemPosition): void {
    this.positions.set(key, position)
    this.dirty = true
  }

  /**
   * Get item position
   */
  getPosition(key: string): ItemPosition | undefined {
    return this.positions.get(key)
  }

  /**
   * Update item height and recalculate positions
   */
  updateItemHeight(key: string, height: number): void {
    const position = this.positions.get(key)
    if (position) {
      const oldHeight = position.height
      position.height = height
      
      // If height changed, recalculate positions for all items in the same column that come after this one
      if (oldHeight !== height) {
        this.recalculateColumnPositions(position.column, position.index)
      }
    }
  }

  /**
   * Recalculate positions for all items in a column starting from a specific index
   */
  private recalculateColumnPositions(columnIndex: number, startIndex: number): void {
    // Get all items in this column, sorted by index
    const columnItems = Array.from(this.positions.values())
      .filter(p => p.column === columnIndex && p.index >= startIndex)
      .sort((a, b) => a.index - b.index)

    // Recalculate positions starting from the changed item
    let currentTop = startIndex === 0 ? 0 : this.getColumnHeightBeforeIndex(columnIndex, startIndex)
    
    for (const item of columnItems) {
      item.top = currentTop
      currentTop += item.height + this.gap
    }

    // Update column height
    this.columnHeights[columnIndex] = currentTop
    this.totalHeight = Math.max(...this.columnHeights, 0)
  }

  /**
   * Get the height of a column before a specific index
   */
  private getColumnHeightBeforeIndex(columnIndex: number, index: number): number {
    const itemsBefore = Array.from(this.positions.values())
      .filter(p => p.column === columnIndex && p.index < index)
      .sort((a, b) => a.index - b.index)

    if (itemsBefore.length === 0) return 0

    const lastItem = itemsBefore[itemsBefore.length - 1]
    return lastItem.top + lastItem.height + this.gap
  }

  /**
   * Calculate positions for all items
   */
  calculatePositions(
    items: Array<{ key: string; height: number }>,
    startIndex: number = 0
  ): void {
    console.log('🔍 [PositionCache] calculatePositions called', {
      itemsCount: items.length,
      startIndex,
      columns: this.columns,
      firstItem: items[0] || 'none'
    })
    
    // Reset column heights
    this.columnHeights = Array.from({ length: this.columns }, () => 0)

    items.forEach((item, index) => {
      const globalIndex = startIndex + index
      const columnIndex = globalIndex % this.columns
      const top = this.columnHeights[columnIndex]

      const position: ItemPosition = {
        top,
        height: item.height,
        column: columnIndex,
        index: globalIndex
      }

      this.positions.set(item.key, position)
      this.columnHeights[columnIndex] = top + item.height + this.gap
    })

    this.totalHeight = Math.max(...this.columnHeights, 0)
    this.dirty = false
    
    console.log('🔍 [PositionCache] calculatePositions completed', {
      totalPositions: this.positions.size,
      totalHeight: this.totalHeight,
      columnHeights: this.columnHeights,
      firstPosition: Array.from(this.positions.entries())[0] || 'none'
    })
  }

  /**
   * Get visible range based on scroll position
   */
  getVisibleRange(
    scrollTop: number,
    containerHeight: number,
    overscan: number = 5
  ): { start: number; end: number } {
    const visibleStart = Math.max(0, scrollTop - overscan * 100)
    const visibleEnd = scrollTop + containerHeight + overscan * 100

    let startIndex = -1
    let endIndex = -1

    console.log('🔍 [PositionCache] getVisibleRange', {
      scrollTop,
      containerHeight,
      overscan,
      visibleStart,
      visibleEnd,
      totalPositions: this.positions.size
    })

    // Find start index
    for (const [key, position] of this.positions) {
      if (position.top + position.height >= visibleStart) {
        startIndex = position.index
        break
      }
    }

    // Find end index
    for (const [key, position] of this.positions) {
      if (position.top >= visibleEnd) {
        endIndex = position.index
        break
      }
    }

    // If end not found, use last item
    if (endIndex === -1) {
      const lastPosition = Array.from(this.positions.values())
        .sort((a, b) => b.index - a.index)[0]
      endIndex = lastPosition ? lastPosition.index + 1 : 0
    }

    const result = {
      start: Math.max(0, startIndex),
      end: Math.max(startIndex + 1, endIndex)
    }
    
    console.log('🔍 [PositionCache] getVisibleRange result', {
      startIndex,
      endIndex,
      result,
      positionsSample: Array.from(this.positions.entries()).slice(0, 3).map(([key, pos]) => ({ key, top: pos.top, height: pos.height }))
    })

    return result
  }

  /**
   * Get items in visible range
   */
  getVisibleItems(
    scrollTop: number,
    containerHeight: number,
    overscan: number = 5
  ): Array<{ key: string; position: ItemPosition }> {
    const { start, end } = this.getVisibleRange(scrollTop, containerHeight, overscan)
    const visibleItems: Array<{ key: string; position: ItemPosition }> = []

    console.log('🔍 [PositionCache] getVisibleItems', {
      scrollTop,
      containerHeight,
      overscan,
      visibleRange: { start, end },
      totalPositions: this.positions.size,
      columnHeights: this.columnHeights
    })

    for (const [key, position] of this.positions) {
      if (position.index >= start && position.index < end) {
        visibleItems.push({ key, position })
      }
    }

    const result = visibleItems.sort((a, b) => a.position.index - b.position.index)
    
    console.log('🔍 [PositionCache] Visible items found', {
      count: result.length,
      firstKey: result[0]?.key || 'none',
      firstPosition: result[0]?.position || 'none'
    })

    return result
  }

  /**
   * Get column layouts
   */
  getColumnLayouts(): ColumnLayout[] {
    return calculateColumnHeights(this.positions, this.columns)
  }

  /**
   * Get total height
   */
  getTotalHeight(): number {
    if (this.dirty) {
      this.totalHeight = Math.max(...this.columnHeights, 0)
    }
    return this.totalHeight
  }

  /**
   * Get column heights
   */
  getColumnHeights(): number[] {
    return [...this.columnHeights]
  }

  /**
   * Find shortest column
   */
  getShortestColumn(): number {
    let shortestColumn = 0
    let shortestHeight = this.columnHeights[0] || 0
    
    for (let i = 1; i < this.columnHeights.length; i++) {
      const height = this.columnHeights[i] || 0
      if (height < shortestHeight) {
        shortestHeight = height
        shortestColumn = i
      }
    }
    
    return shortestColumn
  }

  /**
   * Get column info
   */
  getColumnInfo(columnIndex: number) {
    return {
      index: columnIndex,
      height: this.columnHeights[columnIndex] || 0,
      items: Array.from(this.positions.values()).filter(p => p.column === columnIndex)
    }
  }

  /**
   * Scroll to specific item
   */
  scrollToItem(index: number): number {
    const position = Array.from(this.positions.values())
      .find(p => p.index === index)
    
    return position ? position.top : 0
  }

  /**
   * Get item at specific scroll position
   */
  getItemAtScrollPosition(scrollTop: number): string | null {
    for (const [key, position] of this.positions) {
      if (scrollTop >= position.top && scrollTop < position.top + position.height) {
        return key
      }
    }
    return null
  }

  /**
   * Add item to layout
   */
  addItem(key: string, height: number, index: number): ItemPosition {
    // Find the shortest column for proper masonry layout
    const columnIndex = this.getShortestColumn()
    return this.addItemToColumn(key, height, index, columnIndex)
  }

  /**
   * Add item to a specific column
   */
  addItemToColumn(key: string, height: number, index: number, columnIndex: number): ItemPosition {
    const top = this.columnHeights[columnIndex]

    // DEBUG: Log column assignment (throttled to avoid spam)
    if (index < 20 || index % 100 === 0) {
      console.log(`[PositionCache] Item ${index} (${key}) assigned to column ${columnIndex}:`, {
        height,
        top,
        columnHeights: [...this.columnHeights],
        columnIndex
      })
    }

    const position: ItemPosition = {
      top,
      height,
      column: columnIndex,
      index
    }

    this.positions.set(key, position)
    this.columnHeights[columnIndex] = top + height + this.gap
    this.totalHeight = Math.max(...this.columnHeights, 0)

    return position
  }

  /**
   * Clear all positions
   */
  clear(): void {
    this.positions.clear()
    this.columnHeights = Array.from({ length: this.columns }, () => 0)
    this.totalHeight = 0
    this.dirty = false
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalPositions: number
    totalHeight: number
    averageColumnHeight: number
    isDirty: boolean
  } {
    const averageColumnHeight = this.columnHeights.length > 0
      ? this.columnHeights.reduce((sum, height) => sum + height, 0) / this.columnHeights.length
      : 0

    return {
      totalPositions: this.positions.size,
      totalHeight: this.totalHeight,
      averageColumnHeight,
      isDirty: this.dirty
    }
  }

  /**
   * Update configuration
   */
  updateConfig(columns: number, gap: number): void {
    this.columns = columns
    this.gap = gap
    this.columnHeights = Array.from({ length: columns }, () => 0)
    this.dirty = true
  }
}
