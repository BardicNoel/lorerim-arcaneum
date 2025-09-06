import { describe, expect, it } from 'vitest'
import { DEFAULT_BUILD } from '../../types/build'
import { decode, encode } from '../urlEncoding'

describe('URL Persistence with Compression', () => {
  const sampleBuild = {
    ...DEFAULT_BUILD,
    name: 'Test Character',
    notes: 'A test character for URL persistence testing',
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

  describe('URL Encoding/Decoding', () => {
    it('should encode and decode build data correctly', () => {
      const encoded = encode(sampleBuild)
      const decoded = decode(encoded)

      expect(decoded).not.toBeNull()
      expect(decoded!.name).toBe('Test Character')
      expect(decoded!.notes).toBe(
        'A test character for URL persistence testing'
      )
      expect(decoded!.race).toBe('Nord')
      expect(decoded!.stone).toBe('Warrior')
      expect(decoded!.religion).toBe('Talos')
      expect(decoded!.favoriteBlessing).toBe('Talos')

      expect(decoded!.traits.regular).toEqual(['trait1', 'trait2'])
      expect(decoded!.traits.bonus).toEqual(['bonusTrait1'])

      expect(decoded!.traitLimits.regular).toBe(2)
      expect(decoded!.traitLimits.bonus).toBe(1)

      expect(decoded!.skills.major).toEqual(['AVSmithing', 'AVDestruction'])
      expect(decoded!.skills.minor).toEqual(['AVEnchanting', 'AVRestoration'])

      expect(decoded!.skillLevels).toEqual({
        AVSmithing: 25,
        AVDestruction: 30,
      })

      expect(decoded!.equipment).toEqual(['equipment1', 'equipment2'])
      expect(decoded!.destinyPath).toEqual(['destiny1', 'destiny2'])

      expect(decoded!.attributeAssignments.health).toBe(5)
      expect(decoded!.attributeAssignments.stamina).toBe(3)
      expect(decoded!.attributeAssignments.magicka).toBe(2)
      expect(decoded!.attributeAssignments.level).toBe(10)
      // Removed: expect(decoded!.attributeAssignments.assignments).toEqual({...})

      // userProgress should be restored with empty unlocks
      expect(decoded!.userProgress.unlocks).toEqual([])

      // Perks should be converted back to legacy format
      expect(decoded!.perks).toBeDefined()
      expect(decoded!.perks.selected).toBeDefined()
      expect(decoded!.perks.ranks).toBeDefined()
    })

    it('should handle empty build correctly', () => {
      const emptyBuild = { ...DEFAULT_BUILD }
      const encoded = encode(emptyBuild)
      const decoded = decode(encoded)

      expect(decoded).not.toBeNull()
      expect(decoded!.name).toBe('')
      expect(decoded!.notes).toBe('')
      expect(decoded!.race).toBeNull()
      expect(decoded!.stone).toBeNull()
      expect(decoded!.traits.regular).toEqual([])
      expect(decoded!.traits.bonus).toEqual([])
      expect(decoded!.skills.major).toEqual([])
      expect(decoded!.skills.minor).toEqual([])
    })

    it('should handle null values correctly', () => {
      const buildWithNulls = {
        ...DEFAULT_BUILD,
        race: null,
        stone: null,
        religion: null,
        favoriteBlessing: null,
      }

      const encoded = encode(buildWithNulls)
      const decoded = decode(encoded)

      expect(decoded).not.toBeNull()
      expect(decoded!.race).toBeNull()
      expect(decoded!.stone).toBeNull()
      expect(decoded!.religion).toBeNull()
      expect(decoded!.favoriteBlessing).toBeNull()
    })

    it('should handle custom trait limits correctly', () => {
      const buildWithCustomLimits = {
        ...sampleBuild,
        traitLimits: {
          regular: 3,
          bonus: 2,
        },
      }

      const encoded = encode(buildWithCustomLimits)
      const decoded = decode(encoded)

      expect(decoded).not.toBeNull()
      expect(decoded!.traitLimits.regular).toBe(3)
      expect(decoded!.traitLimits.bonus).toBe(2)
    })
  })

  describe('Compression Performance', () => {
    it('should achieve significant compression', () => {
      const encoded = encode(sampleBuild)
      const originalJson = JSON.stringify(sampleBuild)

      console.log('URL Persistence Compression Stats:', {
        originalSize: originalJson.length,
        encodedSize: encoded.length,
        savings: originalJson.length - encoded.length,
        savingsPercentage: `${(((originalJson.length - encoded.length) / originalJson.length) * 100).toFixed(1)}%`,
        compressionRatio: (encoded.length / originalJson.length).toFixed(3),
      })

      // Should achieve at least 40% compression (accounting for Base64 encoding overhead)
      expect(encoded.length).toBeLessThan(originalJson.length * 0.6)
    })

    it('should produce URL-safe encoded strings', () => {
      const encoded = encode(sampleBuild)

      // Should not contain characters that need URL encoding
      expect(encoded).not.toMatch(/[+/=]/)
      expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
    })
  })

  describe('Round-trip Integrity', () => {
    it('should maintain data integrity through multiple encode/decode cycles', () => {
      let currentBuild = sampleBuild

      // Perform multiple encode/decode cycles
      for (let i = 0; i < 3; i++) {
        const encoded = encode(currentBuild)
        const decoded = decode(encoded)

        expect(decoded).not.toBeNull()
        currentBuild = decoded!
      }

      // Final result should match original
      expect(currentBuild.name).toBe(sampleBuild.name)
      expect(currentBuild.race).toBe(sampleBuild.race)
      expect(currentBuild.skills.major).toEqual(sampleBuild.skills.major)
      expect(currentBuild.attributeAssignments.health).toBe(
        sampleBuild.attributeAssignments.health
      )
    })
  })
})
