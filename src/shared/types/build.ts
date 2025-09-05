// Compact perk format for reduced build link size
export interface CompactPerks {
  [skillCode: string]: number[] // skillCode -> array of perk indexes
}

// Legacy perk format (backwards compatibility)
export interface LegacyPerks {
  selected: Record<string, string[]> // skillId -> array of perk EDIDs
  ranks: Record<string, number> // perkId -> current rank
}

// Base build state without perks (used for both formats)
export interface BaseBuildState {
  v: number // Schema version
  name: string // Character name
  notes: string // RP flavor text
  race: string | null // EDID
  stone: string | null // EDID
  religion: string | null // EDID of followed deity
  favoriteBlessing: string | null // EDID of favorite blessing source (can be different from religion)
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
  skillLevels: Record<string, number> // skillId -> minimum required level based on selected perks
  equipment: string[] // Array of EDIDs
  userProgress: {
    unlocks: string[] // Array of unlock IDs
  }
  destinyPath: string[] // Ordered array of DestinyNode ids or names, from root to leaf
  // NEW: Attribute assignments
  attributeAssignments: {
    health: number    // Total health increases
    stamina: number   // Total stamina increases
    magicka: number   // Total magicka increases
    level: number     // Current character level
    assignments: Record<number, 'health' | 'stamina' | 'magicka'> // Level -> attribute mapping
  }
}

// Legacy build state (backwards compatibility)
export interface LegacyBuildState extends BaseBuildState {
  perks: LegacyPerks
}

// Compact build state (new format)
export interface CompactBuildState extends BaseBuildState {
  p: CompactPerks // Compact perks using indexes
}

// Union type for build state (supports both formats)
export type BuildState = LegacyBuildState | CompactBuildState

export const DEFAULT_BUILD: LegacyBuildState = {
  v: 2,
  name: '',
  notes: '',
  race: null,
  stone: null,
  religion: null,
  favoriteBlessing: null,
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
  perks: {
    selected: {},
    ranks: {},
  },
  skillLevels: {},
  equipment: [],
  userProgress: {
    unlocks: [],
  },
  destinyPath: [], // No destiny path selected by default
  // NEW: Default attribute assignments
  attributeAssignments: {
    health: 0,
    stamina: 0,
    magicka: 0,
    level: 1,
    assignments: {},
  },
}
