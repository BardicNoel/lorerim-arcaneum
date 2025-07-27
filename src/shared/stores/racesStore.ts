import type { Race } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface RacesStore {
  // Data
  data: Race[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => Race | undefined
  search: (query: string) => Race[]
}

export const useRacesStore = create<RacesStore>((set, get) => ({
  // Initial state
  data: [],
  loading: false,
  error: null,

  // Actions
  load: async () => {
    const state = get()

    // Return if already loaded
    if (state.data.length > 0) {
      return
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(getDataUrl('data/playable-races.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch races data: ${response.status}`)
      }

      const rawData = await response.json()
      const races = rawData.races.map((race: any) => ({
        ...race,
        id:
          race.id || race.edid || race.name.toLowerCase().replace(/\s+/g, '-'),
        tags: [race.category, ...(race.keywords || [])].filter(
          (tag): tag is string => Boolean(tag)
        ),
        // Ensure all fields are properly mapped
        name: race.name,
        edid: race.edid,
        description: race.description,
        category: race.category,
        source: race.source,
        startingStats: race.startingStats,
        physicalAttributes: race.physicalAttributes,
        skillBonuses: race.skillBonuses,
        racialSpells: race.racialSpells,
        keywords: race.keywords,
        flags: race.flags,
        regeneration: race.regeneration,
        combat: race.combat,
      }))

      set({
        data: races,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load races',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(race => race.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      race =>
        race.name.toLowerCase().includes(lowerQuery) ||
        race.description?.toLowerCase().includes(lowerQuery) ||
        race.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
