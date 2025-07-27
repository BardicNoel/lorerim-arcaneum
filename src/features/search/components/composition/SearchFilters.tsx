import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { Separator } from '@/shared/ui/ui/separator'
import { Filter, Search, X } from 'lucide-react'
import type {
  SearchFilterOptions,
  SearchFilters,
} from '../../model/SearchModel'

interface SearchFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  activeFilters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
  onClearFilters: () => void
  availableFilters: SearchFilterOptions
  resultCount: number
  className?: string
}

export function SearchFilters({
  query,
  onQueryChange,
  activeFilters,
  onFiltersChange,
  onClearFilters,
  availableFilters,
  resultCount,
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

  const handleTagToggle = (tag: string) => {
    const newTags = activeFilters.tags.includes(tag)
      ? activeFilters.tags.filter(t => t !== tag)
      : [...activeFilters.tags, tag]
    onFiltersChange({ tags: newTags })
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search skills, races, traits, religions..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Active Filters</Label>
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
            {activeFilters.types.map(type => (
              <Badge
                key={`type-${type}`}
                variant="secondary"
                className="text-xs"
              >
                Type: {type}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTypeToggle(type)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {activeFilters.categories.map(category => (
              <Badge
                key={`category-${category}`}
                variant="secondary"
                className="text-xs"
              >
                Category: {category}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {activeFilters.tags.map(tag => (
              <Badge key={`tag-${tag}`} variant="secondary" className="text-xs">
                Tag: {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
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

      <Separator />

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Types Filter */}
        {availableFilters.types.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Types
            </Label>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {availableFilters.types.map(type => (
                  <Button
                    key={type.value}
                    variant={
                      activeFilters.types.includes(type.value)
                        ? 'default'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() => handleTypeToggle(type.value)}
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span>{type.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Categories Filter */}
        {availableFilters.categories.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categories</Label>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {availableFilters.categories.map(category => (
                  <Button
                    key={category.value}
                    variant={
                      activeFilters.categories.includes(category.value)
                        ? 'default'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() => handleCategoryToggle(category.value)}
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span>{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Tags Filter */}
        {availableFilters.tags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {availableFilters.tags.map(tag => (
                  <Button
                    key={tag.value}
                    variant={
                      activeFilters.tags.includes(tag.value)
                        ? 'default'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() => handleTagToggle(tag.value)}
                    className="w-full justify-between h-8 text-xs"
                  >
                    <span>{tag.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tag.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
