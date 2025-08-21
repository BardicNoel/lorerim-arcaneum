import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import type { Religion } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

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
        getDataUrl('data/wintersun-religion-docs.json')
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch religions data: ${response.status}`)
      }

      const rawData = await response.json()
      
      // Transform and filter for blessings only
      const blessings: BlessingData[] = rawData.flatMap((pantheon: any) =>
        pantheon.deities
          .map((deity: any) => {
            // Check if this deity has valid blessing effects
            if (!deity.blessing?.effects || deity.blessing.effects.length === 0) {
              return null
            }

            // Filter out UI effects (type "1" and "3")
            const validEffects = deity.blessing.effects.filter(
              (effect: any) => effect.effectType !== '1' && effect.effectType !== '3'
            )

            // Only include if there are valid gameplay effects
            if (validEffects.length === 0) {
              return null
            }

            return {
              id: deity.id || deity.name,
              name: deity.name,
              type: deity.type || pantheon.type,
              pantheon: pantheon.type,
              blessingName: deity.blessing.spellName || `Blessing of ${deity.name}`,
              blessingDescription: validEffects.map((e: any) => e.effectDescription).join(' '),
              effects: validEffects.map((effect: any) => ({
                name: effect.effectName,
                description: effect.effectDescription,
                magnitude: effect.magnitude,
                duration: effect.duration,
                area: effect.area,
                effectType: effect.effectType,
                targetAttribute: effect.targetAttribute,
                keywords: effect.keywords || [],
              })),
              tags: [
                pantheon.type,
                ...(shouldShowFavoredRaces() ? deity.favoredRaces || [] : []),
                ...(deity.tags || []),
              ].filter(Boolean),
              originalReligion: {
                ...deity,
                id: deity.id || deity.name,
                pantheon: pantheon.type,
                type: deity.type || pantheon.type,
                tags: [
                  pantheon.type,
                  ...(shouldShowFavoredRaces() ? deity.favoredRaces || [] : []),
                  ...(deity.tags || []),
                ].filter(Boolean),
              },
            }
          })
          .filter(Boolean) // Remove null entries
      )

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
