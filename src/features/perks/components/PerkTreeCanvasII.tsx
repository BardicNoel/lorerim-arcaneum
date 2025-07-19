import React, { useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { PerkNode } from "./PerkNode";
import type { PerkTree, PerkNode as PerkNodeType, PerkNodeData } from "../types";
import { validatePerkTreeSafe } from "../utils";

interface PerkTreeCanvasIIProps {
  tree: PerkTree | undefined;
  onTogglePerk: (perkId: string) => void;
  onRankChange?: (perkId: string, newRank: number) => void;
  selectedPerks: PerkNodeType[];
}

// Layout configuration
interface LayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  padding: number;
  gridScaleX: number;
  gridScaleY: number;
}

// Layout node with original position tracking
interface LayoutNode {
  id: string;
  x: number; // Canvas X position (px)
  y: number; // Canvas Y position (px)
  width: number; // Computed from name length + padding
  height: number; // Fixed height
  originalX: number; // Grid-mapped X before forces
  originalY: number; // Grid-mapped Y before forces
}

// Perk record for algorithm input
interface PerkRecord {
  edid: string;
  name: string;
  position: {
    x: number; // X grid + offset
    y: number; // Y grid + offset
    horizontal: number;
    vertical: number;
  };
  connection: {
    parents: string[];
    children: string[];
  };
}

// 1️⃣ Measure Node Sizes
function measureNodeSizes(
  perks: PerkRecord[],
  font: string = "12px system-ui",
  textPadding: number = 24
): Map<string, number> {
  const sizes = new Map<string, number>();
  
  // Create a temporary canvas to measure text width accurately
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (context) {
    context.font = font;
    
    perks.forEach(perk => {
      const textWidth = context.measureText(perk.name).width;
      const totalWidth = Math.max(textWidth + textPadding, 140); // Minimum width of 140px
      sizes.set(perk.edid, totalWidth);
    });
  } else {
    // Fallback to estimation if canvas is not available
    perks.forEach(perk => {
      const estimatedWidth = Math.max(perk.name.length * 8 + textPadding, 140);
      sizes.set(perk.edid, estimatedWidth);
    });
  }
  
  console.log('Node sizes measured:', Array.from(sizes.entries()).map(([id, width]) => `${id}: ${width}px`));
  
  return sizes;
}

// 2️⃣ Scale Positions (Grid → Canvas)
function scalePositions(
  perks: PerkRecord[],
  sizes: Map<string, number>,
  config: LayoutConfig
): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  
  // Find min and max Y for proper scaling
  const minY = Math.min(...perks.map(p => p.position.y));
  const maxY = Math.max(...perks.map(p => p.position.y));
  const yRange = maxY - minY;
  
  // Find min and max X for X-axis inversion
  const minX = Math.min(...perks.map(p => p.position.x));
  const maxX = Math.max(...perks.map(p => p.position.x));
  const xRange = maxX - minX;
  
  console.log(`Y range: ${minY} to ${maxY} (range: ${yRange})`);
  console.log(`X range: ${minX} to ${maxX} (range: ${xRange})`);
  
  perks.forEach(perk => {
    // X-axis: inverted to match expected layout
    const normalizedX = (perk.position.x - minX) / xRange;
    const invertedCanvasX = (1 - normalizedX) * xRange * config.gridScaleX;
    
    // Y-axis: inverted as per specification (maxY - position.y)
    const canvasY = (maxY - perk.position.y) * config.gridScaleY;
    
    console.log(`${perk.edid}: grid (${perk.position.x},${perk.position.y}), canvas (${invertedCanvasX.toFixed(0)},${canvasY.toFixed(0)})`);
    
    nodes.push({
      id: perk.edid,
      x: invertedCanvasX,
      y: canvasY,
      width: sizes.get(perk.edid) || config.nodeWidth,
      height: config.nodeHeight,
      originalX: invertedCanvasX,
      originalY: canvasY,
    });
  });
  
  return nodes;
}

// 3️⃣ Build Tree Map
function buildTreeMap(perks: PerkRecord[]): Map<string, string[]> {
  const treeMap = new Map<string, string[]>();
  
  perks.forEach(perk => {
    treeMap.set(perk.edid, perk.connection.children);
  });
  
  return treeMap;
}

