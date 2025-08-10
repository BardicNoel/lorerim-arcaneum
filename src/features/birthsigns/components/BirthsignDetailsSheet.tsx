import { ResponsivePanel } from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Separator } from '@/shared/ui/ui/separator'
import { H2, H3, P } from '@/shared/ui/ui/typography'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './BirthsignAvatar'
import { BirthsignEffectsDisplay } from './BirthsignEffectsDisplay'
import { BirthsignStatsDisplay } from './BirthsignStatsDisplay'

interface BirthsignDetailsSheetProps {
  birthsign: Birthsign | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function BirthsignDetailsSheet({
  birthsign,
  isOpen,
  onOpenChange,
}: BirthsignDetailsSheetProps) {
  if (!birthsign) return null

  return (
    <ResponsivePanel
      open={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      className="w-[400px] sm:w-[700px] lg:w-[800px] max-w-[800px] p-0 overflow-y-auto bg-background"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4">
            <BirthsignAvatar birthsignName={birthsign.name} size="4xl" />
            <div className="flex-1">
              <H2 className="text-2xl font-bold mb-2">{birthsign.name}</H2>
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center px-2 py-1 bg-skyrim-gold/10 text-skyrim-gold border border-skyrim-gold/30 rounded-full text-xs font-medium">
                  {birthsign.group}
                </div>
                <AddToBuildSwitchSimple
                  itemId={birthsign.edid}
                  itemType="stone"
                  itemName={birthsign.name}
                />
              </div>
              <P className="text-sm text-muted-foreground leading-relaxed">
                {birthsign.description}
              </P>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stat Modifications */}
          <BirthsignStatsDisplay birthsign={birthsign} />

          <Separator />

          {/* Special Effects */}
          <BirthsignEffectsDisplay
            birthsign={birthsign}
            title="Special Effects"
          />

          {/* Game Information */}
          <div className="space-y-4">
            <H3 className="text-lg font-semibold">Game Information</H3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">EDID:</span> {birthsign.edid}
              </div>
              <div>
                <span className="font-medium">Form ID:</span> {birthsign.formid}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
}
