import {
  BuildPageShell,
  PlayerCreationFilters,
} from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
  SearchCategory,
} from '@/shared/components/playerCreation/types'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { DestinyAccordionList } from '../components/composition/DestinyAccordionList'
import { DestinyCard } from '../components/composition/DestinyCard'
import { DestinyDetailPanel } from '../components/composition/DestinyDetailPanel'
import { DestinyPathBuilder } from '../components/composition/DestinyPathBuilder'
import { DestinyFilters } from '../components/composition/DestinyFilters'
import type { DestinyNode, PlannedNode } from '../types'
import { useDestinyNodes } from '../adapters/useDestinyNodes'
import { useDestinyPath } from '../adapters/useDestinyPath'
import { useDestinyPossiblePaths } from '../adapters/useDestinyPossiblePaths'
import { useDestinyFilters, type DestinyFilter } from '../adapters/useDestinyFilters'

export function UnifiedDestinyPage() {
  // Use MVA adapters for data and state management
  const { nodes, isLoading, error } = useDestinyNodes()
  const {
    currentPath,
    isValidPath,
    pathErrors,
    setPath,
    clearPath,
  } = useDestinyPath({
    validatePath: true,
  })

  // Get possible paths from current position
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode: currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined,
  })

  // Convert destiny nodes to PlayerCreationItem format for reference view
  const playerCreationItems: PlayerCreationItem[] = nodes.map(node => ({
    id: node.id,
    name: node.name,
    description: node.description,
    tags: node.tags,
    summary: node.description,
    effects: [],
    associatedItems: [],
    imageUrl: undefined,
    category: undefined,
  }))

  // Use destiny filters for build path
  const buildPathFilters = useDestinyFilters({
    filterType: 'build-path',
    currentPath,
  })

  // Use destiny filters for reference page
  const referenceFilters = useDestinyFilters({
    filterType: 'reference',
  })

  // Generate search categories for autocomplete (legacy - will be replaced by filters)
  const generateSearchCategories = (): SearchCategory[] => {
    const tags = [...new Set(nodes.flatMap(node => node.tags))]
    const prerequisites = [
      ...new Set(nodes.flatMap(node => node.prerequisites)),
    ]

    return [
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Search by tag...',
        options: tags.map(tag => ({
          id: `tag-${tag}`,
          label: tag,
          value: tag,
          category: 'Tags',
          description: `Destiny nodes with ${tag} tag`,
        })),
      },
      {
        id: 'prerequisites',
        name: 'Prerequisites',
        placeholder: 'Search by prerequisite...',
        options: prerequisites.map(prereq => ({
          id: `prereq-${prereq}`,
          label: prereq,
          value: prereq,
          category: 'Prerequisites',
          description: `Destiny nodes requiring ${prereq}`,
        })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

  const {
    selectedItem,
    viewMode: defaultViewMode,
    filteredItems,
    currentFilters,
    handleItemSelect,
    handleFiltersChange,
    handleSearch,
    handleViewModeChange,
  } = usePlayerCreation({
    items: playerCreationItems,
    filters: [],
  })

  // Override view mode to default to list for destiny reference
  const viewMode = 'list'

  // Use the new filters hook
  const { handleTagSelect, handleTagRemove } = usePlayerCreationFilters({
    initialFilters: currentFilters,
    onFiltersChange: handleFiltersChange,
    onSearch: handleSearch,
  })

  // Handle destiny filter selection
  const handleDestinyFilterSelect = (option: any, filterType: 'build-path' | 'reference') => {
    const filters = filterType === 'build-path' ? buildPathFilters : referenceFilters
    
    if (typeof option === 'string') {
      // Custom search - not implemented for destiny filters yet
      return
    }

    // Create destiny filter from selected option
    let destinyFilterType: 'includes-node' | 'ends-with-node' | 'tags' | 'prerequisites'
    let nodeId: string

    if (option.category === 'Includes Node') {
      destinyFilterType = 'includes-node'
      nodeId = option.id.replace(/^includes-/, '')
    } else if (option.category === 'Ends With Node') {
      destinyFilterType = 'ends-with-node'
      nodeId = option.id.replace(/^ends-/, '')
    } else if (option.category === 'Tags') {
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

    filters.addFilter(filter)
  }

  // Handle destiny filter removal
  const handleDestinyFilterRemove = (filterId: string, filterType: 'build-path' | 'reference') => {
    const filters = filterType === 'build-path' ? buildPathFilters : referenceFilters
    filters.removeFilter(filterId)
  }

  // Handle destiny filter clear
  const handleDestinyFilterClear = (filterType: 'build-path' | 'reference') => {
    const filters = filterType === 'build-path' ? buildPathFilters : referenceFilters
    filters.clearFilters()
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
              onFilterSelect={(option) => handleDestinyFilterSelect(option, 'reference')}
              onFilterRemove={(filterId) => handleDestinyFilterRemove(filterId, 'reference')}
              onClearFilters={() => handleDestinyFilterClear('reference')}
            />
            <div className="w-full">
              <DestinyAccordionList
                items={filteredItems}
                allNodes={nodes}
              />
            </div>
          </TabsContent>

          <TabsContent value="path" className="space-y-4">
            <DestinyFilters
              searchCategories={buildPathFilters.searchCategories}
              selectedFilters={buildPathFilters.selectedFilters}
              onFilterSelect={(option) => handleDestinyFilterSelect(option, 'build-path')}
              onFilterRemove={(filterId) => handleDestinyFilterRemove(filterId, 'build-path')}
              onClearFilters={() => handleDestinyFilterClear('build-path')}
            />
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
