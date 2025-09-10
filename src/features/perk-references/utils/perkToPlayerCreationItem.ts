import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import type { PerkReferenceNode } from '../types'

export function perkToPlayerCreationItem(perk: PerkReferenceNode, build: any) {
  const selectedPerks = build.perks?.selected?.[perk.skillTree] || []
  const perkRanks = build.perks?.ranks?.[perk.skillTree] || {}
  
  const isSelected = selectedPerks.includes(perk.edid)
  const currentRank = perkRanks[perk.edid] || 0

  return {
    id: perk.edid,
    name: perk.name,
    description: perk.ranks[0]?.description?.base || '',
    summary: perk.ranks[0]?.description?.subtext || '',
    category: perk.category,
    tags: perk.tags,
    isSelected,
    originalPerk: perk,
    skillTree: perk.skillTree,
    skillTreeName: perk.skillTreeName,
    isRoot: perk.isRoot,
    hasChildren: perk.hasChildren,
    prerequisites: perk.prerequisites,
    connections: perk.connections,
    totalRanks: perk.totalRanks,
    currentRank,
    isAvailable: perk.isRoot || perk.prerequisites.every(prereq => selectedPerks.includes(prereq)),
    minLevel: perk.minLevel,
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