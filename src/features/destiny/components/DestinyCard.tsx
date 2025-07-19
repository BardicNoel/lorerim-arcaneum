import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { DestinyNode } from '../types'

interface DestinyCardProps {
  item: PlayerCreationItem
  isSelected: boolean
  originalNode?: DestinyNode
  allNodes?: DestinyNode[]
  viewMode?: 'grid' | 'list'
}

export function DestinyCard({
  item,
  isSelected,
  originalNode,
  allNodes = [],
  viewMode = 'grid',
}: DestinyCardProps) {
  // Get next nodes by finding nodes that have this node as a prerequisite
  const getNextNodes = (nodeName: string) => {
    return allNodes
      .filter(node => node.prerequisites.includes(nodeName))
      .map(node => node.name)
  }

  if (viewMode === 'list') {
    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
        }`}
      >
        {/* Name and Description - Always visible */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate text-base">
            {item.name}
          </h3>
          <p className="text-base text-muted-foreground line-clamp-1 sm:line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Badge Groups - Responsive layout */}
        <div className="flex flex-wrap gap-2 sm:gap-3 sm:flex-shrink-0">
          {/* Prerequisites - Show on medium screens and up */}
          {originalNode && originalNode.prerequisites.length > 0 && (
            <div className="hidden md:flex gap-1">
              {originalNode.prerequisites.slice(0, 1).map((prereq, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                >
                  {prereq}
                </Badge>
              ))}
              {originalNode.prerequisites.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  +{originalNode.prerequisites.length - 1}
                </Badge>
              )}
            </div>
          )}

          {/* Next Nodes - Show on large screens and up */}
          {originalNode && (
            <div className="hidden lg:flex gap-1">
              {getNextNodes(originalNode.name)
                .slice(0, 1)
                .map((nextNode, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {nextNode}
                  </Badge>
                ))}
              {getNextNodes(originalNode.name).length > 1 && (
                <Badge variant="outline" className="text-xs">
                  +{getNextNodes(originalNode.name).length - 1}
                </Badge>
              )}
              {getNextNodes(originalNode.name).length === 0 && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Terminal
                </Badge>
              )}
            </div>
          )}

          {/* Tags - Responsive to available space */}
          {item.tags.length > 0 && (
            <div className="flex gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{item.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Mobile: Show key info in a more compact way */}
        <div className="flex sm:hidden gap-2 text-base text-muted-foreground">
          {originalNode && originalNode.prerequisites.length > 0 && (
            <span>Prereq: {originalNode.prerequisites.length}</span>
          )}
          {originalNode && getNextNodes(originalNode.name).length > 0 && (
            <span>Next: {getNextNodes(originalNode.name).length}</span>
          )}
          {originalNode && getNextNodes(originalNode.name).length === 0 && (
            <span>Terminal</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {item.name}
            </h3>
            {item.category && (
              <p className="text-sm text-muted-foreground mb-2">
                {item.category}
              </p>
            )}
          </div>
          {item.imageUrl && (
            <div className="w-8 h-8 ml-2">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Prerequisites */}
        {originalNode && originalNode.prerequisites.length > 0 && (
          <div className="mb-2">
            <p className="text-xs font-medium text-foreground mb-1">
              Prerequisites:
            </p>
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
          <div className="mb-2">
            <p className="text-xs font-medium text-foreground mb-1">
              Leads to:
            </p>
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
                <span className="text-xs text-muted-foreground">
                  No further progression
                </span>
              )}
            </div>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {item.effects && item.effects.length > 0 && (
          <div className="space-y-1">
            {item.effects.slice(0, 2).map((effect, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    effect.type === 'positive'
                      ? 'bg-green-500'
                      : effect.type === 'negative'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                  }`}
                />
                {effect.name}
              </div>
            ))}
            {item.effects.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{item.effects.length - 2} more effects
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
