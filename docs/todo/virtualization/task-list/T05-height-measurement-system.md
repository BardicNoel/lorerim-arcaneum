# Task 5: Height Measurement System

## 📋 Overview
Implement a comprehensive height measurement system that accurately tracks dynamic item heights, handles resize events, and optimizes performance for the virtualized masonry grid.

## 🎯 Objectives
- Create robust height measurement system
- Implement ResizeObserver integration
- Add height caching and optimization
- Handle dynamic content changes

## 🏗 Implementation Steps

### Step 1: Enhanced Height Measurer
Create `engine/EnhancedHeightMeasurer.ts`:

```typescript
import { HeightMeasurement } from './HeightMeasurer'

export interface HeightMeasurementConfig {
  debounceDelay: number
  throttleDelay: number
  cacheSize: number
  enableResizeObserver: boolean
}

export interface MeasuredItem {
  key: string
  height: number
  width: number
  timestamp: number
  element: HTMLElement | null
}

export class EnhancedHeightMeasurer {
  private measurements: Map<string, MeasuredItem>
  private resizeObservers: Map<string, ResizeObserver>
  private config: HeightMeasurementConfig
  private pendingUpdates: Set<string>
  private updateCallbacks: Map<string, (height: number) => void>

  constructor(config: Partial<HeightMeasurementConfig> = {}) {
    this.config = {
      debounceDelay: 16, // ~60fps
      throttleDelay: 100,
      cacheSize: 1000,
      enableResizeObserver: true,
      ...config
    }
    
    this.measurements = new Map()
    this.resizeObservers = new Map()
    this.pendingUpdates = new Set()
    this.updateCallbacks = new Map()
  }

  public measureElement(
    element: HTMLElement,
    key: string,
    onHeightChange?: (height: number) => void
  ): MeasuredItem {
    const rect = element.getBoundingClientRect()
    const measurement: MeasuredItem = {
      key,
      height: rect.height,
      width: rect.width,
      timestamp: Date.now(),
      element
    }

    this.measurements.set(key, measurement)

    // Set up resize observer if enabled
    if (this.config.enableResizeObserver && onHeightChange) {
      this.setupResizeObserver(element, key, onHeightChange)
    }

    // Clean up old measurements if cache is full
    this.cleanupCache()

    return measurement
  }

  public getMeasurement(key: string): MeasuredItem | undefined {
    return this.measurements.get(key)
  }

  public updateMeasurement(key: string, height: number): void {
    const measurement = this.measurements.get(key)
    if (measurement) {
      measurement.height = height
      measurement.timestamp = Date.now()
      
      // Trigger callback if registered
      const callback = this.updateCallbacks.get(key)
      if (callback) {
        callback(height)
      }
    }
  }

  public setupResizeObserver(
    element: HTMLElement,
    key: string,
    onHeightChange: (height: number) => void
  ): void {
    // Remove existing observer
    this.removeResizeObserver(key)

    // Store callback
    this.updateCallbacks.set(key, onHeightChange)

    // Create new observer
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const newHeight = entry.contentRect.height
        const currentMeasurement = this.measurements.get(key)
        
        if (currentMeasurement && Math.abs(newHeight - currentMeasurement.height) > 1) {
          this.updateMeasurement(key, newHeight)
        }
      })
    })

    observer.observe(element)
    this.resizeObservers.set(key, observer)
  }

  public removeResizeObserver(key: string): void {
    const observer = this.resizeObservers.get(key)
    if (observer) {
      observer.disconnect()
      this.resizeObservers.delete(key)
    }
    this.updateCallbacks.delete(key)
  }

  public cleanupCache(): void {
    if (this.measurements.size <= this.config.cacheSize) return

    // Remove oldest measurements
    const entries = Array.from(this.measurements.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toRemove = entries.slice(0, this.measurements.size - this.config.cacheSize)
    toRemove.forEach(([key]) => {
      this.measurements.delete(key)
      this.removeResizeObserver(key)
    })
  }

  public clear(): void {
    // Disconnect all resize observers
    this.resizeObservers.forEach(observer => observer.disconnect())
    this.resizeObservers.clear()
    
    // Clear all data
    this.measurements.clear()
    this.pendingUpdates.clear()
    this.updateCallbacks.clear()
  }

  public getStats(): {
    measurementCount: number
    observerCount: number
    cacheSize: number
  } {
    return {
      measurementCount: this.measurements.size,
      observerCount: this.resizeObservers.size,
      cacheSize: this.config.cacheSize
    }
  }
}
```

### Step 2: Height Measurement Hook
Create `hooks/useEnhancedHeightMeasurement.ts`:

