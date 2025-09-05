/**
 * Compact Perk Encoding/Decoding Utilities
 * 
 * This module provides functions to encode and decode perk data using
 * compact indexes instead of full EDID strings, reducing build link size by ~90%.
 */

import { 
  SKILL_TREE_CODES, 
  SKILL_TREE_CODES_REVERSE, 
  PERK_CATALOGS,
  type CompactPerks 
} from '../data/compactPerkCatalogs'
import type { BuildState } from '../types/build'

/**
 * Encodes legacy perk data to compact format
 * 
 * @param perks - Legacy perks object with selected and ranks
 * @returns Compact perks object with skill tree codes and indexes
 */
export function encodePerks(perks: BuildState['perks']): CompactPerks {
  if (!perks?.selected) {
    return {}
  }

  const compactPerks: CompactPerks = {}

  for (const [skillTreeId, selectedPerkEdids] of Object.entries(perks.selected)) {
    // Get the compact code for this skill tree
    const skillCode = SKILL_TREE_CODES[skillTreeId as keyof typeof SKILL_TREE_CODES]
    if (!skillCode) {
      console.warn(`Unknown skill tree ID: ${skillTreeId}`)
      continue
    }

    // Get the catalog for this skill tree
    const catalog = PERK_CATALOGS[skillCode]
    if (!catalog) {
      console.warn(`No catalog found for skill code: ${skillCode}`)
      continue
    }

    // Convert EDIDs to indexes
    const indexes: number[] = []
    for (const edid of selectedPerkEdids) {
      const index = catalog.indexOf(edid)
      if (index !== -1) {
        indexes.push(index)
      } else {
        console.warn(`Perk EDID not found in catalog: ${edid} for skill ${skillCode}`)
      }
    }

    // Only add if there are selected perks
    if (indexes.length > 0) {
      compactPerks[skillCode] = indexes.sort((a, b) => a - b) // Sort for consistency
    }
  }

  return compactPerks
}

/**
 * Decodes compact perk data back to legacy format
 * 
 * @param compactPerks - Compact perks object with skill tree codes and indexes
 * @returns Legacy perks object with selected and ranks
 */
export function decodePerks(compactPerks: CompactPerks): BuildState['perks'] {
  const selected: Record<string, string[]> = {}
  const ranks: Record<string, number> = {}

  for (const [skillCode, indexes] of Object.entries(compactPerks)) {
    // Get the full skill tree ID
    const skillTreeId = SKILL_TREE_CODES_REVERSE[skillCode]
    if (!skillTreeId) {
      console.warn(`Unknown skill code: ${skillCode}`)
      continue
    }

    // Get the catalog for this skill tree
    const catalog = PERK_CATALOGS[skillCode as keyof typeof PERK_CATALOGS]
    if (!catalog) {
      console.warn(`No catalog found for skill code: ${skillCode}`)
      continue
    }

    // Convert indexes back to EDIDs
    const edids: string[] = []
    for (const index of indexes) {
      if (index >= 0 && index < catalog.length) {
        const edid = catalog[index]
        edids.push(edid)
        // Set default rank of 1 for all perks
        ranks[edid] = 1
      } else {
        console.warn(`Invalid perk index: ${index} for skill ${skillCode}`)
      }
    }

    if (edids.length > 0) {
      selected[skillTreeId] = edids
    }
  }

  return { selected, ranks }
}

/**
 * Migrates a build from legacy format to compact format
 * 
 * @param build - Build state to migrate
 * @returns Build state with compact perk format
 */
export function migrateToCompactFormat(build: BuildState): BuildState {
  // If already in compact format, return as-is
  if ('p' in build && !('perks' in build)) {
    return build
  }

  // Encode perks to compact format
  const compactPerks = encodePerks(build.perks)
  
  // Create new build with compact format and version 2
  const { perks, ...rest } = build
  return {
    ...rest,
    v: 2, // Update to version 2 for compact format
    p: compactPerks
  }
}

/**
 * Migrates a build from compact format back to legacy format
 * 
 * @param build - Build state with compact format
 * @returns Build state with legacy perk format
 */
export function migrateToLegacyFormat(build: BuildState & { p?: CompactPerks }): BuildState {
  // If already in legacy format, return as-is
  if ('perks' in build && !('p' in build)) {
    return build
  }

  // Decode compact perks to legacy format
  const legacyPerks = decodePerks(build.p || {})
  
  // Create new build with legacy format and version 2
  const { p, ...rest } = build
  return {
    ...rest,
    v: 2, // Keep version 2 for consistency
    perks: legacyPerks
  }
}

/**
 * Checks if a build is using compact format
 * 
 * @param build - Build state to check
 * @returns True if using compact format
 */
export function isCompactFormat(build: any): boolean {
  return 'p' in build && !('perks' in build)
}

/**
 * Gets the appropriate perk data for a build (handles both formats)
 * 
 * @param build - Build state (compact or legacy)
 * @returns Perk data in legacy format
 */
export function getPerkData(build: any): BuildState['perks'] {
  if (isCompactFormat(build)) {
    return decodePerks(build.p || {})
  }
  return build.perks || { selected: {}, ranks: {} }
}

/**
 * Updates perk data in a build (handles both formats)
 * 
 * @param build - Build state (compact or legacy)
 * @param perks - New perk data in legacy format
 * @returns Updated build state
 */
export function updatePerkData(build: any, perks: BuildState['perks']): any {
  if (isCompactFormat(build)) {
    const compactPerks = encodePerks(perks)
    return { ...build, p: compactPerks }
  } else {
    return { ...build, perks }
  }
}

/**
 * Calculates the size reduction achieved by compact format
 * 
 * @param legacyPerks - Legacy perk data
 * @param compactPerks - Compact perk data
 * @returns Object with size information
 */
export function calculateSizeReduction(
  legacyPerks: BuildState['perks'],
  compactPerks: CompactPerks
): {
  legacySize: number
  compactSize: number
  reduction: number
  reductionPercentage: number
} {
  const legacyJson = JSON.stringify(legacyPerks)
  const compactJson = JSON.stringify(compactPerks)
  
  const legacySize = legacyJson.length
  const compactSize = compactJson.length
  const reduction = legacySize - compactSize
  const reductionPercentage = (reduction / legacySize) * 100

  return {
    legacySize,
    compactSize,
    reduction,
    reductionPercentage
  }
}
