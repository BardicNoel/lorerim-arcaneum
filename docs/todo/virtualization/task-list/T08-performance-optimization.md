# Task 8: Performance Optimization

## 📋 Overview
Implement comprehensive performance optimizations for the virtualized masonry grid, including memory management, rendering optimizations, and performance monitoring to ensure smooth operation with large datasets.

## 🎯 Objectives
- Implement memory management and cleanup
- Add performance monitoring and metrics
- Optimize rendering performance
- Add performance profiling tools

## 🏗 Implementation Steps

### Step 1: Performance Monitor
Create `engine/PerformanceMonitor.ts`:

```typescript
export interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  scrollFPS: number
  itemCount: number
  visibleItems: number
  cacheHitRate: number
  timestamp: number
}

export interface PerformanceThresholds {
  maxRenderTime: number
  maxMemoryUsage: number
  minScrollFPS: number
  maxItemCount: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[]
  private thresholds: PerformanceThresholds
  private maxMetricsHistory: number
  private performanceObserver: PerformanceObserver | null
  private frameCount: number
  private lastFrameTime: number
  private scrollFrameTimes: number[]

  constructor(thresholds: Partial<PerformanceThresholds> = {}) {
    this.thresholds = {
      maxRenderTime: 16, // 60fps target
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      minScrollFPS: 30,
      maxItemCount: 10000,
      ...thresholds
    }
    
    this.metrics = []
    this.maxMetricsHistory = 100
    this.performanceObserver = null
    this.frameCount = 0
    this.lastFrameTime = performance.now()
    this.scrollFrameTimes = []
  }

  public startMonitoring(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.recordRenderTime(entry.duration)
          }
        })
      })

      this.performanceObserver.observe({ entryTypes: ['measure'] })
    }
  }

  public stopMonitoring(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
      this.performanceObserver = null
    }
  }

  public recordMetrics(metrics: Partial<PerformanceMetrics>): void {
    const fullMetrics: PerformanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      scrollFPS: 0,
      itemCount: 0,
      visibleItems: 0,
      cacheHitRate: 0,
      timestamp: Date.now(),
      ...metrics
    }

    this.metrics.push(fullMetrics)
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics.shift()
    }

    // Check thresholds
    this.checkThresholds(fullMetrics)
  }

  public recordRenderTime(duration: number): void {
    const currentTime = performance.now()
    const frameTime = currentTime - this.lastFrameTime
    this.lastFrameTime = currentTime

    this.scrollFrameTimes.push(frameTime)
    
    // Keep only recent frame times
    if (this.scrollFrameTimes.length > 60) {
      this.scrollFrameTimes.shift()
    }

    this.frameCount++
  }

  public getCurrentMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null
    return this.metrics[this.metrics.length - 1]
  }

  public getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {}

    const sum = this.metrics.reduce((acc, metric) => ({
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      scrollFPS: acc.scrollFPS + metric.scrollFPS,
      itemCount: acc.itemCount + metric.itemCount,
      visibleItems: acc.visibleItems + metric.visibleItems,
      cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
      timestamp: 0
    }), {
      renderTime: 0,
      memoryUsage: 0,
      scrollFPS: 0,
      itemCount: 0,
      visibleItems: 0,
      cacheHitRate: 0,
      timestamp: 0
    })

    const count = this.metrics.length
    return {
      renderTime: sum.renderTime / count,
      memoryUsage: sum.memoryUsage / count,
      scrollFPS: sum.scrollFPS / count,
      itemCount: sum.itemCount / count,
      visibleItems: sum.visibleItems / count,
      cacheHitRate: sum.cacheHitRate / count
    }
  }

  public getScrollFPS(): number {
    if (this.scrollFrameTimes.length === 0) return 0

    const averageFrameTime = this.scrollFrameTimes.reduce((sum, time) => sum + time, 0) / this.scrollFrameTimes.length
    return 1000 / averageFrameTime
  }

  public getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  public isPerformanceAcceptable(): boolean {
    const currentMetrics = this.getCurrentMetrics()
    if (!currentMetrics) return true

    return (
      currentMetrics.renderTime <= this.thresholds.maxRenderTime &&
      currentMetrics.memoryUsage <= this.thresholds.maxMemoryUsage &&
      currentMetrics.scrollFPS >= this.thresholds.minScrollFPS &&
      currentMetrics.itemCount <= this.thresholds.maxItemCount
    )
  }

  public getPerformanceReport(): {
    isAcceptable: boolean
    issues: string[]
    recommendations: string[]
  } {
    const currentMetrics = this.getCurrentMetrics()
    const issues: string[] = []
    const recommendations: string[] = []

    if (!currentMetrics) {
      return { isAcceptable: true, issues, recommendations }
    }

    if (currentMetrics.renderTime > this.thresholds.maxRenderTime) {
      issues.push(`Render time (${currentMetrics.renderTime}ms) exceeds threshold (${this.thresholds.maxRenderTime}ms)`)
      recommendations.push('Consider reducing item complexity or implementing more aggressive virtualization')
    }

    if (currentMetrics.memoryUsage > this.thresholds.maxMemoryUsage) {
      issues.push(`Memory usage (${currentMetrics.memoryUsage}MB) exceeds threshold (${this.thresholds.maxMemoryUsage}MB)`)
      recommendations.push('Implement memory cleanup and reduce cache size')
    }

    if (currentMetrics.scrollFPS < this.thresholds.minScrollFPS) {
      issues.push(`Scroll FPS (${currentMetrics.scrollFPS}) below threshold (${this.thresholds.minScrollFPS})`)
      recommendations.push('Optimize scroll handling and reduce re-renders')
    }

    if (currentMetrics.itemCount > this.thresholds.maxItemCount) {
      issues.push(`Item count (${currentMetrics.itemCount}) exceeds threshold (${this.thresholds.maxItemCount})`)
      recommendations.push('Implement pagination or more aggressive virtualization')
    }

    return {
      isAcceptable: issues.length === 0,
      issues,
      recommendations
    }
  }

  private checkThresholds(metrics: PerformanceMetrics): void {
    if (!this.isPerformanceAcceptable()) {
      console.warn('Performance thresholds exceeded:', this.getPerformanceReport())
    }
  }

  public clear(): void {
    this.metrics = []
    this.scrollFrameTimes = []
    this.frameCount = 0
  }
}
```

