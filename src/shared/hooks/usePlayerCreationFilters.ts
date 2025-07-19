import { useState, useEffect } from 'react'
import type {
  PlayerCreationFilters,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'

interface UsePlayerCreationFiltersProps {
  initialFilters?: PlayerCreationFilters
  onFiltersChange?: (filters: PlayerCreationFilters) => void
  onSearch?: (query: string) => void
  onTagSelect?: (tag: SelectedTag) => void
  onTagRemove?: (tagId: string) => void
}

export function usePlayerCreationFilters({
  initialFilters,
  onFiltersChange,
  onSearch,
  onTagSelect,
  onTagRemove,
}: UsePlayerCreationFiltersProps = {}) {
  const [localFilters, setLocalFilters] = useState<PlayerCreationFilters>(
    initialFilters || {
      search: '',
      selectedFilters: {},
      selectedTags: [],
    }
  )

  // Sync with external filters if provided
  useEffect(() => {
    if (initialFilters) {
      setLocalFilters(initialFilters)
    }
  }, [initialFilters])

  const handleSearch = (query: string) => {
    const updatedFilters = { ...localFilters, search: query }
    setLocalFilters(updatedFilters)
    onSearch?.(query)
  }

  const handleTagSelect = (option: SearchOption) => {
    const newTag: SelectedTag = {
      id: `${option.category}-${option.id}`,
      label: option.label,
      value: option.value,
      category: option.category,
    }

    // Check if tag already exists
    const tagExists = localFilters.selectedTags.some(
      tag => tag.id === newTag.id
    )
    if (!tagExists) {
      const updatedFilters = {
        ...localFilters,
        selectedTags: [...localFilters.selectedTags, newTag],
      }
      setLocalFilters(updatedFilters)
      onTagSelect?.(newTag)
      onFiltersChange?.(updatedFilters)
    }
  }

  const handleTagRemove = (tagId: string) => {
    const updatedFilters = {
      ...localFilters,
      selectedTags: localFilters.selectedTags.filter(tag => tag.id !== tagId),
    }
    setLocalFilters(updatedFilters)
    onTagRemove?.(tagId)
    onFiltersChange?.(updatedFilters)
  }

  const updateFilters = (filters: PlayerCreationFilters) => {
    setLocalFilters(filters)
    onFiltersChange?.(filters)
  }

  return {
    filters: localFilters,
    handleSearch,
    handleTagSelect,
    handleTagRemove,
    updateFilters,
  }
}
