# Task 4: Multi-Column Virtualization

## 📋 Overview
Integrate the masonry layout engine with the virtualization system to create a truly virtualized multi-column grid that only renders visible items across all columns.

## 🎯 Objectives
- Integrate layout engine with virtualization
- Implement virtual scrolling for masonry layout
- Handle multi-column visible range calculation
- Create virtual scroll container

## 🏗 Implementation Steps

### Step 1: Create Multi-Column Virtualizer
Create `engine/MultiColumnVirtualizer.ts`:

```typescript
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import { MasonryLayoutEngine } from './MasonryLayoutEngine'
import { ItemPosition, VirtualizationState, MasonryVirtualizerConfig } from '../types/virtualization'

export class MultiColumnVirtualizer<T> {
  private layoutEngine: MasonryLayoutEngine
  private config: MasonryVirtualizerConfig
  private itemPositions: Map<string, ItemPosition>
  private virtualizer: Virtualizer<HTMLDivElement, Element> | null

  constructor(config: MasonryVirtualizerConfig) {
    this.config = config
    this.layoutEngine = new MasonryLayoutEngine({
      columns: config.columns,
      gap: config.gap,
      containerWidth: 0
    })
    this.itemPositions = new Map()
    this.virtualizer = null
  }

  public createVirtualizer(
    items: T[],
    keyExtractor: (item: T) => string,
    scrollElement: HTMLDivElement | null
  ): Virtualizer<HTMLDivElement, Element> {
    // Initialize layout with all items
    this.initializeLayout(items, keyExtractor)

    this.virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => scrollElement,
      estimateSize: () => this.config.estimatedItemHeight,
      overscan: this.config.overscan,
      measureElement: (element) => {
        const height = element.offsetHeight
        const itemKey = keyExtractor(items[element.dataset.index!])
        this.updateItemHeight(itemKey, height)
        return height
      },
      getItemKey: (index) => keyExtractor(items[index]),
    })

    return this.virtualizer
  }

  private initializeLayout(items: T[], keyExtractor: (item: T) => string): void {
    // Clear existing layout
    this.itemPositions.clear()

    // Add all items to layout engine
    items.forEach((item, index) => {
      const itemKey = keyExtractor(item)
      const position = this.layoutEngine.addItem(itemKey, this.config.estimatedItemHeight)
      this.itemPositions.set(itemKey, position)
    })
  }

  public updateItemHeight(itemKey: string, height: number): void {
    this.layoutEngine.updateItemHeight(itemKey, height)
    
    // Update our position cache
    const position = this.itemPositions.get(itemKey)
    if (position) {
      position.height = height
    }
  }

  public getVisibleItems(scrollTop: number, viewportHeight: number): string[] {
    return this.layoutEngine.getVisibleItems(scrollTop, viewportHeight)
  }

  public getItemPosition(itemKey: string): ItemPosition | undefined {
    return this.itemPositions.get(itemKey)
  }

  public getTotalHeight(): number {
    return this.layoutEngine.getTotalHeight()
  }

  public updateConfig(newConfig: Partial<MasonryVirtualizerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.layoutEngine.updateConfig({
      columns: this.config.columns,
      gap: this.config.gap,
      containerWidth: this.config.containerWidth || 0
    })
  }

  public getColumnInfo(columnIndex: number) {
    return this.layoutEngine.getColumnInfo(columnIndex)
  }

  public getShortestColumn(): number {
    return this.layoutEngine.getShortestColumn()
  }
}
```

### Step 2: Create Virtual Scroll Container
Create `components/VirtualScrollContainer.tsx`:

```typescript
import React, { useRef, useEffect, useCallback } from 'react'
import { Virtualizer } from '@tanstack/react-virtual'

interface VirtualScrollContainerProps {
  virtualizer: Virtualizer<HTMLDivElement, Element>
  children: React.ReactNode
  className?: string
  onScroll?: (scrollTop: number) => void
  style?: React.CSSProperties
}

export function VirtualScrollContainer({
  virtualizer,
  children,
  className = '',
  onScroll,
  style
}: VirtualScrollContainerProps) {
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (scrollElementRef.current && onScroll) {
      onScroll(scrollElementRef.current.scrollTop)
    }
  }, [onScroll])

  // Set up scroll listener
  useEffect(() => {
    const scrollElement = scrollElementRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      ref={scrollElementRef}
      className={`virtual-scroll-container ${className}`}
      style={{
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        ...style
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
}
```

### Step 3: Create Multi-Column Virtualization Hook
Create `hooks/useMultiColumnVirtualization.ts`:

