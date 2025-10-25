import type { Birthsign } from '@/features/birthsigns/types'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface BirthsignsStore {
  // Data
  data: Birthsign[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => Birthsign | undefined
  search: (query: string) => Birthsign[]
}

export const useBirthsignsStore = create<BirthsignsStore>((set, get) => ({
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
      const response = await fetch(getDataUrl('data/birthsigns.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch birthsigns data: ${response.status}`)
      }

      const rawData = await response.json()

      // Flatten the nested structure - each category has a 'birthsigns' array
      const allBirthsigns = rawData.flatMap(
        (category: any) => category.birthsigns || []
      )

      const birthsigns = allBirthsigns.map((birthsign: any) => ({
        ...birthsign,
        id: birthsign.edid || birthsign.name.toLowerCase().replace(/\s+/g, '-'),
        tags: [
          birthsign.group,
          ...(birthsign.powers?.map((p: any) => p.name) || []),
          ...(birthsign.stat_modifications?.map((s: any) => s.stat) || []),
        ].filter((tag): tag is string => Boolean(tag)),
      })) as Birthsign[]

      set({
        data: birthsigns,
        loading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load birthsigns',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(birthsign => birthsign.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      birthsign =>
        birthsign.name.toLowerCase().includes(lowerQuery) ||
        birthsign.description?.toLowerCase().includes(lowerQuery) ||
        birthsign.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
