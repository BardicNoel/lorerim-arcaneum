/**
 * URL-safe Base64 encoding/decoding utilities for build state
 *
 * Supports both legacy and compact perk formats for backwards compatibility
 */

import type { BuildState } from '../types/build'
import { toCompressed, toLegacy } from './buildCompression'

export const encode = (obj: any): string => {
  // Convert to compressed format for encoding to reduce URL size
  const compressedObj = toCompressed(obj)
  return btoa(unescape(encodeURIComponent(JSON.stringify(compressedObj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export const decode = (str: string): BuildState | null => {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(decodeURIComponent(escape(atob(b64))))

    // Always return in legacy format for backwards compatibility
    return toLegacy(decoded)
  } catch {
    return null
  }
}

/**
 * Encodes a build state with format preference
 *
 * @param obj - Build state to encode
 * @param useCompressed - Whether to use compressed format (default: true)
 * @returns Encoded string
 */
export const encodeWithFormat = (
  obj: any,
  useCompressed: boolean = true
): string => {
  const formatObj = useCompressed ? toCompressed(obj) : obj
  return btoa(unescape(encodeURIComponent(JSON.stringify(formatObj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Decodes a build state with format preference
 *
 * @param str - Encoded string
 * @param preferLegacy - Whether to prefer legacy format (default: true)
 * @returns Decoded build state
 */
export const decodeWithFormat = (
  str: string,
  preferLegacy: boolean = true
): BuildState | null => {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(decodeURIComponent(escape(atob(b64))))

    if (preferLegacy) {
      return toLegacy(decoded)
    } else {
      return decoded
    }
  } catch {
    return null
  }
}
