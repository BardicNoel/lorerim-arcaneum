/**
 * Get the correct base URL for the current environment
 * In development, use relative paths
 * In production (GitHub Pages), use the configured base path
 */
export function getBaseUrl(): string {
  // In development, use '/' for public assets
  if (import.meta.env.DEV) {
    return '/'
  }

  // In production, use the configured base URL from Vite config
  return import.meta.env.BASE_URL || '/lorerim-arcaneum/'
}

/**
 * Get the correct URL for data files
 * @param path The path to the data file (e.g., 'data/skills.json')
 * @returns The full URL for the data file
 */
export function getDataUrl(path: string): string {
  return `${getBaseUrl()}${path}`
}
