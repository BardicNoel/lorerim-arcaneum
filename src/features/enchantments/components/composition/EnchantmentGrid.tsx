import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { EnchantmentGridCard } from '../atomic/EnchantmentGridCard'
import { useEnchantmentsStore } from '@/shared/stores'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentGridProps {
  className?: string
  enchantments?: EnchantmentWithComputed[]
  loading?: boolean
  emptyMessage?: string
  onEnchantmentClick?: (enchantment: EnchantmentWithComputed) => void
}

export const EnchantmentGrid = React.memo<EnchantmentGridProps>(({
  className,
  enchantments: propEnchantments,
  loading: propLoading,
  emptyMessage = "No enchantments found",
  onEnchantmentClick
}) => {
  const { data: storeEnchantments, loading: storeLoading, viewState } = useEnchantmentsStore()
  
  const loading = propLoading ?? storeLoading
  const enchantments = propEnchantments ?? storeEnchantments
  const { sortBy, sortOrder } = viewState
  
  // Sort enchantments
  const sortedEnchantments = useMemo(() => {
    if (!enchantments) return []
    
    return [...enchantments].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'targetType':
          // Sort by enchantment type (weapon vs armor) for better UX
          aValue = a.isWeaponEnchantment ? 'weapon' : 'armor'
          bValue = b.isWeaponEnchantment ? 'weapon' : 'armor'
          break
        case 'wornRestrictions':
          // Sort by worn restrictions: weapons first, then armor restrictions
          if (a.isWeaponEnchantment && !b.isWeaponEnchantment) {
            return -1 // Weapons first
          }
          if (!a.isWeaponEnchantment && b.isWeaponEnchantment) {
            return 1 // Weapons first
          }
          if (a.isWeaponEnchantment && b.isWeaponEnchantment) {
            // Both are weapons, sort by name
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
          } else {
            // Both are armor, sort by first worn restriction, then by name
            const aFirstRestriction = a.wornRestrictions[0] || ''
            const bFirstRestriction = b.wornRestrictions[0] || ''
            if (aFirstRestriction !== bFirstRestriction) {
              aValue = aFirstRestriction.toLowerCase()
              bValue = bFirstRestriction.toLowerCase()
            } else {
              aValue = a.name.toLowerCase()
              bValue = b.name.toLowerCase()
            }
          }
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [enchantments, sortBy, sortOrder])
  
  const handleCardClick = (enchantment: EnchantmentWithComputed) => {
    onEnchantmentClick?.(enchantment)
  }
  
  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4', className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded mb-2 w-2/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }
  
  if (sortedEnchantments.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
        <div className="text-4xl mb-4">🔮</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Enchantments Found
        </h3>
        <p className="text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    )
  }
  
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1',
      'md:grid-cols-2', 
      'lg:grid-cols-3',
      'xl:grid-cols-3',
      '2xl:grid-cols-4',
      className
    )}>
      {sortedEnchantments.map((enchantment) => (
        <EnchantmentGridCard
          key={enchantment.baseEnchantmentId}
          enchantment={enchantment}
          onClick={() => handleCardClick(enchantment)}
        />
      ))}
    </div>
  )
})
