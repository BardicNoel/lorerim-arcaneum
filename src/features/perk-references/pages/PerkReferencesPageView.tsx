import { useState } from 'react'
import type { PerkReferenceItem, PerkReferenceViewMode } from '../types'
import type { SearchCategory, SelectedTag } from '@/shared/components/playerCreation/types'
import {
  PerkReferenceFilters,
  PerkReferenceGrid,
  PerkReferenceList,
  PerkReferenceAccordion,
} from '../components/composition'

// High-level view component that consumes adapters
interface PerkReferencesPageViewProps {
  items: PerkReferenceItem[]
  groupedItems: Record<string, PerkReferenceItem[]>
  stats: {
    totalPerks: number
    skillTrees: number
    multiRank: number
    singleRank: number
    withPrerequisites: number
  }
  searchCategories: SearchCategory[]
  selectedTags: SelectedTag[]
  viewMode: PerkReferenceViewMode
  searchQuery: string
  onTagSelect: (option: string | { id: string; label: string; category: string }) => void
  onTagRemove: (tagId: string) => void
  onClearTags: () => void
  onViewModeChange: (mode: PerkReferenceViewMode) => void
  onSearchChange: (query: string) => void
}

export function PerkReferencesPageView({
  items = [],
  groupedItems = {},
  stats = {
    totalPerks: 0,
    skillTrees: 0,
    multiRank: 0,
    singleRank: 0,
    withPrerequisites: 0,
  },
  searchCategories = [],
  selectedTags = [],
  viewMode = 'grid',
  searchQuery = '',
  onTagSelect,
  onTagRemove,
  onClearTags,
  onViewModeChange,
  onSearchChange,
}: PerkReferencesPageViewProps) {
  // Local state for selected item
  const [selectedItem, setSelectedItem] = useState<PerkReferenceItem | null>(null)

  const handleItemSelect = (item: PerkReferenceItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item)
  }

  const renderView = () => {
    switch (viewMode) {
      case 'grid':
        return (
          <PerkReferenceGrid
            items={items}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            showAddToBuild={true}
          />
        )
      case 'list':
        return (
          <PerkReferenceList
            items={items}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            showAddToBuild={true}
          />
        )
      case 'accordion':
        return (
          <PerkReferenceAccordion
            items={items}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            showToggle={true}
          />
        )
      default:
        return (
          <PerkReferenceGrid
            items={items}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            showAddToBuild={true}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <PerkReferenceFilters
        searchCategories={searchCategories}
        selectedTags={selectedTags}
        viewMode={viewMode}
        onTagSelect={onTagSelect}
        onTagRemove={onTagRemove}
        onViewModeChange={onViewModeChange}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search perks..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedTags?.length > 0 && (
            <button
              onClick={onClearTags || (() => {})}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          )}
        </div>
      </PerkReferenceFilters>

      {/* Results Section */}
      <div className="space-y-4">
        {!items || items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No perks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more perks.
            </p>
          </div>
        ) : (
          renderView()
        )}
      </div>
    </div>
  )
} 