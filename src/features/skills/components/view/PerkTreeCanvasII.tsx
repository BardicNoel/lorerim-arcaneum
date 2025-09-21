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
  loadSavedTreePositions,
  plotPositionedTree,
  type PositionedTreeConfig,
} from '../../utils/positionedTreePlotter'
import type { SavedTreePositions } from '../../utils/positionUtils'
import { PerkNode } from './PerkNode'
import { convertToPerkRecords, layoutPerkTree } from './perkTreeLayout'
import type { LayoutConfig } from './PerkTreeLayoutTypes'

const nodeTypes: NodeTypes = {
  perkNode: (props: any) => (
    <PerkNode
      {...props}
      onTogglePerk={props.data.onTogglePerk}
      onRankChange={props.data.onRankChange}
    />
  ),
}

interface PerkTreeCanvasIIProps {
  tree: PerkTree | undefined
  onTogglePerk: (perkId: string) => void
  onRankChange?: (perkId: string, newRank: number) => void
  selectedPerks: PerkNodeType[]
  currentSkillLevel?: number // Current total skill level for this skill tree
}

export function PerkTreeCanvasII({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
  currentSkillLevel,
}: PerkTreeCanvasIIProps) {
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null)
  const [savedPositions, setSavedPositions] =
    React.useState<SavedTreePositions | null>(null)
  const [isLoadingPositions, setIsLoadingPositions] = React.useState(false)

  const onNodeDragStop = React.useCallback((event: any, node: Node) => {}, [])

  const validatedTree = useMemo(() => {
    if (!tree) return null
    const validation = validatePerkTreeSafe(tree)
    if (!validation.success) {
      console.error('Invalid perk tree data:', validation.error)
      return null
    }
    return validation.data
  }, [tree])

  // Load saved positions when tree changes
  React.useEffect(() => {
    if (!validatedTree) {
      setSavedPositions(null)
      return
    }

    setIsLoadingPositions(true)
    loadSavedTreePositions(validatedTree.treeId)
      .then(positions => {
        setSavedPositions(positions)
      })
      .catch(error => {
        setSavedPositions(null)
      })
      .finally(() => {
        setIsLoadingPositions(false)
      })
  }, [validatedTree?.treeId])

  const layoutConfig: LayoutConfig = useMemo(
    () => ({
      nodeWidth: 140,
      nodeHeight: 80,
      horizontalSpacing: 40,
      verticalSpacing: 200,
      padding: 50,
      gridScaleX: 180,
      gridScaleY: 120,
    }),
    []
  )

  // Configuration for the positioned tree plotter
  const positionedTreeConfig: Partial<PositionedTreeConfig> = useMemo(
    () => ({
      nodeWidth: 140,
      nodeHeight: 80,
      horizontalSpacing: 40,
      verticalSpacing: 200,
      padding: 50,
      gridScaleX: 180,
      gridScaleY: 120,
    }),
    []
  )

  // Use positioned tree plotter if we have saved positions, otherwise fall back to original layout
  const layoutNodes = useMemo(() => {
    if (!validatedTree) return []

    if (savedPositions && !isLoadingPositions) {
      // Use the new positioned tree plotter
      const positions = plotPositionedTree(
        validatedTree,
        savedPositions,
        positionedTreeConfig
      )
      return Array.from(positions.entries()).map(([perkId, pos]) => ({
        id: perkId,
        x: pos.x,
        y: pos.y,
        width: positionedTreeConfig.nodeWidth || 140,
        height: positionedTreeConfig.nodeHeight || 80,
        originalX: pos.x,
        originalY: pos.y,
      }))
    } else {
      // Fall back to original layout algorithm
      const perkRecords = convertToPerkRecords(validatedTree)
      return layoutPerkTree(perkRecords, layoutConfig)
    }
  }, [
    validatedTree,
    layoutConfig,
    savedPositions,
    isLoadingPositions,
    positionedTreeConfig,
  ])

  // Create base nodes without selection data (stable)
  const baseNodes: Node[] = useMemo(() => {
    if (!validatedTree || layoutNodes.length === 0) return []
    return validatedTree.perks.map(perk => {
      const perkId = perk.edid
      const layoutNode = layoutNodes.find(n => n.id === perkId)
      const position = layoutNode
        ? { x: layoutNode.x, y: layoutNode.y }
        : { x: 0, y: 0 }
      const hasChildren = perk.connections.children.length > 0
      const isRoot = perk.connections.parents.length === 0

      return {
        id: perkId,
        type: 'perkNode',
        position,
        draggable: false,
        data: {
          ...perk,
          hasChildren: hasChildren,
          isRoot: isRoot,
          currentSkillLevel: currentSkillLevel,
          onTogglePerk,
          onRankChange,
        } as PerkNodeData & {
          onTogglePerk: (perkId: string) => void
          onRankChange?: (perkId: string, newRank: number) => void
        },
      }
    })
  }, [
    validatedTree,
    layoutNodes,
    onTogglePerk,
    onRankChange,
    currentSkillLevel,
  ])

  // Update nodes with current selection data
  const nodes = useMemo(() => {
    return baseNodes.map(node => {
      const perkData = selectedPerks.find(p => p.edid === node.id)
      const isSelected = perkData?.selected || false
      const currentRank = perkData?.currentRank || 0

      return {
        ...node,
        data: {
          ...node.data,
          selected: isSelected,
          currentRank: currentRank,
        },
      }
    })
  }, [baseNodes, selectedPerks])
  const initialEdges: Edge[] = useMemo(() => {
    if (!validatedTree) return []
    const edges: Edge[] = []
    validatedTree.perks.forEach(perk => {
      const perkId = perk.edid
      if (perk.connections.children.length > 0) {
        perk.connections.children.forEach((childId: string) => {
          if (childId === perkId) return
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
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([])
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState([])

  // Update flow nodes when our computed nodes change
  React.useEffect(() => {
    setFlowNodes(nodes)
  }, [nodes, setFlowNodes])

  // Update flow edges when our computed edges change
  React.useEffect(() => {
    setFlowEdges(initialEdges)
  }, [initialEdges, setFlowEdges])
  React.useEffect(() => {
    if (validatedTree && flowNodes.length > 0 && reactFlowInstance) {
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
    (params: Connection) => setFlowEdges(eds => addEdge(params, eds)),
    [setFlowEdges]
  )
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
  }, [])
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.stopPropagation()
  }, [])
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
      style={{ zIndex: Z_INDEX.CONTENT, position: 'relative' }}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
          {isLoadingPositions
            ? 'Loading Positions...'
            : savedPositions
              ? 'Positioned Tree'
              : 'Algorithm v2'}
        </div>
      </div>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
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
        onNodeDragStop={onNodeDragStop}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={e => e.preventDefault()} // Disable double-click to zoom
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={true}
        style={{
          backgroundColor: 'hsl(var(--background))',
          zIndex: 1, // Ensure ReactFlow doesn't create conflicting stacking context
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
