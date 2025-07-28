import { useMemo } from 'react'
import { SpellModel } from '../model/SpellModel'
import type { SpellWithComputed, SpellComparison } from '../types'

interface UseSpellComputedOptions {
  enableStatistics?: boolean
  enableGrouping?: boolean
}

interface UseSpellComputedReturn {
  // Statistics
  statistics: {
    totalSpells: number
    spellsWithEffects: number
    areaSpells: number
    durationSpells: number
    freeSpells: number
    avgMagickaCost: number
    avgMagnitude: number
    schools: string[]
    levels: string[]
    tags: string[]
  }
  
  // Grouped data
  spellsBySchool: Record<string, SpellWithComputed[]>
  spellsByLevel: Record<string, SpellWithComputed[]>
  spellsByTag: Record<string, SpellWithComputed[]>
  
  // Computed lists
  freeSpells: SpellWithComputed[]
  areaSpells: SpellWithComputed[]
  durationSpells: SpellWithComputed[]
  instantSpells: SpellWithComputed[]
  highCostSpells: SpellWithComputed[]
  lowCostSpells: SpellWithComputed[]
  
  // Utility functions
  compareSpells: (spell1: SpellWithComputed, spell2: SpellWithComputed) => SpellComparison
  getSpellEfficiency: (spell: SpellWithComputed) => number
  getSpellPower: (spell: SpellWithComputed) => number
  getSpellComplexity: (spell: SpellWithComputed) => number
}

