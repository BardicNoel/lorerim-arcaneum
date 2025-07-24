import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { SelectionCardShell } from '@/shared/components/ui'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUnifiedSkills } from '../hooks/useUnifiedSkills'
import type { Skill } from '../types'
import { SkillAutocomplete } from './SkillAutocomplete'
import { FormattedText } from '@/shared/components/generic/FormattedText'

interface SkillSelectionCardProps {
  className?: string
}

export function SkillSelectionCard({ className }: SkillSelectionCardProps) {
  const { skills } = useUnifiedSkills()
  const {
    build,
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
  } = useCharacterBuild()
  const navigate = useNavigate()

  // Get selected skills
  const selectedMajorSkills = build.skills.major
    .map(id => skills.find(skill => skill.edid === id))
    .filter(Boolean) as Skill[]

  const selectedMinorSkills = build.skills.minor
    .map(id => skills.find(skill => skill.edid === id))
    .filter(Boolean) as Skill[]

  const handleMajorSkillSelect = (skill: Skill) => {
    addMajorSkill(skill.edid)
  }

  const handleMinorSkillSelect = (skill: Skill) => {
    addMinorSkill(skill.edid)
  }

  const handleMajorSkillRemove = (skillId: string) => {
    removeMajorSkill(skillId)
  }

  const handleMinorSkillRemove = (skillId: string) => {
    removeMinorSkill(skillId)
  }

  const handleNavigateToSkillPage = () => {
    navigate('/skills')
  }

  // Filter out already selected skills from autocomplete options
  const availableSkills = skills.filter(
    skill =>
      !build.skills.major.includes(skill.edid) &&
      !build.skills.minor.includes(skill.edid)
  )

  return (
    <SelectionCardShell
      title="Skills"
      navigateTo="skills"
      onNavigate={handleNavigateToSkillPage}
      className={className}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Major Skills - Left Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Major Skills</h4>

          {/* Major Skills Autocomplete */}
          {selectedMajorSkills.length < 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedMajorSkills.length}/3
                </Badge>
              </div>
              <SkillAutocomplete
                skills={availableSkills}
                onSelect={handleMajorSkillSelect}
                placeholder="Select major skill..."
                className="w-full"
              />
            </div>
          )}

          {/* Major Skills List */}
          {selectedMajorSkills.length > 0 && (
            <div className="space-y-2">
              {selectedMajorSkills.map((skill, index) => (
                <div
                  key={skill.edid}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50/50 border-yellow-500 shadow-yellow-500/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium text-sm">{skill.name}</div>
                      <Badge
                        variant="default"
                        className="text-xs bg-yellow-500 text-yellow-900"
                      >
                        Major
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <FormattedText
                      text={skill.description}
                      className="text-sm text-muted-foreground line-clamp-2"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMajorSkillRemove(skill.edid)}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minor Skills - Right Side */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Minor Skills</h4>

          {/* Minor Skills Autocomplete */}
          {selectedMinorSkills.length < 6 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {selectedMinorSkills.length}/6
                </Badge>
              </div>
              <SkillAutocomplete
                skills={availableSkills}
                onSelect={handleMinorSkillSelect}
                placeholder="Select minor skill..."
                className="w-full"
              />
            </div>
          )}

          {/* Minor Skills List */}
          {selectedMinorSkills.length > 0 && (
            <div className="space-y-2">
              {selectedMinorSkills.map((skill, index) => (
                <div
                  key={skill.edid}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-gray-100/50 border-gray-400 shadow-gray-400/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium text-sm">{skill.name}</div>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-400 text-gray-900"
                      >
                        Minor
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <FormattedText
                      text={skill.description}
                      className="text-sm text-muted-foreground line-clamp-2"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMinorSkillRemove(skill.edid)}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SelectionCardShell>
  )
}
