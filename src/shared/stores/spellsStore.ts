import { SpellDataProvider } from '@/features/spells/model/SpellDataProvider'
import type { SpellWithComputed } from '@/features/spells/types'
import { create } from 'zustand'

interface SpellsStore {
  // Data
  data: SpellWithComputed[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => SpellWithComputed | undefined
  getByEditorId: (editorId: string) => SpellWithComputed | undefined
  search: (query: string) => SpellWithComputed[]
  getBySchool: (school: string) => SpellWithComputed[]
  getByLevel: (level: string) => SpellWithComputed[]
}

export const useSpellsStore = create<SpellsStore>((set, get) => ({
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
      const spellDataProvider = SpellDataProvider.getInstance()
      const spells = await spellDataProvider.loadSpells()

      set({
        data: spells,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load spells',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(spell => spell.id === id)
  },

  getByEditorId: (editorId: string) => {
    const state = get()
    return state.data.find(spell => spell.editorId === editorId)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      spell =>
        spell.name.toLowerCase().includes(lowerQuery) ||
        spell.message?.toLowerCase().includes(lowerQuery) ||
        spell.school?.toLowerCase().includes(lowerQuery) ||
        spell.level?.toLowerCase().includes(lowerQuery) ||
        spell.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        spell.effects?.some(
          effect =>
            effect.name.toLowerCase().includes(lowerQuery) ||
            effect.description?.toLowerCase().includes(lowerQuery)
        )
    )
  },

  getBySchool: (school: string) => {
    const state = get()
    return state.data.filter(spell => spell.school === school)
  },

  getByLevel: (level: string) => {
    const state = get()
    return state.data.filter(spell => spell.level === level)
  },
}))
