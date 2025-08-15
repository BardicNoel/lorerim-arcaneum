# Task 2: Core Virtualization Engine

## 📋 Overview
Implement the core virtualization engine using @tanstack/react-virtual, creating the foundation for masonry layout virtualization.

## 🎯 Objectives
- Create MasonryVirtualizer class
- Implement basic virtualization logic
- Set up height measurement system
- Create virtualization hooks

## 🏗 Implementation Steps

### Step 1: Create MasonryVirtualizer Class
Create `engine/MasonryVirtualizer.ts`:

```typescript
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import { ItemPosition, VirtualizationState, MasonryVirtualizerConfig } from '../types/virtualization'

export class MasonryVirtualizer<T> {
  private virtualizer: Virtualizer<HTMLDivElement, Element>
  private itemPositions: Map<string, ItemPosition>
  private columnHeights: number[]
  private config: MasonryVirtualizerConfig

  constructor(config: MasonryVirtualizerConfig) {
    this.config = config
    this.itemPositions = new Map()
    this.columnHeights = new Array(config.columns).fill(0)
  }

  public createVirtualizer(
    items: T[],
    keyExtractor: (item: T) => string,
    scrollElement: HTMLDivElement | null
  ) {
    return useVirtualizer({
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
    })
  }

  public updateItemHeight(itemKey: string, height: number): void {
    const position = this.itemPositions.get(itemKey)
    if (position) {
      position.height = height
      this.recalculatePositions()
    }
  }

  public getItemPosition(itemKey: string): ItemPosition | undefined {
    return this.itemPositions.get(itemKey)
  }

  public getVisibleRange(scrollTop: number, viewportHeight: number): { start: number; end: number } {
    // Calculate which items are visible based on scroll position
    const start = Math.floor(scrollTop / this.config.estimatedItemHeight)
    const end = Math.ceil((scrollTop + viewportHeight) / this.config.estimatedItemHeight)
    
    return {
      start: Math.max(0, start - this.config.overscan),
      end: Math.min(this.itemPositions.size, end + this.config.overscan)
    }
  }

  private recalculatePositions(): void {
    // Recalculate all item positions after height changes
    // This is a simplified version - will be enhanced in Task 3
  }
}
```

### Step 2: Create Height Measurement System
Create `engine/HeightMeasurer.ts`:

```typescript
import { useCallback, useRef } from 'react'

export interface HeightMeasurement {
  height: number
  width: number
  timestamp: number
}

export class HeightMeasurer {
  private measurements: Map<string, HeightMeasurement>
  private resizeObserver: ResizeObserver | null

  constructor() {
    this.measurements = new Map()
    this.resizeObserver = null
  }

  public measureElement(element: HTMLElement, key: string): HeightMeasurement {
    const rect = element.getBoundingClientRect()
    const measurement: HeightMeasurement = {
      height: rect.height,
      width: rect.width,
      timestamp: Date.now()
    }
    
    this.measurements.set(key, measurement)
    return measurement
  }

  public getMeasurement(key: string): HeightMeasurement | undefined {
    return this.measurements.get(key)
  }

  public setupResizeObserver(
    element: HTMLElement,
    key: string,
    onResize: (measurement: HeightMeasurement) => void
  ): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const measurement = this.measureElement(entry.target as HTMLElement, key)
        onResize(measurement)
      })
    })

    this.resizeObserver.observe(element)
  }

  public cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }
}
```

### Step 3: Create Position Cache
Create `engine/PositionCache.ts`:

```typescript
import { ItemPosition } from '../types/virtualization'

export class PositionCache {
  private positions: Map<string, ItemPosition>
  private columnHeights: number[]

  constructor(columns: number) {
    this.positions = new Map()
    this.columnHeights = new Array(columns).fill(0)
  }

  public setPosition(key: string, position: ItemPosition): void {
    this.positions.set(key, position)
    this.updateColumnHeight(position.column, position.top + position.height)
  }

  public getPosition(key: string): ItemPosition | undefined {
    return this.positions.get(key)
  }

  public getColumnHeight(column: number): number {
    return this.columnHeights[column] || 0
  }

  public getShortestColumn(): number {
    return this.columnHeights.indexOf(Math.min(...this.columnHeights))
  }

  public clear(): void {
    this.positions.clear()
    this.columnHeights.fill(0)
  }

  private updateColumnHeight(column: number, height: number): void {
    this.columnHeights[column] = Math.max(this.columnHeights[column] || 0, height)
  }
}
```

### Step 4: Create Virtualization Hooks
Create `hooks/useMasonryVirtualizer.ts`:

