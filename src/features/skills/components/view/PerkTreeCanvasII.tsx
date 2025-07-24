import React, { useCallback, useEffect, useMemo } from 'react'
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
import type { LayoutConfig } from './PerkTreeLayoutTypes'
import { convertToPerkRecords, layoutPerkTree } from './perkTreeLayout'

const createStableNodeTypes = () => {
  let currentCallbacks = {
    onTogglePerk: undefined as ((perkId: string) => void) | undefined,
    onRankChange: undefined as
      | ((perkId: string, newRank: number) => void)
      | undefined,
  }
  const nodeTypes: NodeTypes = {
    perkNode: (props: any) => (
      <PerkNode
        {...props}
        onTogglePerk={currentCallbacks.onTogglePerk}
        onRankChange={currentCallbacks.onRankChange}
      />
    ),
  }
  return {
    nodeTypes,
    updateCallbacks: (callbacks: typeof currentCallbacks) => {
      currentCallbacks = callbacks
    },
  }
}
const stableNodeTypesInstance = createStableNodeTypes()

interface PerkTreeCanvasIIProps {
  tree: PerkTree | undefined
  onTogglePerk: (perkId: string) => void
  onRankChange?: (perkId: string, newRank: number) => void
  selectedPerks: PerkNodeType[]
}

export function PerkTreeCanvasII({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
}: PerkTreeCanvasIIProps) {
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance | null>(null)
  useEffect(() => {
    stableNodeTypesInstance.updateCallbacks({
      onTogglePerk,
      onRankChange,
    })
  }, [onTogglePerk, onRankChange])
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
  const { nodeTypes } = stableNodeTypesInstance
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
  const layoutNodes = useMemo(() => {
    if (!validatedTree) return []
    const perkRecords = convertToPerkRecords(validatedTree)
    return layoutPerkTree(perkRecords, layoutConfig)
  }, [validatedTree, layoutConfig])
  const initialNodes: Node[] = useMemo(() => {
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
        draggable: true,
        data: {
          ...perk,
          selected: false,
          hasChildren: hasChildren,
          isRoot: isRoot,
        } as PerkNodeData,
      }
    })
  }, [validatedTree, layoutNodes])
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  React.useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])
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
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])
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
      style={{ zIndex: 1 }}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      <div className="absolute top-2 right-2 z-10">
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
          Algorithm v2
        </div>
      </div>
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
        onNodeDragStop={onNodeDragStop}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={true}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
