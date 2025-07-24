import { BuildPageShell } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { useMemo } from 'react'
import {
  useDestinyFilters,
  type DestinyFilter,
} from '../adapters/useDestinyFilters'
import { useDestinyNodes } from '../adapters/useDestinyNodes'
import { useDestinyPath } from '../adapters/useDestinyPath'
import { useDestinyPossiblePaths } from '../adapters/useDestinyPossiblePaths'
import { DestinyAccordionList } from '../components/composition/DestinyAccordionList'
import { DestinyCard } from '../components/composition/DestinyCard'
import { DestinyDetailPanel } from '../components/composition/DestinyDetailPanel'
import { DestinyFilters } from '../components/composition/DestinyFilters'
import { DestinyPathBuilder } from '../components/composition/DestinyPathBuilder'
import type { DestinyNode } from '../types'

export function UnifiedDestinyPage() {
  // Use MVA adapters for data and state management
  const { nodes, isLoading, error } = useDestinyNodes()
  const { currentPath, isValidPath, pathErrors, setPath, clearPath } =
    useDestinyPath({
      validatePath: true,
    })

  // Get possible paths from current position
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode:
      currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
  })

  // Use destiny filters for reference page
  const referenceFilters = useDestinyFilters({
    filterType: 'reference',
  })

  // Filter nodes for reference page based on destiny filters
  const filteredNodes = useMemo(() => {
    if (referenceFilters.selectedFilters.length === 0) {
      return nodes
    }

    return nodes.filter(node => {
      return referenceFilters.selectedFilters.every(filter => {
        switch (filter.type) {
          case 'tags':
            // Node must have the specified tag
            return node.tags.includes(filter.nodeName)

          case 'prerequisites':
            // Node must require the specified prerequisite
            return node.prerequisites.includes(filter.nodeName)

          default:
            return true
        }
      })
    })
  }, [nodes, referenceFilters.selectedFilters])

  // Convert filtered nodes to PlayerCreationItem format for reference view
  const filteredPlayerCreationItems: PlayerCreationItem[] = filteredNodes.map(
    node => ({
      id: node.id,
      name: node.name,
      description: node.description,
      tags: node.tags,
      summary: node.description,
      effects: [],
      associatedItems: [],
      imageUrl: undefined,
      category: undefined,
    })
  )

  const { viewMode: defaultViewMode } = usePlayerCreation({
    items: filteredPlayerCreationItems,
    filters: [],
  })

  // Override view mode to default to list for destiny reference
  const viewMode = 'list'

  // Handle destiny filter selection for reference page
  const handleDestinyFilterSelect = (option: any) => {
    if (typeof option === 'string') {
      // Custom search - not implemented for destiny filters yet
      return
    }

    // Create destiny filter from selected option
    let destinyFilterType: 'tags' | 'prerequisites'
    let nodeId: string

    if (option.category === 'Tags') {
      destinyFilterType = 'tags'
      nodeId = option.id.replace(/^tag-/, '')
    } else if (option.category === 'Prerequisites') {
      destinyFilterType = 'prerequisites'
      nodeId = option.id.replace(/^prereq-/, '')
    } else {
      return // Unknown category
    }

    const filter: DestinyFilter = {
      id: option.id,
      type: destinyFilterType,
      nodeName: option.value,
      nodeId: nodeId,
      label: option.label,
    }

    referenceFilters.addFilter(filter)
  }

  // Handle destiny filter removal for reference page
  const handleDestinyFilterRemove = (filterId: string) => {
    referenceFilters.removeFilter(filterId)
  }

  // Handle destiny filter clear for reference page
  const handleDestinyFilterClear = () => {
    referenceFilters.clearFilters()
  }

  // Handle path changes
  const handlePathChange = (path: DestinyNode[]) => {
    setPath(path)
  }

  // Handle path completion
  const handlePathComplete = (path: DestinyNode[]) => {
    setPath(path)
  }

  // Handle planning nodes (for advanced features)
  const handlePlanNode = (nodeId: string) => {
    // This could be expanded for advanced planning features
    console.log('Planning node:', nodeId)
  }

  const renderDestinyCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <DestinyCard
      item={item}
      isSelected={isSelected}
      originalNode={nodes.find(node => node.id === item.id)}
      allNodes={nodes}
      viewMode={viewMode}
    />
  )

  const renderDestinyDetailPanel = (item: PlayerCreationItem) => (
    <DestinyDetailPanel
      item={item}
      originalNode={nodes.find(node => node.id === item.id)}
      onPlanNode={handlePlanNode}
      isPlanned={false} // Could be expanded for planning features
      allNodes={nodes}
    />
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading destiny data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <BuildPageShell
      title="Destiny"
      description="Plan your character's destiny through the perk tree. Each node represents a powerful ability or enhancement that will shape your journey."
    >
      <div className="mb-6">
        <Tabs defaultValue="path" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="path">Path Builder</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="reference" className="space-y-4">
            <DestinyFilters
              searchCategories={referenceFilters.searchCategories}
              selectedFilters={referenceFilters.selectedFilters}
              onFilterSelect={handleDestinyFilterSelect}
              onFilterRemove={handleDestinyFilterRemove}
              onClearFilters={handleDestinyFilterClear}
            />
            <div className="w-full">
              <DestinyAccordionList
                items={filteredPlayerCreationItems}
                allNodes={nodes}
              />
            </div>
          </TabsContent>

          <TabsContent value="path" className="space-y-4">
            <DestinyPathBuilder
              onPathChange={handlePathChange}
              onPathComplete={handlePathComplete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </BuildPageShell>
  )
}
