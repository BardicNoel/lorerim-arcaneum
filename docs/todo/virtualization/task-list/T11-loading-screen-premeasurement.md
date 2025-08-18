# Task 11: Loading Screen + Pre-measurement System

## 📋 Overview
Implement a loading screen + pre-measurement system that measures the first 20 items offscreen before rendering them, eliminating layout jumps and overlaps caused by estimated heights.

## 🎯 Objectives
- Create loading screen component for measurement phase
- Implement offscreen pre-measurement for first 20 items
- Integrate with existing virtualization system
- Eliminate layout jumps on initial render
- Maintain performance for large datasets

## 🏗 Implementation Steps

### Step 1: Create Loading Screen Component
**File:** `src/features/search/components/composition/virtualization/components/VirtualizationLoadingScreen.tsx`

```tsx
import React from 'react'

interface VirtualizationLoadingScreenProps {
  message?: string
  showProgress?: boolean
  progress?: number
  totalItems?: number
}

export function VirtualizationLoadingScreen({
  message = "Measuring content layout...",
  showProgress = false,
  progress = 0,
  totalItems = 0
}: VirtualizationLoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">{message}</p>
        {showProgress && totalItems > 0 && (
          <div className="w-48 mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Measuring items...</span>
              <span>{progress}/{totalItems}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress / totalItems) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Step 2: Create Pre-measurement Hook
**File:** `src/features/search/components/composition/virtualization/hooks/usePreMeasurement.ts`

```tsx
import { useEffect, useState, useCallback, useRef } from 'react'

interface PreMeasurementConfig {
  maxItemsToMeasure: number
  columnWidth: number
  renderItem: (item: any) => React.ReactNode
  keyExtractor: (item: any) => string
}

interface PreMeasurementResult {
  isMeasuring: boolean
  measuredHeights: Map<string, number>
  progress: number
  error: string | null
}

export function usePreMeasurement<T>(
  items: T[],
  config: PreMeasurementConfig
): PreMeasurementResult {
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [measuredHeights, setMeasuredHeights] = useState<Map<string, number>>(new Map())
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const measurementRef = useRef<{
    container: HTMLDivElement | null
    observers: Map<string, ResizeObserver>
    timeout: NodeJS.Timeout | null
  }>({
    container: null,
    observers: new Map(),
    timeout: null
  })

  const measureItems = useCallback(async () => {
    if (items.length === 0) return
    
    setIsMeasuring(true)
    setProgress(0)
    setError(null)
    
    const itemsToMeasure = items.slice(0, config.maxItemsToMeasure)
    
    try {
      // Create offscreen measuring container
      const container = document.createElement('div')
      container.style.cssText = `
        position: fixed;
        top: -10000px;
        left: 0;
        visibility: hidden;
        width: ${config.columnWidth}px;
        pointer-events: none;
        contain: layout style;
      `
      document.body.appendChild(container)
      measurementRef.current.container = container
      
      // Measure items with ResizeObserver
      const measurementPromises = itemsToMeasure.map((item, index) => {
        return new Promise<{key: string, height: number}>((resolve, reject) => {
          const itemEl = document.createElement('div')
          itemEl.style.width = '100%'
          itemEl.dataset.itemKey = config.keyExtractor(item)
          
          // Render item content
          const itemContent = config.renderItem(item)
          if (React.isValidElement(itemContent)) {
            // For React elements, we need to render them
            const root = ReactDOM.createRoot(itemEl)
            root.render(itemContent)
          } else {
            itemEl.innerHTML = String(itemContent)
          }
          
          container.appendChild(itemEl)
          
          // Set up ResizeObserver
          const observer = new ResizeObserver((entries) => {
            const height = Math.ceil(entries[0].contentRect.height)
            resolve({ key: config.keyExtractor(item), height })
            observer.disconnect()
            measurementRef.current.observers.delete(config.keyExtractor(item))
          })
          
          observer.observe(itemEl)
          measurementRef.current.observers.set(config.keyExtractor(item), observer)
          
          // Fallback timeout
          const timeout = setTimeout(() => {
            const height = itemEl.offsetHeight || 200
            resolve({ key: config.keyExtractor(item), height })
            observer.disconnect()
            measurementRef.current.observers.delete(config.keyExtractor(item))
          }, 2000)
          
          measurementRef.current.timeout = timeout
          
          // Update progress
          setProgress(index + 1)
        })
      })
      
      // Wait for all measurements
      const results = await Promise.all(measurementPromises)
      const heightMap = new Map(results.map(r => [r.key, r.height]))
      
      setMeasuredHeights(heightMap)
      setIsMeasuring(false)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Measurement failed')
      setIsMeasuring(false)
    } finally {
      // Cleanup
      if (measurementRef.current.container) {
        document.body.removeChild(measurementRef.current.container)
        measurementRef.current.container = null
      }
      
      // Disconnect observers
      measurementRef.current.observers.forEach(observer => observer.disconnect())
      measurementRef.current.observers.clear()
      
      // Clear timeout
      if (measurementRef.current.timeout) {
        clearTimeout(measurementRef.current.timeout)
        measurementRef.current.timeout = null
      }
    }
  }, [items, config])

  // Start measurement when items change
  useEffect(() => {
    if (items.length > 0 && !isMeasuring) {
      measureItems()
    }
  }, [items, measureItems])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (measurementRef.current.container) {
        document.body.removeChild(measurementRef.current.container)
      }
      measurementRef.current.observers.forEach(observer => observer.disconnect())
      if (measurementRef.current.timeout) {
        clearTimeout(measurementRef.current.timeout)
      }
    }
  }, [])

  return {
    isMeasuring,
    measuredHeights,
    progress,
    error
  }
}
```

### Step 3: Extend Virtualization Types
**File:** `src/features/search/components/composition/virtualization/types/virtualization.ts`

```tsx
// Add to existing types
export interface PreMeasurementConfig {
  enabled: boolean
  maxItemsToMeasure: number
  showLoadingScreen: boolean
  showProgress: boolean
}

