# Player Creation Migration Guide

## Overview

This guide explains how to migrate from the monolithic `PlayerCreationPage` component to the new composable architecture. The new system provides better flexibility and reusability by breaking down the large component into smaller, focused pieces.

## Migration Benefits

- **Better Composability**: Mix and match only the components you need
- **Custom Layouts**: Easily create custom layouts that don't fit the standard pattern
- **Reduced Bundle Size**: Only import the components you actually use
- **Easier Testing**: Test individual components in isolation
- **Better Type Safety**: More specific prop interfaces for each component

## New Composable Components

### Layout Components

#### `PlayerCreationLayout`
The main wrapper that provides the page structure with header and content area.

```tsx
<PlayerCreationLayout
  title="Races"
  description="Choose your character's race..."
>
  {/* Your content here */}
</PlayerCreationLayout>
```

#### `PlayerCreationContent`
Provides the main grid layout (3/4 for items, 1/4 for detail panel).

```tsx
<PlayerCreationContent>
  <PlayerCreationItemsSection>
    {/* Your items grid/list */}
  </PlayerCreationItemsSection>
  <PlayerCreationDetailSection>
    {/* Your detail panel */}
  </PlayerCreationDetailSection>
</PlayerCreationContent>
```

#### `PlayerCreationFilters`
Handles search, tags, and view mode controls.

```tsx
<PlayerCreationFilters
  searchCategories={searchCategories}
  selectedTags={currentFilters.selectedTags}
  viewMode={viewMode}
  onTagSelect={handleTagSelect}
  onTagRemove={handleTagRemove}
  onViewModeChange={handleViewModeChange}
>
  {/* Optional custom content after filters */}
</PlayerCreationFilters>
```

### Utility Components

#### `PlayerCreationEmptyDetail`
Shows a placeholder when no item is selected.

```tsx
<PlayerCreationEmptyDetail 
  title="Select a Race"
  description="Choose a race to view its details"
/>
```

### New Hook

#### `usePlayerCreationFilters`
Manages filter state and provides handlers for search and tag operations.

```tsx
const {
  filters,
  handleSearch,
  handleTagSelect,
  handleTagRemove,
  updateFilters
} = usePlayerCreationFilters({
  initialFilters: currentFilters,
  onFiltersChange: handleFiltersChange,
  onSearch: handleSearch
})
```

## Migration Examples

### Simple Migration (Races Page)

**Before:**
```tsx
return (
  <PlayerCreationPage
    title="Races"
    description="Choose your character's race..."
    items={filteredItems}
    searchCategories={searchCategories}
    selectedItem={selectedItem}
    onItemSelect={handleItemSelect}
    onFiltersChange={handleFiltersChange}
    onSearch={handleSearch}
    onTagSelect={handleTagSelect}
    onTagRemove={handleTagRemove}
    viewMode={viewMode}
    onViewModeChange={handleViewModeChange}
    renderItemCard={renderRaceCard}
    renderDetailPanel={renderRaceDetailPanel}
    currentFilters={currentFilters}
  />
)
```

**After:**
```tsx
return (
  <PlayerCreationLayout
    title="Races"
    description="Choose your character's race..."
  >
    <PlayerCreationFilters
      searchCategories={searchCategories}
      selectedTags={currentFilters.selectedTags}
      viewMode={viewMode}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
      onViewModeChange={handleViewModeChange}
    />

    <PlayerCreationContent>
      <PlayerCreationItemsSection>
        <ItemGrid
          items={filteredItems}
          viewMode={viewMode}
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          renderItemCard={renderRaceCard}
        />
      </PlayerCreationItemsSection>

      <PlayerCreationDetailSection>
        {selectedItem ? (
          renderRaceDetailPanel(selectedItem)
        ) : (
          <PlayerCreationEmptyDetail />
        )}
      </PlayerCreationDetailSection>
    </PlayerCreationContent>
  </PlayerCreationLayout>
)
```

### Complex Migration (Religions Page with Custom Content)

**Before:**
```tsx
return (
  <PlayerCreationPage
    title=""
    description=""
    items={filteredItems}
    searchCategories={searchCategories}
    selectedItem={selectedItem}
    onItemSelect={handleItemSelect}
    onFiltersChange={handleFiltersChange}
    onSearch={handleSearch}
    onTagSelect={handleTagSelect}
    onTagRemove={handleTagRemove}
    viewMode={viewMode}
    onViewModeChange={handleViewModeChange}
    renderItemCard={activeTab === 'follower' ? renderReligionCard : renderBlessingCard}
    renderDetailPanel={activeTab === 'follower' ? renderReligionDetailPanel : renderBlessingDetailPanel}
    currentFilters={currentFilters}
    customContentAfterFilters={
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'follower' | 'blessing')}>
        <TabsList>
          <TabsTrigger value="follower">Follower</TabsTrigger>
          <TabsTrigger value="blessing">Blessing</TabsTrigger>
        </TabsList>
      </Tabs>
    }
  />
)
```

