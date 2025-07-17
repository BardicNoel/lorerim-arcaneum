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
import type { PerkTree, PerkNode as PerkNodeType } from "../types";

interface PerkTreeCanvasProps {
  tree: PerkTree | undefined;
  onTogglePerk: (perkId: string) => void;
  onRankChange?: (perkId: string, newRank: number) => void;
  selectedPerks: PerkNodeType[];
}



// Tree node structure for building the forest
interface TreeNode {
  perk: PerkNodeType;
  level: number;
  children: string[]; // perkIds
  parents: string[]; // perkIds
}

// Build tree structure and assign levels based on PREREQUISITES with cycle detection
function buildTreeStructure(perks: PerkNodeType[]): Map<string, TreeNode> {
  const treeNodes = new Map<string, TreeNode>();
  
  // Initialize all nodes
  perks.forEach(perk => {
    treeNodes.set(perk.perkId, {
      perk,
      level: -1, // Unassigned
      children: [],
      parents: []
    });
  });
  
  // Step 1: Identify roots (nodes with no prerequisite perks)
  const roots: string[] = [];
  treeNodes.forEach((node, perkId) => {
    const hasPerkPrerequisites = (node.perk.prerequisites?.perks?.length || 0) > 0;
    if (!hasPerkPrerequisites) {
      roots.push(perkId);
      node.level = 0; // Root nodes are at level 0
    }
    
    // Debug: Log prerequisite analysis for each perk
    console.log(`Perk "${node.perk.perkName}" (${perkId}):`, {
      hasPrerequisites: hasPerkPrerequisites,
      prerequisitePerks: node.perk.prerequisites?.perks || [],
      isRoot: !hasPerkPrerequisites
    });
  });
  
  console.log('Root nodes identified:', {
    count: roots.length,
    roots: roots.map(id => treeNodes.get(id)!.perk.perkName)
  });
  
  // Step 2: Build parent-child relationships based on PREREQUISITES
  perks.forEach(perk => {
    const node = treeNodes.get(perk.perkId)!;
    
    // Find parents by looking at prerequisites
    if (perk.prerequisites?.perks) {
      perk.prerequisites.perks.forEach(prereq => {
        if (prereq.type === "PERK") {
          const parentId = prereq.id;
          // Skip self-references (perk referencing itself)
          if (parentId === perk.perkId) {
            console.log(`Skipping self-reference for "${perk.perkName}"`);
            return;
          }
          // Check if this parent exists in our tree
          if (treeNodes.has(parentId)) {
            node.parents.push(parentId);
            
            // Add this node as child to parent
            const parentNode = treeNodes.get(parentId)!;
            parentNode.children.push(perk.perkId);
            
            // Debug: Log parent-child relationships
            console.log(`Parent-Child: "${parentNode.perk.perkName}" -> "${perk.perkName}"`);
          } else {
            console.log(`Parent "${parentId}" not found in tree for "${perk.perkName}"`);
          }
        }
      });
    }
  });
  
  // Step 3: Detect cycles and multi-parent relationships
  const cycles = new Set<string>();
  const multiParentNodes = new Set<string>();
  
  treeNodes.forEach((node, perkId) => {
    if (node.parents.length > 1) {
      multiParentNodes.add(perkId);
      console.log(`Multi-parent node detected: "${node.perk.perkName}" has ${node.parents.length} parents`);
    }
  });
  
  // Detect cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function detectCycles(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      cycles.add(nodeId);
      console.log(`Cycle detected involving: "${treeNodes.get(nodeId)!.perk.perkName}"`);
      return true;
    }
    
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const node = treeNodes.get(nodeId)!;
    for (const childId of node.children) {
      if (detectCycles(childId)) {
        cycles.add(nodeId);
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  // Check for cycles starting from each root
  roots.forEach(rootId => {
    detectCycles(rootId);
  });
  
  console.log('Cycle detection results:', {
    cycles: Array.from(cycles).map(id => treeNodes.get(id)!.perk.perkName),
    multiParentNodes: Array.from(multiParentNodes).map(id => treeNodes.get(id)!.perk.perkName)
  });
  
  // Step 4: Assign levels with cycle protection and proper multi-parent handling
  const levelVisited = new Set<string>();
  const nodeLevels = new Map<string, number>();
  const maxLevel = 20; // Safety limit to prevent infinite loops
  
  function assignLevelsFromRoot(rootId: string) {
    const queue: { nodeId: string; level: number }[] = [{ nodeId: rootId, level: 0 }];
    
    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;
      
      // Safety check to prevent infinite loops
      if (level > maxLevel) {
        console.warn(`Level limit exceeded for node "${treeNodes.get(nodeId)!.perk.perkName}", stopping at level ${maxLevel}`);
        continue;
      }
      
      // For multi-parent nodes, use the deepest level from all parents
      const node = treeNodes.get(nodeId)!;
      const currentLevel = nodeLevels.get(nodeId) || -1;
      
      if (currentLevel >= 0) {
        // Node already has a level, use the shallowest one (lower level number)
        if (level < currentLevel) {
          nodeLevels.set(nodeId, level);
          node.level = level;
          console.log(`Node "${node.perk.perkName}" level updated from ${currentLevel} to ${level} (shallowest path)`);
        } else {
          continue; // Already processed at a better (shallowest) level
        }
      } else {
        // First time visiting this node
        nodeLevels.set(nodeId, level);
        node.level = level;
        levelVisited.add(nodeId);
        console.log(`Node "${node.perk.perkName}" assigned level ${level}`);
      }
      
      // Add children to queue with next level
      node.children.forEach(childId => {
        queue.push({ nodeId: childId, level: level + 1 });
      });
    }
  }
  
  // Start from all roots
  roots.forEach(rootId => {
    console.log(`Processing subtree from root: "${treeNodes.get(rootId)!.perk.perkName}"`);
    assignLevelsFromRoot(rootId);
  });
  

  
  // Ensure all nodes have levels assigned by processing in topological order
  let hasChanges = true;
  let iteration = 0;
  const maxIterations = 10; // Safety limit
  
  while (hasChanges && iteration < maxIterations) {
    hasChanges = false;
    iteration++;
    
    treeNodes.forEach((node, perkId) => {
      if (node.level < 0 && node.parents.length > 0) {
        const parentLevels = node.parents.map(parentId => treeNodes.get(parentId)!.level);
        const validParentLevels = parentLevels.filter(level => level >= 0);
        
        if (validParentLevels.length > 0) {
          // All parents have levels, we can assign this node's level
          const minParentLevel = Math.min(...validParentLevels);
          const expectedLevel = minParentLevel + 1;
          console.log(`Iteration ${iteration}: Node "${node.perk.perkName}" assigned level ${expectedLevel} from parents (${validParentLevels})`);
          node.level = expectedLevel;
          nodeLevels.set(perkId, expectedLevel);
          hasChanges = true;
        }
      }
    });
  }
  
  // Handle any remaining unassigned nodes as roots
  treeNodes.forEach((node, perkId) => {
    if (node.level < 0) {
      console.log(`Node "${node.perk.perkName}" still unassigned after ${iteration} iterations, treating as root`);
      node.level = 0;
      nodeLevels.set(perkId, 0);
    }
  });
  
  // Debug: Log level assignments for multi-parent nodes (only if there are issues)
  const multiParentNodeCount = Array.from(treeNodes.entries())
    .filter(([perkId, node]) => node.parents.length > 1).length;
  
  if (multiParentNodeCount > 0) {
    console.log(`Found ${multiParentNodeCount} multi-parent nodes`);
  }
  
  // Debug: Check for nodes that didn't get levels assigned
  const unassignedNodes = Array.from(treeNodes.entries())
    .filter(([perkId, node]) => node.level < 0)
    .map(([perkId, node]) => ({ perkId, perkName: node.perk.perkName, parents: node.parents }));
  
  if (unassignedNodes.length > 0) {
    console.log('Nodes without assigned levels:', unassignedNodes);
    console.log('This indicates disconnected subtrees or missing roots');
  }
  
  return treeNodes;
}

