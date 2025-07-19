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
  children?: string[]; // Child node IDs
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

// Helper function to find connected components (separate trees)
function findConnectedComponents(perks: PerkRecord[]): PerkRecord[][] {
  const visited = new Set<string>();
  const components: PerkRecord[][] = [];
  
  const dfs = (perkId: string, component: PerkRecord[]) => {
    if (visited.has(perkId)) return;
    visited.add(perkId);
    component.push(perks.find(p => p.edid === perkId)!);
    
    const perk = perks.find(p => p.edid === perkId)!;
    // Visit children
    perk.connection.children.forEach(childId => {
      if (perks.some(p => p.edid === childId)) {
        dfs(childId, component);
      }
    });
    // Visit parents
    perk.connection.parents.forEach(parentId => {
      if (perks.some(p => p.edid === parentId)) {
        dfs(parentId, component);
      }
    });
  };
  
  perks.forEach(perk => {
    if (!visited.has(perk.edid)) {
      const component: PerkRecord[] = [];
      dfs(perk.edid, component);
      components.push(component);
    }
  });
  
  return components;
}

// Calculate the width of a tree based on the level with the most nodes
function calculateTreeWidth(treePerks: PerkRecord[], config: LayoutConfig): number {
  // Group perks by Y level
  const perksByLevel = new Map<number, PerkRecord[]>();
  
  treePerks.forEach(perk => {
    const level = perk.position.y;
    if (!perksByLevel.has(level)) {
      perksByLevel.set(level, []);
    }
    perksByLevel.get(level)!.push(perk);
  });
  
  // Find the level with the most perks
  let maxPerksInLevel = 0;
  perksByLevel.forEach((perks, level) => {
    maxPerksInLevel = Math.max(maxPerksInLevel, perks.length);
  });
  
  // Calculate width: number of perks * node width + spacing between them
  const totalWidth = maxPerksInLevel * config.nodeWidth + (maxPerksInLevel - 1) * config.horizontalSpacing;
  
  console.log(`Tree with ${treePerks.length} perks: max ${maxPerksInLevel} perks in a level, width: ${totalWidth}px`);
  
  return totalWidth;
}

