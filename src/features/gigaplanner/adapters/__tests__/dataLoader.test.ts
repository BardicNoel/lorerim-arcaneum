import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { GigaPlannerDataLoader } from '../dataLoader';
import type { GigaPlannerRace, GigaPlannerStandingStone } from '../../types/data';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GigaPlannerDataLoader', () => {
  let loader: GigaPlannerDataLoader;

  beforeEach(() => {
    loader = new GigaPlannerDataLoader();
    vi.clearAllMocks();
  });

  afterEach(() => {
    loader.clearCache();
  });

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
        startingHMSRegen: [0.20, 1.10, 1.60],
        unarmedDam: 32,
        startingSkills: [0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0],
        description: 'Argonians are the reptilian denizens of Black Marsh...',
        bonus: '• Waterbreathing: Your Argonian lungs can breathe underwater...',
      },
    ];

    it('should load races data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaces,
      } as Response);

      const result = await loader.loadRaces();

      expect(result).toEqual(mockRaces);
      expect(mockFetch).toHaveBeenCalledWith('/src/features/gigaplanner/data/races.json');
    });

    it('should cache races data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRaces,
      } as Response);

      // First load
      await loader.loadRaces();
      
      // Second load should use cache
      const result = await loader.loadRaces();

      expect(result).toEqual(mockRaces);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only called once due to caching
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(loader.loadRaces()).rejects.toThrow('Failed to load races data: 404 Not Found');
    });

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ races: mockRaces }),
      } as Response);

      await expect(loader.loadRaces()).rejects.toThrow('Races data is not an array');
    });

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
          startingHMSRegen: [0.20, 1.10, 1.60],
          unarmedDam: 32,
          startingSkills: [0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0],
          description: 'Argonians are the reptilian denizens of Black Marsh...',
          bonus: '• Waterbreathing: Your Argonian lungs can breathe underwater...',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response);

      await expect(loader.loadRaces()).rejects.toThrow('Invalid race data: missing required fields for Argonian');
    });

    it('should throw error when startingHMS is invalid', async () => {
      const invalidRaces = [
        {
          ...mockRaces[0],
          startingHMS: [140, 120], // Only 2 numbers instead of 3
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response);

      await expect(loader.loadRaces()).rejects.toThrow('Invalid race data: startingHMS must be array of 3 numbers for Argonian');
    });

    it('should throw error when startingSkills is invalid', async () => {
      const invalidRaces = [
        {
          ...mockRaces[0],
          startingSkills: [0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1], // Only 19 numbers instead of 20
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidRaces,
      } as Response);

      await expect(loader.loadRaces()).rejects.toThrow('Invalid race data: startingSkills must be array of 20 numbers for Argonian');
    });
  });

  describe('loadStandingStones', () => {
    const mockStandingStones: GigaPlannerStandingStone[] = [
      {
        id: 'warrior',
        name: 'Warrior',
        edid: 'REQ_Ability_Birthsign_Warrior',
        group: 'The Warrior is the first Guardian Constellation...',
        description: 'Those under the sign of the Warrior have increased strength and endurance.',
        bonus: 'Health increases by 50, all weapons deal 10% more damage...',
      },
    ];

    it('should load standing stones data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStandingStones,
      } as Response);

      const result = await loader.loadStandingStones();

      expect(result).toEqual(mockStandingStones);
      expect(mockFetch).toHaveBeenCalledWith('/src/features/gigaplanner/data/standingStones.json');
    });

    it('should cache standing stones data after first load', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStandingStones,
      } as Response);

      // First load
      await loader.loadStandingStones();
      
      // Second load should use cache
      const result = await loader.loadStandingStones();

      expect(result).toEqual(mockStandingStones);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only called once due to caching
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(loader.loadStandingStones()).rejects.toThrow('Failed to load standing stones data: 404 Not Found');
    });

    it('should throw error when response is not an array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ standingStones: mockStandingStones }),
      } as Response);

      await expect(loader.loadStandingStones()).rejects.toThrow('Standing stones data is not an array');
    });

    it('should throw error when standing stone data is invalid', async () => {
      const invalidStones = [
        {
          id: 'warrior',
          // Missing name
          edid: 'REQ_Ability_Birthsign_Warrior',
          group: 'The Warrior is the first Guardian Constellation...',
          description: 'Those under the sign of the Warrior have increased strength and endurance.',
          bonus: 'Health increases by 50, all weapons deal 10% more damage...',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidStones,
      } as Response);

      await expect(loader.loadStandingStones()).rejects.toThrow('Invalid standing stone data: missing required fields for unknown');
    });
  });

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
        startingHMSRegen: [0.20, 1.10, 1.60],
        unarmedDam: 32,
        startingSkills: [0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0],
        description: 'Argonians are the reptilian denizens of Black Marsh...',
        bonus: '• Waterbreathing: Your Argonian lungs can breathe underwater...',
      },
    ];

    const mockStandingStones: GigaPlannerStandingStone[] = [
      {
        id: 'warrior',
        name: 'Warrior',
        edid: 'REQ_Ability_Birthsign_Warrior',
        group: 'The Warrior is the first Guardian Constellation...',
        description: 'Those under the sign of the Warrior have increased strength and endurance.',
        bonus: 'Health increases by 50, all weapons deal 10% more damage...',
      },
    ];

    it('should load all data successfully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRaces,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStandingStones,
        } as Response);

      const result = await loader.loadAllData();

      expect(result).toEqual({
        races: mockRaces,
        standingStones: mockStandingStones,
      });
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      loader.clearCache();
      const stats = loader.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });

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
          startingHMSRegen: [0.20, 1.10, 1.60],
          unarmedDam: 32,
          startingSkills: [0, 0, 0, 0, 10, 0, 10, 10, 10, 0, 0, 15, 0, 0, 0, 10, 0, 0, 1, 0],
          description: 'Argonians are the reptilian denizens of Black Marsh...',
          bonus: '• Waterbreathing: Your Argonian lungs can breathe underwater...',
        },
      ];

      const mockStandingStones: GigaPlannerStandingStone[] = [
        {
          id: 'warrior',
          name: 'Warrior',
          edid: 'REQ_Ability_Birthsign_Warrior',
          group: 'The Warrior is the first Guardian Constellation...',
          description: 'Those under the sign of the Warrior have increased strength and endurance.',
          bonus: 'Health increases by 50, all weapons deal 10% more damage...',
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRaces,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStandingStones,
        } as Response);

      await loader.loadRaces();
      await loader.loadStandingStones();
      
      const stats = loader.getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toEqual(['races', 'standingStones']);
    });
  });
});
