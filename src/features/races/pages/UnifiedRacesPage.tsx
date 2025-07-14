import React, { useState, useEffect } from 'react'
import { 
  PlayerCreationLayout,
  PlayerCreationContent,
  PlayerCreationItemsSection,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  ItemGrid
} from '@/shared/components/playerCreation'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { RaceCard } from '../components/RaceCard'
import { RaceDetailPanel } from '../components/RaceDetailPanel'
import type { PlayerCreationItem, SearchCategory, SelectedTag } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'

export function UnifiedRacesPage() {
  // Load race data from public/data/races.json at runtime
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/races.json`)
        if (!res.ok) throw new Error('Failed to fetch race data')
        const data = await res.json()
        setRaces(data as Race[])
      } catch (err) {
        setError('Failed to load race data')
        console.error('Error loading races:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [])

  // Convert races to PlayerCreationItem format
  const playerCreationItems: PlayerCreationItem[] = races.map(race => ({
    id: race.id,
    name: race.name,
    description: race.description,
    tags: race.traits.map(trait => trait.name),
    summary: race.description,
    effects: [],
    associatedItems: [],
    imageUrl: undefined,
    category: undefined
  }))

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const traits = [...new Set(races.flatMap(race => race.traits.map(trait => trait.name)))]
    const effectTypes = [...new Set(races.flatMap(race => race.traits.map(trait => trait.effect.type)))]

    return [
      {
        id: 'traits',
        name: 'Traits',
        placeholder: 'Search by trait...',
        options: traits.map(trait => ({
          id: `trait-${trait}`,
          label: trait,
          value: trait,
          category: 'Traits',
          description: `Races with ${trait} trait`
        }))
      },
      {
        id: 'effect-types',
        name: 'Effect Types',
        placeholder: 'Search by effect type...',
        options: effectTypes.map(effectType => ({
          id: `effect-${effectType}`,
          label: effectType,
          value: effectType,
          category: 'Effect Types',
          description: `Races with ${effectType} effects`
        }))
      }
    ]
  }

  const searchCategories = generateSearchCategories()

  const {
    selectedItem,
    viewMode,
    filteredItems,
    currentFilters,
    handleItemSelect,
    handleFiltersChange,
    handleSearch,
    handleViewModeChange
  } = usePlayerCreation({
    items: playerCreationItems,
    filters: []
  })

  // Use the new filters hook
  const {
    handleTagSelect,
    handleTagRemove
  } = usePlayerCreationFilters({
    initialFilters: currentFilters,
    onFiltersChange: handleFiltersChange,
    onSearch: handleSearch
  })

  const renderRaceCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <RaceCard 
      item={item} 
      isSelected={isSelected}
    />
  )

  const renderRaceDetailPanel = (item: PlayerCreationItem) => (
    <RaceDetailPanel 
      item={item}
      originalRace={races.find(race => race.id === item.id)}
    />
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading races...</p>
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
    <PlayerCreationLayout
      title="Races"
      description="Choose your character's race. Each race has unique abilities, starting attributes, and racial traits that will shape your journey through Tamriel."
    >
      <PlayerCreationFilters
        searchCategories={searchCategories}
        selectedTags={currentFilters.selectedTags}
        viewMode={viewMode}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        onViewModeChange={handleViewModeChange}
      />

      <PlayerCreationContent>
        <PlayerCreationItemsSection>
          <ItemGrid
            items={filteredItems}
            viewMode={viewMode}
            onItemSelect={handleItemSelect}
            selectedItem={selectedItem}
            renderItemCard={renderRaceCard}
          />
        </PlayerCreationItemsSection>

        <PlayerCreationDetailSection>
          {selectedItem ? (
            renderRaceDetailPanel(selectedItem)
          ) : (
            <PlayerCreationEmptyDetail />
          )}
        </PlayerCreationDetailSection>
      </PlayerCreationContent>
    </PlayerCreationLayout>
  )
} 