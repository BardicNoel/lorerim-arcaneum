/**
 * URL cleanup utilities for consistent hash-based routing
 */

/**
 * Ensures the URL is properly formatted with hash-based routing
 * Removes any main URL query parameters and ensures all parameters are in the hash
 * 
 * @param url - The current URL (optional, defaults to window.location.href)
 * @returns Clean URL with hash-based routing
 */
export const ensureHashBasedRouting = (url?: string): string => {
  const currentUrl = url || window.location.href
  const urlObj = new URL(currentUrl)
  
  // If there are no main URL query parameters, return as-is
  if (!urlObj.search) {
    return currentUrl
  }
  
  // Extract the hash and any existing hash parameters
  const hash = urlObj.hash || '#/'
  const [hashPath, hashParams] = hash.split('?')
  
  // Extract main URL query parameters
  const mainParams = new URLSearchParams(urlObj.search)
  
  // Combine hash parameters with main URL parameters
  const combinedParams = new URLSearchParams(hashParams || '')
  for (const [key, value] of mainParams.entries()) {
    combinedParams.set(key, value)
  }
  
  // Build the clean URL
  const paramString = combinedParams.toString()
  const cleanHash = paramString ? `${hashPath}?${paramString}` : hashPath
  const cleanUrl = `${urlObj.origin}${urlObj.pathname}${cleanHash}`
  
  return cleanUrl
}

/**
 * Updates the browser URL to use hash-based routing
 * This should be called whenever the URL needs to be cleaned up
 */
export const cleanupUrl = (): void => {
  const cleanUrl = ensureHashBasedRouting()
  if (cleanUrl !== window.location.href) {
    window.history.replaceState(null, '', cleanUrl)
  }
}

/**
 * Checks if the current URL has main URL query parameters that should be moved to hash
 */
export const hasMainUrlQueryParams = (): boolean => {
  return window.location.search.length > 0
}

/**
 * Gets the current hash path without parameters
 */
export const getCurrentHashPath = (): string => {
  const hash = window.location.hash || '#/'
  const [path] = hash.split('?')
  return path
}

/**
 * Gets the current hash parameters
 */
export const getCurrentHashParams = (): URLSearchParams => {
  const hash = window.location.hash || '#/'
  const [, paramsString] = hash.split('?')
  return new URLSearchParams(paramsString || '')
}
