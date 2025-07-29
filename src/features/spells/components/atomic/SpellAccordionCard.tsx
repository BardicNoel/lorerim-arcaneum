import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { Badge } from '@/shared/ui/ui/badge'
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
import type { SpellWithComputed } from '../../types'

interface SpellAccordionCardProps {
  spell: SpellWithComputed
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}

const schoolIcons = {
  'Destruction': Flame,
  'Restoration': Heart,
  'Conjuration': Ghost,
  'Illusion': Eye,
  'Alteration': Shield,
  '': Sparkles
}

const levelColors = {
  'Novice': 'bg-green-100 text-green-800 border-green-200',
  'Apprentice': 'bg-blue-100 text-blue-800 border-blue-200',
  'Adept': 'bg-purple-100 text-purple-800 border-purple-200',
  'Expert': 'bg-orange-100 text-orange-800 border-orange-200',
  'Master': 'bg-red-100 text-red-800 border-red-200'
}

export function SpellAccordionCard({
  spell,
  className,
  isExpanded = false,
  onToggle,
  disableHover = false,
}: SpellAccordionCardProps) {
  const SchoolIcon = schoolIcons[spell.school as keyof typeof schoolIcons] || Sparkles

  // Generate tags from the spell data
  const tags = [
    spell.school,
    spell.level,
    ...spell.effects.slice(0, 2).map(effect => effect.name),
  ].filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates

  const handleToggle = () => {
    onToggle?.()
  }

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={handleToggle}
      disableHover={disableHover}
    >
      <AccordionCard.Header>
        <SchoolIcon className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-primary font-semibold text-lg">{spell.name}</h3>
        <div className="flex items-center gap-3 ml-auto pointer-events-none">
          <Badge
            variant="outline"
            className={cn(
              levelColors[spell.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800 border-gray-200',
              'text-xs font-medium transition-colors'
            )}
          >
            {spell.level}
          </Badge>
        </div>
      </AccordionCard.Header>
      
      <AccordionCard.Summary>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{spell.school}</span>
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

        {spell.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {spell.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>

        {spell.hasEffects && (
          <div className="mt-2 text-xs text-muted-foreground">
            {spell.effectCount} effect{spell.effectCount !== 1 ? 's' : ''}
          </div>
        )}
      </AccordionCard.Summary>
      
      <AccordionCard.Details>
        {/* Effects */}
        {spell.hasEffects && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Effects</h5>
            <div className="space-y-3">
              {spell.effects.map((effect, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">{effect.name}</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    {effect.description}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {effect.magnitude > 0 && (
                      <span>Magnitude: {effect.magnitude}</span>
                    )}
                    {effect.duration > 0 && (
                      <span>Duration: {effect.duration}s</span>
                    )}
                    {effect.area > 0 && (
                      <span>Area: {effect.area}ft</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spell Statistics */}
        <div>
          <h5 className="text-lg font-medium text-foreground mb-3">Statistics</h5>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium">Magicka Cost</span>
              <span className="font-bold">{spell.magickaCost} MP</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium">Total Magnitude</span>
              <span className="font-bold">{spell.totalMagnitude}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium">Max Duration</span>
              <span className="font-bold">{spell.maxDuration}s</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium">Max Area</span>
              <span className="font-bold">{spell.maxArea}ft</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <span className="font-medium">Effect Count</span>
              <span className="font-bold">{spell.effectCount}</span>
            </div>
          </div>
        </div>

        {/* Additional Tags */}
        {spell.tags.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Tags</h5>
            <div className="flex flex-wrap gap-2">
              {spell.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}