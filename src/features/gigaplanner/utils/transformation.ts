/**
 * GigaPlanner Data Transformation Utilities
 *
 * This module provides utilities to transform data between:
 * 1. GigaPlanner format (from GigaPlannerConverter)
 * 2. Our application's BuildState format
 */

import type { GigaPlannerCharacter } from '../adapters/gigaplannerConverter'

// Types for our application's build state
export interface BuildState {
  race?: string
  stone?: string
  favoriteBlessing?: string
  attributeAssignments?: {
    level: number
    health: number
    magicka: number
    stamina: number
  }
  skillLevels?: Record<string, number>
  perks?: {
    selected: Record<string, string[]>
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

    // Transform race
    const race =
      gigaPlannerCharacter.race !== 'Unknown'
        ? gigaPlannerCharacter.race
        : undefined

    // Transform standing stone
    const stone =
      gigaPlannerCharacter.standingStone !== 'Unknown'
        ? gigaPlannerCharacter.standingStone
        : undefined

    // Transform blessing
    const favoriteBlessing =
      gigaPlannerCharacter.blessing !== 'Unknown'
        ? gigaPlannerCharacter.blessing
        : undefined

    // Transform attribute assignments
    const attributeAssignments = {
      level: gigaPlannerCharacter.level,
      health: gigaPlannerCharacter.hmsIncreases.health,
      magicka: gigaPlannerCharacter.hmsIncreases.magicka,
      stamina: gigaPlannerCharacter.hmsIncreases.stamina,
    }

    // Add Oghma choice to attribute assignments if not 'None'
    if (gigaPlannerCharacter.oghmaChoice !== 'None') {
      const oghmaValue =
        gigaPlannerCharacter.oghmaChoice === 'Health'
          ? 1
          : gigaPlannerCharacter.oghmaChoice === 'Magicka'
            ? 2
            : gigaPlannerCharacter.oghmaChoice === 'Stamina'
              ? 3
              : 0

      if (oghmaValue > 0) {
        attributeAssignments[
          gigaPlannerCharacter.oghmaChoice.toLowerCase() as keyof typeof attributeAssignments
        ] += oghmaValue
        warnings.push(
          `Added Oghma choice (${gigaPlannerCharacter.oghmaChoice}) to attribute assignments`
        )
      }
    }

    // Transform skill levels
    const skillLevels: Record<string, number> = {}
    gigaPlannerCharacter.skillLevels.forEach(skill => {
      if (skill.skill !== 'Level') {
        // Skip the special 'Level' skill
        skillLevels[skill.skill] = skill.level
      }
    })

    // Transform perks - group by skill
    const perks: Record<string, string[]> = {}
    gigaPlannerCharacter.perks.forEach(perkName => {
      // Find which skill this perk belongs to
      const perkSkill = findPerkSkill(
        perkName,
        gigaPlannerCharacter.configuration.perkList
      )
      if (perkSkill) {
        if (!perks[perkSkill]) {
          perks[perkSkill] = []
        }
        perks[perkSkill].push(perkName)
      } else {
        warnings.push(`Could not determine skill for perk: ${perkName}`)
      }
    })

    const buildState: BuildState = {
      race,
      stone,
      favoriteBlessing,
      attributeAssignments,
      skillLevels:
        Object.keys(skillLevels).length > 0 ? skillLevels : undefined,
      perks: Object.keys(perks).length > 0 ? { selected: perks } : undefined,
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

    // Transform race
    const race = buildState.race || 'Nord' // Default to Nord if not specified

    // Transform standing stone
    const standingStone = buildState.stone || 'None'

    // Transform blessing
    const blessing = buildState.favoriteBlessing || 'None'

    // Transform attribute assignments
    const level = buildState.attributeAssignments?.level || 1
    const health = buildState.attributeAssignments?.health || 0
    const magicka = buildState.attributeAssignments?.magicka || 0
    const stamina = buildState.attributeAssignments?.stamina || 0

    // Determine Oghma choice from attribute assignments
    let oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina' = 'None'
    if (buildState.attributeAssignments) {
      const {
        health: h,
        magicka: m,
        stamina: s,
      } = buildState.attributeAssignments
      if (h > 0) oghmaChoice = 'Health'
      else if (m > 0) oghmaChoice = 'Magicka'
      else if (s > 0) oghmaChoice = 'Stamina'
    }

    // Transform skill levels
    const skillLevels: Array<{ skill: string; level: number }> = []
    if (buildState.skillLevels) {
      Object.entries(buildState.skillLevels).forEach(([skillName, level]) => {
        skillLevels.push({ skill: skillName, level })
      })
    }

    // Transform perks - flatten from grouped format
    const perks: string[] = []
    if (buildState.perks?.selected) {
      Object.values(buildState.perks.selected).forEach(perkList => {
        perks.push(...perkList)
      })
    }

    const gigaPlannerCharacter: GigaPlannerCharacter = {
      level,
      hmsIncreases: {
        health,
        magicka,
        stamina,
      },
      skillLevels,
      oghmaChoice,
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
 * Helper function to find which skill a perk belongs to
 * This would need to be implemented with actual perk data
 */
function findPerkSkill(perkName: string, perkListName: string): string | null {
  // This is a simplified implementation
  // In a real implementation, you would look up the perk in the perk data
  // to determine which skill it belongs to

  // For now, return null to indicate we couldn't determine the skill
  // This will result in a warning during transformation
  return null
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
