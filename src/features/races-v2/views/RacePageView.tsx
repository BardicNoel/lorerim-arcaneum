import React from 'react'
import { cn } from '@/lib/utils'
import { useRaceData, useRaceState, useRaceFilters, useRaceComputed } from '../adapters'
import { RaceCard, RaceAutocomplete } from '../components/composition'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Badge } from '@/shared/ui/ui/badge'
import { H1, H2, P } from '@/shared/ui/ui/typography'
import { Search, Filter, X } from 'lucide-react'

interface RacePageViewProps {
  className?: string
}

export function RacePageView({ className }: RacePageViewProps) {
  const { races, isLoading, error, categories, tags } = useRaceData()
  const { 
    selectedRace, 
    setSelectedRace, 
    viewMode, 
    setViewMode,
    sortBy,
    setSortBy 
  } = useRaceState()
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilters, 
    setActiveFilters,
    clearFilters,
    filteredRaces 
  } = useRaceFilters({ races })
  const { 
    transformedRaces, 
    searchCategories, 
    categoriesWithCounts,
    tagsWithCounts 
  } = useRaceComputed({ races, selectedRaceId: selectedRace?.edid || null })

  if (isLoading) {
    return (
      <div className={cn('container mx-auto p-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('container mx-auto p-6', className)}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container mx-auto p-6', className)}>
      {/* Header */}
      <div className="mb-8">
        <H1 className="text-3xl font-bold mb-2">Races</H1>
        <P className="text-muted-foreground">
          Explore and compare the different races available in the game
        </P>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search races..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <button
                  onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Categories:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilters.includes(category) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (activeFilters.includes(category)) {
                  setActiveFilters(activeFilters.filter(f => f !== category))
                } else {
                  setActiveFilters([...activeFilters, category])
                }
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <P className="text-muted-foreground">
          Showing {filteredRaces.length} of {races.length} races
        </P>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="health">Health</option>
            <option value="magicka">Magicka</option>
            <option value="stamina">Stamina</option>
          </select>
        </div>
      </div>

      {/* Race Grid */}
      {filteredRaces.length === 0 ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <H2 className="text-xl font-semibold mb-2">No races found</H2>
          <P className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </P>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <RaceCard
              key={race.edid}
              originalRace={race}
              isExpanded={false}
              showToggle={true}
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  )
} 