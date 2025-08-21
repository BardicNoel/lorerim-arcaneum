import React from 'react'
import { StatCard } from '../atomic/StatCard'
import { CategoryBreakdown } from './CategoryBreakdown'
import { TargetTypeChart } from './TargetTypeChart'
import { EffectsAnalysis } from './EffectsAnalysis'
import { ItemTypeDistribution } from './ItemTypeDistribution'
import { useEnchantmentStatistics, useChartData } from '../../../hooks/useEnchantmentStatistics'
import { 
  Sparkles, 
  Target, 
  Zap, 
  Package, 
  BarChart3, 
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatisticsDashboardProps {
  className?: string
}

export function StatisticsDashboard({ className }: StatisticsDashboardProps) {
  const statistics = useEnchantmentStatistics()
  const chartData = useChartData(statistics)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enchantment Statistics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights about enchantment data
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enchantments"
          value={statistics.totalEnchantments}
          description="All available enchantments"
          icon={<Sparkles className="h-4 w-4" />}
          variant="highlight"
        />
        <StatCard
          title="Unique Effects"
          value={statistics.uniqueEffects}
          description="Different effect types"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatCard
          title="Item Types"
          value={statistics.uniqueItemTypes}
          description="Different item categories"
          icon={<Package className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Effects/Enchantment"
          value={statistics.averageEffectsPerEnchantment}
          description="Average effects per enchantment"
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Effects"
          value={statistics.totalEffects}
          description="All effect instances"
          icon={<TrendingUp className="h-4 w-4" />}
          variant="muted"
        />
        <StatCard
          title="Total Items"
          value={statistics.totalItems}
          description="All item instances"
          icon={<Shield className="h-4 w-4" />}
          variant="muted"
        />
        <StatCard
          title="With Worn Restrictions"
          value={statistics.enchantmentsWithWornRestrictions}
          description="Enchantments with restrictions"
          icon={<Clock className="h-4 w-4" />}
          variant="muted"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown
          data={chartData.categoryData}
          total={statistics.totalEnchantments}
        />
        <TargetTypeChart
          data={chartData.targetTypeData}
          total={statistics.totalEnchantments}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EffectsAnalysis
          data={chartData.effectsData}
          total={statistics.totalEffects}
        />
        <ItemTypeDistribution
          data={chartData.itemTypeData}
          total={statistics.totalItems}
        />
      </div>



      {/* Summary Section */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">Data Coverage</div>
            <div className="text-muted-foreground">
              {statistics.totalEnchantments} enchantments available
            </div>
          </div>
          <div>
            <div className="font-medium">Effect Diversity</div>
            <div className="text-muted-foreground">
              {statistics.uniqueEffects} unique effects with {statistics.averageEffectsPerEnchantment} average per enchantment
            </div>
          </div>
          <div>
            <div className="font-medium">Item Coverage</div>
            <div className="text-muted-foreground">
              {statistics.uniqueItemTypes} item types with {statistics.totalItems} total instances
            </div>
          </div>
          <div>
            <div className="font-medium">Restrictions</div>
            <div className="text-muted-foreground">
              {statistics.enchantmentsWithWornRestrictions} enchantments have worn restrictions
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
