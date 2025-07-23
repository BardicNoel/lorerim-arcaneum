import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { DestinyBreadcrumbTrail, DestinySelectedPathList } from '../atomic'
import { DestinyPossiblePathsList } from './DestinyPossiblePathsList'
import { useDestinyPath } from '../../adapters/useDestinyPath'
import { useDestinyPossiblePaths } from '../../adapters/useDestinyPossiblePaths'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import type { DestinyNode } from '../../types'

interface DestinyPathBuilderProps {
  onPathChange?: (path: DestinyNode[]) => void
  onPathComplete?: (path: DestinyNode[]) => void
  className?: string
  compact?: boolean
}

export function DestinyPathBuilder({
  onPathChange,
  onPathComplete,
  className = '',
  compact = false,
}: DestinyPathBuilderProps) {
  const {
    currentPath,
    currentNode,
    availableNodes,
    isValidPath,
    pathErrors,
    addNodeToPath,
    removeNodeFromPath,
    setPath,
    clearPath,
    goToPathIndex,
    isPathComplete,
    getPathSummary,
  } = useDestinyPath()

  // Get possible paths from current position
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode: currentNode || undefined,
  })

  // Get all nodes for breadcrumb trail
  const { nodes } = useDestinyNodes()

  // Handle path selection
  const handlePathClick = (path: DestinyNode[], clickedIndex: number) => {
    let newPath: DestinyNode[]
    
    if (currentPath.length === 0) {
      // No current path - user is starting fresh
      // Set the path up to the clicked index
      newPath = path.slice(0, clickedIndex + 1)
    } else {
      // Has current path - user is extending from current position
      if (clickedIndex === 0) {
        // User clicked on the first node (current node) - no change needed
        return
      }
      
      // Get the nodes to add (skip the first node since it's the current node)
      const nodesToAdd = path.slice(1, clickedIndex + 1)
      newPath = [...currentPath, ...nodesToAdd]
    }
    
    // Set the entire path at once (bypasses individual node validation)
    setPath(newPath)
    
    onPathChange?.(newPath)
    
    // Check if path is complete
    if (isPathComplete) {
      onPathComplete?.(newPath)
    }
  }

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index: number) => {
    goToPathIndex(index)
    onPathChange?.(currentPath)
  }

  // Handle clearing path
  const handleClearPath = () => {
    clearPath()
    onPathChange?.([])
  }

  const pathSummary = getPathSummary()

  // Compact mode for build page
  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Selected Path List */}
        <DestinySelectedPathList path={currentPath} />
        
        {/* Clear Path Button */}
        {currentPath.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearPath}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Path
            </Button>
          </div>
        )}

        {/* Possible Remaining Paths */}
        {possiblePaths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Possible Remaining Paths</h4>
            <ScrollArea className="h-[200px]">
              <div className="p-4">
                <DestinyPossiblePathsList
                  possiblePaths={possiblePaths}
                  selectedPathLength={currentPath.length}
                  onPathClick={handlePathClick}
                  variant="compact"
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Path Validation Errors - Compact */}
        {!isValidPath && pathErrors.length > 0 && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3" />
              <span className="font-medium">Path Errors:</span>
            </div>
            <ul className="space-y-0.5">
              {pathErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // Full mode for dedicated destiny page
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Path Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Destiny Path Builder
            </CardTitle>
            <div className="flex items-center gap-2">
              {currentPath.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPath}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Path
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Breadcrumb Trail */}
          <DestinyBreadcrumbTrail
            path={currentPath}
            allNodes={nodes}
            onBreadcrumbClick={handleBreadcrumbClick}
            className="mb-4"
          />

          {/* Path Summary */}
          {currentPath.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Path Length: {currentPath.length}</span>
              <span>•</span>
              <span>Start: {pathSummary.startNode?.name}</span>
              <span>•</span>
              <span>Current: {pathSummary.endNode?.name}</span>
              {isPathComplete && (
                <>
                  <span>•</span>
                  <Badge variant="default" className="text-xs">
                    Complete
                  </Badge>
                </>
              )}
            </div>
          )}

          {/* Path Validation Errors */}
          {!isValidPath && pathErrors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Path Validation Errors:</span>
              </div>
              <ul className="text-sm space-y-1">
                {pathErrors.map((error, index) => (
                  <li key={index} className="text-destructive">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Path Display */}
      {currentPath.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPath.map((node, index) => (
                <div
                  key={node.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">{node.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {node.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Possible Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentPath.length === 0 ? 'Choose Your Starting Point' : 'Possible Paths'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentPath.length === 0
              ? 'Select a root destiny node to begin your path'
              : possiblePaths.length === 0
                ? 'You have reached the end of this destiny path'
                : `Explore ${possiblePaths.length} possible paths from your current position`
            }
          </p>
        </CardHeader>
        <CardContent className="h-[600px] p-0">
          {possiblePaths.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Path Complete!</p>
              <p className="text-sm">You've reached the end of this destiny path.</p>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6">
                <DestinyPossiblePathsList
                  possiblePaths={possiblePaths}
                  selectedPathLength={currentPath.length}
                  onPathClick={handlePathClick}
                />
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 