// 4️⃣ Parent-Centering Layout
function centerSubtrees(
  nodes: LayoutNode[],
  tree: Map<string, string[]>,
  config: LayoutConfig
): LayoutNode[] {
  console.log('=== STARTING PARENT-CENTERING LAYOUT ===');
  
  // Create a map for quick node lookup
  const nodeMap = new Map<string, LayoutNode>();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // Find root nodes (nodes with no parents)
  const rootNodes: string[] = [];
  const allChildren = new Set<string>();
  
  // Collect all children
  tree.forEach((children, parentId) => {
    children.forEach(childId => allChildren.add(childId));
  });
  
  // Find nodes that are not children of any other node
  nodeMap.forEach((node, nodeId) => {
    if (!allChildren.has(nodeId)) {
      rootNodes.push(nodeId);
    }
  });
  
  console.log(`Found ${rootNodes.length} root nodes:`, rootNodes);
  
  // Helper function to center a parent under its children (conservative approach)
  const centerParentUnderChildren = (parentId: string): boolean => {
    const parent = nodeMap.get(parentId);
    if (!parent) return false;
    
    const children = tree.get(parentId) || [];
    const validChildren = children.filter(childId => nodeMap.has(childId));
    
    if (validChildren.length === 0) return false;
    
    // Calculate the center of all children
    let totalX = 0;
    let childCount = 0;
    
    validChildren.forEach(childId => {
      const child = nodeMap.get(childId);
      if (child) {
        totalX += child.x + (child.width / 2);
        childCount++;
      }
    });
    
    if (childCount > 0) {
      const childrenCenterX = totalX / childCount;
      const newParentX = childrenCenterX - (parent.width / 2);
      
      // Only center if the move is reasonable (not too far from original position)
      const maxMoveDistance = config.horizontalSpacing * 2;
      const currentCenterX = parent.x + (parent.width / 2);
      const moveDistance = Math.abs(childrenCenterX - currentCenterX);
      
      if (moveDistance <= maxMoveDistance) {
        console.log(`Centering ${parentId} under ${childCount} children: x=${parent.x.toFixed(0)} -> ${newParentX.toFixed(0)} (move: ${moveDistance.toFixed(0)}px)`);
        parent.x = newParentX;
        parent.originalX = newParentX;
        return true;
      } else {
        console.log(`Skipping centering for ${parentId}: move too large (${moveDistance.toFixed(0)}px > ${maxMoveDistance}px)`);
        return false;
      }
    }
    
    return false;
  };
  
  // Process nodes from leaves to roots (bottom-up), but be more conservative
  const processed = new Set<string>();
  const queue: string[] = [];
  
  // Start with leaf nodes (nodes with no children)
  nodeMap.forEach((node, nodeId) => {
    const children = tree.get(nodeId) || [];
    const validChildren = children.filter(childId => nodeMap.has(childId));
    
    if (validChildren.length === 0) {
      queue.push(nodeId);
    }
  });
  
  console.log(`Starting with ${queue.length} leaf nodes`);
  
  // Process queue with limited centering
  let centeringCount = 0;
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    
    if (processed.has(nodeId)) continue;
    processed.add(nodeId);
    
    // Try to center this node under its children (if any)
    const wasCentered = centerParentUnderChildren(nodeId);
    if (wasCentered) centeringCount++;
    
    // Add parents to queue
    const parents = Array.from(tree.entries())
      .filter(([parentId, children]) => children.includes(nodeId))
      .map(([parentId]) => parentId);
    
    parents.forEach(parentId => {
      if (!processed.has(parentId)) {
        // Check if all children of this parent have been processed
        const parentChildren = tree.get(parentId) || [];
        const validParentChildren = parentChildren.filter(childId => nodeMap.has(childId));
        const allChildrenProcessed = validParentChildren.every(childId => processed.has(childId));
        
        if (allChildrenProcessed) {
          queue.push(parentId);
        }
      }
    });
  }
  
  console.log(`Processed ${processed.size} nodes, centered ${centeringCount} nodes`);
  
  return Array.from(nodeMap.values());
}

