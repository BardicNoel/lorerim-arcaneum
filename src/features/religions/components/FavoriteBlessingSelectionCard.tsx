import { SelectionCardShell } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Clock, Target, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBlessingData } from '../hooks/useBlessingData'
import { BlessingAutocomplete } from './BlessingAutocomplete'
import { ReligionAvatar } from './atomic/ReligionAvatar'

interface FavoriteBlessingSelectionCardProps {
  className?: string
}

/**
 * Function to format seconds to a readable time format
 */
function formatDuration(durationSeconds: number): string {
  if (durationSeconds < 60) {
    return `${durationSeconds}s`
  } else if (durationSeconds < 3600) {
    const minutes = Math.round(durationSeconds / 60)
    return `${minutes}m`
  } else {
    const hours = Math.round(durationSeconds / 3600)
    return `${hours}h`
  }
}

/**
 * Component to format blessing descriptions with inline magnitude values
 */
function FormattedBlessingDescription({
  description,
  magnitude,
  duration,
  area = 0,
}: {
  description: string
  magnitude: number
  duration: number
  area?: number
}) {
  if (!description) return null

  // Replace placeholders with actual values inline
  let formatted = description
    .replace(/<mag>/g, magnitude.toString())
    .replace(/<magnitude>/g, magnitude.toString())
    .replace(/<dur>/g, duration.toString())
    .replace(/<duration>/g, duration.toString())
    .replace(/<area>/g, area.toString())

  // Replace common variable names with actual values
  formatted = formatted
    .replace(/\b(magnitude|mag)\b/gi, magnitude.toString())
    .replace(/\b(duration|dur)\b/gi, duration.toString())
    .replace(/\b(area)\b/gi, area.toString())

  return <div className="text-sm text-muted-foreground">{formatted}</div>
}

export function FavoriteBlessingSelectionCard({
  className,
}: FavoriteBlessingSelectionCardProps) {
  const { build, setFavoriteBlessing } = useCharacterBuild()
  const navigate = useNavigate()
  const { blessings, loading, error } = useBlessingData()

  // Find selected blessing source
  const selectedBlessingSource = build.favoriteBlessing
    ? blessings.find(blessing => blessing.id === build.favoriteBlessing)
    : null

  const handleNavigateToReligionPage = () => {
    navigate('/build/religions')
  }

  if (loading) {
    return (
      <SelectionCardShell
        title="Favorite Blessing"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <div className="text-sm text-muted-foreground">
          Loading blessings...
        </div>
      </SelectionCardShell>
    )
  }

  if (error) {
    return (
      <SelectionCardShell
        title="Favorite Blessing"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <div className="text-sm text-destructive">
          Error loading blessings: {error}
        </div>
      </SelectionCardShell>
    )
  }

  // If no blessing is selected, show the autocomplete
  if (!selectedBlessingSource) {
    return (
      <SelectionCardShell
        title="Favorite Blessing"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Choose your character's favorite blessing (the blessing you expect to
          use most frequently)
        </p>
        <BlessingAutocomplete
          blessings={blessings}
          selectedBlessingId={build.favoriteBlessing}
          onBlessingSelect={setFavoriteBlessing}
          placeholder="Search for a blessing source..."
          className="w-full"
        />
      </SelectionCardShell>
    )
  }

  // If blessing is selected, show the blessing card with simplified display
  return (
    <SelectionCardShell
      title="Favorite Blessing"
      navigateTo="religions"
      onNavigate={handleNavigateToReligionPage}
      className={className}
    >
      <BlessingAutocomplete
        blessings={blessings}
        selectedBlessingId={build.favoriteBlessing}
        onBlessingSelect={setFavoriteBlessing}
        placeholder={`Favorite Blessing: Select a blessing source (${selectedBlessingSource.name})`}
        className="w-full"
      />

      {/* Simplified Blessing Display */}
      <div className="mt-4 p-4 border rounded-lg bg-card">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <ReligionAvatar
            religionName={selectedBlessingSource.name}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-primary truncate">
              {selectedBlessingSource.blessingName}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedBlessingSource.effects.length} effect
              {selectedBlessingSource.effects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Effects List */}
        <div className="space-y-2">
          {selectedBlessingSource.effects
            .slice(0, 2) // Show only first 2 effects
            .map((effect, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg"
              >
                <Zap className="h-4 w-4 text-skyrim-gold mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{effect.name}</div>
                  <FormattedBlessingDescription
                    description={effect.description}
                    magnitude={effect.magnitude}
                    duration={effect.duration}
                    area={effect.area}
                  />
                  {(effect.duration > 0 || effect.area > 0) && (
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {effect.duration > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Lasts for {formatDuration(effect.duration)}
                          </span>
                        </div>
                      )}
                      {effect.area > 0 && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>Area: {effect.area}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* More Effects Indicator */}
        {selectedBlessingSource.effects.length > 2 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              +{selectedBlessingSource.effects.length - 2} more effect
              {selectedBlessingSource.effects.length - 2 !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </SelectionCardShell>
  )
}
