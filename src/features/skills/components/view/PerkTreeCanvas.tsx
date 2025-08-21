import { Z_INDEX } from '@/lib/constants'
import React, { useCallback, useMemo } from 'react'
import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance,
} from 'reactflow'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type {
  PerkNodeData,
  PerkNode as PerkNodeType,
  PerkTree,
} from '../../types'
import { validatePerkTreeSafe } from '../../utils'
import { PerkNode } from './PerkNode'

interface PerkTreeCanvasProps {
  tree: PerkTree | undefined
  onTogglePerk: (perkId: string) => void
  onRankChange?: (perkId: string, newRank: number) => void
  selectedPerks: PerkNodeType[]
}

// Simplified tree node structure
interface TreeNode {
  perk: PerkNodeType
  level: number // Calculated from tree structure (0 = roots, higher = deeper)
  children: string[] // perk IDs from connections array
  parents: string[] // calculated from reverse connections
}

// Build tree structure using the current data format
function buildTreeStructure(perks: PerkNodeType[]): Map<string, TreeNode> {
  const treeNodes = new Map<string, TreeNode>()

  // Initialize all nodes with temporary level
  perks.forEach(perk => {
    const perkId = perk.edid
    treeNodes.set(perkId, {
      perk,
      level: 0, // Will be calculated based on tree structure
      children: [],
      parents: [],
    })
  })

  // Build parent-child relationships from connections object
  perks.forEach(perk => {
    const perkId = perk.edid
    const node = treeNodes.get(perkId)!

    // Handle connections object (new format)
    if (perk.connections && perk.connections.children) {
      perk.connections.children.forEach((childId: string) => {
        // Skip self-references
        if (childId === perkId) return

        // Check if this child exists in our tree
        if (treeNodes.has(childId)) {
          // Add this node as parent to the child
          const childNode = treeNodes.get(childId)!
          childNode.parents.push(perkId)

          // Add the child to this node's children
          node.children.push(childId)
        }
      })
    }
  })

  // Calculate levels based on tree structure
  const calculateLevels = () => {
    const visited = new Set<string>()
    const queue: { perkId: string; level: number }[] = []

    // Start with root nodes (nodes with no parents)
    treeNodes.forEach((node, perkId) => {
      if (node.parents.length === 0) {
        queue.push({ perkId, level: 0 })
        visited.add(perkId)
      }
    })

    // Process queue to calculate levels
    while (queue.length > 0) {
      const { perkId, level } = queue.shift()!
      const node = treeNodes.get(perkId)!

      // Set the level
      node.level = level

      // Add children to queue with level + 1
      node.children.forEach(childId => {
        if (!visited.has(childId)) {
          queue.push({ perkId: childId, level: level + 1 })
          visited.add(childId)
        }
      })
    }

    // Handle any disconnected nodes
    treeNodes.forEach((node, perkId) => {
      if (!visited.has(perkId)) {
        node.level = 0 // Put disconnected nodes at root level
      }
    })
  }

  calculateLevels()

  // Identify root nodes (nodes with no parents)
  const roots: string[] = []
  treeNodes.forEach((node, perkId) => {
    if (node.parents.length === 0) {
      roots.push(perkId)
    }
  })

  // Calculate level distribution
  const levelDistribution = Array.from(treeNodes.values()).reduce(
    (acc, node) => {
      acc[node.level] = (acc[node.level] || 0) + 1
      return acc
    },
    {} as Record<number, number>
  )



  return treeNodes
}

