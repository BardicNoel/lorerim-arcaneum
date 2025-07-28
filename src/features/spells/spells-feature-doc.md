# Spells Feature Documentation

## 📋 General Rule for Feature Documentation

All features in the Lorerim Arcaneum project must follow this standardized documentation structure. This ensures consistency, maintainability, and comprehensive coverage of feature functionality, architecture, and implementation details.

---

## 🎯 Feature Overview

### Purpose
The Spells feature provides a comprehensive interface for browsing and searching all available spells in the Lorerim Arcaneum application. It leverages the Model-View-Adapter (MVA) architecture pattern to deliver a consistent, searchable, and filterable experience for spell discovery, enabling players to explore magical schools, levels, and effects with detailed information about costs, magnitudes, and durations.

### Core Functionality
- **Spell Browsing**: Display all available spells in grid/list/accordion view modes with visual school indicators
- **Advanced Search**: Fuzzy search by spell name, school, level, description, and effects
- **Comprehensive Filtering**: Multi-criteria filtering by schools, levels, effect types, and cost ranges
- **Detailed Information**: Complete spell details including effects, magnitudes, durations, and areas
- **Responsive Design**: Mobile-friendly interface with adaptive layouts
- **Statistics Dashboard**: Overview of spell distribution and characteristics

### Data Structure
Spells are defined with the following structure:

```typescript
interface Spell {
  name: string
  editorId: string
  description: string
  school: string
  level: string
  magickaCost: number
  tome: string
  vendors: string[]
  halfCostPerk: string
  halfCostPerkName: string
  effects: SpellEffect[]
}

interface SpellEffect {
  name: string
  description: string
  magnitude: number
  duration: number
  area: number
}
```

---

## 🏗️ Architecture Overview

### MVA Pattern Implementation

The Spells feature follows the Model-View-Adapter (MVA) architecture pattern:

#### **Model Layer** (`src/features/spells/model/`)
- **SpellModel**: Pure business logic for spell data manipulation
- **SpellDataProvider**: Data loading, caching, and validation
- **Types**: TypeScript interfaces and type definitions

#### **Adapter Layer** (`src/features/spells/adapters/`)
- **useSpellData**: Data loading and caching hooks
- **useSpellFilters**: Filtering and search functionality
- **useSpellComputed**: Derived data and statistics

#### **View Layer** (`src/features/spells/views/`)
- **SpellReferenceView**: Main reference interface
- **SpellDetailView**: Individual spell details (future)
- **SpellComparisonView**: Spell comparison interface (future)

#### **Component Layer** (`src/features/spells/components/`)
- **Atomic Components**: Reusable UI building blocks
- **Composition Components**: Higher-level component compositions

---

## 📁 File Structure

```
src/features/spells/
├── model/
│   ├── SpellModel.ts              # Pure business logic
│   ├── SpellDataProvider.ts       # Data loading and caching
│   └── index.ts                   # Model exports
├── adapters/
│   ├── useSpellData.ts            # Data loading hooks
│   ├── useSpellFilters.ts         # Filtering and search
│   ├── useSpellComputed.ts        # Derived data
│   └── index.ts                   # Adapter exports
├── components/
│   ├── atomic/
│   │   ├── SpellItem.tsx          # Individual spell display
│   │   ├── SpellBadge.tsx         # Spell tags and badges
│   │   └── index.ts               # Atomic exports
│   ├── composition/
│   │   ├── SpellGrid.tsx          # Grid layout
│   │   ├── SpellList.tsx          # List layout
│   │   ├── SpellAccordion.tsx     # Accordion layout
│   │   └── index.ts               # Composition exports
│   └── index.ts                   # Component exports
├── views/
│   ├── SpellReferenceView.tsx     # Main reference interface
│   └── index.ts                   # View exports
├── pages/
│   ├── SpellsPage.tsx             # Page wrapper
│   └── index.ts                   # Page exports
├── types.ts                       # TypeScript interfaces
├── index.ts                       # Feature exports
└── spells-feature-doc.md          # This documentation
```

---

## 🔧 Technical Implementation

### Model Layer

#### SpellModel
Pure business logic class with static methods for:
- **Validation**: `isValid()`, `equals()`
- **Computed Properties**: `addComputedProperties()`
- **Filtering**: `filterBySchool()`, `filterByLevel()`, `filterByMagickaCost()`
- **Search**: `search()` with fuzzy matching
- **Sorting**: `sort()` with multiple criteria
- **Statistics**: `getStatistics()`

#### SpellDataProvider
Singleton class for data management:
- **Caching**: 5-minute cache duration
- **Loading**: Async data fetching from `/data/player_spells.json`
- **Validation**: Data integrity checks
- **Error Handling**: Graceful error management

### Adapter Layer

#### useSpellData
React hook for data management:
```typescript
interface UseSpellDataReturn {
  spells: SpellWithComputed[]
  loading: boolean
  error: string | null
  schools: string[]
  levels: string[]
  loadSpells: () => Promise<void>
  refresh: () => Promise<void>
}
```

