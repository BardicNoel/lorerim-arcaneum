import React from 'react'
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { Race } from '../types'

interface RaceStatsSummaryProps {
  races: Race[]
}

export function RaceStatsSummary({ races }: RaceStatsSummaryProps) {
  if (races.length === 0) return null

  // Calculate statistics
  const stats = {
    health: {
      max: Math.max(...races.map(r => r.startingStats.health)),
      min: Math.min(...races.map(r => r.startingStats.health)),
      avg: Math.round(
        races.reduce((sum, r) => sum + r.startingStats.health, 0) / races.length
      ),
    },
    magicka: {
      max: Math.max(...races.map(r => r.startingStats.magicka)),
      min: Math.min(...races.map(r => r.startingStats.magicka)),
      avg: Math.round(
        races.reduce((sum, r) => sum + r.startingStats.magicka, 0) /
          races.length
      ),
    },
    stamina: {
      max: Math.max(...races.map(r => r.startingStats.stamina)),
      min: Math.min(...races.map(r => r.startingStats.stamina)),
      avg: Math.round(
        races.reduce((sum, r) => sum + r.startingStats.stamina, 0) /
          races.length
      ),
    },
  }

  // Find races with best stats
  const bestHealth = races.find(
    r => r.startingStats.health === stats.health.max
  )
  const bestMagicka = races.find(
    r => r.startingStats.magicka === stats.magicka.max
  )
  const bestStamina = races.find(
    r => r.startingStats.stamina === stats.stamina.max
  )

  // Count categories
  const categoryCounts = races.reduce(
    (acc, race) => {
      acc[race.category] = (acc[race.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-3">
        <H4 className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Race Statistics Summary
        </H4>
        <P className="text-sm text-muted-foreground">
          Overview of {races.length} races across{' '}
          {Object.keys(categoryCounts).length} categories
        </P>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Distribution */}
        <div>
          <Small className="font-medium mb-2 block">Categories:</Small>
          <div className="flex gap-2">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <span
                key={category}
                className="px-2 py-1 bg-background rounded text-xs"
              >
                {category}: {count}
              </span>
            ))}
          </div>
        </div>

        {/* Stat Ranges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Small className="font-medium flex items-center gap-1">
              <Target className="h-3 w-3 text-red-500" />
              Health Range
            </Small>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Max: {stats.health.max}</span>
                <span className="text-green-600">{bestHealth?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Min: {stats.health.min}</span>
                <span className="text-red-600">
                  {
                    races.find(r => r.startingStats.health === stats.health.min)
                      ?.name
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg: {stats.health.avg}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Small className="font-medium flex items-center gap-1">
              <Target className="h-3 w-3 text-blue-500" />
              Magicka Range
            </Small>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Max: {stats.magicka.max}</span>
                <span className="text-green-600">{bestMagicka?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Min: {stats.magicka.min}</span>
                <span className="text-red-600">
                  {
                    races.find(
                      r => r.startingStats.magicka === stats.magicka.min
                    )?.name
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg: {stats.magicka.avg}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Small className="font-medium flex items-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              Stamina Range
            </Small>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Max: {stats.stamina.max}</span>
                <span className="text-green-600">{bestStamina?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Min: {stats.stamina.min}</span>
                <span className="text-red-600">
                  {
                    races.find(
                      r => r.startingStats.stamina === stats.stamina.min
                    )?.name
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg: {stats.stamina.avg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Performers */}
        <div>
          <Small className="font-medium mb-2 block">Top Performers:</Small>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Best Health:</span>
              <span className="font-medium">{bestHealth?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Best Magicka:</span>
              <span className="font-medium">{bestMagicka?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Best Stamina:</span>
              <span className="font-medium">{bestStamina?.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
