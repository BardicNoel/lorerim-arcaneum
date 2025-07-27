import { usePerkTrees, useSkills } from '@/shared/stores'
import { useMemo } from 'react'

// Utility to compute perk counts from perk trees data
function computeSkillPerkCounts(skills: any[], perkTrees: any[]) {
  const perkCountMap = new Map<string, number>()

  // Count perks for each skill tree
  perkTrees.forEach(tree => {
    const skillEdid = tree.treeId
    const perkCount = tree.perks?.length || 0
    perkCountMap.set(skillEdid, perkCount)
  })

  return perkCountMap
}

// Adapter for skill data loading and caching
export function useSkillData() {
  // Use the data cache hooks
  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
    reload: reloadSkills,
  } = useSkills()
  const {
    data: perkTreesData,
    loading: perkTreesLoading,
    error: perkTreesError,
    reload: reloadPerkTrees,
  } = usePerkTrees()

  // Combine loading states
  const loading = skillsLoading || perkTreesLoading
  const error = skillsError || perkTreesError

  // Transform skills to UnifiedSkill format
  const skills = useMemo(() => {
    if (!skillsData || !perkTreesData) return []

    // Compute perk counts
    const perkCountMap = computeSkillPerkCounts(skillsData, perkTreesData)

    // Transform raw skills to UnifiedSkill format
    return skillsData.map((skill: any) => ({
      id: skill.edid,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      keyAbilities: skill.keyAbilities || [],
      metaTags: skill.metaTags || [],
      assignmentType: 'none' as const,
      canAssignMajor: true,
      canAssignMinor: true,
      level: 0,
      totalPerks: perkCountMap.get(skill.edid) || 0,
      selectedPerksCount: 0,
      selectedPerks: [],
      isSelected: false,
    }))
  }, [skillsData, perkTreesData])

  // Refresh function that reloads both skills and perk trees
  const refreshSkills = async () => {
    await Promise.all([reloadSkills(), reloadPerkTrees()])
  }

  return {
    skills,
    perkTrees: perkTreesData || [],
    loading,
    error,
    refreshSkills,
  }
}
