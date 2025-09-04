import {
  calculateAllSkillLevels,
  calculateStartingSkillLevel,
  calculateTotalSkillLevel,
} from '@/features/skills/utils/skillLevels'
import { useCharacterStore } from '@/shared/stores/characterStore'
import { validateBuild } from '../utils/validateBuild'

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

      const newSkills = {
        major: [...currentMajorSkills, skillId],
        minor: newMinorSkills,
      }
      updateBuild({
        skills: newSkills,
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

    if (!hasMinorSkill(skillId) && currentMinorSkills.length < 6) {
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

  // Religion management - Simplified
  const setReligion = (religionId: string | null) => {
    updateBuild({ religion: religionId })
  }

  // Favorite blessing management
  const setFavoriteBlessing = (blessingId: string | null) => {
    updateBuild({ favoriteBlessing: blessingId })
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

  // Destiny path management
  const getDestinyPath = () => build?.destinyPath ?? []
  const setDestinyPath = (path: string[]) => {
    updateBuild({ destinyPath: path })
  }

  // Perk management functions
  const addPerk = (skillId: string, perkId: string) => {
    const currentPerks = build?.perks?.selected ?? {}
    const skillPerks = currentPerks[skillId] ?? []

    if (!skillPerks.includes(perkId)) {
      const newPerks = {
        ...build?.perks,
        selected: {
          ...currentPerks,
          [skillId]: [...skillPerks, perkId],
        },
      }

      // Calculate new skill levels based on updated perks
      const newSkillLevels = calculateAllSkillLevels(newPerks)

      updateBuild({
        perks: newPerks,
        skillLevels: newSkillLevels,
      })
    }
  }

  const removePerk = (skillId: string, perkId: string) => {
    const currentPerks = build?.perks?.selected ?? {}
    const skillPerks = currentPerks[skillId] ?? []

    const newSkillPerks = skillPerks.filter(id => id !== perkId)

    const newPerks = {
      ...build?.perks,
      selected: {
        ...currentPerks,
        [skillId]: newSkillPerks,
      },
    }

    // Calculate new skill levels based on updated perks
    const newSkillLevels = calculateAllSkillLevels(newPerks)

    updateBuild({
      perks: newPerks,
      skillLevels: newSkillLevels,
    })
  }

  const setPerkRank = (perkId: string, rank: number) => {
    const currentRanks = build?.perks?.ranks ?? {}

    const newPerks = {
      ...build?.perks,
      ranks: {
        ...currentRanks,
        [perkId]: rank,
      },
    }

    // Calculate new skill levels based on updated perks
    const newSkillLevels = calculateAllSkillLevels(newPerks)

    updateBuild({
      perks: newPerks,
      skillLevels: newSkillLevels,
    })
  }

  const clearSkillPerks = (skillId: string) => {
    const currentPerks = build?.perks?.selected ?? {}
    const currentRanks = build?.perks?.ranks ?? {}

    // Remove all perks for this skill
    const { [skillId]: removedPerks, ...remainingPerks } = currentPerks

    // Remove ranks for removed perks
    const newRanks = { ...currentRanks }
    if (removedPerks) {
      removedPerks.forEach(perkId => {
        delete newRanks[perkId]
      })
    }

    const newPerks = {
      ...build?.perks,
      selected: remainingPerks,
      ranks: newRanks,
    }

    // Calculate new skill levels based on updated perks
    const newSkillLevels = calculateAllSkillLevels(newPerks)

    updateBuild({
      perks: newPerks,
      skillLevels: newSkillLevels,
    })
  }

  const getSkillPerks = (skillId: string) => {
    return build?.perks?.selected?.[skillId] ?? []
  }

  const getPerkRank = (perkId: string) => {
    return build?.perks?.ranks?.[perkId] ?? 0
  }

  const getSkillLevel = (skillId: string) => {
    if (!build) return 0
    return calculateTotalSkillLevel(skillId, build)
  }

  const getStartingSkillLevel = (skillId: string) => {
    if (!build) return 0
    return calculateStartingSkillLevel(skillId, build)
  }

  // Clear all selections
  const clearBuild = () => {
    const clearedBuild = {
      name: '',
      notes: '',
      race: null,
      stone: null,
      religion: null,
      skills: {
        major: [],
        minor: [],
      },
      traits: {
        regular: [],
        bonus: [],
      },
      perks: {
        selected: {},
        ranks: {},
      },
      skillLevels: {},
      destinyPath: [],
    }
    updateBuild(validateBuild(clearedBuild))
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

  // Get trait type (regular or bonus)
  const getTraitType = (traitId: string): 'regular' | 'bonus' | null => {
    if (build?.traits?.regular?.includes(traitId)) return 'regular'
    if (build?.traits?.bonus?.includes(traitId)) return 'bonus'
    return null
  }

  // Check if all trait slots are full
  const isAllTraitsFull = () => {
    const regularCount = build?.traits?.regular?.length ?? 0
    const bonusCount = build?.traits?.bonus?.length ?? 0
    const regularLimit = build?.traitLimits?.regular ?? 2
    const bonusLimit = build?.traitLimits?.bonus ?? 1

    return regularCount >= regularLimit && bonusCount >= bonusLimit
  }

  // Add trait to specific slot type
  const addTraitToSlot = (traitId: string, slotType: 'regular' | 'bonus') => {
    if (slotType === 'regular') {
      const { regular = [] } = build?.traits ?? { regular: [] }
      const { regular: regularLimit = 2 } = build?.traitLimits ?? { regular: 2 }

      if (regular.length < regularLimit) {
        // Remove from bonus if it was there
        const { bonus = [] } = build?.traits ?? { bonus: [] }
        const newBonusTraits = bonus.filter(id => id !== traitId)

        updateBuild({
          traits: {
            regular: [...regular, traitId],
            bonus: newBonusTraits,
          },
        })
      }
    } else {
      const { bonus = [] } = build?.traits ?? { bonus: [] }
      const { bonus: bonusLimit = 1 } = build?.traitLimits ?? { bonus: 1 }

      if (bonus.length < bonusLimit) {
        // Remove from regular if it was there
        const { regular = [] } = build?.traits ?? { regular: [] }
        const newRegularTraits = regular.filter(id => id !== traitId)

        updateBuild({
          traits: {
            regular: newRegularTraits,
            bonus: [...bonus, traitId],
          },
        })
      }
    }
  }

  // Check if a specific slot is available
  const isSlotAvailable = (
    slotType: 'regular' | 'bonus',
    slotIndex: number = 0
  ) => {
    if (slotType === 'regular') {
      const regularCount = build?.traits?.regular?.length ?? 0
      return regularCount <= slotIndex
    } else {
      const bonusCount = build?.traits?.bonus?.length ?? 0
      return bonusCount <= slotIndex
    }
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

    // Perk management
    addPerk,
    removePerk,
    setPerkRank,
    clearSkillPerks,
    getSkillPerks,
    getPerkRank,
    getSkillLevel,
    getStartingSkillLevel,

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

    // Religion management - Simplified
    setReligion,

    // Favorite blessing management
    setFavoriteBlessing,

    // Equipment management
    addEquipment,
    removeEquipment,

    // Build metadata
    setBuildName,
    setBuildNotes,

    // Destiny path
    getDestinyPath,
    setDestinyPath,

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
    getTraitType,
    isAllTraitsFull,
    addTraitToSlot,
    isSlotAvailable,
  }
}

/**
 * usePerkNodeCycle
 * Returns a callback to cycle a perk node's rank in the character build.
 * @param skillId - The skill tree id this perk belongs to
 * @param perkId - The perk's id
 * @param maxRank - The maximum rank for this perk
 */
export function usePerkNodeCycle(
  skillId: string,
  perkId: string,
  maxRank: number
) {
  const { getPerkRank, addPerk, setPerkRank, removePerk } = useCharacterBuild()

  return () => {
    const currentRank = getPerkRank(perkId) || 0
    if (currentRank === 0) {
      addPerk(skillId, perkId)
      setPerkRank(perkId, 1)
    } else if (currentRank > 0 && currentRank < maxRank) {
      setPerkRank(perkId, currentRank + 1)
    } else if (currentRank === maxRank) {
      removePerk(skillId, perkId)
      setPerkRank(perkId, 0)
    }
  }
}
