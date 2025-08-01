import React from 'react'
import { Input } from '@/shared/ui/ui/input'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import type { RecipeFilters } from '../types'

interface SearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: RecipeFilters
  onFiltersChange: (filters: RecipeFilters) => void
  availableCategories: string[]
  availableDifficulties: string[]
  availableEffects: string[]
  availableIngredients: string[]
  className?: string
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableCategories,
  availableDifficulties,
  availableEffects,
  availableIngredients,
  className,
}: SearchAndFiltersProps) {
  const handleFilterChange = (key: keyof RecipeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      categories: [],
      difficulties: [],
      effects: [],
      ingredients: [],
      minIngredientCount: null,
      maxIngredientCount: null,
      minMagnitude: null,
      maxMagnitude: null,
      hasEffects: null,
      isComplex: null,
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.effects.length > 0 ||
    filters.ingredients.length > 0 ||
    filters.minIngredientCount !== null ||
    filters.maxIngredientCount !== null ||
    filters.minMagnitude !== null ||
    filters.maxMagnitude !== null ||
    filters.hasEffects !== null ||
    filters.isComplex !== null

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recipes by name, ingredients, effects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {Object.values(filters).filter(v => 
                    Array.isArray(v) ? v.length > 0 : v !== null && v !== ''
                  ).length - 1}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Categories */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Categories
            </DropdownMenuLabel>
            {availableCategories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.categories, category]
                    : filters.categories.filter(c => c !== category)
                  handleFilterChange('categories', newCategories)
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {/* Difficulties */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Difficulties
            </DropdownMenuLabel>
            {availableDifficulties.map((difficulty) => (
              <DropdownMenuCheckboxItem
                key={difficulty}
                checked={filters.difficulties.includes(difficulty)}
                onCheckedChange={(checked) => {
                  const newDifficulties = checked
                    ? [...filters.difficulties, difficulty]
                    : filters.difficulties.filter(d => d !== difficulty)
                  handleFilterChange('difficulties', newDifficulties)
                }}
              >
                {difficulty}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {/* Effects */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Effects
            </DropdownMenuLabel>
            {availableEffects.slice(0, 10).map((effect) => (
              <DropdownMenuCheckboxItem
                key={effect}
                checked={filters.effects.includes(effect)}
                onCheckedChange={(checked) => {
                  const newEffects = checked
                    ? [...filters.effects, effect]
                    : filters.effects.filter(e => e !== effect)
                  handleFilterChange('effects', newEffects)
                }}
              >
                {effect}
              </DropdownMenuCheckboxItem>
            ))}
            {availableEffects.length > 10 && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                +{availableEffects.length - 10} more effects
              </div>
            )}
            
            <DropdownMenuSeparator />
            
            {/* Ingredients */}
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Ingredients
            </DropdownMenuLabel>
            {availableIngredients.slice(0, 10).map((ingredient) => (
              <DropdownMenuCheckboxItem
                key={ingredient}
                checked={filters.ingredients.includes(ingredient)}
                onCheckedChange={(checked) => {
                  const newIngredients = checked
                    ? [...filters.ingredients, ingredient]
                    : filters.ingredients.filter(i => i !== ingredient)
                  handleFilterChange('ingredients', newIngredients)
                }}
              >
                {ingredient}
              </DropdownMenuCheckboxItem>
            ))}
            {availableIngredients.length > 10 && (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                +{availableIngredients.length - 10} more ingredients
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {(filters.categories.length > 0 || 
        filters.difficulties.length > 0 || 
        filters.effects.length > 0 || 
        filters.ingredients.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge
              key={`category-${category}`}
              variant="secondary"
              className="gap-1"
            >
              Category: {category}
              <button
                onClick={() => handleFilterChange('categories', 
                  filters.categories.filter(c => c !== category)
                )}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.difficulties.map((difficulty) => (
            <Badge
              key={`difficulty-${difficulty}`}
              variant="secondary"
              className="gap-1"
            >
              Difficulty: {difficulty}
              <button
                onClick={() => handleFilterChange('difficulties', 
                  filters.difficulties.filter(d => d !== difficulty)
                )}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.effects.map((effect) => (
            <Badge
              key={`effect-${effect}`}
              variant="outline"
              className="gap-1"
            >
              Effect: {effect}
              <button
                onClick={() => handleFilterChange('effects', 
                  filters.effects.filter(e => e !== effect)
                )}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.ingredients.map((ingredient) => (
            <Badge
              key={`ingredient-${ingredient}`}
              variant="outline"
              className="gap-1"
            >
              Ingredient: {ingredient}
              <button
                onClick={() => handleFilterChange('ingredients', 
                  filters.ingredients.filter(i => i !== ingredient)
                )}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 