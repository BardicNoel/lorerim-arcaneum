import React from 'react'
import {
  GenericConfigCard,
  ConfigInput,
  ConfigAlert,
} from '@/shared/components/generic/ConfigCard'
import { Info } from 'lucide-react'

interface TraitLimitConfigCardProps {
  regularLimit: number
  bonusLimit: number
  onRegularLimitChange: (value: number) => void
  onBonusLimitChange: (value: number) => void
  currentRegularCount: number
  currentBonusCount: number
  className?: string
}

/**
 * Trait Limit Configuration Card
 *
 * Feature-specific wrapper around GenericConfigCard that handles
 * trait limit configuration for character builds.
 *
 * This follows the birthsigns pattern of feature-specific wrappers
 * around generic components for better separation of concerns.
 */
export function TraitLimitConfigCard({
  regularLimit,
  bonusLimit,
  onRegularLimitChange,
  onBonusLimitChange,
  currentRegularCount,
  currentBonusCount,
  className,
}: TraitLimitConfigCardProps) {
  const isUsingCustomLimits = regularLimit !== 2 || bonusLimit !== 1

  return (
    <GenericConfigCard
      title="Trait Limits Configuration"
      description="Configure the number of traits your character can have"
      icon={<Info className="h-4 w-4 text-muted-foreground" />}
      className={className}
    >
      {/* Warning about MCM configuration */}
      <ConfigAlert
        type="warning"
        title="Default configuration is 2 starting + 1 late game traits."
        message="Increasing these limits requires corresponding MCM (Mod Configuration Menu) changes in-game. Make sure your MCM settings match these limits to avoid conflicts."
      />

      {/* Trait limit inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfigInput
          label="Starting Traits Limit"
          value={regularLimit}
          onChange={onRegularLimitChange}
          min={0}
          max={10}
          currentCount={currentRegularCount}
          type="regular"
        />
        <ConfigInput
          label="Late Game Traits Limit"
          value={bonusLimit}
          onChange={onBonusLimitChange}
          min={0}
          max={5}
          currentCount={currentBonusCount}
          type="bonus"
        />
      </div>

      {/* Custom limits warning */}
      {isUsingCustomLimits && (
        <ConfigAlert
          type="info"
          title={`Custom limits detected: ${regularLimit} starting + ${bonusLimit} late game traits.`}
          message="Remember to update your MCM settings accordingly."
        />
      )}
    </GenericConfigCard>
  )
}
