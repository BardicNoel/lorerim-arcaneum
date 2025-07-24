import { useMemo } from 'react'
import type { DestinyNode } from '../types'
import { useDestinyNodes } from './useDestinyNodes'

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

interface UseDestinyPossiblePathsOptions {
  fromNode?: DestinyNode
  maxDepth?: number
}

interface UseDestinyPossiblePathsReturn {
  possiblePaths: PredictivePath[]
  isLoading: boolean
  error: string | null
}

export function useDestinyPossiblePaths(
  options: UseDestinyPossiblePathsOptions = {}
): UseDestinyPossiblePathsReturn {
  const { fromNode, maxDepth = 10 } = options
  const { nodes, rootNodes, isLoading, error } = useDestinyNodes()

  const possiblePaths = useMemo(() => {
    if (isLoading || error || !nodes.length) {
      return []
    }

    const paths: PredictivePath[] = []
    const visited = new Set<string>()

    // Helper function to get next nodes for a given node
    const getNextNodes = (nodeEdid: string): DestinyNode[] => {
      return nodes.filter(node => node.prerequisites.includes(nodeEdid))
    }

    // Helper function to check if a node is terminal (no children)
    const isTerminalNode = (node: DestinyNode): boolean => {
      return !nodes.some(n => n.prerequisites.includes(node.edid))
    }

    // Recursive function to build all possible paths
    const buildPaths = (currentPath: DestinyNode[], depth: number = 0) => {
      if (depth >= maxDepth) {
        return
      }

      const lastNode = currentPath[currentPath.length - 1]
      const nextNodes = getNextNodes(lastNode.edid)

      if (nextNodes.length === 0) {
        // End of path - add to results
        paths.push({
          path: [...currentPath],
          isComplete: true,
          endNode: lastNode,
        })
        return
      }

      // Continue building paths for each next node
      nextNodes.forEach(nextNode => {
        const pathKey =
          currentPath.map(n => n.id).join('->') + '->' + nextNode.id

        if (!visited.has(pathKey)) {
          visited.add(pathKey)
          buildPaths([...currentPath, nextNode], depth + 1)
        }
      })
    }

    // Start building paths
    if (fromNode) {
      // Check if the fromNode is terminal (no children)
      const nextNodes = getNextNodes(fromNode.edid)
      if (nextNodes.length === 0) {
        // Terminal node - no possible paths
        return []
      }
      // Build paths from the specified node
      buildPaths([fromNode])
    } else {
      // Build paths from all root nodes
      rootNodes.forEach(rootNode => {
        buildPaths([rootNode])
      })
    }

    return paths
  }, [nodes, rootNodes, fromNode, maxDepth, isLoading, error])

  return {
    possiblePaths,
    isLoading,
    error,
  }
}
