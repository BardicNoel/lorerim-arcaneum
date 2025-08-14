# Derived Stats Implementation Plan

## 📋 Overview

This document outlines the complete implementation plan for adding derived stats to the Lorerim Arcaneum character build system. Derived stats transform base character attributes (Health, Stamina, Magicka) into meaningful gameplay statistics using weighted formulas with thresholds and scaling factors.

## 🎯 Goals

### Immediate Goal (Phase 1)

- **Calculate 11 derived attributes** from core character stats
- **Real-time updates** as character build changes
- **Clean UI integration** into existing build page
- **Performance optimized** calculations

### Future Improvements (Phase 2+)

- **Extensible architecture** for additional stat sources
- **Advanced stat calculations** with complex modifiers
- **Stat comparison** and build optimization tools

## 📊 Data Collection Analysis

### 🎯 Immediate Goal - Core Data Sources

| Source                    | Data Available                             | Location                              | Status   |
| ------------------------- | ------------------------------------------ | ------------------------------------- | -------- |
| **Race**                  | Starting health, stamina, magicka          | `public/data/playable-races.json`     | ✅ Ready |
| **Attribute Assignments** | Level-based increases (5 points per level) | `src/shared/types/build.ts`           | ✅ Ready |
| **Character Level**       | Current level tracking                     | `src/shared/stores/characterStore.ts` | ✅ Ready |

### 🔮 Future Improvements - Additional Data Sources

| Source        | Data Available                                        | Location                                   | Status     |
| ------------- | ----------------------------------------------------- | ------------------------------------------ | ---------- |
| **Birthsign** | Stat modifications (health, stamina, magicka bonuses) | `public/data/birthsigns.json`              | 🔄 Phase 2 |
| **Traits**    | Various stat effects                                  | `public/data/traits.json`                  | 🔄 Phase 2 |
| **Religion**  | Deity blessing effects                                | `public/data/wintersun-religion-docs.json` | 🔄 Phase 2 |
| **Destiny**   | Node stat bonuses                                     | `public/data/subclasses.json`              | 🔄 Phase 2 |

### ❌ Missing Data We Need

| Source    | Missing Data                           | Action Required                     |
| --------- | -------------------------------------- | ----------------------------------- |
| **Perks** | Stat modifications from selected perks | Extract stat effects from perk data |

### 📝 Implementation Strategy

**Phase 1 (Immediate Goal):**

- Focus only on core attribute sources: Race + Level-based increases
- Implement basic derived stats calculation
- Create UI components for display
- Ensure real-time updates

**Phase 2 (Future Improvements):**

- Add birthsign, traits, religion, and destiny bonuses
- Enhance calculation engine for complex modifiers
- Add advanced UI features and comparisons

### ✅ Religion Data Available

| Source       | Data Available                                                                  | Location                                   |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------------ |
| **Religion** | Stat modifications from deity blessings (Health, Stamina, Magicka, MagicResist) | `public/data/wintersun-religion-docs.json` |

### ✅ Destiny Data Available

| Source      | Data Available                                                                                     | Location                      |
| ----------- | -------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Destiny** | Stat modifications from destiny nodes (Health, Stamina, Magicka, Regeneration, Damage, Resistance) | `public/data/subclasses.json` |

**Religion Stat Effects Found:**

- **Akatosh**: MagicResist +15%
- **Arkay**: Health +40, HealRate +1
- **Julianos**: Magicka +40
- **Kynareth**: Stamina +40, SpeedMult +15%
- **Additional deities**: Various health, magicka, and stamina bonuses

**Destiny Stat Effects Found:**

- **Fortification**: Health +10, Magicka +10, Stamina +10
- **Focus**: Magicka Regeneration +50%
- **Constitution**: Health Regeneration +50%
- **Endurance**: Stamina Regeneration +50%
- **Magic Shell**: Magic Resistance +10%
- **Additional nodes**: Various regeneration, damage, and resistance bonuses

**Key Destiny Nodes with Stat Bonuses:**

- **Destiny**: Carry Weight +25
- **Fortification**: Health/Magicka/Stamina +10 each
- **Focus**: Magicka Regeneration +50%
- **Constitution**: Health Regeneration +50%
- **Endurance**: Stamina Regeneration +50%
- **Magic Shell**: Magic Resistance +10%
- **Healing Presence**: Health regeneration effects
- **Absorption**: Magicka absorption effects

**Religion Data Structure:**

