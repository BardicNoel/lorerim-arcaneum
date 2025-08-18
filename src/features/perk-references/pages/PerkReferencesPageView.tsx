import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type { SearchCategory } from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ArrowLeft, ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePerkReferencesData } from '../adapters/usePerkReferencesData'
import { usePerkReferencesFilters } from '../adapters/usePerkReferencesFilters'
import { PerkReferenceAccordionCard } from '../components/atomic/PerkReferenceAccordionCard'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { perkToPlayerCreationItem } from '../utils/perkToPlayerCreationItem'

export function PerkReferencesPageView() {
  const navigate = useNavigate()
  const { build } = useCharacterBuild()

  const { allPerks, loading, error } = usePerkReferencesData()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'alphabetical' | 'skill-tree' | 'level'>(
    'alphabetical'
  )

  // Use the existing filters hook
  const {
    selectedTags,
    searchQuery,
    onTagSelect,
    onTagRemove,
    onClearTags,
    onSearchChange,
  } = usePerkReferencesFilters()

  // Generate search categories for autocomplete
  const searchCategories: SearchCategory[] = useMemo(() => {
    const allSkillTrees = [...new Set(allPerks.map(perk => perk.skillTreeName))]
    const allTags = [...new Set(allPerks.flatMap(perk => perk.tags))]
    const allMinLevels = [
      ...new Set(allPerks.map(perk => perk.minLevel || 0)),
    ].sort((a, b) => a - b)

    return [
      {
        id: 'keywords',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or tags...',
        options: allTags.map(tag => ({
          id: `keyword-${tag}`,
          label: tag,
          value: tag,
          category: 'Fuzzy Search',
          description: `Perks with ${tag} tag`,
        })),
      },
      {
        id: 'skill-trees',
        name: 'Skill Trees',
        placeholder: 'Filter by skill tree...',
        options: allSkillTrees.map(skillTree => ({
          id: `skill-${skillTree}`,
          label: skillTree,
          value: skillTree,
          category: 'Skill Trees',
          description: `Perks from ${skillTree} skill tree`,
        })),
      },
      {
        id: 'min-levels',
        name: 'Minimum Level',
        placeholder: 'Filter by minimum level...',
        options: allMinLevels.map(level => ({
          id: `level-${level}`,
          label: `Level ${level}+`,
          value: level.toString(),
          category: 'Minimum Level',
          description: `Perks requiring level ${level} or higher`,
        })),
      },
    ]
  }, [allPerks])

  // Apply fuzzy search
  const { filteredPerks } = useFuzzySearch(allPerks, searchQuery)

  // Convert to PlayerCreationItem format
  const displayItems = filteredPerks.map(perk => {
    const item = perkToPlayerCreationItem(perk, build)
    return { ...item, originalPerk: perk }
  })

  // Sort the display items
  const sortedDisplayItems = useMemo(() => {
    const sorted = [...displayItems]
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'skill-tree':
        return sorted.sort((a, b) => {
          const aTree = a.originalPerk.skillTreeName
          const bTree = b.originalPerk.skillTreeName
          return aTree.localeCompare(bTree) || a.name.localeCompare(b.name)
        })
      case 'level':
        return sorted.sort((a, b) => {
          const aLevel = a.originalPerk.minLevel || 0
          const bLevel = b.originalPerk.minLevel || 0
          return aLevel - bLevel || a.name.localeCompare(b.name)
        })
      default:
        return sorted
    }
  }, [displayItems, sortBy])

  // Handle accordion expansion
  const [expandedPerks, setExpandedPerks] = useState<Set<string>>(new Set())

  const handlePerkToggle = (perkId: string) => {
    const newExpanded = new Set(expandedPerks)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the AccordionGrid columns prop
      const itemIndex = sortedDisplayItems.findIndex(item => item.id === perkId)
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(
        rowStartIndex + columns,
        sortedDisplayItems.length
      )

      // Check if any item in the row is currently expanded
      const isRowExpanded = sortedDisplayItems
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
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

  // Get sort label
  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'alphabetical':
        return 'Alphabetical (A-Z)'
      case 'skill-tree':
        return 'Skill Tree'
      case 'level':
        return 'Level'
      default:
        return 'Alphabetical (A-Z)'
    }
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
    <BuildPageShell title="Perk References">
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

      {/* 1. Search Bar Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={onTagSelect}
            onCustomSearch={onSearchChange}
          />
        </div>
      </div>

      {/* 2. View Controls Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: View Mode Toggle */}
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

        {/* Right: Sort Options */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Sort: {getSortLabel(sortBy)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('skill-tree')}>
                Skill Tree
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('level')}>
                Level
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3. Selected Tags Section */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={onClearTags}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
              title="Clear all filters"
            >
              <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
              Clear All
            </button>

            {/* Individual Tags */}
            {selectedTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                onClick={() => onTagRemove(tag.id)}
                title="Click to remove"
              >
                {tag.label}
                <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                  ×
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Content Area */}
      <div className="mt-6">
        {/* Results Section */}
        {viewMode === 'grid' ? (
          <AccordionGrid columns={3} gap="md">
            {sortedDisplayItems.map(item => (
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
            {sortedDisplayItems.map(item => (
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
