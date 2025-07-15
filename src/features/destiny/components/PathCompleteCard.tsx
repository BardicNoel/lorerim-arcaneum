import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import type { DestinyNode } from '../types'

interface PathCompleteCardProps {
  selectedPath: DestinyNode[]
  currentOptions: DestinyNode[]
  onStartNewPath: () => void
}

export function PathCompleteCard({ 
  selectedPath, 
  currentOptions,
  onStartNewPath 
}: PathCompleteCardProps) {
  // Only show if there's a selected path AND no further options available
  if (selectedPath.length === 0 || currentOptions.length > 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Path Complete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You've reached the end of this path. "{selectedPath[selectedPath.length - 1].name}" has no further progression options.
          </p>
          <Button onClick={onStartNewPath}>
            Start New Path
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 