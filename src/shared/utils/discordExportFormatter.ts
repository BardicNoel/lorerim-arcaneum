import type { HydratedBuildData } from '../types/discordExport'

/**
 * Format build data for Discord export (names only)
 * Optimized for Discord's 2000 character limit
 */
export function formatBuildForDiscordNamesOnly(
  data: HydratedBuildData,
  buildLink?: string
): string {
  const lines: string[] = []

  // Build header
  lines.push(`**🛡️ Build: ${data.name || 'Unnamed Character'}**`)
  if (data.notes) {
    lines.push(`*${data.notes}*`)
  }
  lines.push('')

  // Build Link
  if (buildLink) {
    lines.push(`[Arcaneum Build Link](${buildLink})`)
    lines.push('')
  }

  // Race
  lines.push(`__🧬 Race__`)
  lines.push(`${data.race.name}`)
  lines.push('')

  // Birth Sign
  lines.push(`__🌌 Birth Sign__`)
  lines.push(`${data.birthSign.name}`)
  lines.push('')

  // Traits
  if (data.traits.length > 0) {
    lines.push(`__🧠 Traits__`)
    data.traits.forEach(trait => {
      const typeIndicator = trait.type === 'bonus' ? ' (Late Game)' : ''
      lines.push(`**${trait.name}${typeIndicator}**`)
    })
    lines.push('')
  }

  // Religion
  lines.push(`__✝️ Religion__`)
  lines.push(`${data.religion.name}`)
  if (data.religion.tenets) {
    lines.push(`• **Tenets:** ${data.religion.tenets}`)
  }
  if (data.religion.followerBoon) {
    lines.push(`• **Follower:** ${data.religion.followerBoon}`)
  }
  if (data.religion.devoteeBoon) {
    lines.push(`• **Devotee:** ${data.religion.devoteeBoon}`)
  }
  lines.push('')

  // Favorite Blessing
  lines.push(`__✨ Favorite Blessing__`)
  lines.push(`${data.favoriteBlessing.name}`)
  if (data.favoriteBlessing.source !== 'None') {
    lines.push(`• **Source:** ${data.favoriteBlessing.source}`)
  }
  if (data.favoriteBlessing.effects !== 'No effects') {
    lines.push(`• **Effects:** ${data.favoriteBlessing.effects}`)
  }
  lines.push('')

  // NEW: Attributes
  lines.push(`__⚔️ Attributes (Level ${data.attributes.level})__`)
  const attributeParts = []
  if (data.attributes.health > 0) {
    attributeParts.push(`Health: ${data.attributes.health}`)
  }
  if (data.attributes.stamina > 0) {
    attributeParts.push(`Stamina: ${data.attributes.stamina}`)
  }
  if (data.attributes.magicka > 0) {
    attributeParts.push(`Magicka: ${data.attributes.magicka}`)
  }
  if (attributeParts.length > 0) {
    lines.push(attributeParts.join(', '))
  } else {
    lines.push('No attribute points assigned')
  }
  lines.push('')

  // Skills
  lines.push(`__📚 Skills__`)
  if (data.skills.major.length > 0) {
    const majorSkills = data.skills.major
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Major:** ${majorSkills}`)
  }
  if (data.skills.minor.length > 0) {
    const minorSkills = data.skills.minor
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Minor:** ${minorSkills}`)
  }
  if (data.skills.other.length > 0) {
    const otherSkills = data.skills.other
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Other:** ${otherSkills}`)
  }
  lines.push('')

  // Perks
  if (data.perks.length > 0) {
    lines.push(`__🎯 Perks__`)
    data.perks.forEach(skillGroup => {
      lines.push(`**${skillGroup.skillName}:**`)
      skillGroup.perks.forEach(perk => {
        const rankText =
          perk.rank && perk.rank > 1 ? ` (Rank ${perk.rank})` : ''
        lines.push(`• **${perk.name}${rankText}**`)
      })
      lines.push('')
    })
  }

  // Destiny Path - Keep detailed as requested
  if (data.destinyPath.length > 0) {
    lines.push(`__🌟 Destiny Path__`)
    data.destinyPath.forEach(node => {
      lines.push(`**${node.name}**`)
      if (node.effects) {
        lines.push(`${node.effects}`)
      }
      lines.push('')
    })
  }

  // Tags
  if (data.tags.length > 0) {
    lines.push('')
    lines.push(data.tags.map(tag => `#${tag}`).join(' '))
  }

  return lines.join('\n')
}

/**
 * Format build data for Discord export (full details)
 * Includes all effects and descriptions
 */