### Step 2: Memory Manager
Create `engine/MemoryManager.ts`:

```typescript
export interface MemoryConfig {
  maxCacheSize: number
  maxItemCount: number
  cleanupInterval: number
  enableGarbageCollection: boolean
}

export interface MemoryStats {
  cacheSize: number
  itemCount: number
  memoryUsage: number
  lastCleanup: number
  cleanupCount: number
}

export class MemoryManager {
  private config: MemoryConfig
  private cache: Map<string, any>
  private itemCount: number
  private lastCleanup: number
  private cleanupCount: number
  private cleanupTimer: NodeJS.Timeout | null

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      maxCacheSize: 1000,
      maxItemCount: 5000,
      cleanupInterval: 30000, // 30 seconds
      enableGarbageCollection: true,
      ...config
    }
    
    this.cache = new Map()
    this.itemCount = 0
    this.lastCleanup = Date.now()
    this.cleanupCount = 0
    this.cleanupTimer = null

    this.startCleanupTimer()
  }

  public addItem(key: string, item: any): boolean {
    if (this.itemCount >= this.config.maxItemCount) {
      this.cleanup()
      if (this.itemCount >= this.config.maxItemCount) {
        return false
      }
    }

    this.cache.set(key, item)
    this.itemCount++
    return true
  }

  public getItem(key: string): any | undefined {
    return this.cache.get(key)
  }

  public removeItem(key: string): boolean {
    const removed = this.cache.delete(key)
    if (removed) {
      this.itemCount--
    }
    return removed
  }

  public hasItem(key: string): boolean {
    return this.cache.has(key)
  }

  public cleanup(): void {
    const now = Date.now()
    
    // Remove oldest items if cache is too large
    if (this.cache.size > this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
      const toRemove = entries.slice(0, this.cache.size - this.config.maxCacheSize)
      
      toRemove.forEach(([key]) => {
        this.cache.delete(key)
        this.itemCount--
      })
    }

    // Force garbage collection if enabled
    if (this.config.enableGarbageCollection && 'gc' in window) {
      try {
        (window as any).gc()
      } catch (error) {
        // Garbage collection not available
      }
    }

    this.lastCleanup = now
    this.cleanupCount++
  }

  public getStats(): MemoryStats {
    return {
      cacheSize: this.cache.size,
      itemCount: this.itemCount,
      memoryUsage: this.getMemoryUsage(),
      lastCleanup: this.lastCleanup,
      cleanupCount: this.cleanupCount
    }
  }

  public clear(): void {
    this.cache.clear()
    this.itemCount = 0
  }

  public updateConfig(newConfig: Partial<MemoryConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.clear()
  }
}
```

