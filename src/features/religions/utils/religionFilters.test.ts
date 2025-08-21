import { describe, it, expect } from 'vitest'
import {
  religionToDeityOption,
  getDeityOptions,
  findReligionById,
} from './religionFilters'
import type { Religion } from '../types'

describe('religionFilters', () => {
  const mockReligion: Religion = {
    name: 'Akatosh',
    type: 'Divine',
    blessing: {
      spellId: '0x000FB988',
      spellName: 'Blessing of Akatosh',
      effects: [
        {
          magnitude: 15,
          area: 0,
          duration: 28800,
          effectName: 'Resist Magic',
          effectDescription: 'Resist <mag>% of magic.',
          effectType: '34',
          targetAttribute: 'MagicResist',
          keywords: ['0x000FB98C'],
        },
      ],
    },
    boon1: {
      spellId: '0xA10517A8',
      spellName: 'Follower of Akatosh',
      effects: [
        {
          magnitude: 0,
          area: 0,
          duration: 0,
          effectName: 'Father of Dragons',
          effectDescription:
            'Attacks, spells, scrolls, shouts and enchantments are <Global=WSN_Favor_Global_Fractional2>% better against dragons (based on favor with Akatosh).',
          effectType: '1',
          targetAttribute: null,
          keywords: [],
        },
      ],
    },
    boon2: {
      spellId: '0xA108E48D',
      spellName: 'Devotee of Akatosh',
      effects: [
        {
          magnitude: 0,
          area: 0,
          duration: 0,
          effectName: 'Turn the Hourglass',
          effectDescription:
            'Praying to Akatosh resets the cooldown of your most recently used shout and power.',
          effectType: '1',
          targetAttribute: null,
          keywords: [],
        },
      ],
    },
    tenet: {
      spellId: '0xA11A5201',
      spellName: 'Follower of Akatosh',
      header: 'Tenets of Akatosh',
      description:
        'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
      effects: [
        {
          magnitude: 0,
          area: 0,
          duration: 0,
          effectName: 'Tenets of Akatosh',
          effectDescription:
            'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
          effectType: '1',
          targetAttribute: null,
          keywords: [],
        },
      ],
    },
    favoredRaces: ['Imperial', 'Nord'],
    worshipRestrictions: [],
  }

  it('should convert religion to deity option', () => {
    const deityOption = religionToDeityOption(mockReligion)

    expect(deityOption.id).toBe('akatosh')
    expect(deityOption.name).toBe('Akatosh')
    expect(deityOption.type).toBe('Divine')
    expect(deityOption.description).toBe(mockReligion.tenet?.description)
    expect(deityOption.favoredRaces).toEqual(['Imperial', 'Nord'])
    expect(deityOption.originalReligion).toBe(mockReligion)
  })

  it('should get deity options from religions', () => {
    const religions = [mockReligion]
    const deityOptions = getDeityOptions(religions)

    expect(deityOptions).toHaveLength(1)
    expect(deityOptions[0].name).toBe('Akatosh')
  })

  it('should find religion by id', () => {
    const religions = [mockReligion]
    const found = findReligionById(religions, 'akatosh')

    expect(found).toBe(mockReligion)
  })

  it('should return undefined for non-existent religion id', () => {
    const religions = [mockReligion]
    const found = findReligionById(religions, 'nonexistent')

    expect(found).toBeUndefined()
  })

  it('should handle undefined religions array', () => {
    const found = findReligionById(undefined, 'akatosh')
    expect(found).toBeUndefined()
  })

  it('should handle null religions array', () => {
    const found = findReligionById(null, 'akatosh')
    expect(found).toBeUndefined()
  })

  it('should handle undefined id', () => {
    const religions = [mockReligion]
    const found = findReligionById(religions, undefined as any)
    expect(found).toBeUndefined()
  })

  it('should return empty array for undefined religions in getDeityOptions', () => {
    const deityOptions = getDeityOptions(undefined)
    expect(deityOptions).toEqual([])
  })

  it('should return empty array for null religions in getDeityOptions', () => {
    const deityOptions = getDeityOptions(null)
    expect(deityOptions).toEqual([])
  })

  it('should return empty array for undefined religions in getBlessingOptions', () => {
    const blessingOptions = getBlessingOptions(undefined)
    expect(blessingOptions).toEqual([])
  })

  it('should return empty array for null religions in getBlessingOptions', () => {
    const blessingOptions = getBlessingOptions(null)
    expect(blessingOptions).toEqual([])
  })
})
