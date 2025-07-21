import { RaceSelectionCard } from '@/features/races/components'
import { TraitSelectionCard } from '@/features/traits/components'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/ui/tabs'
import BuildPageDestinyCard from '@/features/destiny/components/BuildPageDestinyCard'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import extracted components
import { 
  TraitLimitConfigCard,
  BuildResetConfirmDialog,
  BuildSummaryCard,
  BasicInfoCard,
  BuildControls
} from '@/features/build/components'
import { useTraitLimits } from '@/features/build/hooks'

import React from 'react'

export function BuildPage() {
  const { build, setBuildName, setBuildNotes, resetBuild, setDestinyPath } =
    useCharacterBuild()

  const [showConfirm, setShowConfirm] = useState(false)
  const traitLimits = useTraitLimits()

  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Character Builder</h1>
      </div>
      {/* Build Controls Area */}
      <BuildControls onReset={() => setShowConfirm(true)} />
      {/* Confirmation Dialog */}
      <BuildResetConfirmDialog
        open={showConfirm}
        onConfirm={() => {
          resetBuild()
          setShowConfirm(false)
        }}
        onCancel={() => setShowConfirm(false)}
      />

      <Tabs defaultValue="build" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          {/* Basic Information (always below tabs) */}
          <BasicInfoCard
            name={build.name}
            notes={build.notes}
            onNameChange={setBuildName}
            onNotesChange={setBuildNotes}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Race Selection and Display */}
            <RaceSelectionCard />
            {/* Trait Selection and Display */}
            <TraitSelectionCard />
          </div>

          {/* Destiny Section */}
          <BuildPageDestinyCard navigate={navigate} />

          {/* Build Summary */}
          <BuildSummaryCard build={build} />
        </TabsContent>
        <TabsContent value="config">
          {/* Trait Limits Configuration */}
          <TraitLimitConfigCard
            regularLimit={traitLimits.regularLimit}
            bonusLimit={traitLimits.bonusLimit}
            onRegularLimitChange={traitLimits.handleRegularLimitChange}
            onBonusLimitChange={traitLimits.handleBonusLimitChange}
            currentRegularCount={traitLimits.currentRegularCount}
            currentBonusCount={traitLimits.currentBonusCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
