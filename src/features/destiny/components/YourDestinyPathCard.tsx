import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { MapPin } from 'lucide-react'
import { DestinyPathBreadcrumbs } from './DestinyPathBreadcrumbs'
import { DestinyPathList } from './DestinyPathList'
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
            <DestinyPathBreadcrumbs
              path={selectedPath}
              selectedPathLength={selectedPath.length}
              isPlanned={isPlanned}
              onBreadcrumbClick={onBacktrack}
            />

            {/* Selected Path List */}
            <DestinyPathList path={selectedPath} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
