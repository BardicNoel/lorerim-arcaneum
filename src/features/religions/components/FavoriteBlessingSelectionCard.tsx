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
    navigate('/build/religions?tab=blessings')
    // Scroll to top when navigating to religions page
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

      {/* Compact Blessing Display */}
      <div className="mt-4 p-3 border rounded-lg bg-card">
        <div className="flex items-center gap-3">
          <ReligionAvatar
            religionName={selectedBlessingSource.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-primary truncate">
              {selectedBlessingSource.blessingName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {selectedBlessingSource.effects.length} effect
              {selectedBlessingSource.effects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </SelectionCardShell>
  )
}
