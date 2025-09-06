import { useBirthsignsStore } from '../stores/birthsignsStore'
import { useBlessingsStore } from '../stores/blessingsStore'
import { useDestinyNodesStore } from '../stores/destinyNodesStore'
import { usePerkTreesStore } from '../stores/perkTreesStore'
import { useRacesStore } from '../stores/racesStore'
import { useReligionsStore } from '../stores/religionsStore'
import { useSkillsStore } from '../stores/skillsStore'
import { useTraitsStore } from '../stores/traitsStore'
import type { BuildState } from '../types/build'
import type { HydratedBuildData } from '../types/discordExport'

/**
 * Format text for Discord compatibility
 * Removes markdown formatting that doesn't work in Discord
 */
function formatForDiscord(text: string): string {
  if (!text) return ''

  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '**$1**') // Convert *** to **
    .replace(/<(\d+)>/g, 'Level $1') // Convert <N> to Level N
    .replace(/<Global=([^>]+)>/g, 'X%') // Convert <Global=Variable> to X%
    .replace(/<[^>]+>/g, 'X%') // Convert any other angle bracket variables to X%
    .replace(/\n+/g, ' ') // Convert newlines to spaces
    .trim()
}

/**
 * Safely resolve data with error handling
 */
function safeResolve<T>(
  resolver: () => T,
  fallback: T,
  errorContext: string
): T {
  try {
    return resolver()
  } catch (error) {
    console.warn(`Failed to resolve ${errorContext}:`, error)
    return fallback
  }
}

/**
 * Resolve race data from EDID
 */
function resolveRace(raceId: string | null): {
  name: string
  effects?: string
} {
  if (!raceId) return { name: 'Not selected' }

  return safeResolve(
    () => {
      const races = useRacesStore.getState().data

      // Check if data is loaded
      if (races.length === 0) {
        throw new Error(
          'Races data not loaded yet. Please wait a moment and try again.'
        )
      }

      // Try to find by EDID first
      let race = races.find(r => r.edid === raceId)

      // If not found, try to find by name (case insensitive)
      if (!race) {
        race = races.find(r => r.name.toLowerCase() === raceId.toLowerCase())
      }

      // If still not found, try to find by ID
      if (!race) {
        race = races.find(r => r.id === raceId)
      }

      if (!race) {
        console.warn(
          `Race not found for ID: ${raceId}. Available races: ${races.map(r => r.edid).join(', ')}`
        )
        return { name: 'Unknown Race' }
      }

      return {
        name: race.name,
        effects: race.description
          ? formatForDiscord(race.description)
          : undefined,
      }
    },
    { name: 'Unknown Race' },
    'race'
  )
}

/**
 * Resolve birth sign data from EDID
 */
function resolveBirthSign(stoneId: string | null): {
  name: string
  effects: string
} {
  if (!stoneId) return { name: 'Not selected', effects: 'No effects' }

  return safeResolve(
    () => {
      const birthsigns = useBirthsignsStore.getState().data

      // Check if data is loaded
      if (birthsigns.length === 0) {
        throw new Error(
          'Birthsigns data not loaded yet. Please wait a moment and try again.'
        )
      }

      const birthsign = birthsigns.find(b => b.edid === stoneId)

      if (!birthsign)
        return { name: 'Unknown Birth Sign', effects: 'No effects' }

      return {
        name: birthsign.name,
        effects: formatForDiscord(birthsign.description || 'No effects'),
      }
    },
    { name: 'Unknown Birth Sign', effects: 'No effects' },
    'birth sign'
  )
}

/**
 * Resolve traits data from EDIDs
 */
function resolveTraits(
  regularTraits: string[],
  bonusTraits: string[]
): Array<{ name: string; effects: string; type: 'regular' | 'bonus' }> {
  return safeResolve(
    () => {
      const traits = useTraitsStore.getState().data

      // Check if data is loaded
      if (traits.length === 0) {
        throw new Error(
          'Traits data not loaded yet. Please wait a moment and try again.'
        )
      }

      const resolved: Array<{
        name: string
        effects: string
        type: 'regular' | 'bonus'
      }> = []

      // Resolve regular traits
      regularTraits.forEach(traitId => {
        const trait = traits.find(t => t.edid === traitId)
        if (trait) {
          resolved.push({
            name: trait.name,
            effects: formatForDiscord(trait.description || 'No effects'),
            type: 'regular',
          })
        }
      })

      // Resolve bonus traits
      bonusTraits.forEach(traitId => {
        const trait = traits.find(t => t.edid === traitId)
        if (trait) {
          resolved.push({
            name: trait.name,
            effects: formatForDiscord(trait.description || 'No effects'),
            type: 'bonus',
          })
        }
      })

      return resolved
    },
    [],
    'traits'
  )
}

