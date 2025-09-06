/**
 * V2 Build Types with Skill Indexing and Compressed Property Names
 * 
 * This file defines the new v2 build format that includes:
 * 1. Skill indexing system (numeric indexes instead of string EDIDs)
 * 2. Compressed property names (single/two letter mappings)
 * 3. Conditional traitLimits (only included if different from defaults)
 * 4. Removed userProgress field
 */

import type { SkillIndex } from '../data/skillIndex'

// V2 Compact perks using skill indexes
export interface V2CompactPerks {
  [skillIndex: SkillIndex]: number[] // skillIndex -> array of perk indexes
}

// V2 Base build state with compressed property names and skill indexing
export interface V2BaseBuildState {
  v: 2 // Schema version (always 2 for this format)
  n: string // Character name (compressed from 'name')
  o: string // RP flavor text (compressed from 'notes')
  r: string | null // Race EDID (compressed from 'race')
  s: string | null // Stone/birthsign EDID (compressed from 'stone')
  g: string | null // Religion EDID (compressed from 'religion')
  f: string | null // Favorite blessing EDID (compressed from 'favoriteBlessing')
  t: {
    r: string[] // Regular traits (compressed from 'traits.regular')
    b: string[] // Bonus traits (compressed from 'traits.bonus')
  }
  l?: [number, number] // Trait limits as tuple [regular, bonus] (compressed from 'traitLimits', optional if default [2,1])
  k: {
    ma: SkillIndex[] // Major skills as indexes (compressed from 'skills.major')
    mi: SkillIndex[] // Minor skills as indexes (compressed from 'skills.minor')
  }
  sl: Record<SkillIndex, number> // Skill levels using indexes (compressed from 'skillLevels')
  e: string[] // Equipment EDIDs (compressed from 'equipment')
  d: string[] // Destiny path (compressed from 'destinyPath')
  a: {
    h: number // Health (compressed from 'attributeAssignments.health')
    st: number // Stamina (compressed from 'attributeAssignments.stamina')
    m: number // Magicka (compressed from 'attributeAssignments.magicka')
    l: number // Level (compressed from 'attributeAssignments.level')
    as: Record<number, 'health' | 'stamina' | 'magicka'> // Assignments (compressed from 'attributeAssignments.assignments')
  }
}

// V2 Build state with compact perks
export interface V2BuildState extends V2BaseBuildState {
  p: V2CompactPerks // Compact perks using skill indexes
}

// Union type for all build formats (v1, v2 legacy, v2 compact)
export type AnyBuildState = LegacyBuildState | CompactBuildState | V2BuildState

// Import legacy types for backwards compatibility
import type { LegacyBuildState, CompactBuildState } from './build'

// V2 Default build with compressed format
export const V2_DEFAULT_BUILD: V2BuildState = {
  v: 2,
  n: '',
  o: '',
  r: null,
  s: null,
  g: null,
  f: null,
  t: {
    r: [],
    b: [],
  },
  // l: [2, 1] - omitted because it's the default
  k: {
    ma: [],
    mi: [],
  },
  sl: {},
  e: [],
  d: [],
  a: {
    h: 0,
    st: 0,
    m: 0,
    l: 1,
    as: {},
  },
  p: {},
}

// Type guards for build format detection
export function isV2BuildState(build: any): build is V2BuildState {
  return build?.v === 2 && 'p' in build && 'k' in build && 't' in build && 'a' in build
}

export function isLegacyBuildState(build: any): build is LegacyBuildState {
  return build?.v === 2 && 'perks' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build
}

export function isCompactBuildState(build: any): build is CompactBuildState {
  return build?.v === 2 && 'p' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build
}

// Utility types for conversion
export type BuildStateVariant = 'legacy' | 'compact' | 'v2'

export function getBuildStateVariant(build: any): BuildStateVariant {
  if (isV2BuildState(build)) return 'v2'
  if (isCompactBuildState(build)) return 'compact'
  if (isLegacyBuildState(build)) return 'legacy'
  throw new Error('Unknown build state format')
}
