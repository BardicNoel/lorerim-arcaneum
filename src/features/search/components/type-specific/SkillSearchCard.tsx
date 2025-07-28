import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface SkillSearchCardProps {
  item: SearchableItem
  className?: string
}

export function SkillSearchCard({ item, className }: SkillSearchCardProps) {
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

  // Render a simplified skill card for search results
  return (
    <div
      className={`p-4 border rounded-lg bg-card shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-foreground">
              {fullSkill.name}
            </h3>
            {fullSkill.description && (
              <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                {fullSkill.description}
              </p>
            )}
          </div>
          {fullSkill.category && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {fullSkill.category}
            </span>
          )}
        </div>

        {fullSkill.keyAbilities && fullSkill.keyAbilities.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Key abilities:</span>{' '}
            {fullSkill.keyAbilities.slice(0, 2).join(', ')}
            {fullSkill.keyAbilities.length > 2 && '...'}
          </div>
        )}

        {fullSkill.tags && fullSkill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {fullSkill.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded"
              >
                {tag}
              </span>
            ))}
            {fullSkill.tags.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded">
                +{fullSkill.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
