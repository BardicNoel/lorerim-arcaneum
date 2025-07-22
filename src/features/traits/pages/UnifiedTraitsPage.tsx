import {
  BuildPageShell,
  ItemGrid,
  PlayerCreationContent,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  PlayerCreationItemsSection,
} from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
  SearchCategory,
} from '@/shared/components/playerCreation/types'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { useEffect, useState } from 'react'
import { TraitCard } from '../components/TraitCard'
import { TraitDetailPanel } from '../components/TraitDetailPanel'
import type { Trait } from '../types'
import { transformTraitToPlayerCreationItem } from '../utils/dataTransform'

export function UnifiedTraitsPage() {
  // Load trait data from public/data/traits.json at runtime
  const [traits, setTraits] = useState<Trait[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTraits() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/traits.json`)
        if (!res.ok) throw new Error('Failed to fetch trait data')
        const data = await res.json()
        setTraits(data.traits as Trait[])
      } catch (err) {
        setError('Failed to load trait data')
        console.error('Error loading traits:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTraits()
  }, [])

  // Convert traits to PlayerCreationItem format using the proper transformation
  const playerCreationItems: PlayerCreationItem[] = traits.map(
    transformTraitToPlayerCreationItem
  )

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const categories = [...new Set(traits.map(trait => trait.category))]
    const effectTypes = [
      ...new Set(
        traits.flatMap(trait => trait.effects.map(effect => effect.type))
      ),
    ]
    const tags = [...new Set(traits.flatMap(trait => trait.tags))]

    return [
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Search by category...',
        options: categories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Categories',
          description: `Traits in ${category} category`,
        })),
      },
      {
        id: 'effect-types',
        name: 'Effect Types',
        placeholder: 'Search by effect type...',
        options: effectTypes.map(effectType => ({
          id: `effect-${effectType}`,
          label: effectType.replace('_', ' ').toUpperCase(),
          value: effectType,
          category: 'Effect Types',
          description: `Traits with ${effectType} effects`,
        })),
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Search by tag...',
        options: tags.map(tag => ({
          id: `tag-${tag}`,
          label: tag,
          value: tag,
          category: 'Tags',
          description: `Traits tagged with ${tag}`,
        })),
      },
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
    handleViewModeChange,
  } = usePlayerCreation({
    items: playerCreationItems,
    filters: [],
  })

  // Use the new filters hook
  const { handleTagSelect, handleTagRemove } = usePlayerCreationFilters({
    initialFilters: currentFilters,
    onFiltersChange: handleFiltersChange,
    onSearch: handleSearch,
  })

  const renderTraitCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <TraitCard item={item} />
  )

  const renderTraitDetailPanel = (item: PlayerCreationItem) => (
    <TraitDetailPanel item={item} />
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traits...</p>
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
      title="Traits"
      description="Choose your character's traits. Each trait provides unique abilities, bonuses, and sometimes drawbacks that will define your character's strengths and playstyle."
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
            renderItemCard={renderTraitCard}
          />
        </PlayerCreationItemsSection>

        <PlayerCreationDetailSection>
          {selectedItem ? (
            renderTraitDetailPanel(selectedItem)
          ) : (
            <PlayerCreationEmptyDetail />
          )}
        </PlayerCreationDetailSection>
      </PlayerCreationContent>
    </BuildPageShell>
  )
}
