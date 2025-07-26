import type { PerkTree } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface PerkTreesStore {
  // Data
  data: PerkTree[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => PerkTree | undefined
  search: (query: string) => PerkTree[]
}

export const usePerkTreesStore = create<PerkTreesStore>((set, get) => ({
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
      const response = await fetch(getDataUrl('data/perk-trees.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch perk trees data: ${response.status}`)
      }

      const rawData = await response.json()
      const perkTrees = rawData

      set({
        data: perkTrees,
        loading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load perk trees',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(tree => tree.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      tree =>
        tree.name.toLowerCase().includes(lowerQuery) ||
        tree.description?.toLowerCase().includes(lowerQuery) ||
        tree.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