// 2️⃣ Scale Positions (Grid → Canvas) with multi-tree support
function scalePositions(
  perks: PerkRecord[],
  sizes: Map<string, number>,
  config: LayoutConfig
): LayoutNode[] {
  const nodes: LayoutNode[] = [];
  
  // Find connected components (separate trees)
  const trees = findConnectedComponents(perks);
  console.log(`Found ${trees.length} separate trees`);
  
  // Calculate width of each tree
  const treeWidths = trees.map(tree => calculateTreeWidth(tree, config));
  
  // Calculate total spacing needed between trees
  const treeSpacing = config.horizontalSpacing * 2; // Generous spacing between trees
  const totalWidth = treeWidths.reduce((sum, width) => sum + width, 0) + (trees.length - 1) * treeSpacing;
  
  console.log(`Total layout width: ${totalWidth}px (${treeWidths.join(' + ')} + ${(trees.length - 1) * treeSpacing} spacing)`);
  
  // Position each tree
  let currentX = 0;
  
  trees.forEach((treePerks, treeIndex) => {
    console.log(`\n=== POSITIONING TREE ${treeIndex + 1} ===`);
    console.log(`Starting X position: ${currentX}`);
    
    // Find min and max Y for this tree
    const minY = Math.min(...treePerks.map(p => p.position.y));
    const maxY = Math.max(...treePerks.map(p => p.position.y));
    const yRange = maxY - minY;
    
    // Find min and max X for this tree
    const minX = Math.min(...treePerks.map(p => p.position.x));
    const maxX = Math.max(...treePerks.map(p => p.position.x));
    const xRange = maxX - minX;
    
    console.log(`Tree ${treeIndex + 1} Y range: ${minY} to ${maxY} (range: ${yRange})`);
    console.log(`Tree ${treeIndex + 1} X range: ${minX} to ${maxX} (range: ${xRange})`);
    
    // Build parent-child mapping for Y offset calculation
    const parentMap = new Map<string, string[]>();
    treePerks.forEach(perk => {
      perk.connection.children.forEach(childId => {
        if (treePerks.some(p => p.edid === childId)) {
          if (!parentMap.has(perk.edid)) {
            parentMap.set(perk.edid, []);
          }
          parentMap.get(perk.edid)!.push(childId);
          console.log(`Parent-child: ${perk.edid} -> ${childId}`);
        }
      });
    });
    
    // Position perks in this tree
    treePerks.forEach(perk => {
      // X-axis: relative to tree's X range, then offset by tree position
      const normalizedX = xRange > 0 ? (perk.position.x - minX) / xRange : 0;
      const treeRelativeX = normalizedX * xRange * config.gridScaleX;
      const canvasX = currentX + treeRelativeX;
      
      // Y-axis: inverted as per specification (maxY - position.y)
      let canvasY = (maxY - perk.position.y) * config.gridScaleY;
      
      // Check if this node has a parent at the same Y level and add half-step offset
      const parents = perk.connection.parents.filter(parentId => 
        treePerks.some(p => p.edid === parentId)
      );
      
      if (parents.length > 0) {
        // Check if any parent is at the same Y level
        const hasParentAtSameLevel = parents.some(parentId => {
          const parent = treePerks.find(p => p.edid === parentId);
          return parent && parent.position.y === perk.position.y;
        });
        
        if (hasParentAtSameLevel) {
          const halfStepOffset = config.verticalSpacing * 0.5;
          canvasY -= halfStepOffset; // Shift up by half a step (can go negative)
          console.log(`${perk.edid}: Same Y as parent, shifting up by ${halfStepOffset}px to Y=${canvasY}`);
        }
      }
      
      console.log(`${perk.edid}: grid (${perk.position.x},${perk.position.y}), canvas (${canvasX.toFixed(0)},${canvasY.toFixed(0)})`);
      
      nodes.push({
        id: perk.edid,
        x: canvasX,
        y: canvasY,
        width: sizes.get(perk.edid) || config.nodeWidth,
        height: config.nodeHeight,
        originalX: canvasX,
        originalY: canvasY, // Use the final Y position (including offset) as original
      });
    });
    
    // Move to next tree position
    currentX += treeWidths[treeIndex] + treeSpacing;
    console.log(`Moving to next tree at X position: ${currentX}`);
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

// 4️⃣ Comprehensive Centering System
function centerSubtrees(
  nodes: LayoutNode[],
  tree: Map<string, string[]>,
  config: LayoutConfig
): LayoutNode[] {
  console.log('=== STARTING COMPREHENSIVE CENTERING LAYOUT ===');
  
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
  
  // 1️⃣ CENTER PARENTS UNDER CHILDREN (Bottom-up)
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
      
      // Only center if the move is reasonable
      const maxMoveDistance = config.horizontalSpacing * 2;
      const currentCenterX = parent.x + (parent.width / 2);
      const moveDistance = Math.abs(childrenCenterX - currentCenterX);
      
      console.log(`🔍 Centering parent ${parentId} under ${childCount} children: current center=${currentCenterX.toFixed(0)}, children center=${childrenCenterX.toFixed(0)}, move=${moveDistance.toFixed(0)}, max=${maxMoveDistance}`);
      
      if (moveDistance <= maxMoveDistance) {
        console.log(`  ✅ Centering parent ${parentId} under ${childCount} children: x=${parent.x.toFixed(0)} -> ${newParentX.toFixed(0)}`);
        parent.x = newParentX;
        parent.originalX = newParentX;
        return true;
      } else {
        console.log(`  ❌ Skipping parent ${parentId}: move too large (${moveDistance.toFixed(0)}px > ${maxMoveDistance}px)`);
      }
    }
    
    return false;
  };
  
  // 2️⃣ CENTER CHILDREN UNDER PARENTS (Top-down)
  const centerChildrenUnderParent = (parentId: string): boolean => {
    const parent = nodeMap.get(parentId);
    if (!parent) return false;
    
    const children = tree.get(parentId) || [];
    const validChildren = children.filter(childId => nodeMap.has(childId));
    
    if (validChildren.length === 0) return false;
    
    const parentCenterX = parent.x + (parent.width / 2);
    
    // Calculate total width of all children
    let totalChildrenWidth = 0;
    validChildren.forEach(childId => {
      const child = nodeMap.get(childId);
      if (child) {
        totalChildrenWidth += child.width;
      }
    });
    
    // Add spacing between children
    const totalSpacing = (validChildren.length - 1) * config.horizontalSpacing;
    const totalWidth = totalChildrenWidth + totalSpacing;
    
    // Position children centered under parent
    let currentX = parentCenterX - (totalWidth / 2);
    let centeredCount = 0;
    
    console.log(`🔍 Centering children under ${parentId}: parent center=${parentCenterX.toFixed(0)}, total width=${totalWidth.toFixed(0)}, start X=${currentX.toFixed(0)}`);
    
    validChildren.forEach(childId => {
      const child = nodeMap.get(childId);
      if (child) {
        const newChildX = currentX;
        const moveDistance = Math.abs(newChildX - child.x);
        const maxMoveDistance = config.horizontalSpacing * 3;
        
        console.log(`  📍 Child ${childId}: current=${child.x.toFixed(0)}, target=${newChildX.toFixed(0)}, move=${moveDistance.toFixed(0)}, max=${maxMoveDistance}`);
        
        if (moveDistance <= maxMoveDistance) {
          console.log(`  ✅ Centering child ${childId} under parent ${parentId}: x=${child.x.toFixed(0)} -> ${newChildX.toFixed(0)}`);
          child.x = newChildX;
          child.originalX = newChildX;
          centeredCount++;
        } else {
          console.log(`  ❌ Skipping child ${childId}: move too large (${moveDistance.toFixed(0)}px > ${maxMoveDistance}px)`);
        }
        
        currentX += child.width + config.horizontalSpacing;
      }
    });
    
    return centeredCount > 0;
  };
  
  // 3️⃣ SPACE SIBLINGS EVENLY AROUND PARENT
  const spaceSiblingsEvenly = (parentId: string): boolean => {
    const parent = nodeMap.get(parentId);
    if (!parent) return false;
    
    const children = tree.get(parentId) || [];
    const validChildren = children.filter(childId => nodeMap.has(childId));
    
    if (validChildren.length <= 1) return false;
    
    const parentCenterX = parent.x + (parent.width / 2);
    
    // Calculate total width of all children
    let totalChildrenWidth = 0;
    validChildren.forEach(childId => {
      const child = nodeMap.get(childId);
      if (child) {
        totalChildrenWidth += child.width;
      }
    });
    
    // Calculate spacing between children
    const totalSpacing = (validChildren.length - 1) * config.horizontalSpacing;
    const totalWidth = totalChildrenWidth + totalSpacing;
    
    // Position children evenly spaced around parent center
    let currentX = parentCenterX - (totalWidth / 2);
    let spacedCount = 0;
    
    validChildren.forEach(childId => {
      const child = nodeMap.get(childId);
      if (child) {
        const newChildX = currentX;
        const moveDistance = Math.abs(newChildX - child.x);
        const maxMoveDistance = config.horizontalSpacing * 4;
        
        if (moveDistance <= maxMoveDistance) {
          console.log(`Spacing sibling ${childId} around parent ${parentId}: x=${child.x.toFixed(0)} -> ${newChildX.toFixed(0)}`);
          child.x = newChildX;
          child.originalX = newChildX;
          spacedCount++;
        }
        
        currentX += child.width + config.horizontalSpacing;
      }
    });
    
    return spacedCount > 0;
  };
  
  // Execute centering strategies
  let totalCentered = 0;
  
  // Debug: Track specific nodes
  const debugNodes = ['REQ_Destruction_Arcane_025_ArcaneFocus1', 'REQ_Destruction_Arcane_075_ArcaneDisruption'];
  
  const logDebugNodes = (phase: string) => {
    console.log(`🔍 ${phase} - Debug nodes:`);
    debugNodes.forEach(nodeId => {
      const node = nodeMap.get(nodeId);
      if (node) {
        console.log(`  ${nodeId}: x=${node.x.toFixed(0)}, y=${node.y.toFixed(0)}`);
      }
    });
  };
  
  logDebugNodes('Initial positions');
  
  // Phase 1: Center parents under children (bottom-up)
  console.log('=== PHASE 1: Centering parents under children ===');
  const processedParents = new Set<string>();
  const parentQueue: string[] = [];
  
  // Start with leaf nodes
  nodeMap.forEach((node, nodeId) => {
    const children = tree.get(nodeId) || [];
    const validChildren = children.filter(childId => nodeMap.has(childId));
    
    if (validChildren.length === 0) {
      parentQueue.push(nodeId);
    }
  });
  
  while (parentQueue.length > 0) {
    const nodeId = parentQueue.shift()!;
    
    if (processedParents.has(nodeId)) continue;
    processedParents.add(nodeId);
    
    const wasCentered = centerParentUnderChildren(nodeId);
    if (wasCentered) totalCentered++;
    
    // Add parents to queue
    const parents = Array.from(tree.entries())
      .filter(([parentId, children]) => children.includes(nodeId))
      .map(([parentId]) => parentId);
    
    parents.forEach(parentId => {
      if (!processedParents.has(parentId)) {
        const parentChildren = tree.get(parentId) || [];
        const validParentChildren = parentChildren.filter(childId => nodeMap.has(childId));
        const allChildrenProcessed = validParentChildren.every(childId => processedParents.has(childId));
        
        if (allChildrenProcessed) {
          parentQueue.push(parentId);
        }
      }
    });
  }
  
  logDebugNodes('After Phase 1 (parent centering)');
  
  // Phase 2: Space siblings evenly around parents
  console.log('=== PHASE 2: Spacing siblings evenly ===');
  const processedSiblings = new Set<string>();
  const siblingQueue: string[] = [...rootNodes];
  
  while (siblingQueue.length > 0) {
    const nodeId = siblingQueue.shift()!;
    
    if (processedSiblings.has(nodeId)) continue;
    processedSiblings.add(nodeId);
    
    const wasSpaced = spaceSiblingsEvenly(nodeId);
    if (wasSpaced) totalCentered++;
    
    // Add children to queue
    const children = tree.get(nodeId) || [];
    children.forEach(childId => {
      if (!processedSiblings.has(childId)) {
        siblingQueue.push(childId);
      }
    });
  }
  
  logDebugNodes('After Phase 2 (sibling spacing)');
  
  console.log(`Comprehensive centering completed: ${totalCentered} adjustments made`);
  
  return Array.from(nodeMap.values());
}

// 5️⃣ Subtree-Based Collision Resolution
function resolveCollisions(
  nodes: LayoutNode[],
  tree: Map<string, string[]>,
  config: LayoutConfig
): LayoutNode[] {
  console.log('=== STARTING SUBTREE COLLISION RESOLUTION ===');
  
  // Create a map for quick node lookup
  const nodeMap = new Map<string, LayoutNode>();
  nodes.forEach(node => nodeMap.set(node.id, node));
  
  // Find root nodes (nodes with no parents)
  const rootNodes: string[] = [];
  const allChildren = new Set<string>();
  
  tree.forEach((children, parentId) => {
    children.forEach(childId => allChildren.add(childId));
  });
  
  nodeMap.forEach((node, nodeId) => {
    if (!allChildren.has(nodeId)) {
      rootNodes.push(nodeId);
    }
  });
  
  console.log(`Found ${rootNodes.length} root nodes for collision resolution`);
  
  // Helper function to get all descendants of a node
  const getAllDescendants = (nodeId: string): string[] => {
    const descendants: string[] = [];
    const queue: string[] = [nodeId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = tree.get(currentId) || [];
      
      children.forEach(childId => {
        if (nodeMap.has(childId)) {
          descendants.push(childId);
          queue.push(childId);
        }
      });
    }
    
    return descendants;
  };
  
  // Helper function to shift a subtree horizontally
  const shiftSubtree = (rootId: string, deltaX: number): void => {
    const subtreeNodes = [rootId, ...getAllDescendants(rootId)];
    
    subtreeNodes.forEach(nodeId => {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.x += deltaX;
        node.originalX += deltaX;
      }
    });
    
    console.log(`Shifted subtree rooted at ${rootId} by ${deltaX.toFixed(0)}px (${subtreeNodes.length} nodes)`);
  };
  
  // Helper function to get subtree bounds
  const getSubtreeBounds = (rootId: string): { left: number; right: number; width: number } => {
    const subtreeNodes = [rootId, ...getAllDescendants(rootId)];
    let left = Infinity;
    let right = -Infinity;
    
    subtreeNodes.forEach(nodeId => {
      const node = nodeMap.get(nodeId);
      if (node) {
        left = Math.min(left, node.x);
        right = Math.max(right, node.x + node.width);
      }
    });
    
    return { left, right, width: right - left };
  };
  
  // Sort root nodes by their X position
  const sortedRoots = rootNodes.sort((a, b) => {
    const nodeA = nodeMap.get(a);
    const nodeB = nodeMap.get(b);
    return (nodeA?.x || 0) - (nodeB?.x || 0);
  });
  
  console.log(`Processing ${sortedRoots.length} subtrees for collisions`);
  
  // Check for horizontal overlaps between subtrees and resolve them
  for (let i = 0; i < sortedRoots.length - 1; i++) {
    const rootA = sortedRoots[i];
    const rootB = sortedRoots[i + 1];
    
    const boundsA = getSubtreeBounds(rootA);
    const boundsB = getSubtreeBounds(rootB);
    
    const requiredSpacing = config.horizontalSpacing * 2; // Extra spacing between subtrees
    const overlap = (boundsA.right + requiredSpacing) - boundsB.left;
    
    if (overlap > 0) {
      // Subtrees overlap, shift the second subtree right
      console.log(`Resolving overlap between subtrees ${rootA} and ${rootB}: shifting by ${overlap.toFixed(0)}px`);
      shiftSubtree(rootB, overlap);
      
      // Update bounds for subsequent comparisons
      boundsB.left += overlap;
      boundsB.right += overlap;
    }
  }
  
  // Apply gentle attraction back to original positions (X-axis only)
  const attractionForce = 0.03; // Weaker attraction for subtrees
  
  nodes.forEach(node => {
    const deltaX = node.originalX - node.x;
    node.x += deltaX * attractionForce;
  });
  
  console.log('Subtree collision resolution completed');
  
  return Array.from(nodeMap.values());
}

