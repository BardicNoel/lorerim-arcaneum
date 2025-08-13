import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Separator } from '@/shared/ui/ui/separator'
import {
  BookOpen,
  Clock,
  Eye,
  Flame,
  Ghost,
  Heart,
  Shield,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import type { SpellWithComputed } from '../../types'

interface SpellItemProps {
  spell: SpellWithComputed
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  className?: string
}

const schoolIcons = {
  Destruction: Flame,
  Restoration: Heart,
  Conjuration: Ghost,
  Illusion: Eye,
  Alteration: Shield,
  '': Sparkles,
}

const levelColors = {
  Novice: 'bg-green-100 text-green-800',
  Apprentice: 'bg-blue-100 text-blue-800',
  Adept: 'bg-purple-100 text-purple-800',
  Expert: 'bg-orange-100 text-orange-800',
  Master: 'bg-red-100 text-red-800',
}

export function SpellItem({
  spell,
  variant = 'default',
  showEffects = true,
  showTags = true,
  className = '',
}: SpellItemProps) {
  const SchoolIcon =
    schoolIcons[spell.school as keyof typeof schoolIcons] || Sparkles

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center justify-between p-3 border rounded-lg ${className}`}
      >
        <div className="flex items-center gap-3">
          <SchoolIcon className="w-5 h-5 text-muted-foreground" />
          <div>
            <h4 className="font-medium text-sm">{spell.name}</h4>
            <p className="text-xs text-muted-foreground">
              {spell.school} • {spell.level}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {spell.magickaCost} MP
          </Badge>
          {spell.hasEffects && (
            <Badge variant="outline" className="text-xs">
              {spell.effectCount} effects
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">{spell.name}</CardTitle>
          </div>
          <Badge
            className={
              levelColors[spell.level as keyof typeof levelColors] ||
              'bg-gray-100 text-gray-800'
            }
          >
            {spell.level}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{spell.school}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>{spell.magickaCost} MP</span>
          </div>
          {spell.isAreaSpell && (
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Area</span>
            </div>
          )}
          {spell.isDurationSpell && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Duration</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {spell.description && (
          <FormattedText
            text={spell.description}
            className="text-sm text-muted-foreground"
            as="p"
          />
        )}

        {showEffects && spell.hasEffects && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Effects</h5>
            {spell.effects.map((effect, index) => (
              <div key={index} className="p-2 rounded bg-muted border text-sm">
                <FormattedText
                  text={effect.description}
                  className="text-muted-foreground"
                  as="p"
                />
                <div className="flex gap-4 mt-1 text-xs">
                  {effect.magnitude > 0 && (
                    <span>Magnitude: {effect.magnitude}</span>
                  )}
                  {effect.duration > 0 && (
                    <span>Duration: {effect.duration}s</span>
                  )}
                  {effect.area > 0 && <span>Area: {effect.area}ft</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {showTags && spell.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {spell.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {variant === 'detailed' && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Magnitude:</span>
                <span className="ml-2 font-medium">{spell.totalMagnitude}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Duration:</span>
                <span className="ml-2 font-medium">{spell.maxDuration}s</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max Area:</span>
                <span className="ml-2 font-medium">{spell.maxArea}ft</span>
              </div>
              <div>
                <span className="text-muted-foreground">Effect Count:</span>
                <span className="ml-2 font-medium">{spell.effectCount}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