### Step 3: Rendering Optimizer
Create `engine/RenderingOptimizer.ts`:

```typescript
export interface RenderingConfig {
  enableVirtualization: boolean
  enableDebouncing: boolean
  enableThrottling: boolean
  debounceDelay: number
  throttleDelay: number
  batchSize: number
}

export class RenderingOptimizer {
  private config: RenderingConfig
  private pendingUpdates: Set<string>
  private updateQueue: Array<() => void>
  private isProcessing: boolean
  private lastUpdateTime: number

  constructor(config: Partial<RenderingConfig> = {}) {
    this.config = {
      enableVirtualization: true,
      enableDebouncing: true,
      enableThrottling: true,
      debounceDelay: 16,
      throttleDelay: 100,
      batchSize: 10,
      ...config
    }
    
    this.pendingUpdates = new Set()
    this.updateQueue = []
    this.isProcessing = false
    this.lastUpdateTime = 0
  }

  public scheduleUpdate(key: string, updateFn: () => void): void {
    this.pendingUpdates.add(key)
    this.updateQueue.push(updateFn)

    if (this.config.enableDebouncing) {
      this.debounceUpdate()
    } else if (this.config.enableThrottling) {
      this.throttleUpdate()
    } else {
      this.processUpdates()
    }
  }

  public processUpdates(): void {
    if (this.isProcessing || this.updateQueue.length === 0) return

    this.isProcessing = true
    const now = Date.now()

    // Process updates in batches
    const batch = this.updateQueue.splice(0, this.config.batchSize)
    
    batch.forEach(updateFn => {
      try {
        updateFn()
      } catch (error) {
        console.error('Error processing update:', error)
      }
    })

    this.pendingUpdates.clear()
    this.lastUpdateTime = now
    this.isProcessing = false

    // Process remaining updates if any
    if (this.updateQueue.length > 0) {
      requestAnimationFrame(() => this.processUpdates())
    }
  }

  public debounceUpdate(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.processUpdates()
    }, this.config.debounceDelay)
  }

  public throttleUpdate(): void {
    const now = Date.now()
    
    if (now - this.lastUpdateTime >= this.config.throttleDelay) {
      this.processUpdates()
    } else {
      // Schedule for later
      setTimeout(() => {
        this.processUpdates()
      }, this.config.throttleDelay - (now - this.lastUpdateTime))
    }
  }

  public optimizeRender(renderFn: () => void): () => void {
    if (!this.config.enableVirtualization) {
      return renderFn
    }

    return () => {
      if (this.shouldRender()) {
        renderFn()
      }
    }
  }

  public shouldRender(): boolean {
    // Add custom logic to determine if render is necessary
    return true
  }

  public getStats(): {
    pendingUpdates: number
    queueLength: number
    isProcessing: boolean
    lastUpdateTime: number
  } {
    return {
      pendingUpdates: this.pendingUpdates.size,
      queueLength: this.updateQueue.length,
      isProcessing: this.isProcessing,
      lastUpdateTime: this.lastUpdateTime
    }
  }

  public clear(): void {
    this.pendingUpdates.clear()
    this.updateQueue = []
    this.isProcessing = false
  }

  private debounceTimer: NodeJS.Timeout | null = null
}
```

### Step 4: Performance Hook
Create `hooks/usePerformanceOptimization.ts`:

