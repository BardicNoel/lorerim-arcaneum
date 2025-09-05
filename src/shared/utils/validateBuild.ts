import type { BuildState, LegacyBuildState, CompactBuildState } from '../types/build'
import { getPerkData, isCompactFormat } from './compactPerkEncoding'

/**
 * Validates and sanitizes a build state object, ensuring all required properties exist
 * and have the correct structure with safe fallback values.
 *
 * @param build - The build state to validate (can be partial or corrupted)
 * @returns A fully validated BuildState with all required properties
 */
export function validateBuild(
  build: Partial<BuildState> | null | undefined
): BuildState {
  // If no build provided, return default structure
  if (!build) {
    return getDefaultBuildStructure()
  }

  // Ensure the build has the required structure to prevent undefined errors
  const validatedBuild: BuildState = {
    // Schema version - always set to current version
    v: build.v || 1,

    // Basic info - use provided values or defaults
    name: build.name || '',
    notes: build.notes || '',

    // Race and standing stone - convert to null if undefined/empty/invalid
    race: validateStringOrNull(build.race),
    stone: validateStringOrNull(build.stone),
    religion: validateStringOrNull(build.religion),
    favoriteBlessing: validateStringOrNull(build.favoriteBlessing),

    // Skills - ensure arrays exist and are valid
    skills: {
      major: validateStringArray(build.skills?.major),
      minor: validateStringArray(build.skills?.minor),
    },

    // Traits - ensure arrays exist and are valid
    traits: {
      regular: validateStringArray(build.traits?.regular),
      bonus: validateStringArray(build.traits?.bonus),
    },

    // Trait limits - ensure numbers exist and are valid
    traitLimits: {
      regular: validateNumber(build.traitLimits?.regular, 2),
      bonus: validateNumber(build.traitLimits?.bonus, 1),
    },

    // Perks - handle both legacy and compact formats
    ...(isCompactFormat(build) 
      ? { p: validateCompactPerks(build.p) }
      : { perks: {
          selected: validateRecordOfStringArrays(build.perks?.selected),
          ranks: validateRecordOfNumbers(build.perks?.ranks),
        }}
    ),

    // Skill levels - ensure object exists and is valid
    skillLevels: validateRecordOfNumbers(build.skillLevels),

    // Equipment - ensure array exists and is valid
    equipment: validateStringArray(build.equipment),

    // User progress - ensure object exists and is valid
    userProgress: {
      unlocks: validateStringArray(build.userProgress?.unlocks),
    },

    // Destiny path - ensure array exists and is valid
    destinyPath: validateStringArray(build.destinyPath),

    // Attribute assignments - ensure object exists and is valid
    attributeAssignments: {
      health: validateNumber(build.attributeAssignments?.health, 0),
      stamina: validateNumber(build.attributeAssignments?.stamina, 0),
      magicka: validateNumber(build.attributeAssignments?.magicka, 0),
      level: validateNumber(build.attributeAssignments?.level, 1),
      assignments: validateRecordOfAttributeTypes(
        build.attributeAssignments?.assignments
      ),
    },
  }

  return validatedBuild as BuildState
}

/**
 * Returns a complete default build structure with all required properties
 */
function getDefaultBuildStructure(): LegacyBuildState {
  return {
    v: 1,
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
    destinyPath: [],
    attributeAssignments: {
      health: 0,
      stamina: 0,
      magicka: 0,
      level: 1,
      assignments: {},
    },
  }
}

/**
 * Validates a string value, returning null if invalid/empty
 */
function validateStringOrNull(value: any): string | null {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim()
  }
  return null
}

/**
 * Validates an array of strings, ensuring it's a valid array
 */
function validateStringArray(value: any): string[] {
  if (Array.isArray(value)) {
    // Filter out invalid entries and ensure all are strings
    return value.filter(item => typeof item === 'string' && item.trim() !== '')
  }
  return []
}

/**
 * Validates a number value, returning fallback if invalid
 */
function validateNumber(value: any, fallback: number): number {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value
  }
  return fallback
}

/**
 * Validates a record of string arrays, ensuring it's a valid object
 */
function validateRecordOfStringArrays(value: any): Record<string, string[]> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const validated: Record<string, string[]> = {}

    for (const [key, val] of Object.entries(value)) {
      if (typeof key === 'string' && Array.isArray(val)) {
        validated[key] = validateStringArray(val)
      }
    }

    return validated
  }
  return {}
}

/**
 * Validates a record of numbers, ensuring it's a valid object
 */
function validateRecordOfNumbers(value: any): Record<string, number> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const validated: Record<string, number> = {}

    for (const [key, val] of Object.entries(value)) {
      if (
        typeof key === 'string' &&
        typeof val === 'number' &&
        !isNaN(val) &&
        isFinite(val)
      ) {
        validated[key] = val
      }
    }

    return validated
  }
  return {}
}

/**
 * Validates a record of attribute types, ensuring it's a valid object
 */
function validateRecordOfAttributeTypes(
  value: any
): Record<number, 'health' | 'stamina' | 'magicka'> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const validated: Record<number, 'health' | 'stamina' | 'magicka'> = {}

    for (const [key, val] of Object.entries(value)) {
      const numKey = parseInt(key, 10)
      if (
        !isNaN(numKey) &&
        isFinite(numKey) &&
        typeof val === 'string' &&
        ['health', 'stamina', 'magicka'].includes(val)
      ) {
        validated[numKey] = val as 'health' | 'stamina' | 'magicka'
      }
    }

    return validated
  }
  return {}
}

/**
 * Validates compact perks format
 */
function validateCompactPerks(value: any): Record<string, number[]> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const validated: Record<string, number[]> = {}

    for (const [key, val] of Object.entries(value)) {
      if (typeof key === 'string' && Array.isArray(val)) {
        const validIndexes = val.filter(
          (index) => typeof index === 'number' && index >= 0 && Number.isInteger(index)
        )
        if (validIndexes.length > 0) {
          validated[key] = validIndexes
        }
      }
    }

    return validated
  }
  return {}
}

/**
 * Type guard to check if a value is a valid BuildState
 */
export function isValidBuild(build: any): build is BuildState {
  try {
    const validated = validateBuild(build)
    return (
      validated.v === 1 &&
      typeof validated.name === 'string' &&
      Array.isArray(validated.skills.major) &&
      Array.isArray(validated.skills.minor) &&
      Array.isArray(validated.traits.regular) &&
      Array.isArray(validated.traits.bonus)
    )
  } catch {
    return false
  }
}
