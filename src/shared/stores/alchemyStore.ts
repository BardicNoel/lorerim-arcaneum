import { AlchemyDataProvider } from '@/features/alchemy/model/AlchemyDataProvider'
import { AlchemyIngredientModel } from '@/features/alchemy/model/AlchemyIngredientModel'
import type {
  AlchemyFilters,
  AlchemyIngredientWithComputed,
  AlchemyMetaAnalysis,
  AlchemyStatistics,
} from '@/features/alchemy/types'
import { create } from 'zustand'

interface AlchemyState {
  // Data
  data: AlchemyIngredientWithComputed[]
  statistics: AlchemyStatistics | null
  metaAnalysis: AlchemyMetaAnalysis | null

  // State
  loading: boolean
  error: string | null

  // Filters
  filters: AlchemyFilters
  filteredData: AlchemyIngredientWithComputed[]

  // Actions
  load: () => Promise<void>
  setFilters: (filters: Partial<AlchemyFilters>) => void
  clearFilters: () => void
  applyFilters: () => void

  // Utilities
  getByName: (name: string) => AlchemyIngredientWithComputed | undefined
  getByEffectType: (effectType: string) => AlchemyIngredientWithComputed[]
  getBySkill: (skill: string) => AlchemyIngredientWithComputed[]
  getByPlugin: (plugin: string) => AlchemyIngredientWithComputed[]
  getByRarity: (rarity: string) => AlchemyIngredientWithComputed[]
  getByEffect: (effect: string) => AlchemyIngredientWithComputed[]
  search: (query: string) => AlchemyIngredientWithComputed[]

  // Statistics
  getStatistics: () => AlchemyStatistics | null
  getMetaAnalysis: () => AlchemyMetaAnalysis | null
}

const defaultFilters: AlchemyFilters = {
  effectTypes: [],
  effects: [],
  skills: [],
  plugins: [],
  flags: [],
  searchTerm: '',
  hasEffects: null,
  isComplex: null,
  minValue: null,
  maxValue: null,
  minWeight: null,
  maxWeight: null,
  minMagnitude: null,
  maxMagnitude: null,
  minDuration: null,
  maxDuration: null,
  minBaseCost: null,
  maxBaseCost: null,
  rarities: [],
}

export const useAlchemyStore = create<AlchemyState>((set, get) => ({
  // Initial state
  data: [],
  statistics: null,
  metaAnalysis: null,
  loading: false,
  error: null,
  filters: defaultFilters,
  filteredData: [],

  // Actions
  load: async () => {
    set({ loading: true, error: null })

    try {
      const provider = AlchemyDataProvider.getInstance()
      const ingredients = await provider.loadIngredients()
      const statistics = await provider.getStatistics()
      const metaAnalysis = await provider.getMetaAnalysis()

      set({
        data: ingredients,
        statistics,
        metaAnalysis,
        loading: false,
      })

      // Apply current filters to the new data
      get().applyFilters()
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load alchemy ingredients',
        loading: false,
      })
    }
  },

  setFilters: newFilters => {
    const currentFilters = get().filters
    const updatedFilters = { ...currentFilters, ...newFilters }
    set({ filters: updatedFilters })
    get().applyFilters()
  },

  clearFilters: () => {
    set({ filters: defaultFilters })
    get().applyFilters()
  },

  applyFilters: () => {
    const { data, filters } = get()
    const filtered = AlchemyIngredientModel.applyFilters(data, filters)
    set({ filteredData: filtered })
  },

  // Utilities
  getByName: (name: string) => {
    return get().data.find(ingredient => ingredient.name === name)
  },

  getByEffectType: (effectType: string) => {
    return AlchemyIngredientModel.filterByEffectType(get().data, effectType)
  },

  getBySkill: (skill: string) => {
    return AlchemyIngredientModel.filterBySkill(get().data, skill)
  },

  getByPlugin: (plugin: string) => {
    return AlchemyIngredientModel.filterByPlugin(get().data, plugin)
  },

  getByRarity: (rarity: string) => {
    return AlchemyIngredientModel.filterByRarity(get().data, rarity)
  },

  getByEffect: (effect: string) => {
    return AlchemyIngredientModel.filterByEffects(get().data, [effect])
  },

  search: (query: string) => {
    const searchResults = AlchemyIngredientModel.search(get().data, query)
    return searchResults.map(result => result.ingredient)
  },

  // Statistics
  getStatistics: () => {
    return get().statistics
  },

  getMetaAnalysis: () => {
    return get().metaAnalysis
  },
}))
