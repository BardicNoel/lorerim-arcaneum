export interface PerkEffect {
  type: string;
  value: number;
  target: string;
  name?: string;
  cooldown?: number;
}

export interface PerkNode {
  id: string; // Unique perk ID
  skill: string; // e.g., "Archery"
  name: string;
  description: string;
  levelRequirement: number;
  currentRank: number;
  maxRank: number;
  prerequisites: string[]; // IDs of required perks
  selected: boolean;
  position: { x: number; y: number }; // For React Flow layout
  category: string;
  tier: number;
  effects: PerkEffect[];
}

export interface PerkEdge {
  id: string; // Unique edge ID
  source: string; // PerkNode.id (prerequisite)
  target: string; // PerkNode.id (dependent perk)
  type: "and" | "or";
}

export interface PerkPlan {
  selectedPerks: Record<string, PerkNode[]>; // keyed by skill
  minLevels: Record<string, number>; // skill -> min level
  totalPerks: number;
}

export interface PerkFilters {
  search: string;
  category: string;
  tier: number;
  selected: boolean;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  selectedPerks: number;
  minLevel: number;
}
