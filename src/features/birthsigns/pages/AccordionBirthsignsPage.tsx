import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { useBirthsigns } from '@/shared/stores'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BirthsignCard, BirthsignDetailsSheet } from '../components'
import { useBirthsignFilters } from '../hooks'

import type { Birthsign } from '../types'

type SortOption = 'alphabetical' | 'group' | 'power-count'
type ViewMode = 'list' | 'grid'

export function AccordionBirthsignsPage() {
  // Use the new cache-based hook - no infinite loops!
  const { data: birthsignsData, loading, error } = useBirthsigns()
  const birthsigns = birthsignsData || []

  // Filters and UI state (now pass birthsigns to the hook)
  const {
    selectedTags,
    sortBy,
    viewMode,
    addTag,
    removeTag,
    setSort,
    setViewMode,
    searchCategories,
    fuzzySearchQuery,
    filteredBirthsigns,
    displayItems,
    sortedDisplayItems,
  } = useBirthsignFilters(birthsigns)



  // State for details sheet
  const [selectedBirthsign, setSelectedBirthsign] = useState<Birthsign | null>(
    null
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleCardClick = (birthsign: Birthsign) => {
    setSelectedBirthsign(birthsign)
    setIsDetailsOpen(true)
  }

  const handleTagRemove = (tag: SelectedTag) => {
    removeTag(tag.id)
  }

  const handleSearchSelect = (option: SearchOption) => {
    addTag({
      id: option.value,
      value: option.value,
      label: option.label,
      category: option.category,
    })
  }

  if (loading) {
    return (
      <BuildPageShell title="Birthsigns" description="Choose your birthsign">
        <div className="flex items-center justify-center py-12">
          <p>Loading birthsigns...</p>
        </div>
      </BuildPageShell>
    )
  }

  if (error) {
    return (
      <BuildPageShell title="Birthsigns" description="Choose your birthsign">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">Error loading birthsigns: {error}</p>
        </div>
      </BuildPageShell>
    )
  }

  return (
    <BuildPageShell
      title="Birth Signs"
      description="Choose your character's birthsign to gain unique abilities and bonuses based on the celestial constellations."
    >
      {/* Custom MultiAutocompleteSearch with FuzzySearchBox for keywords */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={(optionOrTag: string | SearchOption) => {
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
              if (
                !selectedTags.some(
                  t => t.value === tag.value && t.category === tag.category
                )
              ) {
                addTag(tag)
              }
            }}
            onCustomSearch={(optionOrTag: string | SearchOption) => {
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
              if (
                !selectedTags.some(
                  t => t.value === tag.value && t.category === tag.category
                )
              ) {
                addTag(tag)
              }
            }}
          />
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Sort:{' '}
                {sortBy === 'alphabetical'
                  ? 'A-Z'
                  : sortBy === 'group'
                    ? 'Group'
                    : 'Power Count'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSort('alphabetical')}>
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('group')}>
                By Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('power-count')}>
                By Power Count
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selected Tags */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={() => selectedTags.forEach(tag => removeTag(tag.id))}
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
                onClick={() => removeTag(tag.id)}
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalBirthsign = birthsigns.find(
              (birthsign: Birthsign) => {
                return birthsign.id === item.id || birthsign.edid === item.id
              }
            )
            if (!originalBirthsign) return null

            return (
              <BirthsignCard
                key={item.id}
                originalBirthsign={originalBirthsign}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(originalBirthsign)}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalBirthsign = birthsigns.find(
              (birthsign: Birthsign) => {
                return birthsign.id === item.id || birthsign.edid === item.id
              }
            )
            if (!originalBirthsign) return null

            return (
              <BirthsignCard
                key={item.id}
                originalBirthsign={originalBirthsign}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(originalBirthsign)}
              />
            )
          })}
        </div>
      )}

      {sortedDisplayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No birthsigns found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Details Sheet */}
      <BirthsignDetailsSheet
        birthsign={selectedBirthsign}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </BuildPageShell>
  )
}
