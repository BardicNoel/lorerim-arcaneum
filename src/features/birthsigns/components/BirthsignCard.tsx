import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'
import type { Birthsign } from '../types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { parseDescription } from '../utils/dataTransform'

interface BirthsignCardProps {
  birthsign: Birthsign
  item: PlayerCreationItem
  isSelected?: boolean
  onClick?: () => void
}

const groupIcons: Record<string, string> = {
  'Warrior': '⚔️',
  'Mage': '🔮',
  'Thief': '🗡️',
  'Serpent': '🐍',
  'Other': '⭐'
}

const groupColors: Record<string, string> = {
  'Warrior': 'text-red-600',
  'Mage': 'text-blue-600',
  'Thief': 'text-green-600',
  'Serpent': 'text-purple-600',
  'Other': 'text-yellow-500'
}

export function BirthsignCard({ birthsign, item, isSelected = false, onClick }: BirthsignCardProps) {
  const groupIcon = groupIcons[birthsign.group] || groupIcons['Other']
  const groupColor = groupColors[birthsign.group] || groupColors['Other']

  // Parse the description to replace placeholders
  const parsedDescription = parseDescription(birthsign.description)

  // Generate tags from the birthsign data
  const tags = [
    birthsign.group,
    ...birthsign.stat_modifications.slice(0, 2).map(stat => stat.stat),
    ...birthsign.powers.slice(0, 1).map(power => power.name)
  ].filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        'hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{groupIcon}</span>
            <h3 className="font-semibold text-lg">{birthsign.name}</h3>
          </div>
          <Badge 
            variant="secondary" 
            className={cn('text-xs', groupColor)}
          >
            {birthsign.group}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {parsedDescription}
        </p>
        
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
        
        {birthsign.powers.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {birthsign.powers.length} power{birthsign.powers.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 