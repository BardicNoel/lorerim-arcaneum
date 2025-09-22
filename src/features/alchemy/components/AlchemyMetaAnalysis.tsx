import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { FlaskConical, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import type { AlchemyIngredientWithComputed } from '../types'

interface EffectMeta {
  name: string
  count: number
  averageMagnitude: number
  averageDuration: number
  averageBaseCost: number
  totalMagnitude: number
  totalDuration: number
  totalBaseCost: number
  ingredients: string[]
}

interface AlchemyMetaAnalysisProps {
  ingredients: AlchemyIngredientWithComputed[]
  className?: string
}

export function AlchemyMetaAnalysis({
  ingredients,
  className,
}: AlchemyMetaAnalysisProps) {
  // Calculate effect meta data
  const effectMeta = React.useMemo(() => {
    const effectMap = new Map<string, EffectMeta>()

    ingredients.forEach(ingredient => {
      ingredient.effects.forEach(effect => {
        const effectName = effect.mgefName || 'Unknown Effect'
        const magnitude = effect.magnitude || 0
        const duration = effect.duration || 0
        const baseCost = effect.baseCost || 0

        if (!effectMap.has(effectName)) {
          effectMap.set(effectName, {
            name: effectName,
            count: 0,
            averageMagnitude: 0,
            averageDuration: 0,
            averageBaseCost: 0,
            totalMagnitude: 0,
            totalDuration: 0,
            totalBaseCost: 0,
            ingredients: [],
          })
        }

        const meta = effectMap.get(effectName)!
        meta.count++
        meta.totalMagnitude += magnitude
        meta.totalDuration += duration
        meta.totalBaseCost += baseCost
        if (!meta.ingredients.includes(ingredient.name)) {
          meta.ingredients.push(ingredient.name)
        }
      })
    })

    // Calculate averages
    effectMap.forEach(meta => {
      meta.averageMagnitude = meta.totalMagnitude / meta.count
      meta.averageDuration = meta.totalDuration / meta.count
      meta.averageBaseCost = meta.totalBaseCost / meta.count
    })

    return Array.from(effectMap.values()).sort((a, b) => b.count - a.count)
  }, [ingredients])

  // Calculate global averages for comparison
  const globalAverages = React.useMemo(() => {
    if (effectMeta.length === 0)
      return { magnitude: 0, duration: 0, baseCost: 0 }

    const totalMagnitude = effectMeta.reduce(
      (sum, effect) => sum + effect.averageMagnitude,
      0
    )
    const totalDuration = effectMeta.reduce(
      (sum, effect) => sum + effect.averageDuration,
      0
    )
    const totalBaseCost = effectMeta.reduce(
      (sum, effect) => sum + effect.averageBaseCost,
      0
    )

    return {
      magnitude: totalMagnitude / effectMeta.length,
      duration: totalDuration / effectMeta.length,
      baseCost: totalBaseCost / effectMeta.length,
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

    if (percentage > 10)
      return <TrendingUp className="h-4 w-4 text-green-500" />
    if (percentage < -10)
      return <TrendingDown className="h-4 w-4 text-red-500" />
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
          <CardTitle className="text-lg">
            Alchemy Effect Meta Analysis
          </CardTitle>
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
        <CardTitle className="text-lg">Alchemy Effect Meta Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Analysis of {effectMeta.length} unique effects across{' '}
          {ingredients.length} ingredients
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Global Averages Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {globalAverages.magnitude.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Magnitude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {globalAverages.duration.toFixed(1)}s
              </div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {globalAverages.baseCost.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Base Cost</div>
            </div>
          </div>

          {/* Effects List */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Effect Analysis</h3>
            {effectMeta.slice(0, 10).map(effect => (
              <div
                key={effect.name}
                className="p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{effect.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {effect.count} ingredients
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Magnitude:</span>
                      <span className="font-medium">
                        {effect.averageMagnitude.toFixed(1)}
                      </span>
                      {getDifferentialIcon(
                        effect.averageMagnitude,
                        globalAverages.magnitude
                      )}
                    </div>
                    <div
                      className={cn(
                        'text-xs',
                        getDifferentialColor(
                          effect.averageMagnitude,
                          globalAverages.magnitude
                        )
                      )}
                    >
                      {formatDifferential(
                        effect.averageMagnitude,
                        globalAverages.magnitude
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {effect.averageDuration.toFixed(1)}s
                      </span>
                      {getDifferentialIcon(
                        effect.averageDuration,
                        globalAverages.duration
                      )}
                    </div>
                    <div
                      className={cn(
                        'text-xs',
                        getDifferentialColor(
                          effect.averageDuration,
                          globalAverages.duration
                        )
                      )}
                    >
                      {formatDifferential(
                        effect.averageDuration,
                        globalAverages.duration
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">Base Cost:</span>
                      <span className="font-medium">
                        {effect.averageBaseCost.toFixed(0)}
                      </span>
                      {getDifferentialIcon(
                        effect.averageBaseCost,
                        globalAverages.baseCost
                      )}
                    </div>
                    <div
                      className={cn(
                        'text-xs',
                        getDifferentialColor(
                          effect.averageBaseCost,
                          globalAverages.baseCost
                        )
                      )}
                    >
                      {formatDifferential(
                        effect.averageBaseCost,
                        globalAverages.baseCost
                      )}
                    </div>
                  </div>
                </div>

                {effect.ingredients.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-1">
                      Found in: {effect.ingredients.slice(0, 3).join(', ')}
                      {effect.ingredients.length > 3 &&
                        ` +${effect.ingredients.length - 3} more`}
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