```json
{
  "name": "DeityName",
  "blessing": {
    "effects": [
      {
        "magnitude": 40,
        "targetAttribute": "Health|Stamina|Magicka|MagicResist|HealRate|SpeedMult",
        "effectName": "Fortify Health",
        "effectDescription": "Increases your Health by <mag> points."
      }
    ]
  }
}
```

**Destiny Data Structure:**

```json
{
  "name": "NodeName",
  "edid": "DAR_Perk01Destiny",
  "description": "Increases carry weight by 25.",
  "prerequisites": [],
  "globalFormId": "0xFE25F808"
}
```

## 🏗 Architecture Overview

### MVA Pattern Implementation

```
src/features/derived-stats/
├── model/
│   ├── DerivedStatsModel.ts          # Core data structures
│   ├── DerivedStatsCalculator.ts     # Calculation engine
│   └── index.ts
├── adapters/
│   ├── useDerivedStatsCalculation.ts # React hook for calculations
│   ├── useDerivedStatsData.ts        # Data fetching and processing
│   └── index.ts
├── views/
│   ├── DerivedStatsCard.tsx          # Main display component
│   ├── DerivedStatsTable.tsx         # Stats table component
│   ├── BaseAttributesDisplay.tsx     # Base stats display
│   └── index.ts
├── config/
│   ├── derivedStatsConfig.ts         # Stat definitions and formulas
│   └── index.ts
├── types/
│   └── index.ts                      # TypeScript interfaces
└── index.ts
```

## 📋 Implementation Phases

### Phase 1: Data Structure & Configuration

#### 1.1 Create Core Types

```typescript
// src/features/derived-stats/types/index.ts
export interface BaseAttributes {
  health: number
  stamina: number
  magicka: number
}

export interface DerivedStat {
  name: string
  value: number
  isPercentage: boolean
  formula: string
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatConfig {
  name: string
  isPercentage: boolean
  prefactor: number
  threshold: number
  weights: {
    health: number
    magicka: number
    stamina: number
  }
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatsCalculation {
  baseAttributes: BaseAttributes
  derivedStats: DerivedStat[]
  sources: {
    race: string
    birthsign: string
    traits: string[]
    equipment: string[]
    religion: string
    destinyPath: string[]
    attributeAssignments: number
  }
}
```

#### 1.2 Create Derived Stats Configuration

```typescript
// src/features/derived-stats/config/derivedStatsConfig.ts
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

### Phase 2: Core Calculation Engine

#### 2.1 Create Calculation Service

```typescript
// src/features/derived-stats/model/DerivedStatsCalculator.ts
export class DerivedStatsCalculator {
  /**
   * Calculate base attributes from core sources (Phase 1)
   */
  static calculateBaseAttributes(
    build: BuildState,
    dataSources: DataSources
  ): BaseAttributes {
    const base = { health: 100, stamina: 100, magicka: 100 }

    // Add race starting stats
    if (build.race && dataSources.races) {
      const race = dataSources.races.find(r => r.edid === build.race)
      if (race?.startingStats) {
        base.health += race.startingStats.health
        base.stamina += race.startingStats.stamina
        base.magicka += race.startingStats.magicka
      }
    }

    // Add attribute assignments (5 points per level)
    base.health += build.attributeAssignments.health
    base.stamina += build.attributeAssignments.stamina
    base.magicka += build.attributeAssignments.magicka

    return base
  }

