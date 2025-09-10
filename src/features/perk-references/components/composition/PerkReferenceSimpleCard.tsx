import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { PerkReferenceNode } from '../../types'
import { PerkReferenceBadge } from '../atomic/PerkReferenceBadge'
import { SkillAvatar } from '@/features/skills/components/atomic/SkillAvatar'

interface PerkReferenceSimpleCardProps {
  item: PlayerCreationItem & { originalPerk: PerkReferenceNode }
  className?: string
  onClick?: () => void
  viewMode?: 'grid' | 'list'
}

export function PerkReferenceSimpleCard({
  item,
  className,
  onClick,
  viewMode = 'grid',
}: PerkReferenceSimpleCardProps) {
  const originalPerk = item.originalPerk

  return (
    <div
      className={cn(
        'p-4 rounded-lg border bg-background hover:bg-muted/50 transition-all duration-200 hover:shadow-md cursor-pointer',
        viewMode === 'list' && 'flex items-center gap-4',
        className
      )}
      onClick={onClick}
    >
      {viewMode === 'grid' ? (
        // Grid layout
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <SkillAvatar
                skillName={originalPerk.skillTreeName}
                size="sm"
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <H4 className="text-sm font-semibold line-clamp-1">
                  {item.name}
                </H4>
                <Small className="text-muted-foreground">
                  {originalPerk.skillTreeName}
                </Small>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1 mb-3">
            {originalPerk.totalRanks > 1 && (
              <PerkReferenceBadge
                label={`${originalPerk.totalRanks} ranks`}
                type="rank"
                size="sm"
              />
            )}
            {originalPerk.minLevel && (
              <PerkReferenceBadge
                label={`Level ${originalPerk.minLevel}+`}
                type="level"
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
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Small className="text-muted-foreground">
                +{item.tags.length - 3} more
              </Small>
            )}
          </div>
        </>
      ) : (
        // List layout
        <>
          <SkillAvatar
            skillName={originalPerk.skillTreeName}
            size="sm"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <H4 className="text-sm font-semibold truncate">{item.name}</H4>
              <div className="flex items-center gap-2 flex-shrink-0">
                {originalPerk.totalRanks > 1 && (
                  <PerkReferenceBadge
                    label={`${originalPerk.totalRanks} ranks`}
                    type="rank"
                    size="sm"
                  />
                )}
                {originalPerk.minLevel && (
                  <PerkReferenceBadge
                    label={`Level ${originalPerk.minLevel}+`}
                    type="level"
                    size="sm"
                  />
                )}
              </div>
            </div>
            <div className="mt-1 space-y-1">
              <P className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </P>
              {/* Subtext as secondary section */}
              {item.summary && (
                <P className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-2 line-clamp-2">
                  {item.summary}
                </P>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Small className="text-muted-foreground">
                {originalPerk.skillTreeName}
              </Small>
              {item.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Small className="text-muted-foreground">
                      +{item.tags.length - 2} more
                    </Small>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
