import { useEffect, useState } from 'react'
import type { UnifiedSkill } from '../types'

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
  const [skills, setSkills] = useState<UnifiedSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load both skills and perk trees data
        const [skillsRes, perkTreesRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/skills.json`),
          fetch(`${import.meta.env.BASE_URL}data/perk-trees.json`)
        ])
        
        if (!skillsRes.ok) throw new Error('Failed to fetch skills data')
        if (!perkTreesRes.ok) throw new Error('Failed to fetch perk trees data')
        
        const skillsData = await skillsRes.json()
        const perkTreesData = await perkTreesRes.json()
        
        // Compute perk counts
        const perkCountMap = computeSkillPerkCounts(skillsData.skills || [], perkTreesData)

        // Transform raw skills to UnifiedSkill format
        const transformedSkills: UnifiedSkill[] = (skillsData.skills || []).map(
          (skill: any) => ({
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
          })
        )

        setSkills(transformedSkills)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [])

  const refreshSkills = async () => {
    // Reload skills from the beginning
    const loadSkills = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load both skills and perk trees data
        const [skillsRes, perkTreesRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/skills.json`),
          fetch(`${import.meta.env.BASE_URL}data/perk-trees.json`)
        ])
        
        if (!skillsRes.ok) throw new Error('Failed to fetch skills data')
        if (!perkTreesRes.ok) throw new Error('Failed to fetch perk trees data')
        
        const skillsData = await skillsRes.json()
        const perkTreesData = await perkTreesRes.json()
        
        // Compute perk counts
        const perkCountMap = computeSkillPerkCounts(skillsData.skills || [], perkTreesData)

        // Transform raw skills to UnifiedSkill format
        const transformedSkills: UnifiedSkill[] = (skillsData.skills || []).map(
          (skill: any) => ({
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
          })
        )

        setSkills(transformedSkills)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to refresh skills'
        )
      } finally {
        setLoading(false)
      }
    }

    await loadSkills()
  }

  return {
    skills,
    loading,
    error,
    refreshSkills,
  }
}
