import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/ui/accordion'
import { SpellItem } from '../atomic/SpellItem'
import type { SpellWithComputed } from '../../types'

interface SpellAccordionProps {
  spells: SpellWithComputed[]
  groupBy?: 'school' | 'level' | 'none'
  variant?: 'default' | 'compact' | 'detailed'
  showEffects?: boolean
  showTags?: boolean
  className?: string
}

export function SpellAccordion({ 
  spells, 
  groupBy = 'school',
  variant = 'default',
  showEffects = true,
  showTags = true,
  className = ''
}: SpellAccordionProps) {
  if (spells.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No spells found</p>
      </div>
    )
  }

  // Group spells if needed
  const groupedSpells = groupBy === 'none' 
    ? { 'All Spells': spells }
    : groupBy === 'school'
    ? spells.reduce((acc, spell) => {
        const school = spell.school || 'Unknown'
        if (!acc[school]) acc[school] = []
        acc[school].push(spell)
        return acc
      }, {} as Record<string, SpellWithComputed[]>)
    : spells.reduce((acc, spell) => {
        const level = spell.level || 'Unknown'
        if (!acc[level]) acc[level] = []
        acc[level].push(spell)
        return acc
      }, {} as Record<string, SpellWithComputed[]>)

  return (
    <Accordion type="multiple" className={className}>
      {Object.entries(groupedSpells).map(([group, groupSpells]) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger className="text-lg font-semibold">
            {group} ({groupSpells.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {groupSpells.map((spell) => (
                <SpellItem
                  key={spell.editorId}
                  spell={spell}
                  variant={variant}
                  showEffects={showEffects}
                  showTags={showTags}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
} 