export interface VirtualizationState {
  // ... existing properties
  isPreMeasuring: boolean
  preMeasuredHeights: Map<string, number>
  preMeasurementProgress: number
  preMeasurementError: string | null
}

export interface MasonryVirtualizerConfig {
  // ... existing properties
  preMeasurement?: PreMeasurementConfig
}
```

### Step 4: Update MasonryVirtualizer
**File:** `src/features/search/components/composition/virtualization/engine/MasonryVirtualizer.ts`

```tsx
// Add to existing class
export class MasonryVirtualizer {
  private preMeasuredHeights: Map<string, number> = new Map()
  private preMeasurementConfig: PreMeasurementConfig

  constructor(config: MasonryVirtualizerConfig, containerRef: RefObject<HTMLDivElement>, keyExtractor: (item: any) => string) {
    // ... existing initialization
    this.preMeasurementConfig = config.preMeasurement || {
      enabled: true,
      maxItemsToMeasure: 20,
      showLoadingScreen: true,
      showProgress: true
    }
  }

  public setPreMeasuredHeights(heights: Map<string, number>): void {
    this.preMeasuredHeights = heights
    this.recalculatePositions()
  }

  public getItemHeight(itemKey: string): number {
    // Use pre-measured height if available
    if (this.preMeasuredHeights.has(itemKey)) {
      return this.preMeasuredHeights.get(itemKey)!
    }
    
    // Fall back to estimation for items beyond pre-measured set
    return this.estimateItemHeight(itemKey)
  }

  private recalculatePositions(): void {
    // Recalculate all item positions with new heights
    this.itemPositions.clear()
    this.columnHeights.fill(0)
    
    this.items.forEach((item, index) => {
      const itemKey = this.keyExtractor(item)
      const height = this.getItemHeight(itemKey)
      const columnIndex = this.selectShortestColumn()
      
      const position: ItemPosition = {
        top: this.columnHeights[columnIndex],
        left: columnIndex * (this.config.columnWidth + this.config.gap),
        width: this.config.columnWidth,
        height,
        column: columnIndex
      }
      
      this.itemPositions.set(itemKey, position)
      this.columnHeights[columnIndex] += height + this.config.gap
    })
    
    this.notifyStateChange()
  }
}
```

### Step 5: Update Virtualization Hook
**File:** `src/features/search/components/composition/virtualization/hooks/useMasonryVirtualizer.ts`

```tsx
// Add pre-measurement integration
export function useMasonryVirtualizer<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config: Partial<MasonryVirtualizerConfig> = {}
) {
  // ... existing state

  // Pre-measurement hook
  const preMeasurementConfig = config.preMeasurement || {
    enabled: true,
    maxItemsToMeasure: 20,
    showLoadingScreen: true,
    showProgress: true
  }

  const { isMeasuring, measuredHeights, progress, error } = usePreMeasurement(
    items,
    {
      maxItemsToMeasure: preMeasurementConfig.maxItemsToMeasure,
      columnWidth: containerWidth || 300, // fallback
      renderItem: (item) => {
        // This will be provided by the component using this hook
        return null
      },
      keyExtractor
    }
  )

  // Update virtualizer with measured heights
  useEffect(() => {
    if (virtualizerRef.current && measuredHeights.size > 0) {
      virtualizerRef.current.setPreMeasuredHeights(measuredHeights)
    }
  }, [measuredHeights])

  // Update state with pre-measurement info
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isPreMeasuring: isMeasuring,
      preMeasuredHeights: measuredHeights,
      preMeasurementProgress: progress,
      preMeasurementError: error
    }))
  }, [isMeasuring, measuredHeights, progress, error])

  return {
    // ... existing returns
    isPreMeasuring: isMeasuring,
    preMeasurementProgress: progress,
    preMeasurementError: error
  }
}
```

### Step 6: Update VirtualMasonryGrid Component
**File:** `src/features/search/components/composition/virtualization/components/VirtualMasonryGrid.tsx`

```tsx
// Add loading screen integration
export function VirtualMasonryGrid<T>({
  items,
  keyExtractor,
  renderItem,
  // ... existing props
  preMeasurement = {
    enabled: true,
    maxItemsToMeasure: 20,
    showLoadingScreen: true,
    showProgress: true
  }
}: VirtualMasonryGridProps<T>) {
  
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
    preMeasurementError
  } = useMasonryVirtualizer(items, keyExtractor, {
    ...config,
    preMeasurement
  })

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
          <p className="text-muted-foreground text-sm">{preMeasurementError}</p>
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

  // ... rest of existing render logic
}
```

### Step 7: Create Demo Page
**File:** `src/features/search/pages/PreMeasurementDemoPage.tsx`

```tsx
import React, { useState } from 'react'
import { VirtualMasonryGrid } from '../components/composition/virtualization/components/VirtualMasonryGrid'
import { VirtualizationLoadingScreen } from '../components/composition/virtualization/components/VirtualizationLoadingScreen'

