/**
 * Skill Index System for v2 Compression
 * 
 * This file creates a comprehensive skill indexing system to eliminate duplication
 * across different fields that reference the same skills with different naming conventions.
 * 
 * Current Problem:
 * - `p` field uses: "DST" (compact codes)
 * - `sl` field uses: "AVDestruction" (full EDIDs)
 * - `skills` field uses: "AVDestruction" (full EDIDs)
 * 
 * Solution:
 * - Create a fixed skill index mapping: 0 => "AVSmithing", 1 => "AVDestruction", etc.
 * - All skill references use numeric indexes instead of strings
 * - Massive reduction in URL size and elimination of naming inconsistencies
 */

// Fixed skill index mapping - this order must NEVER change for backwards compatibility
export const SKILL_INDEX = [
  'AVSmithing',      // 0
  'AVDestruction',   // 1
  'AVEnchanting',    // 2
  'AVRestoration',   // 3
  'AVMysticism',     // 4 (Illusion)
  'AVConjuration',   // 5
  'AVAlteration',    // 6
  'AVSpeechcraft',   // 7
  'AVAlchemy',       // 8
  'AVSneak',         // 9
  'AVLockpicking',   // 10 (Wayfarer)
  'AVPickpocket',    // 11 (Finesse)
  'AVLightArmor',    // 12 (Evasion)
  'AVHeavyArmor',    // 13
  'AVBlock',         // 14
  'AVMarksman',      // 15
  'AVTwoHanded',     // 16
  'AVOneHanded',     // 17
] as const

// Reverse mapping for decoding
export const SKILL_INDEX_REVERSE = Object.fromEntries(
  SKILL_INDEX.map((skillId, index) => [skillId, index])
) as Record<string, number>

// Type for skill index
export type SkillIndex = number

// Type for skill ID
export type SkillId = typeof SKILL_INDEX[number]

/**
 * Convert skill ID to index
 */
export function skillIdToIndex(skillId: string): SkillIndex | null {
  return SKILL_INDEX_REVERSE[skillId] ?? null
}

/**
 * Convert index to skill ID
 */
export function indexToSkillId(index: SkillIndex): SkillId | null {
  return SKILL_INDEX[index] ?? null
}

/**
 * Convert array of skill IDs to array of indexes
 */
export function skillIdsToIndexes(skillIds: string[]): SkillIndex[] {
  return skillIds
    .map(skillIdToIndex)
    .filter((index): index is SkillIndex => index !== null)
}

/**
 * Convert array of indexes to array of skill IDs
 */
export function indexesToSkillIds(indexes: SkillIndex[]): SkillId[] {
  return indexes
    .map(indexToSkillId)
    .filter((skillId): skillId is SkillId => skillId !== null)
}

/**
 * Convert skill ID object to index object
 */
export function skillIdObjectToIndexObject<T>(
  obj: Record<string, T>
): Record<SkillIndex, T> {
  const result: Record<SkillIndex, T> = {}
  for (const [skillId, value] of Object.entries(obj)) {
    const index = skillIdToIndex(skillId)
    if (index !== null) {
      result[index] = value
    }
  }
  return result
}

/**
 * Convert index object to skill ID object
 */
export function indexObjectToSkillIdObject<T>(
  obj: Record<SkillIndex, T>
): Partial<Record<SkillId, T>> {
  const result: Partial<Record<SkillId, T>> = {}
  for (const [indexStr, value] of Object.entries(obj)) {
    const index = parseInt(indexStr, 10) as SkillIndex
    const skillId = indexToSkillId(index)
    if (skillId !== null) {
      result[skillId] = value
    }
  }
  return result
}

/**
 * Convert skills object (major/minor arrays) to index format
 */
export function skillsToIndexes(skills: {
  major: string[]
  minor: string[]
}): {
  major: SkillIndex[]
  minor: SkillIndex[]
} {
  return {
    major: skillIdsToIndexes(skills.major),
    minor: skillIdsToIndexes(skills.minor),
  }
}

/**
 * Convert skills object from index format
 */
export function skillsFromIndexes(skills: {
  major: SkillIndex[]
  minor: SkillIndex[]
}): {
  major: SkillId[]
  minor: SkillId[]
} {
  return {
    major: indexesToSkillIds(skills.major),
    minor: indexesToSkillIds(skills.minor),
  }
}

/**
 * Convert skill levels object to index format
 */
export function skillLevelsToIndexes(
  skillLevels: Record<string, number>
): Record<SkillIndex, number> {
  return skillIdObjectToIndexObject(skillLevels)
}

/**
 * Convert skill levels object from index format
 */
export function skillLevelsFromIndexes(
  skillLevels: Record<SkillIndex, number>
): Partial<Record<SkillId, number>> {
  return indexObjectToSkillIdObject(skillLevels)
}

/**
 * Convert perks object to index format
 */
export function perksToIndexes(perks: {
  selected: Record<string, string[]>
  ranks: Record<string, number>
}): {
  selected: Record<SkillIndex, string[]>
  ranks: Record<string, number>
} {
  return {
    selected: skillIdObjectToIndexObject(perks.selected),
    ranks: perks.ranks, // Perk ranks stay as strings (perk EDIDs)
  }
}

/**
 * Convert perks object from index format
 */
export function perksFromIndexes(perks: {
  selected: Record<SkillIndex, string[]>
  ranks: Record<string, number>
}): {
  selected: Partial<Record<SkillId, string[]>>
  ranks: Record<string, number>
} {
  return {
    selected: indexObjectToSkillIdObject(perks.selected),
    ranks: perks.ranks, // Perk ranks stay as strings (perk EDIDs)
  }
}

/**
 * Convert compact perks object to index format
 */
export function compactPerksToIndexes(
  compactPerks: Record<string, number[]>
): Record<SkillIndex, number[]> {
  return skillIdObjectToIndexObject(compactPerks)
}

/**
 * Convert compact perks object from index format
 */
export function compactPerksFromIndexes(
  compactPerks: Record<SkillIndex, number[]>
): Partial<Record<SkillId, number[]>> {
  return indexObjectToSkillIdObject(compactPerks)
}

/**
 * Get skill count for validation
 */
export function getSkillCount(): number {
  return SKILL_INDEX.length
}

/**
 * Validate skill index
 */
export function isValidSkillIndex(index: number): boolean {
  return index >= 0 && index < SKILL_INDEX.length
}

/**
 * Get all skill IDs
 */
export function getAllSkillIds(): SkillId[] {
  return [...SKILL_INDEX]
}

/**
 * Get all skill indexes
 */
export function getAllSkillIndexes(): SkillIndex[] {
  return SKILL_INDEX.map((_, index) => index as SkillIndex)
}
