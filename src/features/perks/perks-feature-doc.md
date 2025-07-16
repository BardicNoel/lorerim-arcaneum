# Perks Feature Documentation

## Overview

The Perks feature implements a React Flow-based perk tree planner for character progression in Lorerim Arcaneum. It allows users to visualize and plan their character's perk progression across all skills.

## Architecture

### Components

- **UnifiedPerksPage**: Main page component that orchestrates the entire perk planner
- **SkillSelector**: Tab-based interface for selecting which skill tree to view
- **SummarySidebar**: Sidebar showing global overview of selected perks and requirements
- **PerkTreeCanvas**: React Flow canvas for visualizing perk trees
- **PerkNode**: Custom React Flow node component for individual perks

### Hooks

- **usePerks**: Manages loading and state of perk data from JSON
- **usePerkPlan**: Manages the global perk selection state and operations
- **useSkills**: Provides skill data and metadata

### Types

- **PerkNode**: Individual perk data structure
- **PerkEdge**: Edge data for prerequisite relationships
- **PerkPlan**: Global state for selected perks and requirements
- **Skill**: Skill metadata and selection state

## Data Flow

1. **Data Loading**: Perks are loaded from `/public/data/perks.json`
2. **Skill Selection**: User selects a skill via SkillSelector
3. **Tree Rendering**: PerkTreeCanvas renders the selected skill's perk tree
4. **Interaction**: Users can select/deselect perks and adjust ranks
5. **State Updates**: Changes are reflected in the global PerkPlan state
6. **Summary Updates**: SummarySidebar shows updated totals and requirements

## Features

### ✅ Implemented

- Skill selector with 18 Skyrim skills
- React Flow-based perk tree visualization
- Perk selection/deselection
- Multi-rank perk support
- Prerequisite relationship visualization
- Global summary sidebar
- Responsive design
- Hover cards with detailed perk information

### 🚧 Future Enhancements

- Perk tree layout algorithms
- Export/import perk plans
- Shareable URLs
- Mobile optimization
- Advanced filtering
- Perk recommendations

## Usage

Navigate to `/perks` to access the perk planner. The interface provides:

1. **Skill Tabs**: Click to switch between different skill trees
2. **Perk Nodes**: Click to select/deselect perks
3. **Rank Controls**: Use +/- buttons for multi-rank perks
4. **Summary Sidebar**: View totals and clear selections
5. **Canvas Controls**: Zoom, pan, and fit-to-view

## Technical Notes

- Uses React Flow for graph visualization
- Follows the established feature structure pattern
- Implements proper TypeScript types
- Uses ShadCN/UI components for consistency
- Follows Tailwind CSS styling guidelines
