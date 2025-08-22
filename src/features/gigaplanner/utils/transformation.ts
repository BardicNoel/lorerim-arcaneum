/**
 * GigaPlanner Data Transformation Utilities
 *
 * This module provides utilities to transform data between:
 * 1. GigaPlanner format (from GigaPlannerConverter)
 * 2. Our application's BuildState format
 */

import type { GigaPlannerCharacter } from '../adapters/gigaplannerConverter'
import { transformRace, transformRaceToGigaPlanner } from './raceTransform'
import { transformStone, transformStoneToGigaPlanner } from './stoneTransform'
import { transformBlessing, transformBlessingToGigaPlanner } from './blessingTransform'
import { transformAttributeAssignments, transformAttributeAssignmentsToGigaPlanner } from './attributeTransform'
import { transformSkillLevels, transformSkillLevelsToGigaPlanner } from './skillTransform'
import { transformPerks, transformPerksToGigaPlanner } from './perkTransform'

// Types for our application's build state
export interface BuildState {
  name?: string
  notes?: string
  race?: string | null
  stone?: string | null
  religion?: string | null
  favoriteBlessing?: string | null
  traits?: {
    regular: string[]
    bonus: string[]
  }
  traitLimits?: {
    regular: number
    bonus: number
  }
  skills?: {
    major: string[]
    minor: string[]
  }
  perks?: {
    selected: Record<string, string[]>
    ranks: Record<string, number>
  }
  skillLevels?: Record<string, number>
  equipment?: string[]
  userProgress?: {
    unlocks: string[]
  }
  destinyPath?: string[]
  attributeAssignments?: {
    health: number
    stamina: number
    magicka: number
    level: number
    assignments: Record<number, 'health' | 'stamina' | 'magicka'>
  }
}

export interface TransformationResult<T> {
  success: boolean
  data?: T
  error?: string
  warnings?: string[]
}

/**
 * Transform GigaPlanner character data to our BuildState format
 */
export function transformGigaPlannerToBuildState(
  gigaPlannerCharacter: GigaPlannerCharacter
): TransformationResult<BuildState> {
  try {
    const warnings: string[] = []

    // Transform race using modular transform
    const raceEdid = transformRace(gigaPlannerCharacter.race)
    if (gigaPlannerCharacter.race !== 'Unknown' && !raceEdid) {
      warnings.push(`Unknown race: ${gigaPlannerCharacter.race}`)
    }

    // Transform standing stone using modular transform
    const stoneEdid = transformStone(gigaPlannerCharacter.standingStone)
    if (gigaPlannerCharacter.standingStone !== 'Unknown' && !stoneEdid) {
      warnings.push(`Unknown standing stone: ${gigaPlannerCharacter.standingStone}`)
    }

    // Transform blessing using modular transform
    const favoriteBlessing = transformBlessing(gigaPlannerCharacter.blessing)

    // Transform attribute assignments using modular transform
    const attributeAssignments = transformAttributeAssignments(
      gigaPlannerCharacter.hmsIncreases,
      gigaPlannerCharacter.level,
      gigaPlannerCharacter.oghmaChoice
    )

    // Transform skill levels using modular transform
    const skillLevels = transformSkillLevels(gigaPlannerCharacter.skillLevels)

    // Transform perks using modular transform
    const perks = transformPerks(
      gigaPlannerCharacter.perks,
      gigaPlannerCharacter.configuration.perkList
    )

    const buildState: BuildState = {
      race: raceEdid,
      stone: stoneEdid,
      favoriteBlessing,
      attributeAssignments,
      skillLevels: Object.keys(skillLevels).length > 0 ? skillLevels : undefined,
      perks: perks || undefined,
    }

    return {
      success: true,
      data: buildState,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown transformation error',
    }
  }
}

/**
 * Transform our BuildState format to GigaPlanner character data
 */
export function transformBuildStateToGigaPlanner(
  buildState: BuildState,
  perkListName: string = 'LoreRim v3.0.4',
  gameMechanicsName: string = 'LoreRim v4'
): TransformationResult<GigaPlannerCharacter> {
  try {
    const warnings: string[] = []

    // Transform race using modular transform
    const race = transformRaceToGigaPlanner(buildState.race || null)

    // Transform standing stone using modular transform
    const standingStone = transformStoneToGigaPlanner(buildState.stone || null)

    // Transform blessing using modular transform
    const blessing = transformBlessingToGigaPlanner(buildState.favoriteBlessing || null)

    // Transform attribute assignments using modular transform
    const attributeData = buildState.attributeAssignments 
      ? transformAttributeAssignmentsToGigaPlanner(buildState.attributeAssignments)
      : { level: 1, hmsIncreases: { health: 0, magicka: 0, stamina: 0 }, oghmaChoice: 'None' as const }

    // Transform skill levels using modular transform
    const skillLevels = buildState.skillLevels 
      ? transformSkillLevelsToGigaPlanner(buildState.skillLevels)
      : []

    // Transform perks using modular transform
    const perks = transformPerksToGigaPlanner(buildState.perks || null)

    const gigaPlannerCharacter: GigaPlannerCharacter = {
      level: attributeData.level,
      hmsIncreases: attributeData.hmsIncreases,
      skillLevels,
      oghmaChoice: attributeData.oghmaChoice,
      race,
      standingStone,
      blessing,
      perks,
      configuration: {
        perkList: perkListName,
        gameMechanics: gameMechanicsName,
      },
    }

    return {
      success: true,
      data: gigaPlannerCharacter,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unknown transformation error',
    }
  }
}

/**
 * Validate that a BuildState has all required fields for GigaPlanner conversion
 */
export function validateBuildStateForGigaPlanner(
  buildState: BuildState
): TransformationResult<boolean> {
  const errors: string[] = []

  if (!buildState.race) {
    errors.push('Race is required for GigaPlanner conversion')
  }

  if (!buildState.attributeAssignments?.level) {
    errors.push('Character level is required for GigaPlanner conversion')
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join('; '),
    }
  }

  return {
    success: true,
    data: true,
  }
}

/**
 * Validate that a GigaPlanner character has all required fields for BuildState conversion
 */
export function validateGigaPlannerForBuildState(
  gigaPlannerCharacter: GigaPlannerCharacter
): TransformationResult<boolean> {
  const errors: string[] = []

  if (!gigaPlannerCharacter.race || gigaPlannerCharacter.race === 'Unknown') {
    errors.push('Valid race is required for BuildState conversion')
  }

  if (!gigaPlannerCharacter.level || gigaPlannerCharacter.level < 1) {
    errors.push('Valid character level is required for BuildState conversion')
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join('; '),
    }
  }

  return {
    success: true,
    data: true,
  }
}
