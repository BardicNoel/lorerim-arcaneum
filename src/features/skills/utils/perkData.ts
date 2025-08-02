import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import type { PerkTree } from '../types'

// Load a single perk tree by ID - now uses the store
export function loadPerkTree(treeId: string): PerkTree | null {
  const trees = usePerkTreesStore.getState().data
  return trees.find(t => t.treeId === treeId) || null
}

// Load all perk trees - now uses the store
export function loadAllPerkTrees(): PerkTree[] {
  return usePerkTreesStore.getState().data
}

// Get available perk tree IDs - now uses the store
export function getAvailablePerkTreeIds(): string[] {
  const trees = usePerkTreesStore.getState().data
  return trees.map(tree => tree.treeId)
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
