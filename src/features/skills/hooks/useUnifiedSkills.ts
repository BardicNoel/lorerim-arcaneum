import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useEffect, useState } from 'react'
import type { Skill } from '../types'
import { usePerks } from './usePerks'

export interface SkillWithPerks extends Skill {
  totalPerks: number
  selectedPerks: number
  isMajor: boolean
  isMinor: boolean
}

export function useUnifiedSkills() {
  const [skillsData, setSkillsData] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get skills management from character build
  const { majorSkills, minorSkills, hasMajorSkill, hasMinorSkill, build } =
    useCharacterBuild()

  // Get perks data for counting
  const { perkTrees } = usePerks()

  // Create a map of selected perks per skill from build state
  const selectedPerksMap = new Map<string, number>()

  // Count selected perks from build state (including ranks)
  if (build.perks?.selected && build.perks?.ranks) {
    Object.entries(build.perks.selected).forEach(([skillId, perkIds]) => {
      let totalRanks = 0
      perkIds.forEach(perkId => {
        const rank = build.perks.ranks[perkId] || 0
        totalRanks += rank
      })
      selectedPerksMap.set(skillId, totalRanks)
    })
  }

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
    const totalPerks = perkTree ? perkTree.perks.length : 0

    // Count selected perks for this skill from build state
    const selectedPerks = selectedPerksMap.get(skill.edid) || 0

    return {
      ...skill,
      totalPerks,
      selectedPerks,
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
