# Destiny Feature Documentation

## 🎯 Feature Overview

### Purpose
The Destiny feature provides an interactive interface for exploring and planning character progression through a sophisticated perk tree system. It enables users to browse, search, visualize, and plan character development paths with three distinct views: list browsing, tree visualization, and step-by-step path building.

### Core Functionality
- **Destiny Browsing**: Display all available destiny nodes in grid/list view modes with prerequisite and progression information
- **Advanced Search**: Multi-category autocomplete search by tags, prerequisites, and node types
- **Tree Visualization**: Interactive D3-based tree view with proper graph-based node linking and planning controls
- **Path Building**: Step-by-step progression planning with breadcrumb navigation and backtracking
- **Node Planning**: Add/remove nodes from planned destiny with visual feedback
- **Responsive Design**: Mobile-friendly interface with adaptive layouts across all view modes

### Data Structure
Destiny nodes are defined with the following structure:

```typescript
interface DestinyNode {
  id: string;
  name: string;
  description: string;
  icon?: string;
  tags: string[];
  prerequisites: string[];
  nextBranches?: string[]; // Calculated dynamically in tree view
  levelRequirement?: number;
  lore?: string;
  globalFormId?: string;
}

interface PlannedNode {
  id: string;
  name: string;
  description: string;
  levelRequirement?: number;
}
```

---

## 🏗️ Component Architecture

### Component Tree
```
UnifiedDestinyPage
├── Tabs (List/Tree/Path Builder)
├── List View
│   ├── PlayerCreationPage (shared)
│   │   ├── Header (title + description)
│   │   ├── Search & Filters
│   │   │   ├── MultiAutocompleteSearch
│   │   │   ├── SelectedTags
│   │   │   └── ViewModeToggle (grid/list)
│   │   ├── ItemGrid
│   │   │   └── DestinyCard (custom render)
│   │   └── DetailPanel
│   │       └── DestinyDetailPanel (custom render)
│   └── Loading/Error States
├── Tree View
│   └── DestinyTreeView (D3 visualization)
└── Path Builder
    └── DestinyPathBuilder (step-by-step)
```

### Component Responsibilities

#### **UnifiedDestinyPage** (`pages/UnifiedDestinyPage.tsx`)
- **Purpose**: Main orchestrator managing data fetching, state coordination, and view switching
- **Key Functions**:
  - Data fetching from `public/data/subclasses.json`
  - Data transformation from raw JSON to `DestinyNode` format
  - Search category generation (Tags, Prerequisites)
  - Custom render functions for destiny-specific components
  - Planned nodes state management
  - View mode coordination (List/Tree/Path Builder)
  - Error handling and loading states

#### **DestinyCard** (`components/DestinyCard.tsx`)
- **Purpose**: Compact destiny node representation in grid/list views
- **Features**:
  - Prerequisites display with orange badges
  - Next nodes display with blue badges
  - Tag categorization and visual indicators
  - Selection state management
  - Responsive design with hover effects
  - Effect indicators for positive/negative impacts

#### **DestinyDetailPanel** (`components/DestinyDetailPanel.tsx`)
- **Purpose**: Comprehensive destiny node information display
- **Features**:
  - Full node description and lore information
  - Prerequisites and next branches display
  - Planning controls (add/remove from planned destiny)
  - Tag categorization and effect details
  - Visual feedback for planning status
  - Relationship mapping with other nodes

#### **DestinyTreeView** (`components/DestinyTreeView.tsx`)
- **Purpose**: Interactive D3-based tree visualization with planning capabilities
- **Features**:
  - Graph-based tree building with proper node linking
  - Custom node rendering with planning controls
  - Visual states (available, selected, planned)
  - Expand/collapse functionality
  - Interactive node selection and planning
  - Responsive design with proper scaling

#### **DestinyPathBuilder** (`components/DestinyPathBuilder.tsx`)
- **Purpose**: Step-by-step path building with breadcrumb navigation
- **Features**:
  - Breadcrumb navigation with backtracking
  - Current position details and planning controls
  - Next options selection with detailed information
  - Path completion detection and restart options
  - Planned nodes summary and management

---

## 🔧 Technical Design

### Data Flow Architecture

```mermaid
graph TD
    A[subclasses.json] --> B[UnifiedDestinyPage]
    B --> C[Data Transformation]
    C --> D[DestinyNode[]]
    D --> E[PlayerCreationItem[]]
    E --> F[PlayerCreationPage]
    F --> G[DestinyCard/DetailPanel]
    
    D --> H[DestinyTreeView]
    H --> I[D3 Tree Visualization]
    
    D --> J[DestinyPathBuilder]
    J --> K[Step-by-Step Planning]
    
    L[User Planning] --> M[PlannedNode[]]
    M --> N[Visual Feedback]
    N --> G
    N --> I
    N --> K
```

### State Management

The feature uses a combination of local state and shared hooks:

1. **Local State** (`UnifiedDestinyPage`):
   - `destinyNodes`: Raw destiny data from JSON
   - `loading`: Data fetching state
   - `error`: Error handling state
   - `plannedNodes`: Currently planned destiny nodes
   - `selectedNode`: Currently selected node for tree view

2. **Shared State** (`usePlayerCreation`):
   - `selectedItem`: Currently selected node for detail panel
   - `viewMode`: Grid or list view preference
   - `currentFilters`: Active search and filter state
   - `filteredItems`: Computed filtered results

### Data Transformation

The feature transforms destiny data between multiple formats:

**Source Format** (from `subclasses.json`):
```typescript
{
  globalFormId: string;
  name: string;
  description: string;
  prerequisites: string[];
}
```

**Target Format** (`DestinyNode`):
```typescript
{
  id: string; // Uses globalFormId or generated fallback
  name: string;
  description: string;
  tags: string[]; // Auto-generated based on content analysis
  prerequisites: string[];
  nextBranches: string[]; // Calculated dynamically
  levelRequirement?: number;
  lore?: string;
  globalFormId?: string;
}
```

**PlayerCreationItem Format**:
```typescript
{
  id: string;
  name: string;
  description: string;
  tags: string[];
  summary: string;
  effects: [];
  associatedItems: [];
  imageUrl: undefined;
  category: undefined;
}
```

### Search & Filtering System

#### Search Categories
- **Tags**: Filter by node categories (Magic, Defensive, Offensive, Utility, Combat)
- **Prerequisites**: Search by required nodes and dependencies
- **Node Types**: Filter by different destiny node classifications

#### Filter Logic
```typescript
// Multi-layered filtering approach
1. Text Search: name, description, tag content
2. Tag Filter: Category-based filtering (Magic, Defensive, etc.)
3. Prerequisite Filter: Dependency-based filtering
4. Content Analysis: Automatic tag assignment based on description keywords
```

### Graph-Based Tree Building

The tree visualization uses a sophisticated graph-based approach:

```typescript
// Internal graph structure
interface GraphNode {
  node: DestinyNode;
  children: Set<string>; // Child node IDs
  parents: Set<string>;  // Parent node IDs
}

// Tree building process
1. Graph Construction: Build complete relationship graph
2. Parent-Child Mapping: Map prerequisites to proper relationships
3. Tree Conversion: Convert graph to tree format
4. Cycle Prevention: Use visited sets to prevent infinite loops
```

---

## 🎨 UI/UX Design Patterns

### Visual Hierarchy
1. **Primary**: Destiny node name and core information
2. **Secondary**: Prerequisites and next nodes relationships
3. **Tertiary**: Detailed descriptions and planning controls

### Icon System
- **Node Type Icons**: Color-coded by node category
  - 🎯 Magic nodes (blue)
  - 🛡️ Defensive nodes (green)
  - ⚔️ Offensive nodes (red)
  - ⚡ Utility nodes (yellow)
  - 🗡️ Combat nodes (orange)

- **Relationship Icons**: Visual indicators for node connections
  - 🔗 Prerequisites (orange badges)
  - ➡️ Next nodes (blue badges)
  - ✅ Planned nodes (green background)
  - 🔄 Available nodes (gray background)

- **Action Icons**: Interactive controls
  - ➕ Add to plan (green circle)
  - ➖ Remove from plan (red circle)
  - 🔽 Expand node (down arrow)
  - 🔼 Collapse node (up arrow)

### Responsive Design
- **Desktop**: 3-column layout with sidebar detail panel
- **Tablet**: 2-column grid with bottom detail panel
- **Mobile**: Single column with modal detail panel
- **Tree View**: Adaptive scaling with zoom controls
- **Path Builder**: Full-width layout with collapsible sections

### Interaction Patterns
- **Hover Effects**: Subtle scaling and shadow changes on cards
- **Selection States**: Ring borders and color-coded backgrounds
- **Planning States**: Visual feedback for planned vs unplanned nodes
- **Loading States**: Skeleton screens and spinners
- **Error States**: Clear messaging with retry options
- **Breadcrumb Navigation**: Clickable path history with backtracking

---

## 🔄 Reusable Components

### Shared Player Creation Framework

The destiny feature leverages the same comprehensive shared framework as other features:

#### **PlayerCreationPage**
- Generic layout for categorized item selection
- Built-in search, filtering, and view mode management
- Customizable render functions for item cards and detail panels

#### **MultiAutocompleteSearch**
- Multi-category search interface
- Tag-based filtering system
- Keyboard navigation support

#### **ItemGrid**
- Responsive grid/list view switching
- Selection state management
- Empty state handling

### Destiny-Specific Components

#### **DestinyCard**
- **Reusability**: Can be adapted for other tree-based entity types
- **Customization**: Icon mapping and color schemes for different node types
- **Accessibility**: ARIA labels and keyboard navigation
- **Relationship Display**: Prerequisites and next nodes visualization