```typescript
import { useCallback, useRef, useEffect, useMemo } from 'react'
import { EnhancedHeightMeasurer, HeightMeasurementConfig } from '../engine/EnhancedHeightMeasurer'

export function useEnhancedHeightMeasurement(
  config: Partial<HeightMeasurementConfig> = {}
) {
  const measurerRef = useRef<EnhancedHeightMeasurer>()
  const mountedRef = useRef(true)

  // Initialize measurer
  if (!measurerRef.current) {
    measurerRef.current = new EnhancedHeightMeasurer(config)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      measurerRef.current?.clear()
    }
  }, [])

  const measureElement = useCallback((
    element: HTMLElement,
    key: string,
    onHeightChange?: (height: number) => void
  ) => {
    if (!mountedRef.current) return null
    
    return measurerRef.current!.measureElement(element, key, onHeightChange)
  }, [])

  const getMeasurement = useCallback((key: string) => {
    return measurerRef.current?.getMeasurement(key)
  }, [])

  const updateMeasurement = useCallback((key: string, height: number) => {
    measurerRef.current?.updateMeasurement(key, height)
  }, [])

  const removeMeasurement = useCallback((key: string) => {
    measurerRef.current?.removeResizeObserver(key)
  }, [])

  const getStats = useCallback(() => {
    return measurerRef.current?.getStats()
  }, [])

  return {
    measureElement,
    getMeasurement,
    updateMeasurement,
    removeMeasurement,
    getStats
  }
}
```

### Step 3: Height Cache Manager
Create `engine/HeightCacheManager.ts`:

```typescript
export interface HeightCacheEntry {
  height: number
  width: number
  timestamp: number
  confidence: number // 0-1, how confident we are in this measurement
}

export interface HeightCacheConfig {
  maxSize: number
  ttl: number // Time to live in milliseconds
  confidenceThreshold: number
}

export class HeightCacheManager {
  private cache: Map<string, HeightCacheEntry>
  private config: HeightCacheConfig

  constructor(config: Partial<HeightCacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 5 * 60 * 1000, // 5 minutes
      confidenceThreshold: 0.8,
      ...config
    }
    this.cache = new Map()
  }

  public set(key: string, height: number, width: number, confidence: number = 1): void {
    const entry: HeightCacheEntry = {
      height,
      width,
      timestamp: Date.now(),
      confidence
    }

    this.cache.set(key, entry)
    this.cleanup()
  }

  public get(key: string): HeightCacheEntry | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key)
      return undefined
    }

    return entry
  }

  public has(key: string): boolean {
    return this.get(key) !== undefined
  }

  public update(key: string, height: number, confidence: number = 1): void {
    const existing = this.cache.get(key)
    if (existing) {
      existing.height = height
      existing.timestamp = Date.now()
      existing.confidence = confidence
    } else {
      this.set(key, height, 0, confidence)
    }
  }

  public invalidate(key: string): void {
    this.cache.delete(key)
  }

  public clear(): void {
    this.cache.clear()
  }

  public getStats(): {
    size: number
    maxSize: number
    hitRate: number
    averageConfidence: number
  } {
    const entries = Array.from(this.cache.values())
    const hitRate = entries.length / this.config.maxSize
    const averageConfidence = entries.length > 0 
      ? entries.reduce((sum, entry) => sum + entry.confidence, 0) / entries.length
      : 0

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      averageConfidence
    }
  }

  private cleanup(): void {
    if (this.cache.size <= this.config.maxSize) return

    // Remove expired entries first
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key)
      }
    }

    // If still over limit, remove lowest confidence entries
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].confidence - b[1].confidence)
      
      const toRemove = entries.slice(0, this.cache.size - this.config.maxSize)
      toRemove.forEach(([key]) => this.cache.delete(key))
    }
  }
}
```

### Step 4: Height Measurement Utilities
Create `utils/heightUtils.ts`:

```typescript
export function estimateHeight(content: string, fontSize: number = 14, lineHeight: number = 1.5): number {
  const words = content.split(' ')
  const charsPerLine = Math.floor(400 / (fontSize * 0.6)) // Rough estimate
  const lines = Math.ceil(content.length / charsPerLine)
  return lines * fontSize * lineHeight
}

export function calculateConfidence(
  estimatedHeight: number,
  actualHeight: number,
  tolerance: number = 0.2
): number {
  const difference = Math.abs(estimatedHeight - actualHeight)
  const maxDifference = estimatedHeight * tolerance
  
  if (difference <= maxDifference) {
    return 1 - (difference / maxDifference)
  }
  
  return 0
}

export function debounceHeightUpdate<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 16
): T {
  let timeoutId: NodeJS.Timeout
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }) as T
}

export function throttleHeightUpdate<T extends (...args: any[]) => any>(
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

export function createHeightPredictor() {
  const measurements: number[] = []
  const maxMeasurements = 10

  return {
    addMeasurement: (height: number) => {
      measurements.push(height)
      if (measurements.length > maxMeasurements) {
        measurements.shift()
      }
    },

    predictHeight: (): number => {
      if (measurements.length === 0) return 200 // Default
      
      // Use median for better prediction
      const sorted = [...measurements].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid]
    },

    getConfidence: (): number => {
      if (measurements.length < 3) return 0.3
      if (measurements.length < 5) return 0.6
      return 0.9
    }
  }
}
```

