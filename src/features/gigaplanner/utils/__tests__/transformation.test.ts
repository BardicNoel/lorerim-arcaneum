import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GigaPlannerDataLoader } from '../../adapters/dataLoader'
import { AdvancedGigaPlannerTransformer } from '../advancedTransformation'
import {
  transformBuildStateToGigaPlanner,
  transformGigaPlannerToBuildState,
  validateBuildStateForGigaPlanner,
  validateGigaPlannerForBuildState,
  type BuildState,
} from '../transformation'

// Mock the data loader
vi.mock('../../adapters/dataLoader', () => ({
  GigaPlannerDataLoader: vi.fn(),
}))

describe('Transformation Utilities', () => {
  let mockDataLoader: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create mock data
    const mockData = {
      perks: [
        {
          name: 'LoreRim v3.0.4',
          perkListId: 0,
          skillNames: ['Smithing', 'Heavy Armor', 'Block'],
          perks: [
            {
              name: 'Craftsmanship',
              skill: 0,
              skillReq: 0,
              description: 'Basic crafting',
            },
            {
              name: 'Conditioning',
              skill: 1,
              skillReq: 0,
              description: 'Basic armor',
            },
            {
              name: 'Improved Blocking',
              skill: 2,
              skillReq: 0,
              description: 'Better blocking',
            },
          ],
        },
      ],
    }

    mockDataLoader = {
      loadAllData: vi.fn().mockResolvedValue(mockData),
    }
    ;(GigaPlannerDataLoader as any).mockImplementation(() => mockDataLoader)
  })

  describe('transformGigaPlannerToBuildState', () => {
    it('should transform valid GigaPlanner character to BuildState', () => {
      const gigaPlannerCharacter = {
        level: 50,
        hmsIncreases: {
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        skillLevels: [
          { skill: 'Smithing', level: 100 },
          { skill: 'Heavy Armor', level: 75 },
          { skill: 'Level', level: 50 },
        ],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: ['Craftsmanship', 'Conditioning'],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = transformGigaPlannerToBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        race: 'Nord',
        stone: 'Warrior',
        favoriteBlessing: 'Blessing of Akatosh',
        attributeAssignments: {
          health: 11, // 10 + 1 from Oghma choice
          stamina: 5,
          magicka: 5,
          level: 50,
          assignments: {},
        },
        skillLevels: {
          Smithing: 100,
          'Heavy Armor': 75,
        },
        perks: undefined, // Will be undefined because findPerkSkill returns null in basic version
      })
      expect(result.warnings).toContain(
        'Added Oghma choice (Health) to attribute assignments'
      )
    })

    it('should handle unknown values gracefully', () => {
      const gigaPlannerCharacter = {
        level: 1,
        hmsIncreases: { health: 0, magicka: 0, stamina: 0 },
        skillLevels: [],
        oghmaChoice: 'None' as const,
        race: 'Unknown',
        standingStone: 'Unknown',
        blessing: 'Unknown',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = transformGigaPlannerToBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        race: undefined,
        stone: undefined,
        favoriteBlessing: undefined,
        attributeAssignments: {
          health: 0,
          stamina: 0,
          magicka: 0,
          level: 1,
          assignments: {},
        },
        skillLevels: undefined,
        perks: undefined,
      })
    })

    it('should handle transformation errors', () => {
      const invalidCharacter = null as any

      const result = transformGigaPlannerToBuildState(invalidCharacter)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('transformBuildStateToGigaPlanner', () => {
    it('should transform valid BuildState to GigaPlanner character', () => {
      const buildState: BuildState = {
        race: 'Nord',
        stone: 'Warrior',
        favoriteBlessing: 'Blessing of Akatosh',
        attributeAssignments: {
          level: 50,
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        skillLevels: {
          Smithing: 100,
          'Heavy Armor': 75,
        },
        perks: {
          selected: {
            Smithing: ['Craftsmanship'],
            'Heavy Armor': ['Conditioning'],
          },
        },
      }

      const result = transformBuildStateToGigaPlanner(buildState)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        level: 50,
        hmsIncreases: {
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        skillLevels: [
          { skill: 'Smithing', level: 100 },
          { skill: 'Heavy Armor', level: 75 },
        ],
        oghmaChoice: 'Health',
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: ['Craftsmanship', 'Conditioning'],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      })
    })

    it('should use defaults for missing values', () => {
      const buildState: BuildState = {
        race: 'Nord',
        attributeAssignments: {
          level: 1,
          health: 0,
          magicka: 0,
          stamina: 0,
        },
      }

      const result = transformBuildStateToGigaPlanner(buildState)

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        level: 1,
        hmsIncreases: { health: 0, magicka: 0, stamina: 0 },
        skillLevels: [],
        oghmaChoice: 'None',
        race: 'Nord',
        standingStone: 'None',
        blessing: 'None',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      })
    })

    it('should handle transformation errors', () => {
      const invalidBuildState = null as any

      const result = transformBuildStateToGigaPlanner(invalidBuildState)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateBuildStateForGigaPlanner', () => {
    it('should validate valid BuildState', () => {
      const buildState: BuildState = {
        race: 'Nord',
        attributeAssignments: {
          level: 50,
          health: 10,
          magicka: 5,
          stamina: 5,
        },
      }

      const result = validateBuildStateForGigaPlanner(buildState)

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
    })

    it('should reject BuildState without race', () => {
      const buildState: BuildState = {
        attributeAssignments: {
          level: 50,
          health: 10,
          magicka: 5,
          stamina: 5,
        },
      }

      const result = validateBuildStateForGigaPlanner(buildState)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Race is required')
    })

    it('should reject BuildState without level', () => {
      const buildState: BuildState = {
        race: 'Nord',
        attributeAssignments: {
          health: 10,
          magicka: 5,
          stamina: 5,
        },
      }

      const result = validateBuildStateForGigaPlanner(buildState)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Character level is required')
    })
  })

  describe('validateGigaPlannerForBuildState', () => {
    it('should validate valid GigaPlanner character', () => {
      const gigaPlannerCharacter = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = validateGigaPlannerForBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
    })

    it('should reject GigaPlanner character with unknown race', () => {
      const gigaPlannerCharacter = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Unknown',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = validateGigaPlannerForBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Valid race is required')
    })

    it('should reject GigaPlanner character with invalid level', () => {
      const gigaPlannerCharacter = {
        level: 0,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = validateGigaPlannerForBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Valid character level is required')
    })
  })
})

describe('AdvancedGigaPlannerTransformer', () => {
  let transformer: AdvancedGigaPlannerTransformer
  let mockDataLoader: any

  beforeEach(async () => {
    vi.clearAllMocks()

    // Create mock data with perk-skill mappings
    const mockData = {
      perks: [
        {
          name: 'LoreRim v3.0.4',
          perkListId: 0,
          skillNames: ['Smithing', 'Heavy Armor', 'Block'],
          perks: [
            {
              name: 'Craftsmanship',
              skill: 0,
              skillReq: 0,
              description: 'Basic crafting',
            },
            {
              name: 'Conditioning',
              skill: 1,
              skillReq: 0,
              description: 'Basic armor',
            },
            {
              name: 'Improved Blocking',
              skill: 2,
              skillReq: 0,
              description: 'Better blocking',
            },
          ],
        },
      ],
    }

    mockDataLoader = {
      loadAllData: vi.fn().mockResolvedValue(mockData),
    }
    ;(GigaPlannerDataLoader as any).mockImplementation(() => mockDataLoader)

    transformer = new AdvancedGigaPlannerTransformer()
    await transformer.initialize()
  })

  describe('initialization', () => {
    it('should initialize successfully and build perk-skill map', async () => {
      expect(mockDataLoader.loadAllData).toHaveBeenCalled()

      const mappings = transformer.getPerkSkillMappings()
      expect(mappings).toEqual({
        Craftsmanship: 'Smithing',
        Conditioning: 'Heavy Armor',
        'Improved Blocking': 'Block',
      })
    })

    it('should throw error if data loading fails', async () => {
      mockDataLoader.loadAllData.mockRejectedValue(
        new Error('Data loading failed')
      )

      const newTransformer = new AdvancedGigaPlannerTransformer()
      await expect(newTransformer.initialize()).rejects.toThrow(
        'Failed to initialize AdvancedGigaPlannerTransformer'
      )
    })
  })

  describe('transformGigaPlannerToBuildState', () => {
    it('should transform with accurate perk-skill mapping', () => {
      const gigaPlannerCharacter = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [
          { skill: 'Smithing', level: 100 },
          { skill: 'Heavy Armor', level: 75 },
        ],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: ['Craftsmanship', 'Conditioning'],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result =
        transformer.transformGigaPlannerToBuildState(gigaPlannerCharacter)

      expect(result.success).toBe(true)
      expect(result.data?.perks?.selected).toEqual({
        Smithing: ['Craftsmanship'],
        'Heavy Armor': ['Conditioning'],
      })
    })
  })

  describe('transformBuildStateToGigaPlanner', () => {
    it('should transform with validation', () => {
      const buildState: BuildState = {
        race: 'Nord',
        attributeAssignments: {
          level: 50,
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        perks: {
          selected: {
            Smithing: ['Craftsmanship'],
            'Heavy Armor': ['Conditioning'],
          },
        },
      }

      const result = transformer.transformBuildStateToGigaPlanner(buildState)

      expect(result.success).toBe(true)
      expect(result.data?.perks).toEqual(['Craftsmanship', 'Conditioning'])
    })

    it('should validate perk-skill relationships', () => {
      const buildState: BuildState = {
        race: 'Nord',
        attributeAssignments: {
          level: 50,
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        perks: {
          selected: {
            Smithing: ['Conditioning'], // Wrong skill for this perk
          },
        },
      }

      const result = transformer.transformBuildStateToGigaPlanner(buildState)

      expect(result.success).toBe(true)
      expect(result.warnings).toContain(
        'Perk Conditioning belongs to Heavy Armor, not Smithing'
      )
    })
  })

  describe('utility methods', () => {
    it('should get perks for skill', () => {
      const perks = transformer.getPerksForSkill('Smithing')
      expect(perks).toEqual(['Craftsmanship'])
    })

    it('should get skills with perks', () => {
      const skills = transformer.getSkillsWithPerks()
      expect(skills).toEqual(['Smithing', 'Heavy Armor', 'Block'])
    })
  })
})
