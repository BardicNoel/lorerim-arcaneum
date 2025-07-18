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

interface PerkTreeCanvasProps {
  tree: PerkTree | undefined;
  onTogglePerk: (perkId: string) => void;
  onRankChange?: (perkId: string, newRank: number) => void;
  selectedPerks: PerkNodeType[];
}

// Simplified tree node structure
interface TreeNode {
  perk: PerkNodeType;
  level: number; // Calculated from tree structure (0 = roots, higher = deeper)
  children: string[]; // perk IDs from connections array
  parents: string[]; // calculated from reverse connections
}

  // Build tree structure using the current data format
function buildTreeStructure(perks: PerkNodeType[]): Map<string, TreeNode> {
  const treeNodes = new Map<string, TreeNode>();
  
  // Initialize all nodes with temporary level
  perks.forEach(perk => {
    const perkId = perk.edid;
    treeNodes.set(perkId, {
      perk,
      level: 0, // Will be calculated based on tree structure
      children: [],
      parents: []
    });
  });
    
      // Build parent-child relationships from connections object
  perks.forEach(perk => {
    const perkId = perk.edid;
    const node = treeNodes.get(perkId)!;
    
    // Handle connections object (new format)
    if (perk.connections && perk.connections.children) {
      perk.connections.children.forEach((childId: string) => {
        // Skip self-references
        if (childId === perkId) return;
        
        // Check if this child exists in our tree
        if (treeNodes.has(childId)) {
          // Add this node as parent to the child
          const childNode = treeNodes.get(childId)!;
          childNode.parents.push(perkId);
          
          // Add the child to this node's children
          node.children.push(childId);
        }
      });
    }
  });

  // Calculate levels based on tree structure
  const calculateLevels = () => {
    const visited = new Set<string>();
    const queue: { perkId: string; level: number }[] = [];
    
    // Start with root nodes (nodes with no parents)
    treeNodes.forEach((node, perkId) => {
      if (node.parents.length === 0) {
        queue.push({ perkId, level: 0 });
        visited.add(perkId);
      }
    });
    
    // Process queue to calculate levels
    while (queue.length > 0) {
      const { perkId, level } = queue.shift()!;
      const node = treeNodes.get(perkId)!;
      
      // Set the level
      node.level = level;
      
      // Add children to queue with level + 1
      node.children.forEach(childId => {
        if (!visited.has(childId)) {
          queue.push({ perkId: childId, level: level + 1 });
          visited.add(childId);
        }
      });
    }
    
    // Handle any disconnected nodes
    treeNodes.forEach((node, perkId) => {
      if (!visited.has(perkId)) {
        node.level = 0; // Put disconnected nodes at root level
      }
    });
  };
  
  calculateLevels();
  
  // Identify root nodes (nodes with no parents)
  const roots: string[] = [];
  treeNodes.forEach((node, perkId) => {
    if (node.parents.length === 0) {
      roots.push(perkId);
    }
  });
  
  // Calculate level distribution
  const levelDistribution = Array.from(treeNodes.values()).reduce((acc, node) => {
    acc[node.level] = (acc[node.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  console.log('Tree structure built:', {
    totalNodes: treeNodes.size,
    rootNodes: roots.length,
    levelDistribution
  });
  
  return treeNodes;
}

// Multi-parent aware layout algorithm
function calculateNodePositions(perks: PerkNodeType[]) {
  const positions = new Map<string, { x: number; y: number }>();
  
  if (perks.length === 0) return positions;
  
  // Build tree structure
  const treeNodes = buildTreeStructure(perks);
  
  // Find max depth
  const maxDepth = Math.max(...Array.from(treeNodes.values()).map(node => node.level));
  
  // Calculate spacing
  const nodeWidth = 140;
  const nodeHeight = 80;
  const horizontalSpacing = nodeWidth * 0.5; // 50% of node width (70px)
  const verticalSpacing = nodeHeight + 20;
  const padding = 50;
  
  // Calculate the maximum number of nodes at any level
  const nodesByLevel = new Map<number, string[]>();
  treeNodes.forEach((node, perkId) => {
    const level = node.level;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(perkId);
  });
  
  const maxNodesAtLevel = Math.max(...Array.from(nodesByLevel.values()).map(nodes => nodes.length));
  
  // Calculate total graph width needed
  const totalGraphWidth = maxNodesAtLevel * nodeWidth + (maxNodesAtLevel - 1) * horizontalSpacing + 2 * padding;
  
  // Calculate subtree widths for each node
  const subtreeWidths = new Map<string, number>();
  
  // Calculate subtree width recursively (bottom-up)
  const calculateSubtreeWidth = (perkId: string): number => {
    if (subtreeWidths.has(perkId)) {
      return subtreeWidths.get(perkId)!;
    }
    
    const node = treeNodes.get(perkId)!;
    if (node.children.length === 0) {
      // Leaf node - width is just the node width
      subtreeWidths.set(perkId, nodeWidth);
      return nodeWidth;
    }
    
    // Calculate total width of all children
    let totalChildrenWidth = 0;
    node.children.forEach(childId => {
      totalChildrenWidth += calculateSubtreeWidth(childId);
    });
    
    // Add spacing between children
    if (node.children.length > 1) {
      totalChildrenWidth += (node.children.length - 1) * horizontalSpacing;
    }
    
    // Use the larger of: node width or children width
    const subtreeWidth = Math.max(nodeWidth, totalChildrenWidth);
    subtreeWidths.set(perkId, subtreeWidth);
    return subtreeWidth;
  };
  
  // Calculate subtree widths for all nodes
  treeNodes.forEach((node, perkId) => {
    calculateSubtreeWidth(perkId);
  });
  
  // Position nodes level by level (bottom-up approach)
  const positionedNodes = new Set<string>();
  
  // Start with root nodes (level 0)
  const rootNodes = Array.from(treeNodes.entries())
    .filter(([_, node]) => node.parents.length === 0)
    .map(([perkId, _]) => perkId);
  
  if (rootNodes.length > 0) {
    // Calculate total width needed for all root nodes
    let totalRootWidth = 0;
    rootNodes.forEach(perkId => {
      totalRootWidth += subtreeWidths.get(perkId)!;
    });
    
    // Add spacing between root nodes
    if (rootNodes.length > 1) {
      totalRootWidth += (rootNodes.length - 1) * horizontalSpacing;
    }
    
    // Center the root nodes within the total graph width
    const graphCenterX = totalGraphWidth / 2;
    const rootStartX = graphCenterX - (totalRootWidth / 2);
    
    // Position root nodes
    let currentX = rootStartX;
    rootNodes.forEach(perkId => {
      const subtreeWidth = subtreeWidths.get(perkId)!;
      const centerX = currentX + (subtreeWidth / 2);
      const y = (maxDepth - 0) * verticalSpacing + padding;
      const x = centerX - (nodeWidth / 2);
      
      positions.set(perkId, { x, y });
      positionedNodes.add(perkId);
      currentX += subtreeWidth + horizontalSpacing;
    });
  }
  
  // Position remaining levels
  for (let level = 1; level <= maxDepth; level++) {
    const levelNodes = nodesByLevel.get(level) || [];
    
    levelNodes.forEach(perkId => {
      if (positionedNodes.has(perkId)) return;
      
      const node = treeNodes.get(perkId)!;
      const y = (maxDepth - level) * verticalSpacing + padding;
      
      // Calculate center position based on parents
      if (node.parents.length > 0) {
        let totalParentX = 0;
        let validParents = 0;
        
        node.parents.forEach(parentId => {
          if (positions.has(parentId)) {
            const parentPos = positions.get(parentId)!;
            totalParentX += parentPos.x + (nodeWidth / 2); // Center of parent
            validParents++;
          }
        });
        
        if (validParents > 0) {
          // Center between all parents
          const centerX = totalParentX / validParents;
          const x = centerX - (nodeWidth / 2);
          positions.set(perkId, { x, y });
          positionedNodes.add(perkId);
        }
      }
    });
  }
  
  return positions;
}

// Create a wrapper component that receives callbacks
const createPerkNodeComponent = (onTogglePerk?: (perkId: string) => void, onRankChange?: (perkId: string, newRank: number) => void) => {
  return (props: any) => <PerkNode {...props} onTogglePerk={onTogglePerk} onRankChange={onRankChange} />;
};

// Memoized node types to prevent React Flow warnings
const createNodeTypes = (onTogglePerk?: (perkId: string) => void, onRankChange?: (perkId: string, newRank: number) => void): NodeTypes => ({
  perkNode: createPerkNodeComponent(onTogglePerk, onRankChange),
});

export function PerkTreeCanvas({
  tree,
  onTogglePerk,
  onRankChange,
  selectedPerks,
}: PerkTreeCanvasProps) {
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
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    if (!validatedTree) return new Map();
    return calculateNodePositions(validatedTree.perks);
  }, [validatedTree]);

  // Create React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!validatedTree) return [];
    
    // Build tree structure to get children information
    const treeNodes = buildTreeStructure(validatedTree.perks);
    
    const nodes = validatedTree.perks.map((perk) => {
      const perkId = perk.edid;
      const perkName = perk.name;
      const position = nodePositions.get(perkId) || { x: 0, y: 0 };
      
      // Get tree node info for handle rendering
      const treeNode = treeNodes.get(perkId);
      const hasChildren = treeNode ? treeNode.children.length > 0 : false;
      const isRoot = treeNode ? treeNode.parents.length === 0 : false;
      
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
    

    return nodes;
  }, [validatedTree, nodePositions]);

  // Create React Flow edges from connections array
  const initialEdges: Edge[] = useMemo(() => {
    if (!validatedTree) return [];
    
    const edges: Edge[] = [];
    
    console.log('Creating edges for tree:', validatedTree.treeName);
    console.log('Total perks:', validatedTree.perks.length);
    
    validatedTree.perks.forEach((perk) => {
      const perkId = perk.edid;
      const perkName = perk.name;
      
      console.log(`Processing perk: ${perkName} (${perkId})`);
      console.log('Connections:', perk.connections);
      
      // Handle connections object (new format)
      if (perk.connections && perk.connections.children && perk.connections.children.length > 0) {
        console.log(`Found ${perk.connections.children.length} children for ${perkName}`);
        
        perk.connections.children.forEach((childId: string) => {
          // Skip self-references
          if (childId === perkId) {
            console.log(`Skipping self-reference for ${perkName}`);
            return;
          }
          
          // Check if child exists in our tree
          const childExists = validatedTree.perks.some(p => p.edid === childId);
          if (childExists) {
            const childPerk = validatedTree.perks.find(p => p.edid === childId);
            console.log(`Creating edge: ${perkName} -> ${childPerk?.name} (${childId})`);
            
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
          } else {
            console.log(`Child ${childId} not found in tree for ${perkName}`);
          }
        });
      } else {
        console.log(`No connections for ${perkName}`);
      }
    });
    
    console.log(`Created ${edges.length} edges total`);
    console.log('Edge details:', edges.map(e => `${e.source} -> ${e.target}`));
    
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
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.3,
          maxZoom: 1.5
        });
      }, 100);
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