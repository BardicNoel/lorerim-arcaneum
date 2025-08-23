# GigaPlanner Integration Plan

## 🎯 Goals

1. **Goal 1**: Read GigaPlanner build code into a valid build for our system
2. **Goal 2**: Export our build to GigaPlanner format

## 📋 Overview

Convert the existing JavaScript GigaPlanner converter to TypeScript and integrate it with our build system. The converter will provide bidirectional data exchange between GigaPlanner URLs and our internal `BuildState` format.

## 🏗️ Architecture

### Data Flow

```
GigaPlanner URL ↔ GigaPlannerConverter ↔ BuildState ↔ CharacterStore
```

### Key Components

1. **GigaPlannerConverter** - Core conversion logic
2. **Data Mappers** - Transform between formats
3. **Type Definitions** - TypeScript interfaces
4. **Integration Hooks** - React hooks for UI integration

## 📁 File Structure

```
src/features/gigaplanner/
├── types/
│   ├── index.ts                    # Main type definitions
│   ├── gigaplanner.ts             # GigaPlanner-specific types
│   └── mappings.ts                # Mapping interfaces
├── data/
│   ├── races.json                 # Converted from raceListData.js
│   ├── perks.json                 # Converted from perkListData.js
│   ├── standingStones.json        # Converted from standingStoneData.js
│   ├── blessings.json             # Converted from blessingsData.js
│   ├── gameMechanics.json         # Converted from gameMechanicsData.js
│   └── presets.json               # Converted from presetData.js
├── adapters/
│   ├── gigaplannerConverter.ts    # Main converter class
│   ├── dataLoader.ts              # JSON data loading
│   └── mappings.ts                # Name/ID mapping logic
├── hooks/
│   ├── useGigaPlannerImport.ts    # Import hook
│   ├── useGigaPlannerExport.ts    # Export hook
│   └── index.ts
├── components/
│   ├── GigaPlannerImportCard.tsx  # Import UI component
│   ├── GigaPlannerExportCard.tsx  # Export UI component
│   └── index.ts
├── utils/
│   ├── validation.ts              # Data validation
│   └── transformation.ts          # Data transformation helpers
└── index.ts
```

## 🔄 Data Mapping Strategy

### GigaPlanner → BuildState

| GigaPlanner Field | BuildState Field | Notes |
|------------------|------------------|-------|
| `race` | `race` | Map name to EDID |
| `standingStone` | `stone` | Map name to EDID |
| `blessing` | `favoriteBlessing` | Map name to EDID |
| `level` | `attributeAssignments.level` | Direct mapping |
| `hmsIncreases` | `attributeAssignments` | Transform to assignments |
| `skillLevels` | `skillLevels` | Map skill names to EDIDs |
| `perks` | `perks.selected` | Group by skill, map names to EDIDs |
| `oghmaChoice` | `attributeAssignments` | Add to level assignments |

### BuildState → GigaPlanner

| BuildState Field | GigaPlanner Field | Notes |
|------------------|------------------|-------|
| `race` | `race` | Map EDID to name |
| `stone` | `standingStone` | Map EDID to name |
| `favoriteBlessing` | `blessing` | Map EDID to name |
| `attributeAssignments.level` | `level` | Direct mapping |
| `attributeAssignments` | `hmsIncreases` | Calculate from assignments |
| `skillLevels` | `skillLevels` | Map EDIDs to names |
| `perks.selected` | `perks` | Flatten and map EDIDs to names |

## 📝 Implementation Tasks

### Phase 1: Data Conversion (Priority: High)

#### Task 1.1: Convert JavaScript Data to JSON
- [ ] Convert `raceListData.js` → `races.json`
- [ ] Convert `perkListData.js` → `perks.json`
- [ ] Convert `standingStoneData.js` → `standingStones.json`
- [ ] Convert `blessingsData.js` → `blessings.json`
- [ ] Convert `gameMechanicsData.js` → `gameMechanics.json`
- [ ] Convert `presetData.js` → `presets.json`

#### Task 1.2: Create TypeScript Types
- [ ] Define `GigaPlannerCharacter` interface
- [ ] Define `GigaPlannerData` interfaces for each data type
- [ ] Define mapping interfaces
- [ ] Define validation schemas

