import type { 
  Enchantment, 
  EnchantmentWithComputed, 
  EnchantmentCategory, 
  EnchantmentFilters, 
  EnchantmentViewState, 
  EnchantmentSearchResult,
  EnchantmentPrimerData 
} from '@/features/enchantments/types'
import { create } from 'zustand'
import { getDataUrl } from '@/shared/utils/baseUrl'

interface EnchantmentsStore {
  // Data
  categories: EnchantmentCategory[]
  data: EnchantmentWithComputed[]

  // Loading states
  loading: boolean
  error: string | null

  // UI state
  viewState: EnchantmentViewState
  filters: EnchantmentFilters

  // Search
  searchResults: EnchantmentSearchResult[]
  searchLoading: boolean

  // Actions
  load: () => Promise<void>
  setViewState: (viewState: Partial<EnchantmentViewState>) => void
  setFilters: (filters: Partial<EnchantmentFilters>) => void
  search: (query: string) => EnchantmentWithComputed[]
  selectEnchantment: (enchantmentId: string | null) => void
  clearSelection: () => void
  clearSearch: () => void

  // Computed
  get selectedEnchantment(): EnchantmentWithComputed | undefined
  getById: (id: string) => EnchantmentWithComputed | undefined
  getByBaseEnchantmentId: (baseEnchantmentId: string) => EnchantmentWithComputed | undefined
  getByCategory: (category: string) => EnchantmentWithComputed[]
  getByTargetType: (targetType: string) => EnchantmentWithComputed[]
  getByPlugin: (plugin: string) => EnchantmentWithComputed[]
}

// Computed properties calculation
const calculateComputedProperties = (
  enchantment: Enchantment,
  category: string
): EnchantmentWithComputed => {
  const hasEffects = enchantment.effects.length > 0
  const effectCount = enchantment.effects.length
  const isWeaponEnchantment = enchantment.targetType === 'touch'
  const isArmorEnchantment = enchantment.targetType === 'self'
  const itemCount = enchantment.foundOnItems.length
  
  // Generate tags
  const tags = [
    enchantment.targetType,
    ...enchantment.effects.map(effect => effect.name.toLowerCase()),
    ...enchantment.foundOnItems.map(item => item.type),
    ...enchantment.plugin.toLowerCase().split(' '),
    category.toLowerCase().split(' ')
  ].filter(Boolean)
  
  // Generate searchable text
  const searchableText = [
    enchantment.name,
    ...enchantment.effects.map(effect => `${effect.name} ${effect.description}`),
    ...enchantment.foundOnItems.map(item => `${item.name} ${item.type}`),
    enchantment.plugin,
    category
  ].join(' ').toLowerCase()
  
  return {
    ...enchantment,
    hasEffects,
    effectCount,
    isWeaponEnchantment,
    isArmorEnchantment,
    itemCount,
    tags: [...new Set(tags)],
    searchableText,
    category
  }
}

export const useEnchantmentsStore = create<EnchantmentsStore>((set, get) => ({
  // Initial state
  categories: [],
  data: [],
  loading: false,
  error: null,
  viewState: {
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    selectedEnchantment: null,
    expandedEnchantments: []
  },
  filters: {
    categories: [],
    targetTypes: [],
    itemTypes: [],
    plugins: [],
    searchTerm: '',
    hasEffects: null,
    hasWornRestrictions: null,
    minItemCount: null,
    maxItemCount: null
  },
  searchResults: [],
  searchLoading: false,

  // Actions
  load: async () => {
    const state = get()

    // Return if already loaded
    if (state.data.length > 0) {
      return
    }

    set({ loading: true, error: null })

    try {
      const response = await fetch(getDataUrl('data/enchantment-primer.json'))
      
      if (!response.ok) {
        throw new Error(`Failed to load enchantments: ${response.statusText}`)
      }
      
      const data: EnchantmentPrimerData = await response.json()
      
      // Flatten enchantments and add computed properties
      const allEnchantmentsWithComputed: EnchantmentWithComputed[] = []
      
      data.categories.forEach(category => {
        category.enchantments.forEach(enchantment => {
          allEnchantmentsWithComputed.push(
            calculateComputedProperties(enchantment, category.name)
          )
        })
      })

      set({
        categories: data.categories,
        data: allEnchantmentsWithComputed,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load enchantments',
        loading: false,
      })
    }
  },

  setViewState: (viewState: Partial<EnchantmentViewState>) => {
    set(state => ({
      viewState: { ...state.viewState, ...viewState }
    }), false, 'setViewState') // Add action name for debugging
  },

  setFilters: (filters: Partial<EnchantmentFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }), false, 'setFilters') // Add action name for debugging
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      enchantment =>
        enchantment.name.toLowerCase().includes(lowerQuery) ||
        enchantment.searchableText.includes(lowerQuery) ||
        enchantment.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        enchantment.effects.some(effect => 
          effect.name.toLowerCase().includes(lowerQuery) ||
          effect.description.toLowerCase().includes(lowerQuery)
        ) ||
        enchantment.foundOnItems.some(item => 
          item.name.toLowerCase().includes(lowerQuery) ||
          item.type.toLowerCase().includes(lowerQuery)
        )
    )
  },

  selectEnchantment: (enchantmentId: string | null) => {
    set(state => ({
      viewState: {
        ...state.viewState,
        selectedEnchantment: enchantmentId
      }
    }), false, 'selectEnchantment')
  },

  clearSelection: () => {
    set(state => ({
      viewState: {
        ...state.viewState,
        selectedEnchantment: null
      }
    }), false, 'clearSelection')
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchLoading: false
    }, false, 'clearSearch')
  },

  // Computed
  get selectedEnchantment() {
    const state = get()
    return state.viewState.selectedEnchantment 
      ? state.data.find(enchantment => enchantment.baseEnchantmentId === state.viewState.selectedEnchantment)
      : undefined
  },

  getById: (id: string) => {
    const state = get()
    return state.data.find(enchantment => enchantment.baseEnchantmentId === id)
  },

  getByBaseEnchantmentId: (baseEnchantmentId: string) => {
    const state = get()
    return state.data.find(enchantment => enchantment.baseEnchantmentId === baseEnchantmentId)
  },

  getByCategory: (category: string) => {
    const state = get()
    return state.data.filter(enchantment => enchantment.category === category)
  },

  getByTargetType: (targetType: string) => {
    const state = get()
    return state.data.filter(enchantment => enchantment.targetType === targetType)
  },

  getByPlugin: (plugin: string) => {
    const state = get()
    return state.data.filter(enchantment => enchantment.plugin === plugin)
  },
}))
