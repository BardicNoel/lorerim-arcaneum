import React, { useCallback, useMemo, useState } from "react";
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
import { SelectedPerkPreview } from "./SelectedPerkPreview";
import type { PerkTree, PerkNode as PerkNodeType } from "../types";

interface PerkTreeCanvasProps {
  tree: PerkTree | undefined;
  onTogglePerk: (perkId: string) => void;
  onUpdateRank: (perkId: string, newRank: number) => void;
  selectedPerks: PerkNodeType[];
}

const nodeTypes: NodeTypes = {
  perkNode: PerkNode,
};

// Use existing position data from perks with scaling
function calculateNodePositions(perks: PerkNodeType[]) {
  const positions = new Map<string, { x: number; y: number }>();
  
  // Find the bounds of the position data
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  perks.forEach(perk => {
    const pos = perk.position;
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
  });
  
  // Calculate scaling factors for better spacing
  const scaleX = 150; // Horizontal spacing between nodes
  const scaleY = 120; // Vertical spacing between nodes
  
  // Position each perk using its original coordinates with scaling
  perks.forEach(perk => {
    const pos = perk.position;
    const x = (pos.x - minX) * scaleX;
    const y = (pos.y - minY) * scaleY;
    positions.set(perk.perkId, { x, y });
  });

  return positions;
}

export function PerkTreeCanvas({
  tree,
  onTogglePerk,
  onUpdateRank,
  selectedPerks,
}: PerkTreeCanvasProps) {
  const [selectedPerk, setSelectedPerk] = useState<PerkNodeType | null>(null);

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
    setSelectedPerk(perkData);
  }, []);

  if (!tree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Select a skill to view its perk tree</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4">
      {/* React Flow Canvas */}
      <div className="flex-1 bg-background rounded-lg border">
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
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.5,
            maxZoom: 1.5
          }}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Selected Perk Preview */}
      <div className="w-80">
        <SelectedPerkPreview
          selectedPerk={selectedPerk}
          onTogglePerk={onTogglePerk}
          onUpdateRank={onUpdateRank}
        />
      </div>
    </div>
  );
} 