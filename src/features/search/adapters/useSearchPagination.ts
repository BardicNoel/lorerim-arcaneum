import { useState, useCallback, useMemo, useEffect } from 'react'
import type { SearchResult } from '../model/SearchModel'

const ITEMS_PER_PAGE = 50

export function useSearchPagination(searchResults: SearchResult[]) {
  const [displayedItems, setDisplayedItems] = useState<SearchResult[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate how many items should be displayed
  const itemsToShow = currentPage * ITEMS_PER_PAGE

  // Update displayed items when search results or page changes
  useEffect(() => {
    const newDisplayedItems = searchResults.slice(0, itemsToShow)
    setDisplayedItems(newDisplayedItems)
  }, [searchResults, itemsToShow])

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

  // Reset pagination when search results change
  const resetPagination = useCallback(() => {
    setCurrentPage(1)
    setDisplayedItems([])
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
