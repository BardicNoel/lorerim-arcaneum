import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import { useRacesStore } from '@/shared/stores/racesStore'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  calculateAllSkillLevels,
  calculateMinimumSkillLevel,
  calculateStartingSkillLevel,
  calculateTotalSkillLevel,
} from '../skillLevels'

// Mock perk trees data for testing
const mockPerkTreesData = [
  {
    treeId: 'AVSmithing',
    treeName: 'Smithing',
    treeDescription: 'The art of creating and improving weapons and armor.',
    category: 'Combat',
    perks: [
      {
        edid: 'REQ_Smithing_Craftsmanship',
        name: 'Craftsmanship',
        ranks: [
          {
            rank: 1,
            edid: 'REQ_Smithing_Craftsmanship',
            name: 'Craftsmanship',
            description: {
              base: 'You know how to use tools.',
              subtext: 'You understand material properties.',
            },
            prerequisites: {
              items: [{ type: 'INGR', id: '0x8C35B997' }],
            },
          },
        ],
        totalRanks: 1,
        connections: {
          parents: [],
          children: ['REQ_Smithing_DwarvenSmithing'],
        },
        isRoot: false,
        position: { x: 4, y: 2, horizontal: -0.085, vertical: -0.085 },
      },
      {
        edid: 'REQ_Smithing_DwarvenSmithing',
        name: 'Dwarven Smithing',
        ranks: [
          {
            rank: 1,
            edid: 'REQ_Smithing_DwarvenSmithing',
            name: 'Dwarven Smithing',
            description: {
              base: 'You can create Dwarven equipment.',
              subtext: 'You have the secret knowledge.',
            },
            prerequisites: {
              skillLevel: { skill: 'Smithing', level: 25 },
              items: [{ type: 'INGR', id: '0x8C05CBC7' }],
            },
          },
        ],
        totalRanks: 1,
        connections: { parents: ['REQ_Smithing_Craftsmanship'], children: [] },
        isRoot: false,
        position: { x: 2, y: 2, horizontal: -0.071, vertical: -0.057 },
      },
      {
        edid: 'REQ_Smithing_OrcishSmithing',
        name: 'Orcish Smithing',
        ranks: [
          {
            rank: 1,
            edid: 'REQ_Smithing_OrcishSmithing',
            name: 'Orcish Smithing',
            description: {
              base: 'You can craft Orcish equipment.',
              subtext: 'You have studied the almanac.',
            },
            prerequisites: {
              skillLevel: { skill: 'Smithing', level: 50 },
              items: [{ type: 'INGR', id: '0x8C05CBCA' }],
            },
          },
        ],
        totalRanks: 1,
        connections: {
          parents: ['REQ_Smithing_DwarvenSmithing'],
          children: [],
        },
        isRoot: false,
        position: { x: 2, y: 3, horizontal: -0.042, vertical: -0.071 },
      },
    ],
  },
]

// Mock race data for testing
const mockRacesData = [
  {
    edid: 'HighElfRace',
    name: 'Altmer',
    skillBonuses: [
      { skill: 'Alteration', bonus: 15 },
      { skill: 'Conjuration', bonus: 10 },
      { skill: 'Destruction', bonus: 10 },
      { skill: 'Illusion', bonus: 10 },
      { skill: 'Restoration', bonus: 10 },
      { skill: 'Enchanting', bonus: 10 },
    ],
  },
  {
    edid: 'ImperialRace',
    name: 'Imperial',
    skillBonuses: [
      { skill: 'One-Handed', bonus: 10 },
      { skill: 'Block', bonus: 10 },
      { skill: 'Heavy Armor', bonus: 10 },
      { skill: 'Speechcraft', bonus: 15 },
      { skill: 'Destruction', bonus: 10 },
      { skill: 'Restoration', bonus: 10 },
    ],
  },
]

beforeEach(() => {
  // Seed the zustand store with mock perk trees data expected by skillLevels.ts
  usePerkTreesStore.setState({
    data: mockPerkTreesData as any,
    loading: false,
    error: null,
  })

  // Seed the zustand store with mock races data
  useRacesStore.setState({
    data: mockRacesData as any,
    loading: false,
    error: null,
  })
})

afterEach(() => {
  // Reset store after each test to avoid cross-test contamination
  usePerkTreesStore.setState({ data: [], loading: false, error: null })
  useRacesStore.setState({ data: [], loading: false, error: null })
})

