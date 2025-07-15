import { useState, useMemo } from 'react'
import type { DestinyNode, PlannedNode } from '../types'

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

interface UseDestinyPathProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  onNodePlan: (nodeId: string) => void
  onNodeUnplan: (nodeId: string) => void
}

export function useDestinyPath({
  nodes,
  plannedNodes,
  onNodePlan,
  onNodeUnplan
}: UseDestinyPathProps) {
  const [selectedPath, setSelectedPath] = useState<DestinyNode[]>([])

  // Find root nodes (nodes with no prerequisites)
  const rootNodes = useMemo(() => {
    return nodes.filter(node => node.prerequisites.length === 0)
  }, [nodes])

  // Get available next nodes for a given node
  const getNextNodes = (nodeName: string) => {
    return nodes.filter(node => node.prerequisites.includes(nodeName))
  }

  // Get current available options based on selected path
  const currentOptions = useMemo(() => {
    if (selectedPath.length === 0) return rootNodes
    const lastNode = selectedPath[selectedPath.length - 1]
    return getNextNodes(lastNode.name)
  }, [selectedPath, rootNodes])

  // Generate predictive paths from current position
  const predictivePaths = useMemo(() => {
    const paths: PredictivePath[] = []
    const visited = new Set<string>()

    const buildPaths = (currentPath: DestinyNode[]) => {
      const lastNode = currentPath[currentPath.length - 1]
      const nextNodes = getNextNodes(lastNode.name)

      if (nextNodes.length === 0) {
        // End of path
        paths.push({
          path: [...currentPath],
          isComplete: true,
          endNode: lastNode
        })
        return
      }

      // Continue building paths for each next node
      nextNodes.forEach(nextNode => {
        const pathKey = currentPath.map(n => n.id).join('->') + '->' + nextNode.id
        if (!visited.has(pathKey)) {
          visited.add(pathKey)
          buildPaths([...currentPath, nextNode])
        }
      })
    }

    // Start building paths from current position
    if (selectedPath.length === 0) {
      // From root, build paths from each root node
      rootNodes.forEach(rootNode => {
        buildPaths([rootNode])
      })
    } else {
      // From current position, build paths from each available option
      currentOptions.forEach(option => {
        buildPaths([...selectedPath, option])
      })
    }

    return paths
  }, [selectedPath, currentOptions, rootNodes, nodes])

  // Check if a node is planned
  const isNodePlanned = (nodeId: string) => {
    return plannedNodes.some(p => p.id === nodeId)
  }

  // Update planned nodes when selected path changes
  const updatePlannedNodes = (path: DestinyNode[]) => {
    // Clear existing planned nodes
    plannedNodes.forEach(node => {
      onNodeUnplan(node.id)
    })
    
    // Add all nodes from the selected path to planned nodes
    path.forEach(node => {
      onNodePlan(node.id)
    })
  }

  // Get current node name for the header
  const getCurrentNodeName = () => {
    if (selectedPath.length === 0) return "Destiny"
    return selectedPath[selectedPath.length - 1].name
  }

  // Remove nodes from path (backtrack)
  const backtrack = (index: number) => {
    const newPath = selectedPath.slice(0, index + 1)
    setSelectedPath(newPath)
    updatePlannedNodes(newPath)
  }

  // Handle breadcrumb click - advance to specific stage in path
  const handleBreadcrumbClick = (path: DestinyNode[], clickedIndex: number) => {
    const newPath = path.slice(0, clickedIndex + 1)
    setSelectedPath(newPath)
    updatePlannedNodes(newPath)
  }

  // Start a new path
  const startPath = (node: DestinyNode) => {
    setSelectedPath([node])
    updatePlannedNodes([node])
  }

  // Start a new path from scratch
  const startNewPath = () => {
    setSelectedPath([])
    updatePlannedNodes([])
  }

  return {
    selectedPath,
    rootNodes,
    currentOptions,
    predictivePaths,
    isNodePlanned,
    getCurrentNodeName,
    backtrack,
    handleBreadcrumbClick,
    startPath,
    startNewPath
  }
} 