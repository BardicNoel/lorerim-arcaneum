import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { DestinyBreadcrumbTrail } from '../atomic/DestinyBreadcrumbTrail'
import { DestinyNodeCard } from './DestinyNodeCard'
import { DestinyNodeHoverCard } from '../atomic/DestinyNodeHoverCard'
import { useDestinyPath } from '../../adapters/useDestinyPath'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import { ArrowLeft, Plus, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import type { DestinyNode } from '../../types'

interface DestinyPathBuilderProps {
  onPathChange?: (path: DestinyNode[]) => void
  onPathComplete?: (path: DestinyNode[]) => void
  className?: string
}

export function DestinyPathBuilder({
  onPathChange,
  onPathComplete,
  className = '',
}: DestinyPathBuilderProps) {
  const {
    currentPath,
    currentNode,
    availableNodes,
    isValidPath,
    pathErrors,
    addNodeToPath,
    removeNodeFromPath,
    clearPath,
    goToPathIndex,
    isPathComplete,
    getPathSummary,
  } = useDestinyPath()

  const { nodes } = useDestinyNodes()

  // Handle adding node to path
  const handleAddNode = (node: DestinyNode) => {
    const success = addNodeToPath(node)
    if (success) {
      onPathChange?.(currentPath)
      
      // Check if path is complete
      if (isPathComplete) {
        onPathComplete?.(currentPath)
      }
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
                  {index < currentPath.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNodeFromPath(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Nodes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentPath.length === 0 ? 'Choose Your Starting Point' : 'Available Next Steps'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentPath.length === 0
              ? 'Select a root destiny node to begin your path'
              : `Choose from ${availableNodes.length} available nodes to continue your path`
            }
          </p>
        </CardHeader>
        <CardContent>
          {availableNodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Path Complete!</p>
              <p className="text-sm">You've reached the end of this destiny path.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableNodes.map((node) => (
                <DestinyNodeHoverCard
                  key={node.id}
                  node={node}
                  allNodes={nodes}
                >
                  <div>
                    <DestinyNodeCard
                      node={node}
                      variant="detailed"
                      showPrerequisites={true}
                      showNextNodes={true}
                      allNodes={nodes}
                      className="cursor-pointer"
                    />
                    <div className="mt-2">
                      <Button
                        onClick={() => handleAddNode(node)}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Path
                      </Button>
                    </div>
                  </div>
                </DestinyNodeHoverCard>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 