describe('skillLevels', () => {
  describe('calculateStartingSkillLevel', () => {
    it('should calculate correct starting level for Altmer with major skill', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['Alteration'], minor: [] },
      } as any
      const result = calculateStartingSkillLevel('Alteration', build)
      expect(result).toBe(25) // 0 + 15 (race) + 10 (major)
    })

    it('should calculate correct starting level for Imperial with minor skill', () => {
      const build = {
        race: 'ImperialRace',
        skills: { major: [], minor: ['One-Handed'] },
      } as any
      const result = calculateStartingSkillLevel('One-Handed', build)
      expect(result).toBe(15) // 0 + 10 (race) + 5 (minor)
    })

    it('should handle no race selected, major skill', () => {
      const build = {
        race: null,
        skills: { major: ['One-Handed'], minor: [] },
      } as any
      const result = calculateStartingSkillLevel('One-Handed', build)
      expect(result).toBe(10) // 0 + 0 + 10 (major)
    })

    it('should handle no race selected, minor skill', () => {
      const build = {
        race: null,
        skills: { major: [], minor: ['Alteration'] },
      } as any
      const result = calculateStartingSkillLevel('Alteration', build)
      expect(result).toBe(5) // 0 + 0 + 5 (minor)
    })

    it('should handle no race selected, unassigned skill', () => {
      const build = {
        race: null,
        skills: { major: [], minor: [] },
      } as any
      const result = calculateStartingSkillLevel('Alteration', build)
      expect(result).toBe(0) // 0 + 0 + 0
    })

    it('should handle race with no bonus for skill', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['One-Handed'], minor: [] },
      } as any
      const result = calculateStartingSkillLevel('One-Handed', build)
      expect(result).toBe(10) // 0 + 0 + 10 (major)
    })

    it('should prioritize major over minor skill assignment', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['Alteration'], minor: ['Alteration'] },
      } as any
      const result = calculateStartingSkillLevel('Alteration', build)
      expect(result).toBe(25) // 0 + 15 (race) + 10 (major) - should not double count
    })
  })

  describe('calculateTotalSkillLevel', () => {
    it('should combine starting level with perk levels', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['AVSmithing'], minor: [] },
        perks: {
          selected: { AVSmithing: ['REQ_Smithing_DwarvenSmithing'] },
          ranks: {},
        },
      } as any
      const result = calculateTotalSkillLevel('AVSmithing', build)
      expect(result).toBe(35) // 10 (starting) + 25 (perk requirement)
    })

    it('should return starting level when no perks selected', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['Alteration'], minor: [] },
        perks: { selected: {}, ranks: {} },
      } as any
      const result = calculateTotalSkillLevel('Alteration', build)
      expect(result).toBe(25) // 25 (starting) + 0 (no perks)
    })

    it('should handle no race and no perks', () => {
      const build = {
        race: null,
        skills: { major: ['One-Handed'], minor: [] },
        perks: { selected: {}, ranks: {} },
      } as any
      const result = calculateTotalSkillLevel('One-Handed', build)
      expect(result).toBe(10) // 10 (starting) + 0 (no perks)
    })

    it('should handle multiple perks with different requirements', () => {
      const build = {
        race: 'HighElfRace',
        skills: { major: ['AVSmithing'], minor: [] },
        perks: {
          selected: {
            AVSmithing: [
              'REQ_Smithing_DwarvenSmithing',
              'REQ_Smithing_OrcishSmithing',
            ],
          },
          ranks: {},
        },
      } as any
      const result = calculateTotalSkillLevel('AVSmithing', build)
      expect(result).toBe(60) // 10 (starting) + 50 (highest perk requirement)
    })
  })

  describe('calculateMinimumSkillLevel', () => {
    it('should return 0 when no perks are selected', () => {
      const result = calculateMinimumSkillLevel('AVSmithing', [], {})
      expect(result).toBe(0)
    })

    it('should return 0 when skill tree is not found', () => {
      const result = calculateMinimumSkillLevel(
        'NonExistentSkill',
        ['some-perk'],
        {}
      )
      expect(result).toBe(0)
    })

    it('should return 0 when selected perk has no skill level requirement', () => {
      const result = calculateMinimumSkillLevel(
        'AVSmithing',
        ['REQ_Smithing_Craftsmanship'],
        {}
      )
      expect(result).toBe(0)
    })

    it('should return the skill level requirement for a single perk', () => {
      const result = calculateMinimumSkillLevel(
        'AVSmithing',
        ['REQ_Smithing_DwarvenSmithing'],
        {}
      )
      expect(result).toBe(25)
    })

    it('should return the highest skill level requirement when multiple perks are selected', () => {
      const result = calculateMinimumSkillLevel(
        'AVSmithing',
        ['REQ_Smithing_DwarvenSmithing', 'REQ_Smithing_OrcishSmithing'],
        {}
      )
      expect(result).toBe(50)
    })

    it('should use the current rank when calculating requirements', () => {
      const result = calculateMinimumSkillLevel(
        'AVSmithing',
        ['REQ_Smithing_DwarvenSmithing'],
        { REQ_Smithing_DwarvenSmithing: 1 }
      )
      expect(result).toBe(25)
    })

    it('should default to rank 1 when rank is not specified', () => {
      const result = calculateMinimumSkillLevel(
        'AVSmithing',
        ['REQ_Smithing_DwarvenSmithing'],
        {}
      )
      expect(result).toBe(25)
    })
  })

  describe('calculateAllSkillLevels', () => {
    it('should return empty object when no perks are selected', () => {
      const result = calculateAllSkillLevels({ selected: {}, ranks: {} })
      expect(result).toEqual({})
    })

    it('should calculate skill levels for multiple skills', () => {
      const perks = {
        selected: {
          AVSmithing: [
            'REQ_Smithing_DwarvenSmithing',
            'REQ_Smithing_OrcishSmithing',
          ],
          AVHeavyArmor: ['REQ_HeavyArmor_Conditioning'],
        },
        ranks: {},
      }

      const result = calculateAllSkillLevels(perks)

      // Should include AVSmithing with level 50 (highest requirement)
      expect(result['AVSmithing']).toBe(50)

      // Should not include AVHeavyArmor since it's not in our mock data
      expect(result['AVHeavyArmor']).toBeUndefined()
    })

    it('should handle perks with no skill level requirements', () => {
      const perks = {
        selected: {
          AVSmithing: ['REQ_Smithing_Craftsmanship'],
        },
        ranks: {},
      }

      const result = calculateAllSkillLevels(perks)

      // Should not include skills with no level requirements
      expect(result['AVSmithing']).toBeUndefined()
    })
  })
})