/**
 * Resolve religion data from EDID
 */
function resolveReligion(religionId: string | null): {
  name: string
  effects: string
  tenets?: string
  followerBoon?: string
  devoteeBoon?: string
} {
  if (!religionId) return { name: 'Not selected', effects: 'No effects' }

  return safeResolve(
    () => {
      const religions = useReligionsStore.getState().data

      // Check if data is loaded
      if (religions.length === 0) {
        throw new Error(
          'Religions data not loaded yet. Please wait a moment and try again.'
        )
      }

      // Try to find religion using the same logic as findReligionById
      // This handles the ID format mismatch between selection and storage
      const religion = religions.find(
        r =>
          r.id === religionId ||
          r.name === religionId ||
          r.name.toLowerCase().replace(/\s+/g, '-') === religionId
      )

      if (!religion) return { name: 'Unknown Religion', effects: 'No effects' }

      // Extract tenets from the first tenet effect description
      const tenets =
        religion.tenet?.effects?.[0]?.effectDescription ||
        religion.tenet?.description ||
        undefined

      // Extract follower boon (boon1) from the first effect description
      const followerBoon =
        religion.boon1?.effects?.[0]?.effectDescription ||
        religion.boon1?.spellName ||
        undefined

      // Extract devotee boon (boon2) from the first effect description
      const devoteeBoon =
        religion.boon2?.effects?.[0]?.effectDescription ||
        religion.boon2?.spellName ||
        undefined

      return {
        name: religion.name,
        effects: formatForDiscord(religion.type || 'No effects'),
        tenets: tenets ? formatForDiscord(tenets) : undefined,
        followerBoon: followerBoon ? formatForDiscord(followerBoon) : undefined,
        devoteeBoon: devoteeBoon ? formatForDiscord(devoteeBoon) : undefined,
      }
    },
    { name: 'Unknown Religion', effects: 'No effects' },
    'religion'
  )
}

/**
 * Resolve favorite blessing data from EDID
 */
function resolveFavoriteBlessing(blessingId: string | null): {
  name: string
  effects: string
  source: string
} {
  if (!blessingId)
    return { name: 'Not selected', effects: 'No effects', source: 'None' }

  return safeResolve(
    () => {
      const blessings = useBlessingsStore.getState().data

      // Check if data is loaded
      if (blessings.length === 0) {
        throw new Error(
          'Blessings data not loaded yet. Please wait a moment and try again.'
        )
      }

      // Try to find blessing by ID
      const blessing = blessings.find(b => b.id === blessingId)

      if (!blessing)
        return {
          name: 'Unknown Blessing',
          effects: 'No effects',
          source: 'Unknown',
        }

      // Format effects as a summary
      const effectsSummary = blessing.effects
        .slice(0, 2) // Show first 2 effects
        .map(effect => effect.name)
        .join(', ')

      return {
        name: blessing.blessingName,
        effects: formatForDiscord(effectsSummary || 'No effects'),
        source: blessing.name,
      }
    },
    { name: 'Unknown Blessing', effects: 'No effects', source: 'Unknown' },
    'favorite blessing'
  )
}

/**
 * Resolve skills data from EDIDs
 */
function resolveSkills(
  majorSkills: string[],
  minorSkills: string[],
  skillLevels: Record<string, number>
): {
  major: Array<{ name: string; level?: number }>
  minor: Array<{ name: string; level?: number }>
  other: Array<{ name: string; level?: number }>
} {
  return safeResolve(
    () => {
      const skills = useSkillsStore.getState().data

      // Check if data is loaded
      if (skills.length === 0) {
        throw new Error(
          'Skills data not loaded yet. Please wait a moment and try again.'
        )
      }

      const resolveSkillArray = (skillIds: string[]) =>
        skillIds.map(skillId => {
          const skill = skills.find(s => s.edid === skillId)
          const level = skillLevels[skillId]
          return {
            name: skill?.name || 'Unknown Skill',
            level: level || undefined,
          }
        })

      return {
        major: resolveSkillArray(majorSkills),
        minor: resolveSkillArray(minorSkills),
        other: [], // Skills with perks but not assigned as major/minor
      }
    },
    { major: [], minor: [], other: [] },
    'skills'
  )
}

/**
 * Resolve perks data from EDIDs
 */
