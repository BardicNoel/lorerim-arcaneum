import { useState } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Separator } from '@/shared/ui/ui/separator'
import { 
  Grid3X3, 
  List, 
  ChevronDown,
  X
} from 'lucide-react'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import { useSpellData, useSpellState, useSpellFilters, useSpellComputed } from '../../adapters'
import { SpellGrid, SpellList } from '../composition'
import type { SearchCategory, SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'

export function SpellReferenceView() {
  // Data adapters
  const { spells, loading, error } = useSpellData()
  
  // State adapters
  const { viewMode, setViewMode } = useSpellState()
  
  // State for tracking expanded cards
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  
  // Toggle expanded state for a card
  const toggleCardExpansion = (spellId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(spellId)) {
        newSet.delete(spellId)
      } else {
        newSet.add(spellId)
      }
      return newSet
    })
  }
  
  // Filter adapters
  const {
    filteredSpells,
    selectedTags,
    setSelectedTags,
    addTagFilter,
    removeTagFilter,
    clearAllTags,
    hasActiveFilters,
    filterCount,
    sortBy,
    sortOrder,
    setSortBy,
    toggleSortOrder
  } = useSpellFilters(spells)

  // Computed adapters
  const { statistics, searchCategories } = useSpellComputed(spells)

  // Tag management
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
    
    if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
      addTagFilter(tag)
    }
  }
  
  const handleTagRemove = (tagId: string) => {
    removeTagFilter(tagId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading spells...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading spells: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.totalSpells}</div>
          <div className="text-sm text-muted-foreground">Total Spells</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.schools.length}</div>
          <div className="text-sm text-muted-foreground">Schools</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.levels.length}</div>
          <div className="text-sm text-muted-foreground">Levels</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.avgMagickaCost}</div>
          <div className="text-sm text-muted-foreground">Avg Cost</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.areaSpells}</div>
          <div className="text-sm text-muted-foreground">Area Spells</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.freeSpells}</div>
          <div className="text-sm text-muted-foreground">Free Spells</div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <CustomMultiAutocompleteSearch
              categories={searchCategories}
              onSelect={handleTagSelect}
              onCustomSearch={handleTagSelect}
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration')}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option value="name">Sort: A-Z</option>
              <option value="school">Sort: School</option>
              <option value="level">Sort: Level</option>
              <option value="magickaCost">Sort: Cost</option>
              <option value="magnitude">Sort: Magnitude</option>
              <option value="duration">Sort: Duration</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1 bg-muted">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
              title="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={clearAllTags}
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

      {/* View Controls */}
      <div className="flex items-center justify-between">
        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredSpells.length} of {spells.length} spells
        </div>
      </div>

      <Separator />

      {/* Spell Display */}
      <div>
        {viewMode === 'grid' && (
          <SpellGrid 
            spells={filteredSpells} 
            variant="default"
            columns={3}
            expandedCards={expandedCards}
            onToggleExpansion={toggleCardExpansion}
          />
        )}
        
        {viewMode === 'list' && (
          <SpellList 
            spells={filteredSpells} 
            variant="default"
            expandedCards={expandedCards}
            onToggleExpansion={toggleCardExpansion}
          />
        )}
      </div>
    </div>
  )
} 