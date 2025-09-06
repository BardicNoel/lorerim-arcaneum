/**
 * Build Format Conversion Utilities
 * 
 * Handles conversion between different build formats:
 * - Legacy (v2 with full property names and string skill IDs)
 * - Compact (v2 with full property names and compact perk codes)
 * - V2 (v2 with compressed property names and skill indexes)
 */

import type { 
  LegacyBuildState, 
  CompactBuildState, 
  V2BuildState,
  BuildStateVariant 
} from '../types/buildV2'
import type { SkillIndex } from '../data/skillIndex'
import {
  skillIdsToIndexes,
  indexesToSkillIds,
  skillLevelsToIndexes,
  skillLevelsFromIndexes,
  skillIdToIndex,
  indexToSkillId,
} from '../data/skillIndex'
import { SKILL_TREE_CODES, SKILL_TREE_CODES_REVERSE } from '../data/compactPerkCatalogs'

/**
 * Convert Legacy Build State to V2 Build State
 */
export function legacyToV2BuildState(legacy: LegacyBuildState): V2BuildState {
  // Convert skills to indexes
  const majorSkills = skillIdsToIndexes(legacy.skills.major)
  const minorSkills = skillIdsToIndexes(legacy.skills.minor)
  
  // Convert skill levels to indexes
  const skillLevels = skillLevelsToIndexes(legacy.skillLevels)
  
  // Convert perks to V2 format with skill indexes
  const v2Perks: Record<SkillIndex, number[]> = {}
  for (const [skillId, perkIds] of Object.entries(legacy.perks.selected)) {
    const skillIndex = skillIdToIndex(skillId)
    if (skillIndex !== null) {
      v2Perks[skillIndex] = perkIds.map(perkId => {
        // For now, we'll use a simple mapping - in a real implementation,
        // you'd need to map perk EDIDs to their indexes in the perk catalog
        return 0 // Placeholder - this would need proper perk indexing
      })
    }
  }
  
  const v2Build: V2BuildState = {
    v: 2,
    n: legacy.name,
    o: legacy.notes,
    r: legacy.race,
    s: legacy.stone,
    g: legacy.religion,
    f: legacy.favoriteBlessing,
    t: {
      r: legacy.traits.regular,
      b: legacy.traits.bonus,
    },
    // Only include trait limits if different from default [2, 1]
    ...(legacy.traitLimits.regular !== 2 || legacy.traitLimits.bonus !== 1 ? {
      l: [legacy.traitLimits.regular, legacy.traitLimits.bonus] as [number, number]
    } : {}),
    k: {
      ma: majorSkills,
      mi: minorSkills,
    },
    sl: skillLevels,
    e: legacy.equipment,
    d: legacy.destinyPath,
    a: {
      h: legacy.attributeAssignments.health,
      st: legacy.attributeAssignments.stamina,
      m: legacy.attributeAssignments.magicka,
      l: legacy.attributeAssignments.level,
      as: legacy.attributeAssignments.assignments,
    },
    p: v2Perks,
  }
  
  return v2Build
}

/**
 * Convert Compact Build State to V2 Build State
 */
export function compactToV2BuildState(compact: CompactBuildState): V2BuildState {
  // Convert skills to indexes
  const majorSkills = skillIdsToIndexes(compact.skills.major)
  const minorSkills = skillIdsToIndexes(compact.skills.minor)
  
  // Convert skill levels to indexes
  const skillLevels = skillLevelsToIndexes(compact.skillLevels)
  
  // Convert compact perks to use skill indexes
  const v2Perks: Record<SkillIndex, number[]> = {}
  for (const [skillCode, perkIndexes] of Object.entries(compact.p)) {
    const skillId = SKILL_TREE_CODES_REVERSE[skillCode]
    if (skillId) {
      const skillIndex = skillIdToIndex(skillId)
      if (skillIndex !== null) {
        v2Perks[skillIndex] = perkIndexes
      }
    }
  }
  
  const v2Build: V2BuildState = {
    v: 2,
    n: compact.name,
    o: compact.notes,
    r: compact.race,
    s: compact.stone,
    g: compact.religion,
    f: compact.favoriteBlessing,
    t: {
      r: compact.traits.regular,
      b: compact.traits.bonus,
    },
    // Only include trait limits if different from default [2, 1]
    ...(compact.traitLimits.regular !== 2 || compact.traitLimits.bonus !== 1 ? {
      l: [compact.traitLimits.regular, compact.traitLimits.bonus] as [number, number]
    } : {}),
    k: {
      ma: majorSkills,
      mi: minorSkills,
    },
    sl: skillLevels,
    e: compact.equipment,
    d: compact.destinyPath,
    a: {
      h: compact.attributeAssignments.health,
      st: compact.attributeAssignments.stamina,
      m: compact.attributeAssignments.magicka,
      l: compact.attributeAssignments.level,
      as: compact.attributeAssignments.assignments,
    },
    p: v2Perks,
  }
  
  return v2Build
}

/**
 * Convert V2 Build State to Legacy Build State
 */
