import { BirthsignSelectionCard } from '@/features/birthsigns'
import BuildPageDestinyCard from '@/features/destiny/views/BuildPageDestinyCard'
import { GigaPlannerToolsModal } from '@/features/gigaplanner/components/GigaPlannerToolsModal'
import type { BuildState as GigaPlannerBuildState } from '@/features/gigaplanner/utils/transformation'
import type { BuildState } from '@/shared/types/build'
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
  const { build, setBuildName, setBuildNotes, resetBuild, updateBuild } =
    useCharacterBuild()
  


  const [showConfirm, setShowConfirm] = useState(false)
  const [showGigaPlannerTools, setShowGigaPlannerTools] = useState(false)
  const traitLimits = useTraitLimits()

  const navigate = useNavigate()

  // Handle GigaPlanner import
  const handleGigaPlannerImport = (importedBuildState: GigaPlannerBuildState) => {
    console.log('📥 [Build Page] GigaPlanner import received:', importedBuildState)
    console.log('📊 [Build Page] Current build state before import:', build)
    console.log('🔍 [Build Page] Current build analysis:')
    console.log('  - Current race:', build.race, '(type:', typeof build.race, ')')
    console.log('  - Current stone:', build.stone, '(type:', typeof build.stone, ')')
    console.log('  - Current religion:', build.religion, '(type:', typeof build.religion, ')')
    console.log('  - Current favoriteBlessing:', build.favoriteBlessing, '(type:', typeof build.favoriteBlessing, ')')
    console.log('  - Current level:', build.attributeAssignments?.level)
    console.log('🔍 [Build Page] Imported race:', importedBuildState.race)
    console.log('🔍 [Build Page] Imported stone:', importedBuildState.stone)
    console.log('🔍 [Build Page] Imported level:', importedBuildState.attributeAssignments?.level)
    console.log('🔍 [Build Page] Imported skill levels:', importedBuildState.skillLevels)
    console.log('🔍 [Build Page] Full imported build state structure:', JSON.stringify(importedBuildState, null, 2))
    
    // Debug the specific fields we're trying to map
    console.log('🔍 [Build Page] GigaPlanner data analysis:')
    console.log('  - importedBuildState.race:', importedBuildState.race, '(type:', typeof importedBuildState.race, ')')
    console.log('  - importedBuildState.stone:', importedBuildState.stone, '(type:', typeof importedBuildState.stone, ')')
    console.log('  - importedBuildState.religion:', importedBuildState.religion, '(type:', typeof importedBuildState.religion, ')')
    console.log('  - importedBuildState.favoriteBlessing:', importedBuildState.favoriteBlessing, '(type:', typeof importedBuildState.favoriteBlessing, ')')
    console.log('  - importedBuildState.attributeAssignments:', importedBuildState.attributeAssignments)
    console.log('  - importedBuildState.skills:', importedBuildState.skills)
    console.log('  - importedBuildState.perks:', importedBuildState.perks)
    console.log('  - importedBuildState.traits:', importedBuildState.traits)

    // Convert GigaPlanner BuildState to main application BuildState
    const convertedBuildState: Partial<BuildState> = {
      // Schema version - always set to current version
      v: 1,
      
      // Basic info - use imported values, fallback to current only if undefined
      name: importedBuildState.name !== undefined ? importedBuildState.name : build.name,
      notes: importedBuildState.notes !== undefined ? importedBuildState.notes : build.notes,

      // Race and standing stone - convert to null if undefined/empty, otherwise use imported value
      race: importedBuildState.race && importedBuildState.race !== 'Unknown' ? importedBuildState.race : null,
      stone: importedBuildState.stone && importedBuildState.stone !== 'Unknown' ? importedBuildState.stone : null,

      // Attributes - use imported values directly
      attributeAssignments: importedBuildState.attributeAssignments 
        ? {
            health: importedBuildState.attributeAssignments.health !== undefined ? importedBuildState.attributeAssignments.health : 0,
            stamina: importedBuildState.attributeAssignments.stamina !== undefined ? importedBuildState.attributeAssignments.stamina : 0,
            magicka: importedBuildState.attributeAssignments.magicka !== undefined ? importedBuildState.attributeAssignments.magicka : 0,
            level: importedBuildState.attributeAssignments.level !== undefined ? importedBuildState.attributeAssignments.level : 1,
            assignments: importedBuildState.attributeAssignments.assignments || {},
          }
        : build.attributeAssignments,

      // Skills - use imported values directly
      skills: importedBuildState.skills !== undefined 
        ? {
            major: importedBuildState.skills.major || [],
            minor: importedBuildState.skills.minor || [],
          }
        : build.skills,

      // Perks - use imported values directly
      perks: importedBuildState.perks !== undefined 
        ? {
            selected: importedBuildState.perks.selected || {},
            ranks: importedBuildState.perks.ranks || {},
          }
        : build.perks,

      // Traits - use imported values directly
      traits: importedBuildState.traits !== undefined 
        ? {
            regular: importedBuildState.traits.regular || [],
            bonus: importedBuildState.traits.bonus || [],
          }
        : build.traits,

      // Religion - convert to null if undefined/empty, otherwise use imported value
      religion: importedBuildState.religion && importedBuildState.religion !== 'Unknown' ? importedBuildState.religion : null,

      // Favorite blessing - convert to null if undefined/empty, otherwise use imported value
      favoriteBlessing: importedBuildState.favoriteBlessing && importedBuildState.favoriteBlessing !== 'Unknown' ? importedBuildState.favoriteBlessing : null,

      // Destiny path - use imported values directly
      destinyPath: importedBuildState.destinyPath !== undefined ? importedBuildState.destinyPath : build.destinyPath,

      // Skill levels - use imported values directly
      skillLevels: importedBuildState.skillLevels !== undefined ? importedBuildState.skillLevels : build.skillLevels,
    }

    // Update the build state with imported data
    console.log('🔄 [Build Page] Updating build with converted state:', convertedBuildState)
    console.log('🔍 [Build Page] Converted race:', convertedBuildState.race)
    console.log('🔍 [Build Page] Converted stone:', convertedBuildState.stone)
    console.log('🔍 [Build Page] Converted level:', convertedBuildState.attributeAssignments?.level)
    updateBuild(convertedBuildState)

    console.log('✅ [Build Page] Build update completed')
    
    // Force a re-render to see the updated state
    setTimeout(() => {
      console.log('📊 [Build Page] Current build state after update (delayed):', build)
      console.log('🔍 [Build Page] Race after update:', build.race)
      console.log('🔍 [Build Page] Stone after update:', build.stone)
      console.log('🔍 [Build Page] Level after update:', build.attributeAssignments?.level)
      
      // Comprehensive build store debugging
      console.log('🏪 [Build Store] Full build state after import:')
      console.log('  - v:', build.v)
      console.log('  - name:', build.name)
      console.log('  - notes:', build.notes)
      console.log('  - race:', build.race)
      console.log('  - stone:', build.stone)
      console.log('  - religion:', build.religion)
      console.log('  - favoriteBlessing:', build.favoriteBlessing)
      console.log('  - traits:', build.traits)
      console.log('  - traitLimits:', build.traitLimits)
      console.log('  - skills:', build.skills)
      console.log('  - perks:', build.perks)
      console.log('  - skillLevels:', build.skillLevels)
      console.log('  - equipment:', build.equipment)
      console.log('  - userProgress:', build.userProgress)
      console.log('  - destinyPath:', build.destinyPath)
      console.log('  - attributeAssignments:', build.attributeAssignments)
      
      // Compare with what we tried to set
      console.log('🔄 [Build Store] What we tried to set vs what actually got set:')
      console.log('  - Tried to set race:', convertedBuildState.race, '→ Actually set:', build.race)
      console.log('  - Tried to set stone:', convertedBuildState.stone, '→ Actually set:', build.stone)
      console.log('  - Tried to set level:', convertedBuildState.attributeAssignments?.level, '→ Actually set:', build.attributeAssignments?.level)
      console.log('  - Tried to set blessing:', convertedBuildState.favoriteBlessing, '→ Actually set:', build.favoriteBlessing)
    }, 100)
    
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
