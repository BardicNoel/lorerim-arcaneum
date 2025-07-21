import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { MapPin } from 'lucide-react'
import { DestinyBreadcrumbTrail } from './DestinyPathBreadcrumbs'
import { DestinyNodeHoverCard } from './DestinyNodeHoverCard'
import { DestinyPerkList } from './DestinyPathList'
import type { DestinyNode } from '../types'

interface YourDestinyPathCardProps {
  selectedPath: DestinyNode[]
  rootNodes: DestinyNode[]
  isPlanned: (nodeId: string) => boolean
  onBacktrack: (index: number) => void
  onStartPath: (node: DestinyNode) => void
  action?: React.ReactNode // Optional action area
}

export function YourDestinyPathCard({
  selectedPath,
  rootNodes,
  isPlanned,
  onBacktrack,
  onStartPath,
  action,
}: YourDestinyPathCardProps) {
  return (
    <Card>
      <CardHeader action={action}>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Your Destiny Path
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedPath.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No path started yet</p>
            <Button onClick={() => onStartPath(rootNodes[0])}>
              Start Your Journey
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Breadcrumbs */}
            <DestinyBreadcrumbTrail
              path={selectedPath}
              onNodeClick={onBacktrack}
              BreadcrumbHover={(node, badge) => (
                <DestinyNodeHoverCard node={node} isPlanned={isPlanned(node.id)}>{badge}</DestinyNodeHoverCard>
              )}
            />

            {/* Selected Path List */}
            <DestinyPerkList path={selectedPath} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
