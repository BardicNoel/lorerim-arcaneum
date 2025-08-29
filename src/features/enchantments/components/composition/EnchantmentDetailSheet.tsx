import React from 'react'
import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { Button } from '@/shared/ui/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { EnchantmentBadge } from '../atomic/EnchantmentBadge'
import { EffectsList } from '../atomic/EffectDisplay'
import { ItemList } from '../atomic/ItemList'
import { formatWornRestriction } from '../../hooks/useEnchantmentUniformFilters'
import { useEnchantmentsStore } from '@/shared/stores'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentDetailSheetProps {
  enchantment: EnchantmentWithComputed | null
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

export const EnchantmentDetailSheet = React.memo<EnchantmentDetailSheetProps>(({
  enchantment,
  open,
  onOpenChange,
  className
}) => {
  const { data: enchantments } = useEnchantmentsStore()
  
  const currentEnchantment = enchantment
  
  const currentIndex = currentEnchantment 
    ? enchantments.findIndex(e => e.baseEnchantmentId === currentEnchantment.baseEnchantmentId)
    : -1
  
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < enchantments.length - 1
  
  const handlePrevious = () => {
    if (hasPrevious && currentEnchantment) {
      const prevEnchantment = enchantments[currentIndex - 1]
      // This would need to be handled by the parent component
      // For now, we'll just close the sheet
      onOpenChange(false)
    }
  }
  
  const handleNext = () => {
    if (hasNext && currentEnchantment) {
      const nextEnchantment = enchantments[currentIndex + 1]
      // This would need to be handled by the parent component
      // For now, we'll just close the sheet
      onOpenChange(false)
    }
  }
  
  const handleClose = () => {
    onOpenChange(false)
  }
  

  
  if (!currentEnchantment) {
    return null
  }
  
  return (
    <ResponsivePanel open={open} onOpenChange={onOpenChange} side="right">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{currentEnchantment.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} of {enchantments.length}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <EnchantmentBadge
              type="category"
              value={currentEnchantment.category}
              size="lg"
            />
            <EnchantmentBadge
              type="targetType"
              value={currentEnchantment.targetType}
              size="lg"
            />
          </div>
          
          {/* Effects */}
          {currentEnchantment.hasEffects && (
            <div>
              <EffectsList
                effects={currentEnchantment.effects}
                title="Enchantment Effects"
                showDescriptions={true}
                compact={false}
              />
            </div>
          )}
          
          {/* Items */}
          <div>
            <ItemList
              items={currentEnchantment.foundOnItems}
              title="Items that can carry this enchantment"
              showType={true}
              compact={false}
            />
          </div>
          
          {/* Enchantment Targets */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Can be applied to:
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentEnchantment.isWeaponEnchantment ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  Weapons
                </span>
              ) : (
                currentEnchantment.wornRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                  >
                    {formatWornRestriction(restriction)}
                  </span>
                ))
              )}
            </div>
          </div>
          

        </div>
      </div>
    </ResponsivePanel>
  )
})
