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
import {
  type CanvasPosition,
  calculateGridBounds,
  DEFAULT_GRID_CONFIG,
} from '../../utils/avifGridUtils'
import { PerkNode } from './PerkNode'

interface PerkTreeCanvasExperimentalProps {
  tree: PerkTree | undefined
  onTogglePerk: (perkId: string) => void
  onRankChange?: (perkId: string, newRank: number) => void
  selectedPerks: PerkNodeType[]
  className?: string
}

// Create node types with callbacks
const createNodeTypes = (
  onTogglePerk: (perkId: string) => void,
  onRankChange?: (perkId: string, newRank: number) => void
): NodeTypes => ({
  perkNode: (props: any) => (
    <PerkNode
      {...props}
      onTogglePerk={onTogglePerk}
      onRankChange={onRankChange}
    />
  ),
})

/**
 * Convert AVIF grid coordinates to canvas pixel coordinates with mirroring
 * This creates a bottom-up, left-right mirrored tree layout
 */
function avifToCanvasPositionMirrored(
  position: { x: number; y: number; horizontal: number; vertical: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  config: typeof DEFAULT_GRID_CONFIG
): CanvasPosition {
  const { x: gridX, y: gridY, horizontal, vertical } = position

  // Mirror X-axis: flip left/right
  const mirroredGridX = bounds.maxX - gridX + bounds.minX
  const mirroredHorizontal = -horizontal // Flip horizontal offset

  // Mirror Y-axis: flip top/bottom (bottom-up tree)
  const mirroredGridY = bounds.maxY - gridY + bounds.minY
  const mirroredVertical = -vertical // Flip vertical offset

  // Calculate base position (center of grid cell) with mirrored coordinates
  const baseX =
    (mirroredGridX - bounds.minX) * config.cellWidth +
    (mirroredGridX - bounds.minX) * config.gridGap +
    config.padding +
    config.cellWidth / 2

  const baseY =
    (mirroredGridY - bounds.minY) * config.cellHeight +
    (mirroredGridY - bounds.minY) * config.gridGap +
    config.padding +
    config.cellHeight / 2

  // Apply mirrored sub-cell offset
  const offsetX =
    mirroredHorizontal * (config.cellWidth / 2 - config.nodeWidth / 2)
  const offsetY =
    mirroredVertical * (config.cellHeight / 2 - config.nodeHeight / 2)

  const finalX = baseX + offsetX
  const finalY = baseY + offsetY

  return {
    x: finalX,
    y: finalY,
    gridX: mirroredGridX,
    gridY: mirroredGridY,
    horizontal: mirroredHorizontal,
    vertical: mirroredVertical,
  }
}

export function PerkTreeCanvasExperimental({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
  className,
}: PerkTreeCanvasExperimentalProps) {
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

  // Calculate node positions using AVIF grid system with mirroring
  const nodePositions = useMemo(() => {
    if (!validatedTree) return new Map<string, CanvasPosition>()

    const positions = new Map<string, CanvasPosition>()
    const config = DEFAULT_GRID_CONFIG

    // Extract all positions and calculate grid bounds
    const allPositions = validatedTree.perks
      .map(perk => perk.position)
      .filter((pos): pos is NonNullable<typeof pos> => pos !== undefined)

    const bounds = calculateGridBounds(allPositions)

    // Position each node according to AVIF coordinates with mirroring
    validatedTree.perks.forEach(perk => {
      if (perk.position) {
        const canvasPos = avifToCanvasPositionMirrored(
          perk.position,
          bounds,
          config
        )
        positions.set(perk.edid, canvasPos)
      }
    })

    return positions
  }, [validatedTree])

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!validatedTree) return []

    const nodes = validatedTree.perks.map(perk => {
      const perkId = perk.edid
      const position = nodePositions.get(perkId) || { x: 0, y: 0 }
      const hasChildren = perk.connections?.children?.length > 0 || false
      const isRoot = perk.connections?.parents?.length === 0 || false

      return {
        id: perkId,
        type: 'perkNode',
        position: { x: position.x, y: position.y },
        data: {
          ...perk,
          selected: false, // Will be updated via useEffect
          hasChildren,
          isRoot,
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

      if (perk.connections?.children) {
        perk.connections.children.forEach(childId => {
          // Skip self-references
          if (childId === perkId) return

          // Check if child exists in our tree
          const childExists = validatedTree.perks.some(p => p.edid === childId)
          if (childExists) {
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
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.2,
          maxZoom: 1.5,
        })
      }, 200)
    }
  }, [validatedTree?.treeId, reactFlowInstance])

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  )

  if (!validatedTree) {
    return (
      <div
        className={`flex items-center justify-center p-8 text-muted-foreground ${
          className || ''
        }`}
      >
        <p>
          {tree
            ? 'Invalid perk tree data'
            : 'Select a skill to view its perk tree'}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`w-full h-full bg-background rounded-lg border overflow-auto ${
        className || ''
      }`}
    >
      <div className="p-4 border-b bg-muted/20">
        <h3 className="text-sm font-medium text-muted-foreground">
          Experimental AVIF Grid Canvas (Mirrored)
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Bottom-up tree with left-right mirroring using AVIF coordinates
        </p>
      </div>

      <div
        className="w-full h-full min-h-[400px]"
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
    </div>
  )
}