// 6️⃣ Final Row Alignment
function snapYToGrid(nodes: LayoutNode[], config: LayoutConfig): LayoutNode[] {
  return nodes.map(node => {
    // Use a smaller grid scale for snapping to preserve half-step offsets
    const snapGridScale = config.verticalSpacing * 0.5; // Half the vertical spacing
    const snappedY = Math.round(node.y / snapGridScale) * snapGridScale;
    
    return {
      ...node,
      y: snappedY,
    };
  });
}

// 📦 Clean Hierarchical Layout Function
function layoutPerkTree(perks: PerkRecord[], config: LayoutConfig): LayoutNode[] {
  try {
    console.log('=== STARTING CLEAN HIERARCHICAL LAYOUT ===');
    console.log(`Total perks to layout: ${perks.length}`);
    
    if (perks.length === 0) {
      console.log('No perks to layout, returning empty array');
      return [];
    }
    
    // 1️⃣ Identify trees (connected components)
    console.log('=== STEP 1: IDENTIFYING TREES ===');
    const trees = findConnectedComponents(perks);
    console.log(`Found ${trees.length} trees:`, trees.map(tree => tree.map(p => p.edid.split('_').pop())));
    
    // 2️⃣ For each tree, calculate depths and build hierarchy
    console.log('=== STEP 2: BUILDING HIERARCHY ===');
    const treeHierarchies = trees.map(treePerks => buildTreeHierarchy(treePerks));
    
    // 3️⃣ Layout each tree
    console.log('=== STEP 3: LAYOUTING TREES ===');
    const treeLayouts = treeHierarchies.map((hierarchy, treeIndex) => {
      console.log(`Layouting tree ${treeIndex + 1} with ${hierarchy.nodes.size} nodes`);
      return layoutSingleTree(hierarchy, config);
    });
    
    // 4️⃣ Position trees as siblings with spacing
    console.log('=== STEP 4: POSITIONING TREES AS SIBLINGS ===');
    const finalNodes = positionTreesAsSiblings(treeLayouts, config);
    
    // 5️⃣ Apply mild forces for natural spacing
    console.log('=== STEP 5: APPLYING MILD FORCES ===');
    const forceAdjustedNodes = applyMildForces(finalNodes, config);
    
    console.log('Clean hierarchical layout completed');
    console.log('Final positions:', forceAdjustedNodes.map(n => `${n.id}: (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`));
    
    return forceAdjustedNodes;
  } catch (error) {
    console.error('Error in hierarchical layout algorithm:', error);
    // Fallback to simple positioning if algorithm fails
    return perks.map(perk => ({
      id: perk.edid,
      x: 0,
      y: 0,
      width: config.nodeWidth,
      height: config.nodeHeight,
      originalX: 0,
      originalY: 0,
    }));
  }
}