#### **DestinyDetailPanel**
- **Extensibility**: Modular sections for different node information types
- **Data Visualization**: Effect icons and relationship mapping
- **Information Architecture**: Hierarchical content organization
- **Planning Integration**: Seamless planning controls

#### **DestinyTreeView**
- **Graph Visualization**: Professional D3-based tree rendering
- **Complex Relationships**: Proper handling of shared prerequisites
- **Interactive Planning**: Visual planning with immediate feedback
- **Responsive Scaling**: Adaptive to container size

#### **DestinyPathBuilder**
- **Step-by-Step Experience**: Guided progression planning
- **Breadcrumb Navigation**: Visual path history with backtracking
- **Progressive Disclosure**: Information revealed as needed
- **Path Validation**: Ensures valid progression sequences

---

## 📊 Performance Considerations

### Data Loading
- **Runtime Fetching**: Destiny nodes loaded from JSON at component mount
- **Error Boundaries**: Graceful fallbacks for network issues
- **Loading States**: User feedback during data fetching
- **Data Transformation**: Efficient conversion from JSON to typed interfaces

### Rendering Optimization
- **Memoization**: Filtered results cached with `useMemo`
- **Virtual Scrolling**: Large node lists handled efficiently
- **Lazy Loading**: Tree nodes expanded on demand
- **Graph Caching**: Pre-computed graph structure for tree visualization

### Search Performance
- **Debounced Input**: Search queries optimized for performance
- **Indexed Filtering**: Pre-computed search indices for tags and prerequisites
- **Cached Results**: Filtered results memoized to prevent recalculation
- **Content Analysis**: Efficient tag assignment based on keyword matching

### Tree Visualization Performance
- **Graph Pre-computation**: Graph structure built once and cached
- **Selective Rendering**: Only visible tree nodes rendered
- **Efficient Updates**: Minimal re-renders for planning state changes
- **Memory Management**: Proper cleanup of D3 tree instances

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering and props validation
- Data transformation logic from JSON to DestinyNode
- Filter and search functionality
- Graph building and tree conversion algorithms
- Planning state management

### Integration Tests
- End-to-end destiny selection and planning flow
- Search and filter interactions across all view modes
- Tree visualization interactions and planning
- Path builder navigation and backtracking
- Responsive design breakpoints

### Accessibility Tests
- Screen reader compatibility for all view modes
- Keyboard navigation through tree and path builder
- Color contrast compliance for all node states
- ARIA labels and semantic HTML structure
- Focus management in complex interactions

### Performance Tests
- Large dataset handling (1000+ nodes)
- Tree visualization rendering performance
- Search and filter response times
- Memory usage during extended sessions
- Mobile device performance validation

---

## 🔮 Future Enhancements

### Planned Features
1. **Persistent Planning**: Save planned paths to localStorage or backend with export/import capabilities
2. **Advanced Tree Layout**: Improved tree visualization with better spacing and automatic layout optimization
3. **Path Validation**: Ensure planned paths are valid with prerequisite checking and visual indicators
4. **Visual Icons**: Add custom icons for different node types and categories
5. **Zoom and Pan**: Add zoom and pan controls for large trees with mini-map navigation
6. **Path Highlighting**: Highlight valid paths from root to selected node with multiple path options
7. **Interactive Prerequisites**: Click prerequisite badges to navigate to those nodes with context preservation
8. **Progression Paths**: Show multiple possible paths to reach a target node with difficulty indicators
9. **Path Comparison**: Compare different progression paths side by side with statistical analysis
10. **Path Recommendations**: AI-powered path suggestions based on character goals and playstyle preferences

### Technical Improvements
1. **Data Caching**: Implement service worker for offline access to destiny data
2. **Real-time Updates**: WebSocket integration for live data updates and collaborative planning
3. **Analytics**: User behavior tracking for optimization of tree layouts and path recommendations
4. **Internationalization**: Multi-language support for destiny node descriptions and UI elements
5. **Advanced Graph Algorithms**: Implement more sophisticated graph traversal and pathfinding algorithms
6. **Performance Optimization**: Virtual scrolling for large trees and lazy loading for deep node hierarchies
7. **Mobile Optimization**: Touch-friendly interactions and gesture support for tree navigation
8. **Accessibility Enhancements**: Advanced screen reader support and voice navigation capabilities

---

## 📚 Related Documentation

- [Player Creation Framework](../shared/components/playerCreation/README.md)
- [UI Component Library](../shared/ui/README.md)
- [Data Schema Documentation](../../../docs/technical-spec.md)
- [Z-Index System](../../../docs/z-index-system.md)
- [Tree Visualization Best Practices](../../../docs/tree-visualization.md)

---

*This documentation is maintained as part of the Lorerim Arcaneum project. For questions or contributions, please refer to the project's contribution guidelines.*