```typescript
import { useCallback, useRef, useState, useEffect } from 'react'
import { MultiColumnVirtualizer } from '../engine/MultiColumnVirtualizer'
import { VirtualizationState, MasonryVirtualizerConfig } from '../types/virtualization'

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

  const scrollElementRef = useRef<HTMLDivElement>(null)
  const virtualizerRef = useRef<MultiColumnVirtualizer<T>>()
  const virtualizerInstanceRef = useRef<any>(null)

  // Initialize virtualizer
  if (!virtualizerRef.current) {
    virtualizerRef.current = new MultiColumnVirtualizer<T>(config)
  }

  // Create virtualizer instance
  if (!virtualizerInstanceRef.current) {
    virtualizerInstanceRef.current = virtualizerRef.current.createVirtualizer(
      items,
      keyExtractor,
      scrollElementRef.current
    )
  }

  // Update virtualization state
  const updateVirtualizationState = useCallback(() => {
    if (scrollElementRef.current && virtualizerRef.current) {
      const scrollTop = scrollElementRef.current.scrollTop
      const containerHeight = scrollElementRef.current.clientHeight
      const visibleItems = virtualizerRef.current.getVisibleItems(scrollTop, containerHeight)

      // Calculate visible range based on visible items
      const visibleIndices = visibleItems.map(itemKey => {
        const position = virtualizerRef.current!.getItemPosition(itemKey)
        return position?.index || 0
      }).sort((a, b) => a - b)

      const visibleRange = {
        start: visibleIndices.length > 0 ? Math.max(0, visibleIndices[0] - config.overscan) : 0,
        end: visibleIndices.length > 0 ? Math.min(items.length, visibleIndices[visibleIndices.length - 1] + config.overscan) : 0
      }

      setVirtualizationState({
        visibleRange,
        scrollTop,
        containerHeight,
        itemPositions: virtualizerRef.current.itemPositions
      })
    }
  }, [items.length, config.overscan])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    updateVirtualizationState()
  }, [updateVirtualizationState])

  // Update when items change
  useEffect(() => {
    if (virtualizerRef.current) {
      virtualizerRef.current.initializeLayout(items, keyExtractor)
      updateVirtualizationState()
    }
  }, [items, keyExtractor, updateVirtualizationState])

  // Update when config changes
  useEffect(() => {
    if (virtualizerRef.current) {
      virtualizerRef.current.updateConfig(config)
      updateVirtualizationState()
    }
  }, [config, updateVirtualizationState])

  return {
    virtualizer: virtualizerInstanceRef.current,
    scrollElementRef,
    virtualizationState,
    handleScroll,
    updateVirtualizationState,
    getItemPosition: (itemKey: string) => virtualizerRef.current?.getItemPosition(itemKey),
    getTotalHeight: () => virtualizerRef.current?.getTotalHeight() || 0,
    getVisibleItems: (scrollTop: number, viewportHeight: number) => 
      virtualizerRef.current?.getVisibleItems(scrollTop, viewportHeight) || []
  }
}
```

### Step 4: Create Virtualized Masonry Grid Component
Create `components/VirtualizedMasonryGrid.tsx`:

