import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { PerkNode, PerkTree } from '../skills/types'

// Extended PerkNode type for reference display
export interface PerkReferenceNode extends PerkNode {
  skillTree: string
  skillTreeName: string
  isRoot: boolean
  hasChildren: boolean
  prerequisites: string[]
  connections: {
    parents: string[]
    children: string[]
  }
  // Additional reference-specific properties
  searchableText: string
  tags: string[]
  category: string
}

// Perk Reference Item that extends PlayerCreationItem for consistency
export interface PerkReferenceItem extends PlayerCreationItem {
  originalPerk: PerkReferenceNode
  skillTree: string
  skillTreeName: string
  isRoot: boolean
  hasChildren: boolean
  prerequisites: string[]
  connections: {
    parents: string[]
    children: string[]
  }
  // Perk-specific properties
  totalRanks: number
  currentRank: number
  isSelected: boolean
  isAvailable: boolean
}

// Filter types for perk references
export interface PerkReferenceFilter {
  id: string
  type: 'skill' | 'category' | 'prerequisite' | 'tag' | 'rankLevel' | 'rootOnly'
  value: string
  label: string
}

// Main filters interface
export interface PerkReferenceFilters {
  skills: string[]
  categories: string[]
  prerequisites: string[]
  tags: string[]
  rankLevel: 'single' | 'multi' | 'all'
  rootOnly: boolean
  searchQuery: string
}

// Search categories for autocomplete
export interface PerkReferenceSearchCategory {
  id: string
  label: string
  options: PerkReferenceSearchOption[]
}

export interface PerkReferenceSearchOption {
  id: string
  label: string
  value: string
  category: string
  type: 'skill' | 'perk' | 'tag' | 'category'
}

// View modes for perk references
export type PerkReferenceViewMode = 'grid' | 'list' | 'accordion'

// Perk reference state
export interface PerkReferenceState {
  filters: PerkReferenceFilters
  viewMode: PerkReferenceViewMode
  selectedPerkId: string | null
  isLoading: boolean
  error: string | null
}

// Perk reference data provider interface
export interface PerkReferenceDataProvider {
  getAllPerks(): PerkReferenceNode[]
  getPerksBySkill(skillId: string): PerkReferenceNode[]
  getPerksByCategory(category: string): PerkReferenceNode[]
  getPerksByPrerequisite(prerequisiteId: string): PerkReferenceNode[]
  getRootPerks(): PerkReferenceNode[]
  getMultiRankPerks(): PerkReferenceNode[]
  searchPerks(query: string): PerkReferenceNode[]
} 