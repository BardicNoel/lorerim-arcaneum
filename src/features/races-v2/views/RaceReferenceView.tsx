import React from 'react'
import { cn } from '@/lib/utils'
import { useRaceData, useRaceFilters, useRaceComputed } from '../adapters'
import { RaceCard } from '../components/composition'
import { PlayerCreationContent, PlayerCreationFilters } from '@/shared/components/playerCreation/layout'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { raceToPlayerCreationItem } from '@/shared/utils'
import type { Race } from '../types'

interface RaceReferenceViewProps {
  className?: string
}

export function RaceReferenceView({ className }: RaceReferenceViewProps) {
  const { races, isLoading, error, categories, tags } = useRaceData()
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
  } = useRaceComputed({ races, selectedRaceId: null })

  // Convert races to PlayerCreationItem format for shared components
  const playerCreationItems = React.useMemo(() => {
    return races.map(race => raceToPlayerCreationItem(race))
  }, [races])

  const filteredPlayerCreationItems = React.useMemo(() => {
    return filteredRaces.map(race => raceToPlayerCreationItem(race))
  }, [filteredRaces])

  // Use shared player creation filters hook
  const {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode
  } = usePlayerCreationFilters()

  // Sync local filters with shared filters
  React.useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery, setSearchTerm])

  React.useEffect(() => {
    setSearchQuery(searchTerm)
  }, [searchTerm, setSearchQuery])

  React.useEffect(() => {
    setSelectedCategories(activeFilters)
  }, [activeFilters, setSelectedCategories])

  React.useEffect(() => {
    setActiveFilters(selectedCategories)
  }, [selectedCategories, setActiveFilters])

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
    <div className={cn('flex gap-6', className)}>
      {/* Filters Sidebar */}
      <PlayerCreationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        tags={tags}
        selectedTags={selectedTags}
        onTagChange={setSelectedTags}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        className="w-64 flex-shrink-0"
      />

      {/* Content Area */}
      <PlayerCreationContent
        items={filteredPlayerCreationItems}
        isLoading={isLoading}
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
        viewMode={viewMode}
        renderItem={(item) => {
          const race = races.find(r => r.edid === item.id)
          if (!race) return null
          
          return (
            <RaceCard
              key={race.edid}
              item={item}
              originalRace={race}
              isExpanded={false}
              showToggle={true}
              className="h-full"
            />
          )
        }}
        className="flex-1"
      />
    </div>
  )
} 