function resolvePerks(
  selectedPerks: Record<string, string[]>,
  perkRanks: Record<string, number>
): Array<{
  skillName: string
  perks: Array<{ name: string; effects: string; rank?: number }>
}> {
  return safeResolve(
    () => {
      const skills = useSkillsStore.getState().data
      const perkTrees = usePerkTreesStore.getState().data

      // Check if data is loaded
      if (skills.length === 0) {
        throw new Error(
          'Skills data not loaded yet. Please wait a moment and try again.'
        )
      }
      if (perkTrees.length === 0) {
        throw new Error(
          'Perk trees data not loaded yet. Please wait a moment and try again.'
        )
      }

      return Object.entries(selectedPerks)
        .map(([skillId, perkIds]) => {
          const skill = skills.find(s => s.edid === skillId)
          const perkTree = perkTrees.find(pt => pt.treeId === skillId)

          // Create a map to track unique perks and their ranks
          const uniquePerks = new Map<
            string,
            { name: string; effects: string; rank?: number }
          >()

          perkIds.forEach(perkId => {
            // Try to find perk by EDID first (this is the most common case)
            let perk = perkTree?.perks.find(p => p.edid === perkId)

            // If not found, try to find by name (case insensitive)
            if (!perk) {
              perk = perkTree?.perks.find(
                p => p.name.toLowerCase() === perkId.toLowerCase()
              )
            }

            // If still not found, try to find by ID (fallback)
            if (!perk) {
              // This is a fallback - the new structure uses edid as the primary identifier
              console.warn(`Perk lookup fallback for ID: ${perkId}`)
            }

            const rank = perkRanks[perkId]

            if (!perk) {
              console.warn(
                `Perk not found for ID: ${perkId} in skill: ${skillId}. Available perks: ${perkTree?.perks.map(p => p.edid).join(', ')}`
              )
            }

            // Get the description from the first rank if available
            const description =
              perk?.ranks?.[0]?.description?.base || 'No effects'

            const perkKey = perk?.edid || perkId
            const currentRank = uniquePerks.get(perkKey)?.rank || 0

            // Only update if this rank is higher than what we've seen
            if (rank && rank > currentRank) {
              uniquePerks.set(perkKey, {
                name: perk?.name || 'Unknown Perk',
                effects: formatForDiscord(description),
                rank: rank,
              })
            } else if (!uniquePerks.has(perkKey)) {
              // If no rank specified or first occurrence, add it
              uniquePerks.set(perkKey, {
                name: perk?.name || 'Unknown Perk',
                effects: formatForDiscord(description),
                rank: rank || undefined,
              })
            }
          })

          return {
            skillName: skill?.name || 'Unknown Skill',
            perks: Array.from(uniquePerks.values()),
          }
        })
        .filter(group => group.perks.length > 0)
    },
    [],
    'perks'
  )
}

/**
 * Resolve destiny path data from IDs
 */
function resolveDestinyPath(
  destinyPath: string[]
): Array<{ name: string; effects?: string }> {
  if (destinyPath.length === 0) return []

  return safeResolve(
    () => {
      const destinyNodes = useDestinyNodesStore.getState().data

      // Check if data is loaded
      if (destinyNodes.length === 0) {
        throw new Error(
          'Destiny nodes data not loaded yet. Please wait a moment and try again.'
        )
      }

      return destinyPath.map(nodeId => {
        // Try to find node by edid first (most common case for destiny paths)
        let node = destinyNodes.find(n => n.edid === nodeId)

        // If not found by edid, try by id
        if (!node) {
          node = destinyNodes.find(n => n.id === nodeId)
        }

        // If still not found, try by name (fallback)
        if (!node) {
          node = destinyNodes.find(n => n.name === nodeId)
        }

        return {
          name: node?.name || 'Unknown Destiny',
          effects: node?.description
            ? formatForDiscord(node.description)
            : undefined,
        }
      })
    },
    [],
    'destiny path'
  )
}

/**
 * Extract skill themes for tag generation
 */
function extractSkillThemes(skills: Array<{ name: string }>): string[] {
  const themes: string[] = []
  const skillNames = skills.map(s => s.name.toLowerCase())

  // Combat themes
  if (
    skillNames.some(s => s.includes('one-handed') || s.includes('two-handed'))
  ) {
    themes.push('melee')
  }
  if (skillNames.some(s => s.includes('archery'))) {
    themes.push('archery')
  }
  if (skillNames.some(s => s.includes('magic') || s.includes('destruction'))) {
    themes.push('magic')
  }
  if (skillNames.some(s => s.includes('stealth') || s.includes('sneak'))) {
    themes.push('stealth')
  }
  if (
    skillNames.some(s => s.includes('smithing') || s.includes('enchanting'))
  ) {
    themes.push('crafting')
  }

  return themes
}

