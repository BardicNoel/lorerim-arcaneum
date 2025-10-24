import type { SearchFilters } from '@/features/search/model/SearchModel'
import type { SelectedTag } from '@/shared/components/playerCreation/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Standardized tag categories
export const TAG_CATEGORIES = {
  FUZZY_SEARCH: 'Fuzzy Search',
  SEARCH_ALL: 'Search All',
  CATEGORIES: 'Categories',
  TAGS: 'Tags',
  TYPES: 'Types',
} as const

export type TagCategory = (typeof TAG_CATEGORIES)[keyof typeof TAG_CATEGORIES]

interface GlobalSearchState {
  // Search filters state
  activeFilters: SearchFilters
  selectedTags: SelectedTag[]
  viewMode: 'list' | 'grid'

  // Last search query for navigation
  lastSearchQuery: string

  // Actions
  setActiveFilters: (filters: SearchFilters) => void
  updateActiveFilters: (filters: Partial<SearchFilters>) => void

  // Tag management
  addTag: (tag: SelectedTag) => void
  removeTag: (tagId: string) => void
  removeTagByValue: (value: string, category?: string) => void
  clearAllTags: () => void
  setTags: (tags: SelectedTag[]) => void
  addTags: (tags: SelectedTag[]) => void

  // View mode
  setViewMode: (mode: 'list' | 'grid') => void

  // Search query management
  setLastSearchQuery: (query: string) => void
  clearLastSearchQuery: () => void

  // Utility methods
  hasTag: (value: string, category?: string) => boolean
  getTagsByCategory: (category: string) => SelectedTag[]
  getFuzzySearchTags: () => SelectedTag[]
  getFilterTags: () => SelectedTag[]

  // Clear all search state
  clearAllSearchState: () => void
}

