import { cn } from '@/lib/utils'
import { MarkdownText } from '@/shared/components/MarkdownText'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import type { Birthsign } from '../types'
import { getUserFriendlyStat, parseDescription } from '../utils/dataTransform'
import { BirthsignAvatar } from './BirthsignAvatar'

interface BirthsignDetailPanelProps {
  birthsign: Birthsign
  item: PlayerCreationItem
}

const effectTypeColors: Record<string, string> = {
  bonus: 'bg-green-200 text-green-800 border-green-300',
  penalty: 'bg-red-200 text-red-800 border-red-300',
  conditional: 'bg-purple-200 text-purple-800 border-purple-300',
}

export function BirthsignDetailPanel({
  birthsign,
  item,
}: BirthsignDetailPanelProps) {
  const parsedDescription = parseDescription(birthsign.description)

  // Generate tags from the birthsign data
  const tags = [
    birthsign.group,
    ...birthsign.stat_modifications.map(stat => stat.stat),
    ...birthsign.skill_bonuses.map(skill => skill.stat),
    ...birthsign.powers.map(power => power.name),
  ].filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BirthsignAvatar birthsignName={birthsign.name} size="3xl" />
        <div>
          <h2 className="text-2xl font-bold">{birthsign.name}</h2>
          <p className="text-muted-foreground">{birthsign.group} Birthsign</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 6).map((tag, index) => (
          <Badge key={index} variant="secondary">
            {getUserFriendlyStat(tag)}
          </Badge>
        ))}
        {tags.length > 6 && (
          <Badge variant="outline">+{tags.length - 6} more</Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📋 Overview</TabsTrigger>
          <TabsTrigger value="stats">⚡ Stats</TabsTrigger>
          <TabsTrigger value="powers">Powers</TabsTrigger>
          <TabsTrigger value="effects">🎯 Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownText>{parsedDescription}</MarkdownText>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Game Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">EDID:</span> {birthsign.edid}
                </div>
                <div>
                  <span className="font-medium">Form ID:</span>{' '}
                  {birthsign.formid}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="space-y-4">
            {birthsign.stat_modifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Stat Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {birthsign.stat_modifications.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              effectTypeColors[stat.type]
                            )}
                          >
                            {stat.type}
                          </Badge>
                          <span className="font-medium">
                            {getUserFriendlyStat(stat.stat)}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'font-bold',
                            stat.type === 'bonus'
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          {stat.type === 'bonus' ? '+' : ''}
                          {stat.value}
                          {stat.value_type === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {birthsign.skill_bonuses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skill Bonuses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {birthsign.skill_bonuses.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="font-medium">
                          {getUserFriendlyStat(skill.stat)}
                        </span>
                        <span className="font-bold text-green-600">
                          +{skill.value}
                          {skill.value_type === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="powers" className="space-y-4">
          {birthsign.powers.length > 0 ? (
            <div className="space-y-4">
              {birthsign.powers.map((power, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{power.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {power.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {power.magnitude && (
                        <div>
                          <span className="font-medium">Magnitude:</span>{' '}
                          {power.magnitude}
                        </div>
                      )}
                      {power.duration && (
                        <div>
                          <span className="font-medium">Duration:</span>{' '}
                          {power.duration}s
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No special powers for this birthsign.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <div className="space-y-4">
            {birthsign.conditional_effects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Conditional Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {birthsign.conditional_effects.map((effect, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-purple-200 text-purple-800 border-purple-300"
                          >
                            Conditional
                          </Badge>
                          <span className="font-medium">
                            {getUserFriendlyStat(effect.stat)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {effect.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Condition:</strong> {effect.condition}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {birthsign.mastery_effects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mastery Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {birthsign.mastery_effects.map((effect, index) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-200 text-blue-800 border-blue-300"
                          >
                            Mastery
                          </Badge>
                          <span className="font-medium">
                            {getUserFriendlyStat(effect.stat)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {effect.description}
                        </p>
                        {effect.condition && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <strong>Requirement:</strong> {effect.condition}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {birthsign.conditional_effects.length === 0 &&
              birthsign.mastery_effects.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No conditional or mastery effects for this birthsign.
                    </p>
                  </CardContent>
                </Card>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