### Phase 2: Core Converter (Priority: High)

#### Task 2.1: Convert Main Converter
- [ ] Convert `gigaplanner-converter.js` → `gigaplannerConverter.ts`
- [ ] Implement TypeScript interfaces
- [ ] Add proper error handling
- [ ] Add data validation

#### Task 2.2: Data Loading System
- [ ] Create `dataLoader.ts` for JSON loading
- [ ] Implement caching mechanism
- [ ] Add error handling for missing data

### Phase 3: Mapping System (Priority: Medium)

#### Task 3.1: Name/ID Mappings
- [ ] Create `mappings.ts` for name ↔ EDID conversion
- [ ] Implement bidirectional mapping logic
- [ ] Add validation for missing mappings

#### Task 3.2: Data Transformation
- [ ] Create `transformation.ts` for format conversion
- [ ] Implement GigaPlanner → BuildState conversion
- [ ] Implement BuildState → GigaPlanner conversion

### Phase 4: Integration (Priority: Medium)

#### Task 4.1: React Hooks
- [ ] Create `useGigaPlannerImport` hook
- [ ] Create `useGigaPlannerExport` hook
- [ ] Add error handling and loading states

#### Task 4.2: UI Components
- [ ] Create `GigaPlannerImportCard` component
- [ ] Create `GigaPlannerExportCard` component
- [ ] Add to build page

### Phase 5: Testing & Validation (Priority: Low)

#### Task 5.1: Unit Tests
- [ ] Test converter functions
- [ ] Test mapping logic
- [ ] Test data validation

#### Task 5.2: Integration Tests
- [ ] Test full import/export cycle
- [ ] Test with real GigaPlanner URLs
- [ ] Test error scenarios

## 🔧 Technical Details

### Data Loading Strategy

```typescript
// Load data on demand
const loadGigaPlannerData = async () => {
  const [races, perks, stones, blessings, mechanics, presets] = await Promise.all([
    import('./data/races.json'),
    import('./data/perks.json'),
    import('./data/standingStones.json'),
    import('./data/blessings.json'),
    import('./data/gameMechanics.json'),
    import('./data/presets.json'),
  ]);
  
  return { races, perks, stones, blessings, mechanics, presets };
};
```

### Mapping Strategy

```typescript
// Create lookup maps for efficient conversion
const createLookupMaps = (data: GigaPlannerData) => {
  const nameToId = new Map<string, string>();
  const idToName = new Map<string, string>();
  
  data.forEach(item => {
    nameToId.set(item.name, item.id);
    idToName.set(item.id, item.name);
  });
  
  return { nameToId, idToName };
};
```

### Error Handling

```typescript
// Comprehensive error handling
interface ConversionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```

## 🚀 Usage Examples

### Import from GigaPlanner

```typescript
const { importFromGigaPlanner } = useGigaPlannerImport();

const handleImport = async (url: string) => {
  const result = await importFromGigaPlanner(url);
  
  if (result.success) {
    setBuild(result.data);
  } else {
    showError(result.error);
  }
};
```

### Export to GigaPlanner

```typescript
const { exportToGigaPlanner } = useGigaPlannerExport();

const handleExport = async () => {
  const result = await exportToGigaPlanner(build);
  
  if (result.success) {
    copyToClipboard(result.url);
  } else {
    showError(result.error);
  }
};
```

## ⚠️ Considerations

### Data Synchronization
- GigaPlanner data may be updated independently
- Need strategy for handling version mismatches
- Consider data validation for missing mappings

### Performance
- Large perk data (149KB) needs efficient loading
- Consider lazy loading for data files
- Implement caching for frequently used mappings

### Error Recovery
- Handle missing or invalid data gracefully
- Provide fallback values where possible
- Log conversion errors for debugging

### User Experience
- Show progress during import/export
- Provide clear error messages
- Allow partial imports when possible

## 📊 Success Metrics

- [ ] Successfully import GigaPlanner URLs
- [ ] Successfully export to GigaPlanner URLs
- [ ] Maintain data integrity during conversion
- [ ] Handle edge cases gracefully
- [ ] Provide good user experience

## 🔄 Future Enhancements

- Real-time sync with GigaPlanner
- Support for multiple GigaPlanner versions
- Advanced mapping customization
- Bulk import/export functionality

