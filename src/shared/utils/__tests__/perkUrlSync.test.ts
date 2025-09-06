/**
 * Test perk URL sync functionality
 */

import { describe, expect, it } from 'vitest'
import { toCompressed, toLegacy } from '../buildCompression'

describe('Perk URL Sync', () => {
  const buildWithPerks = {
    v: 2,
    name: '',
    notes: '',
    race: 'HighElfRace',
    stone: null,
    religion: null,
    favoriteBlessing: null,
    traits: {
      regular: [],
      bonus: [],
    },
    traitLimits: {
      regular: 2,
      bonus: 1,
    },
    skills: {
      major: [],
      minor: [],
    },
    skillLevels: {},
    equipment: [],
    userProgress: {
      unlocks: [],
    },
    destinyPath: [],
    attributeAssignments: {
      health: 0,
      stamina: 0,
      magicka: 0,
      level: 1,
    },
    perks: {
      selected: {
        AVDestruction: ['REQ_Destruction_Mastery_000_NoviceDestruction'],
        AVConjuration: ['REQ_Conjuration_Mastery_000_NoviceConjuration'],
      },
      ranks: {
        REQ_Destruction_Mastery_000_NoviceDestruction: 1,
        REQ_Conjuration_Mastery_000_NoviceConjuration: 1,
      },
    },
  }

  const buildWithoutPerks = {
    ...buildWithPerks,
    perks: {
      selected: {},
      ranks: {},
    },
  }

  it('should detect perk changes in legacy format', () => {
    const legacyWithPerks = toLegacy(buildWithPerks)
    const legacyWithoutPerks = toLegacy(buildWithoutPerks)

    console.log(
      'Legacy with perks:',
      JSON.stringify(legacyWithPerks.perks, null, 2)
    )
    console.log(
      'Legacy without perks:',
      JSON.stringify(legacyWithoutPerks.perks, null, 2)
    )

    // Should have different perk selections
    expect(legacyWithPerks.perks.selected).not.toEqual(
      legacyWithoutPerks.perks.selected
    )
    expect(legacyWithPerks.perks.ranks).not.toEqual(
      legacyWithoutPerks.perks.ranks
    )

    // Should have perks in the first build
    expect(Object.keys(legacyWithPerks.perks.selected)).toHaveLength(2)
    expect(Object.keys(legacyWithPerks.perks.ranks)).toHaveLength(2)

    // Should have no perks in the second build
    expect(Object.keys(legacyWithoutPerks.perks.selected)).toHaveLength(0)
    expect(Object.keys(legacyWithoutPerks.perks.ranks)).toHaveLength(0)
  })

  it('should detect perk changes in compressed format', () => {
    const compressedWithPerks = toCompressed(buildWithPerks)
    const compressedWithoutPerks = toCompressed(buildWithoutPerks)

    console.log(
      'Compressed with perks:',
      JSON.stringify(compressedWithPerks.p, null, 2)
    )
    console.log(
      'Compressed without perks:',
      JSON.stringify(compressedWithoutPerks.p, null, 2)
    )

    // Should have different perk data
    expect(compressedWithPerks.p).not.toEqual(compressedWithoutPerks.p)

    // Should have perks in the first build
    expect(Object.keys(compressedWithPerks.p)).toHaveLength(2)

    // Should have no perks in the second build
    expect(Object.keys(compressedWithoutPerks.p)).toHaveLength(0)
  })

  it('should handle round-trip conversion with perks', () => {
    const compressed = toCompressed(buildWithPerks)
    const decompressed = toLegacy(compressed)

    console.log(
      'Original perks:',
      JSON.stringify(buildWithPerks.perks, null, 2)
    )
    console.log(
      'Decompressed perks:',
      JSON.stringify(decompressed.perks, null, 2)
    )

    // Should maintain perk data through compression/decompression
    expect(decompressed.perks.selected).toEqual(buildWithPerks.perks.selected)
    expect(decompressed.perks.ranks).toEqual(buildWithPerks.perks.ranks)
  })

  it('should generate different JSON strings for different perk states', () => {
    const legacyWithPerks = toLegacy(buildWithPerks)
    const legacyWithoutPerks = toLegacy(buildWithoutPerks)

    const jsonWithPerks = JSON.stringify(legacyWithPerks)
    const jsonWithoutPerks = JSON.stringify(legacyWithoutPerks)

    console.log('JSON with perks length:', jsonWithPerks.length)
    console.log('JSON without perks length:', jsonWithoutPerks.length)

    // Should generate different JSON strings
    expect(jsonWithPerks).not.toEqual(jsonWithoutPerks)
    expect(jsonWithPerks.length).toBeGreaterThan(jsonWithoutPerks.length)
  })
})