export function PreMeasurementDemoPage() {
  const [items, setItems] = useState(() => generateDummyItems(100))
  const [showMetrics, setShowMetrics] = useState(false)

  const keyExtractor = (item: any) => item.id
  const renderItem = (item: any) => (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{item.title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
      <div className="space-y-2">
        {item.tags.map((tag: string, index: number) => (
          <span key={index} className="inline-block bg-muted px-2 py-1 rounded text-xs mr-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )

  const loadMore = () => {
    const newItems = generateDummyItems(20)
    setItems(prev => [...prev, ...newItems])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pre-measurement Demo</h1>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-semibold mb-2">Pre-measurement Active</h3>
        <p className="text-sm text-muted-foreground">
          The first 20 items are measured offscreen before rendering. This eliminates layout jumps and provides stable positioning.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showMetrics}
            onChange={(e) => setShowMetrics(e.target.checked)}
          />
          Show Performance Metrics
        </label>
      </div>

      <VirtualMasonryGrid
        items={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        loadMore={loadMore}
        hasMore={true}
        columns={3}
        gap={16}
        maxColumnWidth={400}
        className="min-h-screen"
        showPerformanceMetrics={showMetrics}
        overscan={5}
        estimatedItemHeight={200}
        preMeasurement={{
          enabled: true,
          maxItemsToMeasure: 20,
          showLoadingScreen: true,
          showProgress: true
        }}
      />
    </div>
  )
}

function generateDummyItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}. It has variable length content that will affect the height of each item.`,
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
  }))
}
```

### Step 8: Update Router
**File:** `src/features/search/pages/index.ts`

```tsx
// Add new demo page export
export { PreMeasurementDemoPage } from './PreMeasurementDemoPage'
```

## 🧪 Testing Strategy

### Unit Tests
- Test `usePreMeasurement` hook with mock items
- Test `VirtualizationLoadingScreen` component rendering
- Test `MasonryVirtualizer` with pre-measured heights
- Test error handling and cleanup

### Integration Tests
- Test complete flow from loading to rendering
- Test with different item types and heights
- Test performance with large datasets
- Test error recovery scenarios

### Performance Tests
- Measure initial render time improvement
- Measure memory usage during pre-measurement
- Measure scroll performance with pre-measured items
- Compare with and without pre-measurement

## 📊 Success Criteria

- [ ] Loading screen displays during pre-measurement
- [ ] First 20 items render with exact heights (no layout jumps)
- [ ] Items beyond 20 use estimation but don't cause jumps
- [ ] Performance metrics show improvement
- [ ] Error handling works correctly
- [ ] Memory usage remains reasonable
- [ ] Scroll performance is smooth

## 🔄 Migration Plan

1. **Phase 1**: Implement core pre-measurement system
2. **Phase 2**: Add loading screen and progress indicators
3. **Phase 3**: Integrate with existing virtualization components
4. **Phase 4**: Add error handling and fallbacks
5. **Phase 5**: Performance optimization and testing
6. **Phase 6**: Documentation and demo pages

## 📝 Notes

- Pre-measurement only affects the first 20 items to balance performance and accuracy
- Items beyond 20 still use estimation but with better fallbacks
- The loading screen provides clear feedback during measurement
- Error handling ensures graceful degradation
- Memory usage is controlled by limiting the measuring pool size

## 🐛 Bug Fixes Applied

### Infinite Re-render Issue (Fixed)
- **Problem**: Config objects and functions were being recreated on every render, causing infinite re-measurements
- **Solution**: Added proper memoization with `useMemo` and `useCallback`
- **Files**: `usePreMeasurement.ts`, `useMasonryVirtualizer.ts`, demo pages

### Item Stacking During Pre-measurement (Fixed)
- **Problem**: Items were rendering on top of each other during pre-measurement
- **Solution**: Modified `getVisibleItems()` to return empty array during pre-measurement
- **Files**: `useMasonryVirtualizer.ts`, `VirtualMasonryGrid.tsx`

### Smooth Transition (Added)
- **Enhancement**: Added fade-in effect when items appear after pre-measurement
- **Files**: `VirtualMasonryGrid.tsx`
