import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { PerkReferenceNode, PerkReferenceItem } from '../types'

// Transform a PerkReferenceNode to PlayerCreationItem format
export function perkToPlayerCreationItem(
  node: PerkReferenceNode,
  buildState: any
): PerkReferenceItem {
  const selectedPerks = buildState.perks?.selected?.[node.skillTree] || []
  const perkRanks = buildState.perks?.ranks?.[node.skillTree] || {}
  
  const isSelected = selectedPerks.includes(node.edid)
  const currentRank = perkRanks[node.edid] || 0

  return {
    id: node.edid,
    name: node.name,
    description: node.ranks[0]?.description?.base || '',
    category: node.category,
    tags: node.tags,
    isSelected,
    originalPerk: node,
    skillTree: node.skillTree,
    skillTreeName: node.skillTreeName,
    isRoot: node.isRoot,
    hasChildren: node.hasChildren,
    prerequisites: node.prerequisites,
    connections: node.connections,
    totalRanks: node.totalRanks,
    currentRank,
    isAvailable: isPerkAvailable(node, buildState),
  }
}

// Check if a perk is available based on prerequisites
export function isPerkAvailable(node: PerkReferenceNode, buildState: any): boolean {
  if (node.isRoot) return true

  const selectedPerks = buildState.perks?.selected?.[node.skillTree] || []
  return node.prerequisites.every(prereq => selectedPerks.includes(prereq))
}

// Get perk display name with rank information
export function getPerkDisplayName(node: PerkReferenceNode, currentRank?: number): string {
  if (node.totalRanks === 1) {
    return node.name
  }
  
  if (currentRank && currentRank > 0) {
    return `${node.name} (Rank ${currentRank}/${node.totalRanks})`
  }
  
  return `${node.name} (${node.totalRanks} Ranks)`
}

// Get perk description for display
export function getPerkDescription(node: PerkReferenceNode, rank?: number): string {
  if (!node.ranks || node.ranks.length === 0) {
    return ''
  }

  const targetRank = rank || 1
  const rankData = node.ranks.find(r => r.rank === targetRank) || node.ranks[0]
  
  return rankData.description?.base || ''
}

// Get perk subtext for display
export function getPerkSubtext(node: PerkReferenceNode, rank?: number): string {
  if (!node.ranks || node.ranks.length === 0) {
    return ''
  }

  const targetRank = rank || 1
  const rankData = node.ranks.find(r => r.rank === targetRank) || node.ranks[0]
  
  return rankData.description?.subtext || ''
}

// Get prerequisites display text
export function getPrerequisitesText(node: PerkReferenceNode): string {
  if (node.isRoot) {
    return 'No prerequisites'
  }

  if (node.prerequisites.length === 0) {
    return 'No prerequisites'
  }

  return `Requires: ${node.prerequisites.join(', ')}`
}

// Get connections display text
export function getConnectionsText(node: PerkReferenceNode): string {
  const parentCount = node.connections.parents.length
  const childCount = node.connections.children.length

  if (parentCount === 0 && childCount === 0) {
    return 'No connections'
  }

  const parts = []
  if (parentCount > 0) {
    parts.push(`${parentCount} parent${parentCount > 1 ? 's' : ''}`)
  }
  if (childCount > 0) {
    parts.push(`${childCount} child${childCount > 1 ? 'ren' : ''}`)
  }

  return parts.join(', ')
} 