import { useState, useEffect, useMemo } from 'react'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import { useSpellData, useSpellState } from '../../adapters'
import { SpellGrid, SpellList } from '../composition'
import { SpellDetailsSheet } from '../SpellDetailsSheet'
import type { SearchOption, SelectedTag, SearchCategory } from '@/shared/components/playerCreation/types'
import type { SpellWithComputed } from '../../types'
import { ChevronDown } from 'lucide-react'
import { levelOrder } from '../../config/spellConfig'

type SortOption = 'alphabetical' | 'school' | 'level'

export function SpellPageView() {
  // Adapters
  const { spells, loading, error } = useSpellData()
  const { viewMode, setViewMode } = useSpellState()
  
  // Ensure spells is always an array
  const safeSpells = Array.isArray(spells) ? spells : []
  
  // State for detail sheet
  const [selectedSpell, setSelectedSpell] = useState<SpellWithComputed | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  // State for sorting
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  
  // Handle spell click to open detail sheet
  const handleSpellClick = (spell: SpellWithComputed) => {
    setSelectedSpell(spell)
    setIsDetailsOpen(true)
  }
  
  // Generate search categories directly in the component
  const searchCategories = useMemo((): SearchCategory[] => {
    if (safeSpells.length === 0) {
      return []
    }

    // Extract unique schools and levels
    const allSchools = [...new Set(safeSpells.map(spell => spell.school))]
    const allLevels = [...new Set(safeSpells.map(spell => spell.level))]
    
    return [
      {
        id: 'keywords',
        name: 'Fuzzy Search',
        placeholder: 'Search spells by name, school, level, or effects...',
        options: [], // Will be populated by fuzzy search
      },
      {
        id: 'schools',
        name: 'Magic Schools',
        placeholder: 'Filter by school...',
        options: allSchools.map(school => ({
          id: `school-${school}`,
          label: school,
          value: school,
          category: 'Magic Schools',
          description: `${school} spells`,
        })),
      },
      {
        id: 'levels',
        name: 'Spell Levels',
        placeholder: 'Filter by level...',
        options: allLevels.map(level => ({
          id: `level-${level}`,
          label: level,
          value: level,
          category: 'Spell Levels',
          description: `${level} spells`,
        })),
      },
    ]
  }, [safeSpells])
  

  
  // Search setup
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])
  
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
      setSelectedTags(prev => [...prev, tag])
    }
  }
  
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }
  
  const handleClearAllTags = () => {
    setSelectedTags([])
  }
  
  // Filtered results
  const filteredSpells = safeSpells.filter(spell => {
    if (selectedTags.length === 0) return true
    
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Magic Schools':
          return spell.school === tag.value
        case 'Spell Levels':
          return spell.level === tag.value
        case 'Fuzzy Search':
          // Simple text search for now - can be enhanced with proper fuzzy search
          const searchText = tag.value.toLowerCase()
          return (
            spell.name.toLowerCase().includes(searchText) ||
            spell.school.toLowerCase().includes(searchText) ||
            spell.level.toLowerCase().includes(searchText) ||
            spell.effects.some(effect => 
              effect.description.toLowerCase().includes(searchText)
            )
          )
        default:
          return true
      }
    })
  })

  // Sort the filtered spells
  const sortedSpells = useMemo(() => {
    return [...filteredSpells].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        case 'school':
          const schoolComparison = a.school.localeCompare(b.school)
          if (schoolComparison !== 0) return schoolComparison
          return a.name.localeCompare(b.name) // Secondary sort by name
        case 'level':
          const levelA = levelOrder[a.level as keyof typeof levelOrder] || 0
          const levelB = levelOrder[b.level as keyof typeof levelOrder] || 0
          if (levelA !== levelB) return levelA - levelB
          return a.name.localeCompare(b.name) // Secondary sort by name
        default:
          return 0
      }
    })
  }, [filteredSpells, sortBy])

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
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        Debug: {safeSpells.length} spells, {searchCategories.length} search categories
        {searchCategories.length > 0 && (
          <div className="mt-1">
            Categories: {searchCategories.map(cat => `${cat.name}(${cat.options.length})`).join(', ')}
          </div>
        )}
      </div>
      
      {/* Search Interface */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {searchCategories.length > 0 ? (
              <CustomMultiAutocompleteSearch
                categories={searchCategories}
                onSelect={handleTagSelect}
                onCustomSearch={handleTagSelect}
              />
            ) : (
              <div className="p-4 border border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground">
                No search categories available. Spells loaded: {safeSpells.length}
              </div>
            )}
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
            >
              <option value="alphabetical">Sort: A-Z</option>
              <option value="school">Sort: School</option>
              <option value="level">Sort: Level</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1 bg-muted">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              title="Grid view"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              title="List view"
            >
              List
            </button>
          </div>
        </div>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={handleClearAllTags}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
              title="Clear all filters"
            >
              <span className="text-lg">×</span>
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

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {sortedSpells.length} of {safeSpells.length} spells
      </div>

      {/* Results Display */}
      <div>
        {sortedSpells.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No spells found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <SpellGrid 
                spells={sortedSpells} 
                variant="default"
                columns={3}
                onSpellClick={handleSpellClick}
              />
            )}
            
            {viewMode === 'list' && (
              <SpellList 
                spells={sortedSpells} 
                variant="default"
                onSpellClick={handleSpellClick}
              />
            )}
          </>
        )}
      </div>

      {/* Spell Details Sheet */}
      <SpellDetailsSheet
        spell={selectedSpell}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}