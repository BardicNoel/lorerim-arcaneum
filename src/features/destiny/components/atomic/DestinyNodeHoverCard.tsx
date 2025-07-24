import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/ui/hover-card'
import { DestinyNode } from './DestinyNode'
import type { DestinyNode as DestinyNodeType } from '../../types'

interface DestinyNodeHoverCardProps {
  node: DestinyNodeType
  allNodes: DestinyNodeType[]
  children: React.ReactNode
  showPrerequisites?: boolean
  showNextNodes?: boolean
  showTags?: boolean
  className?: string
}

export function DestinyNodeHoverCard({
  node,
  allNodes,
  children,
  showPrerequisites = true,
  showNextNodes = true,
  showTags = true,
  className = '',
}: DestinyNodeHoverCardProps) {
  const getNextNodes = (nodeName: string) => {
    return allNodes.filter(n => n.prerequisites.includes(nodeName))
  }

  const getPrerequisiteNodes = (nodeName: string) => {
    return allNodes.filter(n => node.prerequisites.includes(n.name))
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className={`w-80 p-0 ${className}`}>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {node.name}
                </h3>
              </div>
              {node.icon && (
                <div className="w-8 h-8 ml-2">
                  <img
                    src={node.icon}
                    alt={node.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            {/* Description */}
            <p className="text-sm text-muted-foreground">{node.description}</p>

            {/* Prerequisites */}
            {showPrerequisites && node.prerequisites.length > 0 && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Prerequisites:
                </p>
                <div className="flex flex-wrap gap-1">
                  {getPrerequisiteNodes(node.name).map(prereq => (
                    <Badge
                      key={prereq.id}
                      variant="outline"
                      className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                    >
                      {prereq.name}
                    </Badge>
                  ))}
                  {/* Show missing prerequisites */}
                  {node.prerequisites
                    .filter(
                      prereqName => !allNodes.some(n => n.name === prereqName)
                    )
                    .map((prereqName, index) => (
                      <Badge
                        key={`missing-${index}`}
                        variant="outline"
                        className="text-xs bg-gray-50 text-gray-500 border-gray-200"
                      >
                        {prereqName}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Next Nodes */}
            {showNextNodes && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Leads to:
                </p>
                <div className="flex flex-wrap gap-1">
                  {getNextNodes(node.name).map(nextNode => (
                    <Badge
                      key={nextNode.id}
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {nextNode.name}
                    </Badge>
                  ))}
                  {getNextNodes(node.name).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      No further progression
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {showTags && node.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-foreground mb-1">
                  Tags:
                </p>
                <div className="flex flex-wrap gap-1">
                  {node.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>ID: {node.id}</p>
              {node.globalFormId && <p>Form ID: {node.globalFormId}</p>}
            </div>
          </CardContent>
        </Card>
      </HoverCardContent>
    </HoverCard>
  )
}
