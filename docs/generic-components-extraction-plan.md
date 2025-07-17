# Generic Components Extraction Plan

## 🎯 Overview

This document tracks the extraction of reusable generic components from the races feature and the migration plan to refactor races to use these generics. This will establish patterns for other features (religions, traits, destinies) to follow.

## 📋 Extraction Roadmap

### Phase 1: Core Generic Components (High Priority)

#### 1. GenericAccordionCard

**Status**: 🔴 Not Started  
**Priority**: Critical  
**Location**: `src/shared/components/generic/GenericAccordionCard.tsx`

**Purpose**: Reusable accordion card component that can be used across all entity types.

**Interface**:

```typescript
interface GenericAccordionCardProps<T> {
  item: T;
  isExpanded: boolean;
  onToggle: () => void;
  renderHeader: (item: T, isExpanded: boolean) => React.ReactNode;
  renderCollapsedContent: (item: T) => React.ReactNode;
  renderExpandedContent: (item: T) => React.ReactNode;
  className?: string;
}
```

**Migration Impact**:

- Replace `RaceAccordion` with `GenericAccordionCard`
- Extract race-specific rendering logic into render functions
- Maintain all existing functionality

**Tasks**:

- [ ] Create GenericAccordionCard component
- [ ] Extract race-specific header rendering
- [ ] Extract race-specific collapsed content rendering
- [ ] Extract race-specific expanded content rendering
- [ ] Update RaceAccordion to use GenericAccordionCard
- [ ] Test all functionality works as before

---

#### 2. EntityAvatar

**Status**: 🔴 Not Started  
**Priority**: High  
**Location**: `src/shared/components/generic/EntityAvatar.tsx`

**Purpose**: Centralized avatar management for all entity types.

**Interface**:

```typescript
interface EntityAvatarProps {
  entityName: string;
  entityType: "race" | "religion" | "trait" | "destiny";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}
```

**Migration Impact**:

- Replace `RaceAvatar` with `EntityAvatar`
- Centralize avatar file mapping logic
- Consistent fallback behavior across all entity types

**Tasks**:

- [ ] Create EntityAvatar component
- [ ] Extract avatar mapping logic from RaceAvatar
- [ ] Add support for other entity types (religion, trait, destiny)
- [ ] Update RaceAvatar to use EntityAvatar
- [ ] Test avatar display and fallback behavior

---

#### 3. CategoryBadge

**Status**: 🔴 Not Started  
**Priority**: Medium  
**Location**: `src/shared/components/generic/CategoryBadge.tsx`

**Purpose**: Consistent category styling across all features.

**Interface**:

