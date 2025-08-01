import React from 'react'
import type { SearchResult } from '../../model/SearchModel'
import type { PerkReferenceNode } from '@/features/perk-references/types'
import { PerkReferenceCard } from '@/features/perk-references/components/composition/PerkReferenceCard'

// Wrapper component to convert SearchResult to PerkReferenceItem format
export const PerkReferenceSearchWrapper: React.FC<{
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
  compact?: boolean
}> = ({ result, isSelected, onClick, compact }) => {
  const perkData = result.item.originalData as PerkReferenceNode
  
  // Convert to PerkReferenceItem format
  const perkItem = {
    id: result.item.id,
    name: result.item.name,
    description: result.item.description || '',
    skillTree: perkData.skillTree,
    skillTreeName: perkData.skillTreeName,
    category: result.item.category || 'Unknown',
    tags: result.item.tags,
    totalRanks: perkData.totalRanks,
    currentRank: 1, // Default to first rank for search display
    isSelected: isSelected || false,
    isAvailable: true, // Assume available for search display
    isRoot: perkData.isRoot,
    hasChildren: perkData.hasChildren,
    prerequisites: perkData.prerequisites,
    connections: perkData.connections,
    minLevel: perkData.minLevel,
    originalPerk: perkData,
  }

  return (
    <PerkReferenceCard
      item={perkItem}
      isSelected={isSelected}
      onClick={onClick}
      compact={compact}
    />
  )
} 