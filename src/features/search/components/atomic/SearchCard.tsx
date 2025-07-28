import type { SearchableItem } from '../../model/SearchModel'
import { BirthsignSearchCard } from '../type-specific/BirthsignSearchCard'
import { DestinySearchCard } from '../type-specific/DestinySearchCard'
import { PerkSearchCard } from '../type-specific/PerkSearchCard'
import { RaceSearchCard } from '../type-specific/RaceSearchCard'
import { ReligionSearchCard } from '../type-specific/ReligionSearchCard'
import { SkillSearchCard } from '../type-specific/SkillSearchCard'
import { TraitSearchCard } from '../type-specific/TraitSearchCard'
import { DefaultSearchCard } from './DefaultSearchCard'

interface SearchCardProps {
  item: SearchableItem
  className?: string
}

export function SearchCard({ item, className }: SearchCardProps) {
  // Simple switchboard based on item type
  switch (item.type) {
    case 'race':
      return <RaceSearchCard item={item} className={className} />

    case 'skill':
      return <SkillSearchCard item={item} className={className} />

    case 'trait':
      return <TraitSearchCard item={item} className={className} />

    case 'birthsign':
      return <BirthsignSearchCard item={item} className={className} />

    case 'destiny':
      return <DestinySearchCard item={item} className={className} />

    case 'religion':
      return <ReligionSearchCard item={item} className={className} />

    case 'perk':
      return <PerkSearchCard item={item} className={className} />

    default:
      return <DefaultSearchCard item={item} className={className} />
  }
}
