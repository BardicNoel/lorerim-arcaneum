import React from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import { MultiAutocompleteSearch } from '@/shared/components/playerCreation/MultiAutocompleteSearch'
import { SelectedTags } from '@/shared/components/playerCreation/SelectedTags'
import type { SearchCategory, SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'
import type { PerkReferenceViewMode } from '../../types'

interface PerkReferenceFiltersProps {
  searchCategories: SearchCategory[]
  selectedTags: SelectedTag[]
  viewMode?: PerkReferenceViewMode
  onTagSelect: (option: SearchOption) => void
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

      {/* Selected Tags */}
      <SelectedTags
        tags={selectedTags}
        onRemove={onTagRemove}
        className="justify-start"
      />

      {/* Custom Content After Filters */}
      {children && <div className="pt-4">{children}</div>}
    </div>
  )
} 