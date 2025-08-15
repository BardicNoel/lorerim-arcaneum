# Task 3: Masonry Layout Engine

## 📋 Overview
Implement the masonry layout engine that handles multi-column distribution, item positioning, and responsive column calculation for the virtualized grid.

## 🎯 Objectives
- Create MasonryLayoutEngine class
- Implement multi-column item distribution
- Add responsive column calculation
- Handle gap and spacing management

## 🏗 Implementation Steps

### Step 1: Create MasonryLayoutEngine Class
Create `engine/MasonryLayoutEngine.ts`:

```typescript
import { ItemPosition } from '../types/virtualization'

export interface MasonryLayoutConfig {
  columns: number
  gap: number
  containerWidth: number
  maxColumnWidth?: number
}

export interface ColumnInfo {
  index: number
  height: number
  itemCount: number
  width: number
}

export class MasonryLayoutEngine {
  private config: MasonryLayoutConfig
  private columns: ColumnInfo[]
  private itemPositions: Map<string, ItemPosition>

  constructor(config: MasonryLayoutConfig) {
    this.config = config
    this.itemPositions = new Map()
    this.initializeColumns()
  }

  private initializeColumns(): void {
    const { columns, gap, containerWidth } = this.config
    const columnWidth = (containerWidth - (gap * (columns - 1))) / columns

    this.columns = Array.from({ length: columns }, (_, index) => ({
      index,
      height: 0,
      itemCount: 0,
      width: columnWidth
    }))
  }

  public updateConfig(newConfig: Partial<MasonryLayoutConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.initializeColumns()
    this.recalculateAllPositions()
  }

  public addItem(itemKey: string, estimatedHeight: number): ItemPosition {
    const shortestColumn = this.getShortestColumn()
    const column = this.columns[shortestColumn]
    
    const position: ItemPosition = {
      top: column.height,
      height: estimatedHeight,
      column: shortestColumn,
      index: column.itemCount
    }

    // Update column height
    column.height += estimatedHeight + this.config.gap
    column.itemCount++

    this.itemPositions.set(itemKey, position)
    return position
  }

  public updateItemHeight(itemKey: string, newHeight: number): void {
    const position = this.itemPositions.get(itemKey)
    if (!position) return

    const column = this.columns[position.column]
    const heightDifference = newHeight - position.height

    // Update item height
    position.height = newHeight

    // Recalculate column height
    this.recalculateColumnHeight(position.column)

    // Update positions of items below this one
    this.updateItemPositionsBelow(position.column, position.index, heightDifference)
  }

  public getItemPosition(itemKey: string): ItemPosition | undefined {
    return this.itemPositions.get(itemKey)
  }

  public getColumnInfo(columnIndex: number): ColumnInfo | undefined {
    return this.columns[columnIndex]
  }

  public getShortestColumn(): number {
    return this.columns.reduce(
      (shortest, column, index) => 
        column.height < this.columns[shortest].height ? index : shortest,
      0
    )
  }

  public getTallestColumn(): number {
    return this.columns.reduce(
      (tallest, column, index) => 
        column.height > this.columns[tallest].height ? index : tallest,
      0
    )
  }

  public getTotalHeight(): number {
    return Math.max(...this.columns.map(col => col.height))
  }

  public calculateResponsiveColumns(containerWidth: number): number {
    const { maxColumnWidth, gap } = this.config
    
    if (!maxColumnWidth) {
      return this.config.columns
    }

    const availableWidth = containerWidth
    const minColumns = 1
    const maxColumns = Math.floor(availableWidth / (maxColumnWidth + gap))
    
    return Math.max(minColumns, Math.min(maxColumns, this.config.columns))
  }

  private recalculateColumnHeight(columnIndex: number): void {
    const column = this.columns[columnIndex]
    const itemsInColumn = Array.from(this.itemPositions.values())
      .filter(pos => pos.column === columnIndex)
      .sort((a, b) => a.index - b.index)

    column.height = itemsInColumn.reduce((total, item) => total + item.height, 0) +
      (itemsInColumn.length - 1) * this.config.gap
  }

  private updateItemPositionsBelow(columnIndex: number, startIndex: number, heightDifference: number): void {
    const itemsToUpdate = Array.from(this.itemPositions.values())
      .filter(pos => pos.column === columnIndex && pos.index > startIndex)
      .sort((a, b) => a.index - b.index)

    itemsToUpdate.forEach(item => {
      item.top += heightDifference
    })
  }

  private recalculateAllPositions(): void {
    // Clear existing positions and recalculate
    this.itemPositions.clear()
    this.columns.forEach(col => {
      col.height = 0
      col.itemCount = 0
    })
  }

  public getVisibleItems(scrollTop: number, viewportHeight: number): string[] {
    const visibleItems: string[] = []
    const scrollBottom = scrollTop + viewportHeight

    this.itemPositions.forEach((position, itemKey) => {
      const itemTop = position.top
      const itemBottom = itemTop + position.height

      if (itemBottom >= scrollTop && itemTop <= scrollBottom) {
        visibleItems.push(itemKey)
      }
    })

    return visibleItems
  }

  public getItemsInRange(startIndex: number, endIndex: number): string[] {
    const items: string[] = []
    
    this.itemPositions.forEach((position, itemKey) => {
      if (position.index >= startIndex && position.index < endIndex) {
        items.push(itemKey)
      }
    })

    return items.sort((a, b) => {
      const posA = this.itemPositions.get(a)!
      const posB = this.itemPositions.get(b)!
      return posA.index - posB.index
    })
  }
}
```

