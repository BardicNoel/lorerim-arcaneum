import React from 'react'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { DestinyNode } from './DestinyNode'
import type { DestinyNode as DestinyNodeType } from '../../types'

interface DestinyListItemProps {
  node: DestinyNodeType
  variant?: 'default' | 'compact'
  showPrerequisites?: boolean
  showNextNodes?: boolean
  allNodes?: DestinyNodeType[]
  className?: string
}

export function DestinyListItem({
  node,
  variant = 'default',
  showPrerequisites = false,
  showNextNodes = false,
  allNodes = [],
  className = '',
}: DestinyListItemProps) {
  const baseClasses = `transition-all duration-200 hover:bg-muted/50`

  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border ${baseClasses} ${className}`}
      >
        <DestinyNode
          node={node}
          variant="compact"
          showTags={true}
          className="flex-1 min-w-0"
        />

        {/* Mobile: Show key info in a more compact way */}
        <div className="flex sm:hidden gap-2 text-base text-muted-foreground">
          {node.prerequisites.length > 0 && (
            <span>Prereq: {node.prerequisites.length}</span>
          )}
          {showNextNodes &&
            allNodes.some(n => n.prerequisites.includes(node.name)) && (
              <span>
                Next:{' '}
                {
                  allNodes.filter(n => n.prerequisites.includes(node.name))
                    .length
                }
              </span>
            )}
          {showNextNodes &&
            !allNodes.some(n => n.prerequisites.includes(node.name)) && (
              <span>Terminal</span>
            )}
        </div>
      </div>
    )
  }

  return (
    <Card className={`${baseClasses} ${className}`}>
      <CardContent className="p-4">
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
