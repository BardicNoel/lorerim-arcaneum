import { BirthsignSelectionCard } from '@/features/birthsigns'
import BuildPageDestinyCard from '@/features/destiny/views/BuildPageDestinyCard'
import { RaceSelectionCard } from '@/features/races-v2'
import { ReligionSelectionCard } from '@/features/religions/components'
import { BuildPageSkillCard } from '@/features/skills/components'
import { TraitSelectionCard } from '@/features/traits/components'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Import extracted components
import {
  BasicInfoCard,
  BuildControls,
  BuildResetConfirmDialog,
  BuildSummaryCard,
  TraitLimitConfigCard,
} from '@/features/build/components'
import { useTraitLimits } from '@/features/build/hooks'
import { BuildPageShell } from '@/shared/components/playerCreation'

export function BuildPage() {
  const { build, setBuildName, setBuildNotes, resetBuild } = useCharacterBuild()

  const [showConfirm, setShowConfirm] = useState(false)
  const traitLimits = useTraitLimits()

  const navigate = useNavigate()

  return (
    <BuildPageShell title="Character Builder">
      {/* Build Controls Area */}
      <BuildControls onReset={() => setShowConfirm(true)} build={build} />

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
            {/* Birth Sign Selection and Display */}
            <BirthsignSelectionCard />
            {/* Trait Selection and Display */}
            <TraitSelectionCard />
            {/* Religion Selection and Display */}
            <ReligionSelectionCard />
          </div>

          {/* Skill Selection and Display - Double Wide */}
          <div className="mb-6">
            <BuildPageSkillCard />
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
    </BuildPageShell>
  )
}