```typescript
import React, { useMemo } from 'react'
import { VirtualScrollContainer } from './VirtualScrollContainer'
import { useMultiColumnVirtualization } from '../hooks/useMultiColumnVirtualization'
import { MasonryVirtualizerConfig } from '../types/virtualization'

interface VirtualizedMasonryGridProps<T> {
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
}

export function VirtualizedMasonryGrid<T>({
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
  estimatedItemHeight = 200
}: VirtualizedMasonryGridProps<T>) {
  const config: MasonryVirtualizerConfig = useMemo(() => ({
    columns,
    gap,
    overscan,
    estimatedItemHeight,
    maxColumnWidth
  }), [columns, gap, overscan, estimatedItemHeight, maxColumnWidth])

  const {
    virtualizer,
    scrollElementRef,
    virtualizationState,
    handleScroll,
    getItemPosition,
    getTotalHeight
  } = useMultiColumnVirtualization(items, keyExtractor, config)

  // Render only visible items
  const visibleItems = useMemo(() => {
    const { start, end } = virtualizationState.visibleRange
    return items.slice(start, end).map((item, index) => {
      const actualIndex = start + index
      const itemKey = keyExtractor(item)
      const position = getItemPosition(itemKey)
      
      if (!position) return null

      return (
        <div
          key={itemKey}
          data-index={actualIndex}
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.column * (100 / columns)}%`,
            width: `calc(${100 / columns}% - ${gap / 2}px)`,
            transform: `translateX(${position.column * gap}px)`,
          }}
        >
          {renderItem(item)}
        </div>
      )
    }).filter(Boolean)
  }, [items, virtualizationState.visibleRange, getItemPosition, keyExtractor, renderItem, columns, gap])

  // Handle infinite scroll
  const handleInfiniteScroll = useMemo(() => {
    if (!loadMore || !hasMore) return undefined

    return () => {
      const { scrollTop, containerHeight } = virtualizationState
      const totalHeight = getTotalHeight()
      
      // Load more when scrolling near bottom
      if (scrollTop + containerHeight >= totalHeight - 100) {
        loadMore()
      }
    }
  }, [loadMore, hasMore, virtualizationState, getTotalHeight])

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <VirtualScrollContainer
        virtualizer={virtualizer}
        onScroll={handleScroll}
        style={{ height: '100%' }}
      >
        <div
          style={{
            height: `${getTotalHeight()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {visibleItems}
        </div>
      </VirtualScrollContainer>
    </div>
  )
}
```

### Step 5: Create Performance Optimizations
Create `utils/performanceUtils.ts`:

```typescript
import { debounce, throttle } from 'lodash'

export function createDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  return debounce(callback, delay) as T
}

export function createThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  return throttle(callback, delay) as T
}

export function createVirtualizationOptimizer() {
  let lastUpdateTime = 0
  const minUpdateInterval = 16 // ~60fps

  return {
    shouldUpdate: () => {
      const now = Date.now()
      if (now - lastUpdateTime >= minUpdateInterval) {
        lastUpdateTime = now
        return true
      }
      return false
    },
    
    forceUpdate: () => {
      lastUpdateTime = Date.now()
    }
  }
}

export function createMemoryManager() {
  const cache = new Map<string, any>()
  const maxCacheSize = 1000

  return {
    get: (key: string) => cache.get(key),
    
    set: (key: string, value: any) => {
      if (cache.size >= maxCacheSize) {
        // Remove oldest entries
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      cache.set(key, value)
    },
    
    clear: () => cache.clear(),
    
    size: () => cache.size
  }
}
```

## ✅ Acceptance Criteria

- [ ] Multi-Column Virtualizer implemented
- [ ] Virtual scroll container functional
- [ ] Multi-column virtualization hook working
- [ ] Virtualized masonry grid component created
- [ ] Performance optimizations in place
- [ ] Only visible items rendered
- [ ] Scroll performance smooth
- [ ] Memory usage optimized

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('MultiColumnVirtualizer', () => {
  it('should create virtualizer with layout engine', () => {
    const config = { columns: 3, gap: 12, overscan: 5, estimatedItemHeight: 200 }
    const virtualizer = new MultiColumnVirtualizer(config)
    expect(virtualizer).toBeDefined()
  })

  it('should calculate visible items correctly', () => {
    const config = { columns: 3, gap: 12, overscan: 5, estimatedItemHeight: 200 }
    const virtualizer = new MultiColumnVirtualizer(config)
    const items = ['item1', 'item2', 'item3']
    const visibleItems = virtualizer.getVisibleItems(0, 800)
    expect(visibleItems.length).toBeGreaterThan(0)
  })
})
```

### Integration Tests
- [ ] Virtualization with layout engine
- [ ] Scroll performance testing
- [ ] Memory usage monitoring
- [ ] Responsive behavior

## 🚨 Potential Issues

### Common Problems
1. **Layout thrashing**: Frequent position recalculations
2. **Memory leaks**: Unused DOM elements
3. **Scroll jank**: Poor scroll performance
4. **Column imbalance**: Uneven item distribution

### Solutions
1. Implement debounced layout updates
2. Add proper cleanup and memory management
3. Optimize scroll event handling
4. Improve item distribution algorithm

## 📚 Documentation

### API Reference
- MultiColumnVirtualizer methods
- VirtualizedMasonryGrid props
- Performance optimization utilities

### Usage Examples
- Basic virtualized masonry setup
- Performance optimization configuration
- Memory management

## 🔄 Next Steps

After completion:
1. Move to Task 5: Height Measurement System
2. Implement dynamic height measurement
3. Add resize detection
4. Optimize height calculations

## 📊 Success Metrics

- [ ] Multi-column virtualization working
- [ ] Scroll performance 60fps
- [ ] Memory usage constant
- [ ] Only visible items rendered
- [ ] Layout engine integrated
- [ ] Performance optimizations active
- [ ] All tests passing
