import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useMemo } from 'react'
import type { 
  PerkReferenceNode, 
  PerkReferenceItem, 
  PerkReferenceFilters,
  PerkReferenceViewMode,
  PerkReferenceState 
} from '../types'

export class PerkReferenceModel {
  private perkNodes: PerkReferenceNode[]
  private buildState: any

  constructor(perkNodes: PerkReferenceNode[], buildState: any) {
    this.perkNodes = perkNodes
    this.buildState = buildState
  }

  // Transform PerkReferenceNode to PerkReferenceItem
  transformToPlayerCreationItem(node: PerkReferenceNode): PerkReferenceItem {
    const selectedPerks = this.buildState.perks?.selected?.[node.skillTree] || []
    const perkRanks = this.buildState.perks?.ranks?.[node.skillTree] || {}
    
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
      isAvailable: this.isPerkAvailable(node),
    }
  }

  // Check if a perk is available based on prerequisites
  private isPerkAvailable(node: PerkReferenceNode): boolean {
    if (node.isRoot) return true

    const selectedPerks = this.buildState.perks?.selected?.[node.skillTree] || []
    return node.prerequisites.every(prereq => selectedPerks.includes(prereq))
  }

  // Apply filters to perk nodes
  applyFilters(nodes: PerkReferenceNode[], filters: PerkReferenceFilters): PerkReferenceNode[] {
    let filteredNodes = [...nodes]

    // Handle undefined filters
    if (!filters) {
      return filteredNodes
    }

    // Apply skill filters
    if (filters.skills && filters.skills.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        filters.skills.includes(node.skillTree)
      )
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        filters.categories.includes(node.category)
      )
    }

    // Apply prerequisite filters
    if (filters.prerequisites && filters.prerequisites.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        filters.prerequisites.some(prereq => 
          node.prerequisites.includes(prereq)
        )
      )
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        filters.tags.some(tag => 
          node.tags.includes(tag)
        )
      )
    }

    // Apply rank level filter
    if (filters.rankLevel !== 'all') {
      filteredNodes = filteredNodes.filter(node => {
        if (filters.rankLevel === 'single') {
          return node.totalRanks === 1
        } else if (filters.rankLevel === 'multi') {
          return node.totalRanks > 1
        }
        return true
      })
    }

    // Apply root only filter
    if (filters.rootOnly) {
      filteredNodes = filteredNodes.filter(node => node.isRoot)
    }

    // Apply search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase()
      filteredNodes = filteredNodes.filter(node => 
        node.searchableText.includes(query) ||
        node.name.toLowerCase().includes(query) ||
        node.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filteredNodes
  }

  // Get available filter options
  getAvailableFilters(nodes: PerkReferenceNode[]) {
    const skills = new Set<string>()
    const categories = new Set<string>()
    const tags = new Set<string>()
    const prerequisites = new Set<string>()

    nodes.forEach(node => {
      skills.add(node.skillTree)
      categories.add(node.category)
      node.tags.forEach(tag => tags.add(tag))
      node.prerequisites.forEach(prereq => prerequisites.add(prereq))
    })

    return {
      skills: Array.from(skills),
      categories: Array.from(categories),
      tags: Array.from(tags),
      prerequisites: Array.from(prerequisites),
    }
  }

  // Sort perks by various criteria
  sortPerks(nodes: PerkReferenceNode[], sortBy: string = 'name'): PerkReferenceNode[] {
    const sortedNodes = [...nodes]

    switch (sortBy) {
      case 'name':
        return sortedNodes.sort((a, b) => a.name.localeCompare(b.name))
      case 'skill':
        return sortedNodes.sort((a, b) => a.skillTreeName.localeCompare(b.skillTreeName))
      case 'category':
        return sortedNodes.sort((a, b) => a.category.localeCompare(b.category))
      case 'rank':
        return sortedNodes.sort((a, b) => b.totalRanks - a.totalRanks)
      case 'prerequisites':
        return sortedNodes.sort((a, b) => a.prerequisites.length - b.prerequisites.length)
      default:
        return sortedNodes
    }
  }
}

// Hook to use the model
export function usePerkReferenceModel(
  perkNodes: PerkReferenceNode[],
  filters?: PerkReferenceFilters
) {
  const { build } = useCharacterBuild()

  const model = useMemo(() => {
    return new PerkReferenceModel(perkNodes, build)
  }, [perkNodes, build])

  const filteredNodes = useMemo(() => {
    return model.applyFilters(perkNodes, filters || {
      skills: [],
      categories: [],
      prerequisites: [],
      tags: [],
      rankLevel: 'all',
      rootOnly: false,
      searchQuery: '',
    })
  }, [model, perkNodes, filters])

  const perkItems = useMemo(() => {
    return filteredNodes.map(node => model.transformToPlayerCreationItem(node))
  }, [filteredNodes, model])

  const availableFilters = useMemo(() => {
    return model.getAvailableFilters(perkNodes)
  }, [model, perkNodes])

  return {
    model,
    filteredNodes,
    perkItems,
    availableFilters,
  }
} 