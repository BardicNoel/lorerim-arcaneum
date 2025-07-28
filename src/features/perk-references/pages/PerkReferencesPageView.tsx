import { cn } from '@/lib/utils'
import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import { ArrowLeft, Grid3X3, List, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePerkReferencesData } from '../adapters/usePerkReferencesData'
import { PerkReferenceAccordionCard } from '../components/atomic/PerkReferenceAccordionCard'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { PerkReferenceNode } from '../types'
import { perkToPlayerCreationItem } from '../utils/perkToPlayerCreationItem'

export function PerkReferencesPageView() {
  const navigate = useNavigate()
  const { build } = useCharacterBuild()

  const { allPerks, loading, error } = usePerkReferencesData()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const allSkillTrees = [...new Set(allPerks.map(perk => perk.skillTreeName))]
    const allTags = [...new Set(allPerks.flatMap(perk => perk.tags))]
    const allMinLevels = [...new Set(allPerks.map(perk => perk.minLevel || 0))].sort((a, b) => a - b)

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
  }

  const searchCategories = generateSearchCategories()

  // --- Custom tag/filter state for fuzzy search ---
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Add a tag (from autocomplete or custom input)
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search',
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    // Prevent duplicate tags
    if (
      !selectedTags.some(
        t => t.value === tag.value && t.category === tag.category
      )
    ) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply all filters to perks
  const filteredPerksWithTags = allPerks.filter((perk: PerkReferenceNode) => {
    // If no tags are selected, show all perks
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Skill Trees':
          // Filter by skill tree
          return perk.skillTreeName === tag.value

        case 'Minimum Level':
          // Filter by minimum level
          const level = parseInt(tag.value)
          return !isNaN(level) && (perk.minLevel || 0) >= level

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered perks
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredPerks: fuzzyFilteredPerks } = useFuzzySearch(
    filteredPerksWithTags as PerkReferenceNode[],
    fuzzySearchQuery
  )

  // Convert to PlayerCreationItem format
  const displayItems = fuzzyFilteredPerks.map(perk => {
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

  // Clear all tags
  const handleClearTags = () => {
    setSelectedTags([])
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    setExpandedPerks(new Set()) // Reset expansion when changing view mode
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading perk data...</p>
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
      title="Perk References"
      description="Browse and search all available perks. Find the perfect abilities for your character build."
    >
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
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

        {/* Search and Filters Section */}
        <div className="space-y-4">
          {/* Custom MultiAutocompleteSearch */}
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
            className="w-full"
          />

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Clear All Button */}
              <button
                onClick={handleClearTags}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
                title="Clear all filters"
              >
                <svg className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear All
              </button>

              {/* Individual Tags */}
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                  onClick={() => handleTagRemove(tag.id)}
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

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {displayItems.length} perk{displayItems.length !== 1 ? 's' : ''} found
            </span>
          </div>

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

        {/* Results Section */}
        {viewMode === 'grid' ? (
          <AccordionGrid columns={3} gap="md">
            {displayItems.map((item) => (
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
            {displayItems.map((item) => (
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