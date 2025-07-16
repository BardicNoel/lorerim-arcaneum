import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { PerkNode } from "./PerkNode";
import type { PerkTree, PerkNode as PerkNodeType } from "../types";

interface PerkTreeCanvasProps {
  tree: PerkTree | undefined;
  onTogglePerk: (perkId: string) => void;
  selectedPerks: PerkNodeType[];
}

const nodeTypes: NodeTypes = {
  perkNode: PerkNode,
};

// Tree node structure for building the forest
interface TreeNode {
  perk: PerkNodeType;
  level: number;
  children: string[]; // perkIds
  parents: string[]; // perkIds
}

// Build tree structure and assign levels
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
  
  // Build parent-child relationships
  perks.forEach(perk => {
    const node = treeNodes.get(perk.perkId)!;
    
    // Debug: Log connections for this perk
    console.log(`Connections for "${perk.perkName}":`, {
      perkId: perk.perkId,
      connections: perk.connections,
      connectionTargets: perk.connections.map(index => 
        index < perks.length ? perks[index].perkName : `Invalid index: ${index}`
      )
    });
    
    // Find children by looking at connections
    perk.connections.forEach(targetIndex => {
      if (targetIndex < perks.length) {
        const childPerk = perks[targetIndex];
        node.children.push(childPerk.perkId);
        
        // Add this node as parent to child
        const childNode = treeNodes.get(childPerk.perkId)!;
        childNode.parents.push(perk.perkId);
      }
    });
  });
  
  // Find root nodes (nodes with no parents in the same tree)
  const roots: string[] = [];
  treeNodes.forEach((node, perkId) => {
    const hasParentInTree = node.parents.some(parentId => 
      treeNodes.has(parentId)
    );
    if (!hasParentInTree) {
      roots.push(perkId);
    }
    
    // Debug: Log prerequisite analysis for each perk
    console.log(`Perk "${node.perk.perkName}" (${perkId}):`, {
      hasPrerequisites: (node.perk.prerequisites?.perks?.length || 0) > 0,
      prerequisitePerks: node.perk.prerequisites?.perks || [],
      parentIds: node.parents,
      hasParentInTree,
      isRoot: !hasParentInTree
    });
  });
  
  console.log('Tree analysis:', {
    totalNodes: perks.length,
    rootNodes: roots.map(id => treeNodes.get(id)!.perk.perkName),
    rootCount: roots.length
  });
  
  // Assign levels starting from roots
  const visited = new Set<string>();
  
  function assignLevels(nodeId: string, level: number) {
    if (visited.has(nodeId)) {
      const node = treeNodes.get(nodeId)!;
      // If already visited, use the shallowest level
      if (level < node.level || node.level === -1) {
        node.level = level;
      } else {
        return; // Already processed at a better level
      }
    } else {
      visited.add(nodeId);
      treeNodes.get(nodeId)!.level = level;
    }
    
    // Recursively assign levels to children
    const node = treeNodes.get(nodeId)!;
    node.children.forEach(childId => {
      assignLevels(childId, level + 1);
    });
  }
  
  // Start from all roots
  roots.forEach(rootId => {
    assignLevels(rootId, 0);
  });
  
  // Debug: Log level distribution
  const levelDistribution = new Map<number, string[]>();
  treeNodes.forEach((node, perkId) => {
    if (node.level >= 0) {
      if (!levelDistribution.has(node.level)) {
        levelDistribution.set(node.level, []);
      }
      levelDistribution.get(node.level)!.push(node.perk.perkName);
    }
  });
  
  console.log('Level distribution:', Object.fromEntries(levelDistribution));
  
  return treeNodes;
}

// Layout nodes by branch level
function calculateNodePositions(perks: PerkNodeType[]) {
  const positions = new Map<string, { x: number; y: number }>();
  
  if (perks.length === 0) return positions;
  
  // Build tree structure and assign levels
  const treeNodes = buildTreeStructure(perks);
  
  // Group nodes by level
  const levels = new Map<number, PerkNodeType[]>();
  treeNodes.forEach((treeNode, perkId) => {
    const level = treeNode.level;
    if (level >= 0) {
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(treeNode.perk);
    }
  });
  
  console.log('Levels layout:', {
    levelCount: levels.size,
    maxLevel: Math.max(...levels.keys()),
    levelSizes: Object.fromEntries(
      Array.from(levels.entries()).map(([level, perks]) => [level, perks.length])
    )
  });
  
  // Calculate spacing
  const nodeWidth = 120;
  const nodeHeight = 80;
  const horizontalSpacing = nodeWidth + 30;
  const verticalSpacing = nodeHeight + 40;
  const padding = 50;
  
  // Position nodes by level
  const maxLevel = Math.max(...levels.keys());
  
  levels.forEach((levelPerks, level) => {
    const y = level * verticalSpacing + padding;
    
    // Calculate total width needed for this level
    const totalWidth = (levelPerks.length - 1) * horizontalSpacing;
    const startX = padding;
    
    // Position each perk in this level
    levelPerks.forEach((perk, index) => {
      const x = startX + (index * horizontalSpacing);
      positions.set(perk.perkId, { x, y });
      
      // Debug: Log first few positions
      if (level <= 2 && index < 3) {
        console.log(`Positioned ${perk.perkName} at level ${level}: (${x}, ${y})`);
      }
    });
  });
  
  return positions;
}

export function PerkTreeCanvas({
  tree,
  onTogglePerk,
  selectedPerks,
}: PerkTreeCanvasProps) {
  // Calculate node positions to avoid collisions
  const nodePositions = useMemo(() => {
    if (!tree) return new Map();
    return calculateNodePositions(tree.perks);
  }, [tree]);

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!tree) return [];
    
    return tree.perks.map((perk) => {
      const position = nodePositions.get(perk.perkId) || { x: 0, y: 0 };
      const isSelected = selectedPerks.some(p => p.perkId === perk.perkId);
      
      return {
        id: perk.perkId,
        type: "perkNode",
        position,
        data: {
          ...perk,
          selected: isSelected,
        },
      };
    });
  }, [tree, nodePositions, selectedPerks]);

  // Create React Flow edges from connections
  const initialEdges: Edge[] = useMemo(() => {
    if (!tree) return [];
    
    const edges: Edge[] = [];
    tree.perks.forEach((perk) => {
      perk.connections.forEach((targetIndex) => {
        if (targetIndex < tree.perks.length) {
          const targetPerk = tree.perks[targetIndex];
          edges.push({
            id: `${perk.perkId}-${targetPerk.perkId}`,
            source: perk.perkId,
            target: targetPerk.perkId,
            type: "smoothstep",
            style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
          });
        }
      });
    });
    
    return edges;
  }, [tree]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when tree or selected perks change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when tree changes
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const perkData = node.data as PerkNodeType;
    onTogglePerk(perkData.perkId);
  }, [onTogglePerk]);

  if (!tree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Select a skill to view its perk tree</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
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