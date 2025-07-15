import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/ui/hover-card'
import type { DestinyNode } from '../types'

interface DestinyNodeHoverCardProps {
  node: DestinyNode
  isPlanned: boolean
  children: React.ReactNode
}

export function DestinyNodeHoverCard({ 
  node, 
  isPlanned, 
  children 
}: DestinyNodeHoverCardProps) {
  return (
    <HoverCard openDelay={100} closeDelay={0}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-lg">{node.name}</h4>
            <Badge 
              variant={isPlanned ? "default" : "outline"}
              className="text-xs"
            >
              {isPlanned ? "Planned" : "Not Planned"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {node.description}
          </p>
          
          {/* Prerequisites */}
          {node.prerequisites.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Prerequisites:</p>
              <div className="flex flex-wrap gap-1">
                {node.prerequisites.map((prereq, index) => (
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
          
          {/* Tags */}
          {node.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Tags:</p>
              <div className="flex flex-wrap gap-1">
                {node.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 