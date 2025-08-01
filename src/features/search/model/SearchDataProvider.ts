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
  transformPerkReferencesToSearchable,
  transformPerkTreesToSearchable,
  transformRacesToSearchable,
  transformRecipesToSearchable,
  transformReligionsToSearchable,
  transformSkillsToSearchable,
  transformSpellsToSearchable,
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
    threshold: 0.6, // More permissive threshold for better recall
    includeMatches: true,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: false, // Disable extended search for simple text matching
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

  // Force rebuild the search index with current options
  rebuildSearchIndex(): void {
    if (this.allSearchableItems.length > 0) {
      this.searchIndex = new Fuse(this.allSearchableItems, this.fuseOptions)
    }
  }

  // Transform methods for each store type
  transformSkillsToSearchable = transformSkillsToSearchable
  transformRacesToSearchable = transformRacesToSearchable
  transformTraitsToSearchable = transformTraitsToSearchable
  transformReligionsToSearchable = transformReligionsToSearchable
  transformBirthsignsToSearchable = transformBirthsignsToSearchable
  transformDestinyNodesToSearchable = transformDestinyNodesToSearchable
  transformPerkTreesToSearchable = transformPerkTreesToSearchable
  transformPerkReferencesToSearchable = transformPerkReferencesToSearchable
  transformRecipesToSearchable = transformRecipesToSearchable
  transformSpellsToSearchable = transformSpellsToSearchable

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
      const { useRecipesStore } = await import(
        '@/shared/stores/recipesStore'
      )

      // Import spell data provider
      const { SpellDataProvider } = await import('@/features/spells/model/SpellDataProvider')

      // Get data from all stores
      const skills = useSkillsStore.getState().data
      const races = useRacesStore.getState().data
      const traits = useTraitsStore.getState().data
      const religions = useReligionsStore.getState().data
      const birthsigns = useBirthsignsStore.getState().data
      const destinyNodes = useDestinyNodesStore.getState().data
      const perkTrees = usePerkTreesStore.getState().data
      const recipes = useRecipesStore.getState().data

      // Get spell data
      const spellDataProvider = SpellDataProvider.getInstance()
      const spells = await spellDataProvider.loadSpells()

      // Check if stores have data
      if (
        !skills?.length ||
        !races?.length ||
        !traits?.length ||
        !religions?.length ||
        !birthsigns?.length ||
        !destinyNodes?.length ||
        !perkTrees?.length ||
        !recipes?.length ||
        !spells?.length
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
        ...transformRecipesToSearchable(recipes),
        ...transformSpellsToSearchable(spells),
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

  // Add perk references to the search index
  async addPerkReferencesToIndex(perkReferences: any[]): Promise<void> {
    if (this.indexedStores.has('perk-references')) {
      return
    }

    // Transform perk references to searchable items
    const searchablePerkReferences =
      transformPerkReferencesToSearchable(perkReferences)

    // Add items to the collection
    this.allSearchableItems.push(...searchablePerkReferences)

    // Mark store as indexed
    this.indexedStores.add('perk-references')

    // Rebuild the search index with all items
    this.searchIndex = new Fuse(this.allSearchableItems, this.fuseOptions)
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    if (!this.searchIndex) {
      return []
    }

    // If query is empty or just a wildcard, return filtered items without text search
    if (!query.trim() || query.trim() === '*') {
      let filteredItems = this.allSearchableItems

      if (filters) {
        filteredItems = this.applyFilters(filteredItems, filters)
      }

      return filteredItems.map(item => ({
        item,
        score: 1, // Perfect score for filtered results
        matches: [],
        highlights: [],
      }))
    }

    // Double-check that searchIndex is still valid
    if (!this.searchIndex) {
      console.warn('Search index not ready, returning empty results')
      return []
    }

    // Perform search on all items first
    const fuseResults = this.searchIndex.search(query)

    // Apply filters to search results
    let filteredResults = fuseResults

    if (filters) {
      filteredResults = fuseResults.filter(fuseResult => {
        const item = fuseResult.item
        return this.applyFilters([item], filters).length > 0
      })
    }

    // Transform Fuse results to SearchResult format
    const results = filteredResults.map(fuseResult => ({
      item: fuseResult.item,
      score: fuseResult.score || 0,
      matches: [...(fuseResult.matches || [])],
      highlights: createSearchHighlights([...(fuseResult.matches || [])]),
    }))

    return results
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

      if (item.type === 'spell' && filters.spellSchools?.length) {
        if (!item.category || !filters.spellSchools.includes(item.category)) {
          return false
        }
      }

      if (item.type === 'spell' && filters.spellLevels?.length) {
        const spellData = item.originalData
        if (!spellData.level || !filters.spellLevels.includes(spellData.level)) {
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
