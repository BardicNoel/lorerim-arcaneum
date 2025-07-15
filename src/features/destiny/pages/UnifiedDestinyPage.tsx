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
import { DestinyPathBuilder } from '../components/DestinyPathBuilder'
import type { PlayerCreationItem, SearchCategory, SelectedTag } from '@/shared/components/playerCreation/types'
import type { DestinyNode, PlannedNode } from '../types'
import { Card } from '@/shared/ui/ui/card'
import { DestinyAccordionList } from '../components/DestinyAccordionList';

export function UnifiedDestinyPage() {
  // Load destiny data from public/data/subclasses.json at runtime
  const [destinyNodes, setDestinyNodes] = useState<DestinyNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plannedNodes, setPlannedNodes] = useState<PlannedNode[]>([])

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
    viewMode: defaultViewMode,
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

  // Override view mode to default to list for destiny reference
  const viewMode = 'list'

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



  const renderDestinyCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <DestinyCard 
      item={item} 
      isSelected={isSelected}
      originalNode={destinyNodes.find(node => node.id === item.id)}
      allNodes={destinyNodes}
      viewMode={viewMode}
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
        <Tabs defaultValue="path" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="path">Path Builder</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reference" className="space-y-4">
            <PlayerCreationFilters
              searchCategories={searchCategories}
              selectedTags={currentFilters.selectedTags}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
            />
            <div className="w-full">
              <DestinyAccordionList
                items={filteredItems}
                allNodes={destinyNodes}
              />
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