### Step 2: Create Responsive Column Calculator
Create `utils/layoutUtils.ts`:

```typescript
export interface ResponsiveBreakpoint {
  minWidth: number
  columns: number
}

export class ResponsiveColumnCalculator {
  private breakpoints: ResponsiveBreakpoint[]
  private defaultColumns: number
  private maxColumnWidth: number
  private gap: number

  constructor(
    defaultColumns: number,
    maxColumnWidth: number,
    gap: number,
    breakpoints: ResponsiveBreakpoint[] = []
  ) {
    this.defaultColumns = defaultColumns
    this.maxColumnWidth = maxColumnWidth
    this.gap = gap
    this.breakpoints = breakpoints.sort((a, b) => a.minWidth - b.minWidth)
  }

  public calculateColumns(containerWidth: number): number {
    // Check breakpoints first
    for (let i = this.breakpoints.length - 1; i >= 0; i--) {
      const breakpoint = this.breakpoints[i]
      if (containerWidth >= breakpoint.minWidth) {
        return breakpoint.columns
      }
    }

    // Fall back to max column width calculation
    const availableWidth = containerWidth
    const minColumns = 1
    const maxColumns = Math.floor(availableWidth / (this.maxColumnWidth + this.gap))
    
    return Math.max(minColumns, Math.min(maxColumns, this.defaultColumns))
  }

  public addBreakpoint(breakpoint: ResponsiveBreakpoint): void {
    this.breakpoints.push(breakpoint)
    this.breakpoints.sort((a, b) => a.minWidth - b.minWidth)
  }

  public removeBreakpoint(minWidth: number): void {
    this.breakpoints = this.breakpoints.filter(bp => bp.minWidth !== minWidth)
  }

  public getBreakpoints(): ResponsiveBreakpoint[] {
    return [...this.breakpoints]
  }
}

export function createDefaultBreakpoints(): ResponsiveBreakpoint[] {
  return [
    { minWidth: 0, columns: 1 },      // Mobile
    { minWidth: 640, columns: 2 },    // Small tablet
    { minWidth: 1024, columns: 3 },   // Large tablet/desktop
    { minWidth: 1536, columns: 4 },   // Large desktop
  ]
}
```

### Step 3: Create Layout Hook
Create `hooks/useMasonryLayout.ts`:

