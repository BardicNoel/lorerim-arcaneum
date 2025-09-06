import { useEffect } from 'react'
import { cleanupUrl, hasMainUrlQueryParams } from '../utils/urlCleanup'

/**
 * Hook that ensures the URL is always clean and uses hash-based routing
 * This should be used in components that might cause URL changes
 */
export const useURLCleanup = () => {
  useEffect(() => {
    // Clean up URL on mount if needed
    if (hasMainUrlQueryParams()) {
      console.log('🔄 [URL Cleanup] Cleaning up main URL query params on mount')
      cleanupUrl()
    }
  }, [])

  // Return a function that can be called manually to clean up the URL
  return cleanupUrl
}
