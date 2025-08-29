import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { EnchantmentBadge } from './EnchantmentBadge'
import { EffectsList } from './EffectDisplay'
import { formatWornRestriction } from '../../hooks/useEnchantmentUniformFilters'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentListCardProps {
  enchantment: EnchantmentWithComputed
  onClick?: () => void
  className?: string
  selected?: boolean
}

export const EnchantmentListCard = React.memo<EnchantmentListCardProps>(({
  enchantment,
  onClick,
  className,
  selected = false
}) => {
  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
        selected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
             <CardContent className="p-4">
         <div className="space-y-3">
           {/* Header Row */}
           <div className="flex items-start justify-between gap-2">
             <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
               {enchantment.name}
             </h3>
             <div className="flex gap-1 flex-shrink-0">
               <EnchantmentBadge
                 type="targetType"
                 value={enchantment.targetType}
                 size="sm"
               />
             </div>
           </div>
           
                        {/* Effects Preview */}
             {enchantment.hasEffects && (
               <div>
                 <EffectsList
                   effects={enchantment.effects}
                   title=""
                   compact={true}
                   showDescriptions={true}
                   maxDisplay={enchantment.effects.length}
                 />
               </div>
             )}
           
           {/* Bottom: Enchantment Target Badges */}
           <div className="flex flex-wrap gap-1">
             {enchantment.isWeaponEnchantment ? (
               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                 Weapon
               </span>
             ) : enchantment.wornRestrictions.length > 0 ? (
               enchantment.wornRestrictions.map((restriction, index) => (
                 <span
                   key={index}
                   className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                   title={formatWornRestriction(restriction)}
                 >
                   {formatWornRestriction(restriction)}
                 </span>
               ))
             ) : (
               <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                 No listed restrictions
               </span>
             )}
           </div>
         </div>
       </CardContent>
    </Card>
  )
})