  /**
   * Calculate base attributes with all sources (Phase 2+)
   */
  static calculateBaseAttributesAdvanced(
    build: BuildState,
    dataSources: DataSources
  ): BaseAttributes {
    const base = this.calculateBaseAttributes(build, dataSources)

    // Add birthsign bonuses (Phase 2)
    if (build.stone && dataSources.birthsigns) {
      const birthsign = dataSources.birthsigns.find(b => b.edid === build.stone)
      if (birthsign?.stat_modifications) {
        birthsign.stat_modifications.forEach(stat => {
          if (stat.stat === 'health' && stat.type === 'bonus') {
            base.health += stat.value
          } else if (stat.stat === 'stamina' && stat.type === 'bonus') {
            base.stamina += stat.value
          } else if (stat.stat === 'magicka' && stat.type === 'bonus') {
            base.magicka += stat.value
          }
        })
      }
    }

    // Add trait bonuses (Phase 2)
    if (dataSources.traits) {
      const selectedTraits = [
        ...(build.traits.regular || []),
        ...(build.traits.bonus || []),
      ]

      selectedTraits.forEach(traitId => {
        const trait = dataSources.traits.find(t => t.edid === traitId)
        if (trait?.effects) {
          // Parse trait effects for stat bonuses
          // This requires parsing the effects array for stat modifications
        }
      })
    }

    // Add religion bonuses (Phase 2)
    if (build.religion && dataSources.religions) {
      const religion = dataSources.religions.find(
        r => r.name === build.religion
      )
      if (religion?.blessing?.effects) {
        religion.blessing.effects.forEach(effect => {
          if (effect.targetAttribute === 'Health' && effect.magnitude > 0) {
            base.health += effect.magnitude
          } else if (
            effect.targetAttribute === 'Stamina' &&
            effect.magnitude > 0
          ) {
            base.stamina += effect.magnitude
          } else if (
            effect.targetAttribute === 'Magicka' &&
            effect.magnitude > 0
          ) {
            base.magicka += effect.magnitude
          }
        })
      }
    }

    // Add destiny path bonuses (Phase 2)
    if (build.destinyPath && dataSources.destinyNodes) {
      build.destinyPath.forEach(nodeId => {
        const node = dataSources.destinyNodes.find(
          n => n.edid === nodeId || n.name === nodeId
        )
        if (node?.description) {
          // Parse description for stat bonuses
          // Examples: "Health, Magicka and Stamina are increased by 10 each"
          // "Your Magicka Regeneration is increased by 50%"
          const healthMatch = node.description.match(/Health.*?(\d+)/i)
          const magickaMatch = node.description.match(/Magicka.*?(\d+)/i)
          const staminaMatch = node.description.match(/Stamina.*?(\d+)/i)

          if (healthMatch) base.health += parseInt(healthMatch[1])
          if (magickaMatch) base.magicka += parseInt(magickaMatch[1])
          if (staminaMatch) base.stamina += parseInt(staminaMatch[1])
        }
      })
    }

    return base
  }

  /**
   * Calculate a single derived stat
   */
  static calculateDerivedStat(
    baseAttributes: BaseAttributes,
    config: DerivedStatConfig
  ): number {
    const weightedSum =
      baseAttributes.health * config.weights.health +
      baseAttributes.magicka * config.weights.magicka +
      baseAttributes.stamina * config.weights.stamina

    if (weightedSum > config.threshold) {
      const bonus = config.prefactor * Math.sqrt(weightedSum - config.threshold)
      return Math.floor(bonus)
    }

    return 0
  }

  /**
   * Calculate all derived stats
   */
  static calculateAllDerivedStats(
    baseAttributes: BaseAttributes,
    config: Record<string, DerivedStatConfig>
  ): DerivedStat[] {
    return Object.entries(config).map(([key, statConfig]) => ({
      name: statConfig.name,
      value: this.calculateDerivedStat(baseAttributes, statConfig),
      isPercentage: statConfig.isPercentage,
      formula: `${statConfig.prefactor} * sqrt(weightedSum - ${statConfig.threshold})`,
      description: statConfig.description,
      category: statConfig.category,
    }))
  }
}
```

#### 2.2 Create Data Sources Interface

```typescript
// src/features/derived-stats/types/index.ts
export interface DataSources {
  races?: Race[]
  birthsigns?: Birthsign[]
  traits?: Trait[]
  equipment?: Equipment[]
  religions?: Religion[]
  destinyNodes?: DestinyNode[]
  perks?: Perk[]
}
```

### Phase 3: React Adapters

#### 3.1 Create Calculation Hook

```typescript
// src/features/derived-stats/adapters/useDerivedStatsCalculation.ts
import { useMemo } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import { useTraitsStore } from '@/shared/stores/traitsStore'
import { DerivedStatsCalculator } from '../model/DerivedStatsCalculator'
import { DERIVED_STATS_CONFIG } from '../config/derivedStatsConfig'

