import type { Trait } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface TraitsStore {
  // Data
  data: Trait[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => Trait | undefined
  search: (query: string) => Trait[]
}

export const useTraitsStore = create<TraitsStore>((set, get) => ({
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
      const response = await fetch(getDataUrl('data/traits.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch traits data: ${response.status}`)
      }

      const rawData = await response.json()
      const traits = rawData.traits.map((trait: any) => ({
        ...trait,
        id: trait.id || trait.edid || trait.name,
        tags: [
          trait.category,
          ...(trait.tags || []),
          ...(trait.effects?.map((e: any) => e.type) || []),
        ].filter((tag): tag is string => Boolean(tag)),
      }))

      set({
        data: traits,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load traits',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(trait => trait.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      trait =>
        trait.name.toLowerCase().includes(lowerQuery) ||
        trait.description?.toLowerCase().includes(lowerQuery) ||
        trait.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
