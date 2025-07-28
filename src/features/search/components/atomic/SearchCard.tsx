import type { SearchableItem } from '../../model/SearchModel'
import { DestinySearchCard } from '../type-specific/DestinySearchCard'
import { RaceSearchCard } from '../type-specific/RaceSearchCard'
import { ReligionSearchCard } from '../type-specific/ReligionSearchCard'
import { SkillSearchCard } from '../type-specific/SkillSearchCard'
import { TraitSearchCard } from '../type-specific/TraitSearchCard'
import { DefaultSearchCard } from './DefaultSearchCard'

interface SearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function SearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: SearchCardProps) {
  // Simple switchboard based on item type
  switch (item.type) {
    case 'race':
      return (
        <RaceSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'skill':
      return (
        <SkillSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'trait':
      return (
        <TraitSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'birthsign':
      // TODO: Implement BirthsignSearchCard
      return (
        <DefaultSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'destiny':
      return (
        <DestinySearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'religion':
      return (
        <ReligionSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    case 'perk':
      // TODO: Implement PerkSearchCard
      return (
        <DefaultSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )

    default:
      return (
        <DefaultSearchCard
          item={item}
          isSelected={isSelected}
          onClick={onClick}
          className={className}
        />
      )
  }
}
