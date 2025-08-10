import { Z_INDEX } from '@/lib/constants'
import React, { useCallback, useMemo, useState } from 'react'
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
} from '../../utils/avifGridUtils'
import { loadSavedTreePositions } from '../../utils/positionedTreePlotter'
import {
  type SavedTreePositions,
  downloadPositionsAsJson,
  loadTreePositions,
  saveTreePositions,
} from '../../utils/positionUtils'
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

// Enhanced grid configuration for better spacing
// Based on PerkNode actual dimensions: minWidth: 140px + padding + borders
const ENHANCED_GRID_CONFIG = {
  // cellWidth: 200, // Increased from 200 to accommodate node width + spacing
  // cellHeight: 120, // Increased from 120 to accommodate node height + spacing
  // nodeWidth: 140, // Increased from 140 to account for padding and borders
  // nodeHeight: 80, // Increased from 80 to account for padding and borders
  // padding: 80, // Increased from 50 for better edge spacing
  // gridGap: 40, // Increased from 20 for better separation

  cellWidth: 240,
  cellHeight: 140,
  nodeWidth: 140,
  nodeHeight: 80,
  gridGap: 40,
  padding: 80,
}

/**
 * Convert AVIF grid coordinates to canvas pixel coordinates with mirroring
 * This creates a bottom-up, left-right mirrored tree layout
 */
