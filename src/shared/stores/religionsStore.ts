import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import type { Religion } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'
import { transformReligionDataArray, transformBlessingDataArray } from '@/features/religions/adapters/religionDataAdapter'

interface ReligionsStore {
  // Data
  data: Religion[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => Religion | undefined
  search: (query: string) => Religion[]
}

export const useReligionsStore = create<ReligionsStore>((set, get) => ({
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
      // Load religion data
      const religionResponse = await fetch(
        getDataUrl('data/religion-data.json')
      )
      if (!religionResponse.ok) {
        throw new Error(`Failed to fetch religions data: ${religionResponse.status}`)
      }

      // Load blessing data
      const blessingResponse = await fetch(
        getDataUrl('data/blessing-data.json')
      )
      if (!blessingResponse.ok) {
        throw new Error(`Failed to fetch blessings data: ${blessingResponse.status}`)
      }

      const religionData = await religionResponse.json()
      const blessingData = await blessingResponse.json()

      const religions = transformReligionDataArray(religionData)
      const blessings = transformBlessingDataArray(blessingData)

      // Merge blessing data into religion data
      const mergedReligions = religions.map(religion => {
        const blessing = blessings.find(b => b.name === religion.name)
        return {
          ...religion,
          blessing: blessing?.blessing,
        }
      })

      set({
        data: mergedReligions,
        loading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load religions',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(religion => 
      religion.id === id || 
      religion.name === id ||
      religion.name.toLowerCase().replace(/\s+/g, '-') === id
    )
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      religion =>
        religion.name.toLowerCase().includes(lowerQuery) ||
        religion.description?.toLowerCase().includes(lowerQuery) ||
        religion.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