// 5️⃣ Force-Field Collision Resolver
function resolveCollisions(
  nodes: LayoutNode[],
  config: LayoutConfig
): LayoutNode[] {
  console.log('=== STARTING COLLISION RESOLUTION ===');
  
  // Group nodes by Y level (with some tolerance)
  const yTolerance = config.verticalSpacing * 0.3;
  const yGroups = new Map<number, LayoutNode[]>();
  
  nodes.forEach(node => {
    const yLevel = Math.round(node.y / yTolerance) * yTolerance;
    if (!yGroups.has(yLevel)) {
      yGroups.set(yLevel, []);
    }
    yGroups.get(yLevel)!.push(node);
  });
  
  console.log(`Grouped nodes into ${yGroups.size} Y levels`);
  
  // Only resolve horizontal collisions within each Y level
  yGroups.forEach((levelNodes, yLevel) => {
    if (levelNodes.length <= 1) return;
    
    console.log(`Processing Y level ${yLevel} with ${levelNodes.length} nodes`);
    
    // Sort nodes by X position
    levelNodes.sort((a, b) => a.x - b.x);
    
    // Check for horizontal overlaps and resolve them
    for (let i = 0; i < levelNodes.length - 1; i++) {
      const nodeA = levelNodes[i];
      const nodeB = levelNodes[i + 1];
      
      const nodeARight = nodeA.x + nodeA.width;
      const nodeBLeft = nodeB.x;
      const requiredSpacing = config.horizontalSpacing;
      
      if (nodeARight + requiredSpacing > nodeBLeft) {
        // Nodes overlap or are too close
        const overlap = (nodeARight + requiredSpacing) - nodeBLeft;
        const pushDistance = overlap / 2;
        
        console.log(`Resolving overlap between ${nodeA.id} and ${nodeB.id}: pushing ${pushDistance.toFixed(0)}px`);
        
        // Push nodes apart
        nodeA.x -= pushDistance;
        nodeB.x += pushDistance;
      }
    }
  });
  
  // Apply gentle attraction back to original positions (much weaker)
  const attractionForce = 0.05; // Much weaker attraction
  
  nodes.forEach(node => {
    const deltaX = node.originalX - node.x;
    const deltaY = node.originalY - node.y;
    
    node.x += deltaX * attractionForce;
    node.y += deltaY * attractionForce;
  });
  
  console.log('Collision resolution completed');
  
  return nodes;
}

// 6️⃣ Final Row Alignment
function snapYToGrid(nodes: LayoutNode[], config: LayoutConfig): LayoutNode[] {
  return nodes.map(node => ({
    ...node,
    y: Math.round(node.y / config.gridScaleY) * config.gridScaleY,
  }));
}

// 📦 Full Layout Function
function layoutPerkTree(perks: PerkRecord[], config: LayoutConfig): LayoutNode[] {
  try {
    console.log('=== STARTING PERK TREE LAYOUT ===');
    console.log(`Total perks to layout: ${perks.length}`);
    console.log('Layout config:', config);
    
    if (perks.length === 0) {
      console.log('No perks to layout, returning empty array');
      return [];
    }
    
    const sizes = measureNodeSizes(perks);
    console.log('Node sizes measured');
    
    const scaledNodes = scalePositions(perks, sizes, config);
    console.log('Positions scaled to canvas');
    console.log('Initial positions:', scaledNodes.map(n => `${n.id}: (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`));
    
    const treeMap = buildTreeMap(perks);
    console.log('Tree map built');
    console.log('Tree structure:', Array.from(treeMap.entries()).map(([parent, children]) => `${parent} -> [${children.join(', ')}]`));
    
    const centeredNodes = centerSubtrees(scaledNodes, treeMap, config);
    console.log('Subtrees centered');
    console.log('After centering:', centeredNodes.map(n => `${n.id}: (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`));
    
    const collisionResolvedNodes = resolveCollisions(centeredNodes, config);
    console.log('Collisions resolved');
    console.log('After collision resolution:', collisionResolvedNodes.map(n => `${n.id}: (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`));
    
    const finalNodes = snapYToGrid(collisionResolvedNodes, config);
    console.log('Y positions snapped to grid');
    console.log('Final positions:', finalNodes.map(n => `${n.id}: (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`));
    
    return finalNodes;
  } catch (error) {
    console.error('Error in layout algorithm:', error);
    // Fallback to simple positioning if algorithm fails
    return perks.map(perk => ({
      id: perk.edid,
      x: perk.position.x * config.gridScaleX,
      y: perk.position.y * config.gridScaleY,
      width: config.nodeWidth,
      height: config.nodeHeight,
      originalX: perk.position.x * config.gridScaleX,
      originalY: perk.position.y * config.gridScaleY,
    }));
  }
}

// Convert PerkTree to PerkRecord format
function convertToPerkRecords(tree: PerkTree): PerkRecord[] {
  return tree.perks.map(perk => ({
    edid: perk.edid,
    name: perk.name,
    position: perk.position,
    connection: perk.connections,
  }));
}

// Create a wrapper component that receives callbacks
const createPerkNodeComponent = (onTogglePerk?: (perkId: string) => void, onRankChange?: (perkId: string, newRank: number) => void) => {
  return (props: any) => <PerkNode {...props} onTogglePerk={onTogglePerk} onRankChange={onRankChange} />;
};