export function useDerivedStatsCalculation() {
  const { build } = useCharacterBuild()
  const { data: races } = useRacesStore()

  const calculation = useMemo(() => {
    const dataSources = {
      races,
      // Phase 2: Add birthsigns, traits, religions, destinyNodes
    }

    const baseAttributes = DerivedStatsCalculator.calculateBaseAttributes(
      build,
      dataSources
    )
    const derivedStats = DerivedStatsCalculator.calculateAllDerivedStats(
      baseAttributes,
      DERIVED_STATS_CONFIG
    )

    return {
      baseAttributes,
      derivedStats,
      sources: {
        race: build.race || 'None',
        birthsign: build.stone || 'None',
        traits: [
          ...(build.traits.regular || []),
          ...(build.traits.bonus || []),
        ],
        equipment: build.equipment || [],
        religion: build.religion || 'None',
        destinyPath: build.destinyPath || [],
        attributeAssignments: build.attributeAssignments.level,
      },
    }
  }, [build, races])

  return calculation
}
```

### Phase 4: UI Components

#### 4.1 Create Base Attributes Display

```typescript
// src/features/derived-stats/views/BaseAttributesDisplay.tsx
import { BaseAttributes } from '../types'
import { Heart, Zap, Activity } from 'lucide-react'

interface BaseAttributesDisplayProps {
  attributes: BaseAttributes
}

export function BaseAttributesDisplay({ attributes }: BaseAttributesDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        <span className="font-medium">Health:</span>
        <span className="text-lg font-bold">{attributes.health}</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-500" />
        <span className="font-medium">Magicka:</span>
        <span className="text-lg font-bold">{attributes.magicka}</span>
      </div>
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-green-500" />
        <span className="font-medium">Stamina:</span>
        <span className="text-lg font-bold">{attributes.stamina}</span>
      </div>
    </div>
  )
}
```

#### 4.2 Create Derived Stats Table

```typescript
// src/features/derived-stats/views/DerivedStatsTable.tsx
import { DerivedStat } from '../types'
import { Shield, Zap, Heart, Target, Move, Package, Crosshair, Sword, Hand } from 'lucide-react'

interface DerivedStatsTableProps {
  stats: DerivedStat[]
}

const statIcons: Record<string, React.ComponentType> = {
  magicResist: Shield,
  magickaRegen: Zap,
  diseaseResist: Heart,
  poisonResist: Shield,
  staminaRegen: Zap,
  moveSpeed: Move,
  carryWeight: Package,
  rangedDamage: Crosshair,
  oneHandDamage: Sword,
  twoHandDamage: Sword,
  unarmedDamage: Hand,
}

