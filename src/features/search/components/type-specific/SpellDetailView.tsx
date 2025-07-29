import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Separator } from '@/shared/ui/ui/separator'
import { 
  BookOpen, 
  Zap, 
  Clock, 
  Target, 
  Sparkles,
  Flame,
  Snowflake,
  Bolt,
  Heart,
  Ghost,
  Eye,
  Shield
} from 'lucide-react'
import type { SearchResult } from '../../model/SearchModel'
import type { SpellWithComputed } from '@/features/spells/types'

interface SpellDetailViewProps {
  result: SearchResult
}

const schoolIcons = {
  'Destruction': Flame,
  'Restoration': Heart,
  'Conjuration': Ghost,
  'Alteration': Shield,
  'Illusion': Eye,
  'Mysticism': Sparkles,
}

const schoolColors = {
  'Destruction': 'bg-red-500/20 text-red-700 border-red-500/30',
  'Restoration': 'bg-green-500/20 text-green-700 border-green-500/30',
  'Conjuration': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'Alteration': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'Illusion': 'bg-pink-500/20 text-pink-700 border-pink-500/30',
  'Mysticism': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
}

const levelColors = {
  'Novice': 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  'Apprentice': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'Adept': 'bg-green-500/20 text-green-700 border-green-500/30',
  'Expert': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'Master': 'bg-red-500/20 text-red-700 border-red-500/30',
}

export const SpellDetailView: React.FC<SpellDetailViewProps> = ({ result }) => {
  const spellData = result.item.originalData as SpellWithComputed

  if (!spellData) {
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h2 className="text-lg font-semibold mb-4">Spell not found</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {result.item.description}
        </p>
        <div className="text-xs text-muted-foreground">
          Type: {result.item.type} | ID: {result.item.id}
        </div>
      </div>
    )
  }

  const SchoolIcon = schoolIcons[spellData.school as keyof typeof schoolIcons] || BookOpen

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-2">{spellData.name}</CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${schoolColors[spellData.school as keyof typeof schoolColors] || 'bg-gray-500/20 text-gray-700 border-gray-500/30'}`}
              >
                <SchoolIcon className="w-3 h-3" />
                {spellData.school}
              </Badge>
              <Badge 
                variant="outline" 
                className={levelColors[spellData.level as keyof typeof levelColors] || 'bg-gray-500/20 text-gray-700 border-gray-500/30'}
              >
                {spellData.level}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Description */}
        {spellData.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{spellData.description}</p>
          </div>
        )}

        <Separator />

        {/* Spell Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Magicka Cost</p>
              <p className="font-semibold">{spellData.magickaCost}</p>
            </div>
          </div>
          
          {spellData.maxDuration > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{spellData.maxDuration}s</p>
              </div>
            </div>
          )}
          
          {spellData.maxArea > 0 && (
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Area</p>
                <p className="font-semibold">{spellData.maxArea}</p>
              </div>
            </div>
          )}
          
          {spellData.totalMagnitude > 0 && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Magnitude</p>
                <p className="font-semibold">{spellData.totalMagnitude}</p>
              </div>
            </div>
          )}
        </div>

        {/* Effects */}
        {spellData.effects && spellData.effects.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Effects</h3>
              <div className="space-y-2">
                {spellData.effects.map((effect, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm">{effect.name}</h4>
                    {effect.description && (
                      <p className="text-xs text-muted-foreground mt-1">{effect.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tags */}
        {spellData.tags && spellData.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {spellData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 