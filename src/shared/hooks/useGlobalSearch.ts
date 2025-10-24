import type { SearchOption } from '@/shared/components/playerCreation/types'
import {
  TAG_CATEGORIES,
  useGlobalSearchStore,
} from '@/shared/stores/globalSearchStore'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useGlobalSearch() {
  const navigate = useNavigate()
  const {
    lastSearchQuery,
    setLastSearchQuery,
    clearLastSearchQuery,
    addTag,
    clearAllTags,
  } = useGlobalSearchStore()

  // Navigate to search page and add query as tag
  const navigateToSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return

      setLastSearchQuery(query)

      // Add the query as a search tag
      const searchTag = {
        id: `custom-${query}`,
        label: query,
        value: query,
        category: TAG_CATEGORIES.FUZZY_SEARCH,
      }
      addTag(searchTag)

      // Navigate to search page (no URL params needed)
      navigate('/search')
    },
    [navigate, setLastSearchQuery, addTag]
  )

  // Navigate to search page with type filter
  const navigateToSearchWithType = useCallback(
    (type: string) => {
      setLastSearchQuery(type)

      // Add the type as a type filter
      const typeTag = {
        id: `type-${type}`,
        label: type,
        value: type,
        category: TAG_CATEGORIES.TYPES,
      }
      addTag(typeTag)

      // Navigate to search page (no URL params needed)
      navigate('/search')
    },
    [navigate, setLastSearchQuery, addTag]
  )

  // Handle search selection (from autocomplete or custom input)
  const handleSearchSelect = useCallback(
    (optionOrTag: SearchOption | string) => {
      if (typeof optionOrTag === 'string') {
        // Custom search term
        navigateToSearch(optionOrTag)
      } else {
        // Check if this is a type selection
        if (optionOrTag.id.startsWith('type-')) {
          // It's a type filter
          navigateToSearchWithType(optionOrTag.value)
        } else {
          // It's a regular search term
          navigateToSearch(optionOrTag.value)
        }
      }
    },
    [navigateToSearch, navigateToSearchWithType]
  )

  return {
    lastSearchQuery,
    navigateToSearch,
    navigateToSearchWithType,
    handleSearchSelect,
    clearLastSearchQuery,
  }
}
