# Task 7: Responsive Column Management

## 📋 Overview
Implement responsive column management that dynamically adjusts the number of columns based on container width, breakpoints, and user preferences while maintaining smooth transitions and optimal performance.

## 🎯 Objectives
- Implement responsive column calculation
- Handle smooth column transitions
- Add breakpoint management
- Optimize layout recalculation

## 🏗 Implementation Steps

### Step 1: Enhanced Responsive Column Calculator
Create `engine/ResponsiveColumnManager.ts`:

```typescript
export interface ResponsiveBreakpoint {
  minWidth: number
  columns: number
  maxColumnWidth?: number
  gap?: number
}

export interface ResponsiveConfig {
  defaultColumns: number
  maxColumnWidth: number
  gap: number
  breakpoints: ResponsiveBreakpoint[]
  enableSmoothTransitions: boolean
  transitionDuration: number
}

export interface ColumnChangeEvent {
  from: number
  to: number
  containerWidth: number
  timestamp: number
}

export class ResponsiveColumnManager {
  private config: ResponsiveConfig
  private currentColumns: number
  private containerWidth: number
  private changeCallbacks: Set<(event: ColumnChangeEvent) => void>
  private resizeObserver: ResizeObserver | null

  constructor(config: Partial<ResponsiveConfig> = {}) {
    this.config = {
      defaultColumns: 3,
      maxColumnWidth: 400,
      gap: 12,
      breakpoints: [],
      enableSmoothTransitions: true,
      transitionDuration: 300,
      ...config
    }
    
    this.currentColumns = this.config.defaultColumns
    this.containerWidth = 0
    this.changeCallbacks = new Set()
    this.resizeObserver = null
  }

  public calculateColumns(containerWidth: number): number {
    this.containerWidth = containerWidth

    // Check breakpoints first (most specific to least specific)
    const sortedBreakpoints = [...this.config.breakpoints]
      .sort((a, b) => b.minWidth - a.minWidth) // Descending order

    for (const breakpoint of sortedBreakpoints) {
      if (containerWidth >= breakpoint.minWidth) {
        return breakpoint.columns
      }
    }

    // Fall back to max column width calculation
    const availableWidth = containerWidth
    const minColumns = 1
    const maxColumns = Math.floor(availableWidth / (this.config.maxColumnWidth + this.config.gap))
    
    return Math.max(minColumns, Math.min(maxColumns, this.config.defaultColumns))
  }

  public updateColumns(containerWidth: number): boolean {
    const newColumns = this.calculateColumns(containerWidth)
    
    if (newColumns !== this.currentColumns) {
      const event: ColumnChangeEvent = {
        from: this.currentColumns,
        to: newColumns,
        containerWidth,
        timestamp: Date.now()
      }

      this.currentColumns = newColumns
      this.notifyChangeCallbacks(event)
      return true
    }

    return false
  }

  public getCurrentColumns(): number {
    return this.currentColumns
  }

  public getCurrentConfig(): ResponsiveConfig {
    return { ...this.config }
  }

  public addBreakpoint(breakpoint: ResponsiveBreakpoint): void {
    this.config.breakpoints.push(breakpoint)
    this.config.breakpoints.sort((a, b) => a.minWidth - b.minWidth)
    
    // Recalculate columns if container width is set
    if (this.containerWidth > 0) {
      this.updateColumns(this.containerWidth)
    }
  }

  public removeBreakpoint(minWidth: number): void {
    this.config.breakpoints = this.config.breakpoints.filter(bp => bp.minWidth !== minWidth)
    
    // Recalculate columns if container width is set
    if (this.containerWidth > 0) {
      this.updateColumns(this.containerWidth)
    }
  }

  public updateConfig(newConfig: Partial<ResponsiveConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Recalculate columns if container width is set
    if (this.containerWidth > 0) {
      this.updateColumns(this.containerWidth)
    }
  }

  public onColumnChange(callback: (event: ColumnChangeEvent) => void): () => void {
    this.changeCallbacks.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.changeCallbacks.delete(callback)
    }
  }

  public setupResizeObserver(element: HTMLElement): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const width = entry.contentRect.width
        this.updateColumns(width)
      })
    })

    this.resizeObserver.observe(element)
  }

  public cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    this.changeCallbacks.clear()
  }

  private notifyChangeCallbacks(event: ColumnChangeEvent): void {
    this.changeCallbacks.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Error in column change callback:', error)
      }
    })
  }

  public getBreakpoints(): ResponsiveBreakpoint[] {
    return [...this.config.breakpoints]
  }

  public getColumnWidth(containerWidth: number, columns: number): number {
    return (containerWidth - (this.config.gap * (columns - 1))) / columns
  }

  public shouldUseBreakpoint(containerWidth: number): ResponsiveBreakpoint | null {
    const sortedBreakpoints = [...this.config.breakpoints]
      .sort((a, b) => b.minWidth - a.minWidth)

    for (const breakpoint of sortedBreakpoints) {
      if (containerWidth >= breakpoint.minWidth) {
        return breakpoint
      }
    }

    return null
  }
}
```