// Helper function to build tree hierarchy with depths
function buildTreeHierarchy(treePerks: PerkRecord[]) {
  interface HierarchyNode {
    perk: PerkRecord;
    depth: number;
    children: string[];
    parents: string[];
    x: number;
    y: number;
    width: number;
  }
  
  const nodes = new Map<string, HierarchyNode>();
  
  // Initialize nodes
  treePerks.forEach(perk => {
    nodes.set(perk.edid, {
      perk,
      depth: -1, // Will be calculated
      children: perk.connection.children,
      parents: perk.connection.parents,
      x: 0,
      y: 0,
      width: 0,
    });
  });
  
  // Find roots (nodes with no parents)
  const roots: string[] = [];
  nodes.forEach((node, id) => {
    if (node.parents.length === 0) {
      roots.push(id);
    }
  });
  
  console.log(`  Tree has ${roots.length} roots:`, roots.map(id => id.split('_').pop()));
  
  // Calculate depths using BFS from roots
  const queue: { id: string; depth: number }[] = roots.map(id => ({ id, depth: 0 }));
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    
    if (visited.has(id)) continue;
    visited.add(id);
    
    const node = nodes.get(id);
    if (node) {
      // Only set depth if it's higher (closer to root) than current depth
      if (node.depth === -1 || depth < node.depth) {
        node.depth = depth;
      }
      
      // Add children to queue
      node.children.forEach(childId => {
        if (nodes.has(childId) && !visited.has(childId)) {
          queue.push({ id: childId, depth: depth + 1 });
        }
      });
    }
  }
  
  // Second pass: Handle nodes with multiple parents at different levels
  console.log('  Second pass: Handling multi-parent nodes at different levels');
  let hasChanges = true;
  let iteration = 0;
  
  while (hasChanges && iteration < 10) { // Prevent infinite loops
    hasChanges = false;
    iteration++;
    
    nodes.forEach((node, nodeId) => {
      if (node.parents.length > 1) {
        // Find the highest (closest to root) parent depth
        const parentDepths = node.parents.map(parentId => {
          const parent = nodes.get(parentId);
          return parent ? parent.depth : -1;
        }).filter(depth => depth !== -1);
        
        if (parentDepths.length > 0) {
          const minParentDepth = Math.min(...parentDepths);
          const expectedDepth = minParentDepth + 1;
          
          if (node.depth !== expectedDepth) {
            console.log(`    ${nodeId.split('_').pop()}: depth ${node.depth} -> ${expectedDepth} (parents: ${node.parents.map(p => p.split('_').pop()).join(', ')})`);
            node.depth = expectedDepth;
            hasChanges = true;
          }
        }
      }
    });
  }
  
  // Third pass: Ensure all children are at higher depth than their parents
  console.log('  Third pass: Ensuring children are at higher depth than parents');
  nodes.forEach((node, nodeId) => {
    node.children.forEach(childId => {
      const child = nodes.get(childId);
      if (child && child.depth <= node.depth) {
        const newDepth = node.depth + 1;
        console.log(`    ${childId.split('_').pop()}: depth ${child.depth} -> ${newDepth} (child of ${nodeId.split('_').pop()} at depth ${node.depth})`);
        child.depth = newDepth;
      }
    });
  });
  
  if (iteration >= 10) {
    console.log('  Warning: Depth calculation reached maximum iterations');
  }
  
  return { nodes, roots };
}

