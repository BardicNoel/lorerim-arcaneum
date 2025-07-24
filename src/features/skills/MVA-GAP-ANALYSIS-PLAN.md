# Skills Feature MVA Migration: Phased Action Plan

## Phase 1: Atomic/Composition/View Separation
**Goal:** Ensure all components are in the correct MVA layer and are pure where appropriate.

### Checklist
- [ ] Audit all components in `components/atomic/` and ensure they are pure, stateless, and presentational only
- [ ] Move any logic/state from atomic to composition or adapters
- [ ] Audit all components in `components/composition/` and ensure they only compose atomics and adapters
- [ ] Move all high-level view components to `components/view/`
- [ ] Remove any legacy or duplicate components from `views/` and `pages/`

### Deliverables
- Pure atomic components
- Clean composition components
- All high-level views in `components/view/`
- No legacy/duplicate components

---

## Phase 2: Adapter Specialization & State Centralization
**Goal:** Ensure all data/state/logic is in adapters, not in views or composition components.

### Checklist
- [ ] Audit all adapters in `adapters/` and ensure each view type has a dedicated adapter (e.g., QuickSelector, Reference, Detail)
- [ ] Remove any remaining "unified" or catch-all adapters
- [ ] Move all state management (filters, selection, etc.) to adapters
- [ ] Ensure all views and composition components only consume adapters, not models or direct data

### Deliverables
- Specialized, hook-based adapters for each view
- All state management in adapters
- No direct data/model access in views or composition components

---

## Phase 3: Data Flow & Testing
**Goal:** Ensure clean, unidirectional data flow and robust test coverage.

### Checklist
- [ ] Audit for any direct data access in views or composition components
- [ ] Remove any duplicate or legacy state management
- [ ] Add/expand unit tests for new adapters and atomic components
- [ ] Add integration tests for view-adapter interactions
- [ ] Add E2E tests for user workflows (if not already present)

### Deliverables
- Clean Model → Adapter → View data flow
- All state in adapters
- Comprehensive unit, integration, and E2E tests

---

## Phase 4: Documentation & Diagrams
**Goal:** Ensure the new architecture is well-documented for maintainers and future contributors.

### Checklist
- [ ] Add/update diagrams showing data flow and component hierarchy
- [ ] Add mapping tables: current components → MVA roles
- [ ] Document any remaining migration steps and TODOs
- [ ] Update README and planning docs to reflect new structure

### Deliverables
- Up-to-date diagrams and mapping tables
- Clear documentation of architecture and migration steps

---

## Phase 5: Final Cleanup & Validation
**Goal:** Remove all legacy code, finalize migration, and validate architecture.

### Checklist
- [ ] Remove all deprecated, duplicate, or legacy files
- [ ] Update all index files and imports
- [ ] Run full test suite and fix any issues
- [ ] Validate that all features work as expected
- [ ] Review for performance and maintainability

### Deliverables
- Clean, maintainable, and performant MVA-compliant skills feature
- All tests passing
- No legacy code remaining

---

## 📅 Suggested Order of Work
1. **Phase 1:** Do a full audit and move/refactor components as needed
2. **Phase 2:** Specialize adapters and centralize all state
3. **Phase 3:** Clean up data flow and expand tests
4. **Phase 4:** Update documentation and diagrams
5. **Phase 5:** Final cleanup, validation, and sign-off

---

*Update this plan as you progress. Each phase should be considered "done" only when all checklist items are complete and deliverables are met.* 