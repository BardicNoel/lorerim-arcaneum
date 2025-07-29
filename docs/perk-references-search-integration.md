# Perk References Search Integration

This document describes the integration of perk references into the global search feature.

## Overview

Perk references are now searchable items in the global search system, allowing users to find specific perks across all skill trees and add them to their character builds.

## Implementation Details

### 1. Search Model Updates

- **SearchableItem Type**: Added `'perk-reference'` to the type union in `SearchModel.ts`
- **Transformation Function**: Created `transformPerkReferencesToSearchable()` in `SearchUtilities.ts`

### 2. Search Data Provider

- **New Method**: Added `addPerkReferencesToIndex()` to `SearchDataProvider.ts`
- **Integration**: Updated `useSearchData.ts` to include perk references in the main indexing process

### 3. Component Integration

- **Component Reuse**: Reusing existing `PerkReferenceCard` component from the perk references feature
- **Wrapper Component**: Created `PerkReferenceSearchWrapper` to convert `SearchResult` to `PerkReferenceItem` format
- **Component Mapping**: Updated `componentMapping.tsx` to include perk-reference type
- **View Modes**: Added perk-reference support to `TypeSpecificComponents.ts`

### 4. Type System Updates

- **AddToBuildButton**: Extended to support 'perk' item type
- **PerkReferenceBadge**: Added 'root' badge type for root perks

### 5. Search Integration

- **Direct Integration**: Perk references are now indexed directly in the main `useSearchData` hook
- **Synchronized Loading**: Perk references are loaded and indexed at the same time as other data types

## Features

### Searchable Content
- Perk names and descriptions
- Skill tree names
- Perk categories (Combat, Magic, Stealth, etc.)
- Tags (root, multi-rank, single-rank, etc.)
- Prerequisites
- Level requirements

### Display Features
- Compact and full card views (reusing existing PerkReferenceCard)
- Skill tree badges
- Rank indicators
- Root perk indicators
- Level requirement badges
- Add to build functionality
- Search result highlighting

### Filtering
- By skill tree
- By category
- By tags
- By type (perk-reference)

## Usage

1. Navigate to the global search page
2. Search for perk names, descriptions, or related terms
3. Filter results by type to show only perk references
4. Click on perk cards to view details
5. Use "Add to Build" button to add perks to character build

## Technical Notes

- Perk references are indexed as part of the main search indexing process
- Search results include both individual perks and perk trees
- Integration uses the existing search infrastructure
- Components follow the established design patterns by reusing existing components
- Type safety is maintained throughout the integration

## Files Modified

### Core Search Files
- `src/features/search/model/SearchModel.ts`
- `src/features/search/model/SearchUtilities.ts`
- `src/features/search/model/SearchDataProvider.ts`
- `src/features/search/model/TypeSpecificComponents.ts`

### Component Files
- `src/features/search/adapters/componentMapping.tsx` (added wrapper component)
- `src/features/search/adapters/useSearchData.ts`

### Shared Components
- `src/shared/components/playerCreation/AddToBuildButton.tsx`
- `src/features/perk-references/components/atomic/PerkReferenceBadge.tsx`

## Issue Resolution

The initial implementation had a timing issue where perk references were being added to a separate search index instance. This was resolved by:

1. **Direct Integration**: Moving perk reference indexing into the main `useSearchData` hook
2. **Synchronized Loading**: Ensuring perk references are loaded and indexed at the same time as other data types
3. **Shared Provider**: Using the same `SearchDataProvider` instance for all data types
4. **Component Reuse**: Reusing existing `PerkReferenceCard` component instead of creating duplicate components

## Testing

To test the integration:

1. Start the development server: `npm run dev`
2. Navigate to the search page
3. Search for perk-related terms (e.g., "fire", "magic", "combat")
4. Filter by "perk-reference" type
5. Verify that perk cards display correctly (using the same design as the perk references page)
6. Test the "Add to Build" functionality

## Future Enhancements

- Add perk tree visualization in search results
- Implement perk prerequisite chains in search
- Add skill level requirements to search filters
- Create perk comparison features in search results 