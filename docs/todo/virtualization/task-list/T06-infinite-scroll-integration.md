# Task 6: Infinite Scroll Integration

## 📋 Overview
Integrate infinite scroll functionality with the virtualized masonry grid, ensuring seamless loading of additional items without disrupting the virtualization performance.

## 🎯 Objectives
- Integrate infinite scroll with virtualization
- Implement loading states and indicators
- Handle scroll position preservation
- Optimize loading performance

## 🏗 Implementation Steps

### Step 1: Create Infinite Scroll Manager
Create `engine/InfiniteScrollManager.ts`:

```typescript
export interface InfiniteScrollConfig {
  threshold: number // Distance from bottom to trigger load
  debounceDelay: number
  maxRetries: number
  retryDelay: number
}

export interface LoadingState {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  retryCount: number
}

export class InfiniteScrollManager {
  private config: InfiniteScrollConfig
  private loadingState: LoadingState
  private loadMoreCallback: (() => void) | null
  private hasMoreItems: boolean
  private isTriggered: boolean

  constructor(config: Partial<InfiniteScrollConfig> = {}) {
    this.config = {
      threshold: 100, // pixels from bottom
      debounceDelay: 100,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    }
    
    this.loadingState = {
      isLoading: false,
      hasError: false,
      retryCount: 0
    }
    
    this.loadMoreCallback = null
    this.hasMoreItems = true
    this.isTriggered = false
  }

  public setLoadMoreCallback(callback: () => void): void {
    this.loadMoreCallback = callback
  }

  public setHasMoreItems(hasMore: boolean): void {
    this.hasMoreItems = hasMore
  }

  public checkShouldLoadMore(scrollTop: number, containerHeight: number, totalHeight: number): boolean {
    if (!this.hasMoreItems || this.loadingState.isLoading || this.isTriggered) {
      return false
    }

    const distanceFromBottom = totalHeight - (scrollTop + containerHeight)
    return distanceFromBottom <= this.config.threshold
  }

  public triggerLoadMore(): void {
    if (!this.loadMoreCallback || this.loadingState.isLoading) {
      return
    }

    this.isTriggered = true
    this.loadingState.isLoading = true
    this.loadingState.hasError = false

    try {
      this.loadMoreCallback()
    } catch (error) {
      this.handleLoadError(error)
    }
  }

  public onLoadComplete(): void {
    this.loadingState.isLoading = false
    this.isTriggered = false
    this.loadingState.retryCount = 0
  }

  public onLoadError(error: any): void {
    this.loadingState.isLoading = false
    this.loadingState.hasError = true
    this.loadingState.errorMessage = error?.message || 'Failed to load more items'
    this.isTriggered = false

    if (this.loadingState.retryCount < this.config.maxRetries) {
      this.loadingState.retryCount++
      setTimeout(() => {
        this.triggerLoadMore()
      }, this.config.retryDelay)
    }
  }

  public retry(): void {
    this.loadingState.hasError = false
    this.loadingState.errorMessage = undefined
    this.triggerLoadMore()
  }

  public getLoadingState(): LoadingState {
    return { ...this.loadingState }
  }

  public reset(): void {
    this.loadingState = {
      isLoading: false,
      hasError: false,
      retryCount: 0
    }
    this.isTriggered = false
  }

  private handleLoadError(error: any): void {
    this.onLoadError(error)
  }
}
```

### Step 2: Create Infinite Scroll Hook
Create `hooks/useInfiniteScroll.ts`:

```typescript
import { useCallback, useRef, useEffect, useState } from 'react'
import { InfiniteScrollManager, InfiniteScrollConfig } from '../engine/InfiniteScrollManager'

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  config: Partial<InfiniteScrollConfig> = {}
) {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    hasError: false,
    errorMessage: undefined,
    retryCount: 0
  })

  const managerRef = useRef<InfiniteScrollManager>()
  const scrollElementRef = useRef<HTMLDivElement>(null)

  // Initialize manager
  if (!managerRef.current) {
    managerRef.current = new InfiniteScrollManager(config)
  }

  // Set up load more callback
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setLoadMoreCallback(loadMore)
    }
  }, [loadMore])

  // Update has more items
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setHasMoreItems(hasMore)
    }
  }, [hasMore])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollElementRef.current || !managerRef.current) return

    const scrollTop = scrollElementRef.current.scrollTop
    const containerHeight = scrollElementRef.current.clientHeight
    const totalHeight = scrollElementRef.current.scrollHeight

    if (managerRef.current.checkShouldLoadMore(scrollTop, containerHeight, totalHeight)) {
      managerRef.current.triggerLoadMore()
    }
  }, [])

  // Set up scroll listener
  useEffect(() => {
    const scrollElement = scrollElementRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Update loading state
  useEffect(() => {
    const updateState = () => {
      if (managerRef.current) {
        setLoadingState(managerRef.current.getLoadingState())
      }
    }

    // Poll for state changes
    const interval = setInterval(updateState, 100)
    return () => clearInterval(interval)
  }, [])

  const retry = useCallback(() => {
    managerRef.current?.retry()
  }, [])

  const reset = useCallback(() => {
    managerRef.current?.reset()
  }, [])

  return {
    scrollElementRef,
    loadingState,
    retry,
    reset,
    triggerLoadMore: () => managerRef.current?.triggerLoadMore()
  }
}
```

