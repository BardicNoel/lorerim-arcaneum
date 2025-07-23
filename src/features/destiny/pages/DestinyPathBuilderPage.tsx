import React, { useState } from 'react'
import { DestinyPathBuilder } from '../components/composition/DestinyPathBuilder'
import { DestinyPathListItem } from '../components/atomic/DestinyPathListItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { MapPin, CheckCircle } from 'lucide-react'
import { useDestinyNodes } from '../adapters/useDestinyNodes'
import type { DestinyNode } from '../types'

export function DestinyPathBuilderPage() {
  const [completedPaths, setCompletedPaths] = useState<DestinyNode[][]>([])
  const [currentPath, setCurrentPath] = useState<DestinyNode[]>([])
  const { nodes } = useDestinyNodes()

  const handlePathChange = (path: DestinyNode[]) => {
    setCurrentPath(path)
  }

  const handlePathComplete = (path: DestinyNode[]) => {
    setCompletedPaths(prev => [...prev, path])
    setCurrentPath([]) // Reset for next path
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Destiny Path Builder</h1>
          <p className="text-muted-foreground">
            Build your character's destiny path by following node prerequisites
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {completedPaths.length} paths completed
          </Badge>
        </div>
      </div>

      {/* Main Path Builder */}
      <DestinyPathBuilder
        onPathChange={handlePathChange}
        onPathComplete={handlePathComplete}
      />

      {/* Completed Paths */}
      {completedPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Paths ({completedPaths.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                              {completedPaths.map((path, index) => (
                  <DestinyPathListItem
                    key={index}
                    path={path}
                    allNodes={nodes}
                    variant="compact"
                    className="border-l-4 border-l-green-500"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 