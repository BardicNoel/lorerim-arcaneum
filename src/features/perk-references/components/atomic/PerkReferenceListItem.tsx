import { AddToBuildButton } from '@/shared/components/playerCreation/AddToBuildButton'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { PerkReferenceItem } from '../../types'
import { PerkReferenceBadge } from './PerkReferenceBadge'
import { SkillAvatar } from '@/features/skills/components/atomic/SkillAvatar'

interface PerkReferenceListItemProps {
  item: PerkReferenceItem
  isSelected?: boolean
  className?: string
  showAddToBuild?: boolean
}

export function PerkReferenceListItem({
  item,
  isSelected = false,
  className,
  showAddToBuild = true,
}: PerkReferenceListItemProps) {
  const originalNode = item.originalNode

  return (
    <div
      className={`p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <SkillAvatar
          skillName={originalNode.skillTreeName}
          size="sm"
          className="flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <H4 className="text-sm font-semibold truncate">{item.name}</H4>
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
          <div className="space-y-1">
            <P className="text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </P>
            {/* Subtext as secondary section */}
            {item.summary && (
              <P className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-2 line-clamp-1">
                {item.summary}
              </P>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {item.tags.slice(0, 1).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 1 && (
            <Small className="text-muted-foreground text-xs">
              +{item.tags.length - 1}
            </Small>
          )}
        </div>

        {/* Add to Build Button */}
        {showAddToBuild && (
          <div className="flex-shrink-0">
            <AddToBuildButton
              itemId={item.id}
              itemType="perk"
              itemName={item.name}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