```typescript
import { useCallback, useRef, useState, useEffect } from 'react'
import { MasonryLayoutEngine, MasonryLayoutConfig } from '../engine/MasonryLayoutEngine'
import { ResponsiveColumnCalculator, createDefaultBreakpoints } from '../utils/layoutUtils'

export function useMasonryLayout(
  initialConfig: Omit<MasonryLayoutConfig, 'containerWidth'>
) {
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentColumns, setCurrentColumns] = useState(initialConfig.columns)
  
  const layoutEngineRef = useRef<MasonryLayoutEngine>()
  const columnCalculatorRef = useRef<ResponsiveColumnCalculator>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize layout engine
  useEffect(() => {
    if (!layoutEngineRef.current) {
      const breakpoints = createDefaultBreakpoints()
      columnCalculatorRef.current = new ResponsiveColumnCalculator(
        initialConfig.columns,
        initialConfig.maxColumnWidth || 400,
        initialConfig.gap,
        breakpoints
      )

      layoutEngineRef.current = new MasonryLayoutEngine({
        ...initialConfig,
        containerWidth: 0
      })
    }
  }, [initialConfig])

  // Handle container resize
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const newWidth = containerRef.current.offsetWidth
      setContainerWidth(newWidth)

      if (columnCalculatorRef.current) {
        const newColumns = columnCalculatorRef.current.calculateColumns(newWidth)
        setCurrentColumns(newColumns)

        if (layoutEngineRef.current) {
          layoutEngineRef.current.updateConfig({
            columns: newColumns,
            containerWidth: newWidth
          })
        }
      }
    }
  }, [])

  // Set up resize observer
  useEffect(() => {
    if (containerRef.current) {
      handleResize() // Initial calculation
      
      const resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(containerRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [handleResize])

  // Layout engine methods
  const addItem = useCallback((itemKey: string, estimatedHeight: number) => {
    return layoutEngineRef.current?.addItem(itemKey, estimatedHeight)
  }, [])

  const updateItemHeight = useCallback((itemKey: string, newHeight: number) => {
    layoutEngineRef.current?.updateItemHeight(itemKey, newHeight)
  }, [])

  const getItemPosition = useCallback((itemKey: string) => {
    return layoutEngineRef.current?.getItemPosition(itemKey)
  }, [])

  const getVisibleItems = useCallback((scrollTop: number, viewportHeight: number) => {
    return layoutEngineRef.current?.getVisibleItems(scrollTop, viewportHeight) || []
  }, [])

  const getTotalHeight = useCallback(() => {
    return layoutEngineRef.current?.getTotalHeight() || 0
  }, [])

  return {
    containerRef,
    containerWidth,
    currentColumns,
    addItem,
    updateItemHeight,
    getItemPosition,
    getVisibleItems,
    getTotalHeight,
    layoutEngine: layoutEngineRef.current
  }
}
```

### Step 4: Create Column Manager
Create `engine/ColumnManager.ts`:

