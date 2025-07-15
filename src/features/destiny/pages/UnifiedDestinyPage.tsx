import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { Button } from '@/shared/ui/ui/button'
import { 
  PlayerCreationLayout,
  PlayerCreationContent,
  PlayerCreationItemsSection,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  ItemGrid
} from '@/shared/components/playerCreation'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { DestinyCard } from '../components/DestinyCard'
import { DestinyDetailPanel } from '../components/DestinyDetailPanel'
import { DestinyTreeView } from '../components/DestinyTreeView'
import { DestinyPathBuilder } from '../components/DestinyPathBuilder'
import type { PlayerCreationItem, SearchCategory, SelectedTag } from '@/shared/components/playerCreation/types'
import type { DestinyNode, PlannedNode } from '../types'
import { Card } from '@/shared/ui/ui/card'

export function UnifiedDestinyPage() {
  // Load destiny data from public/data/subclasses.json at runtime
  const [destinyNodes, setDestinyNodes] = useState<DestinyNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plannedNodes, setPlannedNodes] = useState<PlannedNode[]>([])
  const [selectedNode, setSelectedNode] = useState<DestinyNode | undefined>(undefined)

  useEffect(() => {
    async function fetchDestinyData() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/subclasses.json`)
        if (!res.ok) throw new Error('Failed to fetch destiny data')
        const data = await res.json()
        
        // Transform the data to match our DestinyNode interface
        const transformedNodes: DestinyNode[] = data.map((node: any, index: number) => ({
          id: node.globalFormId || `destiny-${index}`,
          name: node.name,
          description: node.description,
          tags: [], // We'll need to add tags based on the content
          prerequisites: node.prerequisites || [],
          nextBranches: [], // We'll need to derive this from prerequisites
          levelRequirement: undefined, // Not in current data
          lore: undefined, // Not in current data
          globalFormId: node.globalFormId
        }))
        
        // Note: nextBranches are now calculated dynamically in the tree view
        // based on the graph structure, so we don't need to pre-calculate them
        
        // Add some basic tags based on content
        transformedNodes.forEach(node => {
          const tags = []
          if (node.description.toLowerCase().includes('magicka')) tags.push('Magic')
          if (node.description.toLowerCase().includes('health')) tags.push('Defensive')
          if (node.description.toLowerCase().includes('stamina')) tags.push('Utility')
          if (node.description.toLowerCase().includes('damage')) tags.push('Offensive')
          if (node.description.toLowerCase().includes('armor')) tags.push('Defensive')
          if (node.description.toLowerCase().includes('spell')) tags.push('Magic')
          if (node.description.toLowerCase().includes('weapon')) tags.push('Combat')
          node.tags = tags
        })
        
        setDestinyNodes(transformedNodes)
      } catch (err) {
        setError('Failed to load destiny data')
        console.error('Error loading destiny data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinyData()
  }, [])

  // Convert destiny nodes to PlayerCreationItem format
  const playerCreationItems: PlayerCreationItem[] = destinyNodes.map(node => ({
    id: node.id,
    name: node.name,
    description: node.description,
    tags: node.tags,
    summary: node.description,
    effects: [],
    associatedItems: [],
    imageUrl: undefined,
    category: undefined
  }))

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const tags = [...new Set(destinyNodes.flatMap(node => node.tags))]
    const prerequisites = [...new Set(destinyNodes.flatMap(node => node.prerequisites))]

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
          description: `Destiny nodes with ${tag} tag`
        }))
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
          description: `Destiny nodes requiring ${prereq}`
        }))
      }
    ]
  }

  const searchCategories = generateSearchCategories()

  const {
    selectedItem,
    viewMode,
    filteredItems,
    currentFilters,
    handleItemSelect,
    handleFiltersChange,
    handleSearch,
    handleViewModeChange
  } = usePlayerCreation({
    items: playerCreationItems,
    filters: []
  })

  // Use the new filters hook
  const {
    handleTagSelect,
    handleTagRemove
  } = usePlayerCreationFilters({
    initialFilters: currentFilters,
    onFiltersChange: handleFiltersChange,
    onSearch: handleSearch
  })

  // Handle planning nodes
  const handlePlanNode = (nodeId: string) => {
    const node = destinyNodes.find(n => n.id === nodeId)
    if (!node) return
    
    setPlannedNodes(prev => {
      const isPlanned = prev.some(p => p.id === nodeId)
      if (isPlanned) {
        return prev.filter(p => p.id !== nodeId)
      } else {
        return [...prev, { 
          id: nodeId, 
          name: node.name, 
          description: node.description,
          levelRequirement: node.levelRequirement 
        }]
      }
    })
  }

  // Handle unplanning nodes
  const handleUnplanNode = (nodeId: string) => {
    setPlannedNodes(prev => prev.filter(p => p.id !== nodeId))
  }

  // Handle node selection in tree view
  const handleTreeNodeClick = (node: DestinyNode) => {
    setSelectedNode(node)
    // Also update the selected item for the detail panel
    const item = playerCreationItems.find(i => i.id === node.id)
    if (item) {
      handleItemSelect(item)
    }
  }

  const renderDestinyCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <DestinyCard 
      item={item} 
      isSelected={isSelected}
      originalNode={destinyNodes.find(node => node.id === item.id)}
      allNodes={destinyNodes}
    />
  )

  const renderDestinyDetailPanel = (item: PlayerCreationItem) => (
    <DestinyDetailPanel 
      item={item}
      originalNode={destinyNodes.find(node => node.id === item.id)}
      onPlanNode={handlePlanNode}
      isPlanned={plannedNodes.some(p => p.id === item.id)}
      allNodes={destinyNodes}
    />
  )

  if (loading) {
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
    <PlayerCreationLayout
      title="Destiny"
      description="Plan your character's destiny through the perk tree. Each node represents a powerful ability or enhancement that will shape your journey."
      className="max-w-none"
    >
      <div className="mb-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="path">Path Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <PlayerCreationFilters
              searchCategories={searchCategories}
              selectedTags={currentFilters.selectedTags}
              viewMode={viewMode}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
              onViewModeChange={handleViewModeChange}
            />

            <PlayerCreationContent>
              <PlayerCreationItemsSection>
                <ItemGrid
                  items={filteredItems}
                  viewMode={viewMode}
                  onItemSelect={handleItemSelect}
                  selectedItem={selectedItem}
                  renderItemCard={renderDestinyCard}
                />
              </PlayerCreationItemsSection>

              <PlayerCreationDetailSection>
                {selectedItem ? (
                  renderDestinyDetailPanel(selectedItem)
                ) : (
                  <PlayerCreationEmptyDetail />
                )}
              </PlayerCreationDetailSection>
            </PlayerCreationContent>
          </TabsContent>
          
          <TabsContent value="tree" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Destiny Tree</h3>
                {plannedNodes.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {plannedNodes.length} nodes planned
                  </div>
                )}
              </div>
              {plannedNodes.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setPlannedNodes([])}
                >
                  Clear Plan
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] overflow-auto">
                  <DestinyTreeView
                    nodes={destinyNodes}
                    plannedNodes={plannedNodes}
                    selectedNode={selectedNode}
                    onNodeClick={handleTreeNodeClick}
                    onNodePlan={handlePlanNode}
                  />
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                {selectedNode ? (
                  <DestinyDetailPanel
                    item={playerCreationItems.find(i => i.id === selectedNode.id)!}
                    originalNode={selectedNode}
                    onPlanNode={handlePlanNode}
                    isPlanned={plannedNodes.some(p => p.id === selectedNode.id)}
                    allNodes={destinyNodes}
                  />
                ) : (
                  <PlayerCreationEmptyDetail />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="path" className="space-y-4">
            <DestinyPathBuilder
              nodes={destinyNodes}
              plannedNodes={plannedNodes}
              onNodePlan={handlePlanNode}
              onNodeUnplan={handleUnplanNode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PlayerCreationLayout>
  )
} 