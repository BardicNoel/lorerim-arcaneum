import { getEffectIcon } from '../../../shared/config/icons'
import { effectTypeColors, groupColors } from '../../../shared/config/theme'

export interface BirthsignGroupStyle {
  background: string
  text: string
  border: string
  hover: string
}

export const birthsignGroupStyles: Record<string, BirthsignGroupStyle> = {
  Warrior: {
    background: 'bg-red-200',
    text: 'text-red-800',
    border: 'border-red-300',
    hover: 'hover:bg-red-300',
  },
  Mage: {
    background: 'bg-blue-200',
    text: 'text-blue-800',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-300',
  },
  Thief: {
    background: 'bg-green-200',
    text: 'text-green-800',
    border: 'border-green-300',
    hover: 'hover:bg-green-300',
  },
  Serpent: {
    background: 'bg-purple-200',
    text: 'text-purple-800',
    border: 'border-purple-300',
    hover: 'hover:bg-purple-300',
  },
  Other: {
    background: 'bg-yellow-200',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    hover: 'hover:bg-yellow-300',
  },
}

function isGroupKey(group: string): group is keyof typeof groupColors {
  return group in groupColors
}

export function getBirthsignGroupStyle(group: string): BirthsignGroupStyle {
  return birthsignGroupStyles[group] || birthsignGroupStyles['Other']
}

export function getBirthsignGroupColor(group: string): string {
  return isGroupKey(group) ? groupColors[group] : groupColors['Other']
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
