import { describe, it, expect } from 'vitest'
import {
  transformReligionData,
  transformBlessingData,
  transformReligionDataArray,
  transformBlessingDataArray,
} from '../religionDataAdapter'

describe('religionDataAdapter', () => {
  describe('transformReligionData', () => {
    it('should transform raw religion data correctly', () => {
      const rawReligion = {
        name: 'Julianos',
        domain: 'Divine',
        boons: {
          boon1: {
            spellName: 'Follower of Julianos',
            spellDescription: 'No description available',
            effects: [
              {
                effectName: 'Divine Scholar',
                effectDescription: 'Spells cost <Global=WSN_Favor_Global_Fractional>% less to cast (based on favor with Julianos).',
                magnitude: 2,
                duration: 0,
                area: 0,
                keywords: [],
              },
            ],
          },
          boon2: {
            spellName: 'Devotee of Julianos',
            spellDescription: 'No description available',
            effects: [
              {
                effectName: 'Temple of Logic',
                effectDescription: 'Spells and scrolls are <Global=WSN_Favor_Global_Fractional>% more effective (based on favor with Julianos).',
                magnitude: 2,
                duration: 0,
                area: 0,
                keywords: [],
              },
            ],
          },
        },
        tenets: {
          spellName: 'Follower of Julianos',
          description: 'Master the skills of the Mage. Strive to raise your Magicka. Never openly break the laws of Skyrim.',
          effects: [
            {
              effectName: 'Tenets of Julianos',
              effectDescription: 'Master the skills of the Mage. Strive to raise your Magicka. Never openly break the laws of Skyrim.',
              magnitude: 0,
              duration: 0,
              area: 0,
              keywords: [],
            },
          ],
        },
        favoredRaces: [],
      }

      const result = transformReligionData(rawReligion)

      expect(result).toEqual({
        id: 'julianos',
        name: 'Julianos',
        type: 'Divine',
        pantheon: 'Divine',
        blessing: undefined, // Religion data doesn't have blessing field
        boon1: {
          spellId: 'julianos-boon1',
          spellName: 'Follower of Julianos',
          effects: [
            {
              effectName: 'Divine Scholar',
              effectDescription: 'Spells cost <Global=WSN_Favor_Global_Fractional>% less to cast (based on favor with Julianos).',
              magnitude: 2,
              duration: 0,
              area: 0,
              effectType: '0',
              targetAttribute: null,
              keywords: [],
            },
          ],
        },
        boon2: {
          spellId: 'julianos-boon2',
          spellName: 'Devotee of Julianos',
          effects: [
            {
              effectName: 'Temple of Logic',
              effectDescription: 'Spells and scrolls are <Global=WSN_Favor_Global_Fractional>% more effective (based on favor with Julianos).',
              magnitude: 2,
              duration: 0,
              area: 0,
              effectType: '0',
              targetAttribute: null,
              keywords: [],
            },
          ],
        },
        tenet: {
          spellId: 'Follower of Julianos',
          spellName: 'Follower of Julianos',
          header: 'Follower of Julianos',
          description: 'Master the skills of the Mage. Strive to raise your Magicka. Never openly break the laws of Skyrim.',
          effects: [
            {
              effectName: 'Tenets of Julianos',
              effectDescription: 'Master the skills of the Mage. Strive to raise your Magicka. Never openly break the laws of Skyrim.',
              magnitude: 0,
              duration: 0,
              area: 0,
              effectType: '0',
              targetAttribute: null,
              keywords: [],
            },
          ],
        },
        favoredRaces: [],
        worshipRestrictions: [],
        tags: ['Divine'],
      })
    })

    it('should handle favored races correctly', () => {
      const rawReligion = {
        name: 'Syrabane',
        domain: 'Ancestor',
        boons: {
          boon1: {
            spellName: 'Follower of Syrabane',
            spellDescription: 'No description available',
            effects: [],
          },
          boon2: {
            spellName: 'Devotee of Syrabane',
            spellDescription: 'No description available',
            effects: [],
          },
        },
        tenets: {
          spellName: 'Follower of Syrabane',
          description: 'Read books that teach new skills. Study a wide variety of spells. High Elves are most deserving of my favor.',
          effects: [],
        },
        favoredRaces: ['Altmer'],
      }

      const result = transformReligionData(rawReligion)

      expect(result.favoredRaces).toEqual(['Altmer'])
      expect(result.tags).toContain('Altmer')
    })
  })

  describe('transformBlessingData', () => {
    it('should transform raw blessing data correctly', () => {
      const rawBlessing = {
        name: 'Julianos',
        domain: 'Divine',
        blessing: {
          spellName: 'Blessing of Julianos',
          spellDescription: 'No description available',
          effects: [
            {
              effectName: 'Fortify Magicka',
              effectDescription: 'Increases your Magicka by <mag> points.',
              magnitude: 40,
              duration: 86400,
              area: 0,
              keywords: ['MagicBlessing', 'WSN_MagicBlessing_Keyword_Divine'],
            },
          ],
        },
      }

      const result = transformBlessingData(rawBlessing)

      expect(result).toEqual({
        id: 'julianos',
        name: 'Julianos',
        type: 'Divine',
        pantheon: 'Divine',
        blessing: {
          spellId: 'julianos-blessing',
          spellName: 'Blessing of Julianos',
          effects: [
            {
              effectName: 'Fortify Magicka',
              effectDescription: 'Increases your Magicka by <mag> points.',
              magnitude: 40,
              duration: 86400,
              area: 0,
              effectType: '0',
              targetAttribute: null,
              keywords: ['MagicBlessing', 'WSN_MagicBlessing_Keyword_Divine'],
            },
          ],
        },
        favoredRaces: [],
        tags: ['Divine'],
      })
    })
  })

  describe('transformReligionDataArray', () => {
    it('should transform an array of religions', () => {
      const rawReligions = [
        {
          name: 'Julianos',
          domain: 'Divine',
          boons: {
            boon1: { spellName: 'Test', spellDescription: '', effects: [] },
            boon2: { spellName: 'Test', spellDescription: '', effects: [] },
          },
          tenets: { spellName: 'Test', description: '', effects: [] },
          favoredRaces: [],
        },
      ]

      const result = transformReligionDataArray(rawReligions)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Julianos')
    })
  })

  describe('transformBlessingDataArray', () => {
    it('should transform an array of blessings', () => {
      const rawBlessings = [
        {
          name: 'Julianos',
          domain: 'Divine',
          blessing: {
            spellName: 'Blessing of Julianos',
            spellDescription: '',
            effects: [],
          },
        },
      ]

      const result = transformBlessingDataArray(rawBlessings)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Julianos')
    })
  })
})