// Integration test to verify the complete skill level system works correctly
describe('Skill Level System Integration', () => {
  it('should correctly calculate starting skill levels for major and minor skills', () => {
    const build = {
      race: null, // No race to avoid race bonus complexity in test
      skills: { major: ['AVSmithing', 'AVAlchemy'], minor: ['AVEnchanting'] },
      perks: { selected: {}, ranks: {} }, // No perks to avoid perk requirement complexity
    } as any

    const smithingStarting = calculateStartingSkillLevel('AVSmithing', build)
    const alchemyStarting = calculateStartingSkillLevel('AVAlchemy', build)
    const enchantingStarting = calculateStartingSkillLevel(
      'AVEnchanting',
      build
    )
    const unassignedStarting = calculateStartingSkillLevel('AVOneHanded', build)

    const smithingTotal = calculateTotalSkillLevel('AVSmithing', build)
    const alchemyTotal = calculateTotalSkillLevel('AVAlchemy', build)
    const enchantingTotal = calculateTotalSkillLevel('AVEnchanting', build)
    const unassignedTotal = calculateTotalSkillLevel('AVOneHanded', build)

    // Verify starting levels (no race bonus)
    expect(smithingStarting).toBe(10) // Major skill gives +10
    expect(alchemyStarting).toBe(10) // Major skill gives +10
    expect(enchantingStarting).toBe(5) // Minor skill gives +5
    expect(unassignedStarting).toBe(0) // Unassigned skill gives +0

    // Verify total levels equal starting levels when no perks are selected
    expect(smithingTotal).toBe(10) // Starting level only
    expect(alchemyTotal).toBe(10) // Starting level only
    expect(enchantingTotal).toBe(5) // Starting level only
    expect(unassignedTotal).toBe(0) // Starting level only

    // Verify that major skills have higher levels than minor skills
    expect(smithingStarting).toBeGreaterThan(enchantingStarting)
    expect(alchemyStarting).toBeGreaterThan(enchantingStarting)

    // Verify that assigned skills have higher levels than unassigned skills
    expect(enchantingStarting).toBeGreaterThan(unassignedStarting)
  })
})
