import { useCharacterStore } from '@/shared/stores/characterStore'

export function useCharacterBuild() {
  // Specific selectors for better reactivity
  const majorSkills = useCharacterStore(state => state.build.skills.major)
  const minorSkills = useCharacterStore(state => state.build.skills.minor)
  const build = useCharacterStore(state => state.build)
  const updateBuild = useCharacterStore(state => state.updateBuild)
  const resetBuild = useCharacterStore(state => state.resetBuild)

  // Helper functions
  const hasMajorSkill = (skillId: string) =>
    majorSkills?.includes(skillId) ?? false
  const hasMinorSkill = (skillId: string) =>
    minorSkills?.includes(skillId) ?? false

  // Skill management functions
  const addMajorSkill = (skillId: string) => {
    const currentMajorSkills = majorSkills ?? []
    const currentMinorSkills = minorSkills ?? []

    if (!hasMajorSkill(skillId) && currentMajorSkills.length < 3) {
      // Remove from minor skills first (mutual exclusion)
      const newMinorSkills = currentMinorSkills.filter(id => id !== skillId)

      updateBuild({
        skills: {
          major: [...currentMajorSkills, skillId],
          minor: newMinorSkills,
        },
      })
    }
  }

  const removeMajorSkill = (skillId: string) => {
    const currentMajorSkills = majorSkills ?? []
    const currentMinorSkills = minorSkills ?? []
    const newMajorSkills = currentMajorSkills.filter(id => id !== skillId)
    updateBuild({
      skills: {
        major: newMajorSkills,
        minor: currentMinorSkills,
      },
    })
  }

  const addMinorSkill = (skillId: string) => {
    const currentMajorSkills = majorSkills ?? []
    const currentMinorSkills = minorSkills ?? []

    if (!hasMinorSkill(skillId) && currentMinorSkills.length < 3) {
      // Remove from major skills first (mutual exclusion)
      const newMajorSkills = currentMajorSkills.filter(id => id !== skillId)

      updateBuild({
        skills: {
          major: newMajorSkills,
          minor: [...currentMinorSkills, skillId],
        },
      })
    }
  }

  const removeMinorSkill = (skillId: string) => {
    const currentMajorSkills = majorSkills ?? []
    const currentMinorSkills = minorSkills ?? []
    const newMinorSkills = currentMinorSkills.filter(id => id !== skillId)
    updateBuild({
      skills: {
        major: currentMajorSkills,
        minor: newMinorSkills,
      },
    })
  }

  // Trait management functions
  const addTrait = (traitId: string) => {
    const { regular = [], bonus = [] } = build?.traits ?? {
      regular: [],
      bonus: [],
    }
    const { regular: regularLimit = 2, bonus: bonusLimit = 1 } =
      build?.traitLimits ?? { regular: 2, bonus: 1 }

    // If we have space in regular traits, add there first
    if (regular.length < regularLimit) {
      updateBuild({
        traits: { ...build?.traits, regular: [...regular, traitId] },
      })
    } else if (bonus.length < bonusLimit) {
      // If regular is full, add to bonus
      updateBuild({
        traits: { ...build?.traits, bonus: [...bonus, traitId] },
      })
    }
    // If both are full, don't add (this should be prevented by UI)
  }

  const addRegularTrait = (traitId: string) => {
    const { regular = [] } = build?.traits ?? { regular: [] }
    const { regular: regularLimit = 2 } = build?.traitLimits ?? { regular: 2 }

    if (regular.length < regularLimit) {
      updateBuild({
        traits: { ...build?.traits, regular: [...regular, traitId] },
      })
    }
  }

  const addBonusTrait = (traitId: string) => {
    const { bonus = [] } = build?.traits ?? { bonus: [] }
    const { bonus: bonusLimit = 1 } = build?.traitLimits ?? { bonus: 1 }

    if (bonus.length < bonusLimit) {
      updateBuild({
        traits: { ...build?.traits, bonus: [...bonus, traitId] },
      })
    }
  }

  const removeTrait = (traitId: string) => {
    const { regular = [], bonus = [] } = build?.traits ?? {
      regular: [],
      bonus: [],
    }
    updateBuild({
      traits: {
        regular: regular.filter(t => t !== traitId),
        bonus: bonus.filter(t => t !== traitId),
      },
    })
  }

  const hasTrait = (traitId: string) => {
    return (
      (build?.traits?.regular?.includes(traitId) ?? false) ||
      (build?.traits?.bonus?.includes(traitId) ?? false)
    )
  }

  const hasRegularTrait = (traitId: string) => {
    return build?.traits?.regular?.includes(traitId) ?? false
  }

  const hasBonusTrait = (traitId: string) => {
    return build?.traits?.bonus?.includes(traitId) ?? false
  }

  // Race management
  const setRace = (raceId: string | null) => {
    updateBuild({ race: raceId })
  }

  // Birthsign management
  const setBirthsign = (birthsignId: string | null) => {
    updateBuild({ stone: birthsignId })
  }

  // Alias for setBirthsign (for backward compatibility)
  const setStone = (stoneId: string | null) => {
    updateBuild({ stone: stoneId })
  }

  // Religion management
  const setReligion = (religionId: string | null) => {
    updateBuild({ religion: religionId })
  }

  // Equipment management
  const addEquipment = (equipmentId: string) => {
    const equipment = build?.equipment ?? []
    if (!equipment.includes(equipmentId)) {
      updateBuild({
        equipment: [...equipment, equipmentId],
      })
    }
  }

  const removeEquipment = (equipmentId: string) => {
    const equipment = build?.equipment ?? []
    updateBuild({
      equipment: equipment.filter(id => id !== equipmentId),
    })
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

  // Build summary for display
  const getSummary = () => {
    return {
      name: build?.name || 'Unnamed Character',
      race: build?.race || 'Not selected',
      stone: build?.stone || 'Not selected',
      religion: build?.religion || 'Not selected',
      traitCount:
        (build?.traits?.regular?.length ?? 0) +
        (build?.traits?.bonus?.length ?? 0),
      majorSkillCount: build?.skills?.major?.length ?? 0,
      minorSkillCount: build?.skills?.minor?.length ?? 0,
      equipmentCount: build?.equipment?.length ?? 0,
    }
  }

  // Trait limit getters
  const getRegularTraitLimit = () => build?.traitLimits?.regular ?? 2
  const getBonusTraitLimit = () => build?.traitLimits?.bonus ?? 1

  // Trait count getters
  const getRegularTraitCount = () => build?.traits?.regular?.length ?? 0
  const getBonusTraitCount = () => build?.traits?.bonus?.length ?? 0

  // Trait availability checkers
  const canAddRegularTrait = () =>
    (build?.traits?.regular?.length ?? 0) < (build?.traitLimits?.regular ?? 2)
  const canAddBonusTrait = () =>
    (build?.traits?.bonus?.length ?? 0) < (build?.traitLimits?.bonus ?? 1)

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
    addRegularTrait,
    addBonusTrait,
    removeTrait,
    hasTrait,
    hasRegularTrait,
    hasBonusTrait,

    // Race and birthsign
    setRace,
    setBirthsign,
    setStone,
    setReligion,

    // Equipment management
    addEquipment,
    removeEquipment,

    // Build metadata
    setBuildName,
    setBuildNotes,

    // Build management
    updateBuild,
    clearBuild,
    resetBuild,

    // Build summary
    getSummary,

    // Trait limits and counts
    getRegularTraitLimit,
    getBonusTraitLimit,
    getRegularTraitCount,
    getBonusTraitCount,
    canAddRegularTrait,
    canAddBonusTrait,
  }
}
