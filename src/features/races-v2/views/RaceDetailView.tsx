import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H1, H2, H3, P } from '@/shared/ui/ui/typography'
import { ArrowLeft, ExternalLink, Star, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRaceData, useRaceDetail } from '../adapters'
import { CategoryBadge, RaceAvatar } from '../components/atomic'
import {
  RaceEffectsDisplay,
  RaceKeywordsDisplay,
  RaceStatsDisplay,
} from '../components/composition'

interface RaceDetailViewProps {
  raceId: string
  className?: string
}

export function RaceDetailView({ raceId, className }: RaceDetailViewProps) {
  const navigate = useNavigate()
  const { races } = useRaceData()
  const { race, isLoading, error, relatedRaces } = useRaceDetail({
    raceId,
    allRaces: races,
  })

  if (isLoading) {
    return (
      <div className={cn('container mx-auto p-6', className)}>
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !race) {
    return (
      <div className={cn('container mx-auto p-6', className)}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error || 'Race not found'}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/races')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Races
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('container mx-auto p-6', className)}>
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/races')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Races
        </Button>

        <div className="flex items-start gap-6">
          <RaceAvatar raceName={race.name} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <H1 className="text-3xl font-bold">{race.name}</H1>
              <CategoryBadge category={race.category} size="lg" />
            </div>
            <P className="text-lg text-muted-foreground mb-4">
              {race.description}
            </P>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Playable Race</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{race.keywords.length} Keywords</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Section */}
          <div className="bg-card border rounded-lg p-6">
            <H2 className="text-xl font-semibold mb-4">Statistics</H2>
            <RaceStatsDisplay
              stats={race.startingStats}
              regeneration={race.regeneration}
              title="Starting Stats"
              compact={false}
              showRegeneration={true}
            />
          </div>

          {/* Effects Section */}
          {race.racialSpells.length > 0 && (
            <div className="bg-card border rounded-lg p-6">
              <H2 className="text-xl font-semibold mb-4">Racial Abilities</H2>
              <RaceEffectsDisplay
                effects={race.racialSpells.map(spell => ({
                  name: spell.name,
                  description: spell.description,
                }))}
                title="Racial Spells"
                showDescriptions={true}
                compact={false}
              />
            </div>
          )}

          {/* Keywords Section */}
          {race.keywords.length > 0 && (
            <div className="bg-card border rounded-lg p-6">
              <H2 className="text-xl font-semibold mb-4">Keywords</H2>
              <RaceKeywordsDisplay
                keywords={race.keywords.map(k => k.edid)}
                title="Race Keywords"
                showCount={true}
              />
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-card border rounded-lg p-6">
            <H2 className="text-xl font-semibold mb-4">
              Additional Information
            </H2>
            <div className="space-y-4">
              <div>
                <H3 className="text-lg font-medium mb-2">Description</H3>
                <P className="text-muted-foreground">{race.description}</P>
              </div>

              {race.racialSpells.length > 0 && (
                <div>
                  <H3 className="text-lg font-medium mb-2">Racial Spells</H3>
                  <div className="space-y-2">
                    {race.racialSpells.map((spell, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded">
                        <div className="font-medium">{spell.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {spell.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-4">
            <H3 className="text-lg font-semibold mb-3">Quick Actions</H3>
            <div className="space-y-2">
              <Button className="w-full" size="sm">
                Add to Character Build
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Compare with Other Races
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Wiki
              </Button>
            </div>
          </div>

          {/* Race Summary */}
          <div className="bg-card border rounded-lg p-4">
            <H3 className="text-lg font-semibold mb-3">Race Summary</H3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <Badge variant="secondary">{race.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Health:</span>
                <span className="font-medium">{race.startingStats.health}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Magicka:</span>
                <span className="font-medium">
                  {race.startingStats.magicka}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stamina:</span>
                <span className="font-medium">
                  {race.startingStats.stamina}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Carry Weight:
                </span>
                <span className="font-medium">
                  {race.startingStats.carryWeight}
                </span>
              </div>
            </div>
          </div>

          {/* Related Races */}
          {relatedRaces.length > 0 && (
            <div className="bg-card border rounded-lg p-4">
              <H3 className="text-lg font-semibold mb-3">Related Races</H3>
              <div className="space-y-2">
                {relatedRaces.slice(0, 3).map(relatedRace => (
                  <Button
                    key={relatedRace.edid}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/races/${relatedRace.edid}`)}
                    className="w-full justify-start text-left h-auto p-2"
                  >
                    <div className="flex items-center gap-2">
                      <RaceAvatar raceName={relatedRace.name} size="sm" />
                      <div>
                        <div className="font-medium text-sm">
                          {relatedRace.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {relatedRace.category}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