**After:**
```tsx
return (
  <PlayerCreationLayout
    title="Religions"
    description="Choose your character's religion..."
  >
    <PlayerCreationFilters
      searchCategories={searchCategories}
      selectedTags={currentFilters.selectedTags}
      viewMode={viewMode}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
      onViewModeChange={handleViewModeChange}
    >
      {/* Custom content after filters */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'follower' | 'blessing')}>
        <TabsList>
          <TabsTrigger value="follower">Follower</TabsTrigger>
          <TabsTrigger value="blessing">Blessing</TabsTrigger>
        </TabsList>
      </Tabs>
    </PlayerCreationFilters>

    <PlayerCreationContent>
      <PlayerCreationItemsSection>
        <ItemGrid
          items={filteredItems}
          viewMode={viewMode}
          onItemSelect={handleItemSelect}
          selectedItem={selectedItem}
          renderItemCard={activeTab === 'follower' ? renderReligionCard : renderBlessingCard}
        />
      </PlayerCreationItemsSection>

      <PlayerCreationDetailSection>
        {selectedItem ? (
          activeTab === 'follower' ? renderReligionDetailPanel(selectedItem) : renderBlessingDetailPanel(selectedItem)
        ) : (
          <PlayerCreationEmptyDetail />
        )}
      </PlayerCreationDetailSection>
    </PlayerCreationContent>
  </PlayerCreationLayout>
)
```

## Migration Steps

### Step 1: Update Imports
Replace the monolithic import with specific component imports:

```tsx
// Before
import { PlayerCreationPage } from '@/shared/components/playerCreation'

// After
import { 
  PlayerCreationLayout,
  PlayerCreationContent,
  PlayerCreationItemsSection,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  ItemGrid
} from '@/shared/components/playerCreation'
```

### Step 2: Add Filter Hook (Optional)
If you want to use the new filter management hook:

```tsx
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'

// In your component
const {
  handleTagSelect,
  handleTagRemove
} = usePlayerCreationFilters({
  initialFilters: currentFilters,
  onFiltersChange: handleFiltersChange,
  onSearch: handleSearch
})
```

### Step 3: Restructure JSX
Replace the `PlayerCreationPage` component with the composable structure shown in the examples above.

### Step 4: Test and Refine
- Test that all functionality works as expected
- Adjust styling if needed
- Add any custom content in the appropriate sections

## Advanced Usage Patterns

### Custom Layouts
You can create completely custom layouts by mixing and matching components:

```tsx
<PlayerCreationLayout title="Custom Layout">
  {/* Custom header content */}
  <div className="mb-4">
    <CustomHeaderComponent />
  </div>

  {/* Custom filters */}
  <CustomFiltersComponent />

  {/* Custom content layout */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <CustomItemsComponent />
    </div>
    <div className="lg:col-span-1">
      <CustomDetailComponent />
    </div>
  </div>
</PlayerCreationLayout>
```

### Conditional Components
You can conditionally render components based on your needs:

```tsx
<PlayerCreationLayout title="Conditional Layout">
  {showFilters && (
    <PlayerCreationFilters {...filterProps} />
  )}
  
  <PlayerCreationContent>
    <PlayerCreationItemsSection>
      <ItemGrid {...gridProps} />
    </PlayerCreationItemsSection>
    
    {showDetailPanel && (
      <PlayerCreationDetailSection>
        {selectedItem ? renderDetail(selectedItem) : <PlayerCreationEmptyDetail />}
      </PlayerCreationDetailSection>
    )}
  </PlayerCreationContent>
</PlayerCreationLayout>
```

## Backward Compatibility

The original `PlayerCreationPage` component is still available and marked as deprecated. You can gradually migrate pages one at a time without breaking existing functionality.

## Support

If you encounter issues during migration, refer to the example files:
- `src/features/races/pages/UnifiedRacesPageComposable.tsx`
- `src/features/religions/pages/UnifiedReligionsPageComposable.tsx`

These demonstrate the migration patterns for both simple and complex use cases. 