import { groupColors, effectTypeColors } from '@/shared/config/theme'
import { getEffectIcon } from '@/shared/config/icons'

export interface BirthsignGroupStyle {
  background: string
  text: string
  border: string
  hover: string
}

export const birthsignGroupStyles: Record<string, BirthsignGroupStyle> = {
  Warrior: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    hover: 'hover:bg-red-200',
  },
  Mage: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-200',
  },
  Thief: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    hover: 'hover:bg-green-200',
  },
  Serpent: {
    background: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-200',
  },
  Other: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    hover: 'hover:bg-yellow-200',
  },
}

export function getBirthsignGroupStyle(group: string): BirthsignGroupStyle {
  return birthsignGroupStyles[group] || birthsignGroupStyles['Other']
}

export function getBirthsignGroupColor(group: string): string {
  return groupColors[group as keyof typeof groupColors] || groupColors['Other']
}

export function getBirthsignEffectIcon(effectType: string) {
  return getEffectIcon(effectType)
}

export function getBirthsignEffectTypeColor(
  type: 'bonus' | 'penalty' | 'conditional' | 'mastery'
): string {
  switch (type) {
    case 'bonus':
      return effectTypeColors.positive
    case 'penalty':
      return effectTypeColors.negative
    case 'conditional':
      return effectTypeColors.conditional
    case 'mastery':
      return effectTypeColors.mastery
    default:
      return effectTypeColors.neutral
  }
}
