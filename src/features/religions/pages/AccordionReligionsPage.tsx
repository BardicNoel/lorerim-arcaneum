import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import {
  AccordionGrid,
  ControlGrid,
  DisplayCustomizeTools,
  SwitchCard,
} from '@/shared/components/ui'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Switch } from '@/shared/ui/ui/switch'
import {
  ChevronDown,
  Grid3X3,
  List,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ReligionAccordion } from '../components/ReligionAccordion'

import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import { useReligions } from '@/shared/stores'
import { religionToPlayerCreationItem } from '@/shared/utils'

type SortOption = 'alphabetical' | 'divine-type'
type ViewMode = 'list' | 'grid'

export function AccordionReligionsPage() {
  // Use the data cache hook instead of manual fetch
  const { data: religions, loading, error } = useReligions()

  const [expandedReligions, setExpandedReligions] = useState<Set<string>>(
    new Set()
  )
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Data visibility controls
  const [showBlessings, setShowBlessings] = useState(true)
  const [showTenets, setShowTenets] = useState(true)
  const [showBoons, setShowBoons] = useState(true)
  const [showFavoredRaces, setShowFavoredRaces] = useState(
    shouldShowFavoredRaces()
  )

  // Convert religions to PlayerCreationItem format for consolidated view
  const religionItems: PlayerCreationItem[] = useMemo(() => {
    return (religions || []).map(religionToPlayerCreationItem)
  }, [religions])

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const pantheons = [
      ...new Set(
        (religions || []).map(religion => religion.pantheon).filter(Boolean)
      ),
    ]
    const allTags = [...new Set(religionItems.flatMap(item => item.tags))]

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [], // Fuzzy search doesn't need predefined options
      },
      {
        id: 'pantheons',
        name: 'Pantheons',
        placeholder: 'Search by pantheon...',
        options: pantheons.map(pantheon => ({
          id: `pantheon-${pantheon}`,
          label: pantheon as string,
          value: pantheon as string,
          category: 'Pantheons',
          description: `Religions from ${pantheon} pantheon`,
        })),
      },
      ...(shouldShowFavoredRaces()
        ? [
            {
              id: 'favored-races',
              name: 'Favored Races',
              placeholder: 'Search by favored race...',
              options: allTags.map(tag => ({
                id: `race-${tag}`,
                label: tag,
                value: tag,
                category: 'Favored Races',
                description: `Religions that favor ${tag}`,
              })),
            },
          ]
        : []),
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
        category: 'Custom',
      }
    } else {
      tag = {
        id: optionOrTag.id,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }

    // Don't add duplicate tags
    if (!selectedTags.find(t => t.value === tag.value)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Filter religions based on selected tags
  const filteredReligions = useMemo(() => {
    if (selectedTags.length === 0) {
      return religions || []
    }

    return (religions || []).filter(religion => {
      return selectedTags.every(tag => {
        const tagValue = tag.value.toLowerCase()

        // Check pantheon
        if (religion.pantheon?.toLowerCase().includes(tagValue)) {
          return true
        }

        // Check tags
        if (religion.tags?.some(t => t.toLowerCase().includes(tagValue))) {
          return true
        }

        // Check name
        if (religion.name.toLowerCase().includes(tagValue)) {
          return true
        }

        // Check description
        if (religion.description?.toLowerCase().includes(tagValue)) {
          return true
        }

        return false
      })
    })
  }, [religions, selectedTags])

  // Sort religions based on selected sort option
  const sortedReligions = useMemo(() => {
    const religionsToSort = [...filteredReligions]

    switch (sortBy) {
      case 'alphabetical':
        return religionsToSort.sort((a, b) => a.name.localeCompare(b.name))

      case 'divine-type':
        return religionsToSort.sort((a, b) => {
          const getTypePriority = (type: string | undefined) => {
            switch (type?.toLowerCase()) {
              case 'divine':
                return 1
              case 'daedric':
                return 2
              case 'yokudan':
                return 3
              case 'custom':
                return 4
              default:
                return 5
            }
          }

          const priorityA = getTypePriority(a.pantheon)
          const priorityB = getTypePriority(b.pantheon)

          if (priorityA !== priorityB) {
            return priorityA - priorityB
          }

          return a.name.localeCompare(b.name)
        })

      default:
        return religionsToSort
    }
  }, [filteredReligions, sortBy])

  // Convert sorted religions to PlayerCreationItem format for display
  const sortedDisplayItems: PlayerCreationItem[] = useMemo(() => {
    return sortedReligions.map(religionToPlayerCreationItem)
  }, [sortedReligions])

  const handleReligionToggle = (religionId: string) => {
    setExpandedReligions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(religionId)) {
        newSet.delete(religionId)
      } else {
        newSet.add(religionId)
      }
      return newSet
    })
  }

  const handleExpandAll = () => {
    setExpandedReligions(new Set(sortedDisplayItems.map(item => item.id)))
  }

  const handleCollapseAll = () => {
    setExpandedReligions(new Set())
  }

  // Check if all accordions are expanded
  const allExpanded =
    sortedDisplayItems.length > 0 &&
    sortedDisplayItems.every(item => expandedReligions.has(item.id))

  // Check if any accordions are expanded
  const anyExpanded = sortedDisplayItems.some(item =>
    expandedReligions.has(item.id)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading religions...</p>
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
      title="Religions"
      description="Choose your character's religion. Each deity offers unique blessings, tenets, and powers that will guide your spiritual journey through Tamriel."
    >
      {/* Custom MultiAutocompleteSearch with FuzzySearchBox for keywords */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
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
              {sortBy === 'alphabetical' ? 'A-Z' : 'Type'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('divine-type')}>
              Divine Type
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
          onClick={allExpanded ? handleCollapseAll : handleExpandAll}
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
              onClick={() => setSelectedTags([])}
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

      {/* Controls Section */}
      {sortedDisplayItems.length > 0 && (
        <DisplayCustomizeTools>
          {/* Toggle All Control */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 border-border">
            <Switch
              checked={
                showBlessings && showTenets && showBoons && showFavoredRaces
              }
              onCheckedChange={checked => {
                setShowBlessings(checked)
                setShowTenets(checked)
                setShowBoons(checked)
                setShowFavoredRaces(checked)
              }}
            />
            <span className="text-sm font-medium">Toggle All</span>
          </div>

          {/* Data Visibility Controls */}
          <ControlGrid columns={shouldShowFavoredRaces() ? 4 : 3}>
            <SwitchCard
              title="Blessings"
              description="Deity blessings and effects"
              checked={showBlessings}
              onCheckedChange={setShowBlessings}
            />

            <SwitchCard
              title="Tenets"
              description="Religious tenets and rules"
              checked={showTenets}
              onCheckedChange={setShowTenets}
            />

            <SwitchCard
              title="Boons"
              description="Follower and devotee powers"
              checked={showBoons}
              onCheckedChange={setShowBoons}
            />

            {shouldShowFavoredRaces() && (
              <SwitchCard
                title="Favored Races"
                description="Races favored by this deity"
                checked={showFavoredRaces}
                onCheckedChange={setShowFavoredRaces}
              />
            )}
          </ControlGrid>
        </DisplayCustomizeTools>
      )}

      {viewMode === 'grid' ? (
        <AccordionGrid columns={3} gap="md" className="w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalReligion = religions.find(
              religion => religion.name === item.name
            )
            const isExpanded = expandedReligions.has(item.id)

            return (
              <ReligionAccordion
                key={item.id}
                item={item}
                originalReligion={originalReligion}
                isExpanded={isExpanded}
                onToggle={() => handleReligionToggle(item.id)}
                className="w-full"
                showBlessings={showBlessings}
                showTenets={showTenets}
                showBoons={showBoons}
                showFavoredRaces={showFavoredRaces}
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalReligion = religions.find(
              religion => religion.name === item.name
            )
            const isExpanded = expandedReligions.has(item.id)

            return (
              <ReligionAccordion
                key={item.id}
                item={item}
                originalReligion={originalReligion}
                isExpanded={isExpanded}
                onToggle={() => handleReligionToggle(item.id)}
                className="w-full"
                showBlessings={showBlessings}
                showTenets={showTenets}
                showBoons={showBoons}
                showFavoredRaces={showFavoredRaces}
              />
            )
          })}
        </div>
      )}

      {sortedDisplayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No religions found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </BuildPageShell>
  )
}
