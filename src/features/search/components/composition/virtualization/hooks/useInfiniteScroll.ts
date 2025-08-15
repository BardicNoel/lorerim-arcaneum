import { useCallback, useRef, useEffect, useState } from 'react'
import { InfiniteScrollManager } from '../engine/InfiniteScrollManager'
import type { InfiniteScrollConfig, LoadingState } from '../types/virtualization'

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  config: Partial<InfiniteScrollConfig> = {}
) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
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
    const updateLoadingState = () => {
      if (managerRef.current) {
        setLoadingState(managerRef.current.getLoadingState())
      }
    }

    // Update state immediately
    updateLoadingState()

    // Set up interval to check for state changes
    const interval = setInterval(updateLoadingState, 100)
    return () => clearInterval(interval)
  }, [])

  // Manual retry function
  const retry = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.retry()
    }
  }, [])

  // Reset function
  const reset = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.reset()
    }
  }, [])

  return {
    scrollElementRef,
    loadingState,
    retry,
    reset,
    handleScroll
  }
}

