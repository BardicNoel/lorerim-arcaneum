import React from 'react'
import type { SearchResultRenderer } from './SearchModel'
import { SearchResultCard, SearchResultDetail } from '../components/atomic'

// Import type-specific components
// Note: These will be imported dynamically to avoid circular dependencies
// For now, we'll use simple fallback components for testing

export const SEARCH_RESULT_RENDERERS: Record<string, SearchResultRenderer> = {
  skill: {
    type: 'skill',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  race: {
    type: 'race',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  trait: {
    type: 'trait',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  religion: {
    type: 'religion',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  birthsign: {
    type: 'birthsign',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  destiny: {
    type: 'destiny',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
  perk: {
    type: 'perk',
    cardComponent: SearchResultCard,
    detailComponent: SearchResultDetail,
    compactComponent: SearchResultCard,
  },
}

// Fallback renderer for unknown types
export const FALLBACK_RENDERER: SearchResultRenderer = {
  type: 'fallback',
  cardComponent: SearchResultCard,
  detailComponent: SearchResultDetail,
  compactComponent: SearchResultCard,
}

// TODO: Dynamic import functions for type-specific components
// These will be implemented when we enhance existing components with search highlighting
// For now, we're using simple fallback components for testing

/*
export async function getSkillComponents() {
  const { SkillCard } = await import('@/features/skills/components/SkillCard')
  const { SkillDetailPanel } = await import(
    '@/features/skills/components/SkillDetailPanel'
  )

  return {
    cardComponent: SkillCard,
    detailComponent: SkillDetailPanel,
    compactComponent: SkillCard,
  }
}

export async function getRaceComponents() {
  const { RaceCard } = await import('@/features/races-v2/components/RaceCard')
  const { RaceDetailPanel } = await import(
    '@/features/races-v2/components/RaceDetailPanel'
  )

  return {
    cardComponent: RaceCard,
    detailComponent: RaceDetailPanel,
    compactComponent: RaceCard,
  }
}

export async function getTraitComponents() {
  const { TraitCard } = await import('@/features/traits/components/TraitCard')
  const { TraitDetailPanel } = await import(
    '@/features/traits/components/TraitDetailPanel'
  )

  return {
    cardComponent: TraitCard,
    detailComponent: TraitDetailPanel,
    compactComponent: TraitCard,
  }
}

export async function getReligionComponents() {
  const { ReligionCard } = await import(
    '@/features/religions/components/ReligionCard'
  )
  const { ReligionDetailPanel } = await import(
    '@/features/religions/components/ReligionDetailPanel'
  )

  return {
    cardComponent: ReligionCard,
    detailComponent: ReligionDetailPanel,
    compactComponent: ReligionCard,
  }
}

export async function getBirthsignComponents() {
  const { BirthsignCard } = await import(
    '@/features/birthsigns/components/BirthsignCard'
  )
  const { BirthsignDetailPanel } = await import(
    '@/features/birthsigns/components/BirthsignDetailPanel'
  )

  return {
    cardComponent: BirthsignCard,
    detailComponent: BirthsignDetailPanel,
    compactComponent: BirthsignCard,
  }
}

export async function getDestinyComponents() {
  const { DestinyCard } = await import(
    '@/features/destiny/components/DestinyCard'
  )
  const { DestinyDetailPanel } = await import(
    '@/features/destiny/components/DestinyDetailPanel'
  )

  return {
    cardComponent: DestinyCard,
    detailComponent: DestinyDetailPanel,
    compactComponent: DestinyCard,
  }
}

export async function getPerkComponents() {
  const FallbackCard = () => React.createElement('div', null, 'Perk Tree Card')
  const FallbackDetail = () =>
    React.createElement('div', null, 'Perk Tree Detail')

  return {
    cardComponent: FallbackCard,
    detailComponent: FallbackDetail,
    compactComponent: FallbackCard,
  }
}

export async function getFallbackComponents() {
  const FallbackCard = () => React.createElement('div', null, 'Unknown Item')
  const FallbackDetail = () =>
    React.createElement('div', null, 'Unknown Item Details')

  return {
    cardComponent: FallbackCard,
    detailComponent: FallbackDetail,
    compactComponent: FallbackCard,
  }
}

export async function getRenderer(type: string): Promise<SearchResultRenderer> {
  switch (type) {
    case 'skill':
      return await getSkillComponents()
    case 'race':
      return await getRaceComponents()
    case 'trait':
      return await getTraitComponents()
    case 'religion':
      return await getReligionComponents()
    case 'birthsign':
      return await getBirthsignComponents()
    case 'destiny':
      return await getDestinyComponents()
    case 'perk':
      return await getPerkComponents()
    default:
      return await getFallbackComponents()
  }
}
*/
