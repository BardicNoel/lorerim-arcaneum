# Global Search Integration Plan

## Overview
This document outlines the plan for integrating global search functionality into the LoreRim Arcaneum application, leveraging the centralized data system we've implemented.

## 1. Search Bar Placement & UI Design

### Primary Search Locations

#### 1.1 Header Search Bar (Primary)
- **Location**: `src/app/SiteHeader.tsx` - Top navigation bar
- **Design**: 
  - Compact search input with search icon
  - Placeholder: "Search skills, races, traits, religions..."
  - Keyboard shortcut: `Cmd/Ctrl + K` to focus
  - Responsive: Collapses to icon-only on mobile
- **Behavior**:
  - Click to expand into full search modal
  - Type to see instant results dropdown
  - Enter to navigate to search results page

#### 1.2 Homepage Hero Search (Secondary)
- **Location**: `src/pages/HomePage.tsx` - Main hero section
- **Design**:
  - Large, prominent search bar
  - Placeholder: "Discover your perfect build..."
  - Search button with icon
  - Popular search suggestions below
- **Behavior**:
  - Direct search with results page navigation
  - Show trending/popular searches

#### 1.3 Mobile Search (Tertiary)
- **Location**: Mobile navigation menu
- **Design**: Full-width search input
- **Behavior**: Same as header search

### Search Bar Components

```tsx
// Header Search Component
<HeaderSearch 
  placeholder="Search skills, races, traits..."
  shortcut="Cmd+K"
  onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
/>

// Hero Search Component  
<HeroSearch
  placeholder="Discover your perfect build..."
  suggestions={popularSearches}
  onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
/>
```

## 2. Search Results Page Design

### 2.1 Page Structure (`/search`)

#### URL Structure
```
/search?q=sword&type=skill&category=combat&sort=relevance
```

#### Layout Components
```tsx
// Search Results Page Layout
<SearchResultsPage>
  {/* Search Header */}
  <SearchHeader>
    <SearchInput value={query} onChange={setQuery} />
    <SearchFilters filters={activeFilters} onChange={setFilters} />
  </SearchHeader>

  {/* Results Section */}
  <SearchResults>
    <ResultsStats total={totalResults} time={searchTime} />
    <ResultsList results={results} />
    <Pagination page={currentPage} total={totalPages} />
  </SearchResults>

  {/* Sidebar */}
  <SearchSidebar>
    <FilterPanel filters={availableFilters} />
    <RecentSearches searches={recentSearches} />
  </SearchSidebar>
</SearchResultsPage>
```

### 2.2 Search Results Display

#### Result Card Design
```tsx
<SearchResultCard>
  {/* Result Header */}
  <ResultHeader>
    <ResultIcon type={result.type} />
    <ResultTitle>{result.name}</ResultTitle>
    <ResultBadge type={result.type} />
    <ResultCategory category={result.category} />
  </ResultHeader>

  {/* Result Content */}
  <ResultContent>
    <ResultDescription>{result.description}</ResultDescription>
    <ResultHighlights highlights={result.highlights} />
    <ResultTags tags={result.tags} />
  </ResultContent>

  {/* Result Actions */}
  <ResultActions>
    <ViewButton onClick={() => navigate(result.url)} />
    <BookmarkButton onClick={() => bookmark(result)} />
  </ResultActions>
</SearchResultCard>
```

#### Result Types & Icons
- **Skills**: ⚔️ (sword icon)
- **Races**: 👤 (person icon)  
- **Traits**: 🎯 (target icon)
- **Religions**: ⛪ (church icon)
- **Birthsigns**: ⭐ (star icon)
- **Destiny**: 🌟 (destiny icon)

### 2.3 Search Filters & Facets

#### Filter Categories
```tsx
interface SearchFilters {
  // Content Type Filters
  types: ('skill' | 'race' | 'trait' | 'religion' | 'birthsign' | 'destiny')[]
  
  // Category Filters
  categories: string[]
  
  // Skill-specific Filters
  skillCategories?: ('combat' | 'magic' | 'stealth')[]
  skillScaling?: ('health' | 'magicka' | 'stamina')[]
  
  // Race-specific Filters
  raceTypes?: ('beast' | 'mer' | 'man')[]
  
  // Trait-specific Filters
  traitTypes?: ('positive' | 'negative' | 'neutral')[]
  
  // Religion-specific Filters
  religionTypes?: ('aedra' | 'daedra' | 'other')[]
}
```

#### Filter UI Components
```tsx
<FilterPanel>
  <FilterGroup title="Content Type">
    <FilterCheckbox label="Skills" value="skill" />
    <FilterCheckbox label="Races" value="race" />
    <FilterCheckbox label="Traits" value="trait" />
    {/* ... */}
  </FilterGroup>
  
  <FilterGroup title="Category">
    <FilterChip label="Combat" value="combat" />
    <FilterChip label="Magic" value="magic" />
    <FilterChip label="Stealth" value="stealth" />
    {/* ... */}
  </FilterGroup>
</FilterPanel>
```

## 3. Search Functionality & Data

### 3.1 Search Query Processing

#### Search Algorithm
```typescript
interface SearchQuery {
  query: string
  filters: SearchFilters
  sort: 'relevance' | 'name' | 'category' | 'type'
  page: number
  limit: number
}

interface SearchResult {
  id: string
  type: 'skill' | 'race' | 'trait' | 'religion' | 'birthsign' | 'destiny'
  name: string
  description?: string
  category?: string
  tags: string[]
  relevanceScore: number
  highlights: SearchHighlight[]
  url: string
}

interface SearchHighlight {
  field: 'name' | 'description' | 'category' | 'tags'
  snippet: string
  startIndex: number
  endIndex: number
}
```

