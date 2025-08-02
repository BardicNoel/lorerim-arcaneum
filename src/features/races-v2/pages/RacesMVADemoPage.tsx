import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import React from 'react'
import {
  useRaceComputed,
  useRaceData,
  useRaceDetail,
  useRaceFilters,
  useRaceState,
} from '../adapters'
import {
  CategoryBadge,
  KeywordTag,
  RaceAvatar,
  StatBar,
} from '../components/atomic'
import {
  RaceAccordion,
  RaceAutocomplete,
  RaceCard,
  RaceEffectsDisplay,
  RaceKeywordsDisplay,
  RaceSelectionCard,
  RaceStatsDisplay,
} from '../components/composition'
import {
  RaceDetailView,
  RacePageView,
  RaceQuickSelectorView,
  RaceReferenceView,
} from '../views'

export function RacesMVADemoPage() {
  // Demonstrate all MVA adapters
  const { races, isLoading, error, categories, tags } = useRaceData()
  const {
    selectedRace,
    setSelectedRace,
    viewMode,
    setViewMode,
    expandedSections,
    toggleExpandedSection,
  } = useRaceState()
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilters,
    clearFilters,
    filteredRaces,
  } = useRaceFilters({ races })
  const {
    transformedRaces,
    searchCategories,
    categoriesWithCounts,
    tagsWithCounts,
  } = useRaceComputed({ races, selectedRaceId: selectedRace })
  const {
    race: raceDetails,
    relatedRaces,
    raceComparison,
    isLoading: detailLoading,
  } = useRaceDetail({ raceId: selectedRace || '', allRaces: races })

  const [accordionExpanded, setAccordionExpanded] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('overview')

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Races MVA Demo - Loading...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Races MVA Demo - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  const sampleRace = races[0] // Use first race for demonstrations

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Races MVA Demo - Model View Adapter Architecture
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="adapters">Adapters</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>MVA Architecture Overview</CardTitle>
              <CardDescription>
                This demo showcases the Model-View-Adapter pattern
                implementation for the Races feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Model Layer</h3>
                  <p className="text-sm text-muted-foreground">
                    Data management and business logic
                  </p>
                  <Badge variant="outline" className="mt-2">
                    RaceModel
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Adapter Layer</h3>
                  <p className="text-sm text-muted-foreground">
                    State management and data transformation
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline">useRaceData</Badge>
                    <Badge variant="outline">useRaceState</Badge>
                    <Badge variant="outline">useRaceFilters</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">View Layer</h3>
                  <p className="text-sm text-muted-foreground">
                    UI components and presentation
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline">RaceCard</Badge>
                    <Badge variant="outline">RacePageView</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adapters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adapter State Demo</CardTitle>
              <CardDescription>
                Interactive demonstration of adapter state management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State Management */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    State Management (useRaceState)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Selected Race:</span>
                      <Badge variant={selectedRace ? 'default' : 'secondary'}>
                        {selectedRace || 'None'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">View Mode:</span>
                      <div className="flex border rounded">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          Grid
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          List
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Expanded Sections:</span>
                      <Badge variant="outline">{expandedSections.length}</Badge>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Filters (useRaceFilters)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Search Query:</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                        placeholder="Search races..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Active Filters:</span>
                      <Badge variant="outline">
                        {activeFilters.tags.length +
                          (activeFilters.type ? 1 : 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Filtered Results:</span>
                      <Badge variant="outline">
                        {filteredRaces.length} of {races.length}
                      </Badge>
                    </div>
                    <Button size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>

                {/* Computed Data */}
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    Computed Data (useRaceComputed)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Transformed Races:</span>
                      <Badge variant="outline">{transformedRaces.length}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Search Categories:</span>
                      <Badge variant="outline">{searchCategories.length}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Categories with Counts:</span>
                      <Badge variant="outline">
                        {Object.keys(categoriesWithCounts).length}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Detail View */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Detail View (useRaceDetail)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Selected Race Details:</span>
                      <Badge variant={raceDetails ? 'default' : 'secondary'}>
                        {raceDetails?.name || 'None'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Related Races:</span>
                      <Badge variant="outline">{relatedRaces.length}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Comparison Available:</span>
                      <Badge variant={raceComparison ? 'default' : 'secondary'}>
                        {raceComparison ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <h2 className="text-2xl font-bold">
            Atomic & Composition Components
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
              <div className="space-y-2">
                <p>
                  <strong>Total Races:</strong> {races.length}
                </p>
                <p>
                  <strong>Categories:</strong> {categories.join(', ')}
                </p>
                <p>
                  <strong>Total Tags:</strong> {tags.length}
                </p>
              </div>
            </div>

            {/* Sample Race Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Sample Race: {sampleRace?.name}
              </h2>
              {sampleRace && (
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    {sampleRace.description}
                  </p>
                  <p className="text-sm">
                    <strong>Category:</strong> {sampleRace.category}
                  </p>
                  <p className="text-sm">
                    <strong>Keywords:</strong> {sampleRace.keywords.length}
                  </p>
                </div>
              )}
            </div>

            {/* RaceAvatar Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceAvatar Component
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Small</p>
                    <RaceAvatar
                      raceName={sampleRace?.name || 'Nord'}
                      size="sm"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Medium</p>
                    <RaceAvatar
                      raceName={sampleRace?.name || 'Nord'}
                      size="lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Large</p>
                    <RaceAvatar
                      raceName={sampleRace?.name || 'Nord'}
                      size="2xl"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Extra Large</p>
                    <RaceAvatar
                      raceName={sampleRace?.name || 'Nord'}
                      size="xl"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    Uses generic EntityAvatar with race-specific configuration
                  </p>
                </div>
              </div>
            </div>

            {/* CategoryBadge Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                CategoryBadge Component
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Small</p>
                    <CategoryBadge category="Human" size="sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Medium</p>
                    <CategoryBadge category="Elf" size="md" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Large</p>
                    <CategoryBadge category="Beast" size="lg" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Uses generic CategoryBadge with race-specific styling</p>
                </div>
              </div>
            </div>

            {/* KeywordTag Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                KeywordTag Component
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Auto-detected types:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <KeywordTag keyword="destruction" />
                    <KeywordTag keyword="waterbreathing" />
                    <KeywordTag keyword="strong stomach" />
                    <KeywordTag keyword="custom_flag" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Explicit types:</p>
                  <div className="flex flex-wrap gap-2">
                    <KeywordTag keyword="alteration" type="skill" />
                    <KeywordTag keyword="night eye" type="ability" />
                    <KeywordTag keyword="beast race" type="trait" />
                    <KeywordTag keyword="magic" type="flag" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>
                    Auto-detects keyword types or accepts explicit type prop
                  </p>
                </div>
              </div>
            </div>

            {/* StatBar Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">StatBar Component</h2>
              <div className="space-y-4">
                {sampleRace && (
                  <div className="space-y-3">
                    <StatBar
                      value={sampleRace.startingStats.health}
                      maxValue={200}
                      label="Health"
                      color="red"
                      size="md"
                    />
                    <StatBar
                      value={sampleRace.startingStats.magicka}
                      maxValue={200}
                      label="Magicka"
                      color="blue"
                      size="md"
                    />
                    <StatBar
                      value={sampleRace.startingStats.stamina}
                      maxValue={200}
                      label="Stamina"
                      color="green"
                      size="md"
                    />
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  <p>
                    Progress bars with configurable colors, sizes, and labels
                  </p>
                </div>
              </div>
            </div>

            {/* RaceStatsDisplay Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceStatsDisplay Component
              </h2>
              <div className="space-y-4">
                {sampleRace && (
                  <RaceStatsDisplay
                    stats={sampleRace.startingStats}
                    regeneration={sampleRace.regeneration}
                    title="Sample Stats"
                    compact={true}
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p>Composition component that displays race statistics</p>
                </div>
              </div>
            </div>

            {/* RaceEffectsDisplay Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceEffectsDisplay Component
              </h2>
              <div className="space-y-4">
                {sampleRace && sampleRace.racialSpells.length > 0 && (
                  <RaceEffectsDisplay
                    effects={sampleRace.racialSpells.map(spell => ({
                      name: spell.name,
                      description: spell.description,
                    }))}
                    title="Racial Abilities"
                    maxDisplay={3}
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p>
                    Composition component for displaying race effects/abilities
                  </p>
                </div>
              </div>
            </div>

            {/* RaceKeywordsDisplay Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceKeywordsDisplay Component
              </h2>
              <div className="space-y-4">
                {sampleRace && sampleRace.keywords.length > 0 && (
                  <RaceKeywordsDisplay
                    keywords={sampleRace.keywords.map(k => k.edid)}
                    title="Race Keywords"
                    maxDisplay={6}
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p>
                    Composition component that uses KeywordTag atomic components
                  </p>
                </div>
              </div>
            </div>

            {/* RaceCard Demo */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                RaceCard Composition Component
              </h2>
              <div className="space-y-4">
                {sampleRace && (
                  <RaceCard
                    originalRace={sampleRace}
                    isExpanded={true}
                    showToggle={false}
                    className="max-w-2xl"
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p>
                    Main composition component that orchestrates all atomic
                    components
                  </p>
                </div>
              </div>
            </div>

            {/* RaceAutocomplete Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceAutocomplete Component
              </h2>
              <div className="space-y-4">
                <RaceAutocomplete
                  races={races.slice(0, 5)}
                  onSelect={race => console.log('Selected:', race.name)}
                  placeholder="Search for a race..."
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  <p>Search and selection component for races</p>
                </div>
              </div>
            </div>

            {/* RaceAccordion Demo */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                RaceAccordion Component
              </h2>
              <div className="space-y-4">
                {sampleRace && (
                  <RaceAccordion
                    item={{
                      id: sampleRace.edid,
                      name: sampleRace.name,
                      description: sampleRace.description,
                      summary: sampleRace.description,
                      category: sampleRace.category,
                      effects: [],
                      tags: [],
                      originalRace: sampleRace,
                    }}
                    isExpanded={accordionExpanded}
                    onToggle={() => setAccordionExpanded(!accordionExpanded)}
                    showToggle={true}
                    className="border-0 shadow-none"
                  />
                )}
                <div className="text-xs text-gray-500">
                  <p>
                    Accordion-style race display for player creation (click to
                    expand/collapse)
                  </p>
                </div>
              </div>
            </div>

            {/* RaceSelectionCard Demo */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                RaceSelectionCard Component
              </h2>
              <div className="space-y-4">
                <RaceSelectionCard
                  allRaces={races.slice(0, 5)}
                  className="max-w-2xl"
                />
                <div className="text-xs text-gray-500">
                  <p>Complete race selection interface for player creation</p>
                </div>
              </div>
            </div>

            {/* Sample Races with Components */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Sample Races with All Components
              </h2>
              <div className="space-y-4">
                {races.slice(0, 2).map(race => (
                  <div key={race.edid} className="border rounded p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <RaceAvatar raceName={race.name} size="2xl" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{race.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge
                            category={
                              race.category as 'Human' | 'Elf' | 'Beast'
                            }
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{race.description}</p>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <StatBar
                        value={race.startingStats.health}
                        maxValue={200}
                        label="Health"
                        color="red"
                        size="sm"
                      />
                      <StatBar
                        value={race.startingStats.magicka}
                        maxValue={200}
                        label="Magicka"
                        color="blue"
                        size="sm"
                      />
                      <StatBar
                        value={race.startingStats.stamina}
                        maxValue={200}
                        label="Stamina"
                        color="green"
                        size="sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {race.keywords.slice(0, 5).map((keyword, index) => (
                        <KeywordTag key={index} keyword={keyword.edid} />
                      ))}
                      {race.keywords.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{race.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Components Demo */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                View Components Demo
              </h2>
              <div className="space-y-6">
                {/* RaceQuickSelectorView Demo */}
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    RaceQuickSelectorView
                  </h3>
                  <RaceQuickSelectorView
                    selectedRace={
                      selectedRace
                        ? races.find(r => r.edid === selectedRace)
                        : undefined
                    }
                    onRaceSelect={race => setSelectedRace(race.edid)}
                    onRaceClear={() => setSelectedRace(null)}
                    showSearch={true}
                    showComparison={true}
                    maxDisplayRaces={3}
                    className="max-w-md"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Compact selection interface for embedded contexts</p>
                  </div>
                </div>

                {/* RaceDetailView Demo */}
                {selectedRace && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">RaceDetailView</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <RaceDetailView raceId={selectedRace} className="p-4" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <p>Detailed race view with rich information display</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="views" className="space-y-6">
          <h2 className="text-2xl font-bold">View Components</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RacePageView</CardTitle>
                <CardDescription>
                  Main page view with full functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RacePageView className="border rounded-lg p-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RaceReferenceView</CardTitle>
                <CardDescription>Browse/search interface</CardDescription>
              </CardHeader>
              <CardContent>
                <RaceReferenceView className="border rounded-lg p-4" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
