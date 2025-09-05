/**
 * Tests for compact perk encoding/decoding functionality
 */

import { describe, it, expect } from 'vitest'
import { 
  encodePerks, 
  decodePerks, 
  migrateToCompactFormat, 
  migrateToLegacyFormat,
  isCompactFormat,
  getPerkData,
  updatePerkData,
  calculateSizeReduction
} from '../compactPerkEncoding'
import type { BuildState, LegacyBuildState, CompactBuildState } from '../../types/build'

describe('Compact Perk Encoding', () => {
  const sampleLegacyPerks = {
    selected: {
      'AVSpeechcraft': [
        'REQ_Speech_Haggling',
        'REQ_Speech_Merchant',
        'REQ_Speech_SilverTongue',
        'Feat_Perk_Skill_Speechcraft_Commander1',
        'REQ_Speech_Investor',
        'REQ_Speech_Fence',
        'REQ_Speech_MasterTrader'
      ],
      'AVMysticism': [
        'REQ_Mysticism_Mastery_000_NoviceMysticism',
        'REQ_Mysticism_Mastery_025_ApprenticeMysticism',
        'REQ_Mysticism_Mastery_050_AdeptMysticism',
        'REQ_Mysticism_Mastery_075_ExpertMysticism',
        'REQ_Mysticism_Mastery_100_MasterMysticism'
      ],
      'AVAlteration': [
        'REQ_Alteration_Mastery_000_NoviceAlteration',
        'REQ_Alteration_Mastery_025_ApprenticeAlteration',
        'REQ_Alteration_Mastery_050_AdeptAlteration',
        'REQ_Alteration_Mastery_075_ExpertAlteration',
        'REQ_Alteration_Mastery_100_MasterAlteration'
      ]
    },
    ranks: {
      'REQ_Speech_Haggling': 1,
      'REQ_Speech_Merchant': 1,
      'REQ_Mysticism_Mastery_000_NoviceMysticism': 1,
      'REQ_Alteration_Mastery_000_NoviceAlteration': 1
    }
  }

  const sampleLegacyBuild: LegacyBuildState = {
    v: 1,
    name: 'Test Character',
    notes: 'Test build',
    race: 'Nord',
    stone: 'Warrior',
    religion: null,
    favoriteBlessing: null,
    traits: {
      regular: ['Trait1', 'Trait2'],
      bonus: ['BonusTrait1']
    },
    traitLimits: {
      regular: 2,
      bonus: 1
    },
    skills: {
      major: ['AVSpeechcraft', 'AVMysticism'],
      minor: ['AVAlteration']
    },
    perks: sampleLegacyPerks,
    skillLevels: {
      'AVSpeechcraft': 50,
      'AVMysticism': 75,
      'AVAlteration': 25
    },
    equipment: ['Weapon1', 'Armor1'],
    userProgress: {
      unlocks: ['Unlock1', 'Unlock2']
    },
    destinyPath: ['Destiny1', 'Destiny2'],
    attributeAssignments: {
      health: 100,
      stamina: 50,
      magicka: 75,
      level: 25,
      assignments: {
        1: 'health',
        2: 'stamina',
        3: 'magicka'
      }
    }
  }

  describe('encodePerks', () => {
    it('should encode legacy perks to compact format', () => {
      const result = encodePerks(sampleLegacyPerks)
      
      expect(result).toEqual({
        'SPC': [0, 1, 2, 3, 4, 5, 6],
        'MYS': [0, 1, 2, 3, 4],
        'ALT': [0, 1, 2, 3, 4]
      })
    })

    it('should handle empty perks', () => {
      const result = encodePerks({ selected: {}, ranks: {} })
      expect(result).toEqual({})
    })

    it('should handle unknown skill trees gracefully', () => {
      const perksWithUnknown = {
        selected: {
          'UnknownSkill': ['SomePerk'],
          'AVSpeechcraft': ['BOOB_BattleMusePerk']
        },
        ranks: {}
      }
      
      const result = encodePerks(perksWithUnknown)
      expect(result).toEqual({
        'SPC': [0]
      })
    })
  })

  describe('decodePerks', () => {
    it('should decode compact perks to legacy format', () => {
      const compactPerks = {
        'SPC': [0, 1, 2, 3, 4, 5, 6],
        'MYS': [0, 1, 2, 3, 4],
        'ALT': [0, 1, 2, 3, 4]
      }
      
      const result = decodePerks(compactPerks)
      
      expect(result.selected).toEqual({
        'AVSpeechcraft': [
          'REQ_Speech_Haggling',
          'REQ_Speech_Merchant',
          'REQ_Speech_SilverTongue',
          'Feat_Perk_Skill_Speechcraft_Commander1',
          'REQ_Speech_Investor',
          'REQ_Speech_Fence',
          'REQ_Speech_MasterTrader'
        ],
        'AVMysticism': [
          'REQ_Mysticism_Mastery_000_NoviceMysticism',
          'REQ_Mysticism_Mastery_025_ApprenticeMysticism',
          'REQ_Mysticism_Mastery_050_AdeptMysticism',
          'REQ_Mysticism_Mastery_075_ExpertMysticism',
          'REQ_Mysticism_Mastery_100_MasterMysticism'
        ],
        'AVAlteration': [
          'REQ_Alteration_Mastery_000_NoviceAlteration',
          'REQ_Alteration_Mastery_025_ApprenticeAlteration',
          'REQ_Alteration_Mastery_050_AdeptAlteration',
          'REQ_Alteration_Mastery_075_ExpertAlteration',
          'REQ_Alteration_Mastery_100_MasterAlteration'
        ]
      })
      
      // Check that ranks are set to 1 for all perks
      const allPerks = Object.values(result.selected).flat()
      allPerks.forEach(perk => {
        expect(result.ranks[perk]).toBe(1)
      })
    })

    it('should handle empty compact perks', () => {
      const result = decodePerks({})
      expect(result).toEqual({ selected: {}, ranks: {} })
    })
  })

  describe('migrateToCompactFormat', () => {
    it('should migrate legacy build to compact format', () => {
      const result = migrateToCompactFormat(sampleLegacyBuild)
      
      expect(result).toHaveProperty('p')
      expect(result).not.toHaveProperty('perks')
      expect(result.p).toEqual({
        'SPC': [0, 1, 2, 3, 4, 5, 6],
        'MYS': [0, 1, 2, 3, 4],
        'ALT': [0, 1, 2, 3, 4]
      })
    })

    it('should handle already compact format', () => {
      const compactBuild: CompactBuildState = {
        ...sampleLegacyBuild,
        p: { 'SPC': [0, 1, 2] }
      }
      delete (compactBuild as any).perks
      
      const result = migrateToCompactFormat(compactBuild)
      expect(result).toEqual(compactBuild)
    })
  })

  describe('migrateToLegacyFormat', () => {
    it('should migrate compact build to legacy format', () => {
      const compactBuild: CompactBuildState = {
        ...sampleLegacyBuild,
        p: {
          'SPC': [0, 1, 2, 3, 4, 5, 6],
          'MYS': [0, 1, 2, 3, 4],
          'ALT': [0, 1, 2, 3, 4]
        }
      }
      delete (compactBuild as any).perks
      
      const result = migrateToLegacyFormat(compactBuild)
      
      expect(result).toHaveProperty('perks')
      expect(result).not.toHaveProperty('p')
      expect(result.perks.selected).toEqual(sampleLegacyPerks.selected)
    })

    it('should handle already legacy format', () => {
      const result = migrateToLegacyFormat(sampleLegacyBuild)
      expect(result).toEqual(sampleLegacyBuild)
    })
  })

  describe('isCompactFormat', () => {
    it('should detect compact format', () => {
      const compactBuild = { p: { 'SPC': [0, 1, 2] } }
      expect(isCompactFormat(compactBuild)).toBe(true)
    })

    it('should detect legacy format', () => {
      const legacyBuild = { perks: { selected: {}, ranks: {} } }
      expect(isCompactFormat(legacyBuild)).toBe(false)
    })

    it('should handle builds with both formats (prefer legacy)', () => {
      const bothFormats = { 
        perks: { selected: {}, ranks: {} },
        p: { 'SPC': [0, 1, 2] }
      }
      expect(isCompactFormat(bothFormats)).toBe(false)
    })
  })

  describe('getPerkData', () => {
    it('should get perk data from legacy format', () => {
      const result = getPerkData(sampleLegacyBuild)
      expect(result).toEqual(sampleLegacyPerks)
    })

    it('should get perk data from compact format', () => {
      const compactBuild = { p: { 'SPC': [0, 1, 2] } }
      const result = getPerkData(compactBuild)
      expect(result.selected).toHaveProperty('AVSpeechcraft')
      expect(result.selected.AVSpeechcraft).toHaveLength(3)
    })
  })

  describe('updatePerkData', () => {
    it('should update perk data in legacy format', () => {
      const newPerks = {
        selected: { 'AVSpeechcraft': ['BOOB_BattleMusePerk'] },
        ranks: { 'BOOB_BattleMusePerk': 1 }
      }
      
      const result = updatePerkData(sampleLegacyBuild, newPerks)
      expect(result.perks).toEqual(newPerks)
    })

    it('should update perk data in compact format', () => {
      const compactBuild = { p: { 'SPC': [0, 1, 2] } }
      const newPerks = {
        selected: { 'AVSpeechcraft': ['BOOB_BattleMusePerk'] },
        ranks: { 'BOOB_BattleMusePerk': 1 }
      }
      
      const result = updatePerkData(compactBuild, newPerks)
      expect(result.p).toEqual({ 'SPC': [0] })
    })
  })

  describe('calculateSizeReduction', () => {
    it('should calculate size reduction correctly', () => {
      const legacyPerks = sampleLegacyPerks
      const compactPerks = {
        'SPC': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        'ILL': [0, 1, 2, 3, 4, 5, 6, 10, 11, 12],
        'ALT': [0, 1, 2, 3, 4]
      }
      
      const result = calculateSizeReduction(legacyPerks, compactPerks)
      
      expect(result.legacySize).toBeGreaterThan(0)
      expect(result.compactSize).toBeGreaterThan(0)
      expect(result.reduction).toBeGreaterThan(0)
      expect(result.reductionPercentage).toBeGreaterThan(0)
      expect(result.reductionPercentage).toBeLessThan(100)
      
      console.log(`Size reduction: ${result.reductionPercentage.toFixed(1)}% (${result.legacySize} → ${result.compactSize} chars)`)
    })
  })

  describe('Round-trip encoding', () => {
    it('should maintain data integrity through encode/decode cycle', () => {
      const original = sampleLegacyPerks
      const encoded = encodePerks(original)
      const decoded = decodePerks(encoded)
      
      expect(decoded.selected).toEqual(original.selected)
      // Ranks will be set to 1 for all perks in decoded format
      Object.keys(decoded.ranks).forEach(perk => {
        expect(decoded.ranks[perk]).toBe(1)
      })
    })

    it('should maintain data integrity through migration cycle', () => {
      const original = sampleLegacyBuild
      const compact = migrateToCompactFormat(original)
      const backToLegacy = migrateToLegacyFormat(compact)
      
      expect(backToLegacy.perks.selected).toEqual(original.perks.selected)
      // Other properties should remain the same
      expect(backToLegacy.name).toBe(original.name)
      expect(backToLegacy.race).toBe(original.race)
      expect(backToLegacy.skills).toEqual(original.skills)
    })
  })
})
