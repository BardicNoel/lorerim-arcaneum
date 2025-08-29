import React, { useState, useEffect } from 'react'
import { useRecipeData, useRecipeFilters, useRecipeComputed } from '../adapters'
import { useRecipePagination } from '../adapters/useRecipePagination'
import { BuildPageShell } from '@/shared/components/playerCreation/BuildPageShell'
import { 
  RecipeGrid, 
  RecipeList, 
  ViewModeToggle,
  StatisticsDashboard,
  FoodMetaAnalysis,
  type ViewMode
} from '../components'
import { VirtualRecipeGrid } from '../components/composition/VirtualRecipeGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type { SearchCategory, SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import type { RecipeWithComputed } from '../types'

export function RecipePageView() {
  // Data adapters
  const { recipes, loading, error } = useRecipeData()
  
  // Filter adapters
  const { filteredRecipes: baseFilteredRecipes } = useRecipeFilters(recipes)

  // Computed adapters
  const { statistics, availableCategories, availableDifficulties, availableEffects, availableIngredients, getEffectComparisons } = useRecipeComputed(recipes)
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    try {
      // Check if recipes are loaded
      if (!recipes || recipes.length === 0) {
        return []
      }
      
      // Use the pre-computed available options from useRecipeComputed
      // This ensures consistency and avoids duplicate calculations
      const allIngredients = availableIngredients || []
      const allEffects = availableEffects || []
      const allCategories = availableCategories || []
      
      

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, ingredients, effects, or description...',
        options: [], // No autocomplete options - this should be free-form text input
      },
      {
        id: 'ingredients',
        name: 'Ingredients',
        placeholder: 'Filter by ingredient...',
        options: allIngredients.map(ingredient => ({
          id: `ingredient-${ingredient}`,
          label: ingredient,
          value: ingredient,
          category: 'Ingredients',
          description: `Recipes with ${ingredient}`,
        })),
      },
      {
        id: 'effects',
        name: 'Effects',
        placeholder: 'Filter by effect...',
        options: allEffects.map(effect => ({
          id: `effect-${effect}`,
          label: effect,
          value: effect,
          category: 'Effects',
          description: `Recipes with ${effect} effect`,
        })),
      },
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Filter by category...',
        options: allCategories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Categories',
          description: `${category} recipes`,
        })),
      },
      
    ]
    } catch (error) {
      return []
    }
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
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    // Prevent duplicate tags
    if (
      !selectedTags.some(
        t => t.value === tag.value && t.category === tag.category
      )
    ) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply all filters to recipes
  const filteredRecipesWithTags = baseFilteredRecipes.filter((recipe: RecipeWithComputed) => {
    // If no tags are selected, show all recipes
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Categories':
          // Filter by recipe category
          return recipe.category === tag.value

        

                         case 'Ingredients':
          // Filter by ingredients (handle both objects and strings)
          return recipe.ingredients.some(ingredient => {
            if (typeof ingredient === 'string') {
              return ingredient === tag.value
            }
            if (ingredient && typeof ingredient === 'object') {
              return ingredient.item === tag.value || 
                     ingredient.name === tag.value || 
                     ingredient.label === tag.value || 
                     ingredient.id === tag.value
            }
            return false
          })

        case 'Effects':
          // Filter by effects
          return recipe.effects.some(effect => effect.name === tag.value)

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered recipes
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredRecipes } = useFuzzySearch(
    filteredRecipesWithTags as RecipeWithComputed[],
    fuzzySearchQuery
  )

  // Add pagination
  const { 
    displayedItems, 
    loadMore, 
    resetPagination, 
    paginationInfo, 
    hasMore 
  } = useRecipePagination(filteredRecipes)

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [selectedTags, resetPagination])

  const handleRecipeClick = (recipe: RecipeWithComputed) => {
    // TODO: Implement recipe detail view or modal
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading recipes</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <BuildPageShell
      title="Cookbook"
      description={`Browse and search through ${statistics.totalRecipes} recipes. Discover new combinations, filter by ingredients and effects, and find the perfect recipe for your character.`}
    >
      {/* Search Bar Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>
      </div>

      {/* View Controls Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <ViewModeToggle
            currentMode={viewMode}
            onModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Selected Tags */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={() => setSelectedTags([])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
              title="Clear all filters"
            >
              <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
              Clear All
            </button>

            {/* Individual Tags */}
            {selectedTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                onClick={() => handleTagRemove(tag.id)}
                title="Click to remove"
              >
                {tag.label}
                <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                  ×
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="meta">Meta Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recipes">
          {/* Recipe Display */}
          <div className="space-y-4">
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {paginationInfo.displayedItems} of {paginationInfo.totalItems} recipes
            </div>

            {/* Dynamic Recipe Display based on view mode */}
            {viewMode === 'grid' && (
              <VirtualRecipeGrid
                recipes={displayedItems}
                variant="default"
                columns={3}
                onRecipeClick={handleRecipeClick}
                showEffects={true}
                showIngredients={true}
                getEffectComparisons={getEffectComparisons}
                loadMore={loadMore}
                hasMore={hasMore}
              />
            )}

            {viewMode === 'list' && (
              <div className="space-y-3">
                <RecipeList
                  recipes={displayedItems}
                  variant="default"
                  onRecipeClick={handleRecipeClick}
                  showEffects={true}
                  showIngredients={true}
                  getEffectComparisons={getEffectComparisons}
                />
                
                {/* Load More Button for List View */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      className="w-full max-w-xs"
                    >
                      Load More ({paginationInfo.displayedItems} of {paginationInfo.totalItems})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          {/* Statistics Dashboard */}
          <StatisticsDashboard statistics={statistics} />
        </TabsContent>
        
        <TabsContent value="meta">
          {/* Food Meta Analysis */}
          <FoodMetaAnalysis recipes={recipes} />
        </TabsContent>
      </Tabs>
    </BuildPageShell>
  )
} 