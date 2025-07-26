import type { Skill } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface SkillsStore {
  // Data
  data: Skill[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => Skill | undefined
  search: (query: string) => Skill[]
}

export const useSkillsStore = create<SkillsStore>((set, get) => ({
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
      const response = await fetch(getDataUrl('data/skills.json'))
      if (!response.ok) {
        throw new Error(`Failed to fetch skills data: ${response.status}`)
      }

      const rawData = await response.json()
      const skills = rawData.skills.map((skill: any) => ({
        ...skill,
        id:
          skill.id ||
          skill.edid ||
          skill.name.toLowerCase().replace(/\s+/g, '-'),
        tags: [...(skill.metaTags || []), skill.category].filter(
          (tag): tag is string => Boolean(tag)
        ),
      }))

      set({
        data: skills,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load skills',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(skill => skill.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      skill =>
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description?.toLowerCase().includes(lowerQuery) ||
        skill.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