#### useSpellFilters
React hook for filtering and search:
```typescript
interface UseSpellFiltersReturn {
  filters: SpellFilters
  filteredSpells: SpellWithComputed[]
  hasActiveFilters: boolean
  setSearchTerm: (term: string) => void
  setSchools: (schools: string[]) => void
  clearFilters: () => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
}
```

#### useSpellComputed
React hook for derived data:
```typescript
interface UseSpellComputedReturn {
  statistics: SpellStatistics
  spellsBySchool: Record<string, SpellWithComputed[]>
  spellsByLevel: Record<string, SpellWithComputed[]>
  compareSpells: (spell1, spell2) => SpellComparison
  getSpellEfficiency: (spell) => number
}
```

### Component Layer

#### Atomic Components
- **SpellItem**: Individual spell display with multiple variants
- **SpellBadge**: Reusable badge components for schools, levels, costs

#### Composition Components
- **SpellGrid**: Responsive grid layout (1-4 columns)
- **SpellList**: Vertical list layout
- **SpellAccordion**: Grouped accordion layout

### View Layer

#### SpellReferenceView
Main interface combining all adapters and components:
- **Statistics Dashboard**: Overview metrics
- **Search Interface**: Fuzzy search with clear functionality
- **Filter Controls**: Multi-criteria filtering
- **View Mode Toggle**: Grid/List/Accordion switching
- **Sort Controls**: Multi-field sorting with order toggle

---

## 🎨 User Interface

### View Modes

#### Grid View
- **Layout**: Responsive grid (1-4 columns)
- **Content**: Spell cards with school icons, level badges, and key stats
- **Use Case**: Quick browsing and comparison

#### List View
- **Layout**: Vertical list with full spell details
- **Content**: Expanded spell information with effects and tags
- **Use Case**: Detailed reading and analysis

#### Accordion View
- **Layout**: Grouped accordion sections
- **Grouping**: By school, level, or no grouping
- **Use Case**: Organized exploration by categories

### Filtering System

#### Search
- **Fuzzy Search**: Matches across name, school, level, description, effects
- **Scoring**: Prioritizes exact matches, then partial matches
- **Real-time**: Updates results as user types

#### Multi-Criteria Filters
- **Schools**: Multiple school selection with badge toggles
- **Levels**: Multiple level selection with badge toggles
- **Effect Types**: Has effects, area spells, duration spells
- **Cost Ranges**: Min/max magicka cost filtering
- **Magnitude Ranges**: Min/max magnitude filtering

#### Filter Management
- **Active Filter Count**: Shows number of active filters
- **Clear All**: One-click filter reset
- **Individual Clear**: Remove specific filters

### Statistics Dashboard

#### Overview Metrics
- **Total Spells**: Complete spell count
- **Schools**: Number of magical schools
- **Levels**: Number of spell levels
- **Average Cost**: Mean magicka cost
- **Area Spells**: Count of area effect spells
- **Free Spells**: Count of zero-cost spells

---

## 🔍 Search and Filtering

### Search Algorithm
The fuzzy search implementation prioritizes matches in the following order:
1. **Exact Name Match** (100 points)
2. **Name Contains** (50 points)
3. **Exact School Match** (30 points)
4. **School Contains** (15 points)
5. **Exact Level Match** (25 points)
6. **Level Contains** (10 points)
7. **Description Contains** (5 points)
8. **Tag Matches** (3 points each)
9. **Effect Name Matches** (8 points each)
10. **Effect Description Matches** (4 points each)

### Filter Combinations
Filters are applied in sequence:
1. **School Filters**: Multiple school selection
2. **Level Filters**: Multiple level selection
3. **Effect Property Filters**: Has effects, area, duration
4. **Cost Range Filters**: Min/max magicka cost
5. **Magnitude Range Filters**: Min/max magnitude
6. **Search Term**: Fuzzy search on remaining results

### Performance Optimization
- **Memoization**: React.useMemo for expensive computations
- **Caching**: 5-minute data cache to reduce API calls
- **Lazy Loading**: Components load data on demand
- **Debounced Search**: Search input debounced to prevent excessive filtering

---

## 📊 Data Flow

### Data Loading Flow
```
User Action → useSpellData → SpellDataProvider → JSON File → Validation → Cache → UI Update
```

### Filter Flow
```
User Input → useSpellFilters → SpellModel.applyFilters → Filtered Results → UI Update
```

### Search Flow
```
User Input → useSpellFilters → SpellModel.search → Scored Results → UI Update
```

### Component Hierarchy
```
SpellsPage
└── SpellReferenceView
    ├── Statistics Dashboard
    ├── Search Interface
    ├── Filter Controls
    ├── View Mode Toggle
    └── Spell Display (Grid/List/Accordion)
        └── SpellItem Components
```

---

## 🧪 Testing Strategy

### Unit Tests
- **Model Layer**: Test all SpellModel static methods
- **Data Provider**: Test caching, loading, and error handling
- **Adapters**: Test hook logic and state management

