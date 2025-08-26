import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import type { Religion } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'
import { transformBlessingDataArray } from '@/features/religions/adapters/religionDataAdapter'

// Blessing-specific type for the store
export interface BlessingData {
  id: string
  name: string
  type: string
  pantheon: string
  blessingName: string
  blessingDescription: string
  effects: Array<{
    name: string
    description: string
    magnitude: number
    duration: number
    area: number
    effectType: string
    targetAttribute: string | null
    keywords: string[]
  }>
  tags: string[]
  originalReligion: Religion
}

interface BlessingsStore {
  // Data
  data: BlessingData[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => BlessingData | undefined
  search: (query: string) => BlessingData[]
  getByType: (type: string) => BlessingData[]
}

export const useBlessingsStore = create<BlessingsStore>((set, get) => ({
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
        getDataUrl('data/blessing-data.json')
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch blessings data: ${response.status}`)
      }

      const rawData = await response.json()

      // Transform blessing data to BlessingData format
      const transformedReligions = transformBlessingDataArray(rawData)
      
      const blessings: BlessingData[] = transformedReligions
        .filter(religion => religion.blessing?.effects && religion.blessing.effects.length > 0)
        .map(religion => ({
          id: religion.id!,
          name: religion.name,
          type: religion.type!,
          pantheon: religion.pantheon!,
          blessingName: religion.blessing!.spellName,
          blessingDescription: religion.blessing!.effects
            .map(e => e.effectDescription)
            .join(' '),
          effects: religion.blessing!.effects.map(effect => ({
            name: effect.effectName,
            description: effect.effectDescription,
            magnitude: effect.magnitude,
            duration: effect.duration,
            area: effect.area,
            effectType: effect.effectType,
            targetAttribute: effect.targetAttribute,
            keywords: effect.keywords,
          })),
          tags: religion.tags || [],
          originalReligion: religion,
        }))

      set({
        data: blessings,
        loading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load blessings',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(blessing => blessing.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      blessing =>
        blessing.name.toLowerCase().includes(lowerQuery) ||
        blessing.blessingName.toLowerCase().includes(lowerQuery) ||
        blessing.blessingDescription.toLowerCase().includes(lowerQuery) ||
        blessing.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },

  getByType: (type: string) => {
    const state = get()
    return state.data.filter(blessing => blessing.type === type)
  },
}))