// Subtree-aware tree layout algorithm that maintains parent-child alignment
function calculateNodePositions(perks: PerkNodeType[]) {
  const positions = new Map<string, { x: number; y: number }>()

  if (perks.length === 0) return positions

  // Build tree structure
  const treeNodes = buildTreeStructure(perks)

  // Find max depth
  const maxDepth = Math.max(
    ...Array.from(treeNodes.values()).map(node => node.level)
  )

  // Node dimensions and spacing
  const nodeWidth = 140
  const nodeHeight = 80
  const horizontalSpacing = nodeWidth * 1.5 // 210px - generous spacing
  const verticalSpacing = nodeHeight + 50 // 130px - generous vertical spacing
  const padding = 50

  // Group nodes by level
  const nodesByLevel = new Map<number, string[]>()
  treeNodes.forEach((node, perkId) => {
    const level = node.level
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, [])
    }
    nodesByLevel.get(level)!.push(perkId)
  })

  // Find separate trees (connected components)
  const findConnectedComponents = (): string[][] => {
    const visited = new Set<string>()
    const components: string[][] = []

    const dfs = (perkId: string, component: string[]) => {
      if (visited.has(perkId)) return
      visited.add(perkId)
      component.push(perkId)

      const node = treeNodes.get(perkId)!
      // Visit children
      node.children.forEach(childId => {
        dfs(childId, component)
      })
      // Visit parents
      node.parents.forEach(parentId => {
        dfs(parentId, component)
      })
    }

    treeNodes.forEach((node, perkId) => {
      if (!visited.has(perkId)) {
        const component: string[] = []
        dfs(perkId, component)
        components.push(component)
      }
    })

    return components
  }

  const connectedComponents = findConnectedComponents()

  // Helper function to get all descendants of a node (including the node itself)
  const getSubtreeNodes = (rootId: string): Set<string> => {
    const subtree = new Set<string>()
    const queue = [rootId]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      if (subtree.has(currentId)) continue

      subtree.add(currentId)
      const node = treeNodes.get(currentId)!
      node.children.forEach(childId => {
        queue.push(childId)
      })
    }

    return subtree
  }

  // Helper function to move an entire subtree by a given offset
  const moveSubtree = (rootId: string, offsetX: number) => {
    const subtreeNodes = getSubtreeNodes(rootId)

    subtreeNodes.forEach(nodeId => {
      const pos = positions.get(nodeId)
      if (pos) {
        pos.x += offsetX
        positions.set(nodeId, pos)
      }
    })
  }

  // Position each tree separately
  let currentTreeX = padding

  connectedComponents.forEach((component, treeIndex) => {
    // Find root nodes in this component
    const rootNodes = component.filter(perkId => {
      const node = treeNodes.get(perkId)!
      return node.parents.length === 0
    })

    if (rootNodes.length === 0) return

    // Calculate total width needed for root nodes
    const totalRootWidth =
      rootNodes.length * nodeWidth + (rootNodes.length - 1) * horizontalSpacing

    // Position root nodes for this tree with exact spacing
    let currentX = currentTreeX
    rootNodes.forEach(perkId => {
      const y = (maxDepth - 0) * verticalSpacing + padding
      const x = currentX

      positions.set(perkId, { x, y })
      currentX += nodeWidth + horizontalSpacing
    })

    // Position remaining nodes level by level
    const positionedNodes = new Set<string>(rootNodes)

    for (let level = 1; level <= maxDepth; level++) {
      const levelNodes = nodesByLevel.get(level) || []
      const treeLevelNodes = levelNodes.filter(perkId =>
        component.includes(perkId)
      )

      if (treeLevelNodes.length === 0) continue

      // Step 1: Calculate ideal positions based on parents
      const idealPositions = new Map<string, number>()

      treeLevelNodes.forEach(perkId => {
        if (positionedNodes.has(perkId)) return

        const node = treeNodes.get(perkId)!

        // Calculate center position based on parents
        if (node.parents.length > 0) {
          let totalParentX = 0
          let validParents = 0
          const parentPositions: number[] = []

          node.parents.forEach(parentId => {
            if (positions.has(parentId)) {
              const parentPos = positions.get(parentId)!
              const parentCenterX = parentPos.x + nodeWidth / 2
              totalParentX += parentCenterX
              parentPositions.push(parentCenterX)
              validParents++
            }
          })

          if (validParents > 0) {
            let idealX: number

            if (validParents === 1) {
              // Single parent: center directly above the parent
              idealX = totalParentX / validParents
            } else {
              // Multiple parents: center at the midpoint between the leftmost and rightmost parent
              const minParentX = Math.min(...parentPositions)
              const maxParentX = Math.max(...parentPositions)
              idealX = (minParentX + maxParentX) / 2
            }

            idealPositions.set(perkId, idealX)

          }
        }
      })

      // Step 2: Sort nodes by their ideal positions
      const sortedNodes = treeLevelNodes
        .filter(
          perkId => !positionedNodes.has(perkId) && idealPositions.has(perkId)
        )
        .sort((a, b) => {
          const idealA = idealPositions.get(a)!
          const idealB = idealPositions.get(b)!
          return idealA - idealB
        })

      // Step 3: Position nodes with guaranteed spacing, moving subtrees as needed
      if (sortedNodes.length > 0) {
        // Start with the first node at its ideal position
        const firstNode = sortedNodes[0]
        const firstIdealX = idealPositions.get(firstNode)!
        const firstX = firstIdealX - nodeWidth / 2
        const y = (maxDepth - level) * verticalSpacing + padding
        positions.set(firstNode, { x: firstX, y })
        positionedNodes.add(firstNode)

        // Position remaining nodes with proper spacing
        for (let i = 1; i < sortedNodes.length; i++) {
          const currentNode = sortedNodes[i]
          const previousNode = sortedNodes[i - 1]
          const previousPos = positions.get(previousNode)!
          const currentIdealX = idealPositions.get(currentNode)!

          // Calculate minimum required position (previous node + spacing)
          const minRequiredX = previousPos.x + nodeWidth + horizontalSpacing

          // Calculate ideal position for current node
          const idealX = currentIdealX - nodeWidth / 2

          // Use the larger of minimum required and ideal position
          const finalX = Math.max(minRequiredX, idealX)

          // Always position the current node first
          positions.set(currentNode, { x: finalX, y })
          positionedNodes.add(currentNode)

          // If we had to move the node beyond its ideal position, move its entire subtree
          if (finalX > idealX) {
            const offset = finalX - idealX
            moveSubtree(currentNode, offset)
          }
        }
      }
    }

    // Move to next tree position
    currentTreeX += totalRootWidth + horizontalSpacing * 2
  })

  return positions
}

