import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P } from '@/shared/ui/ui/typography'
import type { PerkReferenceItem } from '../../types'

interface PerkReferenceStatsProps {
  items: PerkReferenceItem[]
  className?: string
}

export function PerkReferenceStats({
  items,
  className,
}: PerkReferenceStatsProps) {
  // Calculate statistics
  const totalPerks = items.length
  const skillTrees = new Set(items.map(item => item.originalNode?.skillId).filter(Boolean)).size
  const multiRankPerks = items.filter(item => 
    item.originalNode?.ranks && item.originalNode.ranks.length > 1
  ).length
  const singleRankPerks = items.filter(item => 
    item.originalNode?.ranks && item.originalNode.ranks.length === 1
  ).length
  const perksWithPrerequisites = items.filter(item => 
    item.originalNode?.prerequisites && item.originalNode.prerequisites.length > 0
  ).length

  const stats = [
    { label: 'Total Perks', value: totalPerks, color: 'bg-blue-100 text-blue-800' },
    { label: 'Skill Trees', value: skillTrees, color: 'bg-green-100 text-green-800' },
    { label: 'Multi-Rank', value: multiRankPerks, color: 'bg-purple-100 text-purple-800' },
    { label: 'Single-Rank', value: singleRankPerks, color: 'bg-orange-100 text-orange-800' },
    { label: 'With Prerequisites', value: perksWithPrerequisites, color: 'bg-red-100 text-red-800' },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Perk Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stat.color}`}>
                {stat.value}
              </div>
              <P className="text-xs text-muted-foreground mt-1">{stat.label}</P>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 