/**
 * Extract trait themes for tag generation
 */
function extractTraitThemes(
  traits: Array<{ name: string; type: 'regular' | 'bonus' }>
): string[] {
  const themes: string[] = []
  const traitNames = traits.map(t => t.name.toLowerCase())

  // Add theme detection logic based on trait names
  if (traitNames.some(t => t.includes('warrior') || t.includes('combat'))) {
    themes.push('warrior')
  }
  if (traitNames.some(t => t.includes('mage') || t.includes('magic'))) {
    themes.push('mage')
  }
  if (traitNames.some(t => t.includes('thief') || t.includes('stealth'))) {
    themes.push('thief')
  }
  if (traitNames.some(t => t.includes('archer') || t.includes('ranged'))) {
    themes.push('archer')
  }

  return themes
}

/**
 * Generate relevant hashtags for Discord
 */
function generateTags(
  race: { name: string },
  skills: { major: Array<{ name: string }>; minor: Array<{ name: string }> },
  traits: Array<{ name: string; type: 'regular' | 'bonus' }>
): string[] {
  const tags = ['lorerim']

  // Race tag
  if (race.name !== 'Not selected') {
    const raceTag = race.name.toLowerCase().replace(/\s+/g, '')
    tags.push(raceTag)
  }

  // Skill theme tags
  const allSkills = [...skills.major, ...skills.minor]
  const skillThemes = extractSkillThemes(allSkills)
  tags.push(...skillThemes)

  // Trait theme tags
  const traitThemes = extractTraitThemes(traits)
  tags.push(...traitThemes)

  return tags.slice(0, 5) // Limit to 5 tags
}

/**
 * Hydrate build data by resolving all EDIDs to display names and effects
 */
export function hydrateBuildData(build: BuildState): HydratedBuildData {
  // Resolve basic information
  const race = resolveRace(build.race)
  const birthSign = resolveBirthSign(build.stone)
  const religion = resolveReligion(build.religion)
  const favoriteBlessing = resolveFavoriteBlessing(build.favoriteBlessing)
  const traits = resolveTraits(build.traits.regular, build.traits.bonus)
  const skills = resolveSkills(
    build.skills.major,
    build.skills.minor,
    build.skillLevels
  )
  const perks = resolvePerks(build.perks.selected, build.perks.ranks)
  const destinyPath = resolveDestinyPath(build.destinyPath)

  // Generate tags
  const tags = generateTags(race, skills, traits)

  // NEW: Extract attribute assignments with level counts and race base stats
  const attributeAssignments = build.attributeAssignments.assignments || {}

  // Count how many levels were assigned to each attribute
  const healthLevels = Object.values(attributeAssignments).filter(
    attr => attr === 'health'
  ).length
  const staminaLevels = Object.values(attributeAssignments).filter(
    attr => attr === 'stamina'
  ).length
  const magickaLevels = Object.values(attributeAssignments).filter(
    attr => attr === 'magicka'
  ).length

  // Get race base stats
  const races = useRacesStore.getState().data
  const selectedRace = races.find(r => r.edid === build.race)
  const raceBaseStats = selectedRace?.startingStats || {
    health: 100,
    stamina: 100,
    magicka: 100,
  }

  // Calculate total attributes (race base + level assignments * 5)
  const totalHealth =
    raceBaseStats.health + (build.attributeAssignments.health || 0) * 5
  const totalStamina =
    raceBaseStats.stamina + (build.attributeAssignments.stamina || 0) * 5
  const totalMagicka =
    raceBaseStats.magicka + (build.attributeAssignments.magicka || 0) * 5

  // Calculate total character level (base level 1 + all attribute assignments)
  const totalCharacterLevel =
    1 +
    (build.attributeAssignments.health || 0) +
    (build.attributeAssignments.stamina || 0) +
    (build.attributeAssignments.magicka || 0)

  const attributes = {
    level: totalCharacterLevel,
    health: totalHealth,
    stamina: totalStamina,
    magicka: totalMagicka,
    healthLevels,
    staminaLevels,
    magickaLevels,
    totalPoints:
      (build.attributeAssignments.health || 0) +
      (build.attributeAssignments.stamina || 0) +
      (build.attributeAssignments.magicka || 0),
  }

  return {
    name: build.name || 'Unnamed Character',
    notes: build.notes || '',
    race,
    birthSign,
    traits,
    religion,
    favoriteBlessing,
    skills,
    perks,
    destinyPath,
    tags,
    attributes, // NEW
  }
}
