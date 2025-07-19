import { useMemo } from 'react'
import type { Skill } from '../types'

interface UseFuzzySearchReturn {
  filteredSkills: Skill[]
  searchResults: Array<{
    skill: Skill
    matchType: 'name' | 'description' | 'ability' | 'tag'
    matchScore: number
  }>
}

export function useFuzzySearch(
  skills: Skill[],
  query: string
): UseFuzzySearchReturn {
  const { filteredSkills, searchResults } = useMemo(() => {
    if (!query.trim()) {
      return {
        filteredSkills: skills,
        searchResults: [],
      }
    }

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 0)
    const results: Array<{
      skill: Skill
      matchType: 'name' | 'description' | 'ability' | 'tag'
      matchScore: number
    }> = []

    skills.forEach(skill => {
      let bestMatchScore = 0
      let bestMatchType: 'name' | 'description' | 'ability' | 'tag' = 'name'

      // Check name matches
      const nameLower = skill.name.toLowerCase()
      searchTerms.forEach(term => {
        if (nameLower.includes(term)) {
          const score = term.length / nameLower.length
          if (score > bestMatchScore) {
            bestMatchScore = score
            bestMatchType = 'name'
          }
        }
      })

      // Check description matches
      const descLower = skill.description.toLowerCase()
      searchTerms.forEach(term => {
        if (descLower.includes(term)) {
          const score = (term.length / descLower.length) * 0.8 // Slightly lower weight
          if (score > bestMatchScore) {
            bestMatchScore = score
            bestMatchType = 'description'
          }
        }
      })

      // Check key abilities matches
      skill.keyAbilities.forEach(ability => {
        const abilityLower = ability.toLowerCase()
        searchTerms.forEach(term => {
          if (abilityLower.includes(term)) {
            const score = (term.length / abilityLower.length) * 0.9
            if (score > bestMatchScore) {
              bestMatchScore = score
              bestMatchType = 'ability'
            }
          }
        })
      })

      // Check meta tags matches
      skill.metaTags.forEach(tag => {
        const tagLower = tag.toLowerCase()
        searchTerms.forEach(term => {
          if (tagLower.includes(term)) {
            const score = (term.length / tagLower.length) * 0.7
            if (score > bestMatchScore) {
              bestMatchScore = score
              bestMatchType = 'tag'
            }
          }
        })
      })

      if (bestMatchScore > 0) {
        results.push({
          skill,
          matchType: bestMatchType,
          matchScore: bestMatchScore,
        })
      }
    })

    // Sort by match score (descending)
    results.sort((a, b) => b.matchScore - a.matchScore)

    return {
      filteredSkills: results.map(r => r.skill),
      searchResults: results,
    }
  }, [skills, query])

  return { filteredSkills, searchResults }
}
