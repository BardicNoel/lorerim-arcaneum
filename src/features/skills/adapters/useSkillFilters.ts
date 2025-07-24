import { useState, useMemo } from 'react'
import type { UnifiedSkill } from './unifiedAdapter'

// Adapter for skill filtering and search
export function useSkillFilters(skills: UnifiedSkill[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.keyAbilities.some(ability => 
                             ability.toLowerCase().includes(searchQuery.toLowerCase())
                           ) ||
                           skill.metaTags.some(tag => 
                             tag.toLowerCase().includes(searchQuery.toLowerCase())
                           )
      
      const matchesCategory = !selectedCategory || skill.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [skills, searchQuery, selectedCategory])
  
  const categories = useMemo(() => {
    const uniqueCategories = new Set(skills.map(skill => skill.category))
    return Array.from(uniqueCategories).sort()
  }, [skills])
  
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }
  
  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  }
} 