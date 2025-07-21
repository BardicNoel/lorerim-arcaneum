import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { SelectionCardShell } from '@/shared/components/ui'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTraits } from '../hooks/useTraits'
import type { Trait } from '../types'
import { TraitAutocomplete } from './'

interface TraitSelectionCardProps {
  className?: string
}

export function TraitSelectionCard({ className }: TraitSelectionCardProps) {
  const { allTraits } = useTraits()
  const {
    build,
    addTraitToSlot,
    removeTrait,
    getRegularTraitLimit,
    getBonusTraitLimit,
  } = useCharacterBuild()
  const navigate = useNavigate()

  const regularLimit = getRegularTraitLimit()
  const bonusLimit = getBonusTraitLimit()

  // Get selected traits
  const selectedRegularTraits = build.traits.regular
    .map(id => allTraits.find(trait => trait.edid === id))
    .filter(Boolean) as Trait[]

  const selectedBonusTraits = build.traits.bonus
    .map(id => allTraits.find(trait => trait.edid === id))
    .filter(Boolean) as Trait[]

  const handleTraitSelect = (trait: Trait, slotType: 'regular' | 'bonus') => {
    addTraitToSlot(trait.edid, slotType)
  }

  const handleTraitRemove = (traitId: string) => {
    removeTrait(traitId)
  }

  const handleNavigateToTraitPage = () => {
    navigate('/traits')
  }

  // Filter out already selected traits from autocomplete options
  const availableTraits = allTraits.filter(
    trait =>
      !build.traits.regular.includes(trait.edid) &&
      !build.traits.bonus.includes(trait.edid)
  )

  return (
    <SelectionCardShell
      title="Traits"
      navigateTo="traits"
      onNavigate={handleNavigateToTraitPage}
      className={className}
    >
      <div className="space-y-6">
        {/* Starting Traits */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            Starting
          </h4>

          {/* Starting Trait Slot 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Slot 1
              </Badge>
              {selectedRegularTraits[0] && (
                <Badge variant="default" className="text-xs">
                  Starting
                </Badge>
              )}
            </div>

            {selectedRegularTraits[0] ? (
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50/50 border-yellow-500 shadow-yellow-500/20">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {selectedRegularTraits[0].name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {selectedRegularTraits[0].description}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleTraitRemove(selectedRegularTraits[0].edid)
                  }
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <TraitAutocomplete
                traits={availableTraits}
                onSelect={trait => handleTraitSelect(trait, 'regular')}
                placeholder="Select starting trait..."
                className="w-full"
              />
            )}
          </div>

          {/* Starting Trait Slot 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Slot 2
              </Badge>
              {selectedRegularTraits[1] && (
                <Badge variant="default" className="text-xs">
                  Starting
                </Badge>
              )}
            </div>

            {selectedRegularTraits[1] ? (
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50/50 border-yellow-500 shadow-yellow-500/20">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {selectedRegularTraits[1].name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {selectedRegularTraits[1].description}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleTraitRemove(selectedRegularTraits[1].edid)
                  }
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <TraitAutocomplete
                traits={availableTraits}
                onSelect={trait => handleTraitSelect(trait, 'regular')}
                placeholder="Select starting trait..."
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* Late Game Traits */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">
            Late Game
          </h4>

          {/* Late Game Trait Slot */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Slot 1
              </Badge>
              {selectedBonusTraits[0] && (
                <Badge variant="secondary" className="text-xs">
                  Late Game
                </Badge>
              )}
            </div>

            {selectedBonusTraits[0] ? (
              <div className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50/50 border-gray-400 shadow-gray-400/20">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {selectedBonusTraits[0].name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {selectedBonusTraits[0].description}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTraitRemove(selectedBonusTraits[0].edid)}
                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <TraitAutocomplete
                traits={availableTraits}
                onSelect={trait => handleTraitSelect(trait, 'bonus')}
                placeholder="Select late game trait..."
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </SelectionCardShell>
  )
}
