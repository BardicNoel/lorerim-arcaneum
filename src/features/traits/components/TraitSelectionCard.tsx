import {
  EntitySelectionCard,
  type EntityOption,
} from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { ExternalLink, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TraitSelectionCardProps {
  className?: string
}

// Mock trait data - in real implementation, this would come from a traits hook
const mockTraits: EntityOption[] = [
  {
    id: 'trait_1',
    name: 'Acoustic Arcanist',
    description: 'Your magic flows through melody and vibration.',
    category: 'Magic',
    tags: ['magic', 'spells'],
  },
  {
    id: 'trait_2',
    name: 'Adrenaline Rush',
    description: 'You possess a natural flight response.',
    category: 'Combat',
    tags: ['combat', 'survival'],
  },
  {
    id: 'trait_3',
    name: 'Angler',
    description: 'Your bond with the sea grants unique benefits.',
    category: 'Survival',
    tags: ['fishing', 'water'],
  },
]

export function TraitSelectionCard({ className }: TraitSelectionCardProps) {
  const {
    build,
    addTrait,
    removeTrait,
    getRegularTraitLimit,
    getBonusTraitLimit,
  } = useCharacterBuild()
  const navigate = useNavigate()

  // Get selected traits
  const selectedTraitIds = [...build.traits.regular, ...build.traits.bonus]
  const selectedTraits = mockTraits.filter(trait =>
    selectedTraitIds.includes(trait.id)
  )

  const handleTraitSelect = (traitId: string) => {
    addTrait(traitId)
  }

  const handleTraitRemove = (traitId: string) => {
    removeTrait(traitId)
  }

  const handleNavigateToTraitPage = () => {
    navigate('/traits')
  }

  const handleClearAllTraits = () => {
    selectedTraitIds.forEach(traitId => removeTrait(traitId))
  }

  const renderTraitDisplay = (entity: EntityOption) => (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="font-medium">{entity.name}</div>
        {entity.category && (
          <div className="text-xs text-muted-foreground">{entity.category}</div>
        )}
      </div>
      <Badge variant="outline" className="text-xs">
        Trait
      </Badge>
    </div>
  )

  const regularLimit = getRegularTraitLimit()
  const bonusLimit = getBonusTraitLimit()
  const maxSelections = regularLimit + bonusLimit

  // If no traits are selected, show the selector
  if (selectedTraits.length === 0) {
    return (
      <EntitySelectionCard
        title="Traits"
        description={`Choose up to ${regularLimit} regular and ${bonusLimit} bonus traits`}
        selectedEntities={[]}
        availableEntities={mockTraits}
        onEntitySelect={handleTraitSelect}
        onEntityRemove={handleTraitRemove}
        onNavigateToPage={handleNavigateToTraitPage}
        selectionType="multi"
        maxSelections={maxSelections}
        placeholder="Select traits..."
        className={className}
        renderEntityDisplay={renderTraitDisplay}
      />
    )
  }

  // If traits are selected, show the summary with clear button
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Traits</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToTraitPage}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllTraits}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trait Count Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedTraits.length} of {maxSelections} traits selected
          </span>
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary">
              {build.traits.regular.length} Regular
            </Badge>
            <Badge variant="secondary">{build.traits.bonus.length} Bonus</Badge>
          </div>
        </div>

        {/* Selected Traits List */}
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

                  {/* Show trait type badge */}
                  <Badge
                    variant={
                      build.traits.regular.includes(trait.id)
                        ? 'default'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {build.traits.regular.includes(trait.id)
                      ? 'Regular'
                      : 'Bonus'}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTraitRemove(trait.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Button */}
        {selectedTraits.length < maxSelections && (
          <Button
            variant="outline"
            onClick={() => {
              // This would ideally open the selector again
              // For now, we'll navigate to the traits page
              handleNavigateToTraitPage()
            }}
            className="w-full"
          >
            Add More Traits
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
