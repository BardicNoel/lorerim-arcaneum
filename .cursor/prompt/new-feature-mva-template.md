# New Feature MVA Template

## 🎯 Feature Overview

### Purpose

[Describe the feature's purpose and what problem it solves for users]

### Core Functionality

- **[Primary Function]**: [Main user-facing capability]
- **[Secondary Function]**: [Supporting capabilities]
- **[Search/Filter]**: [Search and filtering capabilities]
- **[Data Management]**: [How data is managed and displayed]
- **[User Interactions]**: [Key user interactions and workflows]

### Data Structure

[Define the core data structures for this feature]

```typescript
interface [FeatureName]Item {
  id: string
  name: string
  description: string
  // Add other core properties
}

interface [FeatureName]Filter {
  id: string
  type: 'category' | 'tag' | 'attribute'
  value: string
  label: string
}
```

---

## 🏗️ MVA Architecture Setup

### 1. Model Layer (`src/features/[featureName]/model/`)

#### **Data Provider** (`[FeatureName]DataProvider.ts`)

```typescript
export class [FeatureName]DataProvider {
  private items: [FeatureName]Item[] = []
  private loading = false
  private error: string | null = null
  private loaded = false

  async loadItems(): Promise<[FeatureName]Item[]> {
    // Implement data loading logic
  }

  getItems(): [FeatureName]Item[] {
    return this.items
  }

  isLoading(): boolean {
    return this.loading
  }

  getError(): string | null {
    return this.error
  }

  isLoaded(): boolean {
    return this.loaded
  }

  async retry(): Promise<[FeatureName]Item[]> {
    // Implement retry logic
  }

  clear(): void {
    // Implement clear logic
  }
}
```

#### **Model Utilities** (`[FeatureName]Model.ts`)

```typescript
export class [FeatureName]Model {
  static isValid(item: any): item is [FeatureName]Item {
    // Implement validation logic
  }

  static search(items: [FeatureName]Item[], query: string): [FeatureName]Item[] {
    // Implement search logic
  }

  static filterByCategory(items: [FeatureName]Item[], category: string): [FeatureName]Item[] {
    // Implement category filtering
  }

  static filterByTag(items: [FeatureName]Item[], tag: string): [FeatureName]Item[] {
    // Implement tag filtering
  }

  static sortByName(items: [FeatureName]Item[]): [FeatureName]Item[] {
    // Implement sorting logic
  }

  static getUniqueCategories(items: [FeatureName]Item[]): string[] {
    // Implement category extraction
  }

  static getUniqueTags(items: [FeatureName]Item[]): string[] {
    // Implement tag extraction
  }
}
```

### 2. Adapter Layer (`src/features/[featureName]/adapters/`)

#### **Data Adapter** (`use[FeatureName]Data.ts`)

```typescript
interface Use[FeatureName]DataOptions {
  includeRelationships?: boolean
  filterByCategory?: string[]
  searchTerm?: string
  sortBy?: 'name' | 'category' | 'date'
}

interface Use[FeatureName]DataReturn {
  // Data
  items: [FeatureName]Item[]
  filteredItems: [FeatureName]Item[]

  // State
  isLoading: boolean
  error: string | null

  // Computed
  categories: string[]
  tags: string[]

  // Actions
  refresh: () => void
  getItemById: (id: string) => [FeatureName]Item | undefined
  getItemByName: (name: string) => [FeatureName]Item | undefined

  // Filtering
  filterByCategory: (category: string) => [FeatureName]Item[]
  filterByTag: (tag: string) => [FeatureName]Item[]
  searchItems: (term: string) => [FeatureName]Item[]
}

export function use[FeatureName]Data(
  options: Use[FeatureName]DataOptions = {}
): Use[FeatureName]DataReturn {
  // Implement data adapter logic
}
```

#### **Filters Adapter** (`use[FeatureName]Filters.ts`)

```typescript
export type FilterType = 'browse' | 'search' | 'reference'

export interface [FeatureName]Filter {
  id: string
  type: 'category' | 'tag' | 'attribute'
  value: string
  label: string
}

interface Use[FeatureName]FiltersOptions {
  filterType: FilterType
  availableItems?: [FeatureName]Item[]
}

interface Use[FeatureName]FiltersReturn {
  // Filter state
  selectedFilters: [FeatureName]Filter[]
  searchCategories: SearchCategory[]

  // Actions
  addFilter: (filter: [FeatureName]Filter) => void
  removeFilter: (filterId: string) => void
  clearFilters: () => void

  // Filtered data
  filteredItems: [FeatureName]Item[]

  // Helper functions
  getFilterOptions: () => SearchOption[]
  isItemAvailable: (item: [FeatureName]Item) => boolean
}

export function use[FeatureName]Filters(
  options: Use[FeatureName]FiltersOptions
): Use[FeatureName]FiltersReturn {
  // Implement filters adapter logic
}
```

#### **State Adapter** (`use[FeatureName]State.ts`)

```typescript
interface Use[FeatureName]StateOptions {
  initialSelection?: string[]
  allowMultiple?: boolean
}

interface Use[FeatureName]StateReturn {
  // Selection state
  selectedItems: [FeatureName]Item[]
  selectedItemIds: string[]

  // Actions
  selectItem: (item: [FeatureName]Item) => void
  deselectItem: (itemId: string) => void
  clearSelection: () => void
  setSelection: (items: [FeatureName]Item[]) => void

  // Computed
  isSelected: (item: [FeatureName]Item) => boolean
  selectionCount: number
}

export function use[FeatureName]State(
  options: Use[FeatureName]StateOptions = {}
): Use[FeatureName]StateReturn {
  // Implement state adapter logic
}
```

### 3. View Layer (`src/features/[featureName]/views/`)

#### **Main Page View** (`[FeatureName]PageView.tsx`)

```typescript
interface [FeatureName]PageViewProps {
  onItemSelect?: (item: [FeatureName]Item) => void
  onSelectionChange?: (items: [FeatureName]Item[]) => void
  className?: string
}

export function [FeatureName]PageView({
  onItemSelect,
  onSelectionChange,
  className = '',
}: [FeatureName]PageViewProps) {
  // Use adapters for data and state
  const { items, isLoading, error } = use[FeatureName]Data()
  const { selectedItems, selectItem, clearSelection } = use[FeatureName]State()
  const { selectedFilters, addFilter, removeFilter, filteredItems } = use[FeatureName]Filters({
    filterType: 'browse',
    availableItems: items,
  })

  // Handle item selection
  const handleItemSelect = (item: [FeatureName]Item) => {
    selectItem(item)
    onItemSelect?.(item)
  }

  // Handle filter changes
  const handleFilterSelect = (option: SearchOption) => {
    const filter: [FeatureName]Filter = {
      id: option.id,
      type: 'category', // Adjust based on option
      value: option.value,
      label: option.label,
    }
    addFilter(filter)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className={className}>
      {/* Search and Filters */}
      <[FeatureName]Filters
        searchCategories={searchCategories}
        selectedFilters={selectedFilters}
        onFilterSelect={handleFilterSelect}
        onFilterRemove={removeFilter}
        onClearFilters={clearFilters}
      />

      {/* Items Grid/List */}
      <[FeatureName]Grid
        items={filteredItems}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />

      {/* Detail Panel */}
      {selectedItems.length > 0 && (
        <[FeatureName]DetailPanel
          item={selectedItems[0]}
          onClose={() => clearSelection()}
        />
      )}
    </div>
  )
}
```

#### **Build Page Card View** (`BuildPage[FeatureName]Card.tsx`)

```typescript
interface BuildPage[FeatureName]CardProps {
  navigate: (to: string) => void
}

export function BuildPage[FeatureName]Card({
  navigate,
}: BuildPage[FeatureName]CardProps) {
  const { build, set[FeatureName]Items } = useCharacterBuild()
  const { items, isLoading, error } = use[FeatureName]Data()
  const { selectedItems, selectItem, clearSelection } = use[FeatureName]State()

  // Handle item selection for build
  const handleItemSelect = (item: [FeatureName]Item) => {
    selectItem(item)
    set[FeatureName]Items([item.id]) // Adjust based on build structure
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg">[FeatureName]</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/[featureName]')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Implement build page card content */}
      </CardContent>
    </Card>
  )
}
```

### 4. Component Layer (`src/features/[featureName]/components/`)

#### **Atomic Components** (`atomic/`)

```typescript
// [FeatureName]Item.tsx - Core item display
interface [FeatureName]ItemProps {
  item: [FeatureName]Item
  variant?: 'default' | 'compact' | 'detailed'
  showTags?: boolean
  className?: string
}

// [FeatureName]Card.tsx - Card wrapper for items
interface [FeatureName]CardProps {
  item: [FeatureName]Item
  isSelected: boolean
  onSelect?: (item: [FeatureName]Item) => void
  viewMode?: 'grid' | 'list'
}

// [FeatureName]DetailPanel.tsx - Detailed item information
interface [FeatureName]DetailPanelProps {
  item: [FeatureName]Item
  onClose?: () => void
  onSelect?: (item: [FeatureName]Item) => void
}
```

#### **Composition Components** (`composition/`)

```typescript
// [FeatureName]Grid.tsx - Grid/list view container
interface [FeatureName]GridProps {
  items: [FeatureName]Item[]
  selectedItems: [FeatureName]Item[]
  onItemSelect: (item: [FeatureName]Item) => void
  viewMode?: 'grid' | 'list'
}

// [FeatureName]Filters.tsx - Search and filter controls
interface [FeatureName]FiltersProps {
  searchCategories: SearchCategory[]
  selectedFilters: [FeatureName]Filter[]
  onFilterSelect: (option: SearchOption) => void
  onFilterRemove: (filterId: string) => void
  onClearFilters: () => void
}

// [FeatureName]AccordionList.tsx - Accordion view for items
interface [FeatureName]AccordionListProps {
  items: [FeatureName]Item[]
}
```

### 5. Page Layer (`src/features/[featureName]/pages/`)

#### **Main Page** (`[FeatureName]Page.tsx`)

```typescript
export function [FeatureName]Page() {
  return (
    <BuildPageShell
      title="[FeatureName]"
      description="[Feature description]"
    >
      <[FeatureName]PageView />
    </BuildPageShell>
  )
}
```

---

## 📁 File Structure

```
src/features/[featureName]/
├── model/
│   ├── [FeatureName]DataProvider.ts
│   ├── [FeatureName]Model.ts
│   └── index.ts
├── adapters/
│   ├── use[FeatureName]Data.ts
│   ├── use[FeatureName]Filters.ts
│   ├── use[FeatureName]State.ts
│   ├── __tests__/
│   │   └── use[FeatureName]Filters.test.tsx
│   └── index.ts
├── views/
│   ├── [FeatureName]PageView.tsx
│   ├── BuildPage[FeatureName]Card.tsx
│   └── index.ts
├── components/
│   ├── atomic/
│   │   ├── [FeatureName]Item.tsx
│   │   ├── [FeatureName]Card.tsx
│   │   ├── [FeatureName]DetailPanel.tsx
│   │   └── index.ts
│   ├── composition/
│   │   ├── [FeatureName]Grid.tsx
│   │   ├── [FeatureName]Filters.tsx
│   │   ├── [FeatureName]AccordionList.tsx
│   │   └── index.ts
│   └── index.ts
├── pages/
│   ├── [FeatureName]Page.tsx
│   └── index.ts
├── types.ts
├── [featureName]-feature-doc.md
└── index.ts
```

---

## 🔧 Implementation Checklist

### Phase 1: Model Layer

- [ ] Create `[FeatureName]DataProvider.ts` with data loading logic
- [ ] Create `[FeatureName]Model.ts` with utility functions
- [ ] Define core data types in `types.ts`
- [ ] Add data source (JSON file) to `public/data/`

### Phase 2: Adapter Layer

- [ ] Implement `use[FeatureName]Data.ts` for data management
- [ ] Implement `use[FeatureName]Filters.ts` for search/filtering
- [ ] Implement `use[FeatureName]State.ts` for selection state
- [ ] Add unit tests for adapters

### Phase 3: Component Layer

- [ ] Create atomic components (`[FeatureName]Item`, `[FeatureName]Card`, etc.)
- [ ] Create composition components (`[FeatureName]Grid`, `[FeatureName]Filters`, etc.)
- [ ] Ensure components are pure and reusable
- [ ] Add proper TypeScript interfaces

### Phase 4: View Layer

- [ ] Create `[FeatureName]PageView.tsx` for main feature view
- [ ] Create `BuildPage[FeatureName]Card.tsx` for build page integration
- [ ] Implement proper error handling and loading states
- [ ] Add responsive design considerations

### Phase 5: Page Layer

- [ ] Create `[FeatureName]Page.tsx` for routing
- [ ] Add feature to router configuration
- [ ] Update navigation and build page integration

### Phase 6: Integration

- [ ] Add feature to main exports
- [ ] Update build page to include feature card
- [ ] Add feature to character build state
- [ ] Test complete user workflows

---

## 🎨 UI/UX Guidelines

### Visual Design

- Use consistent color schemes and spacing
- Implement responsive design for all screen sizes
- Follow existing component patterns from shared UI library
- Use proper loading and error states

### Interaction Patterns

- Implement hover effects for interactive elements
- Use consistent selection states (ring borders, color coding)
- Provide clear feedback for user actions
- Support keyboard navigation where appropriate

### Accessibility

- Add proper ARIA labels and semantic HTML
- Ensure color contrast compliance
- Support screen reader navigation
- Implement focus management for complex interactions

---

## 🧪 Testing Strategy

### Unit Tests

- Test all adapter functions with mock data
- Test model utility functions
- Test component rendering with various props
- Test error handling and edge cases

### Integration Tests

- Test complete user workflows
- Test data flow between adapters and views
- Test integration with build page
- Test responsive design breakpoints

### Performance Tests

- Test with large datasets
- Test search and filter performance
- Test memory usage during extended sessions
- Test mobile device performance

---

## 📚 Documentation

### Feature Documentation

- Create comprehensive feature documentation
- Document data structures and relationships
- Document user workflows and interactions
- Document technical implementation details

### API Documentation

- Document all adapter interfaces
- Document component props and interfaces
- Document model utility functions
- Document data transformation logic

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Advanced search capabilities
- [ ] Data persistence and caching
- [ ] Real-time updates
- [ ] Mobile optimizations
- [ ] Accessibility improvements

### Technical Improvements

- [ ] Performance optimizations
- [ ] Code splitting and lazy loading
- [ ] Advanced error handling
- [ ] Analytics integration
- [ ] Internationalization support

---

## 📝 Usage Instructions

1. **Replace Placeholders**: Replace `[FeatureName]`, `[featureName]`, etc. with your feature's name
2. **Customize Data Structures**: Modify data interfaces for your specific domain
3. **Implement Adapters**: Fill in the adapter logic based on your data requirements
4. **Create Components**: Build atomic and composition components for your UI needs
5. **Add Views**: Create page views that consume your adapters
6. **Test Thoroughly**: Ensure all functionality works as expected
7. **Document**: Create comprehensive documentation for your feature

This template provides a solid foundation for implementing new features using the MVA pattern, ensuring consistency with the existing codebase architecture.