### Step 3: Create Loading Components
Create `components/LoadingIndicator.tsx`:

```typescript
import React from 'react'

interface LoadingIndicatorProps {
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  onRetry?: () => void
  className?: string
}

export function LoadingIndicator({
  isLoading,
  hasError,
  errorMessage,
  onRetry,
  className = ''
}: LoadingIndicatorProps) {
  if (!isLoading && !hasError) {
    return null
  }

  return (
    <div className={`loading-indicator ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Loading more items...</span>
        </div>
      )}
      
      {hasError && (
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-sm text-destructive mb-2">
            {errorMessage || 'Failed to load more items'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

### Step 4: Create Virtualized Infinite Scroll Grid
Create `components/VirtualizedInfiniteScrollGrid.tsx`:

```typescript
import React, { useMemo } from 'react'
import { VirtualizedMasonryGrid } from './VirtualizedMasonryGrid'
import { LoadingIndicator } from './LoadingIndicator'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { InfiniteScrollConfig } from '../engine/InfiniteScrollManager'

interface VirtualizedInfiniteScrollGridProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  loadMore: () => void
  hasMore: boolean
  columns?: number
  gap?: number
  maxColumnWidth?: number
  className?: string
  overscan?: number
  estimatedItemHeight?: number
  infiniteScrollConfig?: Partial<InfiniteScrollConfig>
}

export function VirtualizedInfiniteScrollGrid<T>({
  items,
  keyExtractor,
  renderItem,
  loadMore,
  hasMore,
  columns = 3,
  gap = 12,
  maxColumnWidth,
  className = '',
  overscan = 5,
  estimatedItemHeight = 200,
  infiniteScrollConfig
}: VirtualizedInfiniteScrollGridProps<T>) {
  const {
    scrollElementRef,
    loadingState,
    retry
  } = useInfiniteScroll(loadMore, hasMore, infiniteScrollConfig)

  // Memoized load more function that preserves scroll position
  const handleLoadMore = useMemo(() => {
    return () => {
      // Store current scroll position
      const currentScrollTop = scrollElementRef.current?.scrollTop || 0
      
      // Call original load more
      loadMore()
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        if (scrollElementRef.current) {
          scrollElementRef.current.scrollTop = currentScrollTop
        }
      }, 100)
    }
  }, [loadMore, scrollElementRef])

  return (
    <div className={className}>
      <VirtualizedMasonryGrid
        items={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        columns={columns}
        gap={gap}
        maxColumnWidth={maxColumnWidth}
        overscan={overscan}
        estimatedItemHeight={estimatedItemHeight}
        className="virtualized-grid"
      />
      
      <LoadingIndicator
        isLoading={loadingState.isLoading}
        hasError={loadingState.hasError}
        errorMessage={loadingState.errorMessage}
        onRetry={retry}
        className="mt-4"
      />
    </div>
  )
}
```

### Step 5: Create Scroll Position Manager
Create `utils/scrollPositionManager.ts`:

```typescript
export interface ScrollPosition {
  scrollTop: number
  scrollLeft: number
  timestamp: number
}

export class ScrollPositionManager {
  private positions: Map<string, ScrollPosition>
  private maxPositions: number

  constructor(maxPositions: number = 10) {
    this.positions = new Map()
    this.maxPositions = maxPositions
  }

  public savePosition(key: string, scrollTop: number, scrollLeft: number = 0): void {
    const position: ScrollPosition = {
      scrollTop,
      scrollLeft,
      timestamp: Date.now()
    }

    this.positions.set(key, position)
    this.cleanup()
  }

  public getPosition(key: string): ScrollPosition | undefined {
    return this.positions.get(key)
  }

  public restorePosition(element: HTMLElement, key: string): boolean {
    const position = this.getPosition(key)
    if (!position) return false

    element.scrollTop = position.scrollTop
    element.scrollLeft = position.scrollLeft
    return true
  }

  public clearPosition(key: string): void {
    this.positions.delete(key)
  }

  public clearAll(): void {
    this.positions.clear()
  }

  private cleanup(): void {
    if (this.positions.size <= this.maxPositions) return

    // Remove oldest positions
    const entries = Array.from(this.positions.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toRemove = entries.slice(0, this.positions.size - this.maxPositions)
    toRemove.forEach(([key]) => this.positions.delete(key))
  }
}

export function createScrollPositionKey(itemsLength: number, searchTerm?: string): string {
  return `${itemsLength}-${searchTerm || 'default'}`
}
```

### Step 6: Update VirtualizedMasonryGrid with Infinite Scroll
Update `components/VirtualizedMasonryGrid.tsx`:

```typescript
// Add to existing VirtualizedMasonryGrid component
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { LoadingIndicator } from './LoadingIndicator'

export function VirtualizedMasonryGrid<T>({
  // ... existing props ...
  loadMore,
  hasMore = true,
  infiniteScrollConfig
}: VirtualizedMasonryGridProps<T>) {
  // ... existing code ...

  // Add infinite scroll
  const {
    scrollElementRef: infiniteScrollRef,
    loadingState,
    retry
  } = useInfiniteScroll(loadMore || (() => {}), hasMore, infiniteScrollConfig)

  // Combine scroll refs
  const combinedScrollRef = useMemo(() => {
    return infiniteScrollRef.current || scrollElementRef.current
  }, [infiniteScrollRef, scrollElementRef])

  return (
    <div className={className}>
      <VirtualScrollContainer
        virtualizer={virtualizer}
        onScroll={handleScroll}
        style={{ height: '100%' }}
        ref={combinedScrollRef}
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
      
      {loadMore && (
        <LoadingIndicator
          isLoading={loadingState.isLoading}
          hasError={loadingState.hasError}
          errorMessage={loadingState.errorMessage}
          onRetry={retry}
          className="mt-4"
        />
      )}
    </div>
  )
}
```

## ✅ Acceptance Criteria

- [ ] Infinite scroll manager implemented
- [ ] Loading states and indicators working
- [ ] Scroll position preservation functional
- [ ] Error handling and retry logic working
- [ ] Performance optimizations in place
- [ ] Seamless integration with virtualization

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('InfiniteScrollManager', () => {
  it('should trigger load more when near bottom', () => {
    const manager = new InfiniteScrollManager({ threshold: 100 })
    const mockCallback = jest.fn()
    manager.setLoadMoreCallback(mockCallback)
    manager.setHasMoreItems(true)

    const shouldLoad = manager.checkShouldLoadMore(900, 200, 1000)
    expect(shouldLoad).toBe(true)
  })

  it('should handle loading states correctly', () => {
    const manager = new InfiniteScrollManager()
    manager.triggerLoadMore()
    
    expect(manager.getLoadingState().isLoading).toBe(true)
    
    manager.onLoadComplete()
    expect(manager.getLoadingState().isLoading).toBe(false)
  })
})
```

### Integration Tests
- [ ] Infinite scroll with virtualization
- [ ] Loading state management
- [ ] Error handling and retry
- [ ] Scroll position preservation

## 🚨 Potential Issues

### Common Problems
1. **Scroll jumping**: Position not preserved during load
2. **Multiple triggers**: Load more called multiple times
3. **Performance impact**: Loading affects scroll performance
4. **Memory leaks**: Unused scroll positions

### Solutions
1. Implement scroll position preservation
2. Add debouncing and state management
3. Optimize loading performance
4. Clean up unused data

## 📚 Documentation

### API Reference
- InfiniteScrollManager methods
- Loading state management
- Scroll position utilities

### Usage Examples
- Basic infinite scroll setup
- Loading state configuration
- Error handling

## 🔄 Next Steps

After completion:
1. Move to Task 7: Responsive Column Management
2. Implement dynamic column calculation
3. Handle responsive breakpoints
4. Optimize layout transitions

## 📊 Success Metrics

- [ ] Infinite scroll working smoothly
- [ ] Loading states properly managed
- [ ] Scroll position preserved
- [ ] Error handling robust
- [ ] Performance maintained
- [ ] All tests passing
