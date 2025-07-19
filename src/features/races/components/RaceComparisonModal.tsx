import React from 'react'
import { X, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { StatBar } from './StatBar'
import { CategoryBadge } from './CategoryBadge'
import type { Race } from '../types'

interface RaceComparisonModalProps {
  races: Race[]
  isOpen: boolean
  onClose: () => void
}

export function RaceComparisonModal({
  races,
  isOpen,
  onClose,
}: RaceComparisonModalProps) {
  if (!isOpen || races.length === 0) return null

  const maxHealth = Math.max(...races.map(r => r.startingStats.health))
  const maxMagicka = Math.max(...races.map(r => r.startingStats.magicka))
  const maxStamina = Math.max(...races.map(r => r.startingStats.stamina))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b">
          <H3 className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Race Comparison ({races.length} races)
          </H3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {races.map(race => (
              <Card key={race.edid} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <H4 className="text-lg">{race.name}</H4>
                    <CategoryBadge category={race.category} size="sm" />
                  </div>
                  <P className="text-sm text-muted-foreground line-clamp-2">
                    {race.description}
                  </P>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Starting Stats */}
                  <div>
                    <H4 className="text-sm font-medium mb-2">
                      Starting Attributes
                    </H4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12">Health:</span>
                        <StatBar
                          value={race.startingStats.health}
                          maxValue={maxHealth}
                          label={`${race.startingStats.health}`}
                          color="red"
                          size="sm"
                        />
                        {race.startingStats.health === maxHealth && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12">Magicka:</span>
                        <StatBar
                          value={race.startingStats.magicka}
                          maxValue={maxMagicka}
                          label={`${race.startingStats.magicka}`}
                          color="blue"
                          size="sm"
                        />
                        {race.startingStats.magicka === maxMagicka && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12">Stamina:</span>
                        <StatBar
                          value={race.startingStats.stamina}
                          maxValue={maxStamina}
                          label={`${race.startingStats.stamina}`}
                          color="green"
                          size="sm"
                        />
                        {race.startingStats.stamina === maxStamina && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Skills */}
                  <div>
                    <H4 className="text-sm font-medium mb-2">Top Skills</H4>
                    <div className="flex flex-wrap gap-1">
                      {race.skillBonuses
                        .sort((a, b) => b.bonus - a.bonus)
                        .slice(0, 3)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {skill.skill} +{skill.bonus}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Key Abilities */}
                  <div>
                    <H4 className="text-sm font-medium mb-2">Key Abilities</H4>
                    <div className="space-y-1">
                      {race.racialSpells.slice(0, 2).map((spell, index) => (
                        <div key={index} className="text-xs">
                          <span className="font-medium">{spell.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical Attributes */}
                  <div>
                    <H4 className="text-sm font-medium mb-2">Physical</H4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <div>{race.physicalAttributes.size}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Height:</span>
                        <div>
                          {(race.physicalAttributes.heightMale * 100).toFixed(
                            0
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  )
}
