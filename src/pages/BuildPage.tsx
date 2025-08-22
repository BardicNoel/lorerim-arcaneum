import { BirthsignSelectionCard } from '@/features/birthsigns'
import BuildPageDestinyCard from '@/features/destiny/views/BuildPageDestinyCard'
import { GigaPlannerToolsModal } from '@/features/gigaplanner/components/GigaPlannerToolsModal'
import type { BuildState } from '@/features/gigaplanner/utils/transformation'
import { RaceSelectionCard } from '@/features/races-v2'
import {
  FavoriteBlessingSelectionCard,
  ReligionSelectionCard,
} from '@/features/religions/components'
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
  BuildMasonryGrid,
  BuildResetConfirmDialog,
  TraitLimitConfigCard,
} from '@/features/build/components'
import { useTraitLimits } from '@/features/build/hooks'
import { BuildPageShell } from '@/shared/components/playerCreation'
// NEW: Import attribute assignment card
import { AttributeAssignmentCard } from '@/features/attributes'

export function BuildPage() {
  const { build, setBuildName, setBuildNotes, resetBuild } = useCharacterBuild()

  const [showConfirm, setShowConfirm] = useState(false)
  const [showGigaPlannerTools, setShowGigaPlannerTools] = useState(false)
  const traitLimits = useTraitLimits()

  const navigate = useNavigate()

  // Handle GigaPlanner import
  const handleGigaPlannerImport = (importedBuildState: BuildState) => {
    // Update the build state with imported data
    updateBuild({
      // Basic info
      name: importedBuildState.name || build.name,
      notes: importedBuildState.notes || build.notes,

      // Race and birthsign
      race: importedBuildState.race || build.race,
      birthsign: importedBuildState.birthsign || build.birthsign,

      // Attributes
      attributes: importedBuildState.attributes || build.attributes,

      // Skills
      skills: importedBuildState.skills || build.skills,

      // Perks
      perks: importedBuildState.perks || build.perks,

      // Traits
      traits: importedBuildState.traits || build.traits,

      // Religion
      religion: importedBuildState.religion || build.religion,

      // Favorite blessing
      favoriteBlessing:
        importedBuildState.favoriteBlessing || build.favoriteBlessing,

      // Destiny path
      destinyPath: importedBuildState.destinyPath || build.destinyPath,
    })

    setShowGigaPlannerTools(false)
  }

  // Define build cards for masonry layout
  // Layout: Basic Info | Race+Birthsign | Traits+Religion | Attributes | Skills | Destiny
  // Full-width cards: Basic Info, Attributes, Skills, Destiny
  const buildCards = [
    {
      id: 'basic-info',
      component: (
        <BasicInfoCard
          name={build.name}
          notes={build.notes}
          onNameChange={setBuildName}
          onNotesChange={setBuildNotes}
        />
      ),
      size: 'full' as const,
    },
    {
      id: 'race',
      component: <RaceSelectionCard />,
      size: 'half' as const,
    },
    {
      id: 'birthsign',
      component: <BirthsignSelectionCard />,
      size: 'half' as const,
    },
    {
      id: 'trait',
      component: <TraitSelectionCard />,
      size: 'half' as const,
    },
    {
      id: 'religion',
      component: <ReligionSelectionCard />,
      size: 'half' as const,
    },
    {
      id: 'favorite-blessing',
      component: <FavoriteBlessingSelectionCard />,
      size: 'half' as const,
    },
    {
      id: 'attributes',
      component: <AttributeAssignmentCard />,
      size: 'full' as const,
    },
    {
      id: 'skills',
      component: <BuildPageSkillCard />,
      size: 'full' as const,
    },
    {
      id: 'destiny',
      component: <BuildPageDestinyCard navigate={navigate} />,
      size: 'full' as const,
    },
  ]

  return (
    <BuildPageShell
      title="Character Builder"
      description="Create and customize your character build. Choose your race, birthsign, traits, religion, attributes, skills, and destiny to create the perfect character for your playstyle."
    >
      {/* Build Controls Area */}
      <BuildControls
        onReset={() => setShowConfirm(true)}
        build={build}
        onOpenGigaPlannerTools={() => setShowGigaPlannerTools(true)}
      />

      {/* Confirmation Dialog */}
      <BuildResetConfirmDialog
        open={showConfirm}
        onConfirm={() => {
          resetBuild()
          setShowConfirm(false)
        }}
        onCancel={() => setShowConfirm(false)}
      />

      {/* GigaPlanner Tools Modal */}
      <GigaPlannerToolsModal
        open={showGigaPlannerTools}
        onOpenChange={setShowGigaPlannerTools}
        onImport={handleGigaPlannerImport}
      />

      <Tabs defaultValue="build" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          {/* Build Cards in Masonry Layout */}
          <BuildMasonryGrid cards={buildCards} gap={16} />
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
