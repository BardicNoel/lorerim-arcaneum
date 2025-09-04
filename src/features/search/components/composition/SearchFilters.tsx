import { cn } from '@/lib/utils'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import type {
  SearchFilterOptions,
  SearchFilters,
} from '../../model/SearchModel'

interface SearchFiltersProps {
  activeFilters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onClearFilters: () => void
  availableFilters: SearchFilterOptions
  resultCount: number
  onTagSelect: (optionOrTag: SearchOption | string) => void
  onTagRemove: (tagId: string) => void
  selectedTags: SelectedTag[]
  className?: string
}

export function SearchFilters({
  activeFilters,
  onFiltersChange,
  onClearFilters,
  availableFilters,
  resultCount,
  onTagSelect,
  onTagRemove,
  selectedTags,
  className,
}: SearchFiltersProps) {
  const hasActiveFilters =
    (activeFilters?.types?.length || 0) > 0 ||
    (activeFilters?.categories?.length || 0) > 0 ||
    (activeFilters?.tags?.length || 0) > 0

  const handleTypeToggle = (type: string) => {
    const currentTypes = activeFilters?.types || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    onFiltersChange({ types: newTypes })
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = activeFilters?.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    onFiltersChange({ categories: newCategories })
  }

  // Generate search categories for freeform search (excluding record types)
  const generateSearchCategories = (): SearchCategory[] => {
    return [
      {
        id: 'fuzzy-search',
        name: 'Search All',
        placeholder: 'Search by name, description, or abilities...',
        options: [], // No predefined options for freeform search
      },
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Filter by category...',
        options: (availableFilters.categories || [])
          .filter(category => category && typeof category.label === 'string')
          .map(category => ({
            id: `category-${category.value}`,
            label: String(category.label),
            value: category.value,
            category: 'Categories',
            description: `${category.count} item${category.count !== 1 ? 's' : ''}`,
          })),
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Filter by tag...',
        options: (availableFilters.tags || [])
          .filter(tag => tag && typeof tag.label === 'string')
          .map(tag => ({
            id: `tag-${tag.value}`,
            label: String(tag.label),
            value: tag.value,
            category: 'Tags',
            description: `${tag.count} item${tag.count !== 1 ? 's' : ''}`,
          })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Freeform Search Autocomplete */}
      <div className="space-y-2">
        <CustomMultiAutocompleteSearch
          categories={searchCategories}
          onSelect={onTagSelect}
          onCustomSearch={onTagSelect}
        />
      </div>

      {/* Record Type Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Record Types</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableFilters.types.map(type => (
            <Button
              key={type.value}
              variant={
                (activeFilters?.types || []).includes(type.value)
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() => handleTypeToggle(type.value)}
              className="text-xs"
            >
              {type.label}
              <span className="ml-1 text-muted-foreground">({type.count})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.category}: {tag.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTagRemove(tag.id)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Result Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultCount} result{resultCount !== 1 ? 's' : ''} found
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
