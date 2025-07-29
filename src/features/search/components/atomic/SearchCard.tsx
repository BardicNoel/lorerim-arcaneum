import type { SearchableItem } from '../../model/SearchModel'
import { BirthsignSearchCard } from '../type-specific/BirthsignSearchCard'
import { DestinySearchCard } from '../type-specific/DestinySearchCard'
import { PerkReferenceSearchCard } from '../type-specific/PerkReferenceSearchCard'
import { PerkSearchCard } from '../type-specific/PerkSearchCard'
import { RaceSearchCard } from '../type-specific/RaceSearchCard'
import { ReligionSearchCard } from '../type-specific/ReligionSearchCard'
import { SkillSearchCard } from '../type-specific/SkillSearchCard'
import { TraitSearchCard } from '../type-specific/TraitSearchCard'
import { SpellSearchCard } from '../type-specific/SpellSearchCard'
import { DefaultSearchCard } from './DefaultSearchCard'

interface SearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list'
}

export function SearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: SearchCardProps) {
  console.log('SearchCard props:', { type: item.type, isExpanded, onToggle: !!onToggle, viewMode })
  // Simple switchboard based on item type
  switch (item.type) {
    case 'race':
      return (
        <RaceSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'skill':
      return (
        <SkillSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'trait':
      return (
        <TraitSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'birthsign':
      return (
        <BirthsignSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'destiny':
      return (
        <DestinySearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'religion':
      return (
        <ReligionSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'perk':
      return (
        <PerkSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'spell':
      return (
        <SpellSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    case 'perk-reference':
      return (
        <PerkReferenceSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )

    default:
      return (
        <DefaultSearchCard
          item={item}
          className={className}
          isExpanded={isExpanded}
          onToggle={onToggle}
          viewMode={viewMode}
        />
      )
  }
}
