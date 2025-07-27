import Fuse, { type IFuseOptions } from 'fuse.js'
import type {
  SearchableItem,
  SearchFilterOptions,
  SearchFilters,
  SearchResult,
} from './SearchModel'
import {
  createSearchHighlights,
  transformBirthsignsToSearchable,
  transformDestinyNodesToSearchable,
  transformPerkTreesToSearchable,
  transformRacesToSearchable,
  transformReligionsToSearchable,
  transformSkillsToSearchable,
  transformTraitsToSearchable,
} from './SearchUtilities'

export class SearchDataProvider {
  private searchIndex: Fuse<SearchableItem> | null = null
  private isIndexing = false
  private allSearchableItems: SearchableItem[] = []
  private indexedStores = new Set<string>()

  // Configure Fuse.js options for better tag-based searching
  private fuseOptions: IFuseOptions<SearchableItem> = {
    keys: [
      { name: 'name', weight: 0.8 },
      { name: 'description', weight: 0.6 },
      { name: 'category', weight: 0.4 },
      { name: 'tags', weight: 0.5 },
      { name: 'searchableText', weight: 0.3 },
    ],
    threshold: 0.4, // Slightly higher threshold for better precision
    includeMatches: true,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: true,
    findAllMatches: true,
  }

  // Add items to the search index incrementally
  async addToIndex(
    storeName: string,
    searchableItems: SearchableItem[]
  ): Promise<void> {
    if (this.indexedStores.has(storeName)) {
      return
    }

    // Add items to the collection
    this.allSearchableItems.push(...searchableItems)

    // Mark store as indexed
    this.indexedStores.add(storeName)

    // Rebuild the search index with all items
    this.searchIndex = new Fuse(this.allSearchableItems, this.fuseOptions)
  }

  // Check if any data has been indexed
  hasIndexedData(): boolean {
    return this.allSearchableItems.length > 0
  }

  // Transform methods for each store type
  transformSkillsToSearchable = transformSkillsToSearchable
  transformRacesToSearchable = transformRacesToSearchable
  transformTraitsToSearchable = transformTraitsToSearchable
  transformReligionsToSearchable = transformReligionsToSearchable
  transformBirthsignsToSearchable = transformBirthsignsToSearchable
  transformDestinyNodesToSearchable = transformDestinyNodesToSearchable
  transformPerkTreesToSearchable = transformPerkTreesToSearchable

  async buildSearchIndex(): Promise<void> {
    if (this.isIndexing) return
    this.isIndexing = true

    try {
      // Import stores dynamically to avoid circular dependencies
      const { useSkillsStore } = await import('@/shared/stores/skillsStore')
      const { useRacesStore } = await import('@/shared/stores/racesStore')
      const { useTraitsStore } = await import('@/shared/stores/traitsStore')
      const { useReligionsStore } = await import(
        '@/shared/stores/religionsStore'
      )
      const { useBirthsignsStore } = await import(
        '@/shared/stores/birthsignsStore'
      )
      const { useDestinyNodesStore } = await import(
        '@/shared/stores/destinyNodesStore'
      )
      const { usePerkTreesStore } = await import(
        '@/shared/stores/perkTreesStore'
      )

      // Get data from all stores
      const skills = useSkillsStore.getState().data
      const races = useRacesStore.getState().data
      const traits = useTraitsStore.getState().data
      const religions = useReligionsStore.getState().data
      const birthsigns = useBirthsignsStore.getState().data
      const destinyNodes = useDestinyNodesStore.getState().data
      const perkTrees = usePerkTreesStore.getState().data

      // Check if stores have data
      if (
        !skills?.length ||
        !races?.length ||
        !traits?.length ||
        !religions?.length ||
        !birthsigns?.length ||
        !destinyNodes?.length ||
        !perkTrees?.length
      ) {
        console.log('Stores not loaded yet, cannot build search index')
        throw new Error(
          'Store data not available - stores must be loaded before building search index'
        )
      }

      // Transform all data to searchable items
      const searchableItems: SearchableItem[] = [
        ...transformSkillsToSearchable(skills),
        ...transformRacesToSearchable(races),
        ...transformTraitsToSearchable(traits),
        ...transformReligionsToSearchable(religions),
        ...transformBirthsignsToSearchable(birthsigns),
        ...transformDestinyNodesToSearchable(destinyNodes),
        ...transformPerkTreesToSearchable(perkTrees),
      ]

      this.allSearchableItems = searchableItems

      // Create search index
      this.searchIndex = new Fuse(searchableItems, this.fuseOptions)
    } catch (error) {
      console.error('Failed to build search index:', error)
      throw error
    } finally {
      this.isIndexing = false
    }
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    if (!this.searchIndex || !query.trim()) {
      return []
    }

    // Apply filters to searchable items
    let filteredItems = this.allSearchableItems

    if (filters) {
      filteredItems = this.applyFilters(filteredItems, filters)
    }

    // Double-check that searchIndex is still valid
    if (!this.searchIndex) {
      console.warn('Search index not ready, returning empty results')
      return []
    }

    // Create a new Fuse instance with filtered items
    const filteredFuse = new Fuse(filteredItems, this.fuseOptions)

    // Perform search
    const fuseResults = filteredFuse.search(query)

    // Transform Fuse results to SearchResult format
    return fuseResults.map(fuseResult => ({
      item: fuseResult.item,
      score: fuseResult.score || 0,
      matches: [...(fuseResult.matches || [])],
      highlights: createSearchHighlights([...(fuseResult.matches || [])]),
    }))
  }

