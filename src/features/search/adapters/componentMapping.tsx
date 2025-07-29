import React from 'react'
import type { SearchResult } from '../model/SearchModel'
import type { ViewMode } from '../model/TypeSpecificComponents'
import type { PerkReferenceNode } from '@/features/perk-references/types'

// Import type-specific components
import { RaceAccordion } from '@/features/races-v2/components/composition/RaceAccordion'
import { RaceCard } from '@/features/races-v2/components/composition/RaceCard'
import { RaceDetailView } from '@/features/races-v2/views/RaceDetailView'

import { BirthsignAccordion } from '@/features/birthsigns/components/BirthsignAccordion'
import { BirthsignCard } from '@/features/birthsigns/components/BirthsignCard'
import { BirthsignDetailPanel } from '@/features/birthsigns/components/BirthsignDetailPanel'

import { SkillAccordion } from '@/features/skills/components/composition/SkillAccordion'
import { SkillCard } from '@/features/skills/components/composition/SkillCard'
import { SkillGrid } from '@/features/skills/components/composition/SkillGrid'

import { TraitAccordion } from '@/features/traits/components/TraitAccordion'
import { TraitCard } from '@/features/traits/components/TraitCard'

import { DestinyAccordionList } from '@/features/destiny/components/composition/DestinyAccordionList'
import { DestinyCard } from '@/features/destiny/components/composition/DestinyCard'
import { DestinyDetailPanel } from '@/features/destiny/components/composition/DestinyDetailPanel'

import { PerkTreeGrid } from '@/features/skills/components/composition/PerkTreeGrid'

import { PerkReferenceCard } from '@/features/perk-references/components/composition/PerkReferenceCard'
import { PerkReferenceAccordion } from '@/features/perk-references/components/composition/PerkReferenceAccordion'

import { SpellSearchCard } from '@/features/search/components/type-specific/SpellSearchCard'

// Wrapper component to convert SearchResult to PerkReferenceItem format
const PerkReferenceSearchWrapper: React.FC<{
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

// Fallback components for unknown types
const FallbackCard: React.FC<{
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
}> = ({ result, isSelected, onClick }) => (
  <div
    className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
    onClick={onClick}
  >
    <h3 className="font-semibold">{result.item.name}</h3>
    <p className="text-sm text-muted-foreground">{result.item.description}</p>
  </div>
)

const FallbackDetail: React.FC<{ result: SearchResult }> = ({ result }) => (
  <div className="p-4 border rounded-lg bg-muted">
    <h2 className="text-lg font-semibold mb-4">{result.item.name}</h2>
    <p className="text-sm text-muted-foreground mb-4">
      {result.item.description}
    </p>
    <div className="text-xs text-muted-foreground">
      Type: {result.item.type} | ID: {result.item.id}
    </div>
  </div>
)

// Component mapping by type and view mode
const COMPONENT_MAP: Record<
  string,
  Record<ViewMode, React.ComponentType<any>>
> = {
  race: {
    card: RaceCard,
    accordion: RaceAccordion,
    grid: RaceCard,
    detail: RaceDetailView,
    compact: RaceCard,
  },
  birthsign: {
    card: BirthsignCard,
    accordion: BirthsignAccordion,
    grid: BirthsignCard,
    detail: BirthsignDetailPanel,
    compact: BirthsignCard,
  },
  skill: {
    card: SkillCard,
    accordion: SkillAccordion,
    grid: SkillGrid,
    detail: FallbackDetail,
    compact: SkillCard,
  },
  trait: {
    card: TraitCard,
    accordion: TraitAccordion,
    grid: TraitCard,
    detail: FallbackDetail,
    compact: TraitCard,
  },
  religion: {
    card: FallbackCard,
    accordion: FallbackCard,
    grid: FallbackCard,
    detail: FallbackDetail,
    compact: FallbackCard,
  },
  destiny: {
    card: DestinyCard,
    accordion: DestinyAccordionList,
    grid: DestinyCard,
    detail: DestinyDetailPanel,
    compact: DestinyCard,
  },
  perk: {
    card: FallbackCard,
    accordion: FallbackCard,
    grid: PerkTreeGrid,
    detail: FallbackDetail,
    compact: FallbackCard,
  },
  'perk-reference': {
    card: PerkReferenceSearchWrapper,
    accordion: PerkReferenceAccordion,
    grid: PerkReferenceSearchWrapper,
    detail: FallbackDetail,
    compact: PerkReferenceSearchWrapper,
  },
  spell: {
    card: SpellSearchCard,
    accordion: SpellSearchCard,
    grid: SpellSearchCard,
    detail: FallbackDetail,
    compact: SpellSearchCard,
  },
}

// Get component for a specific type and view mode
export function getComponentForType(
  type: string,
  viewMode: ViewMode
): React.ComponentType<any> {
  const typeComponents = COMPONENT_MAP[type]
  if (!typeComponents) {
    return FallbackCard
  }

  return typeComponents[viewMode] || typeComponents.card || FallbackCard
}
