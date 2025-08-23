/**
 * GigaPlanner Data Transformation Utilities
 *
 * This module provides utilities to transform data between:
 * 1. GigaPlanner format (from GigaPlannerConverter)
 * 2. Our application's BuildState format
 */

import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import { useBlessingsStore } from '@/shared/stores/blessingsStore'
import { useDestinyNodesStore } from '@/shared/stores/destinyNodesStore'
import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import type { GigaPlannerCharacter } from '../adapters/gigaplannerConverter'
import {
  transformAttributeAssignments,
  transformAttributeAssignmentsToGigaPlanner,
} from './attributeTransform'
import {
  transformBlessing,
  transformBlessingToGigaPlanner,
} from './blessingTransform'
import {
  transformDestiny,
  transformDestinyToGigaPlanner,
} from './destinyTransform'
import {
  extractSubclasses,
  extractTraits,
  transformPerks,
  transformPerksToGigaPlanner,
} from './perkTransform'
import { transformRace, transformRaceToGigaPlanner } from './raceTransform'
import {
  transformSkillLevels,
  transformSkillLevelsToGigaPlanner,
} from './skillTransform'
import { transformStone, transformStoneToGigaPlanner } from './stoneTransform'
import { transformTraits, transformTraitsToGigaPlanner } from './traitTransform'

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
export async function transformGigaPlannerToBuildState(
  gigaPlannerCharacter: GigaPlannerCharacter
): Promise<TransformationResult<BuildState>> {
  try {
    const warnings: string[] = []

    // Ensure all store data is loaded before transformations
    console.log('🔄 [GigaPlanner Transform] Ensuring store data is loaded...')

    // Load race data if needed
    const racesStore = useRacesStore.getState()
    if (racesStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading race data...')
      await racesStore.load()
    }

    // Load birthsign data if needed
    const birthsignsStore = useBirthsignsStore.getState()
    if (birthsignsStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading birthsign data...')
      await birthsignsStore.load()
    }

    // Load blessing data if needed
    const blessingsStore = useBlessingsStore.getState()
    if (blessingsStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading blessing data...')
      await blessingsStore.load()
    }

    // Load traits data if needed
    const traitsStore = useTraitsStore.getState()
    if (traitsStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading traits data...')
      await traitsStore.load()
    }

    // Load destiny data if needed
    const destinyStore = useDestinyNodesStore.getState()
    if (destinyStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading destiny data...')
      await destinyStore.load()
    }

    // Load perk trees data if needed
    const perkTreesStore = usePerkTreesStore.getState()
    if (perkTreesStore.data.length === 0) {
      console.log('🔄 [GigaPlanner Transform] Loading perk trees data...')
      await perkTreesStore.load()
    }

    // Transform race using modular transform
    const raceEdid = transformRace(gigaPlannerCharacter.race)
    if (gigaPlannerCharacter.race !== 'Unknown' && !raceEdid) {
      warnings.push(`Unknown race: ${gigaPlannerCharacter.race}`)
    }

    // Transform standing stone using modular transform
    const stoneEdid = transformStone(gigaPlannerCharacter.standingStone)
    if (gigaPlannerCharacter.standingStone !== 'Unknown' && !stoneEdid) {
      warnings.push(
        `Unknown standing stone: ${gigaPlannerCharacter.standingStone}`
      )
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

    // Extract traits from perks (skill 19)
    const traitNames = extractTraits(gigaPlannerCharacter.perks)
    console.log('🔄 [GigaPlanner Transform] Extracted trait names:', traitNames)

    const traits =
      traitNames.length > 0
        ? transformTraits(traitNames)
        : { regular: [], bonus: [] }

    console.log('🔄 [GigaPlanner Transform] Transformed traits:', traits)

    // Extract subclasses from perks (skill 18) and transform to destiny path
    const subclassNames = extractSubclasses(gigaPlannerCharacter.perks)
    console.log(
      '🔄 [GigaPlanner Transform] Extracted subclass names:',
      subclassNames
    )

    const destinyPath =
      subclassNames.length > 0 ? transformDestiny(subclassNames) : []

    console.log(
      '🔄 [GigaPlanner Transform] Transformed destiny path:',
      destinyPath
    )

    const buildState: BuildState = {
      race: raceEdid,
      stone: stoneEdid,
      favoriteBlessing,
      attributeAssignments,
      skillLevels:
        Object.keys(skillLevels).length > 0 ? skillLevels : undefined,
      perks: perks || undefined,
      traits,
      destinyPath,
    }

    console.log('🔄 [GigaPlanner Transform] Final build state:', {
      race: buildState.race,
      stone: buildState.stone,
      favoriteBlessing: buildState.favoriteBlessing,
      perks: buildState.perks,
      traits: buildState.traits,
      destinyPath: buildState.destinyPath,
      skillLevels: buildState.skillLevels,
    })

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
    const blessing = transformBlessingToGigaPlanner(
      buildState.favoriteBlessing || null
    )

    // Transform attribute assignments using modular transform
    const attributeData = buildState.attributeAssignments
      ? transformAttributeAssignmentsToGigaPlanner(
          buildState.attributeAssignments
        )
      : {
          level: 1,
          hmsIncreases: { health: 0, magicka: 0, stamina: 0 },
          oghmaChoice: 'None' as const,
        }

    // Transform skill levels using modular transform
    const skillLevels = buildState.skillLevels
      ? transformSkillLevelsToGigaPlanner(buildState.skillLevels)
      : []

    // Transform perks using modular transform
    const perkNames = transformPerksToGigaPlanner(buildState.perks || null)

    // Convert perk names back to the expected format with skill numbers
    // For now, we'll assign them to skill 0 (first skill) since we don't have the original skill mapping
    const perks = perkNames.map(name => ({ name, skill: 0 }))

    // Transform traits using modular transform
    const traitNames = transformTraitsToGigaPlanner(
      buildState.traits || { regular: [], bonus: [] }
    )

    // Transform destiny path using modular transform
    const destinyNames = transformDestinyToGigaPlanner(
      buildState.destinyPath || []
    )

    // Add traits as skill 19 perks
    const traitPerks = traitNames.map(name => ({ name, skill: 19 }))

    // Add destiny nodes as skill 18 perks
    const destinyPerks = destinyNames.map(name => ({ name, skill: 18 }))

    // Combine regular perks, trait perks, and destiny perks
    const allPerks = [...perks, ...traitPerks, ...destinyPerks]

    const gigaPlannerCharacter: GigaPlannerCharacter = {
      level: attributeData.level,
      hmsIncreases: attributeData.hmsIncreases,
      skillLevels,
      oghmaChoice: attributeData.oghmaChoice,
      race,
      standingStone,
      blessing,
      perks: allPerks,
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
