import {
  Crosshair,
  Hand,
  Heart,
  Move,
  Package,
  Shield,
  Sword,
  Zap,
} from 'lucide-react'
import type { DerivedStat } from '../types'

interface DerivedStatsTableProps {
  stats: DerivedStat[]
}

const statIcons: Record<string, React.ComponentType> = {
  magicResist: Shield,
  magickaRegen: Zap,
  diseaseResist: Heart,
  poisonResist: Shield,
  staminaRegen: Zap,
  moveSpeed: Move,
  carryWeight: Package,
  rangedDamage: Crosshair,
  oneHandDamage: Sword,
  twoHandDamage: Sword,
  unarmedDamage: Hand,
}

const categoryOrder = ['combat', 'survival', 'movement', 'magic'] as const
const categoryLabels: Record<string, string> = {
  combat: 'Combat',
  survival: 'Survival',
  movement: 'Movement',
  magic: 'Magic',
}

export function DerivedStatsTable({ stats }: DerivedStatsTableProps) {
  // Group stats by category
  const statsByCategory = stats.reduce(
    (acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = []
      }
      acc[stat.category].push(stat)
      return acc
    },
    {} as Record<string, DerivedStat[]>
  )

  const formatValue = (stat: DerivedStat) => {
    if (stat.value === 0) {
      return `+0${stat.isPercentage ? '%' : ''}`
    }
    return `+${stat.value}${stat.isPercentage ? '%' : ''}`
  }

  return (
    <div className="space-y-4">
      {categoryOrder.map(category => {
        const categoryStats = statsByCategory[category]
        if (!categoryStats?.length) return null

        return (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {categoryLabels[category]}
            </h4>
            <div className="space-y-1">
              {categoryStats.map(stat => {
                const Icon =
                  statIcons[stat.name.toLowerCase().replace(/\s+/g, '')] ||
                  Shield
                const value = formatValue(stat)

                return (
                  <div
                    key={stat.name}
                    className="flex items-center justify-between p-3 bg-background border rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{stat.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">{value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
