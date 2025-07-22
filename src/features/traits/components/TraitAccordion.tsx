import { cn } from '@/lib/utils'
import {
  AccordionCollapsedContentSlot,
  AccordionExpandedContentSlot,
  AccordionHeader,
  AccordionLeftControls,
  GenericAccordionCard,
} from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import { Heart, Shield, Star, Zap } from 'lucide-react'
import type { Trait } from '../types'
import { FormattedText } from '@/shared/components/generic/FormattedText'

interface TraitAccordionProps {
  item: PlayerCreationItem
  originalTrait?: Trait
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showToggle?: boolean
}

export function TraitAccordion({
  item,
  originalTrait,
  isExpanded = false,
  onToggle,
  className,
  showToggle = true,
}: TraitAccordionProps) {
  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Left Controls */}
      {showToggle && (
        <AccordionLeftControls>
          <AddToBuildSwitchSimple
            itemId={originalTrait?.edid || item.id}
            itemType="trait"
            itemName={item.name}
          />
        </AccordionLeftControls>
      )}

      {/* Header Content */}
      <AccordionHeader>
        {/* Left side: Name + Category */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <H3 className="text-primary font-semibold">{item.name}</H3>
          </div>
        </div>

        {/* Right side: Category + Effects */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Trait category tag */}
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
        <div className="flex items-center justify-between">
          <FormattedText
            text={item.description}
            className="text-base text-muted-foreground line-clamp-2"
          />
          <div className="flex items-center gap-2 ml-4">
            {item.tags &&
              item.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            {item.tags && item.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </AccordionCollapsedContentSlot>

      {/* Expanded Content */}
      <AccordionExpandedContentSlot>
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <FormattedText
              text={item.description}
              className="text-base text-muted-foreground"
            />
          </div>

          {/* Effects */}
          {originalTrait && originalTrait.effects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Effects</h4>
              <div className="space-y-2">
                {originalTrait.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-1 mt-0.5">
                      {effect.flags.includes('Detrimental') ? (
                        <Heart className="h-3 w-3 text-red-500" />
                      ) : (
                        <Shield className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{effect.type}</div>
                      {effect.value !== 0 && (
                        <div className="text-xs text-muted-foreground">
                          Value: {effect.value}
                        </div>
                      )}
                      {effect.condition && (
                        <div className="text-xs text-muted-foreground">
                          Condition: {effect.condition}
                        </div>
                      )}
                      {effect.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {effect.flags.map(flag => (
                            <Badge
                              key={flag}
                              variant="outline"
                              className="text-xs"
                            >
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Spell Information */}
          {originalTrait && originalTrait.spell && (
            <div>
              <h4 className="text-sm font-medium mb-2">Spell Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">Type</div>
                  <div className="text-muted-foreground">
                    {originalTrait.spell.type}
                  </div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">Cast Type</div>
                  <div className="text-muted-foreground">
                    {originalTrait.spell.castType}
                  </div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">Delivery</div>
                  <div className="text-muted-foreground">
                    {originalTrait.spell.delivery}
                  </div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="font-medium">Cost</div>
                  <div className="text-muted-foreground">
                    {originalTrait.spell.cost}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AccordionExpandedContentSlot>
    </GenericAccordionCard>
  )
}
