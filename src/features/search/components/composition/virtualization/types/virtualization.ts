export interface ItemPosition {
  top: number
  height: number
  column: number
  index: number
}

export interface VirtualizationState {
  visibleRange: { start: number; end: number }
  scrollTop: number
  containerHeight: number
  itemPositions: Map<string, ItemPosition>
}

export interface MasonryVirtualizerConfig {
  columns: number
  gap: number
  overscan: number
  estimatedItemHeight: number
  maxColumnWidth?: number
  containerWidth?: number
  breakpoints?: Array<{
    minWidth: number
    columns: number
    maxColumnWidth?: number
    gap?: number
  }>
}

export interface VirtualizationMetrics {
  totalItems: number
  visibleItems: number
  memoryUsage: number
  renderTime: number
  scrollFPS: number
}

export interface HeightMeasurementResult {
  height: number
  timestamp: number
  stable: boolean
}

export interface ColumnLayout {
  columnIndex: number
  height: number
  items: number[]
}

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

export interface VirtualizationContextValue {
  state: VirtualizationState
  config: MasonryVirtualizerConfig
  metrics: VirtualizationMetrics
  updatePosition: (key: string, position: ItemPosition) => void
  getVisibleRange: () => { start: number; end: number }
  scrollToItem: (index: number) => void
}