### Step 2: Responsive Column Hook
Create `hooks/useResponsiveColumns.ts`:

```typescript
import { useCallback, useRef, useState, useEffect } from 'react'
import { ResponsiveColumnManager, ResponsiveConfig, ColumnChangeEvent } from '../engine/ResponsiveColumnManager'

export function useResponsiveColumns(
  initialConfig: Partial<ResponsiveConfig> = {}
) {
  const [currentColumns, setCurrentColumns] = useState(initialConfig.defaultColumns || 3)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const managerRef = useRef<ResponsiveColumnManager>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize manager
  if (!managerRef.current) {
    managerRef.current = new ResponsiveColumnManager(initialConfig)
  }

  // Set up column change listener
  useEffect(() => {
    if (!managerRef.current) return

    const unsubscribe = managerRef.current.onColumnChange((event: ColumnChangeEvent) => {
      setCurrentColumns(event.to)
      setContainerWidth(event.containerWidth)

      // Handle smooth transitions
      if (initialConfig.enableSmoothTransitions) {
        setIsTransitioning(true)
        setTimeout(() => {
          setIsTransitioning(false)
        }, initialConfig.transitionDuration || 300)
      }
    })

    return unsubscribe
  }, [initialConfig.enableSmoothTransitions, initialConfig.transitionDuration])

  // Set up resize observer
  useEffect(() => {
    if (containerRef.current && managerRef.current) {
      managerRef.current.setupResizeObserver(containerRef.current)
    }

    return () => {
      managerRef.current?.cleanup()
    }
  }, [])

  const updateConfig = useCallback((newConfig: Partial<ResponsiveConfig>) => {
    managerRef.current?.updateConfig(newConfig)
  }, [])

  const addBreakpoint = useCallback((breakpoint: any) => {
    managerRef.current?.addBreakpoint(breakpoint)
  }, [])

  const removeBreakpoint = useCallback((minWidth: number) => {
    managerRef.current?.removeBreakpoint(minWidth)
  }, [])

  const getColumnWidth = useCallback((columns: number) => {
    if (!containerWidth) return 0
    return managerRef.current?.getColumnWidth(containerWidth, columns) || 0
  }, [containerWidth])

  return {
    containerRef,
    currentColumns,
    containerWidth,
    isTransitioning,
    updateConfig,
    addBreakpoint,
    removeBreakpoint,
    getColumnWidth,
    manager: managerRef.current
  }
}
```

### Step 3: Responsive Breakpoint Utilities
Create `utils/responsiveUtils.ts`:

```typescript
export interface StandardBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

export const STANDARD_BREAKPOINTS: StandardBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function createStandardBreakpoints(
  columns: Partial<Record<keyof StandardBreakpoints, number>> = {}
): any[] {
  const defaultColumns = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,
    ...columns
  }

  return Object.entries(STANDARD_BREAKPOINTS).map(([key, minWidth]) => ({
    minWidth,
    columns: defaultColumns[key as keyof StandardBreakpoints]
  }))
}

export function createCustomBreakpoints(
  breakpoints: Array<{ width: number; columns: number }>
): any[] {
  return breakpoints.map(({ width, columns }) => ({
    minWidth: width,
    columns
  }))
}

export function calculateOptimalColumns(
  containerWidth: number,
  itemWidth: number,
  gap: number,
  minColumns: number = 1,
  maxColumns: number = 10
): number {
  if (containerWidth <= 0 || itemWidth <= 0) return minColumns

  const availableWidth = containerWidth
  const totalGapWidth = gap * (maxColumns - 1)
  const maxPossibleColumns = Math.floor((availableWidth + gap) / (itemWidth + gap))

  return Math.max(minColumns, Math.min(maxColumns, maxPossibleColumns))
}

export function debounceResize<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): T {
  let timeoutId: NodeJS.Timeout

  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }) as T
}

export function throttleResize<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 16
): T {
  let lastCall = 0

  return ((...args: any[]) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      callback(...args)
    }
  }) as T
}

export function createResponsiveConfig(
  options: {
    defaultColumns?: number
    maxColumnWidth?: number
    gap?: number
    breakpoints?: any[]
    enableSmoothTransitions?: boolean
    transitionDuration?: number
  } = {}
) {
  return {
    defaultColumns: 3,
    maxColumnWidth: 400,
    gap: 12,
    breakpoints: createStandardBreakpoints(),
    enableSmoothTransitions: true,
    transitionDuration: 300,
    ...options
  }
}
```

### Step 4: Responsive Layout Component
Create `components/ResponsiveMasonryLayout.tsx`:

```typescript
import React, { useMemo } from 'react'
import { useResponsiveColumns } from '../hooks/useResponsiveColumns'
import { createResponsiveConfig } from '../utils/responsiveUtils'

interface ResponsiveMasonryLayoutProps {
  children: React.ReactNode
  className?: string
  config?: any
  onColumnChange?: (columns: number) => void
}

export function ResponsiveMasonryLayout({
  children,
  className = '',
  config,
  onColumnChange
}: ResponsiveMasonryLayoutProps) {
  const responsiveConfig = useMemo(() => {
    return createResponsiveConfig(config)
  }, [config])

  const {
    containerRef,
    currentColumns,
    isTransitioning,
    getColumnWidth
  } = useResponsiveColumns(responsiveConfig)

  // Notify parent of column changes
  React.useEffect(() => {
    onColumnChange?.(currentColumns)
  }, [currentColumns, onColumnChange])

  const columnWidth = getColumnWidth(currentColumns)

  return (
    <div
      ref={containerRef}
      className={`responsive-masonry-layout ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
        gap: `${responsiveConfig.gap}px`,
        transition: isTransitioning 
          ? `grid-template-columns ${responsiveConfig.transitionDuration}ms ease-in-out`
          : 'none'
      }}
    >
      {children}
    </div>
  )
}
```

### Step 5: Integration with Virtualized Grid
Update `components/VirtualizedMasonryGrid.tsx`:

```typescript
// Add to existing VirtualizedMasonryGrid component
import { useResponsiveColumns } from '../hooks/useResponsiveColumns'
import { createResponsiveConfig } from '../utils/responsiveUtils'

