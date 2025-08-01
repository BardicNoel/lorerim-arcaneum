import React from 'react'
import type { SearchResult } from '../model/SearchModel'
import type { ViewMode } from '../model/TypeSpecificComponents'

// Import type-specific components
import { RaceAccordion } from '@/features/races-v2/components/composition/RaceAccordion'
import { RaceCard } from '@/features/races-v2/components/composition/RaceCard'
import { RaceDetailView } from '@/features/races-v2/views/RaceDetailView'

import { BirthsignAccordion } from '@/features/birthsigns/components/BirthsignAccordion'
import { BirthsignCard } from '@/features/birthsigns/components/BirthsignCard'
import { BirthsignDetailPanel } from '@/features/birthsigns/components/BirthsignDetailPanel'

import { SkillAccordion } from '@/features/skills/components/composition/SkillAccordion'
import { SkillCard } from '@/features/skills/components/composition/SkillCard'
import { SkillGrid } from '@/features/skills/components/composition/SkillGrid'

import { TraitAccordion } from '@/features/traits/components/TraitAccordion'
import { TraitCard } from '@/features/traits/components/TraitCard'

import { DestinyAccordionList } from '@/features/destiny/components/composition/DestinyAccordionList'
import { DestinyCard } from '@/features/destiny/components/composition/DestinyCard'
import { DestinyDetailPanel } from '@/features/destiny/components/composition/DestinyDetailPanel'

import { PerkTreeGrid } from '@/features/skills/components/composition/PerkTreeGrid'

import { PerkReferenceAccordion } from '@/features/perk-references/components/composition/PerkReferenceAccordion'

import { SpellSearchCard } from '@/features/search/components/type-specific/SpellSearchCard'
import { SpellDetailView } from '@/features/search/components/type-specific/SpellDetailView'

import { RecipeAccordion } from '@/features/cookbook/components/composition/RecipeAccordion'

// Import wrapper components
import { 
  PerkReferenceSearchWrapper, 
  RecipeSearchWrapper, 
  FallbackCard, 
  FallbackDetail 
} from './wrappers'

// Component mapping by type and view mode
const COMPONENT_MAP: Record<
  string,
  Record<ViewMode, React.ComponentType<any>>
> = {
  race: {
    card: RaceCard,
    accordion: RaceAccordion,
    grid: RaceCard,
    detail: RaceDetailView,
    compact: RaceCard,
  },
  birthsign: {
    card: BirthsignCard,
    accordion: BirthsignAccordion,
    grid: BirthsignCard,
    detail: BirthsignDetailPanel,
    compact: BirthsignCard,
  },
  skill: {
    card: SkillCard,
    accordion: SkillAccordion,
    grid: SkillGrid,
    detail: FallbackDetail,
    compact: SkillCard,
  },
  trait: {
    card: TraitCard,
    accordion: TraitAccordion,
    grid: TraitCard,
    detail: FallbackDetail,
    compact: TraitCard,
  },
  religion: {
    card: FallbackCard,
    accordion: FallbackCard,
    grid: FallbackCard,
    detail: FallbackDetail,
    compact: FallbackCard,
  },
  destiny: {
    card: DestinyCard,
    accordion: DestinyAccordionList,
    grid: DestinyCard,
    detail: DestinyDetailPanel,
    compact: DestinyCard,
  },
  perk: {
    card: FallbackCard,
    accordion: FallbackCard,
    grid: PerkTreeGrid,
    detail: FallbackDetail,
    compact: FallbackCard,
  },
  'perk-reference': {
    card: PerkReferenceSearchWrapper,
    accordion: PerkReferenceAccordion,
    grid: PerkReferenceSearchWrapper,
    detail: FallbackDetail,
    compact: PerkReferenceSearchWrapper,
  },
  spell: {
    card: SpellSearchCard,
    accordion: SpellSearchCard,
    grid: SpellSearchCard,
    detail: SpellDetailView,
    compact: SpellSearchCard,
  },
  recipe: {
    card: RecipeSearchWrapper,
    accordion: RecipeAccordion,
    grid: RecipeSearchWrapper,
    detail: FallbackDetail,
    compact: RecipeSearchWrapper,
  },
}

// Get component for a specific type and view mode
export function getComponentForType(
  type: string,
  viewMode: ViewMode
): React.ComponentType<any> {

  console.log("getComponentForType", type, viewMode)
  const typeComponents = COMPONENT_MAP[type]
  if (!typeComponents) {
    return FallbackCard
  }

  return typeComponents[viewMode] || typeComponents.card || FallbackCard
}
