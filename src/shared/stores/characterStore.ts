import { create } from "zustand";
import type { BuildState } from "../types/build";
import { DEFAULT_BUILD } from "../types/build";

export interface CharacterStore {
  build: BuildState;
  setBuild: (build: BuildState) => void;
  updateBuild: (partial: Partial<BuildState>) => void;
  resetBuild: () => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  build: DEFAULT_BUILD,
  setBuild: (build) => set({ build }),
  updateBuild: (partial) =>
    set((state) => ({
      build: { ...state.build, ...partial }
    })),
  resetBuild: () => set({ build: DEFAULT_BUILD })
})); 