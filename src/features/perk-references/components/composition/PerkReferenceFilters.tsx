import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type { SearchCategory, SearchOption } from '@/shared/components/playerCreation/types'
import type { PerkReferenceViewMode } from '../../types'

interface PerkReferenceFiltersProps {
  searchCategories: SearchCategory[]
  selectedTags: any[]
  viewMode?: PerkReferenceViewMode
  onTagSelect: (option: SearchOption | string) => void
  onTagRemove: (tagId: string) => void
  onViewModeChange?: (mode: PerkReferenceViewMode) => void
  children?: React.ReactNode
  className?: string
}

export function PerkReferenceFilters({
  searchCategories,
  selectedTags,
  viewMode = 'grid',
  onTagSelect,
  onTagRemove,
  onViewModeChange,
  children,
  className = '',
}: PerkReferenceFiltersProps) {
  return (
    <div className={`mb-8 space-y-4 ${className}`}>
      {/* Custom MultiAutocompleteSearch - matching races page pattern */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={onTagSelect}
            onCustomSearch={onTagSelect}
          />
        </div>

        {/* View Mode Toggle - Positioned to the right */}
        {onViewModeChange && (
          <div className="flex border rounded-lg p-1 bg-muted">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'accordion' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('accordion')}
              className="h-8 px-3"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      {/* Selected Tags - matching races page pattern */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Clear All Button */}
          <button
            onClick={() => {
              // Clear all tags - this will be handled by the parent component
              selectedTags.forEach(tag => onTagRemove(tag.id))
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
            title="Clear all filters"
          >
            <svg className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear All
          </button>

          {/* Individual Tags */}
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
              onClick={() => onTagRemove(tag.id)}
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

      {/* Custom Content After Filters */}
      {children && <div className="pt-4">{children}</div>}
    </div>
  )
} 