import { AddToBuildButton } from '@/shared/components/playerCreation/AddToBuildButton'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { PerkReferenceItem } from '../../types'
import { PerkReferenceBadge } from './PerkReferenceBadge'
import { SkillAvatar } from '@/features/skills/components/atomic/SkillAvatar'

interface PerkReferenceGridItemProps {
  item: PerkReferenceItem
  isSelected?: boolean
  className?: string
  showAddToBuild?: boolean
}

export function PerkReferenceGridItem({
  item,
  isSelected = false,
  className,
  showAddToBuild = true,
}: PerkReferenceGridItemProps) {
  const originalNode = item.originalNode

  return (
    <div
      className={`p-4 rounded-lg border bg-background hover:bg-muted/50 transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <SkillAvatar
            skillName={originalNode.skillTreeName}
            size="sm"
            className="flex-shrink-0"
          />
          <H4 className="text-sm font-semibold line-clamp-1">{item.name}</H4>
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
        {originalNode?.skillId && (
          <PerkReferenceBadge
            label={originalNode.skillId}
            type="skill"
            size="sm"
          />
        )}
        {originalNode?.ranks && originalNode.ranks.length > 1 && (
          <PerkReferenceBadge
            label={`Rank ${originalNode.ranks.length}`}
            type="rank"
            size="sm"
          />
        )}
      </div>

      {/* Description */}
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

      {/* Tags */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <Small className="text-muted-foreground text-xs">
              +{item.tags.length - 2}
            </Small>
          )}
        </div>

        {/* Effects indicator */}
        {item.effects && item.effects.length > 0 && (
          <div className="flex items-center gap-1">
            {item.effects.slice(0, 1).map((effect, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  effect.type === 'positive'
                    ? 'bg-green-500'
                    : effect.type === 'negative'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                }`}
                title={`${effect.type}: ${effect.name}`}
              />
            ))}
            {item.effects.length > 1 && (
              <Small className="text-muted-foreground text-xs">
                +{item.effects.length - 1}
              </Small>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
