import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { PerkReferenceBadge } from './PerkReferenceBadge'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation/AddToBuildSwitchSimple'
import type { PerkReferenceItem } from '../../types'

interface PerkReferenceAccordionItemProps {
  item: PerkReferenceItem
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showToggle?: boolean
}

export function PerkReferenceAccordionItem({
  item,
  isExpanded = false,
  onToggle,
  className,
  showToggle = true,
}: PerkReferenceAccordionItemProps) {
  const originalNode = item.originalNode

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <AccordionCard.Header>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {showToggle && (
              <AddToBuildSwitchSimple
                itemId={originalNode?.edid || item.id}
                itemType="perk"
                itemName={item.name}
              />
            )}
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-muted-foreground">
                {item.name.charAt(0)}
              </span>
            </div>
            <H3 className="text-primary font-semibold">{item.name}</H3>
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </AccordionCard.Header>
      
      <AccordionCard.Summary>
        <div className="line-clamp-2">
          <P className="text-sm text-muted-foreground">
            {item.summary || item.description}
          </P>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Small className="text-muted-foreground text-xs">
              +{item.tags.length - 3} more
            </Small>
          )}
        </div>
      </AccordionCard.Summary>
      
      <AccordionCard.Details>
        <div className="space-y-4">
          {/* Full Description */}
          <div>
            <H3 className="text-sm font-semibold mb-2">Description</H3>
            <P className="text-sm text-muted-foreground">
              {item.description}
            </P>
          </div>

          {/* Prerequisites */}
          {originalNode?.prerequisites && originalNode.prerequisites.length > 0 && (
            <div>
              <H3 className="text-sm font-semibold mb-2">Prerequisites</H3>
              <div className="space-y-1">
                {originalNode.prerequisites.map((prereq, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {prereq}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          {originalNode?.connections && originalNode.connections.length > 0 && (
            <div>
              <H3 className="text-sm font-semibold mb-2">Connections</H3>
              <div className="space-y-1">
                {originalNode.connections.map((connection, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {connection}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effects */}
          {item.effects && item.effects.length > 0 && (
            <div>
              <H3 className="text-sm font-semibold mb-2">Effects</H3>
              <div className="space-y-2">
                {item.effects.map((effect, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border ${
                      effect.type === 'positive'
                        ? 'border-green-200 bg-green-50'
                        : effect.type === 'negative'
                          ? 'border-red-200 bg-red-50'
                          : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          effect.type === 'positive'
                            ? 'bg-green-500'
                            : effect.type === 'negative'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                        }`}
                      />
                      <span className="text-sm font-medium">{effect.name}</span>
                    </div>
                    {effect.description && (
                      <P className="text-xs text-muted-foreground mt-1">
                        {effect.description}
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
              <H3 className="text-sm font-semibold mb-2">Tags</H3>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionCard.Details>
    </AccordionCard>
  )
} 