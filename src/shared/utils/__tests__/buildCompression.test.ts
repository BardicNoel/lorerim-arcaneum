import { describe, expect, it } from 'vitest'
import { DEFAULT_BUILD } from '../../types/build'
import {
  calculateCompressionRatio,
  compressedToLegacy,
  legacyToCompressed,
  toCompressed,
  toLegacy,
} from '../buildCompression'

describe('Build Compression Utilities', () => {
  const sampleLegacyBuild = {
    ...DEFAULT_BUILD,
    name: 'Test Character',
    notes: 'A test character for compression testing',
    race: 'Nord',
    stone: 'Warrior',
    religion: 'Talos',
    favoriteBlessing: 'Talos',
    traits: {
      regular: ['trait1', 'trait2'],
      bonus: ['bonusTrait1'],
    },
    traitLimits: {
      regular: 2,
      bonus: 1,
    },
    skills: {
      major: ['AVSmithing', 'AVDestruction'],
      minor: ['AVEnchanting', 'AVRestoration'],
    },
    skillLevels: {
      AVSmithing: 25,
      AVDestruction: 30,
    },
    equipment: ['equipment1', 'equipment2'],
    destinyPath: ['destiny1', 'destiny2'],
    attributeAssignments: {
      health: 5,
      stamina: 3,
      magicka: 2,
      level: 10,
    },
    perks: {
      selected: {
        AVSmithing: [
          'REQ_Smithing_Craftsmanship',
          'REQ_Smithing_DwarvenSmithing',
        ],
        AVDestruction: ['REQ_Destruction_Mastery_000_NoviceDestruction'],
      },
      ranks: {
        REQ_Smithing_Craftsmanship: 2,
        REQ_Smithing_DwarvenSmithing: 1,
        REQ_Destruction_Mastery_000_NoviceDestruction: 3,
      },
    },
  }

  describe('legacyToCompressed', () => {
    it('should convert legacy build to compressed format', () => {
      const compressed = legacyToCompressed(sampleLegacyBuild)

      expect(compressed.v).toBe(2)
      expect(compressed.n).toBe('Test Character')
      expect(compressed.o).toBe('A test character for compression testing')
      expect(compressed.r).toBe('Nord')
      expect(compressed.s).toBe('Warrior')
      expect(compressed.g).toBe('Talos')
      expect(compressed.f).toBe('Talos')

      expect(compressed.t.r).toEqual(['trait1', 'trait2'])
      expect(compressed.t.b).toEqual(['bonusTrait1'])

      // Trait limits should be omitted since they match defaults
      expect(compressed.l).toBeUndefined()

      expect(compressed.k.ma).toEqual([0, 1]) // AVSmithing=0, AVDestruction=1
      expect(compressed.k.mi).toEqual([2, 3]) // AVEnchanting=2, AVRestoration=3

      expect(compressed.sl).toEqual({
        0: 25, // AVSmithing
        1: 30, // AVDestruction
      })

      expect(compressed.e).toEqual(['equipment1', 'equipment2'])
      expect(compressed.d).toEqual(['destiny1', 'destiny2'])

      expect(compressed.a.h).toBe(5)
      expect(compressed.a.st).toBe(3)
      expect(compressed.a.m).toBe(2)
      expect(compressed.a.l).toBe(10)
      // Removed: expect(compressed.a.as).toEqual({...})

      // Perks should be converted to compressed format
      expect(compressed.p).toBeDefined()
    })

    it('should include trait limits when different from defaults', () => {
      const buildWithCustomLimits = {
        ...sampleLegacyBuild,
        traitLimits: {
          regular: 3,
          bonus: 2,
        },
      }

      const compressed = legacyToCompressed(buildWithCustomLimits)
      expect(compressed.l).toEqual([3, 2])
    })
  })

  describe('compressedToLegacy', () => {
    it('should convert compressed build back to legacy format', () => {
      const compressed = legacyToCompressed(sampleLegacyBuild)
      const legacy = compressedToLegacy(compressed)

      expect(legacy.v).toBe(2)
      expect(legacy.name).toBe('Test Character')
      expect(legacy.notes).toBe('A test character for compression testing')
      expect(legacy.race).toBe('Nord')
      expect(legacy.stone).toBe('Warrior')
      expect(legacy.religion).toBe('Talos')
      expect(legacy.favoriteBlessing).toBe('Talos')

      expect(legacy.traits.regular).toEqual(['trait1', 'trait2'])
      expect(legacy.traits.bonus).toEqual(['bonusTrait1'])

      // Should use default trait limits when not specified
      expect(legacy.traitLimits.regular).toBe(2)
      expect(legacy.traitLimits.bonus).toBe(1)

      expect(legacy.skills.major).toEqual(['AVSmithing', 'AVDestruction'])
      expect(legacy.skills.minor).toEqual(['AVEnchanting', 'AVRestoration'])

      expect(legacy.skillLevels).toEqual({
        AVSmithing: 25,
        AVDestruction: 30,
      })

      expect(legacy.equipment).toEqual(['equipment1', 'equipment2'])
      expect(legacy.destinyPath).toEqual(['destiny1', 'destiny2'])

      expect(legacy.attributeAssignments.health).toBe(5)
      expect(legacy.attributeAssignments.stamina).toBe(3)
      expect(legacy.attributeAssignments.magicka).toBe(2)
      expect(legacy.attributeAssignments.level).toBe(10)
      // Removed: expect(legacy.attributeAssignments.assignments).toEqual({...})

      // userProgress should be restored with empty unlocks
      expect(legacy.userProgress.unlocks).toEqual([])

      // Perks should be converted back to legacy format
      expect(legacy.perks).toBeDefined()
      expect(legacy.perks.selected).toBeDefined()
      expect(legacy.perks.ranks).toBeDefined()
    })

    it('should use custom trait limits when specified', () => {
      const compressed = legacyToCompressed(sampleLegacyBuild)
      compressed.l = [3, 2] // Custom limits

      const legacy = compressedToLegacy(compressed)
      expect(legacy.traitLimits.regular).toBe(3)
      expect(legacy.traitLimits.bonus).toBe(2)
    })
  })

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through legacy -> compressed -> legacy conversion', () => {
      const original = sampleLegacyBuild
      const compressed = legacyToCompressed(original)
      const convertedBack = compressedToLegacy(compressed)

      // Compare key fields (excluding userProgress which is removed in compressed format)
      expect(convertedBack.v).toBe(original.v)
      expect(convertedBack.name).toBe(original.name)
      expect(convertedBack.notes).toBe(original.notes)
      expect(convertedBack.race).toBe(original.race)
      expect(convertedBack.stone).toBe(original.stone)
      expect(convertedBack.religion).toBe(original.religion)
      expect(convertedBack.favoriteBlessing).toBe(original.favoriteBlessing)
      expect(convertedBack.traits).toEqual(original.traits)
      expect(convertedBack.traitLimits).toEqual(original.traitLimits)
      expect(convertedBack.skills).toEqual(original.skills)
      expect(convertedBack.skillLevels).toEqual(original.skillLevels)
      expect(convertedBack.equipment).toEqual(original.equipment)
      expect(convertedBack.destinyPath).toEqual(original.destinyPath)
      // Compare attribute assignments (excluding assignments field which was removed)
      expect(convertedBack.attributeAssignments.health).toBe(
        original.attributeAssignments.health
      )
      expect(convertedBack.attributeAssignments.stamina).toBe(
        original.attributeAssignments.stamina
      )
      expect(convertedBack.attributeAssignments.magicka).toBe(
        original.attributeAssignments.magicka
      )
      expect(convertedBack.attributeAssignments.level).toBe(
        original.attributeAssignments.level
      )

      // userProgress should be restored with empty unlocks
      expect(convertedBack.userProgress.unlocks).toEqual([])
    })
  })

  describe('toCompressed', () => {
    it('should convert any build format to compressed', () => {
      const compressed = toCompressed(sampleLegacyBuild)
      expect(compressed.n).toBe('Test Character')
      expect(compressed.k).toBeDefined()
      expect(compressed.a).toBeDefined()
    })
  })

  describe('toLegacy', () => {
    it('should convert any build format to legacy', () => {
      const legacy = toLegacy(sampleLegacyBuild)
      expect(legacy.name).toBe('Test Character')
      expect(legacy.perks).toBeDefined()
      expect(legacy.userProgress).toBeDefined()
    })
  })

  describe('calculateCompressionRatio', () => {
    it('should calculate compression ratio correctly', () => {
      const ratio = calculateCompressionRatio(sampleLegacyBuild)

      expect(ratio.originalSize).toBeGreaterThan(0)
      expect(ratio.compressedSize).toBeGreaterThan(0)
      expect(ratio.compressedSize).toBeLessThan(ratio.originalSize)
      expect(ratio.savings).toBeGreaterThan(0)
      expect(ratio.savingsPercentage).toBeGreaterThan(0)
      expect(ratio.ratio).toBeLessThan(1)

      console.log('Compression stats:', {
        originalSize: ratio.originalSize,
        compressedSize: ratio.compressedSize,
        savings: ratio.savings,
        savingsPercentage: `${ratio.savingsPercentage.toFixed(1)}%`,
        ratio: ratio.ratio.toFixed(3),
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle empty build', () => {
      const emptyBuild = { ...DEFAULT_BUILD }
      const compressed = legacyToCompressed(emptyBuild)
      const legacy = compressedToLegacy(compressed)

      expect(legacy.name).toBe('')
      expect(legacy.notes).toBe('')
      expect(legacy.race).toBeNull()
      expect(legacy.stone).toBeNull()
      expect(legacy.traits.regular).toEqual([])
      expect(legacy.traits.bonus).toEqual([])
      expect(legacy.skills.major).toEqual([])
      expect(legacy.skills.minor).toEqual([])
    })

    it('should handle null values correctly', () => {
      const buildWithNulls = {
        ...DEFAULT_BUILD,
        race: null,
        stone: null,
        religion: null,
        favoriteBlessing: null,
      }

      const compressed = legacyToCompressed(buildWithNulls)
      const legacy = compressedToLegacy(compressed)

      expect(legacy.race).toBeNull()
      expect(legacy.stone).toBeNull()
      expect(legacy.religion).toBeNull()
      expect(legacy.favoriteBlessing).toBeNull()
    })
  })
})