  private applyFilters(
    items: SearchableItem[],
    filters: SearchFilters
  ): SearchableItem[] {
    return items.filter(item => {
      // Filter by types
      if (filters.types.length > 0 && !filters.types.includes(item.type)) {
        return false
      }

      // Filter by categories
      if (
        filters.categories.length > 0 &&
        item.category &&
        !filters.categories.includes(item.category)
      ) {
        return false
      }

      // Filter by tags - check if any of the filter tags match any of the item's tags
      if (filters.tags.length > 0) {
        const itemTags = item.tags.map(tag => tag.toLowerCase())
        const filterTags = filters.tags.map(tag => tag.toLowerCase())

        // Check if any filter tag matches any item tag
        const hasMatchingTag = filterTags.some(filterTag =>
          itemTags.some(
            itemTag =>
              itemTag.includes(filterTag) || filterTag.includes(itemTag)
          )
        )

        if (!hasMatchingTag) {
          return false
        }
      }

      // Type-specific filters
      if (item.type === 'skill' && filters.skillCategories?.length) {
        if (
          !item.category ||
          !filters.skillCategories.includes(item.category)
        ) {
          return false
        }
      }

      if (item.type === 'race' && filters.raceTypes?.length) {
        if (!item.category || !filters.raceTypes.includes(item.category)) {
          return false
        }
      }

      if (item.type === 'trait' && filters.traitTypes?.length) {
        if (!item.category || !filters.traitTypes.includes(item.category)) {
          return false
        }
      }

      if (item.type === 'religion' && filters.religionTypes?.length) {
        if (!item.category || !filters.religionTypes.includes(item.category)) {
          return false
        }
      }

      if (item.type === 'birthsign' && filters.birthsignGroups?.length) {
        if (
          !item.category ||
          !filters.birthsignGroups.includes(item.category)
        ) {
          return false
        }
      }

      return true
    })
  }

  getAvailableFilters(): SearchFilterOptions {
    const typeCounts = new Map<string, number>()
    const categoryCounts = new Map<string, number>()
    const tagCounts = new Map<string, number>()

    this.allSearchableItems.forEach(item => {
      // Count types
      const typeCount = typeCounts.get(item.type) || 0
      typeCounts.set(item.type, typeCount + 1)

      // Count categories
      if (item.category) {
        const categoryCount = categoryCounts.get(item.category) || 0
        categoryCounts.set(item.category, categoryCount + 1)
      }

      // Count tags
      item.tags.forEach(tag => {
        const tagCount = tagCounts.get(tag) || 0
        tagCounts.set(tag, tagCount + 1)
      })
    })

    return {
      types: Array.from(typeCounts.entries()).map(([value, count]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count,
      })),
      categories: Array.from(categoryCounts.entries()).map(
        ([value, count]) => ({
          value,
          label: value,
          count,
        })
      ),
      tags: Array.from(tagCounts.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
    }
  }

  getSearchableItems(): SearchableItem[] {
    return this.allSearchableItems
  }

  isReady(): boolean {
    return this.searchIndex !== null && !this.isIndexing
  }

  isLoading(): boolean {
    return this.isIndexing
  }
}
