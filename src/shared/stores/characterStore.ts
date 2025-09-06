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
    console.log('📥 [Character Store] Received build updates:', updates)
    if (updates.destinyPath) {
      console.log(
        '🎯 [Character Store] Destiny path update detected:',
        updates.destinyPath
      )
    }
    set(state => {
      console.log(
        '🔄 [Character Store] Current state before update:',
        state.build
      )
      const newBuild = { ...state.build, ...updates }
      console.log('📊 [Character Store] Previous build state:', state.build)
      console.log('📊 [Character Store] New build state:', newBuild)
      if (newBuild.destinyPath) {
        console.log(
          '🎯 [Character Store] New destiny path in build:',
          newBuild.destinyPath
        )
      }
      // Validate the final build state to ensure data integrity
      const validatedBuild = validateBuild(newBuild)
      console.log('🔄 [Character Store] About to return validated state:', {
        build: validatedBuild,
      })
      return { build: validatedBuild }
    })
    console.log('✅ [Character Store] Build state updated successfully')
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
