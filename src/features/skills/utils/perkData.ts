import type { PerkTree } from '../types'

// Load a single perk tree by ID
export async function loadPerkTree(treeId: string): Promise<PerkTree | null> {
  try {
    const response = await fetch('/data/perk-trees.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch perk trees: ${response.statusText}`)
    }

    const data = await response.json()
    const validatedData = validatePerkTrees(data)

    const tree = validatedData.find(t => t.treeId === treeId)
    return tree || null
  } catch (error) {
    console.error('Error loading perk tree:', error)
    return null
  }
}

// Load all perk trees
export async function loadAllPerkTrees(): Promise<PerkTree[]> {
  try {
    const response = await fetch('/data/perk-trees.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch perk trees: ${response.statusText}`)
    }

    const data = await response.json()
    return validatePerkTrees(data)
  } catch (error) {
    console.error('Error loading perk trees:', error)
    return []
  }
}

// Get available perk tree IDs
export async function getAvailablePerkTreeIds(): Promise<string[]> {
  try {
    const trees = await loadAllPerkTrees()
    return trees.map(tree => tree.treeId)
  } catch (error) {
    console.error('Error getting perk tree IDs:', error)
    return []
  }
}

// Basic validation functions (simplified from zod schemas)
export function validatePerkTree(data: unknown): PerkTree {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid perk tree data')
  }

  const tree = data as any

  if (
    !tree.treeId ||
    !tree.treeName ||
    !tree.perks ||
    !Array.isArray(tree.perks)
  ) {
    throw new Error('Invalid perk tree structure')
  }

  return tree as PerkTree
}

export function validatePerkTrees(data: unknown): PerkTree[] {
  if (!Array.isArray(data)) {
    throw new Error('Perk trees data must be an array')
  }

  return data.map(validatePerkTree)
}

// Safe validation function that returns a result object
export function validatePerkTreeSafe(
  data: unknown
): { success: true; data: PerkTree } | { success: false; error: any } {
  try {
    const validated = validatePerkTree(data)
    return { success: true, data: validated }
  } catch (error) {
    return { success: false, error }
  }
}
