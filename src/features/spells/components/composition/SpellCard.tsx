import { GenericAccordionCard } from '@/shared/components/generic'
import { H3, P, Small, Muted } from '@/shared/ui/ui/typography'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { SpellWithComputed } from '../../types'
import {
  SpellSchoolIcon,
  SpellSchoolBadge,
  SpellLevelBadge,
  SpellCostBadge,
  SpellStatsDisplay,
  SpellEffectsDisplay,
  SpellTagsDisplay,
} from '../atomic'

interface SpellCardProps {
  spell: SpellWithComputed
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  // Context-specific properties
  compact?: boolean
}

export function SpellCard({
  spell,
  isExpanded = false,
  onToggle,
  className,
  compact = false,
}: SpellCardProps) {
  // Prepare stats data for display
  const stats = {
    magickaCost: spell.magickaCost,
    duration: spell.maxDuration > 0 ? spell.maxDuration : undefined,
    area: spell.maxArea > 0 ? spell.maxArea : undefined,
    magnitude: spell.totalMagnitude > 0 ? spell.totalMagnitude : undefined,
  }

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={cn("p-6", className)}
    >
      {/* Header Content */}
      <div className="flex items-start justify-between">
        {/* Left side: Icon + Name + Badges */}
        <div className="flex items-start gap-3">
          <SpellSchoolIcon school={spell.school} size="2xl" />
          <div className="flex flex-col gap-2">
            <H3 className="text-foreground font-semibold">{spell.name}</H3>
            {/* School and Level badges */}
            <div className="flex items-center gap-2">
              <SpellSchoolBadge school={spell.school} size="sm" />
              <SpellLevelBadge level={spell.level} size="sm" />
            </div>
          </div>
        </div>

        {/* Right side: Key Stats + Effects + Cost */}
        <div className="flex items-center gap-3">
          {/* Key Stats */}
          <div className="hidden md:flex items-center gap-2">
            {stats.duration !== undefined && stats.duration > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">⏱</span>
                <Small className="text-muted-foreground">{stats.duration}s</Small>
              </div>
            )}
            {stats.area !== undefined && stats.area > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">🎯</span>
                <Small className="text-muted-foreground">{stats.area}ft</Small>
              </div>
            )}
            {stats.magnitude !== undefined && stats.magnitude > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">⚡</span>
                <Small className="text-muted-foreground">{stats.magnitude}</Small>
              </div>
            )}
          </div>

          {/* Quick effects preview */}
          {spell.effects && spell.effects.length > 0 && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-muted-foreground" />
                <Small className="text-muted-foreground">{spell.effects.length} effects</Small>
              </div>
            </div>
          )}

          {/* Cost Badge */}
          <SpellCostBadge cost={spell.magickaCost} size="sm" />
        </div>
      </div>

      {/* Collapsed Content */}
      <div className="space-y-3">
        {/* Description */}
        <div className="line-clamp-2">
          <Muted className="text-sm">{spell.description}</Muted>
        </div>

        {/* Quick effects preview */}
        <SpellEffectsDisplay
          effects={spell.effects}
          maxDisplay={2}
          compact={true}
        />
      </div>

      {/* Expanded Content */}
      <div className="space-y-4">
        {/* Description */}
        <div>
          <Muted className="text-sm leading-relaxed">
            {spell.description}
          </Muted>
        </div>

        {/* Spell Effects */}
        <SpellEffectsDisplay
          effects={spell.effects}
          title="Spell Effects"
          maxDisplay={5}
        />

        {/* Spell Tags */}
        {spell.tags && spell.tags.length > 0 && (
          <SpellTagsDisplay
            tags={spell.tags}
            title="Tags"
            maxDisplay={8}
          />
        )}

        {/* Additional Info */}
        {spell.tome && (
          <div className="space-y-2">
            <Small className="text-muted-foreground">
              Spell Tome
            </Small>
            <P className="text-sm">{spell.tome}</P>
          </div>
        )}

        {spell.vendors && spell.vendors.length > 0 && (
          <div className="space-y-2">
            <Small className="text-muted-foreground">
              Available From
            </Small>
            <div className="flex flex-wrap gap-1">
              {spell.vendors.map((vendor, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/50"
                >
                  {vendor}
                </span>
              ))}
            </div>
          </div>
        )}

        {spell.halfCostPerk && (
          <div className="space-y-2">
            <Small className="text-muted-foreground">
              Half Cost Perk
            </Small>
            <P className="text-sm">{spell.halfCostPerkName}</P>
          </div>
        )}
      </div>
    </GenericAccordionCard>
  )
}