export function v2ToLegacyBuildState(v2: V2BuildState): LegacyBuildState {
  // Convert skill indexes back to EDIDs
  const majorSkills = indexesToSkillIds(v2.k.ma)
  const minorSkills = indexesToSkillIds(v2.k.mi)
  
  // Convert skill levels back to EDIDs
  const skillLevels = skillLevelsFromIndexes(v2.sl)
  
  // Convert V2 perks back to legacy format
  const legacyPerks: Record<string, string[]> = {}
  for (const [skillIndex, perkIndexes] of Object.entries(v2.p)) {
    const skillId = indexToSkillId(parseInt(skillIndex) as SkillIndex)
    if (skillId) {
      // For now, we'll use placeholder perk EDIDs - in a real implementation,
      // you'd need to map perk indexes back to their EDIDs in the perk catalog
      legacyPerks[skillId] = perkIndexes.map(() => 'placeholder-perk')
    }
  }
  
  const legacyBuild: LegacyBuildState = {
    v: 2,
    name: v2.n,
    notes: v2.o,
    race: v2.r,
    stone: v2.s,
    religion: v2.g,
    favoriteBlessing: v2.f,
    traits: {
      regular: v2.t.r,
      bonus: v2.t.b,
    },
    traitLimits: {
      regular: v2.l?.[0] ?? 2,
      bonus: v2.l?.[1] ?? 1,
    },
    skills: {
      major: majorSkills,
      minor: minorSkills,
    },
    perks: {
      selected: legacyPerks,
      ranks: {}, // Will be populated by perk system
    },
    skillLevels,
    equipment: v2.e,
    userProgress: {
      unlocks: [], // Removed in v2, always empty
    },
    destinyPath: v2.d,
    attributeAssignments: {
      health: v2.a.h,
      stamina: v2.a.st,
      magicka: v2.a.m,
      level: v2.a.l,
      assignments: v2.a.as,
    },
  }
  
  return legacyBuild
}

/**
 * Convert V2 Build State to Compact Build State
 */
export function v2ToCompactBuildState(v2: V2BuildState): CompactBuildState {
  // Convert skill indexes back to EDIDs
  const majorSkills = indexesToSkillIds(v2.k.ma)
  const minorSkills = indexesToSkillIds(v2.k.mi)
  
  // Convert skill levels back to EDIDs
  const skillLevels = skillLevelsFromIndexes(v2.sl)
  
  // Convert skill indexes back to skill codes for compact perks
  const compactPerks: Record<string, number[]> = {}
  for (const [skillIndex, perkIndexes] of Object.entries(v2.p)) {
    const skillId = indexToSkillId(parseInt(skillIndex) as SkillIndex)
    if (skillId) {
      const skillCode = SKILL_TREE_CODES[skillId as keyof typeof SKILL_TREE_CODES]
      if (skillCode) {
        compactPerks[skillCode] = perkIndexes
      }
    }
  }
  
  const compactBuild: CompactBuildState = {
    v: 2,
    name: v2.n,
    notes: v2.o,
    race: v2.r,
    stone: v2.s,
    religion: v2.g,
    favoriteBlessing: v2.f,
    traits: {
      regular: v2.t.r,
      bonus: v2.t.b,
    },
    traitLimits: {
      regular: v2.l?.[0] ?? 2,
      bonus: v2.l?.[1] ?? 1,
    },
    skills: {
      major: majorSkills,
      minor: minorSkills,
    },
    skillLevels,
    equipment: v2.e,
    userProgress: {
      unlocks: [], // Removed in v2, always empty
    },
    destinyPath: v2.d,
    attributeAssignments: {
      health: v2.a.h,
      stamina: v2.a.st,
      magicka: v2.a.m,
      level: v2.a.l,
      assignments: v2.a.as,
    },
    p: compactPerks,
  }
  
  return compactBuild
}

/**
 * Universal converter that handles any build format
 */
export function convertToV2BuildState(build: any): V2BuildState {
  if (build?.v !== 2) {
    throw new Error('Only v2 builds are supported')
  }
  
  // Check if it's already a v2 build
  if ('k' in build && 't' in build && 'a' in build) {
    return build as V2BuildState
  }
  
  // Check if it's a compact build
  if ('p' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    return compactToV2BuildState(build as CompactBuildState)
  }
  
  // Check if it's a legacy build
  if ('perks' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    return legacyToV2BuildState(build as LegacyBuildState)
  }
  
  throw new Error('Unknown build format')
}

/**
 * Universal converter that handles any build format to legacy
 */
export function convertToLegacyBuildState(build: any): LegacyBuildState {
  if (build?.v !== 2) {
    throw new Error('Only v2 builds are supported')
  }
  
  // Check if it's already a legacy build
  if ('perks' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    return build as LegacyBuildState
  }
  
  // Check if it's a v2 build
  if ('k' in build && 't' in build && 'a' in build) {
    return v2ToLegacyBuildState(build as V2BuildState)
  }
  
  // Check if it's a compact build
  if ('p' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    const v2Build = compactToV2BuildState(build as CompactBuildState)
    return v2ToLegacyBuildState(v2Build)
  }
  
  throw new Error('Unknown build format')
}

/**
 * Universal converter that handles any build format to compact
 */
export function convertToCompactBuildState(build: any): CompactBuildState {
  if (build?.v !== 2) {
    throw new Error('Only v2 builds are supported')
  }
  
  // Check if it's already a compact build
  if ('p' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    return build as CompactBuildState
  }
  
  // Check if it's a v2 build
  if ('k' in build && 't' in build && 'a' in build) {
    return v2ToCompactBuildState(build as V2BuildState)
  }
  
  // Check if it's a legacy build
  if ('perks' in build && 'skills' in build && 'traits' in build && 'attributeAssignments' in build) {
    const v2Build = legacyToV2BuildState(build as LegacyBuildState)
    return v2ToCompactBuildState(v2Build)
  }
  
  throw new Error('Unknown build format')
}
