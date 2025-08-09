import { useEffect, useState } from 'react'

/**
 * useMediaQuery
 * Simple hook to observe a media query and return whether it currently matches.
 * Defaults to Tailwind's small breakpoint for mobile detection.
 */
export function useMediaQuery(query: string = '(max-width: 640px)'): boolean {
  const getMatches = (): boolean => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return false
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(getMatches)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia === 'undefined'
    ) {
      return
    }

    const mediaQueryList = window.matchMedia(query)

    const listener = () => setMatches(mediaQueryList.matches)

    // Set initial state and subscribe
    setMatches(mediaQueryList.matches)
    mediaQueryList.addEventListener('change', listener)

    return () => {
      mediaQueryList.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

