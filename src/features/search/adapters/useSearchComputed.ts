import { useMemo } from 'react'
import type { SearchResult } from '../model/SearchModel'
import { searchResultToPlayerCreationItem } from '../model/SearchUtilities'
import { useSearchFilters } from './useSearchFilters'
import { useSearchState } from '../hooks/useSearchState'
import { useSearchPagination } from './useSearchPagination'

export function useSearchComputed() {
  const { searchResults, resultCounts } = useSearchFilters()
  const { viewMode } = useSearchState()
  
  // Debug logging for search results
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useSearchComputed - searchResults:', searchResults.length)
    console.log('🔍 useSearchComputed - searchResults sample:', searchResults.slice(0, 3))
  }
  
  // Add pagination
  const { 
    displayedItems, 
    loadMore, 
    resetPagination, 
    paginationInfo, 
    hasMore 
  } = useSearchPagination(searchResults)

  // Debug logging for displayedItems
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useSearchComputed - displayedItems:', displayedItems.length)
  }

  const filteredResults = useMemo(() => {
    return displayedItems // Use paginated results instead of all results
  }, [displayedItems])

  const sortedResults = useMemo(() => {
    return sortResults(filteredResults, 'relevance')
  }, [filteredResults])

  const playerCreationItems = useMemo(() => {
    const items = sortedResults.map(searchResultToPlayerCreationItem)
    
    // Debug logging for playerCreationItems
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 useSearchComputed - playerCreationItems:', items.length)
      console.log('🔍 useSearchComputed - playerCreationItems sample:', items.slice(0, 2))
    }
    
    return items
  }, [sortedResults])

  const totalResults = useMemo(() => {
    return searchResults.length // Keep total count for display
  }, [searchResults])

  const resultsByType = useMemo(() => {
    const byType: Record<string, SearchResult[]> = {}
    displayedItems.forEach(result => { // Use paginated results for type grouping
      const type = result.item.type
      if (!byType[type]) {
        byType[type] = []
      }
      byType[type].push(result)
    })
    return byType
  }, [displayedItems])

  return {
    filteredResults,
    sortedResults,
    playerCreationItems,
    resultCounts,
    totalResults,
    resultsByType,
    // Add pagination methods and info
    loadMore,
    resetPagination,
    paginationInfo,
    hasMore
  }
}

function sortResults(
  results: SearchResult[],
  sortBy: 'relevance' | 'name' | 'type'
): SearchResult[] {
  const sorted = [...results]

  switch (sortBy) {
    case 'relevance':
      // Fuse.js already sorts by relevance, so we just return as is
      return sorted
    case 'name':
      return sorted.sort((a, b) => a.item.name.localeCompare(b.item.name))
    case 'type':
      return sorted.sort((a, b) => {
        const typeComparison = a.item.type.localeCompare(b.item.type)
        if (typeComparison !== 0) return typeComparison
        return a.item.name.localeCompare(b.item.name)
      })
    default:
      return sorted
  }
}
