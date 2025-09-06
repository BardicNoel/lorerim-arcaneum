import type { AttributeType } from '@/features/attributes/types'
import { DEFAULT_BUILD, type BuildState } from '@/shared/types/build'
import { create } from 'zustand'
import { validateBuild } from '../utils/validateBuild'

interface CharacterStore {
  build: BuildState
  updateBuild: (updates: Partial<BuildState>) => void
  setBuild: (build: BuildState) => void
  resetBuild: () => void
  // NEW: Attribute assignment methods (simplified - no level tracking)
  setAttributePoints: (attribute: AttributeType, points: number) => void
  clearAllAttributeAssignments: () => void
  updateAttributeLevel: (level: number) => void
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  build: DEFAULT_BUILD,
  updateBuild: updates => {
    set(state => {
      const newBuild = { ...state.build, ...updates }
      // Only validate if there are significant changes (not just name/notes)
      const needsValidation =
        updates.race !== undefined ||
        updates.stone !== undefined ||
        updates.religion !== undefined ||
        updates.favoriteBlessing !== undefined ||
        updates.traits !== undefined ||
        updates.skills !== undefined ||
        updates.destinyPath !== undefined ||
        updates.perks !== undefined ||
        updates.attributeAssignments !== undefined

      return {
        build: needsValidation ? validateBuild(newBuild) : newBuild,
      }
    })
  },
  setBuild: build => set({ build: validateBuild(build) }),
  resetBuild: () => set({ build: DEFAULT_BUILD }),

  // NEW: Attribute assignment methods (simplified - no level tracking)
  setAttributePoints: (attribute: AttributeType, points: number) => {
    set(state => {
      const newBuild = {
        ...state.build,
        attributeAssignments: {
          ...state.build.attributeAssignments,
          [attribute]: Math.max(0, points),
        },
      }
      return { build: validateBuild(newBuild) }
    })
  },

  clearAllAttributeAssignments: () => {
    set(state => {
      const newBuild = {
        ...state.build,
        attributeAssignments: {
          health: 0,
          stamina: 0,
          magicka: 0,
          level: state.build.attributeAssignments.level,
        },
      }
      return { build: validateBuild(newBuild) }
    })
  },

  updateAttributeLevel: (level: number) => {
    set(state => {
      const newBuild = {
        ...state.build,
        attributeAssignments: {
          ...state.build.attributeAssignments,
          level: Math.max(1, level),
        },
      }
      return { build: validateBuild(newBuild) }
    })
  },
}))
