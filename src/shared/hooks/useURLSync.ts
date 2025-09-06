import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { toLegacy } from '../utils/buildCompression'
import { cleanupUrl, hasMainUrlQueryParams } from '../utils/urlCleanup'
import { decode, encode } from '../utils/urlEncoding'
import { validateBuild } from '../utils/validateBuild'

export const useURLSync = () => {
  const build = useCharacterStore(state => state.build)
  const setBuild = useCharacterStore(state => state.setBuild)
  const hasHydrated = useRef(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastBuildHashRef = useRef<string>('')

  // Memoize the legacy build to avoid repeated conversions
  const legacyBuild = useMemo(() => toLegacy(build), [build])

  // Create a lightweight hash of the build for change detection
  const buildHash = useMemo(() => {
    // Use the legacy build for consistent property access
    const keyFields = {
      v: legacyBuild.v,
      n: legacyBuild.name,
      o: legacyBuild.notes,
      r: legacyBuild.race,
      s: legacyBuild.stone,
      g: legacyBuild.religion,
      f: legacyBuild.favoriteBlessing,
      t: legacyBuild.traits,
      k: legacyBuild.skills,
      sl: legacyBuild.skillLevels,
      e: legacyBuild.equipment,
      d: legacyBuild.destinyPath,
      a: legacyBuild.attributeAssignments,
      p: legacyBuild.perks,
    }
    return JSON.stringify(keyFields)
  }, [legacyBuild])

  // Optimized default build check - memoized to avoid repeated calculations
  const isDefaultBuild = useMemo(() => {
    return (
      legacyBuild.name === '' &&
      legacyBuild.notes === '' &&
      legacyBuild.race === null &&
      legacyBuild.stone === null &&
      legacyBuild.religion === null &&
      legacyBuild.favoriteBlessing === null &&
      legacyBuild.traits.regular.length === 0 &&
      legacyBuild.traits.bonus.length === 0 &&
      legacyBuild.skills.major.length === 0 &&
      legacyBuild.skills.minor.length === 0 &&
      Object.keys(legacyBuild.skillLevels).length === 0 &&
      legacyBuild.equipment.length === 0 &&
      legacyBuild.destinyPath.length === 0 &&
      legacyBuild.attributeAssignments.health === 0 &&
      legacyBuild.attributeAssignments.stamina === 0 &&
      legacyBuild.attributeAssignments.magicka === 0 &&
      legacyBuild.attributeAssignments.level === 1 &&
      Object.keys(legacyBuild.perks.selected).length === 0
    )
  }, [legacyBuild])

  // Debounced URL update function
  const debouncedUpdateURL = useCallback(
    (buildData: typeof build) => {
      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      // Set a new timeout for the URL update
      updateTimeoutRef.current = setTimeout(() => {
        // Use requestIdleCallback for non-blocking URL updates
        const updateURL = () => {
          try {
            const encodedBuild = encode(buildData)
            const currentHash = window.location.hash

            // Handle hash parsing more robustly
            const hashParts = currentHash.split('?')
            const path = hashParts[0]
            const existingParams = hashParts[1] || ''
            const params = new URLSearchParams(existingParams)

            if (isDefaultBuild) {
              // For default builds, remove the build parameter entirely
              params.delete('b')
            } else {
              // Update or add the build parameter
              params.set('b', encodedBuild)
            }

            // Build the new hash
            const paramString = params.toString()
            const newHash = paramString ? `${path}?${paramString}` : path

            // Ensure we're using hash-based routing (clean up any main URL query params)
            const cleanUrl =
              window.location.origin + window.location.pathname + newHash
            window.history.replaceState(null, '', cleanUrl)

            // Double-check that we don't have any main URL query params
            if (hasMainUrlQueryParams()) {
              cleanupUrl()
            }
          } catch (error) {
            console.error('❌ [URL Sync] Error updating URL:', error)
          }
        }

        // Use requestIdleCallback if available, otherwise fall back to setTimeout
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(updateURL, { timeout: 100 })
        } else {
          setTimeout(updateURL, 0)
        }
      }, 1000) // Increased debounce delay to 1000ms for better performance
    },
    [isDefaultBuild]
  )

  // Hydrate on load (only once)
  useEffect(() => {
    if (hasHydrated.current) {
      return
    }

    // Use requestIdleCallback for non-blocking hydration
    const hydrate = () => {
      const hash = window.location.hash
      const search = window.location.search

      // Check both hash and main URL for build parameters
      let encodedBuild = null

      // First, check hash parameters
      if (hash) {
        const hashParts = hash.split('?')
        const paramsString = hashParts[1] || ''
        const params = new URLSearchParams(paramsString)
        encodedBuild = params.get('b')
      }

      // If not found in hash, check main URL query parameters
      if (!encodedBuild && search) {
        const params = new URLSearchParams(search)
        encodedBuild = params.get('b')
      }

      if (encodedBuild) {
        try {
          const decoded = decode(encodedBuild)

          if (decoded?.v === 1 || decoded?.v === 2) {
            // Use the validateBuild utility to ensure all properties are properly structured
            const validatedBuild = validateBuild(decoded)
            setBuild(validatedBuild)

            // If we loaded from main URL query params, clean them up and move to hash
            if (hasMainUrlQueryParams()) {
              cleanupUrl()
            }
          }
        } catch (error) {
          console.error('❌ [URL Sync] Error decoding build from URL:', error)
        }
      }

      hasHydrated.current = true
    }

    // Use requestIdleCallback if available, otherwise fall back to setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(hydrate, { timeout: 200 })
    } else {
      setTimeout(hydrate, 0)
    }
  }, [setBuild])

  // Update URL on state change (but not during initial hydration)
  useEffect(() => {
    if (!hasHydrated.current || !build) return

    // Only update if the build hash has actually changed
    if (buildHash !== lastBuildHashRef.current) {
      lastBuildHashRef.current = buildHash
      debouncedUpdateURL(build)
    }
  }, [buildHash, build, debouncedUpdateURL])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])
}
