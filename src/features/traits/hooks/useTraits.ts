import { useTraitsStore } from '@/shared/stores/traitsStore'
import { useMemo, useState } from 'react'
import type { TraitFilters } from '../types'
import {
  getAllCategories,
  getAllEffectTypes,
  getAllTags,
} from '../utils/dataTransform'

export function useTraits() {
  const [filters, setFilters] = useState<TraitFilters>({
    search: '',
    category: '',
    tags: [],
  })

  // Use the centralized traits store
  const { data: traits, loading, error } = useTraitsStore()

  // Filter traits based on current filters
  const filteredTraits = useMemo(() => {
    return traits.filter(trait => {
      // Search filter - search across all relevant fields
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchableText = [
          trait.name,
          trait.description,
          trait.category,
          ...(trait.tags || []),
          ...(trait.effects?.map(effect => effect.type) || []),
        ]
          .join(' ')
          .toLowerCase()

        if (!searchableText.includes(searchLower)) return false
      }

      // Category filter
      if (filters.category && trait.category !== filters.category) return false

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => {
          return (
            trait.tags?.includes(tag) ||
            trait.category === tag ||
            trait.effects?.some(effect => effect.type === tag)
          )
        })

        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [traits, filters])

  // Get all available categories, effect types, and tags for filtering
  const allCategories = useMemo(() => getAllCategories(traits), [traits])
  const allEffectTypes = useMemo(() => getAllEffectTypes(traits), [traits])
  const allTags = useMemo(() => getAllTags(traits), [traits])

  return {
    traits: filteredTraits,
    allTraits: traits,
    loading,
    error,
    filters,
    setFilters,
    allCategories,
    allEffectTypes,
    allTags,
  }
}