### Integration Tests
- **Component Integration**: Test adapter-component interactions
- **Filter Integration**: Test filter combinations and search
- **View Integration**: Test complete user workflows

### E2E Tests
- **User Journeys**: Complete spell browsing workflows
- **Search Scenarios**: Various search and filter combinations
- **Performance**: Load testing with large spell datasets

---

## 🚀 Future Enhancements

### Planned Features
- **Spell Comparison**: Side-by-side spell comparison
- **Spell Builds**: Save and share spell combinations
- **Advanced Analytics**: Spell usage statistics and trends
- **Spell Recommendations**: AI-powered spell suggestions
- **Export Functionality**: Export spell lists and builds

### Technical Improvements
- **Virtual Scrolling**: For large spell lists
- **Advanced Caching**: Redis-based caching for better performance
- **Real-time Updates**: WebSocket integration for live data
- **Offline Support**: Service worker for offline browsing
- **Progressive Web App**: PWA capabilities

---

## 🔧 Configuration

### Environment Variables
```env
# Spell data configuration
SPELL_CACHE_DURATION=300000  # 5 minutes in milliseconds
SPELL_DATA_URL=/data/player_spells.json
```

### Feature Flags
```typescript
interface SpellFeatureFlags {
  enableAdvancedSearch: boolean
  enableSpellComparison: boolean
  enableSpellBuilds: boolean
  enableAnalytics: boolean
}
```

---

## 📈 Performance Metrics

### Key Performance Indicators
- **Load Time**: < 2 seconds for initial spell load
- **Search Response**: < 500ms for fuzzy search
- **Filter Response**: < 200ms for filter application
- **Memory Usage**: < 50MB for 1000+ spells
- **Cache Hit Rate**: > 80% for repeated visits

### Optimization Techniques
- **Code Splitting**: Lazy load non-critical components
- **Image Optimization**: Optimized spell icons and graphics
- **Bundle Optimization**: Tree shaking and minification
- **CDN Integration**: Static asset delivery optimization

---

## 🐛 Known Issues

### Current Limitations
- **Large Dataset**: Performance may degrade with 10,000+ spells
- **Mobile Layout**: Accordion view needs mobile optimization
- **Search Accuracy**: Fuzzy search may miss some edge cases
- **Filter Persistence**: Filters don't persist across sessions

### Workarounds
- **Pagination**: Implement pagination for large datasets
- **Responsive Design**: Improve mobile accordion layout
- **Search Improvements**: Enhance fuzzy search algorithm
- **Local Storage**: Add filter persistence

---

## 📚 API Reference

### SpellModel Methods
```typescript
// Validation
static isValid(spell: any): spell is Spell
static equals(spell1: Spell, spell2: Spell): boolean

// Computed Properties
static addComputedProperties(spell: Spell): SpellWithComputed

// Filtering
static filterBySchool(spells: SpellWithComputed[], school: string): SpellWithComputed[]
static filterByLevel(spells: SpellWithComputed[], level: string): SpellWithComputed[]
static filterByMagickaCost(spells: SpellWithComputed[], min: number, max: number): SpellWithComputed[]

// Search
static search(spells: SpellWithComputed[], query: string): SpellSearchResult[]

// Sorting
static sort(spells: SpellWithComputed[], sortBy: string, sortOrder: 'asc' | 'desc'): SpellWithComputed[]

// Statistics
static getStatistics(spells: SpellWithComputed[]): SpellStatistics
```

### Adapter Hooks
```typescript
// Data Management
const { spells, loading, error, schools, levels } = useSpellData()

// Filtering and Search
const { filters, filteredSpells, setSearchTerm, clearFilters } = useSpellFilters(spells)

// Computed Data
const { statistics, spellsBySchool, compareSpells } = useSpellComputed(spells)
```

### Component Props
```typescript
// SpellItem
interface SpellItemProps {
  spell: SpellWithComputed
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  className?: string
}

// SpellGrid
interface SpellGridProps {
  spells: SpellWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  columns?: 1 | 2 | 3 | 4
  className?: string
}
```

---

## 🤝 Contributing

### Development Guidelines
1. **Follow MVA Pattern**: Maintain clear separation of concerns
2. **Type Safety**: Use TypeScript for all new code
3. **Component Composition**: Prefer composition over inheritance
4. **Performance**: Optimize for large datasets
5. **Accessibility**: Ensure WCAG 2.1 AA compliance
6. **Testing**: Write tests for all new functionality

### Code Review Checklist
- [ ] MVA architecture compliance
- [ ] TypeScript type safety
- [ ] Component reusability
- [ ] Performance considerations
- [ ] Accessibility features
- [ ] Test coverage
- [ ] Documentation updates

---

## 📄 License

This feature is part of the Lorerim Arcaneum project and follows the same licensing terms as the main project.

---

*Last updated: [Current Date]*
*Version: 1.0.0*
*Maintainer: [Your Name]* 