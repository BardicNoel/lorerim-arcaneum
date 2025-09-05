import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { migrateToCompactFormat, migrateToLegacyFormat, isCompactFormat } from '../compactPerkEncoding'
import { DEFAULT_BUILD } from '../../types/build'

describe('Version 2 Migration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('migrateToCompactFormat', () => {
    it('should migrate legacy build to compact format with version 2', () => {
      const legacyBuild = {
        ...DEFAULT_BUILD,
        v: 1, // Start with version 1
        name: 'Test Character',
        perks: {
          selected: {
            'AVSpeechcraft': ['BOOB_BattleMusePerk', 'BOOB_WindborneMelodyPerk']
          },
          ranks: {
            'BOOB_BattleMusePerk': 1,
            'BOOB_WindborneMelodyPerk': 1
          }
        }
      }

      const compactBuild = migrateToCompactFormat(legacyBuild)

      // Should be version 2
      expect(compactBuild.v).toBe(2)
      
      // Should have compact format
      expect(compactBuild).toHaveProperty('p')
      expect(compactBuild).not.toHaveProperty('perks')
      
      // Should preserve other properties
      expect(compactBuild.name).toBe('Test Character')
      expect(compactBuild.race).toBe(null)
    })

    it('should not modify already compact builds', () => {
      // Create a compact build without perks property
      const { perks, ...buildWithoutPerks } = DEFAULT_BUILD
      const compactBuild = {
        ...buildWithoutPerks,
        v: 2,
        name: 'Test Character',
        p: {
          'SPC': [0, 1]
        }
      }

      const result = migrateToCompactFormat(compactBuild)

      // Should return the same object
      expect(result).toBe(compactBuild)
      expect(result.v).toBe(2)
      expect(result.p).toEqual({ 'SPC': [0, 1] })
    })
  })

  describe('migrateToLegacyFormat', () => {
    it('should migrate compact build to legacy format with version 2', () => {
      const compactBuild = {
        ...DEFAULT_BUILD,
        v: 2,
        name: 'Test Character',
        p: {
          'SPC': [0, 1]
        }
      }

      const legacyBuild = migrateToLegacyFormat(compactBuild)

      // Should be version 2
      expect(legacyBuild.v).toBe(2)
      
      // Should have legacy format
      expect(legacyBuild).toHaveProperty('perks')
      expect(legacyBuild).not.toHaveProperty('p')
      
      // Should preserve other properties
      expect(legacyBuild.name).toBe('Test Character')
      expect(legacyBuild.race).toBe(null)
    })

    it('should not modify already legacy builds', () => {
      const legacyBuild = {
        ...DEFAULT_BUILD,
        v: 2,
        name: 'Test Character',
        perks: {
          selected: {
            'AVSpeechcraft': ['BOOB_BattleMusePerk']
          },
          ranks: {
            'BOOB_BattleMusePerk': 1
          }
        }
      }

      const result = migrateToLegacyFormat(legacyBuild)

      // Should return the same object
      expect(result).toBe(legacyBuild)
      expect(result.v).toBe(2)
      expect(result.perks).toEqual(legacyBuild.perks)
    })
  })

  describe('isCompactFormat', () => {
    it('should detect compact format correctly', () => {
      // Create a compact build without perks property
      const { perks, ...buildWithoutPerks } = DEFAULT_BUILD
      const compactBuild = {
        ...buildWithoutPerks,
        v: 2,
        p: { 'SPC': [0, 1] }
      }

      const legacyBuild = {
        ...DEFAULT_BUILD,
        v: 2,
        perks: {
          selected: { 'AVSpeechcraft': ['BOOB_BattleMusePerk'] },
          ranks: { 'BOOB_BattleMusePerk': 1 }
        }
      }

      expect(isCompactFormat(compactBuild)).toBe(true)
      expect(isCompactFormat(legacyBuild)).toBe(false)
    })
  })

  describe('Version 1 to Version 2 Migration', () => {
    it('should handle version 1 builds correctly', () => {
      const v1Build = {
        ...DEFAULT_BUILD,
        v: 1,
        name: 'Test Character',
        perks: {
          selected: {
            'AVSpeechcraft': ['BOOB_BattleMusePerk']
          },
          ranks: {
            'BOOB_BattleMusePerk': 1
          }
        }
      }

      // Migrate to compact format
      const compactBuild = migrateToCompactFormat(v1Build)
      expect(compactBuild.v).toBe(2)
      expect(compactBuild).toHaveProperty('p')
      expect(compactBuild).not.toHaveProperty('perks')

      // Migrate back to legacy format
      const legacyBuild = migrateToLegacyFormat(compactBuild)
      expect(legacyBuild.v).toBe(2)
      expect(legacyBuild).toHaveProperty('perks')
      expect(legacyBuild).not.toHaveProperty('p')
    })
  })
})
