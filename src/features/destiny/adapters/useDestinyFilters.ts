import { useState, useMemo, useCallback } from 'react'
import { useDestinyNodes } from './useDestinyNodes'
import { useDestinyPath } from './useDestinyPath'
import type { DestinyNode } from '../types'
import type { SearchCategory, SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'

export type FilterType = 'build-path' | 'reference'

export interface DestinyFilter {
  id: string
  type: 'includes-node' | 'ends-with-node' | 'tags' | 'prerequisites'
  nodeName: string
  nodeId: string
  label: string
}

interface UseDestinyFiltersOptions {
  filterType: FilterType
  currentPath?: DestinyNode[]
}

interface UseDestinyFiltersReturn {
  // Filter state
  selectedFilters: DestinyFilter[]
  searchCategories: SearchCategory[]
  
  // Actions
  addFilter: (filter: DestinyFilter) => void
  removeFilter: (filterId: string) => void
  clearFilters: () => void
  
  // Filtered data
  filteredPaths: DestinyNode[][]
  availableNodes: DestinyNode[]
  
  // Helper functions
  getFilterOptions: () => SearchOption[]
  isNodeAvailable: (node: DestinyNode) => boolean
}

export function useDestinyFilters(options: UseDestinyFiltersOptions): UseDestinyFiltersReturn {
  const { filterType, currentPath = [] } = options
  const { nodes, rootNodes } = useDestinyNodes()
  const [selectedFilters, setSelectedFilters] = useState<DestinyFilter[]>([])

  // Get available nodes for build path filters (nodes that can be reached from current path)
  const availableNodes = useMemo(() => {
    if (filterType !== 'build-path') {
      return nodes
    }

    if (currentPath.length === 0) {
      return rootNodes
    }

    // Return nodes that can be reached from the current path
    const reachableNodes = new Set<string>()
    const visited = new Set<string>()

    const findReachableNodes = (nodeName: string) => {
      if (visited.has(nodeName)) return
      visited.add(nodeName)
      reachableNodes.add(nodeName)

      // Find all nodes that have this node as a prerequisite
      nodes.forEach(node => {
        if (node.prerequisites.includes(nodeName)) {
          findReachableNodes(node.name)
        }
      })
    }

    // Start from the last node in current path
    const lastNode = currentPath[currentPath.length - 1]
    findReachableNodes(lastNode.name)

    return nodes.filter(node => reachableNodes.has(node.name))
  }, [filterType, currentPath, nodes, rootNodes])

  // Generate search categories based on filter type
  const searchCategories = useMemo((): SearchCategory[] => {
    if (filterType === 'build-path') {
      return [
        {
          id: 'includes-node',
          name: 'Includes Node',
          placeholder: 'Filter paths that include this node...',
          options: availableNodes.map(node => ({
            id: `includes-${node.id}`,
            label: node.name,
            value: node.name,
            category: 'Includes Node',
            description: `Paths that include ${node.name}`,
          })),
        },
        {
          id: 'ends-with-node',
          name: 'Ends With Node',
          placeholder: 'Filter paths that end with this node...',
          options: availableNodes.map(node => ({
            id: `ends-${node.id}`,
            label: node.name,
            value: node.name,
            category: 'Ends With Node',
            description: `Paths that end with ${node.name}`,
          })),
        },
      ]
    } else {
      // Reference page filters
      const tags = [...new Set(nodes.flatMap(node => node.tags))]
      const prerequisites = [...new Set(nodes.flatMap(node => node.prerequisites))]

      return [
        {
          id: 'tags',
          name: 'Tags',
          placeholder: 'Filter by tag...',
          options: tags.map(tag => ({
            id: `tag-${tag}`,
            label: tag,
            value: tag,
            category: 'Tags',
            description: `Nodes with ${tag} tag`,
          })),
        },
        {
          id: 'prerequisites',
          name: 'Prerequisites',
          placeholder: 'Filter by prerequisite...',
          options: prerequisites.map(prereq => ({
            id: `prereq-${prereq}`,
            label: prereq,
            value: prereq,
            category: 'Prerequisites',
            description: `Nodes requiring ${prereq}`,
          })),
        },
      ]
    }
  }, [filterType, availableNodes, nodes])

  // Add a filter
  const addFilter = useCallback((filter: DestinyFilter) => {
    setSelectedFilters(prev => {
      // Prevent duplicate filters
      const exists = prev.some(f => f.type === filter.type && f.nodeName === filter.nodeName)
      if (exists) return prev
      return [...prev, filter]
    })
  }, [])

  // Remove a filter
  const removeFilter = useCallback((filterId: string) => {
    setSelectedFilters(prev => prev.filter(f => f.id !== filterId))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilters([])
  }, [])

  // Get filter options for autocomplete
  const getFilterOptions = useCallback((): SearchOption[] => {
    return searchCategories.flatMap(category => category.options)
  }, [searchCategories])

  // Check if a node is available for filtering
  const isNodeAvailable = useCallback((node: DestinyNode): boolean => {
    return availableNodes.some(n => n.id === node.id)
  }, [availableNodes])

  // Filter paths based on selected filters
  const filteredPaths = useMemo(() => {
    // This would be implemented based on the path generation logic
    // For now, return empty array - this will be implemented when we have path generation
    return []
  }, [selectedFilters, currentPath])

  return {
    selectedFilters,
    searchCategories,
    addFilter,
    removeFilter,
    clearFilters,
    filteredPaths,
    availableNodes,
    getFilterOptions,
    isNodeAvailable,
  }
} 