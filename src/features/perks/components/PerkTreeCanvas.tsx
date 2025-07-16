import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import type {
  Node,
  Edge,
  Connection,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/shared/ui/ui/button';
import { Maximize2 } from 'lucide-react';
import { PerkNode as PerkNodeComponent } from './PerkNode';
import type { PerkNode } from '../types';

interface PerkTreeCanvasProps {
  perks: PerkNode[];
  selectedSkill: string;
  onPerkToggle: (perkId: string) => void;
  onPerkRankChange: (perkId: string, newRank: number) => void;
}

const nodeTypes: NodeTypes = {
  perkNode: PerkNodeComponent,
};

export function PerkTreeCanvas({
  perks,
  selectedSkill,
  onPerkToggle,
  onPerkRankChange,
}: PerkTreeCanvasProps) {
  // Filter perks for the selected skill
  const skillPerks = useMemo(() => 
    perks.filter(perk => perk.skill === selectedSkill), 
    [perks, selectedSkill]
  );

  // Transform perks to React Flow nodes
  const initialNodes: Node[] = useMemo(() => 
    skillPerks.map((perk) => ({
      id: perk.id,
      type: 'perkNode',
      position: perk.position,
      data: {
        ...perk,
        onToggle: () => onPerkToggle(perk.id),
        onRankChange: (newRank: number) => onPerkRankChange(perk.id, newRank),
      },
    })), 
    [skillPerks, onPerkToggle, onPerkRankChange]
  );

  // Create edges from prerequisites
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    skillPerks.forEach(perk => {
      perk.prerequisites.forEach(prereqId => {
        const prereqPerk = skillPerks.find(p => p.id === prereqId);
        if (prereqPerk) {
          edges.push({
            id: `${prereqId}-${perk.id}`,
            source: prereqId,
            target: perk.id,
            type: 'smoothstep',
            style: {
              stroke: perk.selected ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              strokeWidth: 2,
            },
          });
        }
      });
    });
    
    return edges;
  }, [skillPerks]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when perks change
  useMemo(() => {
    const updatedNodes = skillPerks.map((perk) => ({
      id: perk.id,
      type: 'perkNode',
      position: perk.position,
      data: {
        ...perk,
        onToggle: () => onPerkToggle(perk.id),
        onRankChange: (newRank: number) => onPerkRankChange(perk.id, newRank),
      },
    }));
    setNodes(updatedNodes);
  }, [skillPerks, onPerkToggle, onPerkRankChange, setNodes]);

  // Update edges when perks change
  useMemo(() => {
    const updatedEdges: Edge[] = [];
    
    skillPerks.forEach(perk => {
      perk.prerequisites.forEach(prereqId => {
        const prereqPerk = skillPerks.find(p => p.id === prereqId);
        if (prereqPerk) {
          updatedEdges.push({
            id: `${prereqId}-${perk.id}`,
            source: prereqId,
            target: perk.id,
            type: 'smoothstep',
            style: {
              stroke: perk.selected ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              strokeWidth: 2,
            },
          });
        }
      });
    });
    
    setEdges(updatedEdges);
  }, [skillPerks, setEdges]);

  const handleFitView = useCallback(() => {
    // This would be handled by React Flow's fitView function
    console.log('Fit to view');
  }, []);

  if (skillPerks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No perks available</h3>
          <p className="text-muted-foreground">
            No perks found for the selected skill.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleFitView}
          title="Fit to view"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
} 