// Helper function to layout a single tree
function layoutSingleTree(hierarchy: { nodes: Map<string, any>; roots: string[] }, config: LayoutConfig): LayoutNode[] {
  const { nodes, roots } = hierarchy;
  console.log(`Layout single tree with ${nodes.size} nodes and ${roots.length} roots`);
  
  // Convert hierarchy nodes to layout nodes
  const layoutNodes: LayoutNode[] = [];
  nodes.forEach((hierarchyNode, id) => {
    layoutNodes.push({
      id,
      x: 0, // Will be calculated
      y: 0, // Will be calculated
      width: config.nodeWidth,
      height: config.nodeHeight,
      originalX: 0,
      originalY: 0,
      children: hierarchyNode.children,
    });
  });
  
  // Check for circular references by attempting to calculate subtree widths
  const hasCircularReferences = layoutNodes.some(node => {
    try {
      // Use a more aggressive test - try to calculate width for all nodes
      const testVisited = new Set<string>();
      const testResult = calculateSubtreeWidth(node.id, nodes, config, testVisited);
      // If we get a reasonable result, no circular reference
      return false;
    } catch (error) {
      console.log(`Circular reference detected in tree, will use original positions for ${node.id}`);
      return true;
    }
  });
  
  if (hasCircularReferences) {
    console.log('Using original position data due to circular references');
    console.log(`Tree has ${layoutNodes.length} nodes, checking original positions...`);
    
    // Use original position data from the perk records
    layoutNodes.forEach(node => {
      const hierarchyNode = nodes.get(node.id);
      if (hierarchyNode && hierarchyNode.perk) {
        // Scale original positions to our coordinate system
        const originalX = hierarchyNode.perk.position.x * config.gridScaleX;
        const originalY = -hierarchyNode.perk.position.y * config.gridScaleY; // Invert Y for upward branching
        
        console.log(`${node.id.split('_').pop()}: original pos (${hierarchyNode.perk.position.x}, ${hierarchyNode.perk.position.y}) -> scaled (${originalX.toFixed(0)}, ${originalY.toFixed(0)})`);
        
        node.x = originalX;
        node.y = originalY;
        node.originalX = originalX;
        node.originalY = originalY;
      } else {
        console.warn(`No original position data for node: ${node.id}`);
      }
    });
    
    // Apply collision detection and forces for circular reference trees
    applyCircularTreeForces(layoutNodes, config);
    return layoutNodes;
  }
  
  // Proceed with hierarchical layout if no circular references
  console.log('No circular references detected, using hierarchical layout');
  
  // Find root nodes (nodes with no parents in this tree)
  const rootNodes = layoutNodes.filter(node => {
    const hasParentInTree = layoutNodes.some(other => 
      other.id !== node.id && other.children?.includes(node.id)
    );
    return !hasParentInTree;
  });
  
  console.log(`Found ${rootNodes.length} root nodes: ${rootNodes.map(n => n.id.split('_').pop()).join(', ')}`);
  
  // Set all roots at y=0
  rootNodes.forEach(node => {
    node.y = 0;
    node.originalY = 0;
  });
  
  // Calculate depths for all other nodes (negative numbers)
  const visited = new Set<string>();
  const queue: { node: LayoutNode; depth: number }[] = rootNodes.map(node => ({ node, depth: 0 }));
  
  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;
    
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    
    // Set depth (negative for non-roots)
    if (depth > 0) {
      node.y = -depth * config.verticalSpacing;
      node.originalY = node.y;
    }
    
    // Add children to queue
    if (node.children) {
      node.children.forEach(childId => {
        const childNode = layoutNodes.find(n => n.id === childId);
        if (childNode && !visited.has(childId)) {
          queue.push({ node: childNode, depth: depth + 1 });
        }
      });
    }
  }
  
  // Center children on their immediate parents
  const nodesByDepth = new Map<number, LayoutNode[]>();
  layoutNodes.forEach(node => {
    const depth = Math.round(node.y / config.verticalSpacing);
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
  });
  
  // Process from bottom (roots) to top
  const depths = Array.from(nodesByDepth.keys()).sort((a, b) => b - a); // Descending order
  
  depths.forEach(depth => {
    const nodesAtDepth = nodesByDepth.get(depth)!;
    
    nodesAtDepth.forEach(node => {
      if (node.children) {
        // Group children by their immediate parent
        const childrenByParent = new Map<string, LayoutNode[]>();
        
        node.children.forEach(childId => {
          const childNode = layoutNodes.find(n => n.id === childId);
          if (childNode) {
            // Find the immediate parent(s) of this child
            const immediateParents = layoutNodes.filter(n => 
              n.children?.includes(childId) && 
              Math.abs(n.y - childNode.y) === config.verticalSpacing
            );
            
            if (immediateParents.length > 0) {
              // If this node is an immediate parent, add the child to its group
              if (immediateParents.some(p => p.id === node.id)) {
                if (!childrenByParent.has(node.id)) {
                  childrenByParent.set(node.id, []);
                }
                childrenByParent.get(node.id)!.push(childNode);
              }
            }
          }
        });
        
        // Center each group of children on their immediate parent
        childrenByParent.forEach((children, parentId) => {
          if (children.length > 0) {
            const parentNode = layoutNodes.find(n => n.id === parentId);
            if (parentNode) {
              // Calculate subtree widths for spacing
              const childPositions = children.map(child => {
                const subtreeWidth = calculateSubtreeWidth(child.id, nodes, config);
                return { child, subtreeWidth };
              });
              
              // Calculate total width needed
              const totalWidth = childPositions.reduce((sum, { subtreeWidth }) => sum + subtreeWidth, 0);
              const spacing = (children.length - 1) * config.horizontalSpacing;
              const totalNeeded = totalWidth + spacing;
              
              // Start position (center on parent)
              let currentX = parentNode.x - totalNeeded / 2;
              
              // Position each child
              childPositions.forEach(({ child, subtreeWidth }) => {
                child.x = currentX + subtreeWidth / 2;
                child.originalX = child.x;
                currentX += subtreeWidth + config.horizontalSpacing;
              });
            }
          }
        });
      }
    });
  });
  
  // Apply mild forces for natural spacing
  applyMildForces(layoutNodes, config);
  
  return layoutNodes;
}

