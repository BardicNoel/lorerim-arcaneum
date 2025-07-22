# 📋 Unified Skills + Perk Tree Page Implementation Checklist

## 🎯 Overview
Implement a unified page that combines skills assignment (Major/Minor) with perk tree viewing, following the Model-View-Adapter pattern and Feature Structure Architecture.

**Entry Point:** `src/features/skills/pages/UnifiedSkillsPage.tsx` (replaces UnifiedPerksPage)
**Target Route:** `/build/perks` (combines skills + perks functionality)

---

## 📦 Phase 1: Data & State Management

### 1.1 Extend Build State (if needed)
- [x] **Decision:** Should perks be added to global build state or remain local?
- [x] **Current State:** Perks managed locally in `usePerkPlan` hook
- [x] **Current State:** Skills already in global build state via `useCharacterBuild`
- [x] **Action:** Determine if perks should be persisted globally or stay local

### 1.2 Create Unified Skills Hook
- [x] **File:** `src/features/skills/hooks/useUnifiedSkills.ts`
- [x] **Purpose:** Combine skills data loading with perk counting
- [x] **Features:**
  - [x] Load skills data from `data/skills.json`
  - [x] Calculate perks assigned per skill from perks system
  - [x] Return skills with perk counts
  - [x] Integrate with existing `useCharacterBuild` for skills management
- [x] **Export:** Add to `src/features/skills/hooks/index.ts`

### 1.3 Data Flow Planning
- [ ] **Skills Grid → Perk Tree:** User clicks skill card → set `selectedSkill` → scroll to Perk Tree View
- [ ] **Perk Tree → Skills Grid:** User clicks back button → clear `selectedSkill` → scroll to top
- [ ] **Perks Count Display:** Count perks where `perk.associatedSkill === skill.EDID`

---

## 🏗️ Phase 2: Component Architecture

### 2.1 Directory Structure
```
src/features/skills/
├── components/
│   ├── SkillsGrid.tsx          # Main grid container
│   ├── SkillCard.tsx           # Enhanced individual skill card
│   ├── PerkTreeView.tsx        # Perk tree section
│   └── index.ts               # Export all components
├── hooks/
│   ├── useUnifiedSkills.ts    # Combined skills + perks logic
│   └── index.ts
├── pages/
│   ├── UnifiedSkillsPage.tsx  # Main page (replaces SkillsPage.tsx)
│   └── index.ts
└── types.ts                   # Enhanced types
```

### 2.2 Component Dependencies
- [ ] **SkillsGrid** depends on: `useUnifiedSkills`, `useCharacterBuild`
- [ ] **SkillCard** depends on: Enhanced with badges and perks count
- [ ] **PerkTreeView** depends on: `PerkTreeCanvasII`, `usePerkPlan`
- [ ] **UnifiedSkillsPage** depends on: All above components

---

## 🧩 Phase 3: Component Implementation

### 3.1 SkillsGrid Component
- [x] **File:** `src/features/skills/components/SkillsGrid.tsx`
- [x] **Layout:** Grid (3 cols desktop, 1-2 mobile)
- [x] **Props:**
  - [x] `skills[]` - Array of skills with perk counts
  - [x] `onSkillSelect(EDID)` - When skill card clicked (not badges)
  - [x] `onAssignmentChange(EDID, type)` - When badge clicked
- [x] **Features:**
  - [x] Responsive grid layout
  - [x] Maps skills to UnifiedSkillCard components
  - [x] Handles skill selection for perk tree view

### 3.2 Enhanced SkillCard Component
- [x] **File:** Create new `src/features/skills/components/UnifiedSkillCard.tsx`
- [x] **New Features:**
  - [x] **Title:** Skill Name (bold, large font)
  - [x] **Description:** Short summary (muted text)
  - [x] **Perks Count:** `⭐ X Perks` (only if X > 0)
  - [x] **Action Badges:** `[Major] [Minor]` (mutually exclusive)
- [x] **Badge Behavior:**
  - [x] Click active badge → toggle off (None)
  - [x] Click inactive badge → activate it
  - [x] Major/Minor are mutually exclusive
- [x] **Click Behavior:**
  - [x] Click outside badges → select skill for perk tree
  - [x] Click badges → toggle assignment only

### 3.3 PerkTreeView Component
- [x] **File:** `src/features/skills/components/PerkTreeView.tsx`
- [x] **Layout:**
  - [x] **Header:** Skill Name + Perks Count + Back Button
  - [x] **Canvas:** PerkTreeCanvasII integration in shadcn Drawer
  - [x] **Footer:** Reset Perks Button + Help text
- [x] **Props:**
  - [x] `selectedSkill` (EDID)
  - [x] `onBack()` - Return to skills grid
  - [x] `onReset()` - Clear perks for current skill
  - [x] `open` - Drawer open state
  - [x] `onOpenChange` - Drawer state handler
- [x] **Features:**
  - [x] Integrate existing PerkTreeCanvasII in drawer
  - [x] Handle perk selection/deselection
  - [x] Reset button clears all perks for selected skill
  - [x] Drawer slides up from bottom with 85vh height
  - [x] Skill selector autocomplete for quick switching

### 3.4 Component Exports
- [x] **File:** `src/features/skills/components/index.ts`
- [x] **Export:** All new components
- [x] **File:** `src/features/skills/hooks/index.ts`
- [x] **Export:** `useUnifiedSkills`

---

