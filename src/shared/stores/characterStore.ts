import { DEFAULT_BUILD, type BuildState } from '@/shared/types/build'
import { create } from 'zustand'

interface CharacterStore {
  build: BuildState
  updateBuild: (updates: Partial<BuildState>) => void
  setBuild: (build: BuildState) => void
  resetBuild: () => void
}

export const useCharacterStore = create<CharacterStore>(set => ({
  build: DEFAULT_BUILD,
  updateBuild: updates =>
    set(state => ({
      build: { ...state.build, ...updates },
    })),
  setBuild: build => set({ build }),
  resetBuild: () => set({ build: DEFAULT_BUILD }),
}))
