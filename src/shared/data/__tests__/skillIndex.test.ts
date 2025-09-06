import { describe, it, expect } from 'vitest'
import {
  SKILL_INDEX,
  SKILL_INDEX_REVERSE,
  skillIdToIndex,
  indexToSkillId,
  skillIdsToIndexes,
  indexesToSkillIds,
  skillIdObjectToIndexObject,
  indexObjectToSkillIdObject,
  skillsToIndexes,
  skillsFromIndexes,
  skillLevelsToIndexes,
  skillLevelsFromIndexes,
  perksToIndexes,
  perksFromIndexes,
  compactPerksToIndexes,
  compactPerksFromIndexes,
  getSkillCount,
  isValidSkillIndex,
  getAllSkillIds,
  getAllSkillIndexes,
} from '../skillIndex'

describe('Skill Index System', () => {
  describe('Basic Index Mappings', () => {
    it('should have correct skill index mapping', () => {
      expect(SKILL_INDEX[0]).toBe('AVSmithing')
      expect(SKILL_INDEX[1]).toBe('AVDestruction')
      expect(SKILL_INDEX[17]).toBe('AVOneHanded')
    })

    it('should have correct reverse mapping', () => {
      expect(SKILL_INDEX_REVERSE['AVSmithing']).toBe(0)
      expect(SKILL_INDEX_REVERSE['AVDestruction']).toBe(1)
      expect(SKILL_INDEX_REVERSE['AVOneHanded']).toBe(17)
    })

    it('should have 18 skills total', () => {
      expect(SKILL_INDEX.length).toBe(18)
      expect(getSkillCount()).toBe(18)
    })
  })

  describe('skillIdToIndex', () => {
    it('should convert valid skill IDs to indexes', () => {
      expect(skillIdToIndex('AVSmithing')).toBe(0)
      expect(skillIdToIndex('AVDestruction')).toBe(1)
      expect(skillIdToIndex('AVOneHanded')).toBe(17)
    })

    it('should return null for invalid skill IDs', () => {
      expect(skillIdToIndex('InvalidSkill')).toBe(null)
      expect(skillIdToIndex('')).toBe(null)
    })
  })

  describe('indexToSkillId', () => {
    it('should convert valid indexes to skill IDs', () => {
      expect(indexToSkillId(0)).toBe('AVSmithing')
      expect(indexToSkillId(1)).toBe('AVDestruction')
      expect(indexToSkillId(17)).toBe('AVOneHanded')
    })

    it('should return null for invalid indexes', () => {
      expect(indexToSkillId(-1)).toBe(null)
      expect(indexToSkillId(18)).toBe(null)
      expect(indexToSkillId(999)).toBe(null)
    })
  })

  describe('skillIdsToIndexes', () => {
    it('should convert array of skill IDs to indexes', () => {
      const skillIds = ['AVSmithing', 'AVDestruction', 'AVEnchanting']
      const expected = [0, 1, 2]
      expect(skillIdsToIndexes(skillIds)).toEqual(expected)
    })

    it('should filter out invalid skill IDs', () => {
      const skillIds = ['AVSmithing', 'InvalidSkill', 'AVDestruction']
      const expected = [0, 1]
      expect(skillIdsToIndexes(skillIds)).toEqual(expected)
    })

    it('should handle empty array', () => {
      expect(skillIdsToIndexes([])).toEqual([])
    })
  })

  describe('indexesToSkillIds', () => {
    it('should convert array of indexes to skill IDs', () => {
      const indexes = [0, 1, 2]
      const expected = ['AVSmithing', 'AVDestruction', 'AVEnchanting']
      expect(indexesToSkillIds(indexes)).toEqual(expected)
    })

    it('should filter out invalid indexes', () => {
      const indexes = [0, 999, 1]
      const expected = ['AVSmithing', 'AVDestruction']
      expect(indexesToSkillIds(indexes)).toEqual(expected)
    })

    it('should handle empty array', () => {
      expect(indexesToSkillIds([])).toEqual([])
    })
  })

  describe('skillIdObjectToIndexObject', () => {
    it('should convert skill ID object to index object', () => {
      const skillIdObj = {
        'AVSmithing': 25,
        'AVDestruction': 30,
        'AVEnchanting': 15,
      }
      const expected = {
        0: 25,
        1: 30,
        2: 15,
      }
      expect(skillIdObjectToIndexObject(skillIdObj)).toEqual(expected)
    })

    it('should filter out invalid skill IDs', () => {
      const skillIdObj = {
        'AVSmithing': 25,
        'InvalidSkill': 30,
        'AVDestruction': 15,
      }
      const expected = {
        0: 25,
        1: 15,
      }
      expect(skillIdObjectToIndexObject(skillIdObj)).toEqual(expected)
    })
  })

  describe('indexObjectToSkillIdObject', () => {
    it('should convert index object to skill ID object', () => {
      const indexObj = {
        0: 25,
        1: 30,
        2: 15,
      }
      const expected = {
        'AVSmithing': 25,
        'AVDestruction': 30,
        'AVEnchanting': 15,
      }
      expect(indexObjectToSkillIdObject(indexObj)).toEqual(expected)
    })

    it('should filter out invalid indexes', () => {
      const indexObj = {
        0: 25,
        999: 30,
        1: 15,
      }
      const expected = {
        'AVSmithing': 25,
        'AVDestruction': 15,
      }
      expect(indexObjectToSkillIdObject(indexObj)).toEqual(expected)
    })
  })

  describe('skillsToIndexes', () => {
    it('should convert skills object to index format', () => {
      const skills = {
        major: ['AVSmithing', 'AVDestruction'],
        minor: ['AVEnchanting', 'AVRestoration', 'AVMysticism'],
      }
      const expected = {
        major: [0, 1],
        minor: [2, 3, 4],
      }
      expect(skillsToIndexes(skills)).toEqual(expected)
    })
  })

  describe('skillsFromIndexes', () => {
    it('should convert skills object from index format', () => {
      const skills = {
        major: [0, 1],
        minor: [2, 3, 4],
      }
      const expected = {
        major: ['AVSmithing', 'AVDestruction'],
        minor: ['AVEnchanting', 'AVRestoration', 'AVMysticism'],
      }
      expect(skillsFromIndexes(skills)).toEqual(expected)
    })
  })

  describe('skillLevelsToIndexes', () => {
    it('should convert skill levels object to index format', () => {
      const skillLevels = {
        'AVSmithing': 25,
        'AVDestruction': 30,
        'AVEnchanting': 15,
      }
      const expected = {
        0: 25,
        1: 30,
        2: 15,
      }
      expect(skillLevelsToIndexes(skillLevels)).toEqual(expected)
    })
  })

  describe('skillLevelsFromIndexes', () => {
    it('should convert skill levels object from index format', () => {
      const skillLevels = {
        0: 25,
        1: 30,
        2: 15,
      }
      const expected = {
        'AVSmithing': 25,
        'AVDestruction': 30,
        'AVEnchanting': 15,
      }
      expect(skillLevelsFromIndexes(skillLevels)).toEqual(expected)
    })
  })

  describe('perksToIndexes', () => {
    it('should convert perks object to index format', () => {
      const perks = {
        selected: {
          'AVSmithing': ['perk1', 'perk2'],
          'AVDestruction': ['perk3'],
        },
        ranks: {
          'perk1': 2,
          'perk2': 1,
          'perk3': 3,
        },
      }
      const expected = {
        selected: {
          0: ['perk1', 'perk2'],
          1: ['perk3'],
        },
        ranks: {
          'perk1': 2,
          'perk2': 1,
          'perk3': 3,
        },
      }
      expect(perksToIndexes(perks)).toEqual(expected)
    })
  })

  describe('perksFromIndexes', () => {
    it('should convert perks object from index format', () => {
      const perks = {
        selected: {
          0: ['perk1', 'perk2'],
          1: ['perk3'],
        },
        ranks: {
          'perk1': 2,
          'perk2': 1,
          'perk3': 3,
        },
      }
      const expected = {
        selected: {
          'AVSmithing': ['perk1', 'perk2'],
          'AVDestruction': ['perk3'],
        },
        ranks: {
          'perk1': 2,
          'perk2': 1,
          'perk3': 3,
        },
      }
      expect(perksFromIndexes(perks)).toEqual(expected)
    })
  })

  describe('compactPerksToIndexes', () => {
    it('should convert compact perks object to index format', () => {
      const compactPerks = {
        'AVSmithing': [0, 1, 2],
        'AVDestruction': [0, 12],
      }
      const expected = {
        0: [0, 1, 2],
        1: [0, 12],
      }
      expect(compactPerksToIndexes(compactPerks)).toEqual(expected)
    })
  })

  describe('compactPerksFromIndexes', () => {
    it('should convert compact perks object from index format', () => {
      const compactPerks = {
        0: [0, 1, 2],
        1: [0, 12],
      }
      const expected = {
        'AVSmithing': [0, 1, 2],
        'AVDestruction': [0, 12],
      }
      expect(compactPerksFromIndexes(compactPerks)).toEqual(expected)
    })
  })

  describe('Utility Functions', () => {
    it('should validate skill indexes correctly', () => {
      expect(isValidSkillIndex(0)).toBe(true)
      expect(isValidSkillIndex(17)).toBe(true)
      expect(isValidSkillIndex(-1)).toBe(false)
      expect(isValidSkillIndex(18)).toBe(false)
      expect(isValidSkillIndex(999)).toBe(false)
    })

    it('should get all skill IDs', () => {
      const allSkillIds = getAllSkillIds()
      expect(allSkillIds).toHaveLength(18)
      expect(allSkillIds[0]).toBe('AVSmithing')
      expect(allSkillIds[17]).toBe('AVOneHanded')
    })

    it('should get all skill indexes', () => {
      const allIndexes = getAllSkillIndexes()
      expect(allIndexes).toHaveLength(18)
      expect(allIndexes[0]).toBe(0)
      expect(allIndexes[17]).toBe(17)
    })
  })

  describe('Round-trip Conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalSkills = {
        major: ['AVSmithing', 'AVDestruction'],
        minor: ['AVEnchanting', 'AVRestoration', 'AVMysticism'],
      }

      const indexedSkills = skillsToIndexes(originalSkills)
      const convertedBack = skillsFromIndexes(indexedSkills)

      expect(convertedBack).toEqual(originalSkills)
    })

    it('should maintain data integrity for skill levels', () => {
      const originalSkillLevels = {
        'AVSmithing': 25,
        'AVDestruction': 30,
        'AVEnchanting': 15,
      }

      const indexedSkillLevels = skillLevelsToIndexes(originalSkillLevels)
      const convertedBack = skillLevelsFromIndexes(indexedSkillLevels)

      expect(convertedBack).toEqual(originalSkillLevels)
    })

    it('should maintain data integrity for perks', () => {
      const originalPerks = {
        selected: {
          'AVSmithing': ['perk1', 'perk2'],
          'AVDestruction': ['perk3'],
        },
        ranks: {
          'perk1': 2,
          'perk2': 1,
          'perk3': 3,
        },
      }

      const indexedPerks = perksToIndexes(originalPerks)
      const convertedBack = perksFromIndexes(indexedPerks)

      expect(convertedBack).toEqual(originalPerks)
    })

    it('should maintain data integrity for compact perks', () => {
      const originalCompactPerks = {
        'AVSmithing': [0, 1, 2],
        'AVDestruction': [0, 12],
      }

      const indexedCompactPerks = compactPerksToIndexes(originalCompactPerks)
      const convertedBack = compactPerksFromIndexes(indexedCompactPerks)

      expect(convertedBack).toEqual(originalCompactPerks)
    })
  })
})
