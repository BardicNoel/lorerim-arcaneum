import React from 'react'
import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { Button } from '@/shared/ui/ui/button'
import { X, ChevronLeft, ChevronRight, Copy, Share2 } from 'lucide-react'
import { EnchantmentBadge } from '../atomic/EnchantmentBadge'
import { EffectsList } from '../atomic/EffectDisplay'
import { ItemList } from '../atomic/ItemList'
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
  
  const handleCopyToClipboard = async () => {
    if (!currentEnchantment) return
    
    const text = `${currentEnchantment.name}\n\nEffects:\n${currentEnchantment.effects.map(e => `- ${e.name}: ${e.description}`).join('\n')}\n\nFound on: ${currentEnchantment.foundOnItems.map(i => i.name).join(', ')}`
    
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Add toast notification
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
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
              title="Found on Items"
              showType={true}
              compact={false}
            />
          </div>
          
          {/* Worn Restrictions */}
          {currentEnchantment.wornRestrictions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Worn Restrictions
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentEnchantment.wornRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Plugin:</span>
                <div className="font-medium">{currentEnchantment.plugin}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Item Count:</span>
                <div className="font-medium">{currentEnchantment.itemCount}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Effect Count:</span>
                <div className="font-medium">{currentEnchantment.effectCount}</div>
              </div>
              <div>
                <span className="text-muted-foreground">ID:</span>
                <div className="font-mono text-xs">{currentEnchantment.baseEnchantmentId}</div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
})
