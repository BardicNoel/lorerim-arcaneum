import { AutocompleteSearch } from '@/shared/components/playerCreation/AutocompleteSearch'
import type { SearchOption } from '@/shared/components/playerCreation/types'
import { X } from 'lucide-react'
import type { DestinyFilter } from '../../adapters/useDestinyFilters'

interface DestinyFiltersProps {
  searchCategories: any[]
  selectedFilters: DestinyFilter[]
  onFilterSelect: (option: SearchOption | string) => void
  onFilterRemove: (filterId: string) => void
  onClearFilters: () => void
  className?: string
}

export function DestinyFilters({
  searchCategories,
  selectedFilters,
  onFilterSelect,
  onFilterRemove,
  onClearFilters,
  className = '',
}: DestinyFiltersProps) {
  // Find specific categories for individual autocomplete fields
  const includesCategory = searchCategories.find(
    cat => cat.id === 'includes-node'
  )
  const endsWithCategory = searchCategories.find(
    cat => cat.id === 'ends-with-node'
  )
  const tagsCategory = searchCategories.find(cat => cat.id === 'tags')
  const prerequisitesCategory = searchCategories.find(
    cat => cat.id === 'prerequisites'
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Individual Autocomplete Fields with Labels */}
      <div className="flex flex-wrap gap-4">
        {/* Includes Node Filter */}
        {includesCategory && (
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium text-foreground">
              Includes
            </label>
            <AutocompleteSearch
              categories={[includesCategory]}
              onSelect={onFilterSelect}
              placeholder={includesCategory.placeholder}
              className="w-full"
            />
          </div>
        )}

        {/* Ends With Node Filter */}
        {endsWithCategory && (
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium text-foreground">
              Ends With
            </label>
            <AutocompleteSearch
              categories={[endsWithCategory]}
              onSelect={onFilterSelect}
              placeholder={endsWithCategory.placeholder}
              className="w-full"
            />
          </div>
        )}

        {/* Tags Filter (for reference page) */}
        {tagsCategory && (
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <AutocompleteSearch
              categories={[tagsCategory]}
              onSelect={onFilterSelect}
              placeholder={tagsCategory.placeholder}
              className="w-full"
            />
          </div>
        )}

        {/* Prerequisites Filter (for reference page) */}
        {prerequisitesCategory && (
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium text-foreground">
              Prerequisites
            </label>
            <AutocompleteSearch
              categories={[prerequisitesCategory]}
              onSelect={onFilterSelect}
              placeholder={prerequisitesCategory.placeholder}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Selected Filter Chips */}
      {selectedFilters.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Active Filters
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
              title="Clear all filters"
            >
              <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
              Clear All
            </button>

            {/* Individual Filter Chips */}
            {selectedFilters.map(filter => (
              <span
                key={filter.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                onClick={() => onFilterRemove(filter.id)}
                title="Click to remove"
              >
                <span className="text-xs opacity-70 mr-1">
                  {filter.type === 'includes-node'
                    ? 'Includes:'
                    : filter.type === 'ends-with-node'
                      ? 'Ends:'
                      : filter.type === 'tags'
                        ? 'Tag:'
                        : 'Prereq:'}
                </span>
                {filter.label}
                <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                  ×
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
