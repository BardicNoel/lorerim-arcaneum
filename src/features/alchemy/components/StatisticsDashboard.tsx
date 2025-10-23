import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import {
  BookOpen,
  Clock,
  FlaskConical,
  Package,
  Star,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'
import type { AlchemyStatistics } from '../types'

interface StatisticsDashboardProps {
  statistics: AlchemyStatistics
  className?: string
}

export function StatisticsDashboard({
  statistics,
  className,
}: StatisticsDashboardProps) {
  const {
    totalIngredients,
    ingredientsByEffectType,
    ingredientsByPlugin,
    ingredientsByRarity,
    ingredientsBySkill,
    averageMagnitude,
    averageDuration,
    averageBaseCost,
    averageValue,
    averageWeight,
    topEffects,
    topSkills,
    topPlugins,
  } = statistics

  const statCards = [
    {
      title: 'Total Ingredients',
      value: totalIngredients,
      icon: FlaskConical,
      description: 'All available ingredients',
      color: 'text-blue-600',
    },
    {
      title: 'Avg Magnitude',
      value: averageMagnitude.toFixed(1),
      icon: Zap,
      description: 'Effect strength',
      color: 'text-yellow-600',
    },
    {
      title: 'Avg Duration',
      value: `${averageDuration.toFixed(1)}s`,
      icon: Clock,
      description: 'Effect duration',
      color: 'text-green-600',
    },
    {
      title: 'Avg Value',
      value: averageValue.toFixed(0),
      icon: Star,
      description: 'Gold value',
      color: 'text-purple-600',
    },
    {
      title: 'Avg Weight',
      value: `${averageWeight.toFixed(1)}`,
      icon: Target,
      description: 'Carry weight',
      color: 'text-orange-600',
    },
    {
      title: 'Avg Base Cost',
      value: averageBaseCost.toFixed(0),
      icon: TrendingUp,
      description: 'Magicka cost',
      color: 'text-red-600',
    },
  ]

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Effect Types and Plugins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Effect Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Effect Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ingredientsByEffectType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([effectType, count]) => (
                  <div
                    key={effectType}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{effectType}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              {Object.keys(ingredientsByEffectType).length > 8 && (
                <div className="text-xs text-muted-foreground pt-2">
                  +{Object.keys(ingredientsByEffectType).length - 8} more effect
                  types
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plugins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Plugin Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ingredientsByPlugin)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([plugin, count]) => (
                  <div
                    key={plugin}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{plugin}</span>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              {Object.keys(ingredientsByPlugin).length > 8 && (
                <div className="text-xs text-muted-foreground pt-2">
                  +{Object.keys(ingredientsByPlugin).length - 8} more plugins
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rarities and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rarities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ingredient Rarities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ingredientsByRarity)
                .sort(([, a], [, b]) => b - a)
                .map(([rarity, count]) => (
                  <div
                    key={rarity}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{rarity}</span>
                    <Badge
                      variant={
                        rarity === 'Common'
                          ? 'default'
                          : rarity === 'Uncommon'
                            ? 'secondary'
                            : rarity === 'Rare'
                              ? 'outline'
                              : rarity === 'Epic'
                                ? 'destructive'
                                : 'secondary'
                      }
                      className="text-xs"
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Associated Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(ingredientsBySkill)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([skill, count]) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{skill}</span>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              {Object.keys(ingredientsBySkill).length > 8 && (
                <div className="text-xs text-muted-foreground pt-2">
                  +{Object.keys(ingredientsBySkill).length - 8} more skills
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Effects and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Most Common Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topEffects.slice(0, 8).map((effect, index) => (
                <div
                  key={effect.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{effect.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {effect.count} ingredients
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Most Common Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topSkills.slice(0, 8).map((skill, index) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{skill.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {skill.count} ingredients
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