```typescript
import { useCallback, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { MasonryVirtualizer } from '../engine/MasonryVirtualizer'
import { VirtualizationState, MasonryVirtualizerConfig } from '../types/virtualization'

export function useMasonryVirtualizer<T>(
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
  const virtualizerRef = useRef<MasonryVirtualizer<T>>()

  // Initialize virtualizer
  if (!virtualizerRef.current) {
    virtualizerRef.current = new MasonryVirtualizer<T>(config)
  }

  // Create virtualizer instance
  const virtualizer = virtualizerRef.current.createVirtualizer(
    items,
    keyExtractor,
    scrollElementRef.current
  )

  // Update virtualization state
  const updateVirtualizationState = useCallback(() => {
    if (scrollElementRef.current) {
      const scrollTop = scrollElementRef.current.scrollTop
      const containerHeight = scrollElementRef.current.clientHeight
      const visibleRange = virtualizerRef.current!.getVisibleRange(scrollTop, containerHeight)

      setVirtualizationState({
        visibleRange,
        scrollTop,
        containerHeight,
        itemPositions: virtualizerRef.current!.itemPositions
      })
    }
  }, [])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    updateVirtualizationState()
  }, [updateVirtualizationState])

  return {
    virtualizer,
    scrollElementRef,
    virtualizationState,
    handleScroll,
    updateVirtualizationState
  }
}
```

### Step 5: Create Height Measurement Hook
Create `hooks/useHeightMeasurement.ts`:

```typescript
import { useCallback, useRef, useEffect } from 'react'
import { HeightMeasurer } from '../engine/HeightMeasurer'

export function useHeightMeasurement() {
  const measurerRef = useRef<HeightMeasurer>()

  if (!measurerRef.current) {
    measurerRef.current = new HeightMeasurer()
  }

  const measureElement = useCallback((
    element: HTMLElement,
    key: string,
    onHeightChange?: (height: number) => void
  ) => {
    const measurement = measurerRef.current!.measureElement(element, key)
    
    if (onHeightChange) {
      measurerRef.current!.setupResizeObserver(element, key, (newMeasurement) => {
        onHeightChange(newMeasurement.height)
      })
    }

    return measurement
  }, [])

  useEffect(() => {
    return () => {
      measurerRef.current?.cleanup()
    }
  }, [])

  return {
    measureElement,
    getMeasurement: (key: string) => measurerRef.current?.getMeasurement(key)
  }
}
```

## ✅ Acceptance Criteria

- [ ] MasonryVirtualizer class implemented
- [ ] Height measurement system working
- [ ] Position cache functional
- [ ] Virtualization hooks created
- [ ] Basic virtualization logic working
- [ ] Height changes detected and handled
- [ ] Scroll events properly managed

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('MasonryVirtualizer', () => {
  it('should create virtualizer instance', () => {
    const config = { columns: 3, gap: 12, overscan: 5, estimatedItemHeight: 200 }
    const virtualizer = new MasonryVirtualizer(config)
    expect(virtualizer).toBeDefined()
  })

  it('should calculate visible range correctly', () => {
    const config = { columns: 3, gap: 12, overscan: 5, estimatedItemHeight: 200 }
    const virtualizer = new MasonryVirtualizer(config)
    const range = virtualizer.getVisibleRange(1000, 800)
    expect(range.start).toBeGreaterThanOrEqual(0)
    expect(range.end).toBeGreaterThan(range.start)
  })
})
```

### Integration Tests
- [ ] Virtualizer integration with @tanstack/react-virtual
- [ ] Height measurement with ResizeObserver
- [ ] Position cache updates
- [ ] Hook integration

## 🚨 Potential Issues

### Common Problems
1. **Memory leaks**: Ensure ResizeObserver cleanup
2. **Performance**: Optimize position calculations
3. **Type safety**: Ensure proper TypeScript types
4. **State management**: Handle virtualization state updates

### Solutions
1. Implement proper cleanup in useEffect
2. Debounce position calculations
3. Add comprehensive type definitions
4. Use useCallback for performance optimization

## 📚 Documentation

### API Reference
- MasonryVirtualizer class methods
- Hook signatures and return values
- Configuration options

### Usage Examples
- Basic virtualization setup
- Height measurement integration
- Position tracking

## 🔄 Next Steps

After completion:
1. Move to Task 3: Masonry Layout Engine
2. Implement multi-column distribution
3. Add responsive column calculation
4. Enhance position tracking

## 📊 Success Metrics

- [ ] Virtualization engine functional
- [ ] Height measurement accurate
- [ ] Position tracking working
- [ ] Hooks properly integrated
- [ ] Performance benchmarks met
- [ ] All tests passing
