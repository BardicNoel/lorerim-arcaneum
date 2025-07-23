import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { DestinyNode } from '../../types'

interface DestinyDetailPanelProps {
  item: PlayerCreationItem
  originalNode?: DestinyNode
  onPlanNode?: (nodeId: string) => void
  isPlanned?: boolean
  allNodes?: DestinyNode[]
}

export function DestinyDetailPanel({
  item,
  originalNode,
  onPlanNode,
  isPlanned = false,
  allNodes = [],
}: DestinyDetailPanelProps) {
  // Get next nodes by finding nodes that have this node as a prerequisite
  const getNextNodes = (nodeName: string) => {
    return allNodes
      .filter(node => node.prerequisites.includes(nodeName))
      .map(node => node.name)
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
              {originalNode?.levelRequirement && (
                <p className="text-sm text-muted-foreground mb-2">
                  Required Level: {originalNode.levelRequirement}
                </p>
              )}
            </div>
            {item.imageUrl && (
              <div className="w-12 h-12 ml-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.effects && item.effects.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Effects</h4>
              <div className="space-y-2">
                {item.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded bg-muted/50"
                  >
                    <span
                      className={`inline-block w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        effect.type === 'positive'
                          ? 'bg-green-500'
                          : effect.type === 'negative'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{effect.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {effect.description}
                      </p>
                      {effect.value && (
                        <p className="text-xs text-muted-foreground">
                          Value: {effect.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {originalNode && (
            <>
              {originalNode.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Prerequisites</h4>
                  <div className="flex flex-wrap gap-2">
                    {originalNode.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {originalNode && getNextNodes(originalNode.name).length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Next Branches</h4>
                  <div className="flex flex-wrap gap-2">
                    {getNextNodes(originalNode.name).map((branch, index) => (
                      <Badge key={index} variant="outline">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {originalNode.lore && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Lore</h4>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {originalNode.lore}
                  </p>
                </div>
              )}
            </>
          )}

          {onPlanNode && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => onPlanNode(item.id)}
                variant={isPlanned ? 'outline' : 'default'}
                className="w-full"
              >
                {isPlanned ? 'Remove from Plan' : 'Add to Plan'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
