import { useCharacterStore } from '../stores/characterStore'
import type { BuildState } from '../types/build'

/**
 * Convenience hook for character build state management
 * Provides easy access to build state and common actions
 */
export const useCharacterBuild = () => {
  const { build, setBuild, updateBuild, resetBuild } = useCharacterStore()

  return {
    // Current build state
    build,
    
    // Actions
    setBuild,
    updateBuild,
    resetBuild,
    
    // Convenience methods
    setName: (name: string) => updateBuild({ name }),
    setNotes: (notes: string) => updateBuild({ notes }),
    setRace: (race: string | null) => updateBuild({ race }),
    setStone: (stone: string | null) => updateBuild({ stone }),
    setReligion: (religion: string | null) => updateBuild({ religion }),
    
    // Array management
    addTrait: (trait: string) => updateBuild({ 
      traits: [...build.traits, trait] 
    }),
    removeTrait: (trait: string) => updateBuild({ 
      traits: build.traits.filter(t => t !== trait) 
    }),
    
    addMajorSkill: (skill: string) => updateBuild({ 
      skills: { ...build.skills, major: [...build.skills.major, skill] } 
    }),
    removeMajorSkill: (skill: string) => updateBuild({ 
      skills: { ...build.skills, major: build.skills.major.filter(s => s !== skill) } 
    }),
    
    addMinorSkill: (skill: string) => updateBuild({ 
      skills: { ...build.skills, minor: [...build.skills.minor, skill] } 
    }),
    removeMinorSkill: (skill: string) => updateBuild({ 
      skills: { ...build.skills, minor: build.skills.minor.filter(s => s !== skill) } 
    }),
    
    addEquipment: (equipment: string) => updateBuild({ 
      equipment: [...build.equipment, equipment] 
    }),
    removeEquipment: (equipment: string) => updateBuild({ 
      equipment: build.equipment.filter(e => e !== equipment) 
    }),
    
    // Utility methods
    hasTrait: (trait: string) => build.traits.includes(trait),
    hasMajorSkill: (skill: string) => build.skills.major.includes(skill),
    hasMinorSkill: (skill: string) => build.skills.minor.includes(skill),
    hasEquipment: (equipment: string) => build.equipment.includes(equipment),
    
    // Build validation
    isValid: () => {
      return build.name.trim().length > 0 && build.race !== null
    },
    
    // Build summary
    getSummary: () => {
      return {
        name: build.name || 'Unnamed Character',
        race: build.race || 'No Race Selected',
        stone: build.stone || 'No Birth Sign',
        religion: build.religion || 'No Religion',
        traitCount: build.traits.length,
        majorSkillCount: build.skills.major.length,
        minorSkillCount: build.skills.minor.length,
        equipmentCount: build.equipment.length
      }
    }
  }
} 