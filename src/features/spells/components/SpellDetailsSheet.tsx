import { ResponsivePanel } from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Separator } from '@/shared/ui/ui/separator'
import { H2, H3, P, Small } from '@/shared/ui/ui/typography'
import { 
  BookOpen, 
  Clock, 
  Target, 
  Zap, 
  Sparkles,
  Flame,
  Heart,
  Ghost,
  Eye,
  Shield
} from 'lucide-react'
import type { SpellWithComputed } from '../types'
import {
  SpellSchoolIcon,
  SpellSchoolBadge,
  SpellLevelBadge,
  SpellCostBadge,
  SpellStatsDisplay,
  SpellTagsDisplay,
} from './atomic'

interface SpellDetailsSheetProps {
  spell: SpellWithComputed | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const schoolIcons = {
  Destruction: Flame,
  Restoration: Heart,
  Conjuration: Ghost,
  Illusion: Eye,
  Alteration: Shield,
  '': Sparkles,
}

const levelColors = {
  Novice: 'bg-green-100 text-green-800 border-green-200',
  Apprentice: 'bg-blue-100 text-blue-800 border-blue-200',
  Adept: 'bg-purple-100 text-purple-800 border-purple-200',
  Expert: 'bg-orange-100 text-orange-800 border-orange-200',
  Master: 'bg-red-100 text-red-800 border-red-200',
}

export function SpellDetailsSheet({
  spell,
  isOpen,
  onOpenChange,
}: SpellDetailsSheetProps) {
  if (!spell) return null

  const SchoolIcon = schoolIcons[spell.school as keyof typeof schoolIcons] || Sparkles

  return (
    <ResponsivePanel 
      open={isOpen} 
      onOpenChange={onOpenChange} 
      side="right"
      title={spell.name}
      description={`${spell.school} • ${spell.level} • ${spell.magickaCost} MP`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <SchoolIcon className="w-16 h-16 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <H2 className="text-2xl font-bold mb-2">{spell.name}</H2>
            <div className="flex items-center gap-2 mb-3">
              <SpellSchoolBadge school={spell.school} size="sm" />
              <SpellLevelBadge level={spell.level} size="sm" />
              <SpellCostBadge cost={spell.magickaCost} size="sm" />
            </div>
            <FormattedText text={spell.description} />
          </div>
        </div>

        <Separator />

        {/* Spell Statistics */}
        <SpellStatsDisplay 
          stats={{
            magickaCost: spell.magickaCost || 0,
            duration: spell.maxDuration && spell.maxDuration > 0 ? spell.maxDuration : undefined,
            area: spell.maxArea && spell.maxArea > 0 ? spell.maxArea : undefined,
            magnitude: spell.totalMagnitude && spell.totalMagnitude > 0 ? spell.totalMagnitude : undefined,
          }}
        />

        <Separator />

        {/* Spell Effects */}
        {spell.hasEffects && (
          <div>
            <H3 className="text-lg font-semibold mb-3">Effects</H3>
            <div className="space-y-2">
              {spell.effects
                .filter((effect, index, self) => {
                  // Get the base name (remove Single/Dual suffix)
                  const baseName = effect.name.replace(/\s*\(Single\)|\s*\(Dual\)/i, '')
                  
                  // Find the first occurrence with the same base name and stats
                  const firstIndex = self.findIndex(e => {
                    const eBaseName = e.name.replace(/\s*\(Single\)|\s*\(Dual\)/i, '')
                    return eBaseName === baseName && 
                           e.magnitude === effect.magnitude && 
                           e.duration === effect.duration
                  })
                  
                  // Only show the first occurrence
                  return index === firstIndex
                })
                .map((effect, index) => (
                <div
                  key={index}
                  className="p-3 rounded bg-muted border"
                >
                  {/* Effect Name */}
                  <div className="font-medium text-foreground mb-2">
                    {effect.name}
                  </div>
                  
                  {/* Effect Description (if available) */}
                  {effect.description && (
                    <FormattedText
                      text={effect.description}
                      className="text-sm text-muted-foreground mb-2"
                    />
                  )}
                  
                  {/* Effect Stats */}
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {effect.magnitude > 0 && (
                      <span>Magnitude: {effect.magnitude}</span>
                    )}
                    {effect.duration > 0 && (
                      <span>Duration: {effect.duration}s</span>
                    )}
                    {effect.area > 0 && <span>Area: {effect.area}ft</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spell Tags */}
        {spell.tags && spell.tags.length > 0 && (
          <>
            <Separator />
            <SpellTagsDisplay
              tags={spell.tags}
              title="Tags"
              maxDisplay={20}
            />
          </>
        )}

        {/* Additional Information */}
        {(spell.tome || spell.vendors?.length || spell.halfCostPerk) && (
          <>
            <Separator />
            <div className="space-y-4">
              <H3 className="text-lg font-semibold">Additional Information</H3>
              
              {spell.tome && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <Small className="text-muted-foreground">Spell Tome</Small>
                  </div>
                  <P className="text-sm">{spell.tome}</P>
                </div>
              )}

              {spell.vendors && spell.vendors.length > 0 && (
                <div className="space-y-2">
                  <Small className="text-muted-foreground">Available From</Small>
                  <div className="flex flex-wrap gap-1">
                    {spell.vendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {spell.halfCostPerk && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <Small className="text-muted-foreground">Half Cost Perk</Small>
                  </div>
                  <P className="text-sm">{spell.halfCostPerkName}</P>
                </div>
              )}
            </div>
          </>
        )}

        {/* Game Information */}
        <Separator />
        <div className="space-y-4">
          <H3 className="text-lg font-semibold">Game Information</H3>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-medium min-w-[60px]">Editor ID:</span>
              <span className="break-all font-mono">{spell.editorId}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-medium min-w-[60px]">School:</span>
              <span>{spell.school}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-medium min-w-[60px]">Level:</span>
              <span>{spell.level}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-medium min-w-[60px]">Effects:</span>
              <span>{spell.effectCount}</span>
            </div>
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
}
