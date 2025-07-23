import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { DestinyNode } from '../atomic/DestinyNode'
import type { DestinyNode as DestinyNodeType } from '../../types'

interface DestinyNodeCardProps {
  node: DestinyNodeType
  variant?: 'default' | 'compact' | 'detailed'
  showPrerequisites?: boolean
  showNextNodes?: boolean
  allNodes?: DestinyNodeType[]
  className?: string
}

export function DestinyNodeCard({
  node,
  variant = 'default',
  showPrerequisites = false,
  showNextNodes = false,
  allNodes = [],
  className = '',
}: DestinyNodeCardProps) {
  const baseClasses = `transition-all duration-200 hover:shadow-lg hover:bg-muted/50`

  if (variant === 'compact') {
    return (
      <Card
        className={`${baseClasses} ${className}`}
      >
        <CardContent className="p-3">
          <DestinyNode
            node={node}
            variant="compact"
            showTags={true}
          />
        </CardContent>
      </Card>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card
        className={`${baseClasses} ${className}`}
      >
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

        <CardContent className="pt-0">
          <DestinyNode
            node={node}
            variant="detailed"
            showTags={true}
            showPrerequisites={showPrerequisites}
            showNextNodes={showNextNodes}
            allNodes={allNodes}
          />
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      className={`${baseClasses} ${className}`}
    >
      <CardContent className="p-4">
        <DestinyNode
          node={node}
          variant="default"
          showTags={true}
        />
      </CardContent>
    </Card>
  )
} 