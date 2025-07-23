import { useState, useEffect, useMemo } from 'react'
import { DestinyDataProvider } from '../model/DestinyDataProvider'
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
  getNodeByName: (name: string) => DestinyNode | undefined
  getNextNodes: (nodeName: string) => DestinyNode[]
  getPrerequisiteNodes: (nodeName: string) => DestinyNode[]
  
  // Filtering
  filterByCategory: (category: string) => DestinyNode[]
  filterByTag: (tag: string) => DestinyNode[]
  searchNodes: (term: string) => DestinyNode[]
}

export function useDestinyNodes(options: UseDestinyNodesOptions = {}): UseDestinyNodesReturn {
  const {
    includePrerequisites = false,
    includeNextNodes = false,
    filterByTags = [],
    searchTerm = '',
    sortBy = 'name'
  } = options

  const [nodes, setNodes] = useState<DestinyNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataProvider] = useState(() => new DestinyDataProvider())

  // Load nodes on mount
  useEffect(() => {
    const loadNodes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const loadedNodes = await dataProvider.loadNodes()
        setNodes(loadedNodes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load destiny nodes')
      } finally {
        setIsLoading(false)
      }
    }

    loadNodes()
  }, [dataProvider])

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

  const getNodeByName = (name: string): DestinyNode | undefined => {
    return nodes.find(node => node.name === name)
  }

  const getNextNodes = (nodeName: string): DestinyNode[] => {
    const node = getNodeByName(nodeName)
    if (!node) return []
    return DestinyNodeModel.getNextNodes(node, nodes)
  }

  const getPrerequisiteNodes = (nodeName: string): DestinyNode[] => {
    const node = getNodeByName(nodeName)
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

  const refresh = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const loadedNodes = await dataProvider.loadNodes()
      setNodes(loadedNodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh destiny nodes')
    } finally {
      setIsLoading(false)
    }
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
    getNodeByName,
    getNextNodes,
    getPrerequisiteNodes,
    
    // Filtering
    filterByCategory,
    filterByTag,
    searchNodes,
  }
} 