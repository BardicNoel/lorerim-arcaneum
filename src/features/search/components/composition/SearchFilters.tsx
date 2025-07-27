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
    activeFilters.types.length > 0 ||
    activeFilters.categories.length > 0 ||
    activeFilters.tags.length > 0

  const handleTypeToggle = (type: string) => {
    const newTypes = activeFilters.types.includes(type)
      ? activeFilters.types.filter(t => t !== type)
      : [...activeFilters.types, type]
    onFiltersChange({ types: newTypes })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category]
    onFiltersChange({ categories: newCategories })
  }

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    return [
      {
        id: 'fuzzy-search',
        name: 'Search All',
        placeholder: 'Search by name, description, or abilities...',
        options: availableFilters.types.map(type => ({
          id: `type-${type.value}`,
          label: type.label,
          value: type.value,
          category: 'Search All',
          description: `${type.count} ${type.label}${type.count !== 1 ? 's' : ''}`,
        })),
      },
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Filter by category...',
        options: availableFilters.categories.map(category => ({
          id: `category-${category.value}`,
          label: category.label,
          value: category.value,
          category: 'Categories',
          description: `${category.count} item${category.count !== 1 ? 's' : ''}`,
        })),
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Filter by tag...',
        options: availableFilters.tags.map(tag => ({
          id: `tag-${tag.value}`,
          label: tag.label,
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
      {/* Search Autocomplete */}
      <div className="space-y-2">
        <CustomMultiAutocompleteSearch
          categories={searchCategories}
          onSelect={onTagSelect}
          onCustomSearch={onTagSelect}
        />
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
