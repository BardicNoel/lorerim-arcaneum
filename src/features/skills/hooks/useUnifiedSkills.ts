import { useState, useEffect } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { usePerks } from '@/features/perks/hooks/usePerks'
import type { Skill } from '../types'

export interface SkillWithPerks extends Skill {
  perksCount: number
  isMajor: boolean
  isMinor: boolean
}

export function useUnifiedSkills() {
  const [skillsData, setSkillsData] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get skills management from character build
  const { majorSkills, minorSkills, hasMajorSkill, hasMinorSkill } =
    useCharacterBuild()

  // Get perks data for counting
  const { perkTrees } = usePerks()

  // Load skills data from JSON file
  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()

        // Sort skills alphabetically by name
        const sortedSkills = (data.skills || []).sort((a: Skill, b: Skill) =>
          a.name.localeCompare(b.name)
        )
        setSkillsData(sortedSkills)
      } catch (err) {
        setError('Failed to load skills data')
        console.error('Error loading skills:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  // Calculate perks count for each skill
  const skillsWithPerks: SkillWithPerks[] = skillsData.map(skill => {
    // Find the perk tree for this skill
    const perkTree = perkTrees.find(tree => tree.treeId === skill.edid)

    // Count total perks available for this skill
    const perksCount = perkTree ? perkTree.perks.length : 0

    return {
      ...skill,
      perksCount,
      isMajor: hasMajorSkill(skill.edid),
      isMinor: hasMinorSkill(skill.edid),
    }
  })

  return {
    skills: skillsWithPerks,
    loading,
    error,
    perkTrees,
  }
}