export function formatBuildForDiscord(
  data: HydratedBuildData,
  buildLink?: string
): string {
  const lines: string[] = []

  // Build header
  lines.push(`**🛡️ Build: ${data.name || 'Unnamed Character'}**`)
  if (data.notes) {
    lines.push(`*${data.notes}*`)
  }
  lines.push('')

  // Build Link
  if (buildLink) {
    lines.push(`[Arcaneum Build Link](${buildLink})`)
    lines.push('')
  }

  // Race
  lines.push(`__🧬 Race__`)
  lines.push(`${data.race.name}`)
  lines.push('')

  // Birth Sign
  lines.push(`__🌌 Birth Sign__`)
  lines.push(`${data.birthSign.name}`)
  lines.push('')

  // Traits
  if (data.traits.length > 0) {
    lines.push(`__🧠 Traits__`)
    data.traits.forEach(trait => {
      const typeIndicator = trait.type === 'bonus' ? ' (Late Game)' : ''
      lines.push(`**${trait.name}${typeIndicator}**`)
    })
    lines.push('')
  }

  // Religion
  lines.push(`__✝️ Religion__`)
  lines.push(`${data.religion.name}`)
  if (data.religion.tenets) {
    lines.push(`• **Tenets:** ${data.religion.tenets}`)
  }
  if (data.religion.followerBoon) {
    lines.push(`• **Follower:** ${data.religion.followerBoon}`)
  }
  if (data.religion.devoteeBoon) {
    lines.push(`• **Devotee:** ${data.religion.devoteeBoon}`)
  }
  lines.push('')

  // Favorite Blessing
  lines.push(`__✨ Favorite Blessing__`)
  lines.push(`${data.favoriteBlessing.name}`)
  if (data.favoriteBlessing.source !== 'None') {
    lines.push(`• **Source:** ${data.favoriteBlessing.source}`)
  }
  if (data.favoriteBlessing.effects !== 'No effects') {
    lines.push(`• **Effects:** ${data.favoriteBlessing.effects}`)
  }
  lines.push('')

  // NEW: Attributes
  lines.push(`__⚔️ Attributes (Level ${data.attributes.level})__`)
  const attributeParts = []
  if (data.attributes.health > 0) {
    attributeParts.push(`Health: ${data.attributes.health}`)
  }
  if (data.attributes.stamina > 0) {
    attributeParts.push(`Stamina: ${data.attributes.stamina}`)
  }
  if (data.attributes.magicka > 0) {
    attributeParts.push(`Magicka: ${data.attributes.magicka}`)
  }
  if (attributeParts.length > 0) {
    lines.push(attributeParts.join(', '))
  } else {
    lines.push('No attribute points assigned')
  }
  lines.push('')

  // Skills
  lines.push(`__📚 Skills__`)
  if (data.skills.major.length > 0) {
    const majorSkills = data.skills.major
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Major:** ${majorSkills}`)
  }
  if (data.skills.minor.length > 0) {
    const minorSkills = data.skills.minor
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Minor:** ${minorSkills}`)
  }
  if (data.skills.other.length > 0) {
    const otherSkills = data.skills.other
      .map(s => (s.level ? `${s.name} (Level ${s.level})` : s.name))
      .join(', ')
    lines.push(`**Other:** ${otherSkills}`)
  }
  lines.push('')

  // Perks
  if (data.perks.length > 0) {
    lines.push(`__🎯 Perks__`)
    data.perks.forEach(skillGroup => {
      lines.push(`**${skillGroup.skillName}:**`)
      skillGroup.perks.forEach(perk => {
        const rankText =
          perk.rank && perk.rank > 1 ? ` (Rank ${perk.rank})` : ''
        lines.push(`• **${perk.name}${rankText}**`)
      })
      lines.push('')
    })
  }

  // Destiny Path - Keep detailed as requested
  if (data.destinyPath.length > 0) {
    lines.push(`__🌟 Destiny Path__`)
    data.destinyPath.forEach(node => {
      lines.push(`**${node.name}**`)
      if (node.effects) {
        lines.push(`${node.effects}`)
      }
      lines.push('')
    })
  }

  // Tags
  if (data.tags.length > 0) {
    lines.push('')
    lines.push(data.tags.map(tag => `#${tag}`).join(' '))
  }

  return lines.join('\n')
}

/**
 * Format text for Discord compatibility
 * Removes markdown formatting that doesn't work in Discord
 */
export function formatForDiscord(text: string): string {
  if (!text) return ''

  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '**$1**') // Convert *** to **
    .replace(/<(\d+)>/g, 'Level $1') // Convert <N> to Level N
    .replace(/\n+/g, ' ') // Convert newlines to spaces
    .trim()
}
