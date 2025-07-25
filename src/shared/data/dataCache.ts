// src/shared/data/dataCache.ts
// Singleton module-level cache for read-only JSON datasets

import type {
  Skill,
  Race,
  Trait,
  Religion,
  DestinyNode,
  PerkTree,
} from './schemas'
import type { Birthsign } from '@/features/birthsigns/types'

// Type-safe dataset map - preserve existing data structures
type DatasetMap = {
  skills: { skills: Skill[] }
  races: { races: Race[] }
  traits: { traits: Trait[] }
  religions: Religion[]
  birthsigns: { birthsigns: Birthsign[] } // Use proper Birthsign type
  destinyNodes: DestinyNode[]
  perkTrees: PerkTree[]
}

// Private cache storage
const cache: Record<string, any> = {}

// Loading state tracking
const loadingStates: Record<string, Promise<any>> = {}

/**
 * Loads a JSON dataset if not already cached
 * @param name Dataset name (e.g., 'races', 'skills')
 * @returns Promise resolving to the dataset
 */
export async function loadDataset<K extends keyof DatasetMap>(
  name: K
): Promise<DatasetMap[K]> {
  // Return cached value if available
  if (cache[name]) {
    return cache[name]
  }

  // Return existing loading promise if already loading
  if (loadingStates[name]) {
    return loadingStates[name]
  }

  // Create new loading promise
  const loadPromise = (async () => {
    try {
      const url = `${import.meta.env.BASE_URL}data/${name}.json`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load dataset: ${name} (${response.status})`)
      }
      
      const data = await response.json()
      
      // Transform data to match expected structure
      let transformedData: any
      
      switch (name) {
        case 'skills':
          transformedData = {
            skills: data.skills.map((skill: any) => ({
              ...skill,
              id: skill.id || skill.edid || skill.name.toLowerCase().replace(/\s+/g, '-'),
              tags: [...(skill.metaTags || []), skill.category].filter((tag): tag is string => Boolean(tag)),
            }))
          }
          break
          
        case 'races':
          transformedData = {
            races: data.races.map((race: any) => ({
              ...race,
              id: race.id || race.edid || race.name.toLowerCase().replace(/\s+/g, '-'),
              tags: [race.category, ...(race.keywords || [])].filter((tag): tag is string => Boolean(tag)),
            }))
          }
          break
          
        case 'traits':
          transformedData = {
            traits: data.traits.map((trait: any) => ({
              ...trait,
              id: trait.id || trait.name,
              tags: [trait.category, ...(trait.tags || []), ...(trait.effects?.map((e: any) => e.type) || [])].filter((tag): tag is string => Boolean(tag)),
            }))
          }
          break
          
        case 'religions':
          transformedData = data.flatMap((pantheon: any) =>
            pantheon.deities.map((deity: any) => ({
              id: deity.id || deity.name,
              name: deity.name,
              description: deity.description,
              pantheon: pantheon.type,
              tenets: deity.tenets || [],
              powers: deity.powers || [],
              restrictions: deity.restrictions || [],
              favoredRaces: deity.favoredRaces || [],
              tags: [pantheon.type, ...(deity.tags || [])].filter(Boolean),
            }))
          )
          break
          
        case 'birthsigns':
          // Transform to proper Birthsign type with id and tags
          transformedData = {
            birthsigns: data.map((birthsign: any) => ({
              ...birthsign,
              id: birthsign.edid || birthsign.name.toLowerCase().replace(/\s+/g, '-'),
              tags: [birthsign.group, ...(birthsign.powers?.map((p: any) => p.name) || []), ...(birthsign.stat_modifications?.map((s: any) => s.stat) || [])].filter((tag): tag is string => Boolean(tag)),
            })) as Birthsign[]
          }
          break
          
        case 'destinyNodes':
          transformedData = data.map((node: any, index: number) => ({
            ...node,
            id: node.globalFormId || node.edid || `destiny-${index}`,
            nextBranches: node.nextBranches || [],
            levelRequirement: node.levelRequirement,
            lore: node.lore,
            tags: node.tags || [],
          }))
          break
          
        case 'perkTrees':
          transformedData = data
          break
          
        default:
          transformedData = data
      }
      
      // Cache the transformed data
      cache[name] = transformedData
      return transformedData
      
    } catch (error) {
      console.error(`Error loading dataset ${name}:`, error)
      throw new Error(`Failed to load ${name} dataset: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Clean up loading state
      delete loadingStates[name]
    }
  })()

  // Store the loading promise
  loadingStates[name] = loadPromise
  return loadPromise
}

/**
 * Retrieves a cached dataset synchronously
 * @param name Dataset name
 * @returns The cached dataset
 * @throws Error if dataset is not loaded
 */
export function getDataset<K extends keyof DatasetMap>(name: K): DatasetMap[K] {
  if (!cache[name]) {
    throw new Error(
      `Dataset "${name}" not loaded. Call loadDataset("${name}") first.`
    )
  }
  return cache[name]
}

/**
 * Preloads multiple datasets in parallel
 * @param names Array of dataset names to preload
 */
export async function preloadDatasets<K extends keyof DatasetMap>(
  names: K[]
): Promise<void> {
  await Promise.all(names.map(loadDataset))
}

/**
 * Clears the cache for a specific dataset or all datasets
 * @param name Optional dataset name to clear (clears all if not provided)
 */
export function clearCache(name?: keyof DatasetMap): void {
  if (name) {
    delete cache[name]
    delete loadingStates[name]
  } else {
    Object.keys(cache).forEach(key => {
      delete cache[key]
      delete loadingStates[key]
    })
  }
}

/**
 * Checks if a dataset is currently cached
 * @param name Dataset name
 * @returns True if dataset is cached
 */
export function isCached<K extends keyof DatasetMap>(name: K): boolean {
  return name in cache
}

/**
 * Checks if a dataset is currently loading
 * @param name Dataset name
 * @returns True if dataset is loading
 */
export function isLoading<K extends keyof DatasetMap>(name: K): boolean {
  return name in loadingStates
}

// Convenience functions for common datasets
export const loadSkills = () => loadDataset('skills')
export const loadRaces = () => loadDataset('races')
export const loadTraits = () => loadDataset('traits')
export const loadReligions = () => loadDataset('religions')
export const loadBirthsigns = () => loadDataset('birthsigns')
export const loadDestinyNodes = () => loadDataset('destinyNodes')
export const loadPerkTrees = () => loadDataset('perkTrees')

export const getSkills = () => getDataset('skills')
export const getRaces = () => getDataset('races')
export const getTraits = () => getDataset('traits')
export const getReligions = () => getDataset('religions')
export const getBirthsigns = () => getDataset('birthsigns')
export const getDestinyNodes = () => getDataset('destinyNodes')
export const getPerkTrees = () => getDataset('perkTrees') 