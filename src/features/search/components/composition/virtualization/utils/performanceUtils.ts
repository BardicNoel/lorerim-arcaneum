import type { VirtualizationMetrics } from '../types/virtualization'

/**
 * Performance monitoring class for virtualization metrics
 */
export class PerformanceMonitor {
  private renderStartTime: number = 0
  private scrollFrameCount: number = 0
  private scrollLastTime: number = 0
  private fpsHistory: number[] = []
  private maxHistorySize: number = 60 // Keep 60 frames of history

  startRenderTimer(): void {
    this.renderStartTime = performance.now()
  }

  endRenderTimer(): number {
    const renderTime = performance.now() - this.renderStartTime
    this.renderStartTime = 0
    return renderTime
  }

  updateScrollFPS(): void {
    const now = performance.now()
    this.scrollFrameCount++

    if (now - this.scrollLastTime >= 1000) {
      const fps = Math.round((this.scrollFrameCount * 1000) / (now - this.scrollLastTime))
      this.fpsHistory.push(fps)
      
      if (this.fpsHistory.length > this.maxHistorySize) {
        this.fpsHistory.shift()
      }
      
      this.scrollFrameCount = 0
      this.scrollLastTime = now
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0
    return Math.round(
      this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
    )
  }

  getCurrentFPS(): number {
    return this.fpsHistory[this.fpsHistory.length - 1] || 0
  }

  reset(): void {
    this.renderStartTime = 0
    this.scrollFrameCount = 0
    this.scrollLastTime = 0
    this.fpsHistory = []
  }
}

/**
 * Memory usage estimation for virtualization
 */
export function estimateMemoryUsage(
  visibleItems: number,
  averageItemSize: number = 1024 // 1KB per item estimate
): number {
  return visibleItems * averageItemSize
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Calculate performance metrics
 */
export function calculateMetrics(
  totalItems: number,
  visibleItems: number,
  renderTime: number,
  fps: number
): VirtualizationMetrics {
  return {
    totalItems,
    visibleItems,
    memoryUsage: estimateMemoryUsage(visibleItems),
    renderTime,
    scrollFPS: fps
  }
}

/**
 * Check if performance is acceptable
 */
export function isPerformanceAcceptable(metrics: VirtualizationMetrics): boolean {
  return (
    metrics.renderTime < 16 && // 60fps = 16ms per frame
    metrics.scrollFPS >= 50 && // Minimum 50fps for smooth scrolling
    metrics.memoryUsage < 50 * 1024 * 1024 // Less than 50MB
  )
}

/**
 * Performance warning thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  RENDER_TIME_WARNING: 16, // ms
  FPS_WARNING: 50,
  MEMORY_WARNING: 50 * 1024 * 1024, // 50MB
  ITEM_COUNT_WARNING: 1000
} as const

/**
 * Get performance warnings
 */
export function getPerformanceWarnings(metrics: VirtualizationMetrics): string[] {
  const warnings: string[] = []
  
  if (metrics.renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME_WARNING) {
    warnings.push(`Render time (${metrics.renderTime.toFixed(2)}ms) exceeds 16ms threshold`)
  }
  
  if (metrics.scrollFPS < PERFORMANCE_THRESHOLDS.FPS_WARNING) {
    warnings.push(`Scroll FPS (${metrics.scrollFPS}) below 50fps threshold`)
  }
  
  if (metrics.memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
    warnings.push(`Memory usage (${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB) exceeds 50MB threshold`)
  }
  
  if (metrics.totalItems > PERFORMANCE_THRESHOLDS.ITEM_COUNT_WARNING) {
    warnings.push(`Large dataset (${metrics.totalItems} items) may impact performance`)
  }
  
  return warnings
}

