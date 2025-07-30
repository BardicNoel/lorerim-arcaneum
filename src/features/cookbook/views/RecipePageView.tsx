import React, { useState } from 'react'
import { useRecipeData, useRecipeFilters, useRecipeComputed } from '../adapters'
import { 
  RecipeGrid, 
  RecipeList, 
  ViewModeToggle,
  StatisticsDashboard,
  type ViewMode
} from '../components'
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
  const { statistics, availableCategories, availableDifficulties, availableEffects, availableIngredients } = useRecipeComputed(recipes)
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    try {
      const allIngredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients || []))]
        .filter(ingredient => ingredient && typeof ingredient === 'string')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0)
        .sort()
      
      const allEffects = [...new Set(recipes.flatMap(recipe => recipe.effects?.map(effect => effect.name) || []))]
        .filter(effect => effect && typeof effect === 'string')
        .map(effect => effect.trim())
        .filter(effect => effect.length > 0)
        .sort()
      
      const allCategories = [...new Set(recipes.map(recipe => recipe.category))]
        .filter(category => category && typeof category === 'string')
        .map(category => category.trim())
        .filter(category => category.length > 0)
        .sort()
      
      const allDifficulties = [...new Set(recipes.map(recipe => recipe.difficulty))]
        .filter(difficulty => difficulty && typeof difficulty === 'string')
        .map(difficulty => difficulty.trim())
        .filter(difficulty => difficulty.length > 0)
        .sort()

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, ingredients, effects, or description...',
        options: [
          ...allIngredients.map(ingredient => ({
            id: `ingredient-${ingredient}`,
            label: ingredient,
            value: ingredient,
            category: 'Fuzzy Search',
            description: `Recipes with ${ingredient}`,
          })),
          ...allEffects.map(effect => ({
            id: `effect-${effect}`,
            label: effect,
            value: effect,
            category: 'Fuzzy Search',
            description: `Recipes with ${effect} effect`,
          })),
        ],
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
      {
        id: 'difficulties',
        name: 'Difficulty',
        placeholder: 'Filter by difficulty...',
        options: allDifficulties.map(difficulty => ({
          id: `difficulty-${difficulty}`,
          label: difficulty,
          value: difficulty,
          category: 'Difficulty',
          description: `${difficulty} recipes`,
        })),
      },
    ]
    } catch (error) {
      console.error('Error generating search categories:', error)
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

        case 'Difficulty':
          // Filter by difficulty
          return recipe.difficulty === tag.value

        case 'Ingredients':
          // Filter by ingredients
          return recipe.ingredients.includes(tag.value)

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

  const handleRecipeClick = (recipe: RecipeWithComputed) => {
    console.log('Recipe clicked:', recipe.name)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cookbook</h1>
          <p className="text-muted-foreground">
            Browse and search through {statistics.totalRecipes} recipes
          </p>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>

        {/* View Mode Toggle */}
        <ViewModeToggle
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
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
        </TabsList>
        
        <TabsContent value="recipes">
          {/* Recipe Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recipes ({filteredRecipes.length})
              </h2>
              <div className="text-sm text-muted-foreground">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </div>
            </div>

            {/* Dynamic Recipe Display based on view mode */}
            {viewMode === 'grid' && (
              <RecipeGrid
                recipes={filteredRecipes}
                variant="default"
                columns={3}
                onRecipeClick={handleRecipeClick}
                showEffects={true}
                showIngredients={true}
              />
            )}

            {viewMode === 'list' && (
              <RecipeList
                recipes={filteredRecipes}
                variant="default"
                onRecipeClick={handleRecipeClick}
                showEffects={true}
                showIngredients={true}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          {/* Statistics Dashboard */}
          <StatisticsDashboard statistics={statistics} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 