function avifToCanvasPositionMirrored(
  position: { x: number; y: number; horizontal: number; vertical: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  config: typeof ENHANCED_GRID_CONFIG
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

/**
 * Convert canvas pixel coordinates back to AVIF grid coordinates
 */
function canvasToAvifPosition(
  pixelX: number,
  pixelY: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  config: typeof ENHANCED_GRID_CONFIG
): CanvasPosition {
  // Remove padding offset
  const adjustedX = pixelX - config.padding
  const adjustedY = pixelY - config.padding

  // Calculate grid position
  const gridX = Math.floor(adjustedX / (config.cellWidth + config.gridGap))
  const gridY = Math.floor(adjustedY / (config.cellHeight + config.gridGap))

  // Calculate sub-cell offset
  const baseX =
    gridX * config.cellWidth +
    gridX * config.gridGap +
    config.padding +
    config.cellWidth / 2

  const baseY =
    gridY * config.cellHeight +
    gridY * config.gridGap +
    config.padding +
    config.cellHeight / 2

  const offsetX = pixelX - baseX
  const offsetY = pixelY - baseY

  // Convert to normalized sub-cell coordinates
  const maxOffsetX = config.cellWidth / 2 - config.nodeWidth / 2
  const maxOffsetY = config.cellHeight / 2 - config.nodeHeight / 2

  const horizontal = Math.max(-1, Math.min(1, offsetX / maxOffsetX))
  const vertical = Math.max(-1, Math.min(1, offsetY / maxOffsetY))

  return {
    x: pixelX,
    y: pixelY,
    gridX,
    gridY,
    horizontal,
    vertical,
  }
}

/**
 * Calculate a default position for perks without any position data
 * Places them in a grid pattern to avoid overlap
 */
function calculateDefaultPosition(
  perkIndex: number,
  totalPerks: number,
  config: typeof ENHANCED_GRID_CONFIG
): CanvasPosition {
  // Calculate grid dimensions for default positioning
  const gridSize = Math.ceil(Math.sqrt(totalPerks))
  const row = Math.floor(perkIndex / gridSize)
  const col = perkIndex % gridSize

  // Position in a grid pattern starting from top-left
  const x =
    col * (config.cellWidth + config.gridGap) +
    config.padding +
    config.cellWidth / 2
  const y =
    row * (config.cellHeight + config.gridGap) +
    config.padding +
    config.cellHeight / 2

  return {
    x,
    y,
    gridX: col,
    gridY: row,
    horizontal: 0,
    vertical: 0,
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

  // State for saved positions
  const [savedPositions, setSavedPositions] = useState<
    Map<string, CanvasPosition>
  >(new Map())
  const [isLoadingPositions, setIsLoadingPositions] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [gridBounds, setGridBounds] = useState<{
    minX: number
    maxX: number
    minY: number
    maxY: number
  } | null>(null)

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

  // Load saved positions when tree changes
  React.useEffect(() => {
    if (!validatedTree) {
      setSavedPositions(new Map())
      return
    }

    console.log('Loading saved positions for tree:', validatedTree.treeId)
    console.log('Tree perks count:', validatedTree.perks.length)
    console.log(
      'Tree perks:',
      validatedTree.perks.map(p => ({ edid: p.edid, name: p.name }))
    )

    setIsLoadingPositions(true)
    loadSavedTreePositions(validatedTree.treeId)
      .then(savedData => {
        console.log(
          'Loaded saved positions:',
          savedData ? 'Found' : 'Not found'
        )
        if (savedData) {
          const loadedPositions = loadTreePositions(
            validatedTree.treeId,
            savedData
          )
          console.log('Loaded positions count:', loadedPositions.size)
          console.log(
            'Loaded positions keys:',
            Array.from(loadedPositions.keys())
          )
          setSavedPositions(loadedPositions)
        } else {
          setSavedPositions(new Map())
        }
      })
      .catch(error => {
        console.warn('Failed to load saved positions:', error)
        setSavedPositions(new Map())
      })
      .finally(() => {
        setIsLoadingPositions(false)
      })
  }, [validatedTree?.treeId])

  // Create node types with callbacks
  const nodeTypes: NodeTypes = useMemo(
    () => createNodeTypes(onTogglePerk, onRankChange),
    [onTogglePerk, onRankChange]
  )

  // Calculate node positions using saved positions and fallback to AVIF or default
  const nodePositions = useMemo(() => {
    if (!validatedTree || isLoadingPositions)
      return new Map<string, CanvasPosition>()

    const positions = new Map<string, CanvasPosition>()

    // Extract all positions and calculate grid bounds for AVIF positioning
    const allPositions = validatedTree.perks
      .map(perk => perk.position)
      .filter((pos): pos is NonNullable<typeof pos> => pos !== undefined)

    let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    if (allPositions.length > 0) {
      bounds = calculateGridBounds(allPositions)
    }

    // Track perks without positional data for default positioning
    let perksWithoutPosition = 0

    // Position each node
    validatedTree.perks.forEach(perk => {
      // First, try to use saved position from positional file
      const savedPos = savedPositions.get(perk.edid)
      if (savedPos) {
        positions.set(perk.edid, savedPos)
        return
      }

      // Second, try to use embedded AVIF position
      if (perk.position) {
        const canvasPos = avifToCanvasPositionMirrored(
          perk.position,
          bounds,
          ENHANCED_GRID_CONFIG
        )
        positions.set(perk.edid, canvasPos)
        return
      }

      // Finally, use default position for perks without any position data
      const defaultPos = calculateDefaultPosition(
        perksWithoutPosition,
        validatedTree.perks.length,
        ENHANCED_GRID_CONFIG
      )
      positions.set(perk.edid, defaultPos)
      perksWithoutPosition++
    })

    return positions
  }, [validatedTree, savedPositions, isLoadingPositions])

  // Calculate positioning statistics for debug display
  const positioningStats = useMemo(() => {
    if (!validatedTree) return { saved: 0, avif: 0, default: 0, total: 0 }

    let saved = 0
    let avif = 0
    let defaultCount = 0

    // Debug: Check for Trapper perk specifically
    const trapperPerk = validatedTree.perks.find(
      p => p.edid === 'LoreRimTrapper_Rank1'
    )
    const poisonedClampsPerk = validatedTree.perks.find(
      p => p.edid === 'LoreRimTrapper_Rank2'
    )
    const saltOnWoundPerk = validatedTree.perks.find(
      p => p.edid === 'LoreRimTrapper_Rank3'
    )

    if (trapperPerk) {
      console.log('Found Trapper perk:', trapperPerk)
      const trapperSavedPos = savedPositions.get('LoreRimTrapper_Rank1')
      console.log('Trapper saved position:', trapperSavedPos)
      console.log('Trapper embedded position:', trapperPerk.position)
      console.log('Trapper connections:', trapperPerk.connections)
    } else {
      console.log('Trapper perk NOT found in tree!')
    }

    if (poisonedClampsPerk) {
      console.log('Found Poisoned Clamps perk:', poisonedClampsPerk)
      const poisonedClampsSavedPos = savedPositions.get('LoreRimTrapper_Rank2')
      console.log('Poisoned Clamps saved position:', poisonedClampsSavedPos)
      console.log(
        'Poisoned Clamps embedded position:',
        poisonedClampsPerk.position
      )
      console.log(
        'Poisoned Clamps connections:',
        poisonedClampsPerk.connections
      )
    } else {
      console.log('Poisoned Clamps perk NOT found in tree!')
    }

    if (saltOnWoundPerk) {
      console.log('Found Salt on the Wound perk:', saltOnWoundPerk)
      const saltOnWoundSavedPos = savedPositions.get('LoreRimTrapper_Rank3')
      console.log('Salt on the Wound saved position:', saltOnWoundSavedPos)
      console.log(
        'Salt on the Wound embedded position:',
        saltOnWoundPerk.position
      )
    } else {
      console.log('Salt on the Wound perk NOT found in tree!')
    }

    validatedTree.perks.forEach(perk => {
      const savedPos = savedPositions.get(perk.edid)
      if (savedPos) {
        saved++
      } else if (perk.position) {
        avif++
      } else {
        defaultCount++
      }
    })

    return {
      saved,
      avif,
      default: defaultCount,
      total: validatedTree.perks.length,
    }
  }, [validatedTree, savedPositions])

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!validatedTree || isLoadingPositions) return []

    const nodes = validatedTree.perks.map(perk => {
      const perkId = perk.edid
      const position = nodePositions.get(perkId) || { x: 0, y: 0 }
      const hasChildren = perk.connections?.children?.length > 0 || false
      const isRoot = perk.connections?.parents?.length === 0 || false

      // Check if this perk has no position data (will be draggable)
      const hasNoPosition = !savedPositions.get(perkId) && !perk.position

      // Debug: Check Trapper-related perks
      if (perkId.includes('LoreRimTrapper')) {
        console.log(`Node ${perkId} position:`, position)
        console.log(`Node ${perkId} hasChildren:`, hasChildren)
        console.log(`Node ${perkId} isRoot:`, isRoot)
        console.log(`Node ${perkId} hasNoPosition:`, hasNoPosition)
      }

      return {
        id: perkId,
        type: 'perkNode',
        position: { x: position.x, y: position.y },
        draggable: isEditMode || hasNoPosition, // Draggable in edit mode or if no position
        data: {
          ...perk,
          selected: false, // Will be updated via useEffect
          hasChildren,
          isRoot,
          hasNoPosition, // Flag for styling
        } as PerkNodeData,
      }
    })

    console.log('Total nodes created:', nodes.length)
    console.log(
      'Trapper-related nodes:',
      nodes.filter(n => n.id.includes('LoreRimTrapper'))
    )

    return nodes
  }, [
    validatedTree,
    nodePositions,
    isEditMode,
    isLoadingPositions,
    savedPositions,
  ])

  // Create React Flow edges from connections array
  const initialEdges: Edge[] = useMemo(() => {
    if (!validatedTree) return []

    const edges: Edge[] = []

    // Debug: Check Trapper connections specifically
    const trapperPerk = validatedTree.perks.find(
      p => p.edid === 'LoreRimTrapper_Rank1'
    )
    if (trapperPerk) {
      console.log(
        'Trapper children connections:',
        trapperPerk.connections?.children
      )
      trapperPerk.connections?.children?.forEach(childId => {
        const childExists = validatedTree.perks.some(p => p.edid === childId)
        console.log(`Trapper child ${childId} exists:`, childExists)
      })
    }

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

    console.log('Total edges created:', edges.length)
    console.log(
      'Edge connections:',
      edges.map(e => `${e.source} -> ${e.target}`)
    )

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
          draggable: isEditMode, // Update draggable state
          data: {
            ...node.data,
            selected: isSelected,
            currentRank: (selectedPerk as PerkNodeData)?.currentRank || 0,
          } as PerkNodeData,
        }
      })
    )
  }, [selectedPerks, setNodes, validatedTree, isEditMode])

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

  // Handle node drag stop to save new positions
  const onNodeDragStop = useCallback(
    (event: any, draggedNode: Node) => {
      if (!isEditMode || !gridBounds) return

      // Convert the new pixel position back to AVIF grid coordinates
      const newAvifPosition = canvasToAvifPosition(
        draggedNode.position.x,
        draggedNode.position.y,
        gridBounds,
        ENHANCED_GRID_CONFIG
      )

      // Update saved positions with new position
      const newPositions = new Map(savedPositions)
      newPositions.set(draggedNode.id, newAvifPosition)
      setSavedPositions(newPositions)
    },
    [isEditMode, savedPositions, gridBounds]
  )

  // Save current positions to JSON
  const handleSavePositions = useCallback(() => {
    if (!validatedTree) return

    const positionsToSave = new Map<string, CanvasPosition>()

    // Combine AVIF positions with any saved positions
    validatedTree.perks.forEach(perk => {
      const savedPos = savedPositions.get(perk.edid)
      const avifPos = nodePositions.get(perk.edid)

      if (savedPos) {
        positionsToSave.set(perk.edid, savedPos)
      } else if (avifPos) {
        positionsToSave.set(perk.edid, avifPos)
      }
    })

    const savedData = saveTreePositions(validatedTree, positionsToSave)
    downloadPositionsAsJson(savedData)
  }, [validatedTree, savedPositions, nodePositions])

  // Load positions from JSON file
  const handleLoadPositions = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file || !validatedTree) return

      const reader = new FileReader()
      reader.onload = e => {
        try {
          const savedData: SavedTreePositions = JSON.parse(
            e.target?.result as string
          )

          if (savedData.treeId === validatedTree.treeId) {
            const loadedPositions = loadTreePositions(
              validatedTree.treeId,
              savedData
            )
            setSavedPositions(loadedPositions)
          } else {
            alert('Position file does not match current tree!')
          }
        } catch (error) {
          alert('Error loading position file!')
          console.error('Error loading positions:', error)
        }
      }
      reader.readAsText(file)
    },
    [validatedTree]
  )

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode)
  }, [isEditMode])

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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Experimental AVIF Grid Canvas (Mirrored + Enhanced Spacing)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Bottom-up tree with left-right mirroring using enhanced grid
              spacing
              {savedPositions.size > 0 && !isLoadingPositions && (
                <span className="text-green-600 ml-2">
                  • Using saved positions
                </span>
              )}
            </p>
          </div>

          {/* Position Management Toolbar */}
          <div className="flex items-center gap-2">
            {isLoadingPositions && (
              <div className="flex items-center gap-2 px-3 py-1 text-xs text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                Loading positions...
              </div>
            )}

            {/* Debug Counters */}
            {!isLoadingPositions && positioningStats.total > 0 && (
              <div className="flex items-center gap-3 px-3 py-1 text-xs bg-muted/30 rounded border">
                <span className="text-green-600">
                  Saved: {positioningStats.saved}
                </span>
                <span className="text-blue-600">
                  AVIF: {positioningStats.avif}
                </span>
                <span className="text-red-600">
                  Default: {positioningStats.default}
                </span>
                <span className="text-muted-foreground">
                  Total: {positioningStats.total}
                </span>
              </div>
            )}

            <button
              onClick={toggleEditMode}
              className={`px-3 py-1 text-xs rounded border ${
                isEditMode
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              {isEditMode ? 'Exit Edit' : 'Edit Mode'}
            </button>

            <button
              onClick={handleSavePositions}
              className="px-3 py-1 text-xs rounded border bg-background text-foreground border-border hover:bg-muted"
            >
              Save Positions
            </button>

            <label className="px-3 py-1 text-xs rounded border bg-background text-foreground border-border hover:bg-muted cursor-pointer">
              Load Positions
              <input
                type="file"
                accept=".json"
                onChange={handleLoadPositions}
                className="hidden"
              />
            </label>
          </div>
        </div>
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
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          nodesDraggable={isEditMode}
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
