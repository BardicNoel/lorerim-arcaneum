import { describe, it, expect } from 'vitest'
import { validateBuild, isValidBuild } from './validateBuild'
import type { BuildState } from '../types/build'

describe('validateBuild', () => {
  it('should return default structure for null/undefined input', () => {
    const result1 = validateBuild(null)
    const result2 = validateBuild(undefined)
    
    expect(result1.v).toBe(1)
    expect(result1.skills.major).toEqual([])
    expect(result1.skills.minor).toEqual([])
    expect(result1.traits.regular).toEqual([])
    expect(result1.traits.bonus).toEqual([])
    
    expect(result2).toEqual(result1)
  })

  it('should handle corrupted skills arrays', () => {
    const corruptedBuild = {
      v: 1,
      skills: {
        major: 'not an array', // Corrupted: should be array
        minor: null, // Corrupted: should be array
      }
    }
    
    const result = validateBuild(corruptedBuild)
    
    expect(result.skills.major).toEqual([])
    expect(result.skills.minor).toEqual([])
    expect(Array.isArray(result.skills.major)).toBe(true)
    expect(Array.isArray(result.skills.minor)).toBe(true)
  })

  it('should handle corrupted traits arrays', () => {
    const corruptedBuild = {
      v: 1,
      traits: {
        regular: undefined, // Corrupted: should be array
        bonus: 'invalid', // Corrupted: should be array
      }
    }
    
    const result = validateBuild(corruptedBuild)
    
    expect(result.traits.regular).toEqual([])
    expect(result.traits.bonus).toEqual([])
    expect(Array.isArray(result.traits.regular)).toBe(true)
    expect(Array.isArray(result.traits.bonus)).toBe(true)
  })

  it('should handle corrupted perks objects', () => {
    const corruptedBuild = {
      v: 1,
      perks: {
        selected: 'not an object', // Corrupted: should be object
        ranks: null, // Corrupted: should be object
      }
    }
    
    const result = validateBuild(corruptedBuild)
    
    expect(result.perks.selected).toEqual({})
    expect(result.perks.ranks).toEqual({})
    expect(typeof result.perks.selected).toBe('object')
    expect(typeof result.perks.ranks).toBe('object')
  })

  it('should handle corrupted attribute assignments', () => {
    const corruptedBuild = {
      v: 1,
      attributeAssignments: {
        health: 'invalid', // Corrupted: should be number
        stamina: NaN, // Corrupted: should be number
        magicka: Infinity, // Corrupted: should be finite number
        level: -5, // Corrupted: should be positive
        assignments: 'not an object', // Corrupted: should be object
      }
    }
    
    const result = validateBuild(corruptedBuild)
    
    expect(result.attributeAssignments.health).toBe(0)
    expect(result.attributeAssignments.stamina).toBe(0)
    expect(result.attributeAssignments.magicka).toBe(0)
    expect(result.attributeAssignments.level).toBe(1)
    expect(result.attributeAssignments.assignments).toEqual({})
  })

  it('should preserve valid data', () => {
    const validBuild: Partial<BuildState> = {
      v: 1,
      name: 'Test Character',
      race: 'nord',
      skills: {
        major: ['one-handed', 'two-handed'],
        minor: ['block', 'heavyarmor']
      },
      traits: {
        regular: ['warrior'],
        bonus: []
      },
      perks: {
        selected: { 'one-handed': ['one_handed_01'] },
        ranks: { 'one_handed_01': 1 }
      }
    }
    
    const result = validateBuild(validBuild)
    
    expect(result.name).toBe('Test Character')
    expect(result.race).toBe('nord')
    expect(result.skills.major).toEqual(['one-handed', 'two-handed'])
    expect(result.skills.minor).toEqual(['block', 'heavyarmor'])
    expect(result.traits.regular).toEqual(['warrior'])
    expect(result.traits.bonus).toEqual([])
    expect(result.perks.selected['one-handed']).toEqual(['one_handed_01'])
    expect(result.perks.ranks['one_handed_01']).toBe(1)
  })

  it('should filter out invalid array entries', () => {
    const corruptedBuild = {
      v: 1,
      skills: {
        major: ['valid', null, 'also-valid', undefined, '', '  ', 'final-valid'],
        minor: [123, 'valid', false, 'another-valid']
      }
    }
    
    const result = validateBuild(corruptedBuild)
    
    expect(result.skills.major).toEqual(['valid', 'also-valid', 'final-valid'])
    expect(result.skills.minor).toEqual(['valid', 'another-valid'])
  })

  it('should handle mixed valid and corrupted data', () => {
    const mixedBuild = {
      v: 1,
      name: 'Mixed Character',
      // Missing skills - should get defaults
      // Missing traits - should get defaults
      perks: {
        selected: { 'archery': ['archery_01', null, 'archery_02'] },
        ranks: { 'archery_01': 1, 'invalid_key': 'not a number' }
      }
    }
    
    const result = validateBuild(mixedBuild)
    
    expect(result.name).toBe('Mixed Character')
    expect(result.skills.major).toEqual([])
    expect(result.skills.minor).toEqual([])
    expect(result.traits.regular).toEqual([])
    expect(result.traits.bonus).toEqual([])
    expect(result.perks.selected['archery']).toEqual(['archery_01', 'archery_02'])
    expect(result.perks.ranks['archery_01']).toBe(1)
    expect(result.perks.ranks['invalid_key']).toBeUndefined()
  })

  it('should handle missing properties gracefully', () => {
    const minimalBuild = {
      v: 1,
      name: 'Minimal Character'
      // Missing all other properties
    }
    
    const result = validateBuild(minimalBuild)
    
    expect(result.name).toBe('Minimal Character')
    expect(result.skills.major).toEqual([])
    expect(result.skills.minor).toEqual([])
    expect(result.traits.regular).toEqual([])
    expect(result.traits.bonus).toEqual([])
    expect(result.perks.selected).toEqual({})
    expect(result.perks.ranks).toEqual({})
    expect(result.attributeAssignments.health).toBe(0)
    expect(result.attributeAssignments.level).toBe(1)
  })

  it('should handle deeply nested corrupted data', () => {
    const deeplyCorruptedBuild = {
      v: 1,
      skills: {
        major: [
          'valid-skill',
          { invalid: 'object' },
          ['nested', 'array'],
          null,
          undefined
        ],
        minor: 'not-an-array'
      },
      perks: {
        selected: {
          'valid-skill': ['valid-perk'],
          'corrupted-skill': 'not-an-array',
          'null-skill': null
        },
        ranks: {
          'valid-perk': 1,
          'invalid-perk': 'not-a-number',
          'null-perk': null
        }
      }
    }
    
    const result = validateBuild(deeplyCorruptedBuild)
    
    // Should filter out invalid entries
    expect(result.skills.major).toEqual(['valid-skill'])
    expect(result.skills.minor).toEqual([])
    
    // Should preserve valid perk data
    expect(result.perks.selected['valid-skill']).toEqual(['valid-perk'])
    expect(result.perks.selected['corrupted-skill']).toBeUndefined()
    expect(result.perks.selected['null-skill']).toBeUndefined()
    
    // Should preserve valid rank data
    expect(result.perks.ranks['valid-perk']).toBe(1)
    expect(result.perks.ranks['invalid-perk']).toBeUndefined()
    expect(result.perks.ranks['null-perk']).toBeUndefined()
  })
})