// Advanced layout algorithm that centers branches on parents and pushes terminal branches to sides
function calculateNodePositions(perks: PerkNodeType[]) {
  const positions = new Map<string, { x: number; y: number }>();
  
  if (perks.length === 0) return positions;
  
  // Build tree structure and assign levels
  const treeNodes = buildTreeStructure(perks);
  
  // Find max depth to identify terminal branches
  const maxDepth = Math.max(...Array.from(treeNodes.values()).map(node => node.level));
  console.log('Max depth:', maxDepth);
  
  // Detect if this tree has cycles or multi-parent relationships
  const hasCycles = Array.from(treeNodes.values()).some(node => node.parents.length > 1);
  const hasMultiParent = Array.from(treeNodes.values()).some(node => node.parents.length > 1);
  const needsExtraSpacing = hasCycles || hasMultiParent;
  
  console.log('Tree complexity:', {
    hasCycles,
    hasMultiParent,
    needsExtraSpacing
  });
  
  // Calculate spacing
  const nodeWidth = 140; // Increased from 120 to 140 for wider nodes
  const nodeHeight = 80;
  const baseHorizontalSpacing = nodeWidth * 0.33; // 33% of node width as base spacing
  const verticalSpacing = nodeHeight + 20; // Reduced to 20px between levels
  const padding = 50;
  
  // Calculate total height needed for the flipped tree
  const totalHeight = (maxDepth + 1) * verticalSpacing;
  
  // Calculate subtree widths and positions recursively with cycle detection
  const calculatedWidths = new Map<string, number>();
  
  // Function to calculate required spacing between two sibling nodes
  function calculateRequiredSpacing(leftNodeId: string, rightNodeId: string): number {
    const leftNode = treeNodes.get(leftNodeId)!;
    const rightNode = treeNodes.get(rightNodeId)!;
    
    // Check if either node has multiple parents that might need extra space
    const leftMultiParent = leftNode.parents.length > 1;
    const rightMultiParent = rightNode.parents.length > 1;
    
    // If either node is multi-parent, we might need extra space
    if (leftMultiParent || rightMultiParent) {
      // Check if the multi-parent node needs to be positioned between its parents
      const multiParentNode = leftMultiParent ? leftNode : rightNode;
      const parentPositions = multiParentNode.parents.map(parentId => positions.get(parentId)).filter(Boolean);
      
      if (parentPositions.length > 1) {
        // Calculate the spread of parent positions
        const parentXs = parentPositions.map(pos => pos!.x + (nodeWidth / 2));
        const minParentX = Math.min(...parentXs);
        const maxParentX = Math.max(...parentXs);
        const parentSpread = maxParentX - minParentX;
        
        // If parents are spread out, we need extra space to accommodate
        if (parentSpread > nodeWidth * 2) {
          console.log(`Multi-parent node "${multiParentNode.perk.perkName}" needs extra spacing: parent spread = ${parentSpread.toFixed(0)}px`);
          return Math.max(baseHorizontalSpacing, parentSpread * 0.3); // 30% of parent spread as extra space
        }
      }
    }
    
    // Default spacing for normal siblings
    return baseHorizontalSpacing;
  }
  
  function calculateSubtreeWidth(nodeId: string): number {
    // Check if we've already calculated this node's width
    if (calculatedWidths.has(nodeId)) {
      return calculatedWidths.get(nodeId)!;
    }
    
    const node = treeNodes.get(nodeId)!;
    if (node.children.length === 0) {
      const width = nodeWidth; // Terminal node
      calculatedWidths.set(nodeId, width);
      return width;
    }
    
    // Mark this node as being calculated to detect cycles
    calculatedWidths.set(nodeId, nodeWidth);
    
    // Calculate total width of all children with dynamic spacing
    let totalWidth = 0;
    let totalSpacing = 0;
    
    for (let i = 0; i < node.children.length; i++) {
      const childId = node.children[i];
      totalWidth += calculateSubtreeWidth(childId);
      
      // Add spacing between children (but not after the last child)
      if (i < node.children.length - 1) {
        const nextChildId = node.children[i + 1];
        totalSpacing += calculateRequiredSpacing(childId, nextChildId);
      }
    }
    
    const finalWidth = Math.max(nodeWidth, totalWidth + totalSpacing);
    calculatedWidths.set(nodeId, finalWidth);
    return finalWidth;
  }
  
  // Position nodes recursively, prioritizing straight vertical branches with cycle protection
  const positionedNodes = new Set<string>();
  const positioningStack = new Set<string>(); // Track nodes being positioned to detect cycles
  const maxPositioningDepth = 50; // Safety limit
  
  function positionSubtree(nodeId: string, centerX: number, level: number, depth: number = 0): { minX: number; maxX: number } {
    // Safety check to prevent infinite recursion
    if (depth > maxPositioningDepth) {
      console.warn(`Positioning depth limit exceeded for node "${treeNodes.get(nodeId)!.perk.perkName}", stopping at depth ${maxPositioningDepth}`);
      return { minX: centerX - (nodeWidth / 2), maxX: centerX + (nodeWidth / 2) };
    }
    
    // Check if we've already positioned this node to prevent cycles
    if (positionedNodes.has(nodeId)) {
      const existingPos = positions.get(nodeId);
      if (existingPos) {
        return { minX: existingPos.x, maxX: existingPos.x + nodeWidth };
      }
    }
    
    // Check for cycles in the positioning stack
    if (positioningStack.has(nodeId)) {
      console.warn(`Cycle detected in positioning for node "${treeNodes.get(nodeId)!.perk.perkName}", skipping to prevent infinite loop`);
      return { minX: centerX - (nodeWidth / 2), maxX: centerX + (nodeWidth / 2) };
    }
    
    const node = treeNodes.get(nodeId)!;
    // For positioning, use the recursive level to ensure proper vertical spacing
    // This creates the visual hierarchy we want (N1 -> N2 -> N3)
    const flippedLevel = maxDepth - level;
    const y = flippedLevel * verticalSpacing + padding;
    
    // Add to positioning stack to detect cycles
    positioningStack.add(nodeId);
    
    // Position this node
    positions.set(nodeId, { x: centerX - (nodeWidth / 2), y });
    positionedNodes.add(nodeId);
    
    if (node.children.length === 0) {
      // Terminal node - return its bounds
      return { minX: centerX - (nodeWidth / 2), maxX: centerX + (nodeWidth / 2) };
    }
    
    // Analyze children to determine optimal positioning strategy
    const children = node.children.map(childId => {
      const childNode = treeNodes.get(childId)!;
      const childWidth = calculateSubtreeWidth(childId);
      return { childId, childNode, width: childWidth };
    });
    
    // Check if this is a straight branch (single child with no siblings)
    if (children.length === 1) {
      const child = children[0];
      // For single children, always center directly on parent for straight vertical line
      const childCenterX = centerX;
      console.log(`Straight branch: centering "${child.childNode.perk.perkName}" directly on "${node.perk.perkName}" at ${childCenterX}`);
      
      const childBounds = positionSubtree(child.childId, childCenterX, level + 1, depth + 1);
      return {
        minX: Math.min(centerX - (nodeWidth / 2), childBounds.minX),
        maxX: Math.max(centerX + (nodeWidth / 2), childBounds.maxX)
      };
    }
    
    // Multiple children - need to spread them out with dynamic spacing
    let totalWidth = 0;
    let totalSpacing = 0;
    
    for (let i = 0; i < children.length; i++) {
      totalWidth += children[i].width;
      if (i < children.length - 1) {
        totalSpacing += calculateRequiredSpacing(children[i].childId, children[i + 1].childId);
      }
    }
    
    const finalTotalWidth = totalWidth + totalSpacing;
    
    // Start positioning from the left, centered on parent
    let currentX = centerX - (finalTotalWidth / 2);
    const subtreeBounds = { minX: Infinity, maxX: -Infinity };
    
    children.forEach((child, index) => {
      // Center this child's subtree
      const childCenterX = currentX + (child.width / 2);
      
      // Special case: if this child has multiple parents, handle complex positioning
      if (child.childNode.parents.length > 1) {
        const parentPositions = child.childNode.parents.map(parentId => positions.get(parentId)).filter(Boolean);
        if (parentPositions.length > 0) {
          const avgParentX = parentPositions.reduce((sum, pos) => sum + pos!.x + (nodeWidth / 2), 0) / parentPositions.length;
          
          // For multi-parent nodes, position them to minimize connection overlap
          const adjustedCenterX = avgParentX;
          
          console.log(`Multi-parent child "${child.childNode.perk.perkName}": assigned level ${child.childNode.level}, positioning at level ${child.childNode.level}, centering between ${child.childNode.parents.length} parents at ${adjustedCenterX}`);
          
          // For multi-parent nodes, use their assigned level for positioning
          // This ensures they're positioned at the correct level based on their highest parent
          const childBounds = positionSubtree(child.childId, adjustedCenterX, child.childNode.level, depth + 1);
          subtreeBounds.minX = Math.min(subtreeBounds.minX, childBounds.minX);
          subtreeBounds.maxX = Math.max(subtreeBounds.maxX, childBounds.maxX);
        } else {
          const childBounds = positionSubtree(child.childId, childCenterX, level + 1, depth + 1);
          subtreeBounds.minX = Math.min(subtreeBounds.minX, childBounds.minX);
          subtreeBounds.maxX = Math.max(subtreeBounds.maxX, childBounds.maxX);
        }
      } else {
        const childBounds = positionSubtree(child.childId, childCenterX, level + 1, depth + 1);
        subtreeBounds.minX = Math.min(subtreeBounds.minX, childBounds.minX);
        subtreeBounds.maxX = Math.max(subtreeBounds.maxX, childBounds.maxX);
      }
      
      // Move to next child with dynamic spacing
      currentX += child.width;
      if (index < children.length - 1) {
        currentX += calculateRequiredSpacing(child.childId, children[index + 1].childId);
      }
    });
    
    // Remove from positioning stack
    positioningStack.delete(nodeId);
    
    // Update bounds to include this node
    subtreeBounds.minX = Math.min(subtreeBounds.minX, centerX - (nodeWidth / 2));
    subtreeBounds.maxX = Math.max(subtreeBounds.maxX, centerX + (nodeWidth / 2));
    
    return subtreeBounds;
  }
  
  // Find root nodes
  const roots: string[] = [];
  treeNodes.forEach((node, perkId) => {
    const hasPerkPrerequisites = (node.perk.prerequisites?.perks?.length || 0) > 0;
    if (!hasPerkPrerequisites) {
      roots.push(perkId);
    }
  });
  
  console.log('Root nodes:', roots.map(id => treeNodes.get(id)!.perk.perkName));
  
  // Position all subtrees with spacing between them
  let currentX = padding;
  
  roots.forEach((rootId, rootIndex) => {
    const rootNode = treeNodes.get(rootId)!;
    const subtreeWidth = calculateSubtreeWidth(rootId);
    
    // Center the subtree
    const subtreeCenterX = currentX + (subtreeWidth / 2);
    
    // Position the entire subtree
    const bounds = positionSubtree(rootId, subtreeCenterX, 0, 0);
    
    // Move to next subtree position
    currentX = bounds.maxX + 30; // Reduced spacing between subtrees to 30px
    
    console.log(`Positioned subtree "${rootNode.perk.perkName}" at center ${subtreeCenterX}, bounds:`, bounds);
  });
  
  // Debug: Log final positions
  console.log('Final node positions:');
  treeNodes.forEach((node, perkId) => {
    const pos = positions.get(perkId);
    if (pos) {
      console.log(`${node.perk.perkName}: (${pos.x}, ${pos.y})`);
    }
  });
  
  return positions;
}

