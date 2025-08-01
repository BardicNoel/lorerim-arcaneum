import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { 
  ChefHat, 
  Utensils, 
  Wine, 
  TrendingUp, 
  Clock, 
  Target,
  Zap,
  BookOpen
} from 'lucide-react'
import type { RecipeStatistics } from '../types'

interface StatisticsDashboardProps {
  statistics: RecipeStatistics
  className?: string
}

export function StatisticsDashboard({
  statistics,
  className,
}: StatisticsDashboardProps) {
  const {
    totalRecipes,
    foodRecipes,
    alcoholRecipes,
    recipesByCategory: categories,
    recipesByDifficulty: difficulties,
    averageIngredientCount: averageIngredients,
    averageEffectCount: averageEffects,
    averageMagnitude,
    averageDuration,
    topEffects,
    topIngredients,
  } = statistics

  const statCards = [
    {
      title: 'Total Recipes',
      value: totalRecipes,
      icon: ChefHat,
      description: 'All available recipes',
      color: 'text-blue-600',
    },
    {
      title: 'Food Recipes',
      value: foodRecipes,
      icon: Utensils,
      description: 'Culinary recipes',
      color: 'text-green-600',
    },
    {
      title: 'Alcohol Recipes',
      value: alcoholRecipes,
      icon: Wine,
      description: 'Beverage recipes',
      color: 'text-purple-600',
    },
    {
      title: 'Avg Ingredients',
      value: averageIngredients.toFixed(1),
      icon: Target,
      description: 'Per recipe',
      color: 'text-orange-600',
    },
    {
      title: 'Avg Effects',
      value: averageEffects.toFixed(1),
      icon: Zap,
      description: 'Per recipe',
      color: 'text-yellow-600',
    },
    {
      title: 'Avg Magnitude',
      value: averageMagnitude.toFixed(1),
      icon: TrendingUp,
      description: 'Effect strength',
      color: 'text-red-600',
    },
  ]

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
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

      {/* Categories and Difficulties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Recipe Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categories)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              {Object.keys(categories).length > 8 && (
                <div className="text-xs text-muted-foreground pt-2">
                  +{Object.keys(categories).length - 8} more categories
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Difficulties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recipe Difficulties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(difficulties)
                .sort(([, a], [, b]) => b - a)
                .map(([difficulty, count]) => (
                  <div key={difficulty} className="flex items-center justify-between">
                    <span className="text-sm">{difficulty}</span>
                    <Badge 
                      variant={
                        difficulty === 'Simple' ? 'default' : 
                        difficulty === 'Moderate' ? 'secondary' : 'destructive'
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
      </div>

      {/* Top Effects and Ingredients */}
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
                <div key={effect.name} className="flex items-center justify-between">
                  <span className="text-sm">{effect.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {effect.count} recipes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Most Common Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topIngredients.slice(0, 8).map((ingredient, index) => (
                <div key={ingredient.name} className="flex items-center justify-between">
                  <span className="text-sm">{ingredient.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {ingredient.count} recipes
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