/**
 * Advanced GigaPlanner Data Transformation Utilities
 *
 * This module provides advanced transformation utilities that integrate with
 * our existing data infrastructure for more accurate conversions.
 */

import { GigaPlannerDataLoader } from '../adapters/dataLoader'
import type { GigaPlannerCharacter } from '../adapters/gigaplannerConverter'
import { SKILL_NAMES } from '../adapters/mappings'
import type { BuildState, TransformationResult } from './transformation'

export class AdvancedGigaPlannerTransformer {
  private dataLoader: GigaPlannerDataLoader
  private perkSkillMap: Map<string, string> = new Map()

  constructor() {
    this.dataLoader = new GigaPlannerDataLoader()
  }

  /**
   * Initialize the transformer by loading perk data and building skill mappings
   */
  async initialize(): Promise<void> {
    try {
      const data = await this.dataLoader.loadAllData()
      this.buildPerkSkillMap(data.perks)
    } catch (error) {
      throw new Error(
        `Failed to initialize AdvancedGigaPlannerTransformer: ${error}`
      )
    }
  }

  /**
   * Build a map of perk names to their corresponding skills
   */
  private buildPerkSkillMap(perkLists: any[]): void {
    this.perkSkillMap.clear()

    perkLists.forEach(perkList => {
      perkList.perks.forEach((perk: any) => {
        const skillName = perkList.skillNames[perk.skill]
        if (skillName) {
          this.perkSkillMap.set(perk.name, skillName)
        }
      })
    })
  }

  /**
   * Transform GigaPlanner character data to our BuildState format with advanced perk mapping
   */
  transformGigaPlannerToBuildState(
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

      // Transform perks - group by skill using our perk-skill map
      const perks: Record<string, string[]> = {}
      gigaPlannerCharacter.perks.forEach(perkName => {
        const skillName = this.perkSkillMap.get(perkName)
        if (skillName) {
          if (!perks[skillName]) {
            perks[skillName] = []
          }
          perks[skillName].push(perkName)
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
          error instanceof Error
            ? error.message
            : 'Unknown transformation error',
      }
    }
  }

  /**
   * Transform our BuildState format to GigaPlanner character data with validation
   */
  transformBuildStateToGigaPlanner(
    buildState: BuildState,
    perkListName: string = 'LoreRim v3.0.4',
    gameMechanicsName: string = 'LoreRim v4'
  ): TransformationResult<GigaPlannerCharacter> {
    try {
      const warnings: string[] = []

      // Validate required fields
      const validation = this.validateBuildStateForGigaPlanner(buildState)
      if (!validation.success) {
        return validation
      }

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

      // Transform skill levels - ensure all skills are represented
      const skillLevels: Array<{ skill: string; level: number }> = []

      // Add skills from skillLevels
      if (buildState.skillLevels) {
        Object.entries(buildState.skillLevels).forEach(([skillName, level]) => {
          skillLevels.push({ skill: skillName, level })
        })
      }

      // Add skills from perks that aren't already in skillLevels
      if (buildState.perks?.selected) {
        Object.keys(buildState.perks.selected).forEach(skillName => {
          const existingSkill = skillLevels.find(s => s.skill === skillName)
          if (!existingSkill) {
            // Add skill with default level 0 if not already present
            skillLevels.push({ skill: skillName, level: 0 })
            warnings.push(
              `Added missing skill level for ${skillName} (defaulting to 0)`
            )
          }
        })
      }

      // Transform perks - flatten from grouped format and validate
      const perks: string[] = []
      if (buildState.perks?.selected) {
        Object.entries(buildState.perks.selected).forEach(
          ([skillName, perkList]) => {
            perkList.forEach(perkName => {
              // Validate that the perk belongs to the skill
              const expectedSkill = this.perkSkillMap.get(perkName)
              if (expectedSkill && expectedSkill !== skillName) {
                warnings.push(
                  `Perk ${perkName} belongs to ${expectedSkill}, not ${skillName}`
                )
              }
              perks.push(perkName)
            })
          }
        )
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
          error instanceof Error
            ? error.message
            : 'Unknown transformation error',
      }
    }
  }

  /**
   * Validate that a BuildState has all required fields for GigaPlanner conversion
   */
  validateBuildStateForGigaPlanner(
    buildState: BuildState
  ): TransformationResult<boolean> {
    const errors: string[] = []

    if (!buildState.race) {
      errors.push('Race is required for GigaPlanner conversion')
    }

    if (!buildState.attributeAssignments?.level) {
      errors.push('Character level is required for GigaPlanner conversion')
    }

    // Validate that perks belong to valid skills
    if (buildState.perks?.selected) {
      Object.entries(buildState.perks.selected).forEach(
        ([skillName, perkList]) => {
          if (!SKILL_NAMES.includes(skillName as any)) {
            errors.push(`Invalid skill name: ${skillName}`)
          }

          perkList.forEach(perkName => {
            const expectedSkill = this.perkSkillMap.get(perkName)
            if (!expectedSkill) {
              errors.push(`Unknown perk: ${perkName}`)
            }
          })
        }
      )
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
   * Get all available perk-skill mappings
   */
  getPerkSkillMappings(): Record<string, string> {
    const mappings: Record<string, string> = {}
    this.perkSkillMap.forEach((skill, perk) => {
      mappings[perk] = skill
    })
    return mappings
  }

  /**
   * Get all perks for a specific skill
   */
  getPerksForSkill(skillName: string): string[] {
    const perks: string[] = []
    this.perkSkillMap.forEach((skill, perk) => {
      if (skill === skillName) {
        perks.push(perk)
      }
    })
    return perks
  }

  /**
   * Get all skills that have perks
   */
  getSkillsWithPerks(): string[] {
    const skills = new Set<string>()
    this.perkSkillMap.forEach(skill => {
      skills.add(skill)
    })
    return Array.from(skills)
  }
}
