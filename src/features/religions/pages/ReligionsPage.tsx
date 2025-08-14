import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { ControlGrid } from '@/shared/components/ui'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'

import { ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  BlessingCard,
  BlessingSheet,
  ReligionCard,
  ReligionSheet,
} from '../components/composition'
import type { Religion as FeatureReligion } from '../types'
import { mapSharedReligionToFeatureReligion } from '../utils/religionMapper'

import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import { useReligions } from '@/shared/stores'
import { religionToPlayerCreationItem } from '@/shared/utils'

type SortOption = 'alphabetical' | 'divine-type'
type ViewMode = 'list' | 'grid'
type TabType = 'religions' | 'blessings'

export function ReligionsPage() {
  // Use the data cache hook instead of manual fetch
  const { data: religions, loading, error } = useReligions()

  const [selectedReligion, setSelectedReligion] =
    useState<FeatureReligion | null>(null)
  const [selectedBlessing, setSelectedBlessing] =
    useState<FeatureReligion | null>(null)
  const [isReligionSheetOpen, setIsReligionSheetOpen] = useState(false)
  const [isBlessingSheetOpen, setIsBlessingSheetOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeTab, setActiveTab] = useState<TabType>('religions')

  // Convert religions to PlayerCreationItem format for consolidated view
  const religionItems: PlayerCreationItem[] = useMemo(() => {
    return (religions || []).map(religionToPlayerCreationItem)
  }, [religions])

  // Convert religions to feature format for ReligionCard
  const featureReligions: FeatureReligion[] = useMemo(() => {
    return (religions || []).map(mapSharedReligionToFeatureReligion)
  }, [religions])

  // Filter religions that have blessings
  const religionsWithBlessings = useMemo(() => {
    return featureReligions.filter(
      religion => religion.blessing && religion.blessing.effects.length > 0
    )
  }, [featureReligions])

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
      {
        id: 'religion-types',
        name: 'Religion Types',
        placeholder: 'Search by religion type...',
        options: [
          {
            id: 'divine',
            label: 'Divine',
            value: 'Divine',
            category: 'Religion Types',
            description: 'Divine religions',
          },
          {
            id: 'daedric',
            label: 'Daedric',
            value: 'Daedric',
            category: 'Religion Types',
            description: 'Daedric religions',
          },
          {
            id: 'tribunal',
            label: 'Tribunal',
            value: 'Tribunal',
            category: 'Religion Types',
            description: 'Tribunal religions',
          },
          {
            id: 'ancestor',
            label: 'Ancestor',
            value: 'Ancestor',
            category: 'Religion Types',
            description: 'Ancestor religions',
          },
        ],
      },
    ]
  }

  // Filter and sort religions based on selected tags
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  const filteredReligions = useMemo(() => {
    let filtered = featureReligions

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(religion => {
        return selectedTags.every(tag => {
          if (tag.category === 'Pantheons') {
            return religion.pantheon === tag.value
          }
          if (tag.category === 'Favored Races') {
            return religion.favoredRaces?.includes(tag.value)
          }
          if (tag.category === 'Religion Types') {
            return religion.type === tag.value
          }
          return true
        })
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'divine-type') {
        const getTypePriority = (type: string | undefined) => {
          switch (type) {
            case 'Divine':
              return 1
            case 'Daedric':
              return 2
            case 'Tribunal':
              return 3
            case 'Ancestor':
              return 4
            default:
              return 5
          }
        }
        const priorityA = getTypePriority(a.type)
        const priorityB = getTypePriority(b.type)
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }
        return a.name.localeCompare(b.name)
      }
      return 0
    })

    return filtered
  }, [featureReligions, selectedTags, sortBy])

  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    const newTag: SelectedTag =
      typeof optionOrTag === 'string'
        ? {
            id: optionOrTag,
            label: optionOrTag,
            value: optionOrTag,
            category: 'Custom',
          }
        : {
            id: optionOrTag.id,
            label: optionOrTag.label,
            value: optionOrTag.value,
            category: optionOrTag.category,
          }

    setSelectedTags(prev => [...prev, newTag])
  }

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const handleReligionClick = (id: string) => {
    console.log('handleReligionClick called with id:', id)
    const religion = featureReligions.find(r => r.name === id)
    console.log('Found religion:', religion)
    if (religion) {
      setSelectedReligion(religion)
      setIsReligionSheetOpen(true)
      console.log('Religion sheet should now be open')
    }
  }

  const handleBlessingClick = (religion: FeatureReligion) => {
    setSelectedBlessing(religion)
    setIsBlessingSheetOpen(true)
  }

  if (loading) {
    return (
      <BuildPageShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading religions...</div>
        </div>
      </BuildPageShell>
    )
  }

  if (error) {
    return (
      <BuildPageShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error loading religions: {error}
          </div>
        </div>
      </BuildPageShell>
    )
  }

  return (
    <BuildPageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Religions</h1>
            <p className="text-muted-foreground">
              Choose your character's faith and divine blessings
            </p>
          </div>
        </div>

        {/* Controls */}
        <ControlGrid>
          {/* Search */}
          <div className="flex-1">
            <CustomMultiAutocompleteSearch
              categories={generateSearchCategories()}
              onSelect={handleTagSelect}
              onCustomSearch={handleTagSelect}
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortBy === 'alphabetical' ? 'A-Z' : 'Type'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                  Alphabetical (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('divine-type')}>
                  Religion Type
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ControlGrid>

        {/* Selected Tags */}
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

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as TabType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="religions">
              Religions ({filteredReligions.length})
            </TabsTrigger>
            <TabsTrigger value="blessings">
              Blessings ({religionsWithBlessings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="religions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredReligions.length} religion
                {filteredReligions.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Religion Cards Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              {filteredReligions.map(religion => (
                <ReligionCard
                  key={religion.name}
                  originalReligion={religion}
                  onOpenDetails={handleReligionClick}
                  showToggle={true}
                  className={viewMode === 'list' ? 'w-full' : 'h-full'}
                />
              ))}
            </div>

            {filteredReligions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">
                  No religions found matching your criteria
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTags([])}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="blessings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {religionsWithBlessings.length} blessing
                {religionsWithBlessings.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Blessing Cards Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              {religionsWithBlessings.map(religion => (
                <BlessingCard
                  key={religion.name}
                  religion={religion}
                  onClick={() => handleBlessingClick(religion)}
                  showToggle={false}
                  className={viewMode === 'list' ? 'w-full' : 'h-full'}
                />
              ))}
            </div>

            {religionsWithBlessings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">
                  No blessings found matching your criteria
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTags([])}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sheets */}
      <ReligionSheet
        religion={selectedReligion}
        isOpen={isReligionSheetOpen}
        onOpenChange={setIsReligionSheetOpen}
      />
      <BlessingSheet
        religion={selectedBlessing}
        isOpen={isBlessingSheetOpen}
        onOpenChange={setIsBlessingSheetOpen}
      />
    </BuildPageShell>
  )
}
