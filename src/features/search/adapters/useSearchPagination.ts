import { useState, useCallback, useMemo, useEffect } from 'react'
import type { SearchResult } from '../model/SearchModel'

const ITEMS_PER_PAGE = 50

export function useSearchPagination(searchResults: SearchResult[]) {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate displayed items directly from search results and current page
  const displayedItems = useMemo(() => {
    const itemsToShow = currentPage * ITEMS_PER_PAGE
    return searchResults.slice(0, itemsToShow)
  }, [searchResults, currentPage])

  // Reset to page 1 when search results change
  useEffect(() => {
    setCurrentPage(1)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 useSearchPagination - search results changed, resetting to page 1')
      console.log('🔍 useSearchPagination - searchResults:', searchResults.length)
      console.log('🔍 useSearchPagination - displayedItems:', displayedItems.length)
    }
  }, [searchResults])

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return displayedItems.length < searchResults.length
  }, [displayedItems.length, searchResults.length])

  // Load more items
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  // Manual reset function
  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  // Get pagination info
  const paginationInfo = useMemo(() => ({
    displayedItems: displayedItems.length,
    totalItems: searchResults.length,
    hasMore,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  }), [displayedItems.length, searchResults.length, hasMore, currentPage])

  return {
    displayedItems,
    loadMore,
    resetPagination,
    paginationInfo,
    hasMore
  }
}
