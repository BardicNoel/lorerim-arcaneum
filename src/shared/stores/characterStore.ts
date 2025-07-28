import { DEFAULT_BUILD, type BuildState } from '@/shared/types/build'
import { create } from 'zustand'
import type { AttributeType } from '@/features/attributes/types'

interface CharacterStore {
  build: BuildState
  updateBuild: (updates: Partial<BuildState>) => void
  setBuild: (build: BuildState) => void
  resetBuild: () => void
  // NEW: Attribute assignment methods
  setAttributeAssignment: (level: number, attribute: AttributeType) => void
  clearAttributeAssignment: (level: number) => void
  clearAllAttributeAssignments: () => void
  updateAttributeLevel: (level: number) => void
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  build: DEFAULT_BUILD,
  updateBuild: updates =>
    set(state => ({
      build: { ...state.build, ...updates },
    })),
  setBuild: build => set({ build }),
  resetBuild: () => set({ build: DEFAULT_BUILD }),
  
  // NEW: Attribute assignment methods
  setAttributeAssignment: (level: number, attribute: AttributeType) => {
    set(state => {
      const currentAssignments = { ...state.build.attributeAssignments.assignments }
      const currentTotals = { ...state.build.attributeAssignments }
      
      // Remove previous assignment for this level if it exists
      const previousAssignment = currentAssignments[level]
      if (previousAssignment) {
        currentTotals[previousAssignment] = Math.max(0, currentTotals[previousAssignment] - 1)
      }
      
      // Add new assignment
      currentAssignments[level] = attribute
      currentTotals[attribute] += 1
      
      return {
        build: {
          ...state.build,
          attributeAssignments: {
            ...state.build.attributeAssignments,
            ...currentTotals,
            assignments: currentAssignments,
          },
        },
      }
    })
  },
  
  clearAttributeAssignment: (level: number) => {
    set(state => {
      const currentAssignments = { ...state.build.attributeAssignments.assignments }
      const currentTotals = { ...state.build.attributeAssignments }
      
      const assignment = currentAssignments[level]
      if (assignment) {
        currentTotals[assignment] = Math.max(0, currentTotals[assignment] - 1)
        delete currentAssignments[level]
      }
      
      return {
        build: {
          ...state.build,
          attributeAssignments: {
            ...state.build.attributeAssignments,
            ...currentTotals,
            assignments: currentAssignments,
          },
        },
      }
    })
  },
  
  clearAllAttributeAssignments: () => {
    set(state => ({
      build: {
        ...state.build,
        attributeAssignments: {
          health: 0,
          stamina: 0,
          magicka: 0,
          level: state.build.attributeAssignments.level,
          assignments: {},
        },
      },
    }))
  },
  
  updateAttributeLevel: (level: number) => {
    set(state => ({
      build: {
        ...state.build,
        attributeAssignments: {
          ...state.build.attributeAssignments,
          level: Math.max(1, level),
        },
      },
    }))
  },
}))
