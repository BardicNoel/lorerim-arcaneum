import { useCallback, useState } from 'react'

// Adapter for skill state management
export function useSkillState() {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [majorSkills, setMajorSkills] = useState<string[]>([])
  const [minorSkills, setMinorSkills] = useState<string[]>([])

  const assignSkill = useCallback(
    (skillId: string, type: 'major' | 'minor') => {
      if (type === 'major') {
        // Check if we can assign more major skills (limit: 3)
        if (majorSkills.length >= 3 && !majorSkills.includes(skillId)) {
          return { valid: false, reason: 'Maximum 3 major skills allowed' }
        }

        // Remove from minor skills if present
        setMinorSkills(prev => prev.filter(id => id !== skillId))

        // Add to major skills if not already present
        if (!majorSkills.includes(skillId)) {
          setMajorSkills(prev => [...prev, skillId])
        }
      } else {
        // Check if we can assign more minor skills (limit: 6)
        if (minorSkills.length >= 6 && !minorSkills.includes(skillId)) {
          return { valid: false, reason: 'Maximum 6 minor skills allowed' }
        }

        // Remove from major skills if present
        setMajorSkills(prev => prev.filter(id => id !== skillId))

        // Add to minor skills if not already present
        if (!minorSkills.includes(skillId)) {
          setMinorSkills(prev => [...prev, skillId])
        }
      }

      return { valid: true, reason: 'Skill assigned successfully' }
    },
    [majorSkills, minorSkills]
  )

  const unassignSkill = useCallback((skillId: string) => {
    setMajorSkills(prev => prev.filter(id => id !== skillId))
    setMinorSkills(prev => prev.filter(id => id !== skillId))
  }, [])

  const selectSkill = useCallback((skillId: string | null) => {
    setSelectedSkillId(skillId)
  }, [])

  const getSelectedSkill = useCallback(() => {
    return selectedSkillId
  }, [selectedSkillId])

  const getMajorSkills = useCallback(() => {
    return majorSkills
  }, [majorSkills])

  const getMinorSkills = useCallback(() => {
    return minorSkills
  }, [minorSkills])

  return {
    selectedSkillId,
    setSelectedSkillId: selectSkill,
    assignSkill,
    unassignSkill,
    getSelectedSkill,
    majorSkills,
    minorSkills,
  }
}