```typescript
import { useRef, useEffect, useCallback } from 'react'
import { PerformanceMonitor } from '../engine/PerformanceMonitor'
import { MemoryManager } from '../engine/MemoryManager'
import { RenderingOptimizer } from '../engine/RenderingOptimizer'

export function usePerformanceOptimization(
  config: {
    performanceThresholds?: any
    memoryConfig?: any
    renderingConfig?: any
  } = {}
) {
  const performanceMonitorRef = useRef<PerformanceMonitor>()
  const memoryManagerRef = useRef<MemoryManager>()
  const renderingOptimizerRef = useRef<RenderingOptimizer>()

  // Initialize managers
  if (!performanceMonitorRef.current) {
    performanceMonitorRef.current = new PerformanceMonitor(config.performanceThresholds)
  }

  if (!memoryManagerRef.current) {
    memoryManagerRef.current = new MemoryManager(config.memoryConfig)
  }

  if (!renderingOptimizerRef.current) {
    renderingOptimizerRef.current = new RenderingOptimizer(config.renderingConfig)
  }

  // Start monitoring
  useEffect(() => {
    performanceMonitorRef.current?.startMonitoring()

    return () => {
      performanceMonitorRef.current?.stopMonitoring()
      memoryManagerRef.current?.destroy()
    }
  }, [])

  const recordMetrics = useCallback((metrics: any) => {
    performanceMonitorRef.current?.recordMetrics(metrics)
  }, [])

  const scheduleUpdate = useCallback((key: string, updateFn: () => void) => {
    renderingOptimizerRef.current?.scheduleUpdate(key, updateFn)
  }, [])

  const optimizeRender = useCallback((renderFn: () => void) => {
    return renderingOptimizerRef.current?.optimizeRender(renderFn) || renderFn
  }, [])

  const getPerformanceReport = useCallback(() => {
    return performanceMonitorRef.current?.getPerformanceReport()
  }, [])

  const getMemoryStats = useCallback(() => {
    return memoryManagerRef.current?.getStats()
  }, [])

  const cleanup = useCallback(() => {
    memoryManagerRef.current?.cleanup()
  }, [])

  return {
    recordMetrics,
    scheduleUpdate,
    optimizeRender,
    getPerformanceReport,
    getMemoryStats,
    cleanup,
    performanceMonitor: performanceMonitorRef.current,
    memoryManager: memoryManagerRef.current,
    renderingOptimizer: renderingOptimizerRef.current
  }
}
```

### Step 5: Performance Profiler Component
Create `components/PerformanceProfiler.tsx`:

```typescript
import React, { useState, useEffect } from 'react'
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization'

interface PerformanceProfilerProps {
  enabled?: boolean
  showDetails?: boolean
  className?: string
}

export function PerformanceProfiler({
  enabled = false,
  showDetails = false,
  className = ''
}: PerformanceProfilerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)
  const [memoryStats, setMemoryStats] = useState<any>(null)

  const {
    recordMetrics,
    getPerformanceReport,
    getMemoryStats
  } = usePerformanceOptimization()

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      const report = getPerformanceReport()
      const stats = getMemoryStats()
      
      setMetrics(report)
      setMemoryStats(stats)
    }, 1000)

    return () => clearInterval(interval)
  }, [enabled, getPerformanceReport, getMemoryStats])

  if (!enabled || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-full shadow-lg"
      >
        📊
      </button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-lg max-w-sm ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {metrics && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={metrics.isAcceptable ? 'text-green-600' : 'text-red-600'}>
              {metrics.isAcceptable ? 'Good' : 'Issues'}
            </span>
          </div>

          {showDetails && memoryStats && (
            <>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span>{(memoryStats.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
              </div>
              <div className="flex justify-between">
                <span>Cache:</span>
                <span>{memoryStats.cacheSize} items</span>
              </div>
            </>
          )}

          {metrics.issues.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <div className="font-semibold text-red-800">Issues:</div>
              <ul className="text-red-700 text-xs">
                {metrics.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### Step 6: Integration with Virtualized Grid
Update `components/VirtualizedMasonryGrid.tsx`:

```typescript
// Add to existing VirtualizedMasonryGrid component
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization'
import { PerformanceProfiler } from './PerformanceProfiler'

