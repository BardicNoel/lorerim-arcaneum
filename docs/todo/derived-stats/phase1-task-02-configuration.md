# Phase 1 Task 02: Derived Stats Configuration

## 📋 Task Overview

Create the configuration file that defines all 11 derived stats with their formulas, weights, and thresholds. This configuration will drive the calculation engine and provide metadata for the UI.

## 🎯 Objectives

- [ ] Define all 11 derived stats configurations
- [ ] Set appropriate weights for each stat
- [ ] Configure thresholds and prefactors
- [ ] Add descriptions and categories
- [ ] Export configuration for use in calculations

## 📁 Files to Create

### 1. Configuration File

**Path:** `src/features/derived-stats/config/derivedStatsConfig.ts`

**Content:**

```typescript
import { DerivedStatConfig } from '../types'

export const DERIVED_STATS_CONFIG: Record<string, DerivedStatConfig> = {
  magicResist: {
    name: 'Magic Resist',
    isPercentage: true,
    prefactor: 1.0,
    threshold: 150,
    weights: { health: 0, magicka: 1, stamina: 0 },
    description: 'Reduces incoming magical damage',
    category: 'survival',
  },
  magickaRegen: {
    name: 'Magicka Regen',
    isPercentage: true,
    prefactor: 8.0,
    threshold: 100,
    weights: { health: 0, magicka: 1, stamina: 0 },
    description: 'Increases magicka regeneration rate',
    category: 'magic',
  },
  diseaseResist: {
    name: 'Disease Resist',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 100,
    weights: { health: 0.4, magicka: 0, stamina: 0.6 },
    description: 'Reduces chance of contracting diseases',
    category: 'survival',
  },
  poisonResist: {
    name: 'Poison Resist',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 140,
    weights: { health: 0.6, magicka: 0, stamina: 0.4 },
    description: 'Reduces poison damage and effects',
    category: 'survival',
  },
  staminaRegen: {
    name: 'Stamina Regen',
    isPercentage: true,
    prefactor: 8.0,
    threshold: 100,
    weights: { health: 0, magicka: 0, stamina: 1 },
    description: 'Increases stamina regeneration rate',
    category: 'movement',
  },
  moveSpeed: {
    name: 'Move Speed',
    isPercentage: true,
    prefactor: 0.75,
    threshold: 125,
    weights: { health: 0.2, magicka: 0, stamina: 0.8 },
    description: 'Increases movement speed',
    category: 'movement',
  },
  carryWeight: {
    name: 'Carry Weight',
    isPercentage: false,
    prefactor: 4.0,
    threshold: 110,
    weights: { health: 0.8, magicka: 0, stamina: 0.2 },
    description: 'Increases maximum carry capacity',
    category: 'survival',
  },
  rangedDamage: {
    name: 'Ranged Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.2, magicka: 0, stamina: 0.8 },
    description: 'Increases ranged weapon damage',
    category: 'combat',
  },
  oneHandDamage: {
    name: 'One-Hand Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.5, magicka: 0, stamina: 0.5 },
    description: 'Increases one-handed weapon damage',
    category: 'combat',
  },
  twoHandDamage: {
    name: 'Two-Hand Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.8, magicka: 0, stamina: 0.2 },
    description: 'Increases two-handed weapon damage',
    category: 'combat',
  },
  unarmedDamage: {
    name: 'Unarmed Damage',
    isPercentage: false,
    prefactor: 4.5,
    threshold: 125,
    weights: { health: 0.5, magicka: 0, stamina: 0.5 },
    description: 'Increases unarmed combat damage',
    category: 'combat',
  },
}
```

### 2. Index File

**Path:** `src/features/derived-stats/config/index.ts`

**Content:**

```typescript
export { DERIVED_STATS_CONFIG } from './derivedStatsConfig'
```

## ✅ Acceptance Criteria

- [ ] All 11 derived stats are properly configured
- [ ] Weights sum appropriately for each stat
- [ ] Thresholds are reasonable for gameplay balance
- [ ] Prefactors provide meaningful stat values
- [ ] Categories are correctly assigned
- [ ] Descriptions are clear and accurate
- [ ] Configuration exports correctly
- [ ] No TypeScript compilation errors

## 🔧 Implementation Steps

1. Create the `src/features/derived-stats/config/` directory
2. Create `derivedStatsConfig.ts` with all stat configurations
3. Create `index.ts` for exports
4. Verify all configurations are valid
5. Test configuration imports work correctly

## 📊 Stat Configuration Details

### Combat Stats (4)

- **Ranged Damage**: Stamina-focused (80% stamina, 20% health)
- **One-Hand Damage**: Balanced (50% health, 50% stamina)
- **Two-Hand Damage**: Health-focused (80% health, 20% stamina)
- **Unarmed Damage**: Balanced (50% health, 50% stamina)

### Survival Stats (4)

- **Magic Resist**: Magicka-focused (100% magicka)
- **Disease Resist**: Stamina-focused (60% stamina, 40% health)
- **Poison Resist**: Health-focused (60% health, 40% stamina)
- **Carry Weight**: Health-focused (80% health, 20% stamina)

### Movement Stats (2)

- **Stamina Regen**: Stamina-focused (100% stamina)
- **Move Speed**: Stamina-focused (80% stamina, 20% health)

### Magic Stats (1)

- **Magicka Regen**: Magicka-focused (100% magicka)

## 📝 Notes

- Thresholds are set to require meaningful investment in relevant attributes
- Prefactors are balanced to provide reasonable stat values
- Weights reflect the logical relationship between base and derived stats
- Categories help with UI organization and filtering

## ⏱️ Estimated Time

**45 minutes**

## 🔗 Dependencies

- [Phase 1 Task 01: Core Types and Interfaces](./phase1-task-01-types-and-interfaces.md)

## 🚀 Next Task

[Phase 1 Task 03: Calculation Engine](./phase1-task-03-calculation-engine.md)

