/**
 * Test trait and destiny compression
 */

import { describe, expect, it } from 'vitest'
import {
  calculateCompressionRatio,
  toCompressed,
  toLegacy,
} from '../buildCompression'

describe('Trait and Destiny Compression', () => {
  const sampleBuild = {
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

  it('should compress traits and destinies to indexes', () => {
    const compressed = toCompressed(sampleBuild)

    // Traits should be compressed to indexes
    expect(compressed.t.r).toEqual([0, 27]) // AcousticArcanistAb=0, AdrenalineRushAb=27
    expect(compressed.t.b).toEqual([])

    // Destinies should be compressed to indexes
    expect(compressed.d).toEqual([0, 1, 4, 7, 14, 21, 36]) // Destiny=0, Focus=1, Mage=4, etc.
  })

  it('should decompress traits and destinies back to EDIDs', () => {
    const compressed = toCompressed(sampleBuild)
    const decompressed = toLegacy(compressed)

    // Traits should be decompressed back to EDIDs
    expect(decompressed.traits.regular).toEqual([
      'LoreTraits_AcousticArcanistAb',
      'Traits_AdrenalineRushAb',
    ])
    expect(decompressed.traits.bonus).toEqual([])

    // Destinies should be decompressed back to EDIDs
    expect(decompressed.destinyPath).toEqual([
      'DAR_Perk01Destiny',
      'DAR_Perk02Focus',
      'DAR_Perk05Mage',
      'DAR_Perk08Fortification',
      'DAR_Perk15Agent',
      'DAR_Perk22Leadership',
      'DAR_Perk37Bard',
    ])
  })

  it('should achieve significant compression with traits and destinies', () => {
    const compression = calculateCompressionRatio(sampleBuild)

    console.log('Compression results:', {
      originalSize: compression.originalSize,
      compressedSize: compression.compressedSize,
      savings: compression.savings,
      savingsPercentage: compression.savingsPercentage.toFixed(1) + '%',
    })

    // Should achieve at least 60% compression
    expect(compression.savingsPercentage).toBeGreaterThan(60)

    // Original size should be significantly larger
    expect(compression.originalSize).toBeGreaterThan(
      compression.compressedSize * 2
    )
  })

  it('should handle round-trip conversion correctly', () => {
    const compressed = toCompressed(sampleBuild)
    const decompressed = toLegacy(compressed)

    // All fields should match the original (except userProgress which is removed in compressed format)
    expect(decompressed.v).toBe(sampleBuild.v)
    expect(decompressed.name).toBe(sampleBuild.name)
    expect(decompressed.notes).toBe(sampleBuild.notes)
    expect(decompressed.race).toBe(sampleBuild.race)
    expect(decompressed.stone).toBe(sampleBuild.stone)
    expect(decompressed.religion).toBe(sampleBuild.religion)
    expect(decompressed.favoriteBlessing).toBe(sampleBuild.favoriteBlessing)
    expect(decompressed.traits).toEqual(sampleBuild.traits)
    expect(decompressed.traitLimits).toEqual(sampleBuild.traitLimits)
    expect(decompressed.skills).toEqual(sampleBuild.skills)
    expect(decompressed.skillLevels).toEqual(sampleBuild.skillLevels)
    expect(decompressed.equipment).toEqual(sampleBuild.equipment)
    expect(decompressed.destinyPath).toEqual(sampleBuild.destinyPath)
    expect(decompressed.attributeAssignments).toEqual(
      sampleBuild.attributeAssignments
    )
    expect(decompressed.perks).toEqual(sampleBuild.perks)

    // userProgress should be empty (removed in compressed format)
    expect(decompressed.userProgress.unlocks).toEqual([])
  })
})
