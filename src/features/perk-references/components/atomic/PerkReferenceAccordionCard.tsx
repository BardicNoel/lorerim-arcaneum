import { cn } from '@/lib/utils'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import { ChevronRight } from 'lucide-react'
import type { PerkReferenceNode } from '../../types'
import { PerkReferenceBadge } from './PerkReferenceBadge'

interface PerkReferenceAccordionCardProps {
  item: PlayerCreationItem & { originalPerk: PerkReferenceNode }
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}

export function PerkReferenceAccordionCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  disableHover = false,
}: PerkReferenceAccordionCardProps) {
  const originalPerk = item.originalPerk
  if (!originalPerk) return null

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
      disableHover={disableHover}
    >
      <AccordionCard.Header>
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
          <span className="text-lg font-bold text-muted-foreground">
            {item.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <H3 className="text-primary font-semibold truncate">{item.name}</H3>
          <div className="flex items-center gap-2 mt-1">
            {originalPerk.skillTreeName && (
              <PerkReferenceBadge
                label={originalPerk.skillTreeName}
                type="skill"
                size="sm"
              />
            )}
            {originalPerk.totalRanks > 1 && (
              <PerkReferenceBadge
                label={`Rank ${originalPerk.totalRanks}`}
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
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isExpanded ? 'rotate-90' : ''
          )}
        />
      </AccordionCard.Header>
      
      <AccordionCard.Summary>
        <P className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </P>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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
        )}
      </AccordionCard.Summary>
      
      <AccordionCard.Details>
        {/* Prerequisites */}
        {originalPerk.prerequisites && originalPerk.prerequisites.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Prerequisites
            </h5>
            <div className="flex flex-wrap gap-1">
              {originalPerk.prerequisites.map((prereq, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Perk Ranks */}
        {originalPerk.ranks && originalPerk.ranks.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Perk Ranks
            </h5>
            <div className="space-y-2">
              {originalPerk.ranks.map((rank, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      Rank {index + 1}
                    </span>
                  </div>
                  {rank.description?.base && (
                    <P className="text-sm text-muted-foreground">
                      {rank.description.base}
                    </P>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Tags */}
        {item.tags.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2">
              Tags
            </h5>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
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