# Destiny Feature Documentation

## Overview

The Destiny feature provides an interactive interface for exploring and planning character progression through a perk tree system. It implements three distinct views: a list view for browsing all available nodes, a tree view for visual planning using the `react-d3-tree` library with proper graph-based node linking, and a path builder for step-by-step progression planning.

## Features

### List View

- **Search and Filter**: Search across node names, descriptions, and prerequisites
- **Tag-based Filtering**: Filter by node tags (Magic, Defensive, Offensive, etc.)
- **Grid/List Layout**: Toggle between grid and list view modes
- **Detail Panel**: Right sidebar showing comprehensive node information
- **Prerequisites Display**: Each card shows required prerequisites with color-coded badges
- **Next Nodes Display**: Each card shows what nodes this leads to for progression planning

### Tree View

- **Interactive D3 Tree**: Professional tree visualization using react-d3-tree
- **Proper Node Linking**: Graph-based approach prevents duplicate nodes and handles shared prerequisites correctly
- **Node Planning**: Click nodes to add/remove them from your planned path
- **Visual Feedback**: Color-coded nodes (selected, planned, available)
- **Expand/Collapse**: Interactive node expansion and collapse
- **Custom Node Rendering**: Rich node display with planning controls

### Path Builder

- **Step-by-Step Progression**: Interactive path building with breadcrumb navigation
- **Radio Button Selection**: Choose from available next nodes with detailed information
- **Breadcrumb Navigation**: Click on any step in your path to backtrack
- **Current Position Details**: Comprehensive information about your current node
- **Planning Integration**: Add/remove nodes from your planned destiny
- **Path Completion**: Clear indication when you reach the end of a path

## Components

### DestinyCard

Displays individual destiny nodes in card format for the list view with prerequisite and progression information.

**Props:**

- `item: PlayerCreationItem` - The node data
- `isSelected: boolean` - Whether the node is currently selected
- `originalNode?: DestinyNode` - The original destiny node data for prerequisites/next nodes
- `allNodes?: DestinyNode[]` - All nodes for calculating next node relationships

**Features:**

- **Prerequisites Section**: Shows required nodes with orange badges
- **Next Nodes Section**: Shows progression options with blue badges
- **Tag Display**: Shows node categories and types
- **Effect Indicators**: Visual indicators for positive/negative effects

### DestinyDetailPanel

Shows detailed information about a selected node in the right sidebar.

**Props:**

- `item: PlayerCreationItem` - The node data
- `originalNode?: DestinyNode` - The original destiny node data
- `onPlanNode?: (nodeId: string) => void` - Callback for planning nodes
- `isPlanned?: boolean` - Whether the node is in the planned path
- `allNodes?: DestinyNode[]` - All nodes for calculating next node relationships

**Features:**

- **Comprehensive Information**: Full description, tags, effects, and relationships
- **Prerequisites Display**: Shows all required nodes with proper formatting
- **Next Branches**: Shows what nodes this leads to for progression planning
- **Planning Controls**: Add/remove from planned path
- **Lore Information**: Displays flavor text when available

### DestinyTreeView

Renders the interactive D3-based perk tree visualization with proper node linking.

**Props:**

- `nodes: DestinyNode[]` - All available nodes
- `plannedNodes: PlannedNode[]` - Currently planned nodes
- `selectedNode?: DestinyNode` - Currently selected node
- `onNodeClick: (node: DestinyNode) => void` - Node selection callback
- `onNodePlan: (nodeId: string) => void` - Node planning callback

**Features:**

- **Graph-Based Structure**: Builds a proper graph first, then converts to tree format
- **Shared Node Handling**: Nodes with multiple prerequisites are properly linked, not duplicated
- **Custom Node Rendering**: Each node displays as a circle with text and planning controls
- **Visual States**: Different colors for selected, planned, and available nodes
- **Planning Controls**: Small circular buttons for adding/removing nodes from plan
- **Expand/Collapse**: Buttons to expand or collapse nodes with children
- **Responsive Design**: Adapts to container size with proper scaling

### DestinyPathBuilder

Provides an interactive step-by-step path building experience with breadcrumb navigation.

**Props:**

- `nodes: DestinyNode[]` - All available nodes
- `plannedNodes: PlannedNode[]` - Currently planned nodes
- `onNodePlan: (nodeId: string) => void` - Callback for planning nodes
- `onNodeUnplan: (nodeId: string) => void` - Callback for unplanning nodes

**Features:**

- **Breadcrumb Navigation**: Visual path history with clickable backtracking
- **Current Position**: Detailed information about the current node
- **Next Options**: Interactive selection of available progression paths
- **Planning Integration**: Add/remove nodes from planned destiny
- **Path Completion**: Clear indication when reaching path endpoints
- **Planned Summary**: Overview of all planned nodes

## Data Structure

### DestinyNode

```typescript
interface DestinyNode {
  id: string;
  name: string;
  description: string;
  icon?: string;
  tags: string[];
  prerequisites: string[];
  nextBranches?: string[]; // Optional since we calculate this dynamically in the tree view
  levelRequirement?: number;
  lore?: string;
  globalFormId?: string;
}
```

### PlannedNode

```typescript
interface PlannedNode {
  id: string;
  name: string;
  levelRequirement?: number;
}
```

### GraphNode (Internal)

```typescript
interface GraphNode {
  node: DestinyNode;
  children: Set<string>; // Set of child node IDs
  parents: Set<string>; // Set of parent node IDs
}
```

