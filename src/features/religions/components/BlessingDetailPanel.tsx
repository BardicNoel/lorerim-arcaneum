import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Religion } from '../types'

interface BlessingDetailPanelProps {
  item: PlayerCreationItem
  originalReligion?: Religion
}

export function BlessingDetailPanel({ item, originalReligion }: BlessingDetailPanelProps) {
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

      {/* Shrine Blessing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ✨ Shrine Blessing
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Temporary blessings available at shrines, even for non-followers
          </p>
        </CardHeader>
        <CardContent>
          {originalReligion?.blessing ? (
            <>
              <h4 className="font-semibold mb-2">{originalReligion.blessing.spellName}</h4>
              {originalReligion.blessing.effects.map((effect, index) => 
                renderEffect(effect, index)
              )}
            </>
          ) : (
            <p className="text-muted-foreground">No shrine blessing available for this deity.</p>
          )}
        </CardContent>
      </Card>

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