// Create a wrapper component that receives callbacks
const createPerkNodeComponent = (
  onTogglePerk?: (perkId: string) => void,
  onRankChange?: (perkId: string, newRank: number) => void
) => {
  return (props: any) => (
    <PerkNode
      {...props}
      onTogglePerk={onTogglePerk}
      onRankChange={onRankChange}
    />
  )
}

// Memoized node types to prevent React Flow warnings
const createNodeTypes = (
  onTogglePerk?: (perkId: string) => void,
  onRankChange?: (perkId: string, newRank: number) => void
): NodeTypes => ({
  perkNode: createPerkNodeComponent(onTogglePerk, onRankChange),
})

export function PerkTreeCanvas({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
}: PerkTreeCanvasProps) {
  // React Flow instance
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null)

  // Validate tree data
  const validatedTree = useMemo(() => {
    if (!tree) return null

    const validation = validatePerkTreeSafe(tree)
    if (!validation.success) {
      console.error('Invalid perk tree data:', validation.error)
      return null
    }

    return validation.data
  }, [tree])

  // Create node types with callbacks
  const nodeTypes: NodeTypes = useMemo(
    () => createNodeTypes(onTogglePerk, onRankChange),
    [onTogglePerk, onRankChange]
  )

  // Calculate node positions
  const nodePositions = useMemo(() => {
    if (!validatedTree) return new Map()
    return calculateNodePositions(validatedTree.perks)
  }, [validatedTree])

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!validatedTree) return []

    // Build tree structure to get children information
    const treeNodes = buildTreeStructure(validatedTree.perks)

    const nodes = validatedTree.perks.map(perk => {
      const perkId = perk.edid
      const perkName = perk.name
      const position = nodePositions.get(perkId) || { x: 0, y: 0 }

      // Get tree node info for handle rendering
      const treeNode = treeNodes.get(perkId)
      const hasChildren = treeNode ? treeNode.children.length > 0 : false
      const isRoot = treeNode ? treeNode.parents.length === 0 : false

      return {
        id: perkId,
        type: 'perkNode',
        position,
        data: {
          ...perk,
          selected: false, // Will be updated via useEffect
          hasChildren: hasChildren,
          isRoot: isRoot,
        } as PerkNodeData,
      }
    })

    return nodes
  }, [validatedTree, nodePositions])

  // Create React Flow edges from connections array
  const initialEdges: Edge[] = useMemo(() => {
    if (!validatedTree) return []

    const edges: Edge[] = []

    validatedTree.perks.forEach(perk => {
      const perkId = perk.edid
      const perkName = perk.name

      // Handle connections object (new format)
      if (
        perk.connections &&
        perk.connections.children &&
        perk.connections.children.length > 0
      ) {
        perk.connections.children.forEach((childId: string) => {
          // Skip self-references
          if (childId === perkId) {
            return
          }

          // Check if child exists in our tree
          const childExists = validatedTree.perks.some(p => p.edid === childId)
          if (childExists) {
            const childPerk = validatedTree.perks.find(p => p.edid === childId)

            edges.push({
              id: `${perkId}-${childId}`,
              source: perkId,
              target: childId,
              type: 'straight',
              style: {
                stroke: '#d4af37',
                strokeWidth: 3,
                opacity: 0.8,
              },
            })
          }
        })
      }
    })



    return edges
  }, [validatedTree])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when tree changes
  React.useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  // Update node selection state
  React.useEffect(() => {
    if (!validatedTree) return

    setNodes(currentNodes =>
      currentNodes.map(node => {
        const selectedPerk = selectedPerks.find(p => p.edid === node.id)
        const isSelected = selectedPerk !== undefined

        return {
          ...node,
          data: {
            ...node.data,
            selected: isSelected,
            currentRank: (selectedPerk as PerkNodeData)?.currentRank || 0,
          } as PerkNodeData,
        }
      })
    )
  }, [selectedPerks, setNodes, validatedTree])

  // Update edges when tree changes
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  // Fit view when tree changes
  React.useEffect(() => {
    if (validatedTree && nodes.length > 0 && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.2, // Increased padding for better spacing
          includeHiddenNodes: false,
          minZoom: 0.2,
          maxZoom: 1.5,
        })
      }, 200) // Increased delay to ensure positioning is complete
    }
  }, [validatedTree?.treeId, reactFlowInstance])

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  )

  if (!validatedTree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">
          {tree
            ? 'Invalid perk tree data'
            : 'Select a skill to view its perk tree'}
        </p>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full bg-background rounded-lg border"
      style={{ zIndex: Z_INDEX.CONTENT }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesFocusable={false}
        selectNodesOnDrag={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.2,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <Background
          color="hsl(var(--muted-foreground))"
          gap={20}
          size={1}
          style={{ backgroundColor: 'hsl(var(--background))' }}
        />
        <Controls />
      </ReactFlow>
    </div>
  )
}
