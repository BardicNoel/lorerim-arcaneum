import React, { useState, useEffect } from 'react'
import { 
  PlayerCreationLayout,
  PlayerCreationFilters
} from '@/shared/components/playerCreation'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { RaceAccordion } from '../components/RaceAccordion'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { CustomMultiAutocompleteSearch } from '../components/CustomMultiAutocompleteSearch'
import type { PlayerCreationItem, SearchCategory, SelectedTag, SearchOption } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'

export function AccordionRacesPage() {
  // Load race data from public/data/playable-races.json at runtime
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRaces, setExpandedRaces] = useState<Set<string>>(new Set())

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
        id: 'keywords',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: allKeywords.map(keyword => ({
          id: `keyword-${keyword}`,
          label: keyword,
          value: keyword,
          category: 'Fuzzy Search',
          description: `Races with ${keyword} keyword`
        }))
      },
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
        category: 'Fuzzy Search',
        type: 'custom'
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category
      }
    }
    // Prevent duplicate tags
    if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Fuzzy search query is the concatenation of all custom tags in the Fuzzy Search category
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  // Use fuzzy search for keyword-based searching
  const { filteredRaces: fuzzyFilteredRaces } = useFuzzySearch(races, fuzzySearchQuery)

  // Convert fuzzy filtered races to PlayerCreationItem format
  const fuzzyFilteredItems: PlayerCreationItem[] = fuzzyFilteredRaces.map(race => 
    transformRaceToPlayerCreationItem(race)
  )

  // Use the new filters hook for other filters (abilities, skills, categories)
  // (You can expand this to combine with fuzzy search if needed)

  // Use fuzzy filtered items when there are fuzzy tags, otherwise use all items
  const displayItems = fuzzySearchQuery.trim() ? fuzzyFilteredItems : playerCreationItems

  // Handle accordion expansion
  const handleRaceToggle = (raceId: string) => {
    const newExpanded = new Set(expandedRaces)
    if (newExpanded.has(raceId)) {
      newExpanded.delete(raceId)
    } else {
      newExpanded.add(raceId)
    }
    setExpandedRaces(newExpanded)
  }

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
      {/* Custom MultiAutocompleteSearch with FuzzySearchBox for keywords */}
      <CustomMultiAutocompleteSearch
        categories={searchCategories}
        onSelect={handleTagSelect}
        onCustomSearch={handleTagSelect}
      />

      {/* Selected Tags */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded bg-muted text-sm font-medium">
                {tag.label}
                <button
                  className="ml-2 text-muted-foreground hover:text-destructive"
                  onClick={() => handleTagRemove(tag.id)}
                  title="Remove tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {displayItems.map((item) => {
          const originalRace = races.find(race => 
            race.edid.toLowerCase().replace('race', '') === item.id
          )
          const isExpanded = expandedRaces.has(item.id)
          
          return (
            <RaceAccordion
              key={item.id}
              item={item}
              originalRace={originalRace}
              isExpanded={isExpanded}
              onToggle={() => handleRaceToggle(item.id)}
              className="w-full"
            />
          )
        })}
        
        {displayItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No races found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </PlayerCreationLayout>
  )
} 