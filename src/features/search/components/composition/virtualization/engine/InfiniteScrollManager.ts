import type { InfiniteScrollConfig, LoadingState } from '../types/virtualization'

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

