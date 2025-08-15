import type { HeightMeasurementResult, ItemPosition } from '../types/virtualization'

/**
 * Height measurement system for variable-height items
 */
export class HeightMeasurer {
  private measurements: Map<string, HeightMeasurementResult> = new Map()
  private observers: Map<string, ResizeObserver> = new Map()
  private callbacks: Map<string, (height: number) => void> = new Map()
  private stableThreshold: number = 50 // ms
  private maxRetries: number = 3

  /**
   * Measure height of an element
   */
  measureHeight(element: HTMLElement, key: string): Promise<number> {
    return new Promise((resolve) => {
      // Use ResizeObserver for dynamic height tracking
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height
          this.updateMeasurement(key, height)
          resolve(height)
        }
      })

      observer.observe(element)
      this.observers.set(key, observer)

      // Initial measurement
      const initialHeight = element.offsetHeight
      this.updateMeasurement(key, initialHeight)
      resolve(initialHeight)
    })
  }

  /**
   * Set initial height for an item
   */
  setInitialHeight(key: string, height: number): void {
    this.measurements.set(key, {
      height,
      timestamp: Date.now(),
      stable: true
    })
  }

  /**
   * Update height for an item
   */
  updateHeight(key: string, height: number): void {
    this.measurements.set(key, {
      height,
      timestamp: Date.now(),
      stable: true
    })
  }

  /**
   * Update measurement with stability check
   */
  private updateMeasurement(key: string, height: number): void {
    const now = Date.now()
    const existing = this.measurements.get(key)

    if (existing) {
      const timeDiff = now - existing.timestamp
      const heightDiff = Math.abs(height - existing.height)
      
      // Check if height is stable (within 1px and time threshold)
      const stable = heightDiff <= 1 && timeDiff >= this.stableThreshold
      
      this.measurements.set(key, {
        height,
        timestamp: now,
        stable
      })
    } else {
      this.measurements.set(key, {
        height,
        timestamp: now,
        stable: false
      })
    }

    // Notify callback if registered
    const callback = this.callbacks.get(key)
    if (callback) {
      callback(height)
    }
  }

  /**
   * Get cached measurement
   */
  getMeasurement(key: string): HeightMeasurementResult | undefined {
    return this.measurements.get(key)
  }

  /**
   * Check if measurement is stable
   */
  isStable(key: string): boolean {
    const measurement = this.measurements.get(key)
    return measurement?.stable ?? false
  }

  /**
   * Register callback for height changes
   */
  onHeightChange(key: string, callback: (height: number) => void): void {
    this.callbacks.set(key, callback)
  }

  /**
   * Unregister callback
   */
  offHeightChange(key: string): void {
    this.callbacks.delete(key)
  }

  /**
   * Stop observing element
   */
  stopObserving(key: string): void {
    const observer = this.observers.get(key)
    if (observer) {
      observer.disconnect()
      this.observers.delete(key)
    }
    this.callbacks.delete(key)
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.callbacks.clear()
    this.measurements.clear()
  }

  /**
   * Get all measurements
   */
  getAllMeasurements(): Map<string, HeightMeasurementResult> {
    return new Map(this.measurements)
  }

  /**
   * Estimate height for items without measurement
   */
  estimateHeight(key: string, fallbackHeight: number = 200): number {
    const measurement = this.measurements.get(key)
    return measurement?.height ?? fallbackHeight
  }

  /**
   * Batch measure multiple elements
   */
  async batchMeasure(
    elements: Array<{ element: HTMLElement; key: string }>
  ): Promise<Map<string, number>> {
    const results = new Map<string, number>()
    const promises = elements.map(({ element, key }) =>
      this.measureHeight(element, key).then(height => {
        results.set(key, height)
        return { key, height }
      })
    )

    await Promise.all(promises)
    return results
  }

  /**
   * Get measurement statistics
   */
  getStats(): {
    totalMeasurements: number
    stableMeasurements: number
    averageHeight: number
  } {
    const measurements = Array.from(this.measurements.values())
    const stableCount = measurements.filter(m => m.stable).length
    const averageHeight = measurements.length > 0
      ? measurements.reduce((sum, m) => sum + m.height, 0) / measurements.length
      : 0

    return {
      totalMeasurements: measurements.length,
      stableMeasurements: stableCount,
      averageHeight
    }
  }

  /**
   * Destroy the height measurer
   */
  destroy(): void {
    this.clear()
  }
}