// Helper function to apply mild forces with depth constraints
function applyMildForces(layoutNodes: LayoutNode[], config: LayoutConfig): LayoutNode[] {
  console.log('=== APPLYING MILD FORCES ===');
  
  const forceStrength = 0.03; // Mild force
  const attractionStrength = 0.02; // Weaker attraction
  const minDistance = config.horizontalSpacing * 0.4; // Minimum distance between nodes
  
  // Store original positions for attraction
  const originalPositions = new Map<string, { x: number; y: number }>();
  layoutNodes.forEach(node => {
    originalPositions.set(node.id, { x: node.x, y: node.y });
  });
  
  // Apply repulsion forces for multiple iterations
  for (let iteration = 0; iteration < 5; iteration++) {
    let totalForceApplied = 0;
    
    // Check each pair of nodes
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i];
        const nodeB = layoutNodes[j];
        
        // Calculate distance between node centers
        const centerAX = nodeA.x + config.nodeWidth * 0.5;
        const centerAY = nodeA.y + config.nodeHeight * 0.5;
        const centerBX = nodeB.x + config.nodeWidth * 0.5;
        const centerBY = nodeB.y + config.nodeHeight * 0.5;
        
        const deltaX = centerBX - centerAX;
        const deltaY = centerBY - centerAY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // If nodes are too close, apply repulsion force
        if (distance < minDistance && distance > 0) {
          const forceX = (deltaX / distance) * forceStrength;
          const forceY = (deltaY / distance) * forceStrength;
          
          // Push nodes apart (up and out)
          nodeA.x -= forceX;
          nodeA.y -= forceY; // Push up (negative Y is up)
          nodeB.x += forceX;
          nodeB.y += forceY; // Push up for the other node too
          
          totalForceApplied++;
          
          if (iteration === 0) {
            console.log(`  💫 Repulsion between ${nodeA.id.split('_').pop()} and ${nodeB.id.split('_').pop()}: force=(${forceX.toFixed(2)}, ${forceY.toFixed(2)})`);
          }
        }
      }
    }
    
    console.log(`  Iteration ${iteration + 1}: Applied repulsion to ${totalForceApplied} node pairs`);
    
    // Stop early if no forces were applied
    if (totalForceApplied === 0) {
      console.log(`  No more repulsion needed after iteration ${iteration + 1}`);
      break;
    }
  }
  
  // Apply attraction back to original positions with depth constraints
  console.log('=== APPLYING ATTRACTION WITH DEPTH CONSTRAINTS ===');
  
  layoutNodes.forEach(node => {
    const original = originalPositions.get(node.id);
    if (!original) return;
    
    const deltaX = original.x - node.x;
    const deltaY = original.y - node.y;
    
    // Apply attraction
    const newX = node.x + deltaX * attractionStrength;
    const newY = node.y + deltaY * attractionStrength;
    
    // Calculate expected Y position based on depth
    const depth = Math.round(original.y / config.verticalSpacing);
    const expectedY = depth * config.verticalSpacing;
    
    // Ensure node never goes lower than its depth level
    const finalY = Math.max(newY, expectedY);
    
    if (Math.abs(finalY - node.y) > 1 || Math.abs(newX - node.x) > 1) {
      console.log(`  🎯 Attraction for ${node.id.split('_').pop()}: x=${node.x.toFixed(0)}->${newX.toFixed(0)}, y=${node.y.toFixed(0)}->${finalY.toFixed(0)} (depth constraint: ${expectedY.toFixed(0)})`);
    }
    
    node.x = newX;
    node.y = finalY;
    node.originalX = newX;
    node.originalY = finalY;
  });
  
  console.log('Mild forces completed');
  return layoutNodes;
}

