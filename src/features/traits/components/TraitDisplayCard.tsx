import { FormattedText } from '@/shared/components/generic/FormattedText'
import { EntityDisplayCard } from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useTraits } from '../hooks/useTraits'

interface TraitDisplayCardProps {
  className?: string
}

// Remove mock data - we'll use real trait data from the hook

export function TraitDisplayCard({ className }: TraitDisplayCardProps) {
  const { build } = useCharacterBuild()
  const navigate = useNavigate()
  const { traits } = useTraits()

  // Get selected traits
  const selectedTraitIds = [...build.traits.regular, ...build.traits.bonus]
  const selectedTraits = selectedTraitIds
    .map(id => traits.find(trait => trait.edid === id))
    .filter((trait): trait is NonNullable<typeof trait> => trait !== undefined)

  const handleNavigateToTraitPage = () => {
    navigate('/traits')
  }

  if (selectedTraits.length === 0) {
    return (
      <EntityDisplayCard
        title="Selected Traits"
        entity={null}
        onNavigateToPage={handleNavigateToTraitPage}
        className={className}
        placeholder="No traits selected"
      />
    )
  }

  // For multiple traits, we'll show a summary view
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Selected Traits</h3>
        <button
          onClick={handleNavigateToTraitPage}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {selectedTraits.map((trait, index) => (
          <div key={trait.edid} className="border rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{trait.name}</h4>
                  {trait.category && (
                    <Badge variant="secondary" className="text-xs">
                      {trait.category}
                    </Badge>
                  )}
                </div>
                <FormattedText
                  text={trait.description || ''}
                  className="text-base text-muted-foreground mb-2"
                />

                {/* Show first few effects */}
                {trait.effects &&
                  trait.effects.slice(0, 2).map((effect, effectIndex) => (
                    <div
                      key={effectIndex}
                      className={`text-xs p-1 rounded mb-1 ${
                        effect.flags.includes('Detrimental')
                          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                      }`}
                    >
                      <FormattedText text={effect.type} className="text-xs" />
                    </div>
                  ))}

                {trait.effects && trait.effects.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{trait.effects.length - 2} more effects
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