export function PerkTreeCanvas({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
}: PerkTreeCanvasProps) {
  // React Flow instance
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  
  // Memoize node types to prevent React Flow warnings
  const nodeTypes: NodeTypes = useMemo(() => ({
    perkNode: (props: any) => <PerkNode {...props} onTogglePerk={onTogglePerk} onRankChange={onRankChange} />,
  }), [onTogglePerk, onRankChange]);
  
  // Calculate node positions to avoid collisions
  const nodePositions = useMemo(() => {
    if (!tree) return new Map();
    return calculateNodePositions(tree.perks);
  }, [tree]);

  // Create React Flow nodes - only recreate when tree or positions change
  const initialNodes: Node[] = useMemo(() => {
    if (!tree) return [];
    
    // Build tree structure to get children information
    const treeNodes = buildTreeStructure(tree.perks);
    
    return tree.perks.map((perk) => {
      const position = nodePositions.get(perk.perkId) || { x: 0, y: 0 };
      const treeNode = treeNodes.get(perk.perkId);
      const hasChildren = treeNode ? treeNode.children.length > 0 : false;
      const isRoot = (perk.prerequisites?.perks?.length || 0) === 0;
      
      return {
        id: perk.perkId,
        type: "perkNode",
        position,
        data: {
          ...perk,
          selected: false, // Will be updated via useEffect
          hasChildren: hasChildren,
          isRoot: isRoot,
        },
      };
    });
  }, [tree, nodePositions]); // Removed selectedPerks dependency

  // Create React Flow edges from prerequisites (actual dependencies)
  const initialEdges: Edge[] = useMemo(() => {
    if (!tree) return [];
    
    const edges: Edge[] = [];
    tree.perks.forEach((perk) => {
      // Create edges based on prerequisites (parent -> child relationships)
      if (perk.prerequisites?.perks) {
        perk.prerequisites.perks.forEach((prereq) => {
          if (prereq.type === "PERK") {
            const parentId = prereq.id;
            // Check if parent exists in our tree
            const parentExists = tree.perks.some(p => p.perkId === parentId);
            if (parentExists) {
              edges.push({
                id: `${parentId}-${perk.perkId}`,
                source: parentId,
                target: perk.perkId,
                type: "straight",
                style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
              });
            }
          }
        });
      }
    });
    
    console.log(`Created ${edges.length} edges from prerequisites`);
    
    return edges;
  }, [tree]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when tree changes (recreate structure)
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update node selection state without recreating nodes
  React.useEffect(() => {
    if (!tree) return;
    
    setNodes((currentNodes) => 
      currentNodes.map((node) => {
        const selectedPerk = selectedPerks.find(p => p.perkId === node.id);
        const isSelected = selectedPerk !== undefined;
        
        return {
          ...node,
          data: {
            ...node.data,
            selected: isSelected,
            currentRank: selectedPerk?.currentRank || 0,
          },
        };
      })
    );
  }, [selectedPerks, setNodes, tree]);

  // Update edges when tree changes
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Fit view when tree changes (when switching between skills)
  React.useEffect(() => {
    if (tree && nodes.length > 0 && reactFlowInstance) {
      // Use setTimeout to ensure nodes are rendered before fitting view
      setTimeout(() => {
        reactFlowInstance.fitView({ 
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.5
        });
      }, 100);
    }
  }, [tree?.treeId, reactFlowInstance]); // Removed nodes.length dependency

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );



  if (!tree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Select a skill to view its perk tree</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background rounded-lg border" style={{ zIndex: 1 }}>
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
        fitView
        fitViewOptions={{ 
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.5
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
} 