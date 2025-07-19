import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import {
  Star,
  Shield,
  Zap,
  Heart,
  Brain,
  Target,
  Flame,
  Droplets,
  Skull,
  Sword,
  BookOpen,
  Eye,
  Hand,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { RaceAvatar } from './RaceAvatar'
import {
  GenericAccordionCard,
  AccordionLeftControls,
  AccordionHeader,
  AccordionCollapsedContentSlot,
  AccordionExpandedContentSlot,
} from '@/shared/components/generic'

interface RaceAccordionProps {
  item: PlayerCreationItem
  originalRace?: Race
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

export function RaceAccordion({
  item,
  originalRace,
  isExpanded = false,
  onToggle,
  className,
}: RaceAccordionProps) {
  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Left Controls */}
      <AccordionLeftControls>
        <AddToBuildSwitchSimple
          itemId={item.id}
          itemType="race"
          itemName={item.name}
        />
      </AccordionLeftControls>

      {/* Header Content */}
      <AccordionHeader>
        {/* Left side: Avatar + Name */}
        <div className="flex items-center gap-3">
          <RaceAvatar raceName={item.name} size="md" />
          <H3 className="text-primary font-semibold">{item.name}</H3>
        </div>

        {/* Right side: Classification + Effects */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Race type tag */}
          {item.category && (
            <Badge
              variant="outline"
              className={cn(
                'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                'text-xs font-medium transition-colors'
              )}
            >
              {item.category}
            </Badge>
          )}

          {/* Quick effects preview */}
          {item.effects && item.effects.length > 0 && (
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{item.effects.length} effects</span>
              </div>
            </div>
          )}
        </div>
      </AccordionHeader>

      {/* Collapsed Content */}
      <AccordionCollapsedContentSlot>
        <div className="space-y-3">
          {/* Description */}
          <div className="line-clamp-2">
            <P className="text-sm text-muted-foreground">
              {item.summary || item.description}
            </P>
          </div>

          {/* Quick effects */}
          <div className="flex flex-wrap gap-2">
            {item.effects?.slice(0, 2).map((effect, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
                title={effect.description}
              >
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="font-medium">{effect.name}</span>
              </div>
            ))}
          </div>
        </div>
      </AccordionCollapsedContentSlot>

      {/* Expanded Content */}
      <AccordionExpandedContentSlot>
        <div className="space-y-4">
          {/* Description */}
          <div>
            <P className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </P>
          </div>

          {/* Race Stats */}
          {originalRace?.startingStats && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Starting Stats
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(originalRace.startingStats).map(
                  ([stat, value]) => (
                    <div
                      key={stat}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-skyrim-gold" />
                        <span className="font-medium capitalize">{stat}</span>
                      </div>
                      <span className="font-bold text-green-600">+{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Effects */}
          {item.effects && item.effects.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Effects
              </h5>
              <div className="space-y-3">
                {item.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <P className="font-medium text-sm mb-1">
                          {effect.name}
                        </P>
                        <P className="text-sm text-muted-foreground">
                          {effect.description}
                        </P>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionExpandedContentSlot>
    </GenericAccordionCard>
  )
}