export function VirtualizedMasonryGrid<T>({
  // ... existing props ...
  responsiveConfig,
  onColumnChange
}: VirtualizedMasonryGridProps<T>) {
  // ... existing code ...

  // Add responsive columns
  const {
    containerRef: responsiveRef,
    currentColumns,
    isTransitioning,
    updateConfig: updateResponsiveConfig
  } = useResponsiveColumns(responsiveConfig || createResponsiveConfig())

  // Combine container refs
  const combinedContainerRef = useMemo(() => {
    return responsiveRef.current || containerRef.current
  }, [responsiveRef, containerRef])

  // Update virtualization config when columns change
  useEffect(() => {
    if (virtualizerRef.current) {
      virtualizerRef.current.updateConfig({
        columns: currentColumns
      })
      updateVirtualizationState()
    }
  }, [currentColumns, updateVirtualizationState])

  // Notify parent of column changes
  useEffect(() => {
    onColumnChange?.(currentColumns)
  }, [currentColumns, onColumnChange])

  return (
    <div className={className}>
      <div
        ref={combinedContainerRef}
        className={`virtualized-masonry-container ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          height: '100%',
          transition: isTransitioning 
            ? `all ${responsiveConfig?.transitionDuration || 300}ms ease-in-out`
            : 'none'
        }}
      >
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
    </div>
  )
}
```

### Step 6: Responsive Performance Optimizations
Create `utils/responsivePerformanceUtils.ts`:

```typescript
export class ResponsivePerformanceOptimizer {
  private lastResizeTime: number = 0
  private resizeTimeout: NodeJS.Timeout | null = null
  private minResizeInterval: number = 100

  public debounceResize(callback: () => void, delay: number = 100): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }

    this.resizeTimeout = setTimeout(() => {
      callback()
      this.resizeTimeout = null
    }, delay)
  }

  public throttleResize(callback: () => void): boolean {
    const now = Date.now()
    
    if (now - this.lastResizeTime >= this.minResizeInterval) {
      this.lastResizeTime = now
      callback()
      return true
    }
    
    return false
  }

  public shouldUpdateLayout(oldWidth: number, newWidth: number, threshold: number = 50): boolean {
    return Math.abs(newWidth - oldWidth) >= threshold
  }

  public calculateOptimalUpdateInterval(containerWidth: number): number {
    // Larger containers can handle more frequent updates
    if (containerWidth > 1200) return 16 // 60fps
    if (containerWidth > 768) return 32 // 30fps
    return 100 // 10fps for small containers
  }
}

export function createResponsivePerformanceConfig() {
  return {
    debounceDelay: 100,
    throttleDelay: 16,
    resizeThreshold: 50,
    enableSmoothTransitions: true,
    transitionDuration: 300
  }
}
```

## ✅ Acceptance Criteria

- [ ] Responsive column manager implemented
- [ ] Dynamic column calculation working
- [ ] Smooth transitions functional
- [ ] Breakpoint management operational
- [ ] Performance optimizations in place
- [ ] Integration with virtualization working

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('ResponsiveColumnManager', () => {
  it('should calculate columns based on breakpoints', () => {
    const manager = new ResponsiveColumnManager({
      breakpoints: [
        { minWidth: 0, columns: 1 },
        { minWidth: 768, columns: 2 },
        { minWidth: 1024, columns: 3 }
      ]
    })

    expect(manager.calculateColumns(500)).toBe(1)
    expect(manager.calculateColumns(900)).toBe(2)
    expect(manager.calculateColumns(1200)).toBe(3)
  })

  it('should notify callbacks on column changes', () => {
    const manager = new ResponsiveColumnManager()
    const mockCallback = jest.fn()
    
    manager.onColumnChange(mockCallback)
    manager.updateColumns(1200)
    
    expect(mockCallback).toHaveBeenCalled()
  })
})
```

### Integration Tests
- [ ] Responsive behavior with virtualization
- [ ] Smooth transitions
- [ ] Performance under resize
- [ ] Breakpoint management

## 🚨 Potential Issues

### Common Problems
1. **Layout thrashing**: Frequent column recalculations
2. **Performance impact**: Resize observer overhead
3. **Smooth transitions**: CSS transition conflicts
4. **Memory leaks**: Unused resize observers

### Solutions
1. Implement debouncing and throttling
2. Optimize resize observer usage
3. Handle transition conflicts
4. Proper cleanup and memory management

## 📚 Documentation

### API Reference
- ResponsiveColumnManager methods
- Breakpoint configuration
- Performance optimization utilities

### Usage Examples
- Basic responsive setup
- Custom breakpoint configuration
- Performance optimization

## 🔄 Next Steps

After completion:
1. Move to Task 8: Performance Optimization
2. Implement comprehensive performance monitoring
3. Add memory management
4. Optimize rendering performance

## 📊 Success Metrics

- [ ] Responsive columns working smoothly
- [ ] Smooth transitions implemented
- [ ] Performance maintained during resize
- [ ] Breakpoint management functional
- [ ] Memory usage optimized
- [ ] All tests passing
