import { ResponsivePanel } from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { Separator } from '@/shared/ui/ui/separator'
import { H2, H3 } from '@/shared/ui/ui/typography'
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
    <ResponsivePanel open={isOpen} onOpenChange={onOpenChange} side="right">
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
              <FormattedText text={birthsign.description} />
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
            <div className="space-y-2 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-medium min-w-[60px]">EDID:</span>
                <span className="break-all">{birthsign.edid}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="font-medium min-w-[60px]">Form ID:</span>
                <span className="break-all">{birthsign.formid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
}
