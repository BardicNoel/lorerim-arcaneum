import { useMemo, useState } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillData } from './useSkillData'
import { usePerkData } from './usePerkData'
import type { UnifiedSkill } from '../types'

export interface DetailSkill extends UnifiedSkill {
  isMajor: boolean
  isMinor: boolean
  canAssignMajor: boolean
  canAssignMinor: boolean
  level?: number // Add minimum skill level
}

// Adapter for skill detail/perk tree views
export function useSkillsDetail() {
  // Get base skill data
  const { skills, loading, error } = useSkillData()
  
  // Get character build state
  const { build, addMajorSkill, addMinorSkill, removeMajorSkill, removeMinorSkill } = useCharacterBuild()

  // Selected skill state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Get perk data for selected skill
  const perkData = usePerkData(selectedSkillId)

  // Transform skills for detail view
  const detailSkills = useMemo(() => {
    return skills.map(skill => {
      const isMajor = build.skills.major.includes(skill.id)
      const isMinor = build.skills.minor.includes(skill.id)
      
      // Assignment limits
      const canAssignMajor = !isMajor && build.skills.major.length < 3
      const canAssignMinor = !isMinor && build.skills.minor.length < 6

      return {
        ...skill,
        isMajor,
        isMinor,
        canAssignMajor,
        canAssignMinor,
      } as DetailSkill
    })
  }, [skills, build.skills.major, build.skills.minor])

  // Get selected skill data
  const selectedSkill = useMemo(() => {
    return detailSkills.find(skill => skill.id === selectedSkillId) || null
  }, [detailSkills, selectedSkillId])

  // Assignment handlers
  const handleAssignMajor = (skillId: string) => {
    // Check if skill is already major - if so, remove it
    if (build.skills.major.includes(skillId)) {
      removeMajorSkill(skillId)
    } else {
      // Otherwise add it as major
      addMajorSkill(skillId)
    }
  }

  const handleAssignMinor = (skillId: string) => {
    // Check if skill is already minor - if so, remove it
    if (build.skills.minor.includes(skillId)) {
      removeMinorSkill(skillId)
    } else {
      // Otherwise add it as minor
      addMinorSkill(skillId)
    }
  }

  const handleRemoveAssignment = (skillId: string) => {
    removeMajorSkill(skillId)
    removeMinorSkill(skillId)
  }

  // Skill selection handlers
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkillId(skillId)
    setDrawerOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setSelectedSkillId(null)
    }
  }

  const handleResetPerks = () => {
    // The PerkTreeView component handles the actual reset
  }

  return {
    // Data
    skills: detailSkills,
    selectedSkill,
    selectedSkillId,
    
    // State
    loading,
    error,
    drawerOpen,
    
    // Perk data
    ...perkData,
    
    // Actions
    handleAssignMajor,
    handleAssignMinor,
    handleRemoveAssignment,
    handleSkillSelect,
    handleDrawerOpenChange,
    handleResetPerks,
  }
} 