// Helper function to apply collision detection and forces for circular reference trees
function applyCircularTreeForces(layoutNodes: LayoutNode[], config: LayoutConfig): LayoutNode[] {
  console.log('=== APPLYING CIRCULAR TREE FORCES ===');
  
  const forceStrength = 0.08; // Stronger force for collision resolution
  const attractionStrength = 0.03; // Moderate attraction to original positions
  const minVerticalSeparation = config.nodeHeight * 0.8; // Minimum vertical separation between nodes
  const maxIterations = 50; // More iterations to ensure no touching
  
  // Store original positions for attraction
  const originalPositions = new Map<string, { x: number; y: number }>();
  layoutNodes.forEach(node => {
    originalPositions.set(node.id, { x: node.x, y: node.y });
  });
  
  // Phase 1: Vertical-only repulsion forces until no touching
  console.log('=== PHASE 1: VERTICAL-ONLY REPULSION ===');
  let iteration = 0;
  let totalTouching = 1; // Start with 1 to enter loop
  
  while (totalTouching > 0 && iteration < maxIterations) {
    iteration++;
    totalTouching = 0;
    let maxForceApplied = 0;
    
    // Check each pair of nodes
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i];
        const nodeB = layoutNodes[j];
        
        // Check for overlapping bounding boxes
        const overlapX = Math.max(0, 
          Math.min(nodeA.x + config.nodeWidth, nodeB.x + config.nodeWidth) - 
          Math.max(nodeA.x, nodeB.x)
        );
        const overlapY = Math.max(0, 
          Math.min(nodeA.y + config.nodeHeight, nodeB.y + config.nodeHeight) - 
          Math.max(nodeA.y, nodeB.y)
        );
        
        // Check for minimum vertical separation
        const centerAY = nodeA.y + config.nodeHeight * 0.5;
        const centerBY = nodeB.y + config.nodeHeight * 0.5;
        const verticalDistance = Math.abs(centerBY - centerAY);
        const needsVerticalSeparation = verticalDistance < minVerticalSeparation;
        
        // If nodes are touching (overlapping) or too close vertically, apply vertical force
        if ((overlapX > 0 && overlapY > 0) || needsVerticalSeparation) {
          totalTouching++;
          
          // Calculate vertical force based on overlap or minimum separation needed
          let forceY = 0;
          if (overlapX > 0 && overlapY > 0) {
            // Nodes are overlapping, use overlap-based force
            forceY = overlapY * forceStrength;
          } else if (needsVerticalSeparation) {
            // Nodes are too close vertically, push them apart
            const separationNeeded = minVerticalSeparation - verticalDistance;
            forceY = separationNeeded * forceStrength;
          }
          
          // Push nodes apart vertically (up and down)
          if (nodeA.y < nodeB.y) {
            // nodeA is above nodeB, push nodeA up and nodeB down
            nodeA.y -= forceY;
            nodeB.y += forceY;
          } else {
            // nodeA is below nodeB, push nodeA down and nodeB up
            nodeA.y += forceY;
            nodeB.y -= forceY;
          }
          
          maxForceApplied = Math.max(maxForceApplied, forceY);
          
          if (iteration === 1) {
            if (overlapX > 0 && overlapY > 0) {
              console.log(`  💥 Vertical repulsion (overlap) between ${nodeA.id.split('_').pop()} and ${nodeB.id.split('_').pop()}: forceY=${forceY.toFixed(2)}`);
            } else {
              console.log(`  📏 Vertical separation between ${nodeA.id.split('_').pop()} and ${nodeB.id.split('_').pop()}: forceY=${forceY.toFixed(2)}`);
            }
          }
        }
      }
    }
    
    console.log(`  Iteration ${iteration}: ${totalTouching} touching/close pairs, max force: ${maxForceApplied.toFixed(2)}`);
    
    // Stop if no nodes are touching or too close
    if (totalTouching === 0) {
      console.log(`  No more touching or close nodes after iteration ${iteration}`);
      break;
    }
  }
  
  if (iteration >= maxIterations) {
    console.log(`  Warning: Reached maximum iterations (${maxIterations}) with ${totalTouching} still touching/close`);
  }
  
  // Phase 2: Attraction back to original positions (vertical only)
  console.log('=== PHASE 2: VERTICAL ATTRACTION TO ORIGINAL POSITIONS ===');
  
  layoutNodes.forEach(node => {
    const original = originalPositions.get(node.id);
    if (!original) return;
    
    const deltaY = original.y - node.y;
    
    // Apply vertical attraction only
    const newY = node.y + deltaY * attractionStrength;
    
    if (Math.abs(newY - node.y) > 1) {
      console.log(`  🎯 Vertical attraction for ${node.id.split('_').pop()}: y=${node.y.toFixed(0)}->${newY.toFixed(0)}`);
    }
    
    node.y = newY;
    node.originalY = newY;
  });
  
  console.log('Circular tree forces completed');
  return layoutNodes;
}

