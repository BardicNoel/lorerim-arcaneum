import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useURLSync } from '../useURLSync'
import { useCharacterStore } from '../../stores/characterStore'
import { DEFAULT_BUILD } from '../../types/build'

// Mock the character store
vi.mock('../../stores/characterStore', () => ({
  useCharacterStore: vi.fn()
}))

// Mock URL encoding utilities
vi.mock('../../utils/urlEncoding', () => ({
  decode: vi.fn(),
  encode: vi.fn()
}))

// Mock build validation
vi.mock('../../utils/validateBuild', () => ({
  validateBuild: vi.fn((build) => build)
}))

// Mock compact perk encoding
vi.mock('../../utils/compactPerkEncoding', () => ({
  getPerkData: vi.fn((build) => 'perks' in build ? build.perks : build.p)
}))

// Mock URL cleanup utilities
vi.mock('../../utils/urlCleanup', () => ({
  cleanupUrl: vi.fn(),
  hasMainUrlQueryParams: vi.fn()
}))

// Mock window.location and window.history
const mockLocation = {
  href: '',
  origin: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  replaceState: vi.fn()
}

const mockHistory = {
  replaceState: vi.fn()
}

describe('useURLSync', () => {
  const mockSetBuild = vi.fn()
  const mockDecode = vi.fn()
  const mockEncode = vi.fn()
  const mockCleanupUrl = vi.fn()
  const mockHasMainUrlQueryParams = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })
    
    // Mock window.history
    Object.defineProperty(window, 'history', {
      value: mockHistory,
      writable: true
    })

    // Setup store mock
    ;(useCharacterStore as any).mockImplementation((selector) => {
      if (selector.toString().includes('build')) {
        return DEFAULT_BUILD
      }
      if (selector.toString().includes('setBuild')) {
        return mockSetBuild
      }
      return selector({ build: DEFAULT_BUILD, setBuild: mockSetBuild })
    })

    // Setup utility mocks
    const urlEncoding = await import('../../utils/urlEncoding')
    const urlCleanup = await import('../../utils/urlCleanup')
    
    vi.mocked(urlEncoding.decode).mockImplementation(mockDecode)
    vi.mocked(urlEncoding.encode).mockImplementation(mockEncode)
    vi.mocked(urlCleanup.cleanupUrl).mockImplementation(mockCleanupUrl)
    vi.mocked(urlCleanup.hasMainUrlQueryParams).mockImplementation(mockHasMainUrlQueryParams)
  })

  afterEach(() => {
    // Reset location mock
    mockLocation.href = ''
    mockLocation.search = ''
    mockLocation.hash = ''
  })

  describe('hydration', () => {
    it('should load build from hash parameters', () => {
      const testBuild = { ...DEFAULT_BUILD, name: 'Test Character' }
      const encodedBuild = 'encodedBuild123'
      
      mockLocation.hash = '#/build?b=' + encodedBuild
      mockDecode.mockReturnValue(testBuild)
      mockHasMainUrlQueryParams.mockReturnValue(false)

      renderHook(() => useURLSync())

      expect(mockDecode).toHaveBeenCalledWith(encodedBuild)
      expect(mockSetBuild).toHaveBeenCalledWith(testBuild)
    })

    it('should load build from main URL query parameters', () => {
      const testBuild = { ...DEFAULT_BUILD, name: 'Test Character' }
      const encodedBuild = 'encodedBuild123'
      
      mockLocation.search = '?b=' + encodedBuild
      mockLocation.hash = '#/build'
      mockDecode.mockReturnValue(testBuild)
      mockHasMainUrlQueryParams.mockReturnValue(true)

      renderHook(() => useURLSync())

      expect(mockDecode).toHaveBeenCalledWith(encodedBuild)
      expect(mockSetBuild).toHaveBeenCalledWith(testBuild)
      expect(mockCleanupUrl).toHaveBeenCalled()
    })

    it('should not load build if no encoded build found', () => {
      mockLocation.hash = '#/build'
      mockLocation.search = ''

      renderHook(() => useURLSync())

      expect(mockDecode).not.toHaveBeenCalled()
      expect(mockSetBuild).not.toHaveBeenCalled()
    })
  })

  describe('URL updates', () => {
    it('should update URL when build changes', () => {
      const testBuild = { ...DEFAULT_BUILD, name: 'Test Character' }
      const encodedBuild = 'encodedBuild123'
      
      mockLocation.hash = '#/build'
      mockEncode.mockReturnValue(encodedBuild)
      mockHasMainUrlQueryParams.mockReturnValue(false)

      const { rerender } = renderHook(() => useURLSync())

      // Simulate build change
      ;(useCharacterStore as any).mockImplementation((selector) => {
        if (selector.toString().includes('build')) {
          return testBuild
        }
        if (selector.toString().includes('setBuild')) {
          return mockSetBuild
        }
        return selector({ build: testBuild, setBuild: mockSetBuild })
      })

      rerender()

      expect(mockEncode).toHaveBeenCalledWith(testBuild)
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:5173/#/build?b=' + encodedBuild
      )
    })

    it('should remove build parameter for default builds', () => {
      mockLocation.hash = '#/build?b=someBuild'
      mockEncode.mockReturnValue('encodedDefaultBuild')
      mockHasMainUrlQueryParams.mockReturnValue(false)

      const { rerender } = renderHook(() => useURLSync())

      // Simulate default build (empty build)
      ;(useCharacterStore as any).mockImplementation((selector) => {
        if (selector.toString().includes('build')) {
          return DEFAULT_BUILD
        }
        if (selector.toString().includes('setBuild')) {
          return mockSetBuild
        }
        return selector({ build: DEFAULT_BUILD, setBuild: mockSetBuild })
      })

      rerender()

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        'http://localhost:5173/#/build'
      )
    })
  })
})
