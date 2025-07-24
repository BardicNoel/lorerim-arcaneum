import type {
  SearchCategory,
  SearchOption,
} from '@/shared/components/playerCreation/types'
import { useCallback, useMemo, useState } from 'react'
import type { DestinyNode } from '../types'
import { useDestinyNodes } from './useDestinyNodes'
import { useDestinyPossiblePaths } from './useDestinyPossiblePaths'

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

export function useDestinyFilters(
  options: UseDestinyFiltersOptions
): UseDestinyFiltersReturn {
  const { filterType, currentPath = [] } = options
  const { nodes, rootNodes } = useDestinyNodes()
  const [selectedFilters, setSelectedFilters] = useState<DestinyFilter[]>([])

  // Get possible paths from current position for filtering
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode:
      currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
  })

  // Get available nodes for build path filters (nodes that can be reached from current path)
  const availableNodes = useMemo(() => {
    if (filterType !== 'build-path') {
      return nodes
    }

    if (currentPath.length === 0) {
      return nodes
    }

    // Return nodes that can be reached from the current path
    const reachableNodes = new Set<string>()
    const visited = new Set<string>()

    const findReachableNodes = (nodeEdid: string) => {
      if (visited.has(nodeEdid)) return
      visited.add(nodeEdid)
      reachableNodes.add(nodeEdid)

      // Find all nodes that have this node as a prerequisite
      nodes.forEach(node => {
        if (node.prerequisites.includes(nodeEdid)) {
          findReachableNodes(node.edid)
        }
      })
    }

    // Start from the last node in current path
    const lastNode = currentPath[currentPath.length - 1]
    findReachableNodes(lastNode.edid)

    return nodes.filter(node => reachableNodes.has(node.edid))
  }, [filterType, currentPath, nodes, rootNodes])

  // Generate search categories based on filter type
  const searchCategories = useMemo((): SearchCategory[] => {
    if (filterType === 'build-path') {
      // Get nodes that are actually reachable in the possible paths
      const reachableInPaths = new Set<string>()
      const terminalInPaths = new Set<string>()

      possiblePaths.forEach(p => {
        p.path.forEach(node => {
          reachableInPaths.add(node.edid)
        })
        // Mark the end node as a terminal
        if (p.path.length > 0) {
          terminalInPaths.add(p.path[p.path.length - 1].edid)
        }
      })

      // Filter nodes to only those that appear in possible paths
      const reachableNodes = nodes.filter(node =>
        reachableInPaths.has(node.edid)
      )
      const terminalNodes = nodes.filter(node => terminalInPaths.has(node.edid))

      return [
        {
          id: 'includes-node',
          name: 'Includes Node',
          placeholder: 'Filter paths that include this node...',
          options: reachableNodes.map(node => {
            const matchingPaths = possiblePaths.filter(p =>
              p.path.some(pathNode => pathNode.edid === node.edid)
            ).length
            return {
              id: `includes-${node.id}`,
              label: node.name,
              value: node.edid,
              category: 'Includes Node',
              description: `${matchingPaths} path${matchingPaths !== 1 ? 's' : ''} include ${node.name}`,
            }
          }),
        },
        {
          id: 'ends-with-node',
          name: 'Ends With Node',
          placeholder: 'Filter paths that end with this node...',
          options: terminalNodes.map(node => {
            const matchingPaths = possiblePaths.filter(
              p =>
                p.path.length > 0 &&
                p.path[p.path.length - 1].edid === node.edid
            ).length
            return {
              id: `ends-${node.id}`,
              label: node.name,
              value: node.edid,
              category: 'Ends With Node',
              description: `${matchingPaths} path${matchingPaths !== 1 ? 's' : ''} end with ${node.name}`,
            }
          }),
        },
      ]
    } else {
      // Reference page filters
      const tags = [...new Set(nodes.flatMap(node => node.tags))]
      const prerequisites = [
        ...new Set(nodes.flatMap(node => node.prerequisites)),
      ]

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
          options: prerequisites.map(prereqEdid => {
            const prereqNode = nodes.find(n => n.edid === prereqEdid)
            return {
              id: `prereq-${prereqEdid}`,
              label: prereqNode ? prereqNode.name : prereqEdid,
              value: prereqEdid,
              category: 'Prerequisites',
              description: `Nodes requiring ${prereqNode ? prereqNode.name : prereqEdid}`,
            }
          }),
        },
      ]
    }
  }, [filterType, availableNodes, nodes, possiblePaths])

  // Add a filter
  const addFilter = useCallback((filter: DestinyFilter) => {
    setSelectedFilters(prev => {
      // Prevent duplicate filters
      const exists = prev.some(
        f => f.type === filter.type && f.nodeName === filter.nodeName
      )
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
  const isNodeAvailable = useCallback(
    (node: DestinyNode): boolean => {
      return availableNodes.some(n => n.id === node.id)
    },
    [availableNodes]
  )

  // Filter paths based on selected filters
  const filteredPaths = useMemo(() => {
    if (filterType !== 'build-path' || selectedFilters.length === 0) {
      // Return all possible paths if no filters or not build-path type
      return possiblePaths.map(p => p.path)
    }

    // Apply filters to possible paths
    return possiblePaths
      .map(p => p.path)
      .filter(path => {
        // Check if path matches all selected filters
        return selectedFilters.every(filter => {
          switch (filter.type) {
            case 'includes-node':
              // Path must include the specified node (by edid)
              return path.some(
                node =>
                  node.edid === filter.nodeName || node.edid === filter.nodeId
              )

            case 'ends-with-node':
              // Path must end with the specified node (by edid)
              return (
                path.length > 0 &&
                (path[path.length - 1].edid === filter.nodeName ||
                  path[path.length - 1].edid === filter.nodeId)
              )

            default:
              return true // Ignore other filter types for build path
          }
        })
      })
  }, [filterType, selectedFilters, possiblePaths])

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
