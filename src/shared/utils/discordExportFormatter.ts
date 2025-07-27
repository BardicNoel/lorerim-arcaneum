import type { HydratedBuildData } from '../types/discordExport'

/**
 * Format build data for Discord export
 * Follows the exact template specified in the Discord export spec
 */
export function formatBuildForDiscord(data: HydratedBuildData): string {
  const lines: string[] = []

  // Build header
  lines.push(`**🛡️ Build: ${data.name || 'Unnamed Character'}**`)
  if (data.notes) {
    lines.push(`*${data.notes}*`)
  }
  lines.push('')

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
