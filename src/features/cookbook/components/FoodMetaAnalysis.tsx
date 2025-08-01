import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecipeWithComputed } from '../types'

interface EffectMeta {
  name: string
  count: number
  averageMagnitude: number
  averageDuration: number
  totalMagnitude: number
  totalDuration: number
  recipes: string[]
}

interface FoodMetaAnalysisProps {
  recipes: RecipeWithComputed[]
  className?: string
}

export function FoodMetaAnalysis({ recipes, className }: FoodMetaAnalysisProps) {
  // Calculate effect meta data
  const effectMeta = React.useMemo(() => {
    const effectMap = new Map<string, EffectMeta>()

    recipes.forEach(recipe => {
      recipe.effects.forEach(effect => {
        const effectName = effect.name || 'Unknown Effect'
        const magnitude = effect.magnitude || 0
        const duration = effect.duration || 0

        if (!effectMap.has(effectName)) {
          effectMap.set(effectName, {
            name: effectName,
            count: 0,
            averageMagnitude: 0,
            averageDuration: 0,
            totalMagnitude: 0,
            totalDuration: 0,
            recipes: []
          })
        }

        const meta = effectMap.get(effectName)!
        meta.count++
        meta.totalMagnitude += magnitude
        meta.totalDuration += duration
        if (!meta.recipes.includes(recipe.name)) {
          meta.recipes.push(recipe.name)
        }
      })
    })

    // Calculate averages
    effectMap.forEach(meta => {
      meta.averageMagnitude = meta.totalMagnitude / meta.count
      meta.averageDuration = meta.totalDuration / meta.count
    })

    return Array.from(effectMap.values()).sort((a, b) => b.count - a.count)
  }, [recipes])

  // Calculate global averages for comparison
  const globalAverages = React.useMemo(() => {
    if (effectMeta.length === 0) return { magnitude: 0, duration: 0 }

    const totalMagnitude = effectMeta.reduce((sum, effect) => sum + effect.averageMagnitude, 0)
    const totalDuration = effectMeta.reduce((sum, effect) => sum + effect.averageDuration, 0)

    return {
      magnitude: totalMagnitude / effectMeta.length,
      duration: totalDuration / effectMeta.length
    }
  }, [effectMeta])

  const getDifferentialColor = (value: number, average: number) => {
    const diff = value - average
    const percentage = (diff / average) * 100

    if (percentage > 20) return 'text-green-600'
    if (percentage > 10) return 'text-green-500'
    if (percentage < -20) return 'text-red-600'
    if (percentage < -10) return 'text-red-500'
    return 'text-muted-foreground'
  }

  const getDifferentialIcon = (value: number, average: number) => {
    const diff = value - average
    const percentage = (diff / average) * 100

    if (percentage > 10) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (percentage < -10) return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const formatDifferential = (value: number, average: number) => {
    const diff = value - average
    const percentage = (diff / average) * 100
    const sign = diff >= 0 ? '+' : ''
    return `${sign}${diff.toFixed(1)} (${sign}${percentage.toFixed(1)}%)`
  }

  if (effectMeta.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Food Effect Meta Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No effects found to analyze.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Food Effect Meta Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Analysis of {effectMeta.length} unique effects across {recipes.length} recipes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Global Averages Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{globalAverages.magnitude.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Magnitude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{globalAverages.duration.toFixed(1)}s</div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </div>
          </div>

          {/* Effects List */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Effect Analysis</h3>
            {effectMeta.slice(0, 10).map((effect) => (
              <div
                key={effect.name}
                className="p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">{effect.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {effect.count} recipes
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Magnitude:</span>
                      <span className="font-medium">{effect.averageMagnitude.toFixed(1)}</span>
                      {getDifferentialIcon(effect.averageMagnitude, globalAverages.magnitude)}
                    </div>
                    <div className={cn(
                      "text-xs",
                      getDifferentialColor(effect.averageMagnitude, globalAverages.magnitude)
                    )}>
                      {formatDifferential(effect.averageMagnitude, globalAverages.magnitude)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{effect.averageDuration.toFixed(1)}s</span>
                      {getDifferentialIcon(effect.averageDuration, globalAverages.duration)}
                    </div>
                    <div className={cn(
                      "text-xs",
                      getDifferentialColor(effect.averageDuration, globalAverages.duration)
                    )}>
                      {formatDifferential(effect.averageDuration, globalAverages.duration)}
                    </div>
                  </div>
                </div>

                {effect.recipes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Found in: {effect.recipes.slice(0, 3).join(', ')}
                      {effect.recipes.length > 3 && ` +${effect.recipes.length - 3} more`}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {effectMeta.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing top 10 effects of {effectMeta.length} total
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Above average (+10%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span>Below average (-10%+)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 