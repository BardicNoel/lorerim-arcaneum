# Skills Feature - MVA Architecture Implementation

This feature demonstrates the **Model-View-Adapter (MVA)** pattern implementation for the skills and perks system.

## 🏗 Architecture Overview

### Phase 1: Models ✅
- **Pure business logic** with no UI dependencies
- **Consolidated types** for skills and perks
- **State management** with validation and constraints
- **Data fetching** and transformation utilities

### Phase 2: Adapters ✅
- **Skill Adapter**: Transforms skill data for UI consumption
- **Perk Adapter**: Handles perk tree management and selection
- **Unified Adapter**: Coordinates between skill and perk adapters
- **UI-friendly interfaces** with computed properties

### Phase 3: Views ✅
- **React components** that consume adapters
- **Clean separation** from business logic
- **Reusable UI components** for skills and perks

## 🚀 How to See It in Action

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to the MVA Demo
- Open your browser to `http://localhost:5173`
- Click on the sidebar menu (hamburger icon)
- Navigate to **Character Build** → **Skills MVA Demo**
- Or go directly to: `http://localhost:5173/#/skills-mva`

### 3. Explore the Features

#### Skills Management
- **View all skills** with their categories and descriptions
- **Assign skills** as Major (limit: 3) or Minor (limit: 6)
- **Search skills** by name, category, or tags
- **See real-time validation** with user-friendly error messages

#### Perks Management
- **Select a skill** to view its perk tree
- **Select perks** with prerequisite validation
- **Increase perk ranks** with validation
- **See perk statistics** and relationships

#### Build Summary
- **Real-time counters** for major/minor skills
- **Total perks and ranks** across all skills
- **Visual feedback** for limits and assignments

## 🎯 Key Features Demonstrated

### ✅ MVA Pattern Benefits
1. **Separation of Concerns**: Models handle logic, Adapters handle transformation, Views handle presentation
2. **Testability**: Each layer can be tested independently
3. **Reusability**: Adapters can be used by different UI components
4. **Maintainability**: Changes to business logic don't affect UI

### ✅ Business Logic Validation
- **Skill limits**: 3 major, 6 minor skills maximum
- **Perk prerequisites**: Must meet requirements before selection
- **Rank validation**: Cannot exceed perk's maximum rank
- **Real-time feedback**: Immediate validation with error messages

### ✅ State Management
- **Coordinated state** between skills and perks
- **Persistence support** for save/load functionality
- **URL synchronization** for sharing builds
- **Optimistic updates** with rollback on validation failure

## 📁 File Structure

```
src/features/skills/
├── models/                    # Phase 1: Pure Business Logic
│   ├── types.ts              # Consolidated type definitions
│   ├── skillState.ts         # Skill state management
│   ├── perkState.ts          # Perk state management
│   ├── skillLogic.ts         # Business logic and validation
│   ├── skillData.ts          # Data fetching and transformation
│   └── utils/                # Layout and utility functions
├── adapters/                 # Phase 2: Data Transformation
│   ├── skillAdapter.ts       # Skill data transformation
│   ├── perkAdapter.ts        # Perk data transformation
│   ├── unifiedAdapter.ts     # Coordinated interface
│   └── index.ts              # Exports
├── views/                    # Phase 3: React Components
│   ├── SkillsPage.tsx        # Main page component
│   └── index.ts              # Exports
└── README.md                 # This file
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Test all skills feature components
npm test -- src/features/skills

# Test specific layers
npm test -- src/features/skills/models
npm test -- src/features/skills/adapters
```

**Test Coverage**: 87 tests covering all business logic and adapter functionality.

## 🔄 Migration from Old Architecture

This MVA implementation replaces the previous monolithic approach:

### Before (Monolithic)
- ❌ UI components mixed with business logic
- ❌ Hard to test individual pieces
- ❌ Difficult to reuse across different UIs
- ❌ Tight coupling between presentation and data

### After (MVA)
- ✅ Clean separation of concerns
- ✅ Comprehensive test coverage
- ✅ Reusable adapters for different UIs
- ✅ Maintainable and extensible architecture

## 🎨 UI Components Used

The demo uses the existing shadcn/ui component library:
- **Cards**: Display skill and perk information
- **Buttons**: Actions for assignment and selection
- **Badges**: Visual indicators for status and categories
- **Tabs**: Organize skills and perks views
- **Input**: Search functionality
- **Separators**: Visual organization

## 🚀 Next Steps

This MVA implementation provides a solid foundation for:
1. **Additional features**: More complex perk trees, skill synergies
2. **Performance optimization**: Caching, lazy loading
3. **Advanced UI**: Drag-and-drop, visual perk trees
4. **Integration**: Connect with other character build features

The architecture is designed to scale and evolve while maintaining clean separation of concerns. 