import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import { MultiAutocompleteSearch } from '../MultiAutocompleteSearch'
import { SelectedTags } from '../SelectedTags'
import type { SearchCategory, SearchOption, SelectedTag } from '../types'

interface PlayerCreationFiltersProps {
  searchCategories: SearchCategory[]
  selectedTags: SelectedTag[]
  viewMode?: 'grid' | 'list'
  onTagSelect: (option: SearchOption) => void
  onTagRemove: (tagId: string) => void
  onViewModeChange?: (mode: 'grid' | 'list') => void
  children?: React.ReactNode
  className?: string
}

export function PlayerCreationFilters({
  searchCategories,
  selectedTags,
  viewMode = 'grid',
  onTagSelect,
  onTagRemove,
  onViewModeChange,
  children,
  className = ""
}: PlayerCreationFiltersProps) {
  return (
    <div className={`mb-8 space-y-4 ${className}`}>
      {/* Filters and View Toggle Row */}
      <div className="flex items-center gap-4">
        {/* Multi Autocomplete Search - Takes most space */}
        <div className="flex-1">
          <MultiAutocompleteSearch
            categories={searchCategories}
            onSelect={onTagSelect}
            className="w-full"
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
          </div>
        )}
      </div>

      {/* Selected Tags */}
      <SelectedTags
        tags={selectedTags}
        onRemove={onTagRemove}
        className="justify-start"
      />

      {/* Custom Content After Filters */}
      {children && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </div>
  )
} 