// Compact perk format for reduced build link size
export interface CompactPerks {
  [skillCode: string]: number[] // skillCode -> array of perk indexes
}

// Compressed perk format using skill indexes
export interface CompressedPerks {
  [skillIndex: number]: number[] // skillIndex -> array of perk indexes
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
    health: number // Total health increases
    stamina: number // Total stamina increases
    magicka: number // Total magicka increases
    level: number // Current character level
    // Removed: assignments: Record<number, 'health' | 'stamina' | 'magicka'> // Level -> attribute mapping
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

// Compressed build state (newest format with compressed property names and skill indexing)
export interface CompressedBuildState {
  v: number // Schema version
  n: string // Character name (compressed from 'name')
  o: string // RP flavor text (compressed from 'notes')
  r: string | null // EDID (compressed from 'race')
  s: string | null // EDID (compressed from 'stone')
  g: string | null // EDID of followed deity (compressed from 'religion')
  f: string | null // EDID of favorite blessing source (compressed from 'favoriteBlessing')
  t: {
    r: string[] // Array of EDIDs (compressed from 'regular')
    b: string[] // Array of EDIDs (compressed from 'bonus')
  }
  l?: [number, number] // Optional trait limits as tuple [regular, bonus] (compressed from 'traitLimits')
  k: {
    ma: number[] // Array of skill indexes (compressed from 'major')
    mi: number[] // Array of skill indexes (compressed from 'minor')
  }
  sl: Record<number, number> // skillIndex -> minimum required level (compressed from 'skillLevels')
  e: string[] // Array of EDIDs (compressed from 'equipment')
  d: string[] // Ordered array of DestinyNode ids (compressed from 'destinyPath')
  a: {
    h: number // Total health increases (compressed from 'health')
    st: number // Total stamina increases (compressed from 'stamina')
    m: number // Total magicka increases (compressed from 'magicka')
    l: number // Current character level (compressed from 'level')
    // Removed: as: Record<number, 'health' | 'stamina' | 'magicka'> // Level -> attribute mapping (compressed from 'assignments')
  }
  p: CompressedPerks // Compressed perks using skill indexes
}

// Union type for build state (supports all formats)
export type BuildState =
  | LegacyBuildState
  | CompactBuildState
  | CompressedBuildState

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
    // Removed: assignments: {},
  },
}

// Default compressed build state (newest format)
export const DEFAULT_COMPRESSED_BUILD: CompressedBuildState = {
  v: 2,
  n: '', // name
  o: '', // notes
  r: null, // race
  s: null, // stone
  g: null, // religion
  f: null, // favoriteBlessing
  t: {
    r: [], // regular traits
    b: [], // bonus traits
  },
  // l omitted - using default values [2, 1]
  k: {
    ma: [], // major skills (as indexes)
    mi: [], // minor skills (as indexes)
  },
  sl: {}, // skill levels (as indexes)
  e: [], // equipment
  d: [], // destiny path
  a: {
    h: 0, // health
    st: 0, // stamina
    m: 0, // magicka
    l: 1, // level
    // Removed: as: {}, // assignments
  },
  p: {}, // compressed perks
}

// Type guards for build format detection
export function isLegacyBuildState(
  build: BuildState
): build is LegacyBuildState {
  return 'perks' in build && !('p' in build)
}

export function isCompactBuildState(
  build: BuildState
): build is CompactBuildState {
  return 'p' in build && !('n' in build) && !('k' in build)
}

export function isCompressedBuildState(
  build: BuildState
): build is CompressedBuildState {
  return 'n' in build && 'k' in build && 'a' in build
}

// Utility function to get the build format version
export function getBuildFormat(
  build: BuildState
): 'legacy' | 'compact' | 'compressed' {
  if (isCompressedBuildState(build)) return 'compressed'
  if (isCompactBuildState(build)) return 'compact'
  return 'legacy'
}
