import React, { useState, useMemo } from 'react'
import { useDestinyPath } from '../hooks/useDestinyPath'
import { YourDestinyPathCard } from './YourDestinyPathCard'
import { PredictivePathsSection } from './PredictivePathsSection'
import { PathCompleteCard } from './PathCompleteCard'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import type { DestinyNode, PlannedNode } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

interface DestinyPathBuilderProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  onNodePlan: (nodeId: string) => void
  onNodeUnplan: (nodeId: string) => void
}

export function DestinyPathBuilder({ 
  nodes, 
  plannedNodes, 
  onNodePlan, 
  onNodeUnplan 
}: DestinyPathBuilderProps) {
  const {
    selectedPath,
    rootNodes,
    currentOptions,
    predictivePaths,
    isNodePlanned,
    getCurrentNodeName,
    backtrack,
    handleBreadcrumbClick,
    startPath,
    startNewPath
  } = useDestinyPath({
    nodes,
    plannedNodes,
    onNodePlan,
    onNodeUnplan
  })

  // Use the player creation filters hook for tag management
  const {
    handleTagSelect,
    handleTagRemove,
    filters: { selectedTags }
  } = usePlayerCreationFilters({
    onFiltersChange: () => {}, // No-op since we're not using the full filter system
    onSearch: () => {} // No-op since we're not using the search system
  })

  return (
    <div className="space-y-6">
      {/* Your Destiny Path */}
      <YourDestinyPathCard
        selectedPath={selectedPath}
        rootNodes={rootNodes}
        isPlanned={isNodePlanned}
        onBacktrack={backtrack}
        onStartPath={startPath}
      />

      {/* Predictive Paths */}
      <PredictivePathsSection
        predictivePaths={predictivePaths}
        selectedPath={selectedPath}
        isPlanned={isNodePlanned}
        onBreadcrumbClick={handleBreadcrumbClick}
        getCurrentNodeName={getCurrentNodeName}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
      />

      {/* Path Complete */}
      <PathCompleteCard
        selectedPath={selectedPath}
        currentOptions={currentOptions}
        onStartNewPath={startNewPath}
      />
    </div>
  )
} 