export function DerivedStatsTable({ stats }: DerivedStatsTableProps) {
  return (
    <div className="space-y-2">
      {stats.map((stat) => {
        const Icon = statIcons[stat.name.toLowerCase().replace(/\s+/g, '')] || Shield
        const value = stat.value > 0 ? `+${stat.value}${stat.isPercentage ? '%' : ''}` : `+0${stat.isPercentage ? '%' : ''}`

        return (
          <div key={stat.name} className="flex items-center justify-between p-2 bg-background border rounded">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{stat.name}:</span>
            </div>
            <span className="font-bold text-primary">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
```

#### 4.3 Create Main Derived Stats Card

```typescript
// src/features/derived-stats/views/DerivedStatsCard.tsx
import { useDerivedStatsCalculation } from '../adapters/useDerivedStatsCalculation'
import { BaseAttributesDisplay } from './BaseAttributesDisplay'
import { DerivedStatsTable } from './DerivedStatsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Calculator } from 'lucide-react'

export function DerivedStatsCard() {
  const { baseAttributes, derivedStats } = useDerivedStatsCalculation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Derived Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Base Attributes</h4>
          <BaseAttributesDisplay attributes={baseAttributes} />
        </div>
        <div>
          <h4 className="font-medium mb-2">Derived Attributes</h4>
          <DerivedStatsTable stats={derivedStats} />
        </div>
      </CardContent>
    </Card>
  )
}
```

### Phase 5: Build Page Integration

#### 5.1 Update Build Page

```typescript
// src/pages/BuildPage.tsx
// Add to imports
import { DerivedStatsCard } from '@/features/derived-stats'

// Add to buildCards array
const buildCards = [
  // ... existing cards
  {
    id: 'attributes',
    component: <AttributeAssignmentCard />,
    size: 'full',
  },
  {
    id: 'derived-stats',
    component: <DerivedStatsCard />,
    size: 'full',
  },
  // ... rest of cards
]
```

#### 5.2 Update Feature Exports

```typescript
// src/features/derived-stats/index.ts
export { DerivedStatsCard } from './views/DerivedStatsCard'
export { useDerivedStatsCalculation } from './adapters/useDerivedStatsCalculation'
export type { DerivedStat, BaseAttributes } from './types'
```

### Phase 6: Data Enhancement

#### 6.1 Phase 1 - Core Data (Immediate Goal)

**Status**: ✅ Ready for Implementation

- **Race Data**: Starting stats from `public/data/playable-races.json`
- **Attribute Assignments**: Level-based increases from build state
- **Character Level**: Current level tracking
- **Implementation**: Simple calculation with existing data sources

#### 6.2 Phase 2 - Additional Data Sources (Future)

**Status**: 🔄 Planned for Future Implementation

- **Birthsign Data**: Stat modifications from `public/data/birthsigns.json`
- **Trait Data**: Various stat effects from `public/data/traits.json`
- **Religion Data**: Deity blessing effects from `public/data/wintersun-religion-docs.json`
- **Destiny Data**: Node stat bonuses from `public/data/subclasses.json`
- **Perk Data**: Stat modifications from selected perks

#### 6.3 Equipment Data (Not Used)

**Status**: ❌ Excluded from Derived Stats

- Equipment stat bonuses are not included in derived stats calculations
- This keeps derived stats focused on character build choices rather than gear
- Equipment effects are handled separately in the game mechanics

### Phase 7: Testing & Validation

#### 7.1 Unit Tests

```typescript
// src/features/derived-stats/__tests__/DerivedStatsCalculator.test.ts
describe('DerivedStatsCalculator', () => {
  test('calculates base attributes correctly', () => {
    // Test base attribute calculation
  })

  test('calculates derived stats correctly', () => {
    // Test derived stat calculation
  })

  test('handles edge cases', () => {
    // Test edge cases and error conditions
  })
})
```

#### 7.2 Integration Tests

```typescript
// src/features/derived-stats/__tests__/DerivedStatsCard.test.tsx
describe('DerivedStatsCard', () => {
  test('displays base attributes', () => {
    // Test base attributes display
  })

  test('displays derived stats', () => {
    // Test derived stats display
  })

  test('updates when build changes', () => {
    // Test real-time updates
  })
})
```

### Phase 8: Performance Optimization

#### 8.1 Memoization

- Use `useMemo` for expensive calculations
- Cache derived stats calculations
- Optimize re-renders with `React.memo`

#### 8.2 Lazy Loading

- Lazy load derived stats card
- Defer calculations until needed
- Progressive enhancement

## 🚀 Implementation Timeline

| Phase                           | Duration  | Dependencies    |
| ------------------------------- | --------- | --------------- |
| Phase 1: Data Structure         | 1-2 days  | None            |
| Phase 2: Calculation Engine     | 2-3 days  | Phase 1         |
| Phase 3: React Adapters         | 1-2 days  | Phase 2         |
| Phase 4: UI Components          | 2-3 days  | Phase 3         |
| Phase 5: Build Page Integration | 1 day     | Phase 4         |
| Phase 6: Data Enhancement       | 0.5-1 day | None (parallel) |
| Phase 7: Testing                | 2-3 days  | All phases      |
| Phase 8: Performance            | 1-2 days  | Phase 7         |

**Total Estimated Time**: 7.5-17 days

## 🔧 Technical Considerations

### Performance

- **Memoization**: Cache calculations to avoid recomputation
- **Debouncing**: Debounce rapid build changes
- **Virtualization**: For large stat lists (future)

### Accessibility

- **Screen readers**: Proper ARIA labels for stat values
- **Keyboard navigation**: Tab through stat items
- **Color contrast**: Ensure readable stat values

### Extensibility

- **Plugin system**: Allow custom derived stats
- **Configuration**: External stat definitions
- **Modding support**: User-defined stat formulas

## 📝 Future Enhancements

### Phase 2 Improvements

1. **Additional Data Sources**: Add birthsign, traits, religion, and destiny bonuses
2. **Advanced Calculations**: Complex modifiers and conditional effects
3. **Enhanced UI**: Tooltips, graphs, and comparison tools

### Phase 3+ Improvements

4. **Stat Categories**: Group stats by combat, survival, movement, magic
5. **Stat Tooltips**: Show calculation formulas on hover
6. **Stat Graphs**: Visual representation of stat relationships
7. **Build Templates**: Preset attribute distributions
8. **Stat Comparison**: Compare stats between builds
9. **Export Integration**: Include derived stats in build exports

## 🎯 Success Criteria

- [ ] All 11 derived stats calculate correctly
- [ ] Real-time updates when build changes
- [ ] Clean, accessible UI integration
- [ ] Performance under 16ms for calculations
- [ ] Comprehensive test coverage (>90%)
- [ ] Documentation complete
- [ ] No breaking changes to existing features

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-19  
**Status**: Ready for Implementation