#### Search Implementation
```typescript
// Enhanced search function with filters and sorting
function searchWithFilters(
  query: string,
  filters: SearchFilters,
  sort: string = 'relevance'
): SearchResult[] {
  const results = searchAll(query) // From DataProvider
  
  // Apply filters
  const filtered = results.filter(result => {
    if (filters.types.length > 0 && !filters.types.includes(result.type)) {
      return false
    }
    if (filters.categories.length > 0 && !filters.categories.includes(result.category)) {
      return false
    }
    // Apply type-specific filters
    return applyTypeSpecificFilters(result, filters)
  })
  
  // Sort results
  return sortResults(filtered, sort)
}
```

### 3.2 Search Data Sources

#### Indexed Fields
```typescript
interface SearchableData {
  // Primary fields (high weight)
  name: string
  description?: string
  
  // Secondary fields (medium weight)
  category?: string
  tags: string[]
  
  // Type-specific fields
  skillSpecific?: {
    edid: string
    keyAbilities: string[]
    scaling: string
  }
  raceSpecific?: {
    startingStats: RaceStartingStats
    racialAbilities: string[]
  }
  // ... other type-specific data
}
```

#### Search Weights
- **Name**: 10x weight
- **Description**: 5x weight  
- **Category**: 3x weight
- **Tags**: 2x weight
- **Type-specific fields**: 1x weight

### 3.3 Search Features

#### Advanced Search
- **Exact phrase**: `"sword and shield"`
- **Field-specific**: `name:sword category:combat`
- **Boolean operators**: `sword AND shield OR axe`
- **Wildcards**: `sword*` (prefix matching)

#### Search Suggestions
```typescript
interface SearchSuggestion {
  query: string
  type: 'popular' | 'recent' | 'related'
  count?: number
}

// Popular searches based on analytics
const popularSearches: SearchSuggestion[] = [
  { query: 'sword', type: 'popular', count: 1250 },
  { query: 'magic', type: 'popular', count: 890 },
  { query: 'stealth', type: 'popular', count: 567 },
  // ...
]
```

#### Recent Searches
- Store in localStorage
- Max 10 recent searches
- Clear individual or all

## 4. User Experience Flow

### 4.1 Search Journey

#### 1. Discovery
- User sees search bar in header
- Clicks or uses `Cmd+K` shortcut
- Search input expands/focuses

#### 2. Input
- User types query
- Real-time suggestions appear
- Recent/popular searches shown

#### 3. Results
- User presses Enter or clicks search
- Navigates to `/search?q=query`
- Results page loads with filters

#### 4. Refinement
- User applies filters
- Results update dynamically
- Sort options available

#### 5. Selection
- User clicks result
- Navigates to detail page
- Search state preserved

### 4.2 Mobile Experience

#### Mobile Search Flow
1. **Tap search icon** in mobile menu
2. **Full-screen search** opens
3. **Virtual keyboard** appears
4. **Results scroll** vertically
5. **Filters slide** from bottom

#### Mobile Optimizations
- Larger touch targets
- Swipe gestures for filters
- Voice search support
- Offline search capability

## 5. Implementation Roadmap

### Phase 1: Basic Search (Week 1-2)
- [ ] Create search results page (`/search`)
- [ ] Implement basic search functionality
- [ ] Add search bar to header
- [ ] Basic result cards

### Phase 2: Enhanced Search (Week 3-4)
- [ ] Add search filters
- [ ] Implement sorting
- [ ] Add search suggestions
- [ ] Recent searches

### Phase 3: Advanced Features (Week 5-6)
- [ ] Advanced search syntax
- [ ] Search analytics
- [ ] Mobile optimizations
- [ ] Performance improvements

### Phase 4: Polish & Testing (Week 7-8)
- [ ] UI/UX refinements
- [ ] Accessibility improvements
- [ ] Performance testing
- [ ] User testing

## 6. Technical Considerations

### 6.1 Performance
- **Debounced search**: 300ms delay
- **Result caching**: 5-minute cache
- **Pagination**: 20 results per page
- **Lazy loading**: Load more on scroll

### 6.2 Accessibility
- **Keyboard navigation**: Full keyboard support
- **Screen readers**: ARIA labels and roles
- **Focus management**: Proper focus handling
- **High contrast**: Accessible color schemes

### 6.3 Analytics
- **Search queries**: Track popular searches
- **Click-through rates**: Result selection metrics
- **Filter usage**: Most used filters
- **Search patterns**: User behavior analysis

## 7. Success Metrics

### 7.1 User Engagement
- **Search usage**: % of users who search
- **Search depth**: Average searches per session
- **Result clicks**: Click-through rate
- **Time to find**: Average time to find content

### 7.2 Technical Performance
- **Search speed**: < 200ms response time
- **Result accuracy**: Relevance score threshold
- **Uptime**: 99.9% availability
- **Error rate**: < 1% search errors

### 7.3 Business Impact
- **Content discovery**: Increased page views
- **User retention**: Return visitor rate
- **Feature adoption**: Search feature usage
- **User satisfaction**: Search experience ratings

## 8. Future Enhancements

### 8.1 Advanced Features
- **Voice search**: Speech-to-text input
- **Image search**: Visual content search
- **Semantic search**: AI-powered understanding
- **Personalization**: User-specific results

### 8.2 Integration Opportunities
- **Build planner**: Search within builds
- **Community**: User-generated content search
- **External APIs**: Wiki integration
- **Social features**: Share search results

---

This plan provides a comprehensive roadmap for implementing global search functionality while maintaining focus on the immediate goal of migrating existing pages to the new data system. 