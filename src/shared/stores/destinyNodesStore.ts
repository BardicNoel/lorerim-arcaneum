import type { DestinyNode } from '@/shared/data/schemas'
import { getDataUrl } from '@/shared/utils/baseUrl'
import { create } from 'zustand'

interface DestinyNodesStore {
  // Data
  data: DestinyNode[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => DestinyNode | undefined
  search: (query: string) => DestinyNode[]
}

/**
 * Generate tags for destiny nodes based on content analysis
 */
function generateDestinyTags(node: any): string[] {
  const tags: string[] = []

  // Analyze description for keywords
  const description = node.description?.toLowerCase() || ''

  // Combat-related tags
  if (description.includes('damage') || description.includes('weapon')) {
    tags.push('Combat')
  }
  if (description.includes('armor') || description.includes('defense')) {
    tags.push('Defensive')
  }

  // Magic-related tags
  if (
    description.includes('magicka') ||
    description.includes('spell') ||
    description.includes('magic')
  ) {
    tags.push('Magic')
  }

  // Utility tags
  if (
    description.includes('regeneration') ||
    description.includes('health') ||
    description.includes('stamina')
  ) {
    tags.push('Utility')
  }
  if (description.includes('detect') || description.includes('stealth')) {
    tags.push('Stealth')
  }

  // Cost-related tags
  if (description.includes('cost') || description.includes('less')) {
    tags.push('Cost Reduction')
  }

  // Effect-based tags
  if (description.includes('increase') || description.includes('more')) {
    tags.push('Enhancement')
  }
  if (description.includes('resistance')) {
    tags.push('Resistance')
  }

  // Remove duplicates and return
  return [...new Set(tags)]
}

export const useDestinyNodesStore = create<DestinyNodesStore>((set, get) => ({
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
      const response = await fetch(getDataUrl('data/subclasses.json'))
      if (!response.ok) {
        throw new Error(
          `Failed to fetch destiny nodes data: ${response.status}`
        )
      }

      const rawData = await response.json()
      const destinyNodes = rawData.map((node: any, index: number) => ({
        ...node,
        id: node.globalFormId || node.edid || `destiny-${index}`,
        nextBranches: node.nextBranches || [],
        levelRequirement: node.levelRequirement,
        lore: node.lore,
        tags: generateDestinyTags(node),
        // Ensure prerequisites is always an array
        prerequisites: Array.isArray(node.prerequisites)
          ? node.prerequisites
          : [],
      }))

      set({
        data: destinyNodes,
        loading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load destiny nodes',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(node => node.id === id)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      node =>
        node.name.toLowerCase().includes(lowerQuery) ||
        node.description?.toLowerCase().includes(lowerQuery) ||
        node.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  },
}))
