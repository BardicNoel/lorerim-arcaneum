import React from 'react'
import { cn } from '@/lib/utils'
import { EnchantmentGrid } from './EnchantmentGrid'
import { FilterControls } from './FilterControls'
import { useEnchantmentFilters } from '../../hooks/useEnchantmentFilters'

interface EnchantmentGridContainerProps {
  className?: string
  showFilters?: boolean
}

export const EnchantmentGridContainer: React.FC<EnchantmentGridContainerProps> = ({
  className,
  showFilters = true
}) => {
  const { filteredEnchantments, totalCount, filteredCount } = useEnchantmentFilters()
  
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
        enchantments={filteredEnchantments}
        loading={false}
      />
    </div>
  )
}
