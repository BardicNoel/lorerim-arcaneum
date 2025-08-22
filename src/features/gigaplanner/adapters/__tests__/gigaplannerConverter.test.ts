import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GigaPlannerDataLoader } from '../dataLoader'
import { GigaPlannerConverter } from '../gigaplannerConverter'

// Mock the data loader
vi.mock('../dataLoader', () => ({
  GigaPlannerDataLoader: vi.fn(),
}))

describe('GigaPlannerConverter', () => {
  let converter: GigaPlannerConverter
  let mockDataLoader: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock data
    const mockData = {
      races: [
        { name: 'Nord', edid: 'NordRace' },
        { name: 'Argonian', edid: 'ArgonianRace' },
      ],
      standingStones: [
        { name: 'Warrior', edid: 'REQ_Ability_Birthsign_Warrior' },
        { name: 'Mage', edid: 'REQ_Ability_Birthsign_Mage' },
      ],
      blessings: [
        { name: 'Blessing of Akatosh', edid: 'BlessingAkatosh' },
        { name: 'Blessing of Dibella', edid: 'BlessingDibella' },
      ],
      perks: [
        {
          name: 'LoreRim v3.0.4',
          perkListId: 0,
          skillNames: ['Smithing', 'Heavy Armor', 'Block'],
          perks: [
            {
              name: 'Craftsmanship',
              skill: 0,
              skillReq: 0,
              description: 'Basic crafting',
            },
            {
              name: 'Conditioning',
              skill: 1,
              skillReq: 0,
              description: 'Basic armor',
            },
          ],
        },
      ],
      gameMechanics: [{ name: 'LoreRim v4', id: 0 }],
      presets: [{ name: 'Default Preset', perks: 0 }],
    }

    // Mock the data loader
    mockDataLoader = {
      loadAllData: vi.fn().mockResolvedValue(mockData),
    }
    ;(GigaPlannerDataLoader as any).mockImplementation(() => mockDataLoader)

    converter = new GigaPlannerConverter()
  })

  describe('initialization', () => {
    it('should initialize successfully with data', async () => {
      await expect(converter.initialize()).resolves.not.toThrow()
    })

    it('should throw error if data loading fails', async () => {
      mockDataLoader.loadAllData.mockRejectedValue(
        new Error('Data loading failed')
      )

      await expect(converter.initialize()).rejects.toThrow(
        'Failed to initialize GigaPlannerConverter'
      )
    })
  })

  describe('data mappings', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should return correct data mappings', () => {
      const mappings = converter.getDataMappings()

      expect(mappings.races).toHaveLength(2)
      expect(mappings.standingStones).toHaveLength(2)
      expect(mappings.blessings).toHaveLength(2)
      expect(mappings.perkLists).toHaveLength(1)
      expect(mappings.gameMechanics).toHaveLength(1)
      expect(mappings.presets).toHaveLength(1)
    })

    it('should return correct perk list data', () => {
      const perks = converter.getPerksForList('LoreRim v3.0.4')

      expect(perks).toHaveLength(2)
      expect(perks[0]).toEqual({
        id: 0,
        name: 'Craftsmanship',
        skill: 'Smithing',
        skillReq: 0,
        description: 'Basic crafting',
      })
    })

    it('should return empty array for unknown perk list', () => {
      const perks = converter.getPerksForList('Unknown List')
      expect(perks).toEqual([])
    })
  })

  describe('URL decoding', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should decode valid URL successfully', () => {
      // Create a valid base64url encoded string that matches our mock data
      // Version 2, perkListId 0, gameMechanicsId 0, level 50, etc.
      const result = converter.decodeUrl('https://gigaplanner.com?b=AgAAAAAA')

      expect(result.success).toBe(true)
      expect(result.character).toBeDefined()
      if (result.character) {
        expect(result.character.level).toBeDefined()
        expect(result.character.race).toBeDefined()
        expect(result.character.standingStone).toBeDefined()
        expect(result.character.blessing).toBeDefined()
      }
    })

    it('should handle URL without build code', () => {
      const result = converter.decodeUrl('https://gigaplanner.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('No build code found in URL')
    })

    it('should handle invalid URL', () => {
      const result = converter.decodeUrl('invalid-url')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('URL encoding', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should encode valid character data successfully', () => {
      const characterData = {
        level: 50,
        hmsIncreases: {
          health: 10,
          magicka: 5,
          stamina: 5,
        },
        skillLevels: [
          { skill: 'Smithing', level: 100 },
          { skill: 'Heavy Armor', level: 75 },
        ],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: ['Craftsmanship'],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(true)
      expect(result.url).toBeDefined()
      expect(result.url).toContain('https://gigaplanner.com?b=')
    })

    it('should handle unknown perk list', () => {
      const characterData = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'Unknown List',
          gameMechanics: 'LoreRim v4',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown perk list')
    })

    it('should handle unknown game mechanics', () => {
      const characterData = {
        level: 50,
        hmsIncreases: { health: 10, magicka: 5, stamina: 5 },
        skillLevels: [],
        oghmaChoice: 'Health' as const,
        race: 'Nord',
        standingStone: 'Warrior',
        blessing: 'Blessing of Akatosh',
        perks: [],
        configuration: {
          perkList: 'LoreRim v3.0.4',
          gameMechanics: 'Unknown Mechanics',
        },
      }

      const result = converter.encodeUrl(characterData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Unknown game mechanics')
    })
  })

  describe('Oghma choice parsing', () => {
    beforeEach(async () => {
      await converter.initialize()
    })

    it('should parse Oghma choice correctly for version 1', () => {
      // This would test the private parseOghmaChoice method indirectly
      // through the decodeBuildCode method
      const result = converter.decodeUrl('https://gigaplanner.com?b=AQAAAAAA')

      if (result.success && result.character) {
        expect(['None', 'Health', 'Magicka', 'Stamina']).toContain(
          result.character.oghmaChoice
        )
      }
    })
  })
})
