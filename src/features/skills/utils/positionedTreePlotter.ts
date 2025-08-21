import { getDataUrl } from '@/shared/utils/baseUrl'
import type { PerkNode as PerkNodeType, PerkTree } from '../types'
import type { SavedNodePosition, SavedTreePositions } from './positionUtils'

export interface PositionedTreeNode {
  perk: PerkNodeType
  depth: number
  children: string[]
  parents: string[]
  savedPosition?: SavedNodePosition
  calculatedPosition?: { x: number; y: number }
}

export interface PositionedTreeConfig {
  nodeWidth: number
  nodeHeight: number
  horizontalSpacing: number
  verticalSpacing: number
  padding: number
  gridScaleX: number
  gridScaleY: number
  fallbackSpacing: number
}

export const DEFAULT_POSITIONED_TREE_CONFIG: PositionedTreeConfig = {
  nodeWidth: 140,
  nodeHeight: 80,
  horizontalSpacing: 40,
  verticalSpacing: 200,
  padding: 50,
  gridScaleX: 180,
  gridScaleY: 120,
  fallbackSpacing: 100,
}

/**
 * Load saved positions for a specific tree from the public data directory
 */
export async function loadSavedTreePositions(
  treeId: string
): Promise<SavedTreePositions | null> {
  try {
    const url = getDataUrl(`data/perk-positions/${treeId}-positions.json`)

    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data as SavedTreePositions
  } catch (error) {
    return null
  }
}

/**
 * Build the tree structure with saved positions if available
 */
function buildPositionedTreeStructure(
  perks: PerkNodeType[],
  savedPositions?: SavedTreePositions
): Map<string, PositionedTreeNode> {
  const treeNodes = new Map<string, PositionedTreeNode>()

  // Create tree nodes
  perks.forEach(perk => {
    const savedPosition = savedPositions?.positions.find(
      p => p.perkId === perk.edid
    )

    treeNodes.set(perk.edid, {
      perk,
      depth: -1,
      children: perk.connections.children,
      parents: perk.connections.parents,
      savedPosition,
    })
  })

  // Calculate depths using BFS from roots
  const roots = perks.filter(perk => perk.connections.parents.length === 0)
  const queue: { id: string; depth: number }[] = roots.map(perk => ({
    id: perk.edid,
    depth: 0,
  }))
  const visited = new Set<string>()

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)

    const node = treeNodes.get(id)
    if (node) {
      if (node.depth === -1 || depth < node.depth) {
        node.depth = depth
      }

      node.children.forEach(childId => {
        if (treeNodes.has(childId) && !visited.has(childId)) {
          queue.push({ id: childId, depth: depth + 1 })
        }
      })
    }
  }

  return treeNodes
}

/**
 * Calculate fallback positions using a simple hierarchical layout
 */
function calculateFallbackPositions(
  treeNodes: Map<string, PositionedTreeNode>,
  config: PositionedTreeConfig
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()

  // Group nodes by depth
  const depthGroups = new Map<number, PositionedTreeNode[]>()
  treeNodes.forEach(node => {
    const depth = node.depth
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, [])
    }
    depthGroups.get(depth)!.push(node)
  })

  // Calculate positions for each depth level
  const maxDepth = Math.max(...depthGroups.keys())

  depthGroups.forEach((nodes, depth) => {
    const y = config.padding + (maxDepth - depth) * config.verticalSpacing

    // Center nodes horizontally within their depth level
    const totalWidth = (nodes.length - 1) * config.horizontalSpacing
    const startX = config.padding + (config.gridScaleX - totalWidth) / 2

    nodes.forEach((node, index) => {
      const x = startX + index * config.horizontalSpacing
      positions.set(node.perk.edid, { x, y })
    })
  })

  return positions
}

/**
 * Apply saved positions to tree nodes
 */
function applySavedPositions(
  treeNodes: Map<string, PositionedTreeNode>,
  savedPositions: SavedTreePositions,
  config: PositionedTreeConfig
): void {
  savedPositions.positions.forEach(savedPos => {
    const node = treeNodes.get(savedPos.perkId)
    if (node) {
      node.savedPosition = savedPos
      node.calculatedPosition = { x: savedPos.x, y: savedPos.y }
    }
  })
}

/**
 * Main plotting function that combines saved positions with fallback calculations
 */
export function plotPositionedTree(
  tree: PerkTree,
  savedPositions?: SavedTreePositions,
  config: Partial<PositionedTreeConfig> = {}
): Map<string, { x: number; y: number }> {
  const fullConfig = { ...DEFAULT_POSITIONED_TREE_CONFIG, ...config }

  // Build tree structure
  const treeNodes = buildPositionedTreeStructure(tree.perks, savedPositions)

  // Apply saved positions if available
  if (savedPositions) {
    applySavedPositions(treeNodes, savedPositions, fullConfig)
  }

  // Calculate fallback positions for nodes without saved positions
  const fallbackPositions = calculateFallbackPositions(treeNodes, fullConfig)

  // Combine saved and fallback positions
  const finalPositions = new Map<string, { x: number; y: number }>()

  treeNodes.forEach((node, perkId) => {
    if (node.calculatedPosition) {
      // Use saved position
      finalPositions.set(perkId, node.calculatedPosition)
    } else {
      // Use fallback position
      const fallbackPos = fallbackPositions.get(perkId)
      if (fallbackPos) {
        finalPositions.set(perkId, fallbackPos)
      } else {
        // Last resort: place at origin
        finalPositions.set(perkId, {
          x: fullConfig.padding,
          y: fullConfig.padding,
        })
      }
    }
  })

  return finalPositions
}

/**
 * Validate that saved positions match the current tree structure
 */
export function validateSavedPositions(
  tree: PerkTree,
  savedPositions: SavedTreePositions
): {
  isValid: boolean
  missingPerks: string[]
  extraPerks: string[]
  stats: {
    totalPerks: number
    savedPerks: number
    coverage: number
  }
} {
  const treePerkIds = new Set(tree.perks.map(p => p.edid))
  const savedPerkIds = new Set(savedPositions.positions.map(p => p.perkId))

  const missingPerks = Array.from(treePerkIds).filter(
    id => !savedPerkIds.has(id)
  )
  const extraPerks = Array.from(savedPerkIds).filter(id => !treePerkIds.has(id))

  const isValid = missingPerks.length === 0 && extraPerks.length === 0
  const totalPerks = treePerkIds.size
  const savedPerks = savedPositions.positions.length
  const coverage = totalPerks > 0 ? (savedPerks / totalPerks) * 100 : 0

  return {
    isValid,
    missingPerks,
    extraPerks,
    stats: {
      totalPerks,
      savedPerks,
      coverage,
    },
  }
}

/**
 * Get positioning statistics for a tree
 */
export function getPositioningStats(
  tree: PerkTree,
  savedPositions?: SavedTreePositions
): {
  hasSavedPositions: boolean
  coverage: number
  totalPerks: number
  savedPerks: number
  validation?: ReturnType<typeof validateSavedPositions>
} {
  const totalPerks = tree.perks.length

  if (!savedPositions) {
    return {
      hasSavedPositions: false,
      coverage: 0,
      totalPerks,
      savedPerks: 0,
    }
  }

  const validation = validateSavedPositions(tree, savedPositions)

  return {
    hasSavedPositions: true,
    coverage: validation.stats.coverage,
    totalPerks,
    savedPerks: validation.stats.savedPerks,
    validation,
  }
}
