import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface BirthsignSearchCardProps {
  item: SearchableItem
  className?: string
}

export function BirthsignSearchCard({
  item,
  className,
}: BirthsignSearchCardProps) {
  const birthsigns = useBirthsignsStore(state => state.data)

  // Find the full birthsign record from the store
  const fullBirthsign = findItemInStore(birthsigns, item.originalData)

  if (!fullBirthsign) {
    // Fallback to default card if birthsign not found
    return (
      <div className={`p-4 border rounded-lg bg-muted ${className}`}>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Birthsign not found in store
        </p>
      </div>
    )
  }

  // Render a birthsign card for search results
  return (
    <div
      className={`p-4 border rounded-lg bg-card shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight text-foreground">
              {fullBirthsign.name}
            </h3>
            {fullBirthsign.description && (
              <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">
                {fullBirthsign.description}
              </p>
            )}
          </div>
          {fullBirthsign.group && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {fullBirthsign.group}
            </span>
          )}
        </div>

        {/* Stat modifications */}
        {fullBirthsign.stat_modifications &&
          fullBirthsign.stat_modifications.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Stat bonuses:
              </div>
              <div className="flex flex-wrap gap-1">
                {fullBirthsign.stat_modifications
                  .slice(0, 3)
                  .map((stat, idx) => (
                    <span
                      key={`${stat.stat}-${idx}`}
                      className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded"
                    >
                      {stat.stat} +{stat.value}
                    </span>
                  ))}
                {fullBirthsign.stat_modifications.length > 3 && (
                  <span className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded">
                    +{fullBirthsign.stat_modifications.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Skill bonuses */}
        {fullBirthsign.skill_bonuses &&
          fullBirthsign.skill_bonuses.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                Skill bonuses:
              </div>
              <div className="flex flex-wrap gap-1">
                {fullBirthsign.skill_bonuses.slice(0, 3).map((skill, idx) => (
                  <span
                    key={`${skill.stat}-${idx}`}
                    className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded"
                  >
                    {skill.stat} +{skill.value}
                  </span>
                ))}
                {fullBirthsign.skill_bonuses.length > 3 && (
                  <span className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded">
                    +{fullBirthsign.skill_bonuses.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Powers */}
        {fullBirthsign.powers && fullBirthsign.powers.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Powers:
            </div>
            <div className="flex flex-wrap gap-1">
              {fullBirthsign.powers.slice(0, 2).map((power, idx) => (
                <span
                  key={`${power.name}-${idx}`}
                  className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded"
                >
                  {power.name}
                </span>
              ))}
              {fullBirthsign.powers.length > 2 && (
                <span className="inline-block px-1.5 py-0.5 text-xs bg-muted rounded">
                  +{fullBirthsign.powers.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {fullBirthsign.tags && fullBirthsign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {fullBirthsign.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="inline-block px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded"
              >
                {tag}
              </span>
            ))}
            {fullBirthsign.tags.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 text-xs bg-secondary text-secondary-foreground rounded">
                +{fullBirthsign.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
