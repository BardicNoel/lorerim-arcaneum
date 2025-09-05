import { AddToBuildButton } from '@/shared/components/playerCreation/AddToBuildButton'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { PerkReferenceItem } from '../../types'
import { PerkReferenceBadge } from '../atomic/PerkReferenceBadge'

interface PerkReferenceCardProps {
  item: PerkReferenceItem
  isSelected?: boolean
  className?: string
  showAddToBuild?: boolean
  onClick?: () => void
  compact?: boolean
}

export function PerkReferenceCard({
  item,
  isSelected = false,
  className,
  showAddToBuild = true,
  onClick,
  compact = false,
}: PerkReferenceCardProps) {
  const originalNode = item.originalPerk

  return (
    <div
      className={`p-4 rounded-lg border bg-background hover:bg-muted/50 transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-muted-foreground">
              {item.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <H4 className="text-sm font-semibold line-clamp-1">{item.name}</H4>
            {!compact && (
              <Small className="text-muted-foreground">
                {item.skillTreeName}
              </Small>
            )}
          </div>
        </div>
        {showAddToBuild && (
          <AddToBuildButton
            itemId={item.id}
            itemType="perk"
            itemName={item.name}
            size="sm"
          />
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1 mb-3">
        <PerkReferenceBadge label={item.category} type="category" size="sm" />
        {item.totalRanks > 1 && (
          <PerkReferenceBadge
            label={`${item.totalRanks} Ranks`}
            type="rank"
            size="sm"
          />
        )}
        {item.isRoot && (
          <PerkReferenceBadge label="Root" type="root" size="sm" />
        )}
      </div>

      {/* Description */}
      {!compact && (
        <div className="mb-3 space-y-1">
          <P className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </P>
          {/* Subtext as secondary section */}
          {item.summary && (
            <P className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-2 line-clamp-2">
              {item.summary}
            </P>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, compact ? 1 : 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > (compact ? 1 : 2) && (
            <Small className="text-muted-foreground text-xs">
              +{item.tags.length - (compact ? 1 : 2)}
            </Small>
          )}
        </div>

        {/* Level requirement */}
        {item.minLevel && item.minLevel > 0 && (
          <Badge variant="secondary" className="text-xs">
            Level {item.minLevel}+
          </Badge>
        )}
      </div>
    </div>
  )
}
