import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import {
  SelectionCard,
  type SelectionOption,
} from '@/shared/components/ui/SelectionCard'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { parseDescription } from '../utils/dataTransform'

interface TraitCardProps {
  item: PlayerCreationItem
}

export function TraitCard({ item }: TraitCardProps) {
  const {
    hasRegularTrait,
    hasBonusTrait,
    // addRegularTrait, // Out of scope for this MR
    // addBonusTrait,   // Out of scope for this MR
    removeTrait,
    getRegularTraitLimit,
    getBonusTraitLimit,
    // canAddRegularTrait, // Out of scope for this MR
    // canAddBonusTrait,   // Out of scope for this MR
  } = useCharacterBuild()

  // Determine current trait level
  const getTraitLevel = (): 'primary' | 'secondary' | 'none' => {
    if (hasRegularTrait(item.id)) return 'primary'
    if (hasBonusTrait(item.id)) return 'secondary'
    return 'none'
  }

  const traitLevel = getTraitLevel()
  const regularLimit = getRegularTraitLimit()
  const bonusLimit = getBonusTraitLimit()

  // Parse and clean the description
  const cleanedDescription = parseDescription(item.description)

  // Trait management is out of scope for this MR
  // const handleTraitLevelChange = (value: string | undefined) => {
  //   if (!value) {
  //     // Clear the trait
  //     removeTrait(item.id)
  //   } else if (value === 'primary') {
  //     if (traitLevel === 'primary') {
  //       // Toggle off primary trait
  //       removeTrait(item.id)
  //     } else if (canAddRegularTrait()) {
  //       // Add regular trait (this will automatically remove any existing trait)
  //       removeTrait(item.id) // Clear any existing trait first
  //       addRegularTrait(item.id)
  //     }
  //   } else if (value === 'secondary') {
  //     if (traitLevel === 'secondary') {
  //       // Toggle off secondary trait
  //       removeTrait(item.id)
  //     } else if (canAddBonusTrait()) {
  //       // Add bonus trait (this will automatically remove any existing trait)
  //       removeTrait(item.id) // Clear any existing trait first
  //       addBonusTrait(item.id)
  //     }
  //   }
  // }

  // const isRegularLimitReached =
  //   !canAddRegularTrait() && traitLevel !== 'primary'
  // const isBonusLimitReached = !canAddBonusTrait() && traitLevel !== 'secondary'

  // Define selection options (disabled for now)
  // const options: SelectionOption[] = [
  //   {
  //     value: 'primary',
  //     label: '+ Regular',
  //     color: {
  //       selected: 'skyrim-gold',
  //       hover: 'skyrim-gold/10',
  //       border: 'skyrim-gold',
  //     },
  //     disabled: isRegularLimitReached,
  //     tooltip: isRegularLimitReached
  //       ? `Maximum ${regularLimit} regular traits reached`
  //       : undefined,
  //   },
  //   {
  //     value: 'secondary',
  //     label: '+ Extra Unlock',
  //     color: {
  //       selected: 'skyrim-gold',
  //       hover: 'skyrim-gold/10',
  //       border: 'skyrim-gold',
  //     },
  //     disabled: isBonusLimitReached,
  //     tooltip: isBonusLimitReached
  //       ? `Maximum ${bonusLimit} extra unlock traits reached`
  //       : undefined,
  //   },
  // ]

  // Define card theming based on selection state
  // const getCardTheming = (selectedValue: string | undefined) => {
  //   if (selectedValue === 'primary') {
  //     return 'border-yellow-500 bg-yellow-50/50 shadow-yellow-500/20'
  //   }
  //   if (selectedValue === 'secondary') {
  //     return 'border-gray-400 bg-gray-50/50 shadow-gray-400/20'
  //   }
  //   return ''
  // }

  // Render a placeholder or minimal card for now
  return (
    <div className="p-4 border rounded bg-muted text-muted-foreground">
      TraitCard functionality is out of scope for this MR.
    </div>
  )
}
