import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Eye, Flame, Ghost, Heart, Shield, Sparkles } from 'lucide-react'
import type { SpellWithComputed } from '../../types'

interface SpellAccordionCardProps {
  spell: SpellWithComputed
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  disableHover?: boolean
}

const schoolIcons = {
  Destruction: Flame,
  Restoration: Heart,
  Conjuration: Ghost,
  Illusion: Eye,
  Alteration: Shield,
  '': Sparkles,
}

const levelColors = {
  Novice: 'bg-green-100 text-green-800 border-green-200',
  Apprentice: 'bg-blue-100 text-blue-800 border-blue-200',
  Adept: 'bg-purple-100 text-purple-800 border-purple-200',
  Expert: 'bg-orange-100 text-orange-800 border-orange-200',
  Master: 'bg-red-100 text-red-800 border-red-200',
}

export function SpellAccordionCard({
  spell,
  className,
  isExpanded = false,
  onToggle,
  disableHover = false,
}: SpellAccordionCardProps) {
  const SchoolIcon =
    schoolIcons[spell.school as keyof typeof schoolIcons] || Sparkles

  const handleToggle = () => {
    onToggle?.()
  }

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={handleToggle}
      disableHover={disableHover}
    >
      <AccordionCard.Header>
        <div className="flex items-center gap-3">
          <SchoolIcon className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-primary font-semibold text-lg">{spell.name}</h3>
          <span className="ml-auto transition-transform duration-200 text-muted-foreground">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 8l4 4 4-4"
              />
            </svg>
          </span>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        <div className="px-4 py-2 space-y-3">
          <div className="flex items-center gap-4 text-base text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 7v14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                />
              </svg>
              <span>{spell.school}</span>
            </div>
            <Badge
              variant="secondary"
              className={
                levelColors[spell.level as keyof typeof levelColors] || ''
              }
            >
              {spell.level}
            </Badge>
          </div>
          <FormattedText
            text={spell.message}
            className="text-base text-muted-foreground mb-3"
            as="p"
          />
        </div>
      </AccordionCard.Summary>

      <AccordionCard.Details>
        <div className="px-4 pb-4 space-y-4">
          {/* Effects Section */}
          {spell.hasEffects && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Effects
              </h5>
              <div className="space-y-2">
                {spell.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="p-2 rounded bg-muted border text-sm"
                  >
                    <FormattedText
                      text={effect.description}
                      className="text-muted-foreground mb-2"
                      as="p"
                    />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {effect.magnitude > 0 && (
                        <span>Magnitude: {effect.magnitude}</span>
                      )}
                      {effect.duration > 0 && (
                        <span>Duration: {effect.duration}s</span>
                      )}
                      {effect.area > 0 && <span>Area: {effect.area}ft</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Section */}
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Statistics
            </h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Magicka Cost:</span>
                <span className="font-medium">{spell.magickaCost} MP</span>
              </div>
              {spell.totalMagnitude > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Total Magnitude:
                  </span>
                  <span className="font-medium">{spell.totalMagnitude}</span>
                </div>
              )}
              {spell.maxDuration > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Duration:</span>
                  <span className="font-medium">{spell.maxDuration}s</span>
                </div>
              )}
              {spell.maxArea > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Max Area:</span>
                  <span className="font-medium">{spell.maxArea}ft</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(spell.tome || spell.vendors?.length) && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Additional Info
              </h5>
              <div className="space-y-2 text-sm">
                {spell.tome && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tome:</span>
                    <span>{spell.tome}</span>
                  </div>
                )}
                {spell.vendors && spell.vendors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Vendors:</span>
                    <span>{spell.vendors.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {spell.tags && spell.tags.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">Tags</h5>
              <div className="flex flex-wrap gap-2">
                {spell.tags.map((tag, index) => (
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