export const useGlobalSearchStore = create<GlobalSearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeFilters: {
        types: [],
        categories: [],
        tags: [],
      },
      selectedTags: [],
      viewMode: 'grid',
      lastSearchQuery: '',

      // Filter actions
      setActiveFilters: (filters: SearchFilters) => {
        set({ activeFilters: filters })
      },

      updateActiveFilters: (filters: Partial<SearchFilters>) => {
        set(state => ({
          activeFilters: { ...state.activeFilters, ...filters },
        }))
      },

      // Tag management
      addTag: (tag: SelectedTag) => {
        set(state => {
          // Prevent duplicate tags
          const exists = state.selectedTags.some(
            t => t.value === tag.value && t.category === tag.category
          )

          if (exists) return state

          const newTags = [...state.selectedTags, tag]

          // Update activeFilters based on tag category
          let newActiveFilters = { ...state.activeFilters }

          if (tag.category === TAG_CATEGORIES.TYPES) {
            newActiveFilters.types = [
              ...(newActiveFilters.types || []),
              tag.value,
            ]
          } else if (tag.category === TAG_CATEGORIES.CATEGORIES) {
            newActiveFilters.categories = [
              ...(newActiveFilters.categories || []),
              tag.value,
            ]
          } else if (
            tag.category === TAG_CATEGORIES.FUZZY_SEARCH ||
            tag.category === TAG_CATEGORIES.SEARCH_ALL
          ) {
            newActiveFilters.tags = [
              ...(newActiveFilters.tags || []),
              tag.value,
            ]
          }

          return {
            selectedTags: newTags,
            activeFilters: newActiveFilters,
          }
        })
      },

      removeTag: (tagId: string) => {
        set(state => {
          const tagToRemove = state.selectedTags.find(t => t.id === tagId)
          if (!tagToRemove) return state

          const newTags = state.selectedTags.filter(t => t.id !== tagId)

          // Update activeFilters based on removed tag
          let newActiveFilters = { ...state.activeFilters }

          if (tagToRemove.category === TAG_CATEGORIES.TYPES) {
            newActiveFilters.types = (newActiveFilters.types || []).filter(
              t => t !== tagToRemove.value
            )
          } else if (tagToRemove.category === TAG_CATEGORIES.CATEGORIES) {
            newActiveFilters.categories = (
              newActiveFilters.categories || []
            ).filter(c => c !== tagToRemove.value)
          } else if (
            tagToRemove.category === TAG_CATEGORIES.FUZZY_SEARCH ||
            tagToRemove.category === TAG_CATEGORIES.SEARCH_ALL
          ) {
            newActiveFilters.tags = (newActiveFilters.tags || []).filter(
              t => t !== tagToRemove.value
            )
          }

          return {
            selectedTags: newTags,
            activeFilters: newActiveFilters,
          }
        })
      },

      removeTagByValue: (value: string, category?: string) => {
        set(state => {
          const newTags = state.selectedTags.filter(
            t => !(t.value === value && (!category || t.category === category))
          )

          // Update activeFilters
          let newActiveFilters = { ...state.activeFilters }

          if (category === TAG_CATEGORIES.TYPES) {
            newActiveFilters.types = (newActiveFilters.types || []).filter(
              t => t !== value
            )
          } else if (category === TAG_CATEGORIES.CATEGORIES) {
            newActiveFilters.categories = (
              newActiveFilters.categories || []
            ).filter(c => c !== value)
          } else if (
            category === TAG_CATEGORIES.FUZZY_SEARCH ||
            category === TAG_CATEGORIES.SEARCH_ALL
          ) {
            newActiveFilters.tags = (newActiveFilters.tags || []).filter(
              t => t !== value
            )
          }

          return {
            selectedTags: newTags,
            activeFilters: newActiveFilters,
          }
        })
      },

      clearAllTags: () => {
        set({
          selectedTags: [],
          activeFilters: {
            types: [],
            categories: [],
            tags: [],
          },
        })
      },

      setTags: (tags: SelectedTag[]) => {
        set(state => {
          // Update activeFilters based on new tags
          let newActiveFilters = {
            types: [],
            categories: [],
            tags: [],
          }

          tags.forEach(tag => {
            if (tag.category === TAG_CATEGORIES.TYPES) {
              newActiveFilters.types = [
                ...(newActiveFilters.types || []),
                tag.value,
              ]
            } else if (tag.category === TAG_CATEGORIES.CATEGORIES) {
              newActiveFilters.categories = [
                ...(newActiveFilters.categories || []),
                tag.value,
              ]
            } else if (
              tag.category === TAG_CATEGORIES.FUZZY_SEARCH ||
              tag.category === TAG_CATEGORIES.SEARCH_ALL
            ) {
              newActiveFilters.tags = [
                ...(newActiveFilters.tags || []),
                tag.value,
              ]
            }
          })

          return {
            selectedTags: tags,
            activeFilters: newActiveFilters,
          }
        })
      },

      addTags: (tags: SelectedTag[]) => {
        set(state => {
          const existingTags = new Set(
            state.selectedTags.map(t => `${t.value}-${t.category}`)
          )

          const newTags = tags.filter(
            tag => !existingTags.has(`${tag.value}-${tag.category}`)
          )

          if (newTags.length === 0) return state

          const allTags = [...state.selectedTags, ...newTags]

          // Update activeFilters
          let newActiveFilters = { ...state.activeFilters }

          newTags.forEach(tag => {
            if (tag.category === TAG_CATEGORIES.TYPES) {
              newActiveFilters.types = [
                ...(newActiveFilters.types || []),
                tag.value,
              ]
            } else if (tag.category === TAG_CATEGORIES.CATEGORIES) {
              newActiveFilters.categories = [
                ...(newActiveFilters.categories || []),
                tag.value,
              ]
            } else if (
              tag.category === TAG_CATEGORIES.FUZZY_SEARCH ||
              tag.category === TAG_CATEGORIES.SEARCH_ALL
            ) {
              newActiveFilters.tags = [
                ...(newActiveFilters.tags || []),
                tag.value,
              ]
            }
          })

          return {
            selectedTags: allTags,
            activeFilters: newActiveFilters,
          }
        })
      },

      // View mode
      setViewMode: (mode: 'list' | 'grid') => {
        set({ viewMode: mode })
      },

      // Search query management
      setLastSearchQuery: (query: string) => {
        set({ lastSearchQuery: query })
      },

      clearLastSearchQuery: () => {
        set({ lastSearchQuery: '' })
      },

      // Utility methods
      hasTag: (value: string, category?: string) => {
        const state = get()
        return state.selectedTags.some(
          t => t.value === value && (!category || t.category === category)
        )
      },

      getTagsByCategory: (category: string) => {
        const state = get()
        return state.selectedTags.filter(t => t.category === category)
      },

      getFuzzySearchTags: () => {
        const state = get()
        return state.selectedTags.filter(
          t =>
            t.category === TAG_CATEGORIES.FUZZY_SEARCH ||
            t.category === TAG_CATEGORIES.SEARCH_ALL
        )
      },

      getFilterTags: () => {
        const state = get()
        return state.selectedTags.filter(
          t =>
            t.category !== TAG_CATEGORIES.FUZZY_SEARCH &&
            t.category !== TAG_CATEGORIES.SEARCH_ALL
        )
      },

      // Clear all search state
      clearAllSearchState: () => {
        set({
          activeFilters: {
            types: [],
            categories: [],
            tags: [],
          },
          selectedTags: [],
          viewMode: 'grid',
          lastSearchQuery: '',
        })
      },
    }),
    {
      name: 'global-search-storage',
      // Persist all search state
      partialize: state => ({
        activeFilters: state.activeFilters,
        selectedTags: state.selectedTags,
        viewMode: state.viewMode,
        lastSearchQuery: state.lastSearchQuery,
      }),
    }
  )
)
