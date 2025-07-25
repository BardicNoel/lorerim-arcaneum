import { BuildPageShell } from '@/shared/components/playerCreation'
import type {
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/ui/accordion'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Label } from '@/shared/ui/ui/label'
import { Switch } from '@/shared/ui/ui/switch'
import {
  ChevronDown,
  Grid3X3,
  List,
  Maximize2,
  Minimize2,
  Settings,
  X,
} from 'lucide-react'
import {
  BirthsignAccordion,
  BirthsignCard,
  BirthsignDetailPanel,
} from '../components'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import {
  useBirthsignFilters,
  useDisplayControls,
} from '../hooks'
import { useBirthsigns } from '@/shared/data/useDataCache'
import { useEffect, useState } from 'react'

import type { Birthsign } from '../types'

type SortOption = 'alphabetical' | 'group' | 'power-count'
type ViewMode = 'list' | 'grid'

export function AccordionBirthsignsPage() {
  // Use the new cache-based hook - no infinite loops!
  const { data: birthsignsData, loading, error, reload } = useBirthsigns()
  const birthsigns = birthsignsData?.birthsigns || []

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
  
  // Debug logging
  useEffect(() => {
    console.log('birthsigns', birthsigns)
    console.log('sortedDisplayItems', sortedDisplayItems)
    console.log('displayItems', displayItems)
    console.log('filteredBirthsigns', filteredBirthsigns)
  }, [birthsigns, sortedDisplayItems, displayItems, filteredBirthsigns])
  
  // Local state for expanded accordions (row-based expansion)
  const [expandedBirthsigns, setExpandedBirthsigns] = useState<Set<string>>(
    new Set()
  )
  // Display controls
  const {
    showStats,
    showPowers,
    showSkills,
    showEffects,
    toggleStats,
    togglePowers,
    toggleSkills,
    toggleEffects,
    toggleAll,
    setStats,
    setPowers,
    setSkills,
    setEffects,
  } = useDisplayControls()

  // Check if all accordions are expanded
  const allExpanded =
    sortedDisplayItems.length > 0 &&
    sortedDisplayItems.every(item => expandedBirthsigns.has(item.id))

  // Check if any accordions are expanded
  const anyExpanded = sortedDisplayItems.some(item =>
    expandedBirthsigns.has(item.id)
  )

  // Handle accordion expansion (row-based for grid view)
  const handleBirthsignToggle = (birthsignId: string) => {
    const newExpanded = new Set(expandedBirthsigns)
    const columns = 3 // Match the AccordionGrid columns prop
    const itemIndex = sortedDisplayItems.findIndex(
      item => item.id === birthsignId
    )
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
    setExpandedBirthsigns(newExpanded)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading birthsigns...</p>
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
            onClick={() => reload()}
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

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              {sortBy === 'alphabetical'
                ? 'A-Z'
                : sortBy === 'group'
                  ? 'Type'
                  : 'Count'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSort('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort('group')}>
              Birthsign Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort('power-count')}>
              Power Count
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex border rounded-lg p-1 bg-muted">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-3"
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Expand/Collapse All Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={
            allExpanded
              ? () => {
                  setExpandedBirthsigns(new Set())
                }
              : () => {
                  setExpandedBirthsigns(
                    new Set(sortedDisplayItems.map(item => item.id))
                  )
                }
          }
          className="flex items-center justify-center"
          title={
            allExpanded ? 'Collapse all accordions' : 'Expand all accordions'
          }
        >
          {allExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
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

      {/* Controls Section */}
      {sortedDisplayItems.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="customize-display" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted/50 transition-colors data-[state=open]:rounded-b-none data-[state=open]:border-b-0 justify-start">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Customize Display</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-3 rounded-b-lg border border-t-0 bg-background">
              <div className="flex flex-wrap items-center gap-4">
                {/* Toggle All Control */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 border-border">
                  <Switch
                    checked={
                      showStats && showPowers && showSkills && showEffects
                    }
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-sm font-medium">Toggle All</span>
                </div>

                {/* Data Visibility Controls */}
                <div className="flex items-stretch gap-3 w-full">
                  {/* Stats Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={toggleStats}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Stats</Label>
                      <p className="text-sm text-muted-foreground">
                        Attribute modifications
                      </p>
                    </div>
                    <Switch
                      checked={showStats}
                      onCheckedChange={setStats}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>

                  {/* Powers Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={togglePowers}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Powers</Label>
                      <p className="text-sm text-muted-foreground">
                        Special abilities and spells
                      </p>
                    </div>
                    <Switch
                      checked={showPowers}
                      onCheckedChange={setPowers}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>

                  {/* Skills Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={toggleSkills}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Skills</Label>
                      <p className="text-sm text-muted-foreground">
                        Skill bonuses and effects
                      </p>
                    </div>
                    <Switch
                      checked={showSkills}
                      onCheckedChange={setSkills}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>

                  {/* Effects Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={toggleEffects}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Conditional and mastery effects
                      </p>
                    </div>
                    <Switch
                      checked={showEffects}
                      onCheckedChange={setEffects}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {viewMode === 'grid' ? (
        <AccordionGrid columns={3} gap="md" className="w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalBirthsign = birthsigns.find((birthsign: Birthsign) => {
              return birthsign.id === item.id || birthsign.edid === item.id
            })
            if (!originalBirthsign) return null
            const isExpanded = expandedBirthsigns.has(item.id)
            return (
              <BirthsignAccordion
                key={item.id}
                item={{ ...item, originalBirthsign }}
                isExpanded={isExpanded}
                onToggle={() => handleBirthsignToggle(item.id)}
                className="w-full"
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalBirthsign = birthsigns.find((birthsign: Birthsign) => {
              return birthsign.id === item.id || birthsign.edid === item.id
            })
            if (!originalBirthsign) return null
            const isExpanded = expandedBirthsigns.has(item.id)

            return (
              <BirthsignAccordion
                key={item.id}
                item={{ ...item, originalBirthsign }}
                isExpanded={isExpanded}
                onToggle={() => handleBirthsignToggle(item.id)}
                className="w-full"
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
    </BuildPageShell>
  )
}
