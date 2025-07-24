# Migrating to Model-View-Adapter (MVA) Architecture

## Overview

This guide outlines how to evolve our current prototype into a robust, maintainable Model-View-Adapter (MVA) architecture. The goal is to maximize reuse of our existing view logic, while enforcing clear separation of concerns and enabling scalable feature development.

---

## What is MVA?

**Model-View-Adapter (MVA)** is an architectural pattern that separates application logic into three distinct layers:

- **Model**: Pure data and business logic (state, transformations, domain rules)
- **View**: Stateless UI components responsible for rendering
- **Adapter**: The glue layer that connects models to views, handling data fetching, state, and event wiring

This separation:
- Improves testability and maintainability
- Enables view reuse across features
- Decouples UI from business logic and data sources

---

## Current State: Prototype

- UI logic, state, and data fetching are often mixed in single files ("fat components")
- Views are not always reusable or isolated
- No clear adapter layer; business logic leaks into UI

---

## Target State: MVA

- **Views**: Stateless, reusable, UI-only components in `src/shared/components/generic/` or feature-specific view folders
- **Adapters**: Feature-specific, stateful components/hooks in `src/features/<feature>/adapters/` (or `hooks/` if preferred)
- **Models**: Data types, transformation utilities, and business logic in `src/features/<feature>/types.ts` and `utils/`

---

## Migration Steps

### 1. Extract Pure Views
- Move all presentational logic (JSX, Tailwind, no state) into `View` components
- Place generic views in `src/shared/components/generic/`
- Place feature-specific views in `src/features/<feature>/components/view/`
- Example: `RaceCardView.tsx`, `PerkNodeView.tsx`

### 2. Establish Adapters
- Create adapter components or hooks in `src/features/<feature>/adapters/`
- Adapters:
  - Own state, data fetching, and event handlers
  - Compose and pass data/handlers to views
  - Never contain UI markup
- Example: `useRaceCardAdapter.ts`, `usePerkNodeAdapter.ts`

### 3. Define Models
- Centralize types in `types.ts`
- Move data transformation and business logic to `utils/`
- Ensure models are UI-agnostic

### 4. Refactor Feature Entry Points
- Feature pages import adapters, which in turn render views
- Views receive all data/handlers as props
- No business logic in views

### 5. Reuse and Compose Views
- Compose complex UIs by combining multiple view components
- Use slotted children APIs for extensibility

---

## Example: Race Card

**Before (Prototype):**
- `RaceCard.tsx` mixes state, data, and UI

**After (MVA):**
- `RaceCardView.tsx` (pure view, stateless)
- `useRaceCardAdapter.ts` (fetches data, manages state, passes props to view)
- `types.ts` (Race type)
- `utils/dataTransform.ts` (data logic)

---

## Directory Structure

```
src/features/races/
  components/
    view/
      RaceCardView.tsx
  adapters/
    useRaceCardAdapter.ts
  types.ts
  utils/
    dataTransform.ts
```

---

## Key Principles
- **Views**: No state, no data fetching, no business logic
- **Adapters**: No UI markup, only state/data/event logic
- **Models**: No UI, only types and pure functions

---

## Action Plan
1. Audit each feature for fat components
2. Extract view logic to pure view files
3. Move state/data logic to adapters
4. Centralize types and utilities
5. Update imports and feature entry points
6. Add tests for adapters and models

---

## References
- See `.temp/01-state-management-refactor.md` for state separation patterns
- See `.temp/03-configuration-externalization.md` for config best practices
- See `docs/generic-components-extraction-plan.md` for view extraction

---

## FAQ
- **Q: Can views import hooks?**
  - A: No. Views should only receive props. All hooks live in adapters.
- **Q: Where do shared generics go?**
  - A: `src/shared/components/generic/`
- **Q: How do we handle feature-specific logic?**
  - A: In adapters and utils, never in views.

---

## Next Steps
- Use this doc as a checklist for refactoring each feature to MVA
- Document new patterns in feature README files 