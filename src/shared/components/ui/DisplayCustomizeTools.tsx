import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/ui/accordion'
import { Settings } from 'lucide-react'

interface DisplayCustomizeToolsProps {
  children: React.ReactNode
  title?: string
  description?: string
  defaultOpen?: boolean
  className?: string
}

export function DisplayCustomizeTools({
  children,
  title = "Customize Display",
  description = "Configure what information to show",
  defaultOpen = false,
  className
}: DisplayCustomizeToolsProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "customize-display" : undefined} className={className}>
      <AccordionItem value="customize-display" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {children}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 