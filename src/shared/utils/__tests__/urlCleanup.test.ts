import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  ensureHashBasedRouting, 
  cleanupUrl, 
  hasMainUrlQueryParams,
  getCurrentHashPath,
  getCurrentHashParams
} from '../urlCleanup'

// Mock window.location
const mockLocation = {
  href: '',
  origin: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  replaceState: vi.fn()
}

// Mock window.history
const mockHistory = {
  replaceState: vi.fn()
}

describe('urlCleanup', () => {
  beforeEach(() => {
    // Reset mocks
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
  })

  afterEach(() => {
    // Reset location mock
    mockLocation.href = ''
    mockLocation.search = ''
    mockLocation.hash = ''
  })

  describe('ensureHashBasedRouting', () => {
    it('should return URL as-is when no main URL query params exist', () => {
      const url = 'http://localhost:5173/#/build'
      const result = ensureHashBasedRouting(url)
      expect(result).toBe(url)
    })

    it('should move main URL query params to hash', () => {
      const url = 'http://localhost:5173/?b=eyJ2IjoxLCJuYW1lIjoiVGVzdCBDaGFyYWN0ZXIiLCJub3RlcyI6IlRlc3QgYnVpbGQiLCJyYWNlIjpudWxsLCJzdG9uZSI6bnVsbCwicmVsaWdpb24iOm51bGwsImZhdm9yaXRlQmxlc3NpbmciOm51bGwsInNraWxscyI6eyJtYWpvciI6W10sIm1pbm9yIjpbXX0sInRyYWl0cyI6eyJyZWd1bGFyIjpbXSwiYm9udXMiOltdfSwidHJhaXRMaW1pdHMiOnsicmVndWxhciI6MiwiYm9udXMiOjF9LCJza2lsbHMiOnsibWFqb3IiOltdLCJtaW5vciI6W119LCJza2lsbExldmVscyI6eyJBVk15c3RpY2lzbSI6NTB9LCJlcXVpcG1lbnQiOltdLCJ1c2VyUHJvZ3Jlc3MiOnsidW5sb2NrcyI6W119LCJkZXN0aW55UGF0aCI6W10sImF0dHJpYnV0ZUFzc2lnbm1lbnRzIjp7ImhlYWx0aCI6MCwic3RhbWluYSI6MCwibWFnaWNrYSI6MCwibGV2ZWwiOjEsImFzc2lnbm1lbnRzIjp7fX0sInAiOnsiTVlTIjpbMCw4LDldfX0#/build'
      
      const result = ensureHashBasedRouting(url)
      
      expect(result).toBe('http://localhost:5173/#/build?b=eyJ2IjoxLCJuYW1lIjoiVGVzdCBDaGFyYWN0ZXIiLCJub3RlcyI6IlRlc3QgYnVpbGQiLCJyYWNlIjpudWxsLCJzdG9uZSI6bnVsbCwicmVsaWdpb24iOm51bGwsImZhdm9yaXRlQmxlc3NpbmciOm51bGwsInNraWxscyI6eyJtYWpvciI6W10sIm1pbm9yIjpbXX0sInRyYWl0cyI6eyJyZWd1bGFyIjpbXSwiYm9udXMiOltdfSwidHJhaXRMaW1pdHMiOnsicmVndWxhciI6MiwiYm9udXMiOjF9LCJza2lsbHMiOnsibWFqb3IiOltdLCJtaW5vciI6W119LCJza2lsbExldmVscyI6eyJBVk15c3RpY2lzbSI6NTB9LCJlcXVpcG1lbnQiOltdLCJ1c2VyUHJvZ3Jlc3MiOnsidW5sb2NrcyI6W119LCJkZXN0aW55UGF0aCI6W10sImF0dHJpYnV0ZUFzc2lnbm1lbnRzIjp7ImhlYWx0aCI6MCwic3RhbWluYSI6MCwibWFnaWNrYSI6MCwibGV2ZWwiOjEsImFzc2lnbm1lbnRzIjp7fX0sInAiOnsiTVlTIjpbMCw4LDldfX0')
    })

    it('should combine existing hash params with main URL params', () => {
      const url = 'http://localhost:5173/?b=build123&tab=perks#/build?other=value'
      
      const result = ensureHashBasedRouting(url)
      
      expect(result).toBe('http://localhost:5173/#/build?other=value&b=build123&tab=perks')
    })
  })

  describe('hasMainUrlQueryParams', () => {
    it('should return false when no main URL query params exist', () => {
      mockLocation.search = ''
      expect(hasMainUrlQueryParams()).toBe(false)
    })

    it('should return true when main URL query params exist', () => {
      mockLocation.search = '?b=build123'
      expect(hasMainUrlQueryParams()).toBe(true)
    })
  })

  describe('cleanupUrl', () => {
    it('should not call replaceState when no main URL query params exist', () => {
      mockLocation.href = 'http://localhost:5173/#/build'
      mockLocation.search = ''
      
      cleanupUrl()
      
      expect(mockHistory.replaceState).not.toHaveBeenCalled()
    })

    it('should call replaceState when main URL query params exist', () => {
      mockLocation.href = 'http://localhost:5173/?b=build123#/build'
      mockLocation.search = '?b=build123'
      mockLocation.hash = '#/build'
      
      cleanupUrl()
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null, 
        '', 
        'http://localhost:5173/#/build?b=build123'
      )
    })
  })

  describe('getCurrentHashPath', () => {
    it('should return hash path without parameters', () => {
      mockLocation.hash = '#/build/perks?b=build123'
      
      const result = getCurrentHashPath()
      
      expect(result).toBe('#/build/perks')
    })

    it('should return default path when no hash exists', () => {
      mockLocation.hash = ''
      
      const result = getCurrentHashPath()
      
      expect(result).toBe('#/')
    })
  })

  describe('getCurrentHashParams', () => {
    it('should return URLSearchParams for hash parameters', () => {
      mockLocation.hash = '#/build?b=build123&tab=perks'
      
      const result = getCurrentHashParams()
      
      expect(result.get('b')).toBe('build123')
      expect(result.get('tab')).toBe('perks')
    })

    it('should return empty URLSearchParams when no hash params exist', () => {
      mockLocation.hash = '#/build'
      
      const result = getCurrentHashParams()
      
      expect(result.toString()).toBe('')
    })
  })
})
