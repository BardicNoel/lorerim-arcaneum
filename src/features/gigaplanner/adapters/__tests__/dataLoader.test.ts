import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  GigaPlannerBlessing,
  GigaPlannerGameMechanics,
  GigaPlannerPreset,
  GigaPlannerRace,
  GigaPlannerStandingStone,
} from '../../types/data'
import { GigaPlannerDataLoader } from '../dataLoader'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('GigaPlannerDataLoader', () => {
  let loader: GigaPlannerDataLoader

  beforeEach(() => {
    loader = new GigaPlannerDataLoader()
    vi.clearAllMocks()
  })

  afterEach(() => {
    loader.clearCache()
  })

  describe('loadRaces', () => {
    const mockRaces: GigaPlannerRace[] = [
      {
        id: 'argonian',
        name: 'Argonian',
        edid: 'ArgonianRace',
        startingHMS: [140, 120, 100],
        startingCW: 200,
        speedBonus: 0,
        hmsBonus: [0, 0, 0],
        startingHMSRegen: [0.2, 1.1, 1.6],
        unarmedDam: 32,
        startingSkills: [
          0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0,
        ],
        description: 'Argonians are the reptilian denizens of Black Marsh...',
        bonus:
          '• Waterbreathing: Your Argonian lungs can breathe underwater...',
      },
    ]

    it('should load races data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaces,
      } as Response)

      const result = await loader.loadRaces()

      expect(result).toEqual(mockRaces)
      expect(mockFetch).toHaveBeenCalledWith(
        '/src/features/gigaplanner/data/races.json'
      )
    })

    it('should cache races data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaces,
      } as Response)

      // First load
      await loader.loadRaces()

      // Second load should use cache
      const result = await loader.loadRaces()

      expect(result).toEqual(mockRaces)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(loader.loadRaces()).rejects.toThrow(
        'Failed to load races data: 404 Not Found'
      )
    })

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ races: mockRaces }),
      } as Response)

      await expect(loader.loadRaces()).rejects.toThrow(
        'Races data is not an array'
      )
    })

    it('should throw error when race data is invalid', async () => {
      const invalidRaces = [
        {
          id: 'argonian',
          name: 'Argonian',
          // Missing edid
          startingHMS: [140, 120, 100],
          startingCW: 200,
          speedBonus: 0,
          hmsBonus: [0, 0, 0],
          startingHMSRegen: [0.2, 1.1, 1.6],
          unarmedDam: 32,
          startingSkills: [
            0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0,
          ],
          description: 'Argonians are the reptilian denizens of Black Marsh...',
          bonus:
            '• Waterbreathing: Your Argonian lungs can breathe underwater...',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response)

      await expect(loader.loadRaces()).rejects.toThrow(
        'Invalid race data: missing required fields for Argonian'
      )
    })

    it('should throw error when startingHMS is invalid', async () => {
      const invalidRaces = [
        {
          ...mockRaces[0],
          startingHMS: [140, 120], // Only 2 numbers instead of 3
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response)

      await expect(loader.loadRaces()).rejects.toThrow(
        'Invalid race data: startingHMS must be array of 3 numbers for Argonian'
      )
    })

    it('should throw error when startingSkills is invalid', async () => {
      const invalidRaces = [
        {
          ...mockRaces[0],
          startingSkills: [
            0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1,
          ], // Only 19 numbers instead of 20
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response)

      await expect(loader.loadRaces()).rejects.toThrow(
        'Invalid race data: startingSkills must be array of 20 numbers for Argonian'
      )
    })
  })

  describe('loadStandingStones', () => {
    const mockStandingStones: GigaPlannerStandingStone[] = [
      {
        id: 'warrior',
        name: 'Warrior',
        edid: 'REQ_Ability_Birthsign_Warrior',
        group: 'The Warrior is the first Guardian Constellation...',
        description:
          'Those under the sign of the Warrior have increased strength and endurance.',
        bonus: 'Health increases by 50, all weapons deal 10% more damage...',
      },
    ]

    it('should load standing stones data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStandingStones,
      } as Response)

      const result = await loader.loadStandingStones()

      expect(result).toEqual(mockStandingStones)
      expect(mockFetch).toHaveBeenCalledWith(
        '/src/features/gigaplanner/data/standingStones.json'
      )
    })

    it('should cache standing stones data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStandingStones,
      } as Response)

      // First load
      await loader.loadStandingStones()

      // Second load should use cache
      const result = await loader.loadStandingStones()

      expect(result).toEqual(mockStandingStones)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(loader.loadStandingStones()).rejects.toThrow(
        'Failed to load standing stones data: 404 Not Found'
      )
    })

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ standingStones: mockStandingStones }),
      } as Response)

      await expect(loader.loadStandingStones()).rejects.toThrow(
        'Standing stones data is not an array'
      )
    })

    it('should throw error when standing stone data is invalid', async () => {
      const invalidStones = [
        {
          id: 'warrior',
          // Missing name
          edid: 'REQ_Ability_Birthsign_Warrior',
          group: 'The Warrior is the first Guardian Constellation...',
          description:
            'Those under the sign of the Warrior have increased strength and endurance.',
          bonus: 'Health increases by 50, all weapons deal 10% more damage...',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidStones,
      } as Response)

      await expect(loader.loadStandingStones()).rejects.toThrow(
        'Invalid standing stone data: missing required fields for unknown'
      )
    })
  })

  describe('loadBlessings', () => {
    const mockBlessings: GigaPlannerBlessing[] = [
      {
        id: 'akatosh',
        name: 'Akatosh',
        edid: 'BlessingAkatosh',
        shrine: 'Dragon Slayer: 15 % magic resistance',
        follower:
          'Father of Dragons: Attacks, spells, scrolls, shouts and enchantments are X% better against dragons (based on favor with Akatosh).',
        devotee:
          'Turn the Hourglass: Praying to Akatosh resets the cooldown of your most recently used shout and power.',
        tenents:
          'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
        race: 'All',
        starting: 'Breton / Imperial / Khajiit / Nord',
        req: 'None',
        category: 'Divine',
      },
    ]

    it('should load blessings data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBlessings,
      } as Response)

      const result = await loader.loadBlessings()

      expect(result).toEqual(mockBlessings)
      expect(mockFetch).toHaveBeenCalledWith(
        '/src/features/gigaplanner/data/blessings.json'
      )
    })

    it('should cache blessings data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBlessings,
      } as Response)

      // First load
      await loader.loadBlessings()

      // Second load should use cache
      const result = await loader.loadBlessings()

      expect(result).toEqual(mockBlessings)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(loader.loadBlessings()).rejects.toThrow(
        'Failed to load blessings data: 404 Not Found'
      )
    })

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ blessings: mockBlessings }),
      } as Response)

      await expect(loader.loadBlessings()).rejects.toThrow(
        'Blessings data is not an array'
      )
    })

    it('should throw error when blessing data is invalid', async () => {
      const invalidBlessings = [
        {
          id: 'akatosh',
          // Missing name
          edid: 'BlessingAkatosh',
          shrine: 'Dragon Slayer: 15 % magic resistance',
          follower:
            'Father of Dragons: Attacks, spells, scrolls, shouts and enchantments are X% better against dragons (based on favor with Akatosh).',
          devotee:
            'Turn the Hourglass: Praying to Akatosh resets the cooldown of your most recently used shout and power.',
          tenents:
            'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
          race: 'All',
          starting: 'Breton / Imperial / Khajiit / Nord',
          req: 'None',
          category: 'Divine',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidBlessings,
      } as Response)

      await expect(loader.loadBlessings()).rejects.toThrow(
        'Invalid blessing data: missing required fields for unknown'
      )
    })
  })

  describe('loadGameMechanics', () => {
    const mockGameMechanics: GigaPlannerGameMechanics[] = [
      {
        id: 'lorerim-v4',
        name: 'LoreRim v4',
        gameId: 0,
        description: 'LoreRim v4 game mechanics with balanced progression, realistic combat, and lore-friendly systems designed for immersive gameplay.',
        version: '4.0.0',
        initialPerks: 3,
        oghmaData: {
          perksGiven: 3,
          hmsGiven: [0, 0, 0],
        },
        leveling: {
          base: 30,
          mult: 0,
          hmsGiven: [5, 5, 5],
        },
        derivedAttributes: {
          attribute: ['Magic Resist', 'Magicka Regen', 'Disease Resist'],
          isPercent: [true, true, true],
          prefactor: [1.0, 8.0, 4.0],
          threshold: [150, 100, 100],
          weight_health: [0, 0, 0.4],
          weight_magicka: [1, 1, 0],
          weight_stamina: [0, 0, 0.6],
        },
      },
    ]

    it('should load game mechanics data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameMechanics,
      } as Response)

      const result = await loader.loadGameMechanics()

      expect(result).toEqual(mockGameMechanics)
      expect(mockFetch).toHaveBeenCalledWith(
        '/src/features/gigaplanner/data/gameMechanics.json'
      )
    })

    it('should cache game mechanics data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameMechanics,
      } as Response)

      // First load
      await loader.loadGameMechanics()

      // Second load should use cache
      const result = await loader.loadGameMechanics()

      expect(result).toEqual(mockGameMechanics)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(loader.loadGameMechanics()).rejects.toThrow(
        'Failed to load game mechanics data: 404 Not Found'
      )
    })

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gameMechanics: mockGameMechanics }),
      } as Response)

      await expect(loader.loadGameMechanics()).rejects.toThrow(
        'Game mechanics data is not an array'
      )
    })

    it('should throw error when game mechanics data is invalid', async () => {
      const invalidGameMechanics = [
        {
          id: 'lorerim-v4',
          // Missing name and gameId
          description: 'LoreRim v4 game mechanics',
          version: '4.0.0',
          initialPerks: 3,
          oghmaData: {
            perksGiven: 3,
            hmsGiven: [0, 0, 0],
          },
          leveling: {
            base: 30,
            mult: 0,
            hmsGiven: [5, 5, 5],
          },
          derivedAttributes: {
            attribute: ['Magic Resist'],
            isPercent: [true],
            prefactor: [1.0],
            threshold: [150],
            weight_health: [0],
            weight_magicka: [1],
            weight_stamina: [0],
          },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidGameMechanics,
      } as Response)

      await expect(loader.loadGameMechanics()).rejects.toThrow(
        'Invalid game mechanics data: missing required fields for unknown'
      )
    })

    it('should throw error when derived attributes arrays have inconsistent lengths', async () => {
      const invalidGameMechanics = [
        {
          id: 'lorerim-v4',
          name: 'LoreRim v4',
          gameId: 0,
          description: 'LoreRim v4 game mechanics',
          version: '4.0.0',
          initialPerks: 3,
          oghmaData: {
            perksGiven: 3,
            hmsGiven: [0, 0, 0],
          },
          leveling: {
            base: 30,
            mult: 0,
            hmsGiven: [5, 5, 5],
          },
          derivedAttributes: {
            attribute: ['Magic Resist', 'Magicka Regen'], // 2 items
            isPercent: [true], // Only 1 item - inconsistent!
            prefactor: [1.0, 8.0],
            threshold: [150, 100],
            weight_health: [0, 0],
            weight_magicka: [1, 1],
            weight_stamina: [0, 0],
          },
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidGameMechanics,
      } as Response)

      await expect(loader.loadGameMechanics()).rejects.toThrow(
        'Invalid game mechanics data: derivedAttributes arrays have inconsistent lengths for LoreRim v4'
      )
    })
  })

  describe('loadPresets', () => {
    const mockPresets: GigaPlannerPreset[] = [
      {
        id: 'lorerim-v3-0-4',
        name: 'LoreRim v3.0.4',
        presetId: 0,
        description: 'LoreRim v3.0.4 preset with balanced progression, lore-friendly mechanics, and comprehensive character building options.',
        version: '3.0.4',
        perks: 0,
        races: 0,
        gameMechanics: 0,
        blessings: 0,
        category: 'balanced',
        tags: ['lore-friendly', 'balanced', 'immersive', 'comprehensive'],
      },
    ]

    it('should load presets data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPresets,
      } as Response)

      const result = await loader.loadPresets()

      expect(result).toEqual(mockPresets)
      expect(mockFetch).toHaveBeenCalledWith(
        '/src/features/gigaplanner/data/presets.json'
      )
    })

    it('should cache presets data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPresets,
      } as Response)

      // First load
      await loader.loadPresets()

      // Second load should use cache
      const result = await loader.loadPresets()

      expect(result).toEqual(mockPresets)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      await expect(loader.loadPresets()).rejects.toThrow(
        'Failed to load presets data: 404 Not Found'
      )
    })

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ presets: mockPresets }),
      } as Response)

      await expect(loader.loadPresets()).rejects.toThrow(
        'Presets data is not an array'
      )
    })

    it('should throw error when preset data is invalid', async () => {
      const invalidPresets = [
        {
          id: 'lorerim-v3-0-4',
          // Missing name and presetId
          description: 'LoreRim v3.0.4 preset',
          version: '3.0.4',
          perks: 0,
          races: 0,
          gameMechanics: 0,
          blessings: 0,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidPresets,
      } as Response)

      await expect(loader.loadPresets()).rejects.toThrow(
        'Invalid preset data: missing required fields for unknown'
      )
    })

    it('should throw error when reference fields are not numbers', async () => {
      const invalidPresets = [
        {
          id: 'lorerim-v3-0-4',
          name: 'LoreRim v3.0.4',
          presetId: 0,
          description: 'LoreRim v3.0.4 preset',
          version: '3.0.4',
          perks: '0', // String instead of number
          races: 0,
          gameMechanics: 0,
          blessings: 0,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidPresets,
      } as Response)

      await expect(loader.loadPresets()).rejects.toThrow(
        'Invalid preset data: reference fields must be numbers for LoreRim v3.0.4'
      )
    })

    it('should throw error when version format is invalid', async () => {
      const invalidPresets = [
        {
          id: 'lorerim-v3-0-4',
          name: 'LoreRim v3.0.4',
          presetId: 0,
          description: 'LoreRim v3.0.4 preset',
          version: '3.0', // Invalid format (missing patch version)
          perks: 0,
          races: 0,
          gameMechanics: 0,
          blessings: 0,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidPresets,
      } as Response)

      await expect(loader.loadPresets()).rejects.toThrow(
        'Invalid preset data: version must be in format x.y.z for LoreRim v3.0.4'
      )
    })
  })

  describe('loadAllData', () => {
    const mockRaces: GigaPlannerRace[] = [
      {
        id: 'argonian',
        name: 'Argonian',
        edid: 'ArgonianRace',
        startingHMS: [140, 120, 100],
        startingCW: 200,
        speedBonus: 0,
        hmsBonus: [0, 0, 0],
        startingHMSRegen: [0.2, 1.1, 1.6],
        unarmedDam: 32,
        startingSkills: [
          0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0,
        ],
        description: 'Argonians are the reptilian denizens of Black Marsh...',
        bonus:
          '• Waterbreathing: Your Argonian lungs can breathe underwater...',
      },
    ]

    const mockStandingStones: GigaPlannerStandingStone[] = [
      {
        id: 'warrior',
        name: 'Warrior',
        edid: 'REQ_Ability_Birthsign_Warrior',
        group: 'The Warrior is the first Guardian Constellation...',
        description:
          'Those under the sign of the Warrior have increased strength and endurance.',
        bonus: 'Health increases by 50, all weapons deal 10% more damage...',
      },
    ]

    const mockBlessings: GigaPlannerBlessing[] = [
      {
        id: 'akatosh',
        name: 'Akatosh',
        edid: 'BlessingAkatosh',
        shrine: 'Dragon Slayer: 15 % magic resistance',
        follower:
          'Father of Dragons: Attacks, spells, scrolls, shouts and enchantments are X% better against dragons (based on favor with Akatosh).',
        devotee:
          'Turn the Hourglass: Praying to Akatosh resets the cooldown of your most recently used shout and power.',
        tenents:
          'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
        race: 'All',
        starting: 'Breton / Imperial / Khajiit / Nord',
        req: 'None',
        category: 'Divine',
      },
    ]

    const mockGameMechanics: GigaPlannerGameMechanics[] = [
      {
        id: 'lorerim-v4',
        name: 'LoreRim v4',
        gameId: 0,
        description: 'LoreRim v4 game mechanics',
        version: '4.0.0',
        initialPerks: 3,
        oghmaData: {
          perksGiven: 3,
          hmsGiven: [0, 0, 0],
        },
        leveling: {
          base: 30,
          mult: 0,
          hmsGiven: [5, 5, 5],
        },
        derivedAttributes: {
          attribute: ['Magic Resist'],
          isPercent: [true],
          prefactor: [1.0],
          threshold: [150],
          weight_health: [0],
          weight_magicka: [1],
          weight_stamina: [0],
        },
      },
    ]

    const mockPresets: GigaPlannerPreset[] = [
      {
        id: 'lorerim-v3-0-4',
        name: 'LoreRim v3.0.4',
        presetId: 0,
        description: 'LoreRim v3.0.4 preset',
        version: '3.0.4',
        perks: 0,
        races: 0,
        gameMechanics: 0,
        blessings: 0,
      },
    ]

    it('should load all data successfully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRaces,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStandingStones,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBlessings,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGameMechanics,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPresets,
        } as Response)

      const result = await loader.loadAllData()

      expect(result).toEqual({
        races: mockRaces,
        standingStones: mockStandingStones,
        blessings: mockBlessings,
        gameMechanics: mockGameMechanics,
        presets: mockPresets,
      })
    })
  })

  describe('cache management', () => {
    it('should clear cache', () => {
      loader.clearCache()
      const stats = loader.getCacheStats()
      expect(stats.size).toBe(0)
      expect(stats.keys).toEqual([])
    })

    it('should return cache statistics', async () => {
      const mockRaces: GigaPlannerRace[] = [
        {
          id: 'argonian',
          name: 'Argonian',
          edid: 'ArgonianRace',
          startingHMS: [140, 120, 100],
          startingCW: 200,
          speedBonus: 0,
          hmsBonus: [0, 0, 0],
          startingHMSRegen: [0.2, 1.1, 1.6],
          unarmedDam: 32,
          startingSkills: [
            0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0,
          ],
          description: 'Argonians are the reptilian denizens of Black Marsh...',
          bonus:
            '• Waterbreathing: Your Argonian lungs can breathe underwater...',
        },
      ]

      const mockStandingStones: GigaPlannerStandingStone[] = [
        {
          id: 'warrior',
          name: 'Warrior',
          edid: 'REQ_Ability_Birthsign_Warrior',
          group: 'The Warrior is the first Guardian Constellation...',
          description:
            'Those under the sign of the Warrior have increased strength and endurance.',
          bonus: 'Health increases by 50, all weapons deal 10% more damage...',
        },
      ]

      const mockBlessings: GigaPlannerBlessing[] = [
        {
          id: 'akatosh',
          name: 'Akatosh',
          edid: 'BlessingAkatosh',
          shrine: 'Dragon Slayer: 15 % magic resistance',
          follower:
            'Father of Dragons: Attacks, spells, scrolls, shouts and enchantments are X% better against dragons (based on favor with Akatosh).',
          devotee:
            'Turn the Hourglass: Praying to Akatosh resets the cooldown of your most recently used shout and power.',
          tenents:
            'Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.',
          race: 'All',
          starting: 'Breton / Imperial / Khajiit / Nord',
          req: 'None',
          category: 'Divine',
        },
      ]

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRaces,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStandingStones,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBlessings,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: 'lorerim-v4',
              name: 'LoreRim v4',
              gameId: 0,
              description: 'LoreRim v4 game mechanics',
              version: '4.0.0',
              initialPerks: 3,
              oghmaData: { perksGiven: 3, hmsGiven: [0, 0, 0] },
              leveling: { base: 30, mult: 0, hmsGiven: [5, 5, 5] },
              derivedAttributes: {
                attribute: ['Magic Resist'],
                isPercent: [true],
                prefactor: [1.0],
                threshold: [150],
                weight_health: [0],
                weight_magicka: [1],
                weight_stamina: [0],
              },
            },
          ],
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: 'lorerim-v3-0-4',
              name: 'LoreRim v3.0.4',
              presetId: 0,
              description: 'LoreRim v3.0.4 preset',
              version: '3.0.4',
              perks: 0,
              races: 0,
              gameMechanics: 0,
              blessings: 0,
            },
          ],
        } as Response)

      await loader.loadRaces()
      await loader.loadStandingStones()
      await loader.loadBlessings()
      await loader.loadGameMechanics()
      await loader.loadPresets()

      const stats = loader.getCacheStats()
      expect(stats.size).toBe(5)
      expect(stats.keys).toEqual(['races', 'standingStones', 'blessings', 'gameMechanics', 'presets'])
    })
  })
})