describe('isValidBuild', () => {
  it('should return true for valid build', () => {
    const validBuild: BuildState = {
      v: 1,
      name: 'Test',
      notes: '',
      race: null,
      stone: null,
      religion: null,
      favoriteBlessing: null,
      traits: { regular: [], bonus: [] },
      traitLimits: { regular: 2, bonus: 1 },
      skills: { major: [], minor: [] },
      perks: { selected: {}, ranks: {} },
      skillLevels: {},
      equipment: [],
      userProgress: { unlocks: [] },
      destinyPath: [],
      attributeAssignments: {
        health: 0,
        stamina: 0,
        magicka: 0,
        level: 1,
        assignments: {}
      }
    }
    
    expect(isValidBuild(validBuild)).toBe(true)
  })

  it('should return false for invalid build', () => {
    expect(isValidBuild(null)).toBe(false)
    expect(isValidBuild(undefined)).toBe(false)
    expect(isValidBuild({})).toBe(false)
    expect(isValidBuild({ v: 1 })).toBe(false)
    expect(isValidBuild({ v: 1, name: 'Test' })).toBe(false)
  })

  it('should return false for builds with corrupted arrays', () => {
    const corruptedBuild = {
      v: 1,
      name: 'Test',
      skills: {
        major: 'not an array',
        minor: []
      },
      traits: {
        regular: [],
        bonus: []
      }
    }
    
    expect(isValidBuild(corruptedBuild)).toBe(false)
  })

  it('should return false for builds with missing required properties', () => {
    const incompleteBuild = {
      v: 1,
      name: 'Test',
      skills: {
        major: [],
        // Missing minor skills
      },
      traits: {
        regular: [],
        bonus: []
      }
    }
    
    expect(isValidBuild(incompleteBuild)).toBe(false)
  })
})
