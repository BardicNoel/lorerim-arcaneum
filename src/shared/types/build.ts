export interface BuildState {
  v: number // Schema version
  name: string // Character name
  notes: string // RP flavor text
  race: string | null // EDID
  stone: string | null // EDID
  religion: string | null // EDID
  traits: {
    regular: string[] // Array of EDIDs
    bonus: string[] // Array of EDIDs (requires game completion)
  }
  traitLimits: {
    regular: number // Maximum number of regular traits (default: 2)
    bonus: number // Maximum number of bonus traits (default: 1)
  }
  skills: {
    major: string[] // Array of EDIDs
    minor: string[] // Array of EDIDs
  }
  equipment: string[] // Array of EDIDs
  userProgress: {
    unlocks: string[] // Array of unlock IDs
  }
  destinyPath: string[] // Ordered array of DestinyNode ids or names, from root to leaf
}

export const DEFAULT_BUILD: BuildState = {
  v: 1,
  name: '',
  notes: '',
  race: null,
  stone: null,
  religion: null,
  traits: {
    regular: [],
    bonus: [],
  },
  traitLimits: {
    regular: 2,
    bonus: 1,
  },
  skills: {
    major: [],
    minor: [],
  },
  equipment: [],
  userProgress: {
    unlocks: [],
  },
  destinyPath: [], // No destiny path selected by default
}
