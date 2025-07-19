/**
 * URL-safe Base64 encoding/decoding utilities for build state
 */

export const encode = (obj: any): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

export const decode = (str: string): any => {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(b64))))
  } catch {
    return null
  }
}
