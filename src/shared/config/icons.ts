import {
  Activity,
  BookOpen,
  Circle,
  Droplets,
  Eye,
  Flame,
  Hand,
  Heart,
  Zap as Lightning,
  Shield,
  Star,
  Sword,
  Target,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface EffectIconConfig {
  icon: LucideIcon
  color: string
  size?: 'sm' | 'md' | 'lg'
}

export const effectIcons: Record<string, EffectIconConfig> = {
  health: { icon: Heart, color: 'text-red-500' },
  magicka: { icon: Zap, color: 'text-blue-500' },
  stamina: { icon: Activity, color: 'text-green-500' },
  weapon_damage: { icon: Sword, color: 'text-orange-500' },
  armor_penetration: { icon: Target, color: 'text-purple-500' },
  unarmed_damage: { icon: Hand, color: 'text-yellow-500' },
  movement_speed: { icon: Circle, color: 'text-cyan-500' },
  sprint_speed: { icon: Circle, color: 'text-cyan-500' },
  carry_weight: { icon: Shield, color: 'text-gray-500' },
  spell_strength: { icon: BookOpen, color: 'text-indigo-500' },
  magicka_regeneration: { icon: Zap, color: 'text-blue-400' },
  lockpicking_durability: { icon: Eye, color: 'text-green-400' },
  lockpicking_expertise: { icon: Eye, color: 'text-green-400' },
  pickpocketing_success: { icon: Hand, color: 'text-green-400' },
  stealth_detection: { icon: Eye, color: 'text-purple-400' },
  speech: { icon: BookOpen, color: 'text-yellow-400' },
  shout_cooldown: { icon: Flame, color: 'text-red-400' },
  price_modification: { icon: Circle, color: 'text-gold-400' },
  damage_reflection: { icon: Shield, color: 'text-red-400' },
  poison_resistance: { icon: Droplets, color: 'text-green-400' },
  fire_resistance: { icon: Flame, color: 'text-orange-400' },
  enchanting_strength: { icon: BookOpen, color: 'text-purple-400' },
  power: { icon: Lightning, color: 'text-yellow-500' },
}

export function getEffectIcon(effectType: string): EffectIconConfig {
  return (
    effectIcons[effectType.toLowerCase()] || {
      icon: Star,
      color: 'text-muted-foreground',
    }
  )
} 