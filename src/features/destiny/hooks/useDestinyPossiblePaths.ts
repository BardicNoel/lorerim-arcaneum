import { useMemo } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import type { DestinyNode } from '../types'

// Returns all possible paths from the current build path (or from roots if empty)
export function useDestinyPossiblePaths(nodes: DestinyNode[]) {
  const { getDestinyPath } = useCharacterBuild()
  const pathIds = getDestinyPath()
  const startNode = pathIds.length
    ? nodes.find(n => n.id === pathIds[pathIds.length - 1])
    : undefined

  // Find root nodes (nodes with no prerequisites)
  const rootNodes = useMemo(() => {
    return nodes.filter(node => node.prerequisites.length === 0)
  }, [nodes])

  // Helper to get next nodes for a given node
  const getNextNodes = (nodeName: string) => {
    return nodes.filter(node => node.prerequisites.includes(nodeName))
  }

  // Recursively enumerate all possible paths from a given node
  const enumeratePaths = (
    currentPath: DestinyNode[],
    allPaths: DestinyNode[][]
  ) => {
    const lastNode = currentPath[currentPath.length - 1]
    const nextNodes = getNextNodes(lastNode.name)
    if (nextNodes.length === 0) {
      allPaths.push([...currentPath])
      return
    }
    nextNodes.forEach(nextNode => {
      enumeratePaths([...currentPath, nextNode], allPaths)
    })
  }

  const possiblePaths = useMemo(() => {
    const allPaths: DestinyNode[][] = []
    if (startNode) {
      enumeratePaths([startNode], allPaths)
    } else {
      rootNodes.forEach(root => {
        enumeratePaths([root], allPaths)
      })
    }
    return allPaths
  }, [nodes, startNode, rootNodes])

  return possiblePaths
} 