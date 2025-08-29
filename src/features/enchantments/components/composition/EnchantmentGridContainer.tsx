import React from 'react'
import { cn } from '@/lib/utils'
import { EnchantmentGrid } from './EnchantmentGrid'
import { FilterControls } from './FilterControls'
import { useEnchantmentFilters } from '../../hooks/useEnchantmentFilters'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentGridContainerProps {
  className?: string
  showFilters?: boolean
  enchantments?: EnchantmentWithComputed[] // Add this prop
  onEnchantmentClick?: (enchantment: EnchantmentWithComputed) => void
}

export const EnchantmentGridContainer: React.FC<EnchantmentGridContainerProps> = ({
  className,
  showFilters = true,
  enchantments: propEnchantments, // Add this
  onEnchantmentClick
}) => {
  const { filteredEnchantments: storeEnchantments, totalCount, filteredCount } = useEnchantmentFilters()
  
  // Use prop enchantments if provided, otherwise use store
  const displayEnchantments = propEnchantments || storeEnchantments
  
  return (
    <div className={cn('space-y-6', className)}>
      {showFilters && (
        <div className="space-y-4">
          <FilterControls />
          {filteredCount !== totalCount && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalCount} enchantments
            </div>
          )}
        </div>
      )}
      
      <EnchantmentGrid
        enchantments={displayEnchantments}
        loading={false}
        onEnchantmentClick={onEnchantmentClick}
      />
    </div>
  )
}
