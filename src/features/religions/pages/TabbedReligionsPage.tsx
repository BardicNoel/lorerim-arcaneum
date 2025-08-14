import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  PlayerCreationItem,
  SearchCategory,
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

import { ChevronDown, Grid3X3, List } from 'lucide-react'
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

export function TabbedReligionsPage() {
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
            id: 'type-daedric',
            label: 'Daedric',
            value: 'Daedric',
            category: 'Religion Types',
            description: 'Daedric cults and worship',
          },
          {
            id: 'type-divine',
            label: 'Divine',
            value: 'Divine',
            category: 'Religion Types',
            description: 'Divine worship and temples',
          },
          {
            id: 'type-ancestral',
            label: 'Ancestral',
            value: 'Ancestral',
            category: 'Religion Types',
            description: 'Ancestral worship and traditions',
          },
        ],
      },
    ]
  }

  const handleReligionClick = (religion: FeatureReligion) => {
    setSelectedReligion(religion)
    setIsReligionSheetOpen(true)
  }

  const handleBlessingClick = (religion: FeatureReligion) => {
    setSelectedBlessing(religion)
    setIsBlessingSheetOpen(true)
  }

  const handleSearchSelection = (selectedItems: PlayerCreationItem[]) => {
    // Handle search selection - could filter the displayed items
    console.log('Selected items:', selectedItems)
  }

  if (loading) {
    return (
      <BuildPageShell
        title="Religions"
        description="Divine worship and blessings"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading religions...</p>
          </div>
        </div>
      </BuildPageShell>
    )
  }

  if (error) {
    return (
      <BuildPageShell
        title="Religions"
        description="Divine worship and blessings"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading religions</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </BuildPageShell>
    )
  }

  return (
    <BuildPageShell
      title="Religions"
      description="Divine worship and blessings"
    >
      <div className="space-y-6">
        {/* Search and Controls */}
        <div className="space-y-4">
          <CustomMultiAutocompleteSearch
            items={religionItems}
            categories={generateSearchCategories()}
            onSelectionChange={handleSearchSelection}
            placeholder="Search religions, blessings, and followers..."
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Sort by:{' '}
                    {sortBy === 'alphabetical' ? 'Alphabetical' : 'Divine Type'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                    Alphabetical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('divine-type')}>
                    Divine Type
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as TabType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="religions">
              Religions ({featureReligions.length})
            </TabsTrigger>
            <TabsTrigger value="blessings">
              Blessings ({religionsWithBlessings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="religions" className="space-y-4">
            <ControlGrid
              items={featureReligions}
              renderItem={religion => (
                <ReligionCard
                  originalReligion={religion}
                  onClick={() => handleReligionClick(religion)}
                  showToggle={true}
                />
              )}
              viewMode={viewMode}
              sortBy={sortBy}
              sortKey="name"
            />
          </TabsContent>

          <TabsContent value="blessings" className="space-y-4">
            <ControlGrid
              items={religionsWithBlessings}
              renderItem={religion => (
                <BlessingCard
                  religion={religion}
                  onClick={() => handleBlessingClick(religion)}
                  showToggle={true}
                />
              )}
              viewMode={viewMode}
              sortBy={sortBy}
              sortKey="name"
            />
          </TabsContent>
        </Tabs>

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
      </div>
    </BuildPageShell>
  )
}
