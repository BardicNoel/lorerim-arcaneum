import type { PerkReferenceNode, PerkReferenceFilters } from '../types'

// Apply filters to perk nodes
export function applyPerkFilters(
  nodes: PerkReferenceNode[], 
  filters: PerkReferenceFilters
): PerkReferenceNode[] {
  let filteredNodes = [...nodes]

  // Apply skill filters
  if (filters.skills.length > 0) {
    filteredNodes = filteredNodes.filter(node => 
      filters.skills.includes(node.skillTree)
    )
  }

  // Apply category filters
  if (filters.categories.length > 0) {
    filteredNodes = filteredNodes.filter(node => 
      filters.categories.includes(node.category)
    )
  }

  // Apply prerequisite filters
  if (filters.prerequisites.length > 0) {
    filteredNodes = filteredNodes.filter(node => 
      filters.prerequisites.some(prereq => 
        node.prerequisites.includes(prereq)
      )
    )
  }

  // Apply tag filters
  if (filters.tags.length > 0) {
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
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    filteredNodes = filteredNodes.filter(node => 
      node.searchableText.includes(query) ||
      node.name.toLowerCase().includes(query) ||
      node.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filteredNodes
}

// Get available filter options from perk nodes
export function getAvailableFilterOptions(nodes: PerkReferenceNode[]) {
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
    skills: Array.from(skills).sort(),
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
    prerequisites: Array.from(prerequisites).sort(),
  }
}

// Sort perks by various criteria
export function sortPerks(
  nodes: PerkReferenceNode[], 
  sortBy: string = 'name'
): PerkReferenceNode[] {
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
    case 'root':
      return sortedNodes.sort((a, b) => Number(b.isRoot) - Number(a.isRoot))
    default:
      return sortedNodes
  }
}

// Search perks by query
export function searchPerks(nodes: PerkReferenceNode[], query: string): PerkReferenceNode[] {
  if (!query.trim()) return nodes

  const lowerQuery = query.toLowerCase()
  return nodes.filter(node => 
    node.searchableText.includes(lowerQuery) ||
    node.name.toLowerCase().includes(lowerQuery) ||
    node.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    node.skillTreeName.toLowerCase().includes(lowerQuery) ||
    node.category.toLowerCase().includes(lowerQuery)
  )
}

// Get perks by skill
export function getPerksBySkill(nodes: PerkReferenceNode[], skillId: string): PerkReferenceNode[] {
  return nodes.filter(node => node.skillTree === skillId)
}

// Get perks by category
export function getPerksByCategory(nodes: PerkReferenceNode[], category: string): PerkReferenceNode[] {
  return nodes.filter(node => node.category === category)
}

// Get root perks
export function getRootPerks(nodes: PerkReferenceNode[]): PerkReferenceNode[] {
  return nodes.filter(node => node.isRoot)
}

// Get multi-rank perks
export function getMultiRankPerks(nodes: PerkReferenceNode[]): PerkReferenceNode[] {
  return nodes.filter(node => node.totalRanks > 1)
}

// Get single-rank perks
export function getSingleRankPerks(nodes: PerkReferenceNode[]): PerkReferenceNode[] {
  return nodes.filter(node => node.totalRanks === 1)
}

// Get perks with prerequisites
export function getPerksWithPrerequisites(nodes: PerkReferenceNode[]): PerkReferenceNode[] {
  return nodes.filter(node => node.prerequisites.length > 0)
}

// Get perks with children
export function getPerksWithChildren(nodes: PerkReferenceNode[]): PerkReferenceNode[] {
  return nodes.filter(node => node.hasChildren)
} 