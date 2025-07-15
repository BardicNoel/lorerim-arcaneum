import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/ui/accordion';
import { ScrollArea } from '@/shared/ui/ui/scroll-area';
import { Badge } from '@/shared/ui/ui/badge';
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types';
import type { DestinyNode } from '../types';

interface DestinyAccordionListProps {
  items: PlayerCreationItem[];
  allNodes: DestinyNode[];
}

function DestinyNodeDetails({ item, originalNode, allNodes }: { 
  item: PlayerCreationItem; 
  originalNode?: DestinyNode; 
  allNodes: DestinyNode[] 
}) {
  // Get next nodes by finding nodes that have this node as a prerequisite
  const getNextNodes = (nodeName: string) => {
    return allNodes
      .filter(node => node.prerequisites.includes(nodeName))
      .map(node => node.name)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Prerequisites */}
      {originalNode && originalNode.prerequisites.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Prereq:</span>
          <div className="flex flex-wrap gap-1">
            {originalNode.prerequisites.map((prereq, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
              >
                {prereq}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Next Nodes */}
      {originalNode && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Leads to:</span>
          <div className="flex flex-wrap gap-1">
            {getNextNodes(originalNode.name).map((nextNode, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                {nextNode}
              </Badge>
            ))}
            {getNextNodes(originalNode.name).length === 0 && (
              <span className="text-xs text-muted-foreground">Terminal</span>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DestinyAccordionList({ items, allNodes }: DestinyAccordionListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base text-foreground truncate hover:underline">{item.name}</div>
                <div className="text-base text-muted-foreground truncate">{item.description}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DestinyNodeDetails
                item={item}
                originalNode={allNodes.find((n) => n.id === item.id)}
                allNodes={allNodes}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
} 