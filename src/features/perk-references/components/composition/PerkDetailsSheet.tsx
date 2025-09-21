import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import { useMemo } from 'react'
import { usePerkReferencesData } from '../../adapters/usePerkReferencesData'
import type { PerkReferenceNode } from '../../types'
import { PerkReferenceBadge } from '../atomic/PerkReferenceBadge'
import { SkillAvatar } from '@/features/skills/components/atomic/SkillAvatar'

interface PerkDetailsSheetProps {
  perk: PerkReferenceNode | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function PerkDetailsSheet({
  perk,
  isOpen,
  onOpenChange,
}: PerkDetailsSheetProps) {
  const { allPerks } = usePerkReferencesData()

  // Create a lookup map from EDID to perk name
  const perkLookup = useMemo(() => {
    const lookup = new Map<string, string>()
    allPerks.forEach(perk => {
      lookup.set(perk.edid, perk.name)
    })
    return lookup
  }, [allPerks])

  // Convert prerequisite EDIDs to perk names
  const prerequisiteNames = useMemo(() => {
    if (!perk?.prerequisites) return []
    return perk.prerequisites.map(edid => perkLookup.get(edid) || edid)
  }, [perk?.prerequisites, perkLookup])

  if (!perk) return null

  return (
    <ResponsivePanel open={isOpen} onOpenChange={onOpenChange} side="right">
      <div className="p-6">
        <div className="mb-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-4">
            <SkillAvatar
              skillName={perk.skillTreeName}
              size="2xl"
              className="flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{perk.name}</h2>
              <div className="flex items-center gap-2">
                <PerkReferenceBadge
                  label={perk.skillTreeName}
                  type="skill"
                  size="sm"
                />
                {perk.totalRanks > 1 && (
                  <PerkReferenceBadge
                    label={`${perk.totalRanks} ranks`}
                    type="rank"
                    size="sm"
                  />
                )}
                {perk.minLevel && (
                  <PerkReferenceBadge
                    label={`Level ${perk.minLevel}+`}
                    type="level"
                    size="sm"
                  />
                )}
                <AddToBuildSwitchSimple
                  itemId={perk.edid}
                  itemType="perk"
                  itemName={perk.name}
                />
              </div>
            </div>
          </div>
          
          {/* Description Section */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {perk.ranks[0]?.description?.base ||
                'No description available.'}
            </p>
            {/* Subtext as secondary section */}
            {perk.ranks[0]?.description?.subtext && (
              <p className="text-sm text-muted-foreground/80 italic border-l-2 border-muted pl-3 leading-relaxed">
                {perk.ranks[0].description.subtext}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Prerequisites */}
          {prerequisiteNames.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Prerequisites</H3>
              <ol className="list-decimal list-inside space-y-1">
                {prerequisiteNames.map((prereqName, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {prereqName}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Perk Ranks */}
          {perk.ranks && perk.ranks.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Perk Ranks</H3>
              <div className="space-y-3">
                {perk.ranks.map((rank, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        Rank {index + 1}
                      </span>
                      {rank.prerequisites?.skillLevel?.level && (
                        <Badge variant="outline" className="text-xs">
                          Level {rank.prerequisites.skillLevel.level}
                        </Badge>
                      )}
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

          {/* Tags */}
          {perk.tags && perk.tags.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Tags</H3>
              <div className="flex flex-wrap gap-2">
                {perk.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </ResponsivePanel>
  )
}
