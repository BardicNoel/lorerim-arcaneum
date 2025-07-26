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
import { useTraits } from '@/shared/data/useDataCache'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { traitToPlayerCreationItem } from '@/shared/utils'
import { useMemo } from 'react'
import { TraitCard } from '../components/TraitCard'
import { TraitDetailPanel } from '../components/TraitDetailPanel'

export function UnifiedTraitsPage() {
  // Use the new cache-based hook - no infinite loops!
  const { data: traitsData, loading, error, reload } = useTraits()
  const traits = traitsData || []

  // Convert traits to PlayerCreationItem format using the proper transformation
  const playerCreationItems: PlayerCreationItem[] = useMemo(
    () => traits.map(traitToPlayerCreationItem),
    [traits]
  )

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const categories = [
      ...new Set(traits.map(trait => trait.category).filter(Boolean)),
    ]
    const effectTypes = [
      ...new Set(
        traits.flatMap(trait => trait.effects?.map(effect => effect.type) || [])
      ),
    ]
    const tags = [...new Set(traits.flatMap(trait => trait.tags || []))]

    return [
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Search by category...',
        options: categories.map(category => ({
          id: `category-${category}`,
          label: category as string,
          value: category as string,
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
            onClick={reload}
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
