// Now use the stable virtualization version
import React from 'react'
import { StableVirtualMasonryGrid } from './virtualization'
import type { PreMeasurementConfig } from './virtualization/types/virtualization'

// Use the stable virtualization props interface
interface VirtualMasonryGridProps<T> {
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
  showPerformanceMetrics?: boolean
  useDynamicHeightEstimation?: boolean
  preMeasurement?: PreMeasurementConfig
}

export function VirtualMasonryGrid<T>(props: VirtualMasonryGridProps<T>) {
  // Use the stable virtualization version
  return <StableVirtualMasonryGrid {...props} />
}

// Also export the legacy version for backward compatibility
export { LegacyVirtualMasonryGrid } from './LegacyVirtualMasonryGrid'
