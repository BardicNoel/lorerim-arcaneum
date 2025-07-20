import { useCharacterStore } from '@/shared/stores/characterStore'

export function useCharacterBuild() {
  // Specific selectors for better reactivity
  const majorSkills = useCharacterStore(state => state.build.skills.major)
  const minorSkills = useCharacterStore(state => state.build.skills.minor)
  const build = useCharacterStore(state => state.build)
  const updateBuild = useCharacterStore(state => state.updateBuild)

  // Helper functions
  const hasMajorSkill = (skillId: string) => majorSkills.includes(skillId)
  const hasMinorSkill = (skillId: string) => minorSkills.includes(skillId)

  // Skill management functions
  const addMajorSkill = (skillId: string) => {
    if (!hasMajorSkill(skillId) && majorSkills.length < 3) {
      // Remove from minor skills first (mutual exclusion)
      const newMinorSkills = minorSkills.filter(id => id !== skillId)

      updateBuild({
        skills: {
          major: [...majorSkills, skillId],
          minor: newMinorSkills,
        },
      })
    }
  }

  const removeMajorSkill = (skillId: string) => {
    const newMajorSkills = majorSkills.filter(id => id !== skillId)
    updateBuild({
      skills: {
        major: newMajorSkills,
        minor: minorSkills,
      },
    })
  }

  const addMinorSkill = (skillId: string) => {
    if (!hasMinorSkill(skillId) && minorSkills.length < 3) {
      // Remove from major skills first (mutual exclusion)
      const newMajorSkills = majorSkills.filter(id => id !== skillId)

      updateBuild({
        skills: {
          major: newMajorSkills,
          minor: [...minorSkills, skillId],
        },
      })
    }
  }

  const removeMinorSkill = (skillId: string) => {
    const newMinorSkills = minorSkills.filter(id => id !== skillId)
    updateBuild({
      skills: {
        major: majorSkills,
        minor: newMinorSkills,
      },
    })
  }

  // Trait management functions
  const addTrait = (traitId: string) => {
    const { regular, bonus } = build.traits
    const { regular: regularLimit, bonus: bonusLimit } = build.traitLimits

    // If we have space in regular traits, add there first
    if (regular.length < regularLimit) {
      updateBuild({
        traits: { ...build.traits, regular: [...regular, traitId] },
      })
    } else if (bonus.length < bonusLimit) {
      // If regular is full, add to bonus
      updateBuild({
        traits: { ...build.traits, bonus: [...bonus, traitId] },
      })
    }
    // If both are full, don't add (this should be prevented by UI)
  }

  const removeTrait = (traitId: string) => {
    const { regular, bonus } = build.traits
    updateBuild({
      traits: {
        regular: regular.filter(t => t !== traitId),
        bonus: bonus.filter(t => t !== traitId),
      },
    })
  }

  const hasTrait = (traitId: string) => {
    return (
      build.traits.regular.includes(traitId) ||
      build.traits.bonus.includes(traitId)
    )
  }

  // Race management
  const setRace = (raceId: string | null) => {
    updateBuild({ race: raceId })
  }

  // Birthsign management
  const setBirthsign = (birthsignId: string | null) => {
    updateBuild({ stone: birthsignId })
  }

  // Build name and notes
  const setBuildName = (name: string) => {
    updateBuild({ name })
  }

  const setBuildNotes = (notes: string) => {
    updateBuild({ notes })
  }

  // Clear all selections
  const clearBuild = () => {
    updateBuild({
      name: '',
      notes: '',
      race: null,
      stone: null,
      skills: {
        major: [],
        minor: [],
      },
      traits: {
        regular: [],
        bonus: [],
      },
    })
  }

  return {
    // Current build state
    build,
    majorSkills,
    minorSkills,

    // Helper functions
    hasMajorSkill,
    hasMinorSkill,

    // Skill management
    addMajorSkill,
    removeMajorSkill,
    addMinorSkill,
    removeMinorSkill,

    // Trait management
    addTrait,
    removeTrait,
    hasTrait,

    // Race and birthsign
    setRace,
    setBirthsign,

    // Build metadata
    setBuildName,
    setBuildNotes,

    // Build management
    updateBuild,
    clearBuild,
  }
}
