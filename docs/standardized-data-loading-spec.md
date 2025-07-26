# Standardized Data Loading Technical Specification

## 🎯 Overview

This specification defines a centralized data loading architecture that provides caching, global search, and consistent data access patterns across all features in the Lorerim Arcaneum application.

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Skills    │  │    Races    │  │   Traits    │         │
│  │   Feature   │  │   Feature   │  │   Feature   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Shared Data Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 DataProvider (Zustand)                  │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   Skills    │ │    Races    │ │   Traits    │       │ │
│  │  │    Store    │ │    Store    │ │    Store    │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │ Religions   │ │ Birthsigns  │ │   Destiny   │       │ │
│  │  │    Store    │ │    Store    │ │    Store    │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │              Global Search Engine                   │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Cache     │  │   Fetch     │  │ Transform   │         │
│  │  Manager    │  │   Layer     │  │   Layer     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Data Source Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  skills.json│  │ races.json  │  │ traits.json │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │religions.json│  │birthsigns.json│ │destiny.json │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. Application Startup
```
App → DataInitializer → DataProvider.loadAllData() → Fetch JSON Files → Cache Data
```

### 2. Feature Data Access
```
Feature Component → useSkills() → DataProvider → Return Cached Data
```

### 3. Global Search
```
GlobalSearch → searchAll() → Search All Cached Data → Return Ranked Results
```

## 🔧 Core Components

### 1. DataProvider (Zustand Store)

**Location**: `src/shared/data/DataProvider.ts`

**Responsibilities**:
- Centralized state management for all data types
- Automatic caching with configurable expiry
- Data transformation and normalization
- Global search functionality
- Error handling and loading states

**Key Features**:
```typescript
interface DataState {
  // Raw data storage
  skills: Skill[]
  races: Race[]
  traits: Trait[]
  religions: Religion[]
  birthsigns: Birthsign[]
  destinyNodes: DestinyNode[]
  perkTrees: PerkTree[]
  
  // Loading states per data type
  loading: Record<DataType, boolean>
  
  // Error states per data type
  errors: Record<DataType, string | null>
  
  // Cache metadata
  cache: {
    lastUpdated: Record<DataType, number | null>
    cacheExpiry: number // 5 minutes
  }
  
  // Actions
  loadSkills: () => Promise<void>
  loadRaces: () => Promise<void>
  // ... other load methods
  
  // Search
  searchAll: (query: string) => SearchResult[]
}
```

### 2. DataInitializer Component

**Location**: `src/shared/data/DataInitializer.tsx`

**Responsibilities**:
- Initialize all data on app startup
- Provide loading states during initialization
- Handle initialization errors
- Optional loading indicator

**Usage**:
```tsx
<DataInitializer showLoadingIndicator={true}>
  <App />
</DataInitializer>
```

### 3. GlobalSearch Component

**Location**: `src/shared/components/GlobalSearch.tsx`

**Responsibilities**:
- Global search interface
- Keyboard navigation (Cmd/Ctrl+K)
- Search result display and navigation
- Debounced search input

**Features**:
- Modal-based search interface
- Keyboard navigation (arrow keys, enter, escape)
- Result highlighting and snippets
- Type-based result categorization
- Automatic data loading

## 📋 Data Types

### Base Entity Interface
```typescript
interface BaseEntity {
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
}
```

### Feature-Specific Types
```typescript
interface Skill extends BaseEntity {
  edid: string
  keyAbilities?: string[]
  metaTags?: string[]
  scaling?: string
}

interface Race extends BaseEntity {
  edid: string
  source?: string
  startingStats?: {
    health: number
    magicka: number
    stamina: number
    carryWeight: number
  }
  skillBonuses?: Array<{
    skill: string
    bonus: number
  }>
  racialSpells?: Array<{
    edid: string
    name: string
    description: string
    globalFormId: string
  }>
  keywords?: string[]
}

// ... other type definitions
```

### Search Result Type
```typescript
interface SearchResult {
  type: 'skill' | 'race' | 'trait' | 'religion' | 'birthsign' | 'destiny' | 'perk'
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
  score: number
  highlights: {
    field: string
    snippet: string
  }[]
}
```

## 🔄 Caching Strategy

### Cache Configuration
- **Expiry Time**: 5 minutes (configurable)
- **Storage**: In-memory (Zustand store)
- **Invalidation**: Automatic based on timestamp
- **Refresh**: On-demand when cache expires

### Cache Validation
```typescript
isCacheValid: (key: DataType) => {
  const lastUpdated = cache.lastUpdated[key]
  if (!lastUpdated) return false
  return Date.now() - lastUpdated < cache.cacheExpiry
}
```

### Cache Benefits
- **Reduced Network Requests**: Data fetched once and shared
- **Faster Page Loads**: Instant data access after initial load
- **Better UX**: No loading states on subsequent visits
- **Reduced Server Load**: Fewer HTTP requests

## 🔍 Search Implementation

### Search Algorithm
1. **Text Normalization**: Convert to lowercase, trim whitespace
2. **Tokenization**: Split query into words
3. **Scoring**: Calculate relevance score for each entity
4. **Ranking**: Sort results by score
5. **Highlighting**: Generate context snippets

### Scoring Algorithm
```typescript
function calculateSearchScore(text: string, query: string): number {
  const queryWords = query.split(' ').filter(Boolean)
  let score = 0
  
  queryWords.forEach(word => {
    if (text.includes(word)) {
      score += 1
      // Bonus for exact matches
      if (text.includes(` ${word} `) || text.startsWith(word) || text.endsWith(word)) {
        score += 0.5
      }
    }
  })
  
  return score
}
```

