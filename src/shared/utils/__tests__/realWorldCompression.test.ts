/**
 * Test real-world compression with user's sample data
 */

import { describe, expect, it } from 'vitest'
import {
  calculateCompressionRatio,
  toCompressed,
  toLegacy,
} from '../buildCompression'

describe('Real-World Compression', () => {
  // This is the actual decoded URL from the user
  const realWorldBuild = {
    v: 2,
    name: '',
    notes: '',
    race: 'HighElfRace',
    stone: 'REQ_Ability_Birthsign_Warrior',
    religion: 'julianos',
    favoriteBlessing: 'julianos',
    traits: {
      regular: ['LoreTraits_AcousticArcanistAb', 'Traits_AdrenalineRushAb'],
      bonus: [],
    },
    traitLimits: {
      regular: 2,
      bonus: 1,
    },
    skills: {
      major: ['AVDestruction', 'AVConjuration', 'AVAlteration'],
      minor: ['AVEnchanting', 'AVMysticism', 'AVRestoration'],
    },
    skillLevels: {},
    equipment: [],
    userProgress: {
      unlocks: [],
    },
    destinyPath: [
      'DAR_Perk01Destiny',
      'DAR_Perk02Focus',
      'DAR_Perk05Mage',
      'DAR_Perk08Fortification',
      'DAR_Perk15Agent',
      'DAR_Perk22Leadership',
      'DAR_Perk37Bard',
    ],
    attributeAssignments: {
      health: 4,
      stamina: 1,
      magicka: 8,
      level: 1,
    },
    perks: {
      selected: {},
      ranks: {},
    },
  }

  it('should compress the real-world build significantly', () => {
    const compression = calculateCompressionRatio(realWorldBuild)

    console.log('Real-world compression results:', {
      originalSize: compression.originalSize,
      compressedSize: compression.compressedSize,
      savings: compression.savings,
      savingsPercentage: compression.savingsPercentage.toFixed(1) + '%',
    })

    // Show the compressed JSON for comparison
    const compressed = toCompressed(realWorldBuild)
    console.log('Compressed JSON:', JSON.stringify(compressed, null, 2))

    // Should achieve at least 60% compression
    expect(compression.savingsPercentage).toBeGreaterThan(60)

    // Original size should be significantly larger
    expect(compression.originalSize).toBeGreaterThan(
      compression.compressedSize * 2
    )
  })

  it('should handle the specific traits and destinies correctly', () => {
    const compressed = toCompressed(realWorldBuild)

    // Check specific trait compression
    expect(compressed.t.r).toEqual([0, 27]) // AcousticArcanistAb=0, AdrenalineRushAb=27
    expect(compressed.t.b).toEqual([])

    // Check specific destiny compression
    expect(compressed.d).toEqual([0, 1, 4, 7, 14, 21, 36]) // All the DAR_Perk* values as indexes

    // Verify round-trip
    const decompressed = toLegacy(compressed)
    expect(decompressed.traits.regular).toEqual(realWorldBuild.traits.regular)
    expect(decompressed.destinyPath).toEqual(realWorldBuild.destinyPath)
  })
})