### Step 5: Integration with Virtualization
Update `hooks/useMultiColumnVirtualization.ts` to include height measurement:

```typescript
// Add to existing useMultiColumnVirtualization hook
import { useEnhancedHeightMeasurement } from './useEnhancedHeightMeasurement'
import { HeightCacheManager } from '../engine/HeightCacheManager'

export function useMultiColumnVirtualization<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config: MasonryVirtualizerConfig
) {
  // ... existing code ...

  const heightMeasurer = useEnhancedHeightMeasurement({
    debounceDelay: 16,
    cacheSize: 500,
    enableResizeObserver: true
  })

  const heightCache = useRef<HeightCacheManager>(new HeightCacheManager())

  // Enhanced height measurement
  const measureItemHeight = useCallback((
    element: HTMLElement,
    itemKey: string
  ) => {
    const measurement = heightMeasurer.measureElement(element, itemKey, (newHeight) => {
      // Update virtualizer when height changes
      if (virtualizerRef.current) {
        virtualizerRef.current.updateItemHeight(itemKey, newHeight)
        updateVirtualizationState()
      }
    })

    // Cache the measurement
    if (measurement) {
      heightCache.current.set(itemKey, measurement.height, measurement.width, 1)
    }

    return measurement
  }, [heightMeasurer, updateVirtualizationState])

  // Get cached height for estimation
  const getEstimatedHeight = useCallback((itemKey: string): number => {
    const cached = heightCache.current.get(itemKey)
    return cached?.height || config.estimatedItemHeight
  }, [config.estimatedItemHeight])

  return {
    // ... existing return values ...
    measureItemHeight,
    getEstimatedHeight,
    heightMeasurer,
    heightCache: heightCache.current
  }
}
```

## ✅ Acceptance Criteria

- [ ] Enhanced height measurer implemented
- [ ] ResizeObserver integration working
- [ ] Height caching system functional
- [ ] Performance optimizations in place
- [ ] Dynamic height updates handled
- [ ] Memory management working
- [ ] Height prediction accurate

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('EnhancedHeightMeasurer', () => {
  it('should measure element height correctly', () => {
    const measurer = new EnhancedHeightMeasurer()
    const mockElement = document.createElement('div')
    mockElement.style.height = '200px'
    
    const measurement = measurer.measureElement(mockElement, 'test-key')
    expect(measurement.height).toBe(200)
  })

  it('should handle resize observer', () => {
    const measurer = new EnhancedHeightMeasurer()
    const mockElement = document.createElement('div')
    let heightChanged = false
    
    measurer.setupResizeObserver(mockElement, 'test-key', () => {
      heightChanged = true
    })
    
    // Simulate resize
    mockElement.style.height = '300px'
    // Note: In real tests, you'd need to trigger ResizeObserver manually
    
    expect(measurer.getMeasurement('test-key')).toBeDefined()
  })
})
```

### Integration Tests
- [ ] Height measurement with virtualization
- [ ] Resize observer performance
- [ ] Cache hit rates
- [ ] Memory usage monitoring

## 🚨 Potential Issues

### Common Problems
1. **ResizeObserver performance**: Too many observers
2. **Memory leaks**: Unused measurements
3. **Height flickering**: Frequent updates
4. **Cache invalidation**: Stale measurements

### Solutions
1. Limit concurrent observers
2. Implement proper cleanup
3. Debounce height updates
4. Use TTL for cache entries

## 📚 Documentation

### API Reference
- EnhancedHeightMeasurer methods
- Height measurement hooks
- Cache management utilities

### Usage Examples
- Basic height measurement setup
- Resize observer configuration
- Cache optimization

## 🔄 Next Steps

After completion:
1. Move to Task 6: Infinite Scroll Integration
2. Integrate height measurement with infinite scroll
3. Optimize loading performance
4. Add loading states

## 📊 Success Metrics

- [ ] Height measurement accurate
- [ ] Resize detection working
- [ ] Cache performance good
- [ ] Memory usage optimized
- [ ] Update performance smooth
- [ ] All tests passing
