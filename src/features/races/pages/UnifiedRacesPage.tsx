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
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'

export function UnifiedRacesPage() {
  // Load race data from public/data/playable-races.json at runtime
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/playable-races.json`)
        if (!res.ok) throw new Error('Failed to fetch race data')
        const data = await res.json()
        setRaces(data.races as Race[])
      } catch (err) {
        setError('Failed to load race data')
        console.error('Error loading races:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [])

  // Convert races to PlayerCreationItem format using new transformation
  const playerCreationItems: PlayerCreationItem[] = races.map(race => 
    transformRaceToPlayerCreationItem(race)
  )

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const allKeywords = [...new Set(races.flatMap(race => 
      race.keywords.map(keyword => keyword.edid)
    ))]
    
    const allSkills = [...new Set(races.flatMap(race => 
      race.skillBonuses.map(bonus => bonus.skill)
    ))]
    
    const allAbilities = [...new Set(races.flatMap(race => 
      race.racialSpells.map(spell => spell.name)
    ))]

    const categories = [...new Set(races.map(race => race.category))]

    return [
      {
        id: 'racial-abilities',
        name: 'Racial Abilities',
        placeholder: 'Search by ability...',
        options: allAbilities.map(ability => ({
          id: `ability-${ability}`,
          label: ability,
          value: ability,
          category: 'Racial Abilities',
          description: `Races with ${ability} ability`
        }))
      },
      {
        id: 'skill-bonuses',
        name: 'Skill Bonuses',
        placeholder: 'Search by skill...',
        options: allSkills.map(skill => ({
          id: `skill-${skill}`,
          label: skill,
          value: skill,
          category: 'Skill Bonuses',
          description: `Races with ${skill} bonus`
        }))
      },
      {
        id: 'keywords',
        name: 'Keywords',
        placeholder: 'Search by keyword...',
        options: allKeywords.map(keyword => ({
          id: `keyword-${keyword}`,
          label: keyword,
          value: keyword,
          category: 'Keywords',
          description: `Races with ${keyword} keyword`
        }))
      },
      {
        id: 'categories',
        name: 'Race Categories',
        placeholder: 'Filter by category...',
        options: categories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Race Categories',
          description: `${category} races`
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
      originalRace={races.find(race => race.edid.toLowerCase().replace('race', '') === item.id)}
      isSelected={isSelected}
    />
  )

  const renderRaceDetailPanel = (item: PlayerCreationItem) => (
    <RaceDetailPanel 
      item={item}
      originalRace={races.find(race => race.edid.toLowerCase().replace('race', '') === item.id)}
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