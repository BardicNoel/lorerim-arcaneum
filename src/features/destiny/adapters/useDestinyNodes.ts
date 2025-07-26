import { useDestinyNodes as useCachedDestinyNodes } from '@/shared/stores'
import { useMemo } from 'react'
import { DestinyNodeModel } from '../model/DestinyNodeModel'
import type { DestinyNode } from '../types'

interface UseDestinyNodesOptions {
  includePrerequisites?: boolean
  includeNextNodes?: boolean
  filterByTags?: string[]
  searchTerm?: string
  sortBy?: 'name' | 'category' | 'prerequisites'
}

interface UseDestinyNodesReturn {
  // Data
  nodes: DestinyNode[]
  rootNodes: DestinyNode[]
  filteredNodes: DestinyNode[]

  // State
  isLoading: boolean
  error: string | null

  // Computed
  categories: string[]
  tags: string[]

  // Actions
  refresh: () => void
  getNodeById: (id: string) => DestinyNode | undefined
  getNodeByName: (name: string) => DestinyNode | undefined // Deprecated
  getNodeByEdid: (edid: string) => DestinyNode | undefined
  getNextNodes: (nodeEdid: string) => DestinyNode[]
  getPrerequisiteNodes: (nodeEdid: string) => DestinyNode[]

  // Filtering
  filterByCategory: (category: string) => DestinyNode[]
  filterByTag: (tag: string) => DestinyNode[]
  searchNodes: (term: string) => DestinyNode[]
}

export function useDestinyNodes(
  options: UseDestinyNodesOptions = {}
): UseDestinyNodesReturn {
  const {
    includePrerequisites = false,
    includeNextNodes = false,
    filterByTags = [],
    searchTerm = '',
    sortBy = 'name',
  } = options

  // Use the cached data provider
  const {
    data: destinyData,
    loading: isLoading,
    error: cacheError,
    reload,
  } = useCachedDestinyNodes()
  const nodes = destinyData || []
  const error = cacheError

  // Root nodes (nodes with no prerequisites)
  const rootNodes = useMemo(() => {
    return DestinyNodeModel.getRootNodes(nodes)
  }, [nodes])

  // Categories and tags
  const categories = useMemo(() => {
    // For now, return empty array since we don't have category field in DestinyNode
    return []
  }, [nodes])

  const tags = useMemo(() => {
    return DestinyNodeModel.getUniqueTags(nodes)
  }, [nodes])

  // Filtered nodes based on options
  const filteredNodes = useMemo(() => {
    let filtered = [...nodes]

    // Apply tag filters
    if (filterByTags.length > 0) {
      filtered = DestinyNodeModel.filterByAnyTag(filtered, filterByTags)
    }

    // Apply search term
    if (searchTerm) {
      filtered = DestinyNodeModel.search(filtered, searchTerm)
    }

    // Sort nodes
    if (sortBy === 'name') {
      filtered = DestinyNodeModel.sortByName(filtered)
    } else if (sortBy === 'prerequisites') {
      filtered = DestinyNodeModel.sortByPrerequisites(filtered)
    }

    return filtered
  }, [nodes, filterByTags, searchTerm, sortBy])

  // Helper functions
  const getNodeById = (id: string): DestinyNode | undefined => {
    return nodes.find(node => node.id === id)
  }

  const getNodeByEdid = (edid: string): DestinyNode | undefined => {
    return nodes.find(node => node.edid === edid)
  }

  // Deprecated: getNodeByName (for compatibility, but should migrate to edid)
  const getNodeByName = (name: string): DestinyNode | undefined => {
    return nodes.find(node => node.name === name)
  }

  const getNextNodes = (nodeEdid: string): DestinyNode[] => {
    const node = getNodeByEdid(nodeEdid)
    if (!node) return []
    return DestinyNodeModel.getNextNodes(node, nodes)
  }

  const getPrerequisiteNodes = (nodeEdid: string): DestinyNode[] => {
    const node = getNodeByEdid(nodeEdid)
    if (!node) return []
    return DestinyNodeModel.getPrerequisiteNodes(node, nodes)
  }

  const filterByCategory = (category: string): DestinyNode[] => {
    // For now, return empty array since we don't have category field in DestinyNode
    return []
  }

  const filterByTag = (tag: string): DestinyNode[] => {
    return DestinyNodeModel.filterByTag(nodes, tag)
  }

  const searchNodes = (term: string): DestinyNode[] => {
    return DestinyNodeModel.search(nodes, term)
  }

  const refresh = () => {
    reload()
  }

  return {
    // Data
    nodes,
    rootNodes,
    filteredNodes,

    // State
    isLoading,
    error,

    // Computed
    categories,
    tags,

    // Actions
    refresh,
    getNodeById,
    getNodeByName, // Deprecated
    getNodeByEdid,
    getNextNodes,
    getPrerequisiteNodes,

    // Filtering
    filterByCategory,
    filterByTag,
    searchNodes,
  }
}
