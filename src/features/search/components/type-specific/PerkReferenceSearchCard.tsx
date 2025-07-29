import { usePerkReferencesData } from '@/features/perk-references/adapters/usePerkReferencesData'
import { PerkReferenceAccordionCard } from '@/features/perk-references/components/atomic/PerkReferenceAccordionCard'
import { perkToPlayerCreationItem } from '@/features/perk-references/utils/perkToPlayerCreationItem'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import type { SearchableItem } from '../../model/SearchModel'

interface PerkReferenceSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list'
}

export function PerkReferenceSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: PerkReferenceSearchCardProps) {
  const { build } = useCharacterBuild()
  const { allPerks } = usePerkReferencesData()

  // Find the full perk reference from the store
  const perkData = item.originalData
  const fullPerk = allPerks.find(perk => perk.edid === perkData?.edid)

  if (!fullPerk) {
    // Fallback to default search card if perk not found
    console.warn('Perk reference not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
    })
    return null
  }

  // Convert to PlayerCreationItem format using the existing utility
  const perkItem = perkToPlayerCreationItem(fullPerk, build)
  const displayItem = { ...perkItem, originalPerk: fullPerk }

  return (
    <PerkReferenceAccordionCard
      item={displayItem}
      className={className}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
    />
  )
}