## 🔗 Phase 4: Integration Points

### 4.1 Router Update
- [x] **File:** `src/app/router.tsx`
- [x] **Action:** Replace `/build/perks` route to use `UnifiedSkillsPage`
- [x] **Legacy:** Keep `/perks` route for backward compatibility
- [x] **Import:** Add `UnifiedSkillsPage` import

### 4.2 Build State Integration
- [ ] **Skills Management:** Use existing `useCharacterBuild` hook
- [ ] **Perks Integration:** Connect with existing perks system
- [ ] **State Persistence:** Ensure skills assignments persist
- [ ] **Perks Persistence:** Decide on global vs local perks state

### 4.3 UI/UX Flow
- [x] **Skills Grid → Perk Tree:**
  - [x] Click skill card → set `selectedSkill`
  - [x] Scroll page to Perk Tree View
  - [x] Update URL state (if needed)
- [x] **Perk Tree → Skills Grid:**
  - [x] Click back button → clear `selectedSkill`
  - [x] Scroll page back to top
  - [x] Update URL state (if needed)

---

## 🎨 Phase 5: Styling & UX

### 5.1 Responsive Design
- [ ] **Desktop:** 3-column grid for skills
- [ ] **Tablet:** 2-column grid for skills
- [ ] **Mobile:** 1-column grid for skills
- [ ] **Perk Tree:** Responsive canvas sizing

### 5.2 Visual Design
- [ ] **Skill Name:** Bold, large font
- [ ] **Description:** Muted text, smaller than title
- [ ] **Perks Count:** Small badge or muted line
- [ ] **Action Badges:** Distinct colors for active/inactive
- [ ] **Perk Tree Canvas:** SVG or Canvas for node/edge layout

### 5.3 Interaction States
- [ ] **Loading States:** For skills data, perks data
- [ ] **Error States:** Failed data loading
- [ ] **Empty States:** No skills, no perks selected
- [ ] **Hover States:** Cards, badges, perk nodes

---

## 🧪 Phase 6: Testing & Quality Assurance

### 6.1 Unit Tests
- [ ] **File:** `src/features/skills/hooks/__tests__/useUnifiedSkills.test.ts`
- [ ] **Test Cases:**
  - [ ] Skills data loading
  - [ ] Perk counting logic
  - [ ] Skill assignment logic
  - [ ] Component rendering

### 6.2 Integration Tests
- [ ] **File:** `src/features/skills/pages/__tests__/UnifiedSkillsPage.test.tsx`
- [ ] **Test Cases:**
  - [ ] Full page flow
  - [ ] Skill selection → perk tree navigation
  - [ ] Perk selection/deselection
  - [ ] Build state persistence

### 6.3 Component Tests
- [ ] **SkillsGrid:** Grid rendering, skill selection
- [ ] **SkillCard:** Badge interactions, click handling
- [ ] **PerkTreeView:** Canvas integration, reset functionality

---

## 📚 Phase 7: Documentation & Cleanup

### 7.1 Component Documentation
- [ ] **File:** `src/features/skills/README.md`
- [ ] **Content:**
  - [ ] Component usage examples
  - [ ] Props documentation
  - [ ] Integration patterns

### 7.2 Code Cleanup
- [ ] **Remove:** Old SkillsPage.tsx (after migration)
- [ ] **Update:** Any references to old skills page
- [ ] **Clean:** Unused imports and dependencies
- [ ] **Optimize:** Performance considerations

### 7.3 Migration Guide
- [ ] **File:** `docs/skills-page-migration.md`
- [ ] **Content:**
  - [ ] What changed
  - [ ] How to migrate existing builds
  - [ ] Breaking changes (if any)

---

## 🚀 Phase 8: Deployment & Validation

### 8.1 Pre-deployment Checks
- [ ] **Build:** Ensure no TypeScript errors
- [ ] **Lint:** Pass all ESLint rules
- [ ] **Test:** All tests passing
- [ ] **Performance:** No significant regressions

### 8.2 User Testing
- [ ] **Skills Assignment:** Major/Minor badge interactions
- [ ] **Perk Tree Navigation:** Skill selection → perk tree flow
- [ ] **Perk Selection:** Adding/removing perks
- [ ] **State Persistence:** Skills and perks persist correctly

### 8.3 Post-deployment
- [ ] **Monitor:** User feedback and issues
- [ ] **Metrics:** Usage patterns and performance
- [ ] **Iterate:** Address any discovered issues

---

## 📝 Notes

### Key Decisions Made
- [x] **Perks State:** ✅ Global persistence (added to build state)
- [x] **URL State:** ✅ Selected skill as separate URL parameter (not part of build)
- [x] **Legacy Support:** ✅ No legacy concerns (dev mode only)

### Dependencies
- [ ] **Existing:** `useCharacterBuild` for skills management
- [ ] **Existing:** `PerkTreeCanvasII` for perk tree display
- [ ] **Existing:** `usePerkPlan` for perk state management
- [ ] **New:** `useUnifiedSkills` for combined data

### Risk Mitigation
- [ ] **Backward Compatibility:** Keep legacy routes working
- [ ] **Data Migration:** Ensure existing builds continue to work
- [ ] **Performance:** Monitor for any performance impacts
- [ ] **User Experience:** Maintain familiar interaction patterns

---

**Status:** 🟡 Planning Complete - Ready for Implementation
**Next Step:** Begin Phase 1 - Data & State Management 