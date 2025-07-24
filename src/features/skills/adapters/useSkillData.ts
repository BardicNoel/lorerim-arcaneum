import { useEffect, useState } from 'react'
import type { UnifiedSkill } from '../types'

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

        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()

        // Transform raw skills to UnifiedSkill format
        const transformedSkills: UnifiedSkill[] = (data.skills || []).map(
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
            totalPerks: 0,
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

        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()

        // Transform raw skills to UnifiedSkill format
        const transformedSkills: UnifiedSkill[] = (data.skills || []).map(
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
            totalPerks: 0,
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
