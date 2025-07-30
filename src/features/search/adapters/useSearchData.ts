import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useReligionsStore } from '@/shared/stores/religionsStore'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import { useSpellsStore } from '@/shared/stores/spellsStore'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import { useCallback, useEffect, useState } from 'react'
import { SearchDataProvider } from '../model/SearchDataProvider'
import type {
  SearchableItem,
  SearchFilters,
  SearchResult,
} from '../model/SearchModel'
import { usePerkReferenceData } from '@/features/perk-references/model/PerkReferenceDataProvider'

// Singleton instance of SearchDataProvider
let searchDataProvider: SearchDataProvider | null = null

export function getSearchDataProvider(): SearchDataProvider {
  if (!searchDataProvider) {
    searchDataProvider = new SearchDataProvider()
  }
  return searchDataProvider
}

export function useSearchData() {
  const [isReady, setIsReady] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Access store data using React hooks
  const skills = useSkillsStore(state => state.data)
  const races = useRacesStore(state => state.data)
  const traits = useTraitsStore(state => state.data)
  const religions = useReligionsStore(state => state.data)
  const birthsigns = useBirthsignsStore(state => state.data)
  const destinyNodes = useDestinyNodesStore(state => state.data)
  const perkTrees = usePerkTreesStore(state => state.data)
  const spells = useSpellsStore(state => state.data)

  // Get perk references data
  const { allPerks: perkReferences } = usePerkReferenceData()

  const provider = getSearchDataProvider()

  // Index individual stores as they become ready
  const indexStore = useCallback(
    async (
      storeName: string,
      data: any[],
      transformer: (data: any[]) => SearchableItem[]
    ) => {
      if (!data?.length) return

      try {
        const searchableItems = transformer(data)
        await provider.addToIndex(storeName, searchableItems)
      } catch (err) {
        console.error(`Failed to index ${storeName}:`, err)
      }
    },
    [provider]
  )

  // Index stores when they have data
  useEffect(() => {
    if (skills?.length) {
      indexStore('skills', skills, provider.transformSkillsToSearchable)
    }
  }, [skills, indexStore])

  useEffect(() => {
    if (races?.length) {
      indexStore('races', races, provider.transformRacesToSearchable)
    }
  }, [races, indexStore])

  useEffect(() => {
    if (traits?.length) {
      indexStore('traits', traits, provider.transformTraitsToSearchable)
    }
  }, [traits, indexStore])

  useEffect(() => {
    if (religions?.length) {
      indexStore(
        'religions',
        religions,
        provider.transformReligionsToSearchable
      )
    }
  }, [religions, indexStore])

  useEffect(() => {
    if (birthsigns?.length) {
      indexStore(
        'birthsigns',
        birthsigns,
        provider.transformBirthsignsToSearchable
      )
    }
  }, [birthsigns, indexStore])

  useEffect(() => {
    if (destinyNodes?.length) {
      indexStore(
        'destinyNodes',
        destinyNodes,
        provider.transformDestinyNodesToSearchable
      )
    }
  }, [destinyNodes, indexStore])

  useEffect(() => {
    if (perkTrees?.length) {
      indexStore(
        'perkTrees',
        perkTrees,
        provider.transformPerkTreesToSearchable
      )
    }
  }, [perkTrees, indexStore])

  // Index perk references when they have data
  useEffect(() => {
    if (perkReferences?.length) {
      indexStore(
        'perk-references',
        perkReferences,
        provider.transformPerkReferencesToSearchable
      )
    }
  }, [perkReferences, indexStore])

  // Index spells when they have data
  useEffect(() => {
    if (spells?.length) {
      indexStore(
        'spells',
        spells,
        provider.transformSpellsToSearchable
      )
    }
  }, [spells, indexStore])

  // Check if we have any data indexed
  useEffect(() => {
    const hasAnyData =
      skills?.length ||
      races?.length ||
      traits?.length ||
      religions?.length ||
      birthsigns?.length ||
      destinyNodes?.length ||
      perkTrees?.length ||
      perkReferences?.length ||
      spells?.length

    if (hasAnyData && provider.hasIndexedData()) {
      setIsReady(true)
    }
  }, [
    skills,
    races,
    traits,
    religions,
    birthsigns,
    destinyNodes,
    perkTrees,
    perkReferences,
    spells,
    provider,
  ])

  const search = useCallback(
    (query: string, filters?: SearchFilters): SearchResult[] => {
      if (!query.trim()) return []

      // Search even if not all stores are ready
      return provider.search(query, filters)
    },
    [provider]
  )

  const getAvailableFilters = useCallback(() => {
    return provider.getAvailableFilters()
  }, [provider])

  const getSearchableItems = useCallback((): SearchableItem[] => {
    return provider.getSearchableItems()
  }, [provider])

  return {
    isReady,
    isIndexing,
    error,
    search,
    getAvailableFilters,
    getSearchableItems,
  }
}