### Searchable Fields
- **Skills**: name, description, category, metaTags, keyAbilities
- **Races**: name, description, category, keywords
- **Traits**: name, description, category, tags, effects
- **Religions**: name, description, pantheon, tenets, powers
- **Birthsigns**: name, description, category, powers, effects
- **Destiny**: name, description, tags

## 🎨 UI/UX Patterns

### Loading States
- **Global Loading**: Full-screen spinner during app initialization
- **Feature Loading**: Component-level loading states
- **Search Loading**: Inline loading indicator in search results

### Error Handling
- **Network Errors**: Retry mechanism with user feedback
- **Data Errors**: Graceful fallbacks with error boundaries
- **Search Errors**: Empty state with helpful messaging

### Keyboard Navigation
- **Global Search**: Cmd/Ctrl+K to open
- **Search Navigation**: Arrow keys to navigate results
- **Result Selection**: Enter to select, Escape to close

## 📈 Performance Considerations

### Optimization Strategies
1. **Debounced Search**: 300ms delay to prevent excessive searches
2. **Memoized Results**: Cache search results to prevent recalculation
3. **Virtual Scrolling**: For large result sets (future enhancement)
4. **Lazy Loading**: Load data only when needed

### Memory Management
- **Cache Expiry**: Automatic cleanup of old data
- **Result Limiting**: Limit search results to prevent memory issues
- **Garbage Collection**: Zustand handles cleanup automatically

### Network Optimization
- **Parallel Loading**: Load all data types simultaneously
- **Error Recovery**: Retry failed requests with exponential backoff
- **Request Deduplication**: Prevent duplicate requests for same data

## 🔧 Configuration Options

### Cache Configuration
```typescript
const CACHE_CONFIG = {
  expiry: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000, // Maximum cached items per type
  enablePersistentCache: false, // Future: localStorage persistence
}
```

### Search Configuration
```typescript
const SEARCH_CONFIG = {
  debounceDelay: 300, // ms
  maxResults: 50, // Maximum results per search
  minQueryLength: 2, // Minimum characters to trigger search
  enableFuzzySearch: false, // Future: fuzzy matching
}
```

## 🧪 Testing Strategy

### Unit Tests
- **Data Loading**: Test individual data type loading
- **Cache Management**: Test cache validation and expiry
- **Search Algorithm**: Test scoring and ranking
- **Error Handling**: Test network and data errors

### Integration Tests
- **End-to-End Search**: Test complete search flow
- **Data Persistence**: Test cache across navigation
- **Performance**: Test loading times and memory usage

### User Acceptance Tests
- **Search Usability**: Test search interface and navigation
- **Data Accuracy**: Verify search results match expectations
- **Performance**: Test with large datasets

## 🚀 Future Enhancements

### Phase 1: Core Implementation
- [x] Centralized data store
- [x] Global search functionality
- [x] Caching system
- [x] Migration guide

### Phase 2: Advanced Features
- [ ] Persistent cache (localStorage)
- [ ] Fuzzy search with typo tolerance
- [ ] Search result analytics
- [ ] Advanced filtering options

### Phase 3: Performance Optimizations
- [ ] Virtual scrolling for large lists
- [ ] Search result pagination
- [ ] Background data prefetching
- [ ] Service worker for offline support

### Phase 4: Advanced Search
- [ ] Full-text search with Elasticsearch
- [ ] Search suggestions and autocomplete
- [ ] Search history and favorites
- [ ] Advanced search operators

## 📊 Metrics and Monitoring

### Performance Metrics
- **Data Load Time**: Time to load all data types
- **Search Response Time**: Time to return search results
- **Cache Hit Rate**: Percentage of requests served from cache
- **Memory Usage**: Memory consumption of cached data

### User Experience Metrics
- **Search Usage**: Number of searches per session
- **Search Success Rate**: Percentage of searches with results
- **Navigation Efficiency**: Time from search to destination
- **Error Rate**: Percentage of failed data loads

### Technical Metrics
- **Network Requests**: Number of HTTP requests
- **Bundle Size**: Impact on application bundle
- **Memory Leaks**: Memory usage over time
- **Error Frequency**: Rate of data loading errors

## 🔒 Security Considerations

### Data Validation
- **Input Sanitization**: Sanitize search queries
- **Type Validation**: Validate data structure on load
- **Size Limits**: Limit search result sizes

### Privacy
- **Search Privacy**: No search queries logged (configurable)
- **Data Exposure**: Ensure sensitive data not exposed in search
- **Access Control**: Future: role-based data access

## 📚 API Reference

### Hooks
```typescript
// Data access hooks
useSkills(): { skills, loading, error, loadSkills }
useRaces(): { races, loading, error, loadRaces }
useTraits(): { traits, loading, error, loadTraits }
useReligions(): { religions, loading, error, loadReligions }
useBirthsigns(): { birthsigns, loading, error, loadBirthsigns }
useDestinyNodes(): { destinyNodes, loading, error, loadDestinyNodes }
usePerkTrees(): { perkTrees, loading, error, loadPerkTrees }

// Search and cache hooks
useGlobalSearch(): { searchAll }
useDataCache(): { isCacheValid, clearCache, loadAllData }
```

### Components
```typescript
// Data initialization
<DataInitializer showLoadingIndicator={boolean}>
  {children}
</DataInitializer>

// Global search
<GlobalSearch 
  className?: string
  placeholder?: string
/>
```

### Types
```typescript
// Base types
BaseEntity, Skill, Race, Trait, Religion, Birthsign, DestinyNode, PerkTree

// Search types
SearchResult, SearchHighlight

// Store types
DataState, LoadingState, ErrorState, CacheState
```

This specification provides a comprehensive foundation for standardized data loading with caching and global search capabilities, ensuring consistent patterns across all features while maintaining performance and user experience. 