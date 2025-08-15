import type { ResponsiveBreakpoint, ResponsiveConfig, ColumnChangeEvent } from '../types/virtualization'

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

  public updateConfig(newConfig: Partial<ResponsiveConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    // Recalculate columns with new config
    if (this.containerWidth > 0) {
      this.updateColumns(this.containerWidth)
    }
  }

  public addChangeCallback(callback: (event: ColumnChangeEvent) => void): void {
    this.changeCallbacks.add(callback)
  }

  public removeChangeCallback(callback: (event: ColumnChangeEvent) => void): void {
    this.changeCallbacks.delete(callback)
  }

  public observeElement(element: HTMLElement): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        this.updateColumns(width)
      }
    })

    this.resizeObserver.observe(element)
  }

  public disconnect(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
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

  public destroy(): void {
    this.disconnect()
    this.changeCallbacks.clear()
  }
}

