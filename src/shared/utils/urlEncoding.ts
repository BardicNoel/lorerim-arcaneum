/**
 * URL-safe Base64 encoding/decoding utilities for build state
 * 
 * Supports both legacy and compact perk formats for backwards compatibility
 */

import { migrateToCompactFormat, migrateToLegacyFormat, isCompactFormat } from './compactPerkEncoding'
import type { BuildState } from '../types/build'

export const encode = (obj: any): string => {
  // Convert to compact format for encoding to reduce URL size
  const compactObj = migrateToCompactFormat(obj)
  return btoa(unescape(encodeURIComponent(JSON.stringify(compactObj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export const decode = (str: string): BuildState | null => {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(decodeURIComponent(escape(atob(b64))))
    
    // Always return in legacy format for backwards compatibility
    return migrateToLegacyFormat(decoded)
  } catch {
    return null
  }
}

/**
 * Encodes a build state with format preference
 * 
 * @param obj - Build state to encode
 * @param useCompact - Whether to use compact format (default: true)
 * @returns Encoded string
 */
export const encodeWithFormat = (obj: any, useCompact: boolean = true): string => {
  const formatObj = useCompact ? migrateToCompactFormat(obj) : obj
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
export const decodeWithFormat = (str: string, preferLegacy: boolean = true): BuildState | null => {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(decodeURIComponent(escape(atob(b64))))
    
    if (preferLegacy) {
      return migrateToLegacyFormat(decoded)
    } else {
      return decoded
    }
  } catch {
    return null
  }
}
