import { cn } from '@/lib/utils'
import { ItemGrid } from '@/shared/components/playerCreation'
import {
  PlayerCreationContent,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  PlayerCreationItemsSection,
} from '@/shared/components/playerCreation/layout'
import type {
  PlayerCreationItem,
  SearchCategory,
} from '@/shared/components/playerCreation/types'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import React from 'react'
import { useRaceData, useRaceFilters } from '../adapters'
import { RaceCard } from '../components/composition'
import { raceToPlayerCreationItem } from '../utils/raceToPlayerCreationItem'

interface RaceReferenceViewProps {
  className?: string
}

export function RaceReferenceView({ className }: RaceReferenceViewProps) {
  const { races, isLoading, error, categories, tags } = useRaceData()
  const { searchQuery, setSearchQuery, filteredRaces } = useRaceFilters({
    races,
  })

  // Convert races to PlayerCreationItem format for shared components
  const filteredPlayerCreationItems = React.useMemo(() => {
    return filteredRaces.map(race => raceToPlayerCreationItem(race))
  }, [filteredRaces])

  // Generate search categories from race data
  const searchCategories: SearchCategory[] = React.useMemo(() => {
    return [
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Search by category...',
        options: (categories || []).map(category => ({
          id: category,
          label: category,
          value: category,
          category: 'categories',
          description: `Race category: ${category}`,
        })),
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Search by tags...',
        options: (tags || []).map(tag => ({
          id: tag,
          label: tag,
          value: tag,
          category: 'tags',
          description: `Race tag: ${tag}`,
        })),
      },
    ]
  }, [categories, tags])

  // Use shared player creation filters hook
  const {
    filters,
    handleSearch,
    handleTagSelect,
    handleTagRemove,
    updateFilters,
  } = usePlayerCreationFilters({
    onSearch: setSearchQuery,
    onFiltersChange: _newFilters => {
      // Sync with race filters if needed
      // console.log('Filters changed:', newFilters)
    },
  })

  // Sync local filters with race filters
  React.useEffect(() => {
    if (searchQuery !== filters.search) {
      handleSearch(searchQuery)
    }
  }, [searchQuery, handleSearch, filters.search])

  // State for selected race
  const [selectedRace, setSelectedRace] =
    React.useState<PlayerCreationItem | null>(null)

  const renderRaceCard = (item: PlayerCreationItem) => {
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
  }

  const renderRaceDetailPanel = (item: PlayerCreationItem) => {
    const race = races.find(r => r.edid === item.id)
    if (!race) return null

    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{race.name}</h3>
        <p className="text-muted-foreground mb-4">{race.description}</p>
        <div className="space-y-2">
          <div>
            <strong>Category:</strong> {race.category}
          </div>
          <div>
            <strong>Health:</strong> {race.startingStats.health}
          </div>
          <div>
            <strong>Magicka:</strong> {race.startingStats.magicka}
          </div>
          <div>
            <strong>Stamina:</strong> {race.startingStats.stamina}
          </div>
        </div>
      </div>
    )
  }

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
      {/* Filters */}
      <PlayerCreationFilters
        searchCategories={searchCategories}
        selectedTags={filters.selectedTags}
        viewMode="grid"
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        className="mb-6"
      />

      {/* Content */}
      <PlayerCreationContent>
        <PlayerCreationItemsSection>
          <ItemGrid
            items={filteredPlayerCreationItems}
            viewMode="grid"
            onItemSelect={setSelectedRace}
            selectedItem={selectedRace}
            renderItemCard={renderRaceCard}
          />
        </PlayerCreationItemsSection>

        <PlayerCreationDetailSection>
          {selectedRace ? (
            renderRaceDetailPanel(selectedRace)
          ) : (
            <PlayerCreationEmptyDetail
              title="Select a Race"
              description="Choose a race from the list to view its details"
            />
          )}
        </PlayerCreationDetailSection>
      </PlayerCreationContent>
    </div>
  )
}
