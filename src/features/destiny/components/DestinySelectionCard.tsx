import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/ui/card';
import { Button } from '@/shared/ui/ui/button';
import { DestinyBreadcrumbTrail } from './DestinyPathBreadcrumbs';
import { DestinyNodeHoverCard } from './DestinyNodeHoverCard';
import { DestinyPerkList } from './DestinyPathList';
import { DestinyPossiblePathsList } from './PredictivePathsSection';
import { ScrollArea } from '@/shared/ui/ui/scroll-area';
import { DestinyFilters } from './DestinyFilters';
import type { DestinyNode } from '../types';
import type { SelectedTag } from '@/shared/components/playerCreation/types';
import { RotateCcw } from 'lucide-react';

interface PredictivePath {
  path: DestinyNode[];
  isComplete: boolean;
  endNode: DestinyNode;
}

interface DestinySelectionCardProps {
  selectedPath: DestinyNode[];
  destinyNodes: DestinyNode[];
  buildDestinyPath: string[];
  setDestinyPath: (path: string[]) => void;
  loading: boolean;
  error: string | null;
  navigate: (to: string) => void;
  predictivePaths: PredictivePath[];
  onBuildPathSelect: (path: DestinyNode[], clickedIndex: number) => void;
  isNodePlanned: (nodeId: string) => boolean;
  onBreadcrumbClick: (index: number) => void;
  selectedTags: SelectedTag[];
  onTagSelect: (tag: SelectedTag) => void;
  onTagRemove: (tagId: string) => void;
}

export function DestinySelectionCard({
  destinyNodes,
  buildDestinyPath,
  setDestinyPath,
  loading,
  error,
  navigate,
  predictivePaths,
  onBuildPathSelect,
  isNodePlanned,
  onBreadcrumbClick,
  selectedTags,
  onTagSelect,
  onTagRemove,
}: DestinySelectionCardProps) {
  // Compute the build path as DestinyNode[]
  const buildPath = buildDestinyPath
    .map(id => destinyNodes.find(n => n.id === id))
    .filter((n: DestinyNode | undefined): n is DestinyNode => !!n);

  // Determine if the last node is terminal
  const lastNode = buildPath.length > 0 ? buildPath[buildPath.length - 1] : undefined;
  const isTerminal = lastNode ? destinyNodes.every(n => !n.prerequisites.includes(lastNode.name)) : false;

  // Filter paths based on selected tags
  const filteredPredictivePaths = React.useMemo(() => {
    return predictivePaths.filter(path => {
      // If no tags selected, show all paths
      if (selectedTags.length === 0) return true

      // Check each tag filter
      return selectedTags.every(tag => {
        const [filterType, nodeName] = tag.value.split(':')

        if (filterType === 'contains') {
          // Path must contain the specified node
          return path.path.some(node =>
            node.name.toLowerCase().includes(nodeName.toLowerCase())
          )
        } else if (filterType === 'ends') {
          // Path must end with the specified node (and be complete)
          return (
            path.isComplete &&
            path.endNode.name.toLowerCase().includes(nodeName.toLowerCase())
          )
        }

        return true
      })
    })
  }, [predictivePaths, selectedTags])

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
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-muted-foreground">Loading destiny data...</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <>
            {buildPath.length === 0 ? (
              <>
                <div className="text-muted-foreground font-medium mb-2">Select a node to start building your destiny:</div>
                <ScrollArea className="min-h-[120px] max-h-96 overflow-y-auto pr-2">
                  <DestinyPossiblePathsList
                    possiblePaths={filteredPredictivePaths}
                    selectedPath={[]}
                    isPlanned={isNodePlanned}
                    onBreadcrumbClick={onBuildPathSelect}
                  />
                </ScrollArea>
              </>
            ) : (
              <>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
                    title="Reset Destiny Path"
                    onClick={() => setDestinyPath([])}
                  >
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <DestinyBreadcrumbTrail
                    path={buildPath}
                    BreadcrumbHover={(node, badge) => (
                      <DestinyNodeHoverCard node={node} isPlanned={false}>{badge}</DestinyNodeHoverCard>
                    )}
                    onNodeClick={onBreadcrumbClick}
                  />
                </div>
                {/* Selected */}
                <DestinyPerkList path={buildPath} />
                {!isTerminal && (
                  <>
                    <div className="my-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                    {/* Filters */}
                    <DestinyFilters
                      predictivePaths={predictivePaths}
                      selectedTags={selectedTags}
                      onTagSelect={onTagSelect}
                      onTagRemove={onTagRemove}
                    />
                    {/* Scrollable area with possible paths */}
                    <ScrollArea className="min-h-[120px] max-h-96 overflow-y-auto pr-2">
                      <DestinyPossiblePathsList
                        possiblePaths={filteredPredictivePaths}
                        selectedPath={[]}
                        isPlanned={isNodePlanned}
                        onBreadcrumbClick={onBuildPathSelect}
                      />
                    </ScrollArea>
                  </>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 