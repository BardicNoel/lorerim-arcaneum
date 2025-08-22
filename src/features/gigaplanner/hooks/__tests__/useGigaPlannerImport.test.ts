import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GigaPlannerConverter } from '../../adapters/gigaplannerConverter'
import { AdvancedGigaPlannerTransformer } from '../../utils/advancedTransformation'
import { useGigaPlannerImport } from '../useGigaPlannerImport'

// Mock the dependencies
vi.mock('../../adapters/gigaplannerConverter')
vi.mock('../../utils/advancedTransformation')

describe('useGigaPlannerImport', () => {
  let mockConverter: any
  let mockTransformer: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create mock converter
    mockConverter = {
      initialize: vi.fn().mockResolvedValue(undefined),
      decodeUrl: vi.fn(),
    }

    // Create mock transformer
    mockTransformer = {
      initialize: vi.fn().mockResolvedValue(undefined),
      transformGigaPlannerToBuildState: vi.fn(),
    }

    // Mock the constructors
    ;(GigaPlannerConverter as any).mockImplementation(() => mockConverter)
    ;(AdvancedGigaPlannerTransformer as any).mockImplementation(
      () => mockTransformer
    )
  })

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const { result } = renderHook(() => useGigaPlannerImport())

      expect(result.current.isInitialized).toBe(false)

      await act(async () => {
        await result.current.initialize()
      })

      expect(mockConverter.initialize).toHaveBeenCalled()
      expect(mockTransformer.initialize).toHaveBeenCalled()
      expect(result.current.isInitialized).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe(true)
    })

    it('should handle initialization errors', async () => {
      mockConverter.initialize.mockRejectedValue(
        new Error('Initialization failed')
      )

      const { result } = renderHook(() => useGigaPlannerImport())

      await act(async () => {
        await result.current.initialize()
      })

      expect(result.current.error).toBe('Initialization failed')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe(false)
    })

    it('should not reinitialize if already initialized', async () => {
      const { result } = renderHook(() => useGigaPlannerImport())

      // Initialize first time
      await act(async () => {
        await result.current.initialize()
      })

      // Try to initialize again
      await act(async () => {
        await result.current.initialize()
      })

      // Should only be called once
      expect(mockConverter.initialize).toHaveBeenCalledTimes(1)
      expect(mockTransformer.initialize).toHaveBeenCalledTimes(1)
    })
  })

  describe('importFromUrl', () => {
    it('should import successfully from URL', async () => {
      const mockCharacter = {
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
          gameMechanics: 'LoreRim v4',
        },
      }

      const mockBuildState = {
        race: 'Nord',
        stone: 'Warrior',
        favoriteBlessing: 'Blessing of Akatosh',
        attributeAssignments: {
          level: 50,
          health: 11,
          magicka: 5,
          stamina: 5,
        },
      }

      mockConverter.decodeUrl.mockReturnValue({
        success: true,
        character: mockCharacter,
        preset: 'Test Preset',
      })

      mockTransformer.transformGigaPlannerToBuildState.mockReturnValue({
        success: true,
        data: mockBuildState,
        warnings: ['Test warning'],
      })

      const { result } = renderHook(() => useGigaPlannerImport())

      // Initialize first
      await act(async () => {
        await result.current.initialize()
      })

      // Import from URL
      let importResult: any = null
      await act(async () => {
        importResult = await result.current.importFromUrl(
          'https://gigaplanner.com?b=test'
        )
      })

      expect(mockConverter.decodeUrl).toHaveBeenCalledWith(
        'https://gigaplanner.com?b=test'
      )
      expect(
        mockTransformer.transformGigaPlannerToBuildState
      ).toHaveBeenCalledWith(mockCharacter)
      expect(importResult).toEqual({
        buildState: mockBuildState,
        warnings: ['Imported from preset: Test Preset', 'Test warning'],
      })
      expect(result.current.success).toBe(true)
      expect(result.current.warnings).toContain(
        'Imported from preset: Test Preset'
      )
    })

    it('should handle decode errors', async () => {
      mockConverter.decodeUrl.mockReturnValue({
        success: false,
        error: 'Invalid URL format',
      })

      const { result } = renderHook(() => useGigaPlannerImport())

      await act(async () => {
        await result.current.initialize()
      })

      await act(async () => {
        await result.current.importFromUrl('invalid-url')
      })

      expect(result.current.error).toBe('Invalid URL format')
      expect(result.current.success).toBe(false)
    })

    it('should handle transform errors', async () => {
      const mockCharacter = {
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
          gameMechanics: 'LoreRim v4',
        },
      }

      mockConverter.decodeUrl.mockReturnValue({
        success: true,
        character: mockCharacter,
      })

      mockTransformer.transformGigaPlannerToBuildState.mockReturnValue({
        success: false,
        error: 'Transform failed',
      })

      const { result } = renderHook(() => useGigaPlannerImport())

      await act(async () => {
        await result.current.initialize()
      })

      await act(async () => {
        await result.current.importFromUrl('https://gigaplanner.com?b=test')
      })

      expect(result.current.error).toBe('Transform failed')
      expect(result.current.success).toBe(false)
    })

    it('should auto-initialize if not initialized', async () => {
      const mockCharacter = {
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
          gameMechanics: 'LoreRim v4',
        },
      }

      const mockBuildState = {
        race: 'Nord',
        attributeAssignments: { level: 50, health: 11, magicka: 5, stamina: 5 },
      }

      mockConverter.decodeUrl.mockReturnValue({
        success: true,
        character: mockCharacter,
      })

      mockTransformer.transformGigaPlannerToBuildState.mockReturnValue({
        success: true,
        data: mockBuildState,
      })

      const { result } = renderHook(() => useGigaPlannerImport())

      // Don't initialize manually, let importFromUrl do it
      await act(async () => {
        await result.current.importFromUrl('https://gigaplanner.com?b=test')
      })

      expect(mockConverter.initialize).toHaveBeenCalled()
      expect(mockTransformer.initialize).toHaveBeenCalled()
      expect(result.current.isInitialized).toBe(true)
    })
  })

  describe('importFromBuildCode', () => {
    it('should import from build code', async () => {
      const mockCharacter = {
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
          gameMechanics: 'LoreRim v4',
        },
      }

      const mockBuildState = {
        race: 'Nord',
        attributeAssignments: { level: 50, health: 11, magicka: 5, stamina: 5 },
      }

      mockConverter.decodeUrl.mockReturnValue({
        success: true,
        character: mockCharacter,
      })

      mockTransformer.transformGigaPlannerToBuildState.mockReturnValue({
        success: true,
        data: mockBuildState,
      })

      const { result } = renderHook(() => useGigaPlannerImport())

      await act(async () => {
        await result.current.initialize()
      })

      await act(async () => {
        await result.current.importFromBuildCode('AgAAAAAA')
      })

      expect(mockConverter.decodeUrl).toHaveBeenCalledWith(
        'https://gigaplanner.com?b=AgAAAAAA'
      )
      expect(result.current.success).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset the state', async () => {
      const { result } = renderHook(() => useGigaPlannerImport())

      // Set some state
      await act(async () => {
        await result.current.initialize()
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBe(null)
      expect(result.current.warnings).toEqual([])
      expect(result.current.success).toBe(false)
      expect(result.current.isLoading).toBe(false)
    })
  })
})
