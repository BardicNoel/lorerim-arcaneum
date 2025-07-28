import React from 'react'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/ui/accordion'
import { PerkReferenceAccordionItem } from '../atomic/PerkReferenceAccordionItem'
import type { PerkReferenceItem } from '../../types'

interface PerkReferenceAccordionProps {
  items: PerkReferenceItem[]
  selectedItem?: PerkReferenceItem | null
  onItemSelect: (item: PerkReferenceItem) => void
  className?: string
  showToggle?: boolean
  height?: string
}

export function PerkReferenceAccordion({
  items,
  selectedItem,
  onItemSelect,
  className,
  showToggle = true,
  height = 'calc(100vh-500px)',
}: PerkReferenceAccordionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Accordion Layout */}
      <ScrollArea className={height}>
        <Accordion type="single" collapsible className="w-full">
          {items.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-foreground truncate hover:underline">
                    {item.name}
                  </div>
                  <div className="text-base text-muted-foreground truncate">
                    {item.description}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <PerkReferenceAccordionItem
                  item={item}
                  showToggle={showToggle}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No perks found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
} 