// Helper function to position trees as siblings
function positionTreesAsSiblings(treeLayouts: LayoutNode[][], config: LayoutConfig): LayoutNode[] {
  console.log(`Positioning ${treeLayouts.length} trees as siblings`);
  
  const allNodes: LayoutNode[] = [];
  
  // First pass: Analyze all trees to find the overall root range
  const treeAnalyses = treeLayouts.map((treeNodes, treeIndex) => {
    // Find root nodes (nodes with highest Y values - at the bottom)
    const maxY = Math.max(...treeNodes.map(n => n.y));
    const rootNodes = treeNodes.filter(n => Math.abs(n.y - maxY) < 1);
    
    // Calculate root positions
    const rootXs = rootNodes.map(n => n.x);
    const minRootX = Math.min(...rootXs);
    const maxRootX = Math.max(...rootXs);
    const rootWidth = maxRootX - minRootX;
    const rootCenterX = rootXs.reduce((sum, x) => sum + x, 0) / rootXs.length;
    
    // Calculate tree width
    const minX = Math.min(...treeNodes.map(n => n.x));
    const maxX = Math.max(...treeNodes.map(n => n.x + n.width));
    const treeWidth = maxX - minX;
    
    return {
      treeIndex,
      treeNodes,
      rootNodes,
      minRootX,
      maxRootX,
      rootWidth,
      rootCenterX,
      minX,
      maxX,
      treeWidth,
    };
  });
  
  // Find the overall root range across all trees
  const allMinRootX = Math.min(...treeAnalyses.map(t => t.minRootX));
  const allMaxRootX = Math.max(...treeAnalyses.map(t => t.maxRootX));
  const totalRootWidth = allMaxRootX - allMinRootX;
  
  console.log(`Overall root range: ${allMinRootX.toFixed(0)} to ${allMaxRootX.toFixed(0)} (width: ${totalRootWidth.toFixed(0)})`);
  
  // Second pass: Position trees with scaled root alignment
  let currentX = 0;
  
  treeAnalyses.forEach((analysis, index) => {
    console.log(`  Tree ${index + 1}: root range ${analysis.minRootX.toFixed(0)}-${analysis.maxRootX.toFixed(0)}, tree width=${analysis.treeWidth.toFixed(0)}`);
    console.log(`    Root nodes: ${analysis.rootNodes.map(n => n.id.split('_').pop()).join(', ')}`);
    
    // Calculate scale factor to normalize root positions
    const scaleFactor = totalRootWidth > 0 ? analysis.rootWidth / totalRootWidth : 1;
    
    // Calculate offset to align with the lowest root
    const rootOffset = analysis.minRootX - allMinRootX;
    
    // Position tree
    const offsetX = currentX - analysis.minX + (rootOffset * scaleFactor);
    
    analysis.treeNodes.forEach(node => {
      // Scale the node position relative to its root position
      const relativeToRoot = node.x - analysis.minRootX;
      const scaledRelative = relativeToRoot * scaleFactor;
      const finalX = currentX + scaledRelative;
      
      allNodes.push({
        ...node,
        x: finalX,
        originalX: finalX,
      });
    });
    
    // Move to next tree position
    currentX += analysis.treeWidth * scaleFactor + config.horizontalSpacing;
  });
  
  return allNodes;
}

// Helper function to calculate the width of a subtree
function calculateSubtreeWidth(
  perkId: string,
  nodes: Map<string, any>, // Using any for the hierarchy nodes
  config: LayoutConfig,
  visited: Set<string> = new Set() // Added visited parameter
): number {
  // Prevent infinite recursion by tracking visited nodes
  if (visited.has(perkId)) {
    throw new Error(`Circular reference detected for perkId: ${perkId}`);
  }
  
  const perkNode = nodes.get(perkId);
  if (!perkNode) return config.nodeWidth; // Fallback if node not found

  // Add current node to visited set
  visited.add(perkId);

  const children = perkNode.children || [];
  const childSubtreeWidths = children.map((childId: string) => 
    calculateSubtreeWidth(childId, nodes, config, new Set(visited))
  );

  if (childSubtreeWidths.length === 0) {
    return config.nodeWidth; // Leaf node
  }

  let totalWidth = 0;
  childSubtreeWidths.forEach((width: number, index: number) => {
    totalWidth += width;
    if (index < children.length - 1) {
      totalWidth += config.horizontalSpacing;
    }
  });

  return Math.max(totalWidth, config.nodeWidth); // At least as wide as the node itself
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
  
  // Node dragging for debugging
  const onNodeDragStop = React.useCallback((event: any, node: Node) => {
    console.log(`🔧 Node ${node.id} moved to: (${node.position.x.toFixed(0)}, ${node.position.y.toFixed(0)})`);
  }, []);
  
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
    horizontalSpacing: 40, // Reduced from 80 to draw nodes closer together
    verticalSpacing: 200, // Increased from 120 to make graph taller
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
        draggable: true, // Enable dragging for debugging
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
        onNodeDragStop={onNodeDragStop}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
} 