import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Button } from '@/shared/ui/ui/button';
import { Badge } from '@/shared/ui/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/ui/hover-card';
import type { PerkNode as PerkNodeType } from '../types';

interface PerkNodeProps {
  data: PerkNodeType;
  selected: boolean;
}

export const PerkNode = memo(({ data, selected }: PerkNodeProps) => {
  const isAvailable = data.prerequisites.length === 0 || data.selected;

  const handleRankIncrement = () => {
    if (data.currentRank < data.maxRank) {
      // This would be handled by the parent component
      console.log('Increment rank for', data.id);
    }
  };

  const handleRankDecrement = () => {
    if (data.currentRank > 0) {
      // This would be handled by the parent component
      console.log('Decrement rank for', data.id);
    }
  };

  return (
    <div
      className={`
        relative min-w-[200px] rounded-lg border-2 p-3 shadow-lg transition-all
        ${selected 
          ? 'border-primary bg-primary/10' 
          : isAvailable 
            ? 'border-green-500 bg-background hover:border-green-400' 
            : 'border-dashed border-gray-400 bg-muted/50 opacity-60'
        }
      `}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-sm ${selected ? 'text-primary' : ''}`}>
                {data.name}
              </h3>
              <Badge variant={selected ? 'default' : 'secondary'} className="text-xs">
                Lv {data.levelRequirement}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {data.description}
            </p>
            
            {data.maxRank > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ranks:</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={handleRankDecrement}
                    disabled={data.currentRank <= 0}
                  >
                    -
                  </Button>
                  <span className="text-xs font-medium min-w-[20px] text-center">
                    {data.currentRank}/{data.maxRank}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={handleRankIncrement}
                    disabled={data.currentRank >= data.maxRank}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}
          </div>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold">{data.name}</h4>
            <p className="text-sm">{data.description}</p>
            <div className="text-xs text-muted-foreground">
              <div>Level Requirement: {data.levelRequirement}</div>
              <div>Max Ranks: {data.maxRank}</div>
              {data.prerequisites.length > 0 && (
                <div>
                  Prerequisites: {data.prerequisites.join(', ')}
                </div>
              )}
            </div>
            {data.effects.length > 0 && (
              <div>
                <div className="font-medium text-xs mb-1">Effects:</div>
                <ul className="text-xs space-y-1">
                  {data.effects.map((effect, index) => (
                    <li key={index}>
                      {effect.type}: {effect.value}% {effect.target}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});

PerkNode.displayName = 'PerkNode'; 