import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import type { Religion } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

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
      const response = await fetch(
        getDataUrl('data/wintersun-religion-docs.json')
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch religions data: ${response.status}`)
      }

      const rawData = await response.json()
      const religions = rawData.flatMap((pantheon: any) =>
        pantheon.deities.map((deity: any) => ({
          ...deity, // Preserve all original deity fields
          id: deity.id || deity.name,
          pantheon: pantheon.type, // Add pantheon info
          type: deity.type || pantheon.type, // Ensure type field exists
          tags: [
            pantheon.type,
            ...(shouldShowFavoredRaces() ? deity.favoredRaces || [] : []),
            ...(deity.tags || []),
          ].filter(Boolean),
        }))
      )

      set({
        data: religions,
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
    return state.data.find(religion => religion.id === id)
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
