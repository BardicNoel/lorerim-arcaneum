import React, { useState } from 'react'
import { H1, H2, P } from '@/shared/ui/ui/typography'
import { MultiAutocompleteSearch } from './MultiAutocompleteSearch'
import { SelectedTags } from './SelectedTags'
import { ItemGrid } from './ItemGrid'
import { DetailPanel } from './DetailPanel'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List } from 'lucide-react'
import { Z_INDEX } from '@/lib/constants'
import type { PlayerCreationPageProps, PlayerCreationFilters, PlayerCreationItem, SearchOption, SelectedTag } from './types'

export function PlayerCreationPage<T extends PlayerCreationItem>({
  title,
  description,
  items,
  searchCategories,
  selectedItem,
  onItemSelect,
  onFiltersChange,
  onSearch,
  onTagSelect,
  onTagRemove,
  viewMode = 'grid',
  onViewModeChange,
  renderItemCard,
  renderDetailPanel,
  searchPlaceholder,
  currentFilters,
  customContentAfterFilters
}: PlayerCreationPageProps<T> & { 
  currentFilters?: PlayerCreationFilters
  customContentAfterFilters?: React.ReactNode
}) {
  const [localFilters, setLocalFilters] = useState<PlayerCreationFilters>(
    currentFilters || {
      search: '',
      selectedFilters: {},
      selectedTags: []
    }
  )

  // Sync with external filters if provided
  React.useEffect(() => {
    if (currentFilters) {
      setLocalFilters(currentFilters)
    }
  }, [currentFilters])

  const handleSearch = (query: string) => {
    const updatedFilters = { ...localFilters, search: query }
    setLocalFilters(updatedFilters)
    onSearch(query)
  }

  const handleTagSelect = (option: SearchOption) => {
    const newTag: SelectedTag = {
      id: `${option.category}-${option.id}`,
      label: option.label,
      value: option.value,
      category: option.category
    }
    
    // Check if tag already exists
    const tagExists = localFilters.selectedTags.some(tag => tag.id === newTag.id)
    if (!tagExists) {
      const updatedFilters = {
        ...localFilters,
        selectedTags: [...localFilters.selectedTags, newTag]
      }
      setLocalFilters(updatedFilters)
      onTagSelect(newTag)
      onFiltersChange(updatedFilters)
    }
  }

  const handleTagRemove = (tagId: string) => {
    const updatedFilters = {
      ...localFilters,
      selectedTags: localFilters.selectedTags.filter(tag => tag.id !== tagId)
    }
    setLocalFilters(updatedFilters)
    onTagRemove(tagId)
    onFiltersChange(updatedFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <H1 className="text-3xl font-bold text-primary mb-2">{title}</H1>
          {description && (
            <P className="text-muted-foreground max-w-2xl">{description}</P>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Filters and View Toggle Row */}
          <div className="flex items-center gap-4">
            {/* Multi Autocomplete Search - Takes most space */}
            <div className="flex-1">
              <MultiAutocompleteSearch
                categories={searchCategories}
                onSelect={handleTagSelect}
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
            tags={localFilters.selectedTags}
            onRemove={handleTagRemove}
            className="justify-start"
          />

          {/* Custom Content After Filters */}
          {customContentAfterFilters && (
            <div className="pt-4">
              {customContentAfterFilters}
            </div>
          )}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Items Grid - Takes up more space */}
          <div className="lg:col-span-3">
            <ItemGrid
              items={items}
              viewMode={viewMode}
              onItemSelect={onItemSelect}
              selectedItem={selectedItem}
              renderItemCard={renderItemCard}
            />
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedItem ? (
              <div 
                className="sticky top-6"
                style={{ zIndex: Z_INDEX.STICKY }}
              >
                {renderDetailPanel(selectedItem)}
              </div>
            ) : (
              <div 
                className="sticky top-6"
                style={{ zIndex: Z_INDEX.STICKY }}
              >
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <H2 className="text-lg font-semibold mb-2">Select an Item</H2>
                  <P className="text-muted-foreground">
                    Choose an item from the list to view its details
                  </P>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 