```typescript
import { ItemPosition } from '../types/virtualization'

export interface Column {
  index: number
  height: number
  items: string[]
  width: number
}

export class ColumnManager {
  private columns: Column[]
  private gap: number

  constructor(columnCount: number, gap: number) {
    this.gap = gap
    this.columns = Array.from({ length: columnCount }, (_, index) => ({
      index,
      height: 0,
      items: [],
      width: 0
    }))
  }

  public addItem(itemKey: string, height: number): number {
    const shortestColumn = this.getShortestColumn()
    const column = this.columns[shortestColumn]
    
    column.items.push(itemKey)
    column.height += height + this.gap
    
    return shortestColumn
  }

  public removeItem(itemKey: string): void {
    this.columns.forEach(column => {
      const itemIndex = column.items.indexOf(itemKey)
      if (itemIndex !== -1) {
        column.items.splice(itemIndex, 1)
        this.recalculateColumnHeight(column.index)
      }
    })
  }

  public updateItemHeight(itemKey: string, newHeight: number): void {
    this.columns.forEach(column => {
      const itemIndex = column.items.indexOf(itemKey)
      if (itemIndex !== -1) {
        // Recalculate column height
        this.recalculateColumnHeight(column.index)
      }
    })
  }

  public getShortestColumn(): number {
    return this.columns.reduce(
      (shortest, column, index) => 
        column.height < this.columns[shortest].height ? index : shortest,
      0
    )
  }

  public getColumnHeight(columnIndex: number): number {
    return this.columns[columnIndex]?.height || 0
  }

  public getTotalHeight(): number {
    return Math.max(...this.columns.map(col => col.height))
  }

  public getItemsInColumn(columnIndex: number): string[] {
    return this.columns[columnIndex]?.items || []
  }

  public setColumnWidth(columnIndex: number, width: number): void {
    if (this.columns[columnIndex]) {
      this.columns[columnIndex].width = width
    }
  }

  public resizeColumns(newColumnCount: number): void {
    if (newColumnCount === this.columns.length) return

    if (newColumnCount > this.columns.length) {
      // Add columns
      for (let i = this.columns.length; i < newColumnCount; i++) {
        this.columns.push({
          index: i,
          height: 0,
          items: [],
          width: 0
        })
      }
    } else {
      // Remove columns and redistribute items
      const itemsToRedistribute = this.columns
        .slice(newColumnCount)
        .flatMap(col => col.items)
      
      this.columns = this.columns.slice(0, newColumnCount)
      
      // Redistribute items to remaining columns
      itemsToRedistribute.forEach(itemKey => {
        const shortestColumn = this.getShortestColumn()
        this.columns[shortestColumn].items.push(itemKey)
      })
      
      // Recalculate all column heights
      this.columns.forEach((_, index) => {
        this.recalculateColumnHeight(index)
      })
    }
  }

  private recalculateColumnHeight(columnIndex: number): void {
    const column = this.columns[columnIndex]
    if (!column) return

    // This would need actual item heights from the layout engine
    // For now, we'll use a placeholder
    column.height = column.items.length * 200 + (column.items.length - 1) * this.gap
  }
}
```

## ✅ Acceptance Criteria

- [ ] MasonryLayoutEngine class implemented
- [ ] Multi-column item distribution working
- [ ] Responsive column calculation functional
- [ ] Gap and spacing management correct
- [ ] Layout hook properly integrated
- [ ] Column manager operational
- [ ] Resize handling working

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('MasonryLayoutEngine', () => {
  it('should distribute items across columns', () => {
    const engine = new MasonryLayoutEngine({
      columns: 3,
      gap: 12,
      containerWidth: 900
    })

    engine.addItem('item1', 200)
    engine.addItem('item2', 150)
    engine.addItem('item3', 300)

    expect(engine.getShortestColumn()).toBe(1) // Column with item2
  })

  it('should calculate responsive columns correctly', () => {
    const engine = new MasonryLayoutEngine({
      columns: 3,
      gap: 12,
      containerWidth: 600,
      maxColumnWidth: 200
    })

    const responsiveColumns = engine.calculateResponsiveColumns(600)
    expect(responsiveColumns).toBe(2) // 600 / (200 + 12) = 2.83 -> 2
  })
})
```

### Integration Tests
- [ ] Layout engine with virtualization
- [ ] Responsive column changes
- [ ] Height updates and reflow
- [ ] Column redistribution

## 🚨 Potential Issues

### Common Problems
1. **Layout thrashing**: Frequent recalculations
2. **Column imbalance**: Uneven item distribution
3. **Resize performance**: Slow column recalculation
4. **Memory usage**: Large position cache

### Solutions
1. Debounce layout calculations
2. Implement better distribution algorithm
3. Optimize resize handling
4. Implement position cache cleanup

## 📚 Documentation

### API Reference
- MasonryLayoutEngine methods
- ResponsiveColumnCalculator options
- Layout hook usage

### Usage Examples
- Basic masonry layout setup
- Responsive column configuration
- Dynamic layout updates

## 🔄 Next Steps

After completion:
1. Move to Task 4: Multi-Column Virtualization
2. Integrate layout engine with virtualization
3. Implement virtual scrolling for masonry
4. Add performance optimizations

## 📊 Success Metrics

- [ ] Layout engine functional
- [ ] Responsive columns working
- [ ] Item distribution balanced
- [ ] Resize handling smooth
- [ ] Performance benchmarks met
- [ ] All tests passing
