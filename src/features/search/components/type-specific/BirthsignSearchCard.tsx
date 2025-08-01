import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface BirthsignSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | 'masonry'
}

export function BirthsignSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: BirthsignSearchCardProps) {
  const birthsigns = useBirthsignsStore(state => state.data)

  // Find the full birthsign record from the store
  const fullBirthsign = findItemInStore(birthsigns, item.originalData)

  if (!fullBirthsign) {
    // Log error for debugging but don't show a card
    console.error('Birthsign not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalBirthsignsInStore: birthsigns.length,
      firstFewBirthsigns: birthsigns.slice(0, 3).map(birthsign => ({
        id: birthsign.id,
        name: birthsign.name,
      })),
    })
    return null
  }

  return (
    <AccordionCard
      className={className}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <AccordionCard.Header>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-muted-foreground">
              {fullBirthsign.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">{fullBirthsign.name}</h3>
            {fullBirthsign.group && (
              <span className="text-sm text-muted-foreground">
                {fullBirthsign.group}
              </span>
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        {fullBirthsign.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {fullBirthsign.description}
          </p>
        )}

        {/* Stat modifications preview */}
        {fullBirthsign.stat_modifications &&
          fullBirthsign.stat_modifications.length > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              <span className="font-medium">Stat bonuses:</span>{' '}
              {fullBirthsign.stat_modifications
                .slice(0, 2)
                .map(stat => `${stat.stat} +${stat.value}`)
                .join(', ')}
              {fullBirthsign.stat_modifications.length > 2 && '...'}
            </div>
          )}
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {/* Stat modifications */}
        {fullBirthsign.stat_modifications &&
          fullBirthsign.stat_modifications.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">
                Stat Bonuses
              </h5>
              <div className="flex flex-wrap gap-1">
                {fullBirthsign.stat_modifications.map((stat, idx) => (
                  <span
                    key={`${stat.stat}-${idx}`}
                    className="inline-block px-2 py-1 text-xs bg-muted rounded"
                  >
                    {stat.stat} +{stat.value}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Skill bonuses */}
        {fullBirthsign.skill_bonuses &&
          fullBirthsign.skill_bonuses.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">
                Skill Bonuses
              </h5>
              <div className="flex flex-wrap gap-1">
                {fullBirthsign.skill_bonuses.map((skill, idx) => (
                  <span
                    key={`${skill.stat}-${idx}`}
                    className="inline-block px-2 py-1 text-xs bg-muted rounded"
                  >
                    {skill.stat} +{skill.value}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Powers */}
        {fullBirthsign.powers && fullBirthsign.powers.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Powers</h5>
            <div className="flex flex-wrap gap-1">
              {fullBirthsign.powers.map((power, idx) => (
                <span
                  key={`${power.name}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-muted rounded"
                >
                  {power.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {fullBirthsign.tags && fullBirthsign.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {fullBirthsign.tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
