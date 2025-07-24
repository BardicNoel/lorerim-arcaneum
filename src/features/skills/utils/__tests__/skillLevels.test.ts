import { describe, it, expect, vi } from 'vitest'
import { calculateMinimumSkillLevel, calculateAllSkillLevels } from '../skillLevels'

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
              subtext: 'You understand material properties.'
            },
            prerequisites: {
              items: [{ type: 'INGR', id: '0x8C35B997' }]
            }
          }
        ],
        totalRanks: 1,
        connections: { parents: [], children: ['REQ_Smithing_DwarvenSmithing'] },
        isRoot: false,
        position: { x: 4, y: 2, horizontal: -0.085, vertical: -0.085 }
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
              subtext: 'You have the secret knowledge.'
            },
            prerequisites: {
              skillLevel: { skill: 'Smithing', level: 25 },
              items: [{ type: 'INGR', id: '0x8C05CBC7' }]
            }
          }
        ],
        totalRanks: 1,
        connections: { parents: ['REQ_Smithing_Craftsmanship'], children: [] },
        isRoot: false,
        position: { x: 2, y: 2, horizontal: -0.071, vertical: -0.057 }
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
              subtext: 'You have studied the almanac.'
            },
            prerequisites: {
              skillLevel: { skill: 'Smithing', level: 50 },
              items: [{ type: 'INGR', id: '0x8C05CBCA' }]
            }
          }
        ],
        totalRanks: 1,
        connections: { parents: ['REQ_Smithing_DwarvenSmithing'], children: [] },
        isRoot: false,
        position: { x: 2, y: 3, horizontal: -0.042, vertical: -0.071 }
      }
    ]
  }
]

// Mock the perk trees data import
vi.mock('../../../public/data/perk-trees.json', () => ({
  default: mockPerkTreesData
}))

describe('skillLevels', () => {
  describe('calculateMinimumSkillLevel', () => {
    it('should return 0 when no perks are selected', () => {
      const result = calculateMinimumSkillLevel('AVSmithing', [], {})
      expect(result).toBe(0)
    })

    it('should return 0 when skill tree is not found', () => {
      const result = calculateMinimumSkillLevel('NonExistentSkill', ['some-perk'], {})
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
        { 'REQ_Smithing_DwarvenSmithing': 1 }
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
          'AVSmithing': ['REQ_Smithing_DwarvenSmithing', 'REQ_Smithing_OrcishSmithing'],
          'AVHeavyArmor': ['REQ_HeavyArmor_Conditioning']
        },
        ranks: {}
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
          'AVSmithing': ['REQ_Smithing_Craftsmanship']
        },
        ranks: {}
      }
      
      const result = calculateAllSkillLevels(perks)
      
      // Should not include skills with no level requirements
      expect(result['AVSmithing']).toBeUndefined()
    })
  })
}) 