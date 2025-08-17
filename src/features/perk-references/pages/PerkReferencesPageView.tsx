import { BuildPageShell } from '@/shared/components/playerCreation'
import { AccordionGrid } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import { ArrowLeft, Grid3X3, List } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePerkReferencesData } from '../adapters/usePerkReferencesData'
import { PerkReferenceAccordionCard } from '../components/atomic/PerkReferenceAccordionCard'
import { perkToPlayerCreationItem } from '../utils/perkToPlayerCreationItem'

export function PerkReferencesPageView() {
  const navigate = useNavigate()
  const { build } = useCharacterBuild()

  const { allPerks, loading, error } = usePerkReferencesData()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Convert to PlayerCreationItem format
  const displayItems = allPerks.map(perk => {
    const item = perkToPlayerCreationItem(perk, build)
    return { ...item, originalPerk: perk }
  })

  // Handle accordion expansion
  const [expandedPerks, setExpandedPerks] = useState<Set<string>>(new Set())

  const handlePerkToggle = (perkId: string) => {
    const newExpanded = new Set(expandedPerks)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the AccordionGrid columns prop
      const itemIndex = displayItems.findIndex(item => item.id === perkId)
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(rowStartIndex + columns, displayItems.length)

      // Check if any item in the row is currently expanded
      const isRowExpanded = displayItems
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        displayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        displayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.add(item.id)
        })
      }
    } else {
      // In list mode, just toggle the single item
      if (newExpanded.has(perkId)) {
        newExpanded.delete(perkId)
      } else {
        newExpanded.add(perkId)
      }
    }

    setExpandedPerks(newExpanded)
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    setExpandedPerks(new Set()) // Reset expansion when changing view mode
  }

  if (loading) {
    return (
      <BuildPageShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading perk data...</div>
        </div>
      </BuildPageShell>
    )
  }

  if (error) {
    return (
      <BuildPageShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error loading perk data: {error}
          </div>
        </div>
      </BuildPageShell>
    )
  }

  return (
    <BuildPageShell
      title="Perk References"
      description="Browse all available perks. Find the perfect abilities for your character build."
    >
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Results count */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {displayItems.length} perk{displayItems.length !== 1 ? 's' : ''}{' '}
            found
          </span>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Results Section */}
        {viewMode === 'grid' ? (
          <AccordionGrid columns={3} gap="md">
            {displayItems.map(item => (
              <PerkReferenceAccordionCard
                key={item.id}
                item={item}
                isExpanded={expandedPerks.has(item.id)}
                onToggle={() => handlePerkToggle(item.id)}
                viewMode="grid"
              />
            ))}
          </AccordionGrid>
        ) : (
          <div className="space-y-2">
            {displayItems.map(item => (
              <PerkReferenceAccordionCard
                key={item.id}
                item={item}
                isExpanded={expandedPerks.has(item.id)}
                onToggle={() => handlePerkToggle(item.id)}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
    </BuildPageShell>
  )
}
