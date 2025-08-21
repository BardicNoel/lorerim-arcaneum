import { SkillAvatar } from '../atomic/SkillAvatar'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { SelectionCardShell } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DetailSkill } from '../../adapters'
import {
  usePerkData,
  useSkillData,
  useSkillsQuickSelector,
} from '../../adapters'
import { SkillLevelBadge } from '../atomic/SkillLevelBadge'
import { SkillAutocomplete } from '../composition/SkillAutocomplete'
import { SkillPerkTreeDrawer } from './SkillPerkTreeDrawer'

interface BuildPageSkillCardProps {
  className?: string
}

export function BuildPageSkillCard({ className }: BuildPageSkillCardProps) {
  const {
    selectedMajorSkills,
    selectedMinorSkills,
    availableSkills,
    handleMajorSkillSelect,
    handleMinorSkillSelect,
    handleMajorSkillRemove,
    handleMinorSkillRemove,
  } = useSkillsQuickSelector()

  const { build, getSkillLevel, getSkillPerks } = useCharacterBuild()
  const { skills: allSkills } = useSkillData()
  const navigate = useNavigate()

  // State for perk tree drawer
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [perkTreeOpen, setPerkTreeOpen] = useState(false)

  const handleNavigateToSkillPage = () => {
    navigate('/skills')
  }

  const handleSkillClick = (skillId: string) => {
    setSelectedSkillId(skillId)
    setPerkTreeOpen(true)
  }

  const handleClosePerkTree = () => {
    setPerkTreeOpen(false)
    setSelectedSkillId(null)
  }

  const handleOtherPerkSkillSelect = (skill: any) => {
    // Open perk tree for the selected skill
    setSelectedSkillId(skill.edid)
    setPerkTreeOpen(true)
  }

  // Get skills that have perks but are not assigned as major or minor
  const otherPerkedSkills = useMemo(() => {
    const majorSkillIds = selectedMajorSkills.map(s => s.id)
    const minorSkillIds = selectedMinorSkills.map(s => s.id)
    const allAssignedIds = [...majorSkillIds, ...minorSkillIds]

    return allSkills.filter(skill => {
      const selectedPerks = getSkillPerks(skill.id)
      return selectedPerks.length > 0 && !allAssignedIds.includes(skill.id)
    })
  }, [allSkills, selectedMajorSkills, selectedMinorSkills, getSkillPerks])

  // Get available skills for "Other Perked Skills" autocomplete (not assigned as major/minor and not already perked)
  const availableForOtherPerks = useMemo(() => {
    const majorSkillIds = selectedMajorSkills.map(s => s.id)
    const minorSkillIds = selectedMinorSkills.map(s => s.id)
    const allAssignedIds = [...majorSkillIds, ...minorSkillIds]

    // Get skills that already have perks but aren't assigned
    const alreadyPerkedSkillIds = otherPerkedSkills.map(skill => skill.id)

    return allSkills
      .filter(
        skill =>
          !allAssignedIds.includes(skill.id) &&
          !alreadyPerkedSkillIds.includes(skill.id)
      )
      .map(skill => ({
        name: skill.name,
        edid: skill.id, // Transform id to edid
        category: skill.category,
        description: skill.description,
        scaling: '', // Add default scaling
        keyAbilities: skill.keyAbilities || [],
        metaTags: skill.metaTags || [],
      }))
  }, [allSkills, selectedMajorSkills, selectedMinorSkills, otherPerkedSkills])

  // Transform QuickSelectorSkill to Skill format for autocomplete components
  const transformToSkillFormat = (skill: any) => ({
    name: skill.name,
    edid: skill.id,
    category: skill.category,
    description: skill.description,
    scaling: skill.scaling || '',
    keyAbilities: skill.keyAbilities || [],
    metaTags: skill.metaTags || [],
  })

  // Transform skills for the perk tree drawer
  const drawerSkills: DetailSkill[] = allSkills.map(skill => {
    const selectedPerks = getSkillPerks(skill.id)
    const skillLevel = getSkillLevel(skill.id)
    const isMajor = build.skills.major.includes(skill.id)
    const isMinor = build.skills.minor.includes(skill.id)
    const canAssignMajor = !isMajor && build.skills.major.length < 3
    const canAssignMinor = !isMinor && build.skills.minor.length < 6

    return {
      ...skill,
      isMajor,
      isMinor,
      canAssignMajor,
      canAssignMinor,
      level: skillLevel,
    } as DetailSkill
  })

  // Get perk data for selected skill
  const { selectedPerkTree, loading: perkLoading } =
    usePerkData(selectedSkillId)

  const renderSkillCard = (skill: any, type: 'major' | 'minor' | 'perked') => {
    const skillLevel = getSkillLevel(skill.id || skill.edid)
    const selectedPerks = getSkillPerks(skill.id || skill.edid)
    const totalPerks = skill.totalPerks || 0
    const skillId = skill.id || skill.edid

    // Determine card styling based on type
    let cardClasses = 'cursor-pointer transition-all hover:shadow-md '
    let badgeClasses = 'text-xs '

    switch (type) {
      case 'major':
        cardClasses += 'bg-yellow-50/50 border-yellow-500 shadow-yellow-500/20'
        badgeClasses += 'bg-yellow-100 text-yellow-800 border-yellow-300'
        break
      case 'minor':
        cardClasses += 'bg-gray-50/50 border-gray-300 shadow-gray-300/20'
        badgeClasses += 'bg-gray-100 text-gray-800 border-gray-300'
        break
      case 'perked':
        cardClasses += 'bg-blue-50/50 border-blue-500 shadow-blue-500/20'
        badgeClasses += 'bg-blue-100 text-blue-800 border-blue-300'
        break
    }

    return (
      <Card
        key={skillId}
        className={cardClasses}
        onClick={() => handleSkillClick(skillId)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <SkillAvatar
                  skillName={skill.name}
                  size="2xl"
                  className="flex-shrink-0"
                />
                <h5 className="font-medium text-sm text-foreground">
                  {skill.name}
                </h5>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <FormattedText
                text={skill.description}
                className="text-xs text-muted-foreground line-clamp-2 mb-3"
                as="p"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <SkillLevelBadge level={skillLevel} size="sm" />
                <Badge variant="outline" className={badgeClasses}>
                  {selectedPerks.length}/{totalPerks} perks
                </Badge>
                {type === 'major' && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300"
                  >
                    Major
                  </Badge>
                )}
                {type === 'minor' && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-100 text-gray-800 border-gray-300"
                  >
                    Minor
                  </Badge>
                )}
                {type === 'perked' && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-100 text-blue-800 border-blue-300"
                  >
                    Perked
                  </Badge>
                )}
                {type === 'assigned' && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-100 text-orange-800 border-orange-300"
                  >
                    Assigned
                  </Badge>
                )}
              </div>
            </div>

            {(type === 'major' || type === 'minor') && (
              <Button
                size="sm"
                variant="ghost"
                onClick={e => {
                  e.stopPropagation()
                  if (type === 'major') {
                    handleMajorSkillRemove(skillId)
                  } else {
                    handleMinorSkillRemove(skillId)
                  }
                }}
                className={`${
                  type === 'major'
                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100'
                    : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <SelectionCardShell
        title="Skills & Perks"
        navigateTo="skills"
        onNavigate={handleNavigateToSkillPage}
        className={className}
      >
        <div className="space-y-6">
          {/* Major Skills */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">
              Major Skills
            </h4>

            {/* Major Skills Autocomplete */}
            {selectedMajorSkills.length < 3 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedMajorSkills.length}/3
                  </Badge>
                </div>
                <SkillAutocomplete
                  skills={availableSkills.map(transformToSkillFormat)}
                  onSelect={skill => {
                    const unifiedSkill = availableSkills.find(
                      s => s.id === skill.edid
                    )
                    if (unifiedSkill) {
                      handleMajorSkillSelect(unifiedSkill)
                    }
                  }}
                  placeholder="Select major skill..."
                  className="w-full"
                />
              </div>
            )}

            {/* Major Skills List */}
            {selectedMajorSkills.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {selectedMajorSkills.map(skill =>
                  renderSkillCard(skill, 'major')
                )}
              </div>
            )}
          </div>

          {/* Minor Skills */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">
              Minor Skills
            </h4>

            {/* Minor Skills Autocomplete */}
            {selectedMinorSkills.length < 6 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedMinorSkills.length}/6
                  </Badge>
                </div>
                <SkillAutocomplete
                  skills={availableSkills.map(transformToSkillFormat)}
                  onSelect={skill => {
                    const unifiedSkill = availableSkills.find(
                      s => s.id === skill.edid
                    )
                    if (unifiedSkill) {
                      handleMinorSkillSelect(unifiedSkill)
                    }
                  }}
                  placeholder="Select minor skill..."
                  className="w-full"
                />
              </div>
            )}

            {/* Minor Skills List */}
            {selectedMinorSkills.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {selectedMinorSkills.map(skill =>
                  renderSkillCard(skill, 'minor')
                )}
              </div>
            )}
          </div>

          {/* Other Perked Skills */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">
              Other Perked Skills
            </h4>

            {/* Other Perked Skills Autocomplete */}
            <div className="space-y-2">
              <SkillAutocomplete
                skills={availableForOtherPerks}
                onSelect={handleOtherPerkSkillSelect}
                placeholder="Select skill to add perks..."
                className="w-full"
              />
            </div>

            {/* Other Perked Skills List */}
            {otherPerkedSkills.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {otherPerkedSkills.map(skill =>
                  renderSkillCard(skill, 'perked')
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click on any skill card to view and manage its perk tree. Skill
            levels show the minimum level required based on your perk
            selections.
          </p>
        </div>
      </SelectionCardShell>

      {/* Perk Tree Drawer */}
      <SkillPerkTreeDrawer
        open={perkTreeOpen}
        onOpenChange={setPerkTreeOpen}
        selectedSkill={selectedSkillId}
        skillName={
          selectedSkillId
            ? allSkills.find(s => s.id === selectedSkillId)?.name
            : undefined
        }
        perkTree={selectedPerkTree || undefined}
        skills={drawerSkills}
        onSkillSelect={setSelectedSkillId}
        onReset={() => {
          // Reset is handled by the drawer internally
        }}
      />
    </>
  )
}
