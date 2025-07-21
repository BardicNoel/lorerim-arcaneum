export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  muted: string
  destructive: string
  border: string
  skyrim: {
    gold: string
    dark: string
  }
}

export interface EffectTypeColors {
  positive: string
  negative: string
  neutral: string
  conditional: string
  mastery: string
}

export interface GroupColors {
  Warrior: string
  Mage: string
  Thief: string
  Serpent: string
  Other: string
}

export const themeColors: ThemeColors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  destructive: 'hsl(var(--destructive))',
  border: 'hsl(var(--border))',
  skyrim: {
    gold: '#d4af37',
    dark: '#1e1e1e',
  },
}

export const effectTypeColors: EffectTypeColors = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-skyrim-gold',
  conditional: 'text-purple-600',
  mastery: 'text-blue-600',
}

export const groupColors: GroupColors = {
  Warrior: 'text-red-600',
  Mage: 'text-blue-600',
  Thief: 'text-green-600',
  Serpent: 'text-purple-600',
  Other: 'text-yellow-500',
} 