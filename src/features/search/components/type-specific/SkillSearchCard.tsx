import { AccordionCard } from '@/shared/components/generic/AccordionCard'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface SkillSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list' | 'masonry'
}

export function SkillSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: SkillSearchCardProps) {
  const skills = useSkillsStore(state => state.data)

  // Find the full skill record from the store
  const fullSkill = findItemInStore(skills, item.originalData)

  if (!fullSkill) {
    // Log error for debugging but don't show a card
    console.error('Skill not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalSkillsInStore: skills.length,
      firstFewSkills: skills.slice(0, 3).map(skill => ({
        id: skill.id,
        name: skill.name,
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
              {fullSkill.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary">{fullSkill.name}</h3>
            {fullSkill.category && (
              <span className="text-sm text-muted-foreground">
                {fullSkill.category}
              </span>
            )}
          </div>
        </div>
      </AccordionCard.Header>

      <AccordionCard.Summary>
        {fullSkill.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {fullSkill.description}
          </p>
        )}

        {fullSkill.keyAbilities && fullSkill.keyAbilities.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            <span className="font-medium">Key abilities:</span>{' '}
            {fullSkill.keyAbilities.slice(0, 2).join(', ')}
            {fullSkill.keyAbilities.length > 2 && '...'}
          </div>
        )}
      </AccordionCard.Summary>

      <AccordionCard.Details>
        {fullSkill.tags && fullSkill.tags.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {fullSkill.tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="inline-block px-2 py-1 text-xs bg-muted rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {fullSkill.keyAbilities && fullSkill.keyAbilities.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">
              Key Abilities
            </h5>
            <div className="space-y-1">
              {fullSkill.keyAbilities.map((ability, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  • {ability}
                </div>
              ))}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