export function VirtualizedMasonryGrid<T>({
  // ... existing props ...
  enablePerformanceMonitoring = false
}: VirtualizedMasonryGridProps<T>) {
  // ... existing code ...

  // Add performance optimization
  const {
    recordMetrics,
    scheduleUpdate,
    optimizeRender,
    cleanup: cleanupMemory
  } = usePerformanceOptimization()

  // Record performance metrics
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      recordMetrics({
        itemCount: items.length,
        visibleItems: virtualizationState.visibleRange.end - virtualizationState.visibleRange.start,
        renderTime: 0, // Will be measured by PerformanceMonitor
        memoryUsage: 0, // Will be measured by PerformanceMonitor
        scrollFPS: 0, // Will be measured by PerformanceMonitor
        cacheHitRate: 0 // Will be calculated
      })
    }
  }, [items.length, virtualizationState.visibleRange, enablePerformanceMonitoring, recordMetrics])

  // Optimize render function
  const optimizedRenderItem = useMemo(() => {
    return optimizeRender(renderItem)
  }, [renderItem, optimizeRender])

  // Schedule updates for height changes
  const handleHeightChange = useCallback((itemKey: string, newHeight: number) => {
    scheduleUpdate(itemKey, () => {
      if (virtualizerRef.current) {
        virtualizerRef.current.updateItemHeight(itemKey, newHeight)
        updateVirtualizationState()
      }
    })
  }, [scheduleUpdate, updateVirtualizationState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupMemory()
    }
  }, [cleanupMemory])

  return (
    <div className={className}>
      {/* ... existing render code ... */}
      
      {enablePerformanceMonitoring && (
        <PerformanceProfiler enabled={true} />
      )}
    </div>
  )
}
```

## ✅ Acceptance Criteria

- [ ] Performance monitor implemented
- [ ] Memory management working
- [ ] Rendering optimizer functional
- [ ] Performance profiling tools available
- [ ] Metrics collection and reporting working
- [ ] Memory cleanup operational

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('PerformanceMonitor', () => {
  it('should record metrics correctly', () => {
    const monitor = new PerformanceMonitor()
    monitor.recordMetrics({
      renderTime: 10,
      memoryUsage: 50 * 1024 * 1024,
      scrollFPS: 60,
      itemCount: 1000,
      visibleItems: 20,
      cacheHitRate: 0.8
    })

    const metrics = monitor.getCurrentMetrics()
    expect(metrics?.renderTime).toBe(10)
    expect(metrics?.itemCount).toBe(1000)
  })

  it('should detect performance issues', () => {
    const monitor = new PerformanceMonitor({
      maxRenderTime: 16,
      maxMemoryUsage: 100 * 1024 * 1024
    })

    monitor.recordMetrics({
      renderTime: 20,
      memoryUsage: 150 * 1024 * 1024,
      scrollFPS: 60,
      itemCount: 1000,
      visibleItems: 20,
      cacheHitRate: 0.8
    })

    const report = monitor.getPerformanceReport()
    expect(report.isAcceptable).toBe(false)
    expect(report.issues.length).toBeGreaterThan(0)
  })
})
```

### Integration Tests
- [ ] Performance monitoring with virtualization
- [ ] Memory management under load
- [ ] Rendering optimization effectiveness
- [ ] Performance profiling accuracy

## 🚨 Potential Issues

### Common Problems
1. **Performance overhead**: Monitoring itself affecting performance
2. **Memory leaks**: Incomplete cleanup
3. **False positives**: Incorrect performance warnings
4. **Bundle size**: Performance tools increasing bundle size

### Solutions
1. Conditional monitoring and lightweight metrics
2. Comprehensive cleanup and memory management
3. Configurable thresholds and accurate measurements
4. Tree-shaking and conditional imports

## 📚 Documentation

### API Reference
- PerformanceMonitor methods
- Memory management utilities
- Rendering optimization techniques

### Usage Examples
- Basic performance monitoring setup
- Memory management configuration
- Performance profiling

## 🔄 Next Steps

After completion:
1. Move to Task 9: Backward Compatibility
2. Implement API compatibility layer
3. Add migration utilities
4. Ensure seamless transition

## 📊 Success Metrics

- [ ] Performance monitoring working
- [ ] Memory usage optimized
- [ ] Rendering performance improved
- [ ] Performance profiling functional
- [ ] Metrics collection accurate
- [ ] All tests passing
