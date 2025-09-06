/**
 * Build Compression Utilities
 *
 * This module provides functions to convert between different build formats:
 * - Legacy: Full property names, skill EDIDs, legacy perks
 * - Compact: Full property names, skill EDIDs, compact perks
 * - Compressed: Compressed property names, skill indexes, compressed perks
 */

import {
  compactPerksFromIndexes,
  compactPerksToIndexes,
  indexesToSkillIds,
  skillIdsToIndexes,
  skillLevelsFromIndexes,
  skillLevelsToIndexes,
} from '../data/skillIndex'
import type {
  BuildState,
  CompactBuildState,
  CompressedBuildState,
  LegacyBuildState,
} from '../types/build'
import {
  isCompactBuildState,
  isCompressedBuildState,
  isLegacyBuildState,
} from '../types/build'
import { decodePerks, encodePerks } from './compactPerkEncoding'

/**
 * Convert legacy build to compressed format
 */
export function legacyToCompressed(
  legacy: LegacyBuildState
): CompressedBuildState {
  return {
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
    // Only include trait limits if different from defaults
    ...(legacy.traitLimits.regular !== 2 || legacy.traitLimits.bonus !== 1
      ? {
          l: [legacy.traitLimits.regular, legacy.traitLimits.bonus] as [
            number,
            number,
          ],
        }
      : {}),
    k: {
      ma: skillIdsToIndexes(legacy.skills.major),
      mi: skillIdsToIndexes(legacy.skills.minor),
    },
    sl: skillLevelsToIndexes(legacy.skillLevels),
    e: legacy.equipment,
    d: legacy.destinyPath,
    a: {
      h: legacy.attributeAssignments.health,
      st: legacy.attributeAssignments.stamina,
      m: legacy.attributeAssignments.magicka,
      l: legacy.attributeAssignments.level,
      as: legacy.attributeAssignments.assignments,
    },
    p: compactPerksToIndexes(encodePerks(legacy.perks)),
  }
}

/**
 * Convert compact build to compressed format
 */
export function compactToCompressed(
  compact: CompactBuildState
): CompressedBuildState {
  return {
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
    // Only include trait limits if different from defaults
    ...(compact.traitLimits.regular !== 2 || compact.traitLimits.bonus !== 1
      ? {
          l: [compact.traitLimits.regular, compact.traitLimits.bonus] as [
            number,
            number,
          ],
        }
      : {}),
    k: {
      ma: skillIdsToIndexes(compact.skills.major),
      mi: skillIdsToIndexes(compact.skills.minor),
    },
    sl: skillLevelsToIndexes(compact.skillLevels),
    e: compact.equipment,
    d: compact.destinyPath,
    a: {
      h: compact.attributeAssignments.health,
      st: compact.attributeAssignments.stamina,
      m: compact.attributeAssignments.magicka,
      l: compact.attributeAssignments.level,
      as: compact.attributeAssignments.assignments,
    },
    p: compactPerksToIndexes(compact.p),
  }
}

/**
 * Convert compressed build to legacy format
 */
export function compressedToLegacy(
  compressed: CompressedBuildState
): LegacyBuildState {
  return {
    v: 2,
    name: compressed.n,
    notes: compressed.o,
    race: compressed.r,
    stone: compressed.s,
    religion: compressed.g,
    favoriteBlessing: compressed.f,
    traits: {
      regular: compressed.t.r,
      bonus: compressed.t.b,
    },
    traitLimits: {
      regular: compressed.l?.[0] ?? 2,
      bonus: compressed.l?.[1] ?? 1,
    },
    skills: {
      major: indexesToSkillIds(compressed.k.ma),
      minor: indexesToSkillIds(compressed.k.mi),
    },
    skillLevels: skillLevelsFromIndexes(compressed.sl),
    equipment: compressed.e,
    userProgress: {
      unlocks: [], // userProgress removed in compressed format
    },
    destinyPath: compressed.d,
    attributeAssignments: {
      health: compressed.a.h,
      stamina: compressed.a.st,
      magicka: compressed.a.m,
      level: compressed.a.l,
      assignments: compressed.a.as,
    },
    perks: decodePerks(compactPerksFromIndexes(compressed.p)),
  }
}

/**
 * Convert compressed build to compact format
 */
export function compressedToCompact(
  compressed: CompressedBuildState
): CompactBuildState {
  return {
    v: 2,
    name: compressed.n,
    notes: compressed.o,
    race: compressed.r,
    stone: compressed.s,
    religion: compressed.g,
    favoriteBlessing: compressed.f,
    traits: {
      regular: compressed.t.r,
      bonus: compressed.t.b,
    },
    traitLimits: {
      regular: compressed.l?.[0] ?? 2,
      bonus: compressed.l?.[1] ?? 1,
    },
    skills: {
      major: indexesToSkillIds(compressed.k.ma),
      minor: indexesToSkillIds(compressed.k.mi),
    },
    skillLevels: skillLevelsFromIndexes(compressed.sl),
    equipment: compressed.e,
    userProgress: {
      unlocks: [], // userProgress removed in compressed format
    },
    destinyPath: compressed.d,
    attributeAssignments: {
      health: compressed.a.h,
      stamina: compressed.a.st,
      magicka: compressed.a.m,
      level: compressed.a.l,
      assignments: compressed.a.as,
    },
    p: compactPerksFromIndexes(compressed.p),
  }
}

/**
 * Convert any build format to compressed format
 */
export function toCompressed(build: BuildState): CompressedBuildState {
  if (isCompressedBuildState(build)) {
    return build
  } else if (isCompactBuildState(build)) {
    return compactToCompressed(build)
  } else {
    return legacyToCompressed(build)
  }
}

/**
 * Convert any build format to legacy format
 */
export function toLegacy(build: BuildState): LegacyBuildState {
  if (isLegacyBuildState(build)) {
    return build
  } else if (isCompressedBuildState(build)) {
    return compressedToLegacy(build)
  } else {
    // Compact to legacy
    return {
      ...build,
      perks: decodePerks(build.p),
    }
  }
}

/**
 * Convert any build format to compact format
 */
export function toCompact(build: BuildState): CompactBuildState {
  if (isCompactBuildState(build)) {
    return build
  } else if (isCompressedBuildState(build)) {
    return compressedToCompact(build)
  } else {
    // Legacy to compact
    return {
      ...build,
      p: encodePerks(build.perks),
    }
  }
}

/**
 * Calculate compression ratio for a build
 */
export function calculateCompressionRatio(build: BuildState): {
  originalSize: number
  compressedSize: number
  ratio: number
  savings: number
  savingsPercentage: number
} {
  const originalJson = JSON.stringify(build)
  const compressed = toCompressed(build)
  const compressedJson = JSON.stringify(compressed)

  const originalSize = originalJson.length
  const compressedSize = compressedJson.length
  const savings = originalSize - compressedSize
  const ratio = compressedSize / originalSize
  const savingsPercentage = (savings / originalSize) * 100

  return {
    originalSize,
    compressedSize,
    ratio,
    savings,
    savingsPercentage,
  }
}
