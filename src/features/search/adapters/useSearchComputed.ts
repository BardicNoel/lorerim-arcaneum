import { useMemo } from 'react'
import type { SearchResult } from '../model/SearchModel'
import { searchResultToPlayerCreationItem } from '../model/SearchUtilities'
import { useSearchFilters } from './useSearchFilters'
import { useSearchState } from './useSearchState'

export function useSearchComputed() {
  const { searchResults, resultCounts } = useSearchFilters()
  const { viewMode } = useSearchState()

  const filteredResults = useMemo(() => {
    return searchResults // Already filtered by useSearchFilters
  }, [searchResults])

  const sortedResults = useMemo(() => {
    return sortResults(filteredResults, 'relevance')
  }, [filteredResults])

  const playerCreationItems = useMemo(() => {
    return sortedResults.map(searchResultToPlayerCreationItem)
  }, [sortedResults])

  const totalResults = useMemo(() => {
    return searchResults.length
  }, [searchResults])

  const resultsByType = useMemo(() => {
    const byType: Record<string, SearchResult[]> = {}
    searchResults.forEach(result => {
      const type = result.item.type
      if (!byType[type]) {
        byType[type] = []
      }
      byType[type].push(result)
    })
    return byType
  }, [searchResults])

  return {
    filteredResults,
    sortedResults,
    playerCreationItems,
    resultCounts,
    totalResults,
    resultsByType,
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