// Memoized node types to prevent React Flow warnings
const createNodeTypes = (onTogglePerk?: (perkId: string) => void, onRankChange?: (perkId: string, newRank: number) => void): NodeTypes => ({
  perkNode: createPerkNodeComponent(onTogglePerk, onRankChange),
});

export function PerkTreeCanvasII({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
}: PerkTreeCanvasIIProps) {
  // React Flow instance
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  
  // Validate tree data
  const validatedTree = useMemo(() => {
    if (!tree) return null;
    
    const validation = validatePerkTreeSafe(tree);
    if (!validation.success) {
      console.error('Invalid perk tree data:', validation.error);
      return null;
    }
    
    return validation.data;
  }, [tree]);
  
  // Create node types with callbacks
  const nodeTypes: NodeTypes = useMemo(() => 
    createNodeTypes(onTogglePerk, onRankChange), 
    [onTogglePerk, onRankChange]
  );
  
  // Layout configuration
  const layoutConfig: LayoutConfig = useMemo(() => ({
    nodeWidth: 140,
    nodeHeight: 80,
    horizontalSpacing: 160, // Reduced from 210 to be more conservative
    verticalSpacing: 120, // Reduced from 130 to be more conservative
    padding: 50,
    gridScaleX: 180, // Reduced from 200 to be more conservative
    gridScaleY: 120, // Reduced from 150 to be more conservative
  }), []);
  
  // Calculate node positions using the new algorithm
  const layoutNodes = useMemo(() => {
    if (!validatedTree) return [];
    
    const perkRecords = convertToPerkRecords(validatedTree);
    return layoutPerkTree(perkRecords, layoutConfig);
  }, [validatedTree, layoutConfig]);

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!validatedTree || layoutNodes.length === 0) return [];
    
    return validatedTree.perks.map((perk) => {
      const perkId = perk.edid;
      const layoutNode = layoutNodes.find(n => n.id === perkId);
      const position = layoutNode ? { x: layoutNode.x, y: layoutNode.y } : { x: 0, y: 0 };
      
      // Determine if node has children and is root
      const hasChildren = perk.connections.children.length > 0;
      const isRoot = perk.connections.parents.length === 0;
      
      return {
        id: perkId,
        type: "perkNode",
        position,
        data: {
          ...perk,
          selected: false, // Will be updated via useEffect
          hasChildren: hasChildren,
          isRoot: isRoot,
        } as PerkNodeData,
      };
    });
  }, [validatedTree, layoutNodes]);

  // Create React Flow edges from connections array
  const initialEdges: Edge[] = useMemo(() => {
    if (!validatedTree) return [];
    
    const edges: Edge[] = [];
    
    validatedTree.perks.forEach((perk) => {
      const perkId = perk.edid;
      
      if (perk.connections.children.length > 0) {
        perk.connections.children.forEach((childId: string) => {
          // Skip self-references
          if (childId === perkId) return;
          
          // Check if child exists in our tree
          const childExists = validatedTree.perks.some(p => p.edid === childId);
          if (childExists) {
            edges.push({
              id: `${perkId}-${childId}`,
              source: perkId,
              target: childId,
              type: "straight",
              style: { 
                stroke: "#d4af37", 
                strokeWidth: 3,
                opacity: 0.8
              },
            });
          }
        });
      }
    });
    
    return edges;
  }, [validatedTree]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when tree changes
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update node selection state
  React.useEffect(() => {
    if (!validatedTree) return;
    
    setNodes((currentNodes) => 
      currentNodes.map((node) => {
        const selectedPerk = selectedPerks.find(p => p.edid === node.id);
        const isSelected = selectedPerk !== undefined;
        
        return {
          ...node,
          data: {
            ...node.data,
            selected: isSelected,
            currentRank: (selectedPerk as PerkNodeData)?.currentRank || 0,
          } as PerkNodeData,
        };
      })
    );
  }, [selectedPerks, setNodes, validatedTree]);

  // Update edges when tree changes
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Fit view when tree changes
  React.useEffect(() => {
    if (validatedTree && nodes.length > 0 && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.2,
          maxZoom: 1.5
        });
      }, 200);
    }
  }, [validatedTree?.treeId, reactFlowInstance]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!validatedTree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">
          {tree ? 'Invalid perk tree data' : 'Select a skill to view its perk tree'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background rounded-lg border" style={{ zIndex: 1 }}>
      {/* Algorithm version indicator */}
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
          maxZoom: 1.5
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
} 