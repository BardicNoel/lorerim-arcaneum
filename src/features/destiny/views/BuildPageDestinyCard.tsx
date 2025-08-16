import { FormattedText } from '@/shared/components/generic/FormattedText'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { AlertCircle, ExternalLink, RotateCcw } from 'lucide-react'
import React from 'react'
import { useDestinyNodes } from '../adapters/useDestinyNodes'
import { useDestinyPath } from '../adapters/useDestinyPath'
import { useDestinyPossiblePaths } from '../adapters/useDestinyPossiblePaths'
import { DestinyBreadcrumbTrail } from '../components/atomic/DestinyBreadcrumbTrail'
import { DestinyPossiblePathsList } from '../components/composition/DestinyPossiblePathsList'
import type { DestinyNode } from '../types'

interface BuildPageDestinyCardProps {
  navigate: (to: string) => void
}

const BuildPageDestinyCard: React.FC<BuildPageDestinyCardProps> = ({
  navigate,
}) => {
  const { build, setDestinyPath } = useCharacterBuild()
  const { nodes, isLoading, error } = useDestinyNodes()

  // Convert build.destinyPath (string[]) to DestinyNode[]
  const currentPath = React.useMemo(() => {
    return build.destinyPath
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is DestinyNode => !!n)
  }, [build.destinyPath, nodes])

  // Use the MVA destiny path hook
  const {
    isValidPath,
    pathErrors,
    setPath: setPathNodes,
    clearPath,
    currentPath: pathState,
    currentNode,
  } = useDestinyPath({
    initialPath: currentPath,
    validatePath: true,
  })

  // Get possible paths from current position
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode: currentNode || undefined,
  })

  // Handle path changes
  const handlePathChange = (path: DestinyNode[]) => {
    const pathIds = path.map(node => node.id)
    setDestinyPath(pathIds as string[])
  }

  // Handle path selection
  const handlePathClick = (path: DestinyNode[], clickedIndex: number) => {
    let newPath: DestinyNode[]

    if (pathState.length === 0) {
      // No current path - user is starting fresh
      newPath = path.slice(0, clickedIndex + 1)
    } else {
      // Has current path - user is extending from current position
      if (clickedIndex === 0) {
        // User clicked on the first node (current node) - no change needed
        return
      }

      // Get the nodes to add (skip the first node since it's the current node)
      const nodesToAdd = path.slice(1, clickedIndex + 1)
      newPath = [...pathState, ...nodesToAdd]
    }

    // Set the entire path at once
    setPathNodes(newPath)
    handlePathChange(newPath)
  }

  // Handle clearing path
  const handleClearPath = () => {
    clearPath()
    setDestinyPath([])
  }

  // Handle breadcrumb click - navigate back to that point in the path
  const handleBreadcrumbClick = (index: number) => {
    const newPath = pathState.slice(0, index + 1)
    setPathNodes(newPath)
    handlePathChange(newPath)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg">Destiny</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/destiny')}
            className="text-sm whitespace-nowrap cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground">Loading destiny data...</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="space-y-4">
            {/* Breadcrumb Trail */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Selected Path
              </h4>
              <DestinyBreadcrumbTrail
                path={pathState}
                allNodes={nodes}
                variant="compact"
                onBreadcrumbClick={handleBreadcrumbClick}
              />
            </div>

            {/* Simple List - Name and Description Only */}
            {pathState.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Path Details ({pathState.length} nodes)
                  </h4>
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
                <div className="space-y-2">
                  {pathState.map((node, index) => (
                    <div key={node.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-foreground">
                            {node.name}
                          </h5>
                          {node.description && (
                            <FormattedText
                              text={node.description}
                              className="text-xs text-muted-foreground mt-1"
                              as="p"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Possible Paths - Streamlined */}
            {possiblePaths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {pathState.length === 0
                    ? 'Choose Your Starting Point'
                    : 'Continue Your Path'}
                </h4>
                <ScrollArea className="h-[400px]">
                  <div className="p-2">
                    <DestinyPossiblePathsList
                      possiblePaths={possiblePaths}
                      selectedPathLength={pathState.length}
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

            {/* Empty State */}
            {pathState.length === 0 && possiblePaths.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No destiny paths available</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/destiny')}
                  className="mt-2"
                >
                  Browse All Destinies
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default BuildPageDestinyCard
