import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearCache, loadDataset } from '../dataCache'

// Mock fetch
global.fetch = vi.fn()

describe('dataCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearCache()
  })

  describe('destinyNodes loading', () => {
    it('should load destiny nodes from subclasses.json', async () => {
      const mockDestinyData = [
        {
          name: 'Destiny',
          edid: 'DAR_Perk01Destiny',
          description: 'Increases carry weight by 25.',
          prerequisites: [],
          globalFormId: '0xFE25F808',
        },
        {
          name: 'Focus',
          edid: 'DAR_Perk02Focus',
          description: 'Your Magicka Regeneration is increased by 50%.',
          prerequisites: ['DAR_Perk01Destiny'],
          globalFormId: '0xFE25F80A',
        },
      ]

      const mockResponse = {
        ok: true,
        json: async () => mockDestinyData,
      }

      ;(fetch as any).mockResolvedValue(mockResponse)

      const result = await loadDataset('destinyNodes')

      // Verify fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('data/subclasses.json')
      )

      // Verify the result structure
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)

      // Verify the first node has the expected structure
      const firstNode = result[0]
      expect(firstNode).toHaveProperty('id')
      expect(firstNode).toHaveProperty('name', 'Destiny')
      expect(firstNode).toHaveProperty('edid', 'DAR_Perk01Destiny')
      expect(firstNode).toHaveProperty(
        'description',
        'Increases carry weight by 25.'
      )
      expect(firstNode).toHaveProperty('prerequisites')
      expect(firstNode).toHaveProperty('globalFormId', '0xFE25F808')
      expect(firstNode).toHaveProperty('tags')
      expect(Array.isArray(firstNode.tags)).toBe(true)
    })

    it('should handle missing prerequisites array', async () => {
      const mockDestinyData = [
        {
          name: 'Destiny',
          edid: 'DAR_Perk01Destiny',
          description: 'Increases carry weight by 25.',
          globalFormId: '0xFE25F808',
          // Missing prerequisites
        },
      ]

      const mockResponse = {
        ok: true,
        json: async () => mockDestinyData,
      }

      ;(fetch as any).mockResolvedValue(mockResponse)

      const result = await loadDataset('destinyNodes')

      expect(result[0]).toHaveProperty('prerequisites')
      expect(Array.isArray(result[0].prerequisites)).toBe(true)
      expect(result[0].prerequisites).toHaveLength(0)
    })
  })
})
