import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { SelectionCardShell } from '@/shared/components/ui'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSkillsQuickSelector } from '../../adapters'
import type { QuickSelectorSkill } from '../../adapters'
import { SkillAutocomplete } from '../composition/SkillAutocomplete'
import { FormattedText } from '@/shared/components/generic/FormattedText'

interface SkillSelectionCardProps {
  className?: string
}

export function SkillSelectionCard({ className }: SkillSelectionCardProps) {
  const { 
    selectedMajorSkills, 
    selectedMinorSkills, 
    availableSkills,
    handleMajorSkillSelect,
    handleMinorSkillSelect,
    handleMajorSkillRemove,
    handleMinorSkillRemove
  } = useSkillsQuickSelector()
  const navigate = useNavigate()

  const handleNavigateToSkillPage = () => {
    navigate('/skills')
  }

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
              {selectedMajorSkills.map((skill) => (
                <div
                  key={skill.edid}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50/50 border-yellow-500 shadow-yellow-500/20"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-foreground">
                      {skill.name}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {skill.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMajorSkillRemove(skill.edid)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                  >
                    <X className="h-4 w-4" />
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
              {selectedMinorSkills.map((skill) => (
                <div
                  key={skill.edid}
                  className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50/50 border-gray-300 shadow-gray-300/20"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-foreground">
                      {skill.name}
                    </h5>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {skill.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMinorSkillRemove(skill.edid)}
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
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