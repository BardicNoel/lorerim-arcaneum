import {
  EntityDisplayCard,
  type EntityDetail,
} from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { useNavigate } from 'react-router-dom'

interface TraitDisplayCardProps {
  className?: string
}

// Mock trait data - in real implementation, this would come from a traits hook
const mockTraits: Record<string, EntityDetail> = {
  trait_1: {
    id: 'trait_1',
    name: 'Acoustic Arcanist',
    description:
      'Your magic flows through melody and vibration. After playing an instrument at an inn, your sonic spells become 20% more powerful.',
    category: 'Magic',
    tags: ['magic', 'spells'],
    effects: [
      {
        name: 'Sonic Spell Power',
        description:
          'Sonic spells become 20% more powerful after playing an instrument',
        type: 'positive',
      },
      {
        name: 'Follower Cost',
        description: 'Hiring followers becomes more expensive',
        type: 'negative',
      },
      {
        name: 'Physical Weakness',
        description: 'Physical attacks are 15% weaker',
        type: 'negative',
      },
    ],
  },
  trait_2: {
    id: 'trait_2',
    name: 'Adrenaline Rush',
    description:
      'You possess a natural flight response. When at less than 20% health, you move 20% faster and regenerate 1 stamina per second.',
    category: 'Combat',
    tags: ['combat', 'survival'],
    effects: [
      {
        name: 'Speed Boost',
        description: 'Move 20% faster when below 20% health',
        type: 'positive',
      },
      {
        name: 'Stamina Regeneration',
        description: 'Regenerate 1 stamina per second when below 20% health',
        type: 'positive',
      },
      {
        name: 'Damage Reduction',
        description: 'Deal 30% less damage when below 20% health',
        type: 'negative',
      },
    ],
  },
  trait_3: {
    id: 'trait_3',
    name: 'Angler',
    description:
      'Your bond with the sea grants unique benefits. Mudcrabs and slaughterfish become friendly toward you.',
    category: 'Survival',
    tags: ['fishing', 'water'],
    effects: [
      {
        name: 'Aquatic Friendship',
        description: 'Mudcrabs and slaughterfish become friendly',
        type: 'positive',
      },
      {
        name: 'Fishing Bonus',
        description: 'Fishing yields more valuable items',
        type: 'positive',
      },
      {
        name: 'Shock Vulnerability',
        description: '10% more vulnerable to shock damage',
        type: 'negative',
      },
    ],
  },
}

export function TraitDisplayCard({ className }: TraitDisplayCardProps) {
  const { build } = useCharacterBuild()
  const navigate = useNavigate()

  // Get selected traits
  const selectedTraitIds = [...build.traits.regular, ...build.traits.bonus]
  const selectedTraits = selectedTraitIds
    .map(id => mockTraits[id])
    .filter(Boolean)

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
          <div key={trait.id} className="border rounded-lg p-3">
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
                <p className="text-sm text-muted-foreground mb-2">
                  {trait.description}
                </p>

                {/* Show first few effects */}
                {trait.effects &&
                  trait.effects.slice(0, 2).map((effect, effectIndex) => (
                    <div
                      key={effectIndex}
                      className={`text-xs p-1 rounded mb-1 ${
                        effect.type === 'positive'
                          ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : effect.type === 'negative'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {effect.name}
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
