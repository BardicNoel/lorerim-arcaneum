import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { MarkdownText } from '@/shared/components/MarkdownText'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Religion } from '../types'

interface ReligionDetailPanelProps {
  item: PlayerCreationItem
  originalReligion?: Religion
}

export function ReligionDetailPanel({ item, originalReligion }: ReligionDetailPanelProps) {
  const getPantheonIcon = (pantheon: string) => {
    switch (pantheon.toLowerCase()) {
      case 'divine':
        return '🕊️'
      case 'daedric':
        return '🔥'
      case 'yokudan':
        return '⚔️'
      case 'custom':
        return '✨'
      default:
        return '🏛️'
    }
  }

  const getPantheonColor = (pantheon: string) => {
    switch (pantheon.toLowerCase()) {
      case 'divine':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'daedric':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'yokudan':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderEffect = (effect: any, index: number) => (
    <div key={index} className="mb-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">{effect.effectName}</span>
        {effect.magnitude > 0 && (
          <Badge variant="outline" className="text-xs">
            {effect.magnitude}
          </Badge>
        )}
      </div>
      {effect.effectDescription && (
        <p className="text-sm text-muted-foreground">
          {effect.effectDescription}
        </p>
      )}
      {effect.duration > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Duration: {effect.duration} seconds
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">
          {getPantheonIcon(item.category || 'Unknown')}
        </span>
        <div>
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <Badge 
            variant="outline" 
            className={`mt-1 ${getPantheonColor(item.category || 'Unknown')}`}
          >
            {item.category || 'Unknown'} Pantheon
          </Badge>
        </div>
      </div>

            {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownText>{item.description}</MarkdownText>
        </CardContent>
      </Card>

      {/* Tenets */}
      {originalReligion?.tenet && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📖 Tenets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">{originalReligion.tenet.header}</h4>
            <MarkdownText>{originalReligion.tenet.description}</MarkdownText>
          </CardContent>
        </Card>
      )}

      {/* Ranks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🎯 Powers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Follower Power */}
          {originalReligion?.boon1 && (
            <div>
              <h4 className="font-semibold mb-2 text-primary">Follower Power</h4>
              <div className="mb-2">
                <span className="font-medium">{originalReligion.boon1.spellName}</span>
              </div>
              {originalReligion.boon1.effects.map((effect, index) => 
                renderEffect(effect, index)
              )}
            </div>
          )}

          <hr className="border-border my-4" />

          {/* Devotee Power */}
          {originalReligion?.boon2 && (
            <div>
              <h4 className="font-semibold mb-2 text-primary">Devotee Power</h4>
              <div className="mb-2">
                <span className="font-medium">{originalReligion.boon2.spellName}</span>
              </div>
              {originalReligion.boon2.effects.map((effect, index) => 
                renderEffect(effect, index)
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Restrictions */}
      {originalReligion && (originalReligion.favoredRaces?.length > 0 || originalReligion.worshipRestrictions?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔒 Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {originalReligion.favoredRaces?.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold mb-2">Favored Races</h4>
                <div className="flex flex-wrap gap-1">
                  {originalReligion.favoredRaces.map((race, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {race}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {originalReligion.worshipRestrictions?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Worship Restrictions</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {originalReligion.worshipRestrictions.map((restriction, index) => (
                    <li key={index}>{restriction}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏷️ Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 