```typescript
interface CategoryBadgeProps {
  category: string;
  categoryType: "race" | "religion" | "trait" | "destiny";
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Migration Impact**:

- Replace race-specific CategoryBadge with generic version
- Centralize category styling logic
- Support multiple entity types

**Tasks**:

- [ ] Create generic CategoryBadge component
- [ ] Extract category styling logic
- [ ] Add support for religion, trait, and destiny categories
- [ ] Update race CategoryBadge to use generic version
- [ ] Test category display across different entity types

---

### Phase 2: Utility Components (Medium Priority)

#### 4. EffectIconMapper

**Status**: 🔴 Not Started  
**Priority**: Medium  
**Location**: `src/shared/components/generic/EffectIconMapper.tsx`

**Purpose**: Centralized icon mapping for effects across all entity types.

**Interface**:

```typescript
interface EffectIconMapperProps {
  effectName: string;
  effectType: "ability" | "trait" | "skill" | "blessing" | "perk";
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Migration Impact**:

- Extract icon mapping logic from RaceAccordion
- Centralize icon definitions
- Support multiple effect types

**Tasks**:

- [ ] Create EffectIconMapper component
- [ ] Extract ability and skill icon mappings from RaceAccordion
- [ ] Add support for blessing and perk icons
- [ ] Update RaceAccordion to use EffectIconMapper
- [ ] Test icon display across different effect types

---

#### 5. FormattedDescription

**Status**: 🔴 Not Started  
**Priority**: Medium  
**Location**: `src/shared/components/generic/FormattedDescription.tsx`

**Purpose**: Consistent value highlighting across all features.

**Interface**:

```typescript
interface FormattedDescriptionProps {
  description: string;
  highlightPattern?: RegExp;
  highlightClassName?: string;
  className?: string;
}
```

**Migration Impact**:

- Extract FormattedDescription from RaceAccordion
- Make highlight pattern configurable
- Reusable across all entity types

**Tasks**:

- [ ] Create FormattedDescription component
- [ ] Extract highlighting logic from RaceAccordion
- [ ] Make highlight pattern configurable
- [ ] Update RaceAccordion to use FormattedDescription
- [ ] Test highlighting behavior

---

### Phase 3: Enhanced Components (Low Priority)

#### 6. StatBar (Already Extracted)

**Status**: ✅ Complete  
**Priority**: Low  
**Location**: `src/features/races/components/StatBar.tsx`

**Note**: This component is already well-designed and reusable. Consider moving to shared location.

**Tasks**:

- [ ] Move StatBar to `src/shared/components/generic/StatBar.tsx`
- [ ] Update imports across the codebase
- [ ] Test functionality after move

---

## 🔄 Migration Strategy

### Step 1: Create Generic Components

1. Create each generic component in `src/shared/components/generic/`
2. Implement with full TypeScript interfaces
3. Add comprehensive JSDoc documentation
4. Include example usage in comments

### Step 2: Update Races Feature

1. Update imports to use generic components
2. Extract race-specific logic into render functions
3. Maintain all existing functionality
4. Test thoroughly to ensure no regressions

### Step 3: Update Other Features

1. Apply same patterns to religions feature
2. Apply same patterns to traits feature
3. Apply same patterns to destinies feature
4. Ensure consistent behavior across all features

## 📁 File Structure

```
src/
├── shared/
│   └── components/
│       └── generic/
│           ├── GenericAccordionCard.tsx
│           ├── EntityAvatar.tsx
│           ├── CategoryBadge.tsx
│           ├── EffectIconMapper.tsx
│           ├── FormattedDescription.tsx
│           └── StatBar.tsx
└── features/
    └── races/
        └── components/
            ├── RaceAccordion.tsx (updated to use generics)
            ├── RaceAvatar.tsx (updated to use generics)
            └── CategoryBadge.tsx (updated to use generics)
```

## 🧪 Testing Strategy

### Unit Tests

- Test each generic component in isolation
- Test with different entity types
- Test edge cases and error states

### Integration Tests

- Test races feature with generic components
- Ensure all functionality works as before
- Test responsive behavior

### Visual Regression Tests

- Ensure UI appearance remains consistent
- Test across different screen sizes
- Verify accessibility features

## 📊 Progress Tracking

| Component            | Status         | Started    | Completed | Notes                             |
| -------------------- | -------------- | ---------- | --------- | --------------------------------- |
| GenericAccordionCard | 🟡 In Progress | 2024-01-XX | -         | Created and integrated with races |
| EntityAvatar         | 🟡 In Progress | 2024-01-XX | -         | Created and integrated with races |
| CategoryBadge        | 🟡 In Progress | 2024-01-XX | -         | Created and integrated with races |
| EffectIconMapper     | 🔴 Not Started | -          | -         | Medium priority                   |
| FormattedDescription | 🔴 Not Started | -          | -         | Medium priority                   |
| StatBar              | ✅ Complete    | -          | -         | Move to shared location           |

## 🎯 Success Criteria

### Phase 1 Complete When:

- [ ] GenericAccordionCard is created and tested
- [ ] EntityAvatar is created and tested
- [ ] CategoryBadge is created and tested
- [ ] Races feature uses all generic components
- [ ] All existing functionality is preserved

### Phase 2 Complete When:

- [ ] EffectIconMapper is created and tested
- [ ] FormattedDescription is created and tested
- [ ] StatBar is moved to shared location
- [ ] All races functionality uses generic components

### Phase 3 Complete When:

- [ ] Religions feature uses generic components
- [ ] Traits feature uses generic components
- [ ] Destinies feature uses generic components
- [ ] Consistent behavior across all features

## 🚨 Risk Mitigation

### High Risk Items:

1. **Breaking Changes**: Ensure all existing functionality is preserved
2. **Performance Impact**: Monitor for any performance degradation
3. **Type Safety**: Maintain strict TypeScript typing throughout

### Mitigation Strategies:

1. **Incremental Migration**: Update one component at a time
2. **Comprehensive Testing**: Test each change thoroughly
3. **Rollback Plan**: Keep original components until migration is complete
4. **Documentation**: Update all relevant documentation

## 📝 Notes

- This extraction will establish patterns for future features
- All generic components should follow the established design system
- Consider creating a storybook for generic components
- Update component documentation as components are extracted

---

_This document should be updated as progress is made on the extraction and migration._