### PathStep (Internal)

```typescript
interface PathStep {
  node: DestinyNode;
  availableOptions: DestinyNode[];
}
```

## Data Source

The feature loads data from `public/data/subclasses.json` and transforms it to match the DestinyNode interface. The transformation includes:

1. **ID Generation**: Uses `globalFormId` or generates fallback IDs
2. **Tag Assignment**: Automatically assigns tags based on content analysis
3. **Graph Building**: Creates a proper graph structure with parent-child relationships

## List View Enhancements

### Prerequisites Display

Each card in the list view shows:

- **Prerequisites Section**: Required nodes displayed with orange badges
- **Visual Distinction**: Color-coded badges make requirements easy to identify
- **Multiple Requirements**: Properly handles nodes requiring multiple prerequisites

### Next Nodes Display

Each card shows progression options:

- **Next Nodes Section**: Shows what nodes this leads to with blue badges
- **Progression Planning**: Helps users understand their options
- **End Nodes**: Shows "No further progression" for terminal nodes

### Visual Design

- **Color Coding**: Orange for prerequisites, blue for next nodes, gray for tags
- **Compact Layout**: Information is organized efficiently within card space
- **Consistent Styling**: Matches the overall design system

## Path Builder Experience

### Interactive Path Building

The Path Builder provides a unique step-by-step experience:

1. **Path Initialization**: Start with root nodes (nodes with no prerequisites)
2. **Step-by-Step Progression**: Choose from available next nodes at each step
3. **Breadcrumb Navigation**: Visual representation of your current path
4. **Backtracking**: Click any breadcrumb to return to that point in your path

### Current Position Details

- **Node Information**: Full description, tags, and effects
- **Planning Controls**: Add/remove current node from planned destiny
- **Visual Feedback**: Clear indication of planning status

### Next Options Selection

- **Available Paths**: All nodes that can be reached from current position
- **Detailed Information**: Each option shows description, prerequisites, and tags
- **Planning Integration**: Add/remove any option from planned destiny
- **One-Click Progression**: Click any option to continue down that path

### Path Completion

- **End Detection**: Automatically detects when reaching terminal nodes
- **Restart Options**: Easy way to start a new path
- **Path Summary**: Overview of completed path

## Tree Visualization

### Graph-Based Tree Building

The tree view uses a sophisticated approach to handle complex prerequisite relationships:

1. **Graph Construction**: First builds a complete graph with all nodes and their relationships
2. **Parent-Child Mapping**: Maps prerequisites to proper parent-child relationships
3. **Tree Conversion**: Converts the graph to a tree format while preserving shared nodes
4. **Cycle Prevention**: Uses visited sets to prevent infinite loops in complex relationships

### D3 Tree Implementation

The tree view uses `react-d3-tree` for professional visualization:

- **Orientation**: Vertical layout with step-based path connections
- **Node Spacing**: Configurable separation between siblings and non-siblings
- **Custom Rendering**: Each node is rendered as a custom SVG element
- **Interactive Features**: Click to select, plan, expand/collapse

### Node States

- **Available**: Default gray background with border
- **Selected**: Primary color background with border
- **Planned**: Green background with border
- **Hover**: Muted background for interactive feedback

### Tree Controls

- **Planning Button**: Small circular button in top-right of each node
- **Expand/Collapse**: Small circular button in top-left for nodes with children
- **Node Selection**: Click the main node circle to select

### Complex Relationship Handling

The system properly handles complex scenarios like:

- **Multiple Prerequisites**: Nodes requiring multiple prerequisites (e.g., "Magic Shell" requires both "Mage" and "Warrior")
- **Shared Branches**: Multiple paths converging on the same node
- **Cross-Branch Dependencies**: Nodes that depend on nodes from different branches

## Usage

### Navigation

Access the Destiny page via the sidebar navigation under "Progression" → "Destiny"

### URL

`/destiny`

### View Selection

- **List View**: Browse all nodes with search and filtering
- **Tree View**: Visual tree exploration with D3 visualization
- **Path Builder**: Step-by-step path planning with breadcrumbs

### State Management

- **Planned Nodes**: Stored in component state (not persisted)
- **Selected Node**: Tracks currently selected node for detail display
- **View Mode**: Manages list vs tree vs path builder state
- **Path State**: Tracks current path in Path Builder

## Dependencies

- **react-d3-tree**: Professional tree visualization library
- **@types/d3**: TypeScript definitions for D3

## Future Enhancements

1. **Persistent Planning**: Save planned paths to localStorage or backend
2. **Advanced Tree Layout**: Improved tree visualization with better spacing
3. **Path Validation**: Ensure planned paths are valid (prerequisites met)
4. **Export/Import**: Share planned builds with other users
5. **Level Requirements**: Add level requirement validation
6. **Visual Icons**: Add custom icons for different node types
7. **Zoom and Pan**: Add zoom and pan controls for large trees
8. **Mini-map**: Add overview map for navigation in large trees
9. **Path Highlighting**: Highlight valid paths from root to selected node
10. **Prerequisite Validation**: Visual indicators for unmet prerequisites
11. **Interactive Prerequisites**: Click prerequisite badges to navigate to those nodes
12. **Progression Paths**: Show multiple possible paths to reach a target node
13. **Path Comparison**: Compare different progression paths side by side
14. **Path Recommendations**: Suggest optimal paths based on character goals
15. **Path Export**: Export planned paths as images or shareable links