export function useSpellComputed(
  spells: SpellWithComputed[],
  options: UseSpellComputedOptions = {}
): UseSpellComputedReturn {
  const { enableStatistics = true, enableGrouping = true } = options

  // Statistics
  const statistics = useMemo(() => {
    if (!enableStatistics) {
      return {
        totalSpells: 0,
        spellsWithEffects: 0,
        areaSpells: 0,
        durationSpells: 0,
        freeSpells: 0,
        avgMagickaCost: 0,
        avgMagnitude: 0,
        schools: [],
        levels: [],
        tags: []
      }
    }
    return SpellModel.getStatistics(spells)
  }, [spells, enableStatistics])

  // Grouped data
  const spellsBySchool = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, SpellWithComputed[]> = {}
    spells.forEach(spell => {
      if (!grouped[spell.school]) {
        grouped[spell.school] = []
      }
      grouped[spell.school].push(spell)
    })
    
    // Sort spells within each school by name
    Object.keys(grouped).forEach(school => {
      grouped[school].sort((a, b) => a.name.localeCompare(b.name))
    })
    
    return grouped
  }, [spells, enableGrouping])

  const spellsByLevel = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, SpellWithComputed[]> = {}
    spells.forEach(spell => {
      if (!grouped[spell.level]) {
        grouped[spell.level] = []
      }
      grouped[spell.level].push(spell)
    })
    
    // Sort spells within each level by name
    Object.keys(grouped).forEach(level => {
      grouped[level].sort((a, b) => a.name.localeCompare(b.name))
    })
    
    return grouped
  }, [spells, enableGrouping])

  const spellsByTag = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, SpellWithComputed[]> = {}
    spells.forEach(spell => {
      spell.tags.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = []
        }
        grouped[tag].push(spell)
      })
    })
    
    // Sort spells within each tag by name
    Object.keys(grouped).forEach(tag => {
      grouped[tag].sort((a, b) => a.name.localeCompare(b.name))
    })
    
    return grouped
  }, [spells, enableGrouping])

  // Computed lists
  const freeSpells = useMemo(() => {
    return spells.filter(spell => spell.magickaCost === 0)
  }, [spells])

  const areaSpells = useMemo(() => {
    return spells.filter(spell => spell.isAreaSpell)
  }, [spells])

  const durationSpells = useMemo(() => {
    return spells.filter(spell => spell.isDurationSpell)
  }, [spells])

  const instantSpells = useMemo(() => {
    return spells.filter(spell => spell.isInstantSpell)
  }, [spells])

  const highCostSpells = useMemo(() => {
    return spells.filter(spell => spell.magickaCost > 150)
  }, [spells])

  const lowCostSpells = useMemo(() => {
    return spells.filter(spell => spell.magickaCost <= 50)
  }, [spells])

  // Utility functions
  const compareSpells = useMemo(() => {
    return (spell1: SpellWithComputed, spell2: SpellWithComputed): SpellComparison => {
      const magickaCostDiff = spell2.magickaCost - spell1.magickaCost
      const magickaCostPercent = spell1.magickaCost > 0 
        ? (magickaCostDiff / spell1.magickaCost) * 100 
        : 0

      const magnitudeDiff = spell2.totalMagnitude - spell1.totalMagnitude
      const magnitudePercent = spell1.totalMagnitude > 0 
        ? (magnitudeDiff / spell1.totalMagnitude) * 100 
        : 0

      const durationDiff = spell2.maxDuration - spell1.maxDuration
      const durationPercent = spell1.maxDuration > 0 
        ? (durationDiff / spell1.maxDuration) * 100 
        : 0

      const areaDiff = spell2.maxArea - spell1.maxArea
      const areaPercent = spell1.maxArea > 0 
        ? (areaDiff / spell1.maxArea) * 100 
        : 0

      // Compare effects
      const effects1 = spell1.effects.map(e => e.name)
      const effects2 = spell2.effects.map(e => e.name)
      const commonEffects = effects1.filter(e => effects2.includes(e))
      const addedEffects = effects2.filter(e => !effects1.includes(e))
      const removedEffects = effects1.filter(e => !effects2.includes(e))

      return {
        spell1,
        spell2,
        differences: {
          magickaCost: { difference: magickaCostDiff, percentage: magickaCostPercent },
          magnitude: { difference: magnitudeDiff, percentage: magnitudePercent },
          duration: { difference: durationDiff, percentage: durationPercent },
          area: { difference: areaDiff, percentage: areaPercent },
          effects: { added: addedEffects, removed: removedEffects, common: commonEffects }
        }
      }
    }
  }, [])

  const getSpellEfficiency = useMemo(() => {
    return (spell: SpellWithComputed): number => {
      if (spell.magickaCost === 0) return 0
      return spell.totalMagnitude / spell.magickaCost
    }
  }, [])

  const getSpellPower = useMemo(() => {
    return (spell: SpellWithComputed): number => {
      let power = spell.totalMagnitude
      
      // Bonus for area spells
      if (spell.isAreaSpell) {
        power += spell.maxArea * 2
      }
      
      // Bonus for duration spells
      if (spell.isDurationSpell) {
        power += spell.maxDuration * 0.5
      }
      
      // Bonus for multiple effects
      if (spell.effectCount > 1) {
        power += spell.effectCount * 10
      }
      
      return power
    }
  }, [])

  const getSpellComplexity = useMemo(() => {
    return (spell: SpellWithComputed): number => {
      let complexity = 0
      
      // Base complexity from effect count
      complexity += spell.effectCount * 10
      
      // Additional complexity for area effects
      if (spell.isAreaSpell) complexity += 20
      
      // Additional complexity for duration effects
      if (spell.isDurationSpell) complexity += 15
      
      // Additional complexity for high cost
      if (spell.magickaCost > 200) complexity += 10
      
      // Additional complexity for high magnitude
      if (spell.totalMagnitude > 100) complexity += 10
      
      return complexity
    }
  }, [])

  return {
    // Statistics
    statistics,
    
    // Grouped data
    spellsBySchool,
    spellsByLevel,
    spellsByTag,
    
    // Computed lists
    freeSpells,
    areaSpells,
    durationSpells,
    instantSpells,
    highCostSpells,
    lowCostSpells,
    
    // Utility functions
    compareSpells,
    getSpellEfficiency,
    getSpellPower,
    getSpellComplexity
  }
} 