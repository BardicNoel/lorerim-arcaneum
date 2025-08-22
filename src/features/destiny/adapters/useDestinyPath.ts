import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DestinyNode } from '../types'
import { useDestinyNodes } from './useDestinyNodes'

interface UseDestinyPathOptions {
  initialPath?: DestinyNode[]
  validatePath?: boolean
}

interface UseDestinyPathReturn {
  // Current path state
  currentPath: DestinyNode[]
  currentNode: DestinyNode | null

  // Available options
  availableNodes: DestinyNode[]
  rootNodes: DestinyNode[]

  // Path validation
  isValidPath: boolean
  pathErrors: string[]

  // Actions
  addNodeToPath: (node: DestinyNode) => boolean
  removeNodeFromPath: (index: number) => void
  setPath: (path: DestinyNode[]) => void
  clearPath: () => void
  goToPathIndex: (index: number) => void

  // Computed
  pathLength: number
  isPathComplete: boolean
  nextPossibleNodes: DestinyNode[]
  prerequisiteNodes: DestinyNode[]

  // Path analysis
  getPathSummary: () => {
    startNode: DestinyNode | null
    endNode: DestinyNode | null
    totalNodes: number
    pathString: string
  }
}

export function useDestinyPath(
  options: UseDestinyPathOptions = {}
): UseDestinyPathReturn {
  const { initialPath = [], validatePath = true } = options

  const [currentPath, setCurrentPath] = useState<DestinyNode[]>(initialPath)
  const { nodes, rootNodes } = useDestinyNodes()

  // Sync internal state with initialPath prop changes
  useEffect(() => {
    setCurrentPath(initialPath)
  }, [initialPath])

  // Current node (last in path)
  const currentNode = useMemo(() => {
    return currentPath.length > 0 ? currentPath[currentPath.length - 1] : null
  }, [currentPath])

  // Available nodes (nodes that can be added to the current path)
  const availableNodes = useMemo(() => {
    if (currentPath.length === 0) {
      return rootNodes
    }

    // Return nodes where ANY prerequisite is met by the current path
    return nodes.filter(node => {
      if (node.prerequisites.length === 0) return false // Skip root nodes
      return node.prerequisites.some(prereqEdid =>
        currentPath.some(pathNode => pathNode.edid === prereqEdid)
      )
    })
  }, [currentPath, nodes, rootNodes])

  // Next possible nodes from current position
  const nextPossibleNodes = useMemo(() => {
    if (!currentNode) return rootNodes
    // Return nodes where the current node is one of the prerequisites
    return nodes.filter(node => node.prerequisites.includes(currentNode.edid))
  }, [currentNode, nodes, rootNodes])

  // Prerequisite nodes for current node
  const prerequisiteNodes = useMemo(() => {
    if (!currentNode) return []
    return nodes.filter(node => currentNode.prerequisites.includes(node.edid))
  }, [currentNode, nodes])

  // Path validation
  const { isValidPath, pathErrors } = useMemo(() => {
    if (!validatePath || currentPath.length === 0) {
      return { isValidPath: true, pathErrors: [] }
    }

    const errors: string[] = []

    // Check if each node's prerequisites are met (ANY prerequisite is sufficient)
    for (let i = 1; i < currentPath.length; i++) {
      const node = currentPath[i]
      const previousNodes = currentPath.slice(0, i)

      // Check if ANY prerequisite is met (OR logic instead of AND)
      const hasMetPrerequisite = node.prerequisites.some(prereqEdid =>
        previousNodes.some(prevNode => prevNode.edid === prereqEdid)
      )

      if (!hasMetPrerequisite && node.prerequisites.length > 0) {
        errors.push(
          `${node.name} requires one of: ${node.prerequisites.join(', ')}`
        )
      }
    }

    return {
      isValidPath: errors.length === 0,
      pathErrors: errors,
    }
  }, [currentPath, validatePath])

  // Add node to path
  const addNodeToPath = useCallback(
    (node: DestinyNode): boolean => {
      // Check if node can be added (ANY prerequisite met)
      if (currentPath.length > 0) {
        const lastNode = currentPath[currentPath.length - 1]
        // Check if ANY prerequisite is met (OR logic)
        const hasMetPrerequisite = node.prerequisites.some(prereqEdid =>
          currentPath.some(pathNode => pathNode.edid === prereqEdid)
        )
        if (!hasMetPrerequisite && node.prerequisites.length > 0) {
          return false
        }
      } else {
        // First node must be a root node
        if (node.prerequisites.length > 0) {
          return false
        }
      }

      setCurrentPath(prev => [...prev, node])
      return true
    },
    [currentPath]
  )

  // Remove node from path (and all subsequent nodes)
  const removeNodeFromPath = useCallback((index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1))
  }, [])

  // Set entire path
  const setPath = useCallback((path: DestinyNode[]) => {
    setCurrentPath(path)
  }, [])

  // Clear path
  const clearPath = useCallback(() => {
    setCurrentPath([])
  }, [])

  // Go to specific index in path
  const goToPathIndex = useCallback((index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1))
  }, [])

  // Path summary
  const getPathSummary = useCallback(() => {
    return {
      startNode: currentPath[0] || null,
      endNode: currentPath[currentPath.length - 1] || null,
      totalNodes: currentPath.length,
      pathString: currentPath.map(node => node.name).join(' → '),
    }
  }, [currentPath])

  return {
    // Current path state
    currentPath,
    currentNode,

    // Available options
    availableNodes,
    rootNodes,

    // Path validation
    isValidPath,
    pathErrors,

    // Actions
    addNodeToPath,
    removeNodeFromPath,
    setPath,
    clearPath,
    goToPathIndex,

    // Computed
    pathLength: currentPath.length,
    isPathComplete: nextPossibleNodes.length === 0,
    nextPossibleNodes,
    prerequisiteNodes,

    // Path analysis
    getPathSummary,
  }
}
