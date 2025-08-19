import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import type { PerkReferenceNode } from '../../types'
import { PerkReferenceBadge } from '../atomic/PerkReferenceBadge'

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
  if (!perk) return null

  return (
    <ResponsivePanel open={isOpen} onOpenChange={onOpenChange} side="right">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-muted-foreground">
                {perk.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{perk.name}</h2>
              <div className="flex items-center gap-2 mb-2">
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {perk.ranks[0]?.description?.base ||
                  'No description available.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Prerequisites */}
          {perk.prerequisites && perk.prerequisites.length > 0 && (
            <div>
              <H3 className="text-lg font-semibold mb-3">Prerequisites</H3>
              <div className="flex flex-wrap gap-2">
                {perk.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {prereq}
                  </Badge>
                ))}
              </div>
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

          {/* Additional Info */}
          <div>
            <H3 className="text-lg font-semibold mb-3">Additional Info</H3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Skill Tree:</span>
                <span className="font-medium">{perk.skillTreeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Ranks:</span>
                <span className="font-medium">{perk.totalRanks}</span>
              </div>
              {perk.isRoot && (
                <div className="flex items-center justify-between">
                  <span>Type:</span>
                  <Badge variant="secondary" className="text-xs">
                    Root Perk
                  </Badge>
                </div>
              )}
              {perk.hasChildren && (
                <div className="flex items-center justify-between">
                  <span>Has Children:</span>
                  <span className="font-medium">Yes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
}
