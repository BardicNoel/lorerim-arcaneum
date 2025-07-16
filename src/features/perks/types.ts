export interface PerkEffect {
  type: string;
  function: string;
  priority: number;
  conditions: Array<{
    operator: string;
    functionIndex: number;
    comparisonValue: number;
    runOnType: string;
    parameter1: number;
    parameter2: number;
  }>;
  entryPointData: string;
}

export interface PerkPrerequisite {
  skillLevel?: {
    skill: string;
    level: number;
  };
  items?: Array<{
    type: string;
    id: string;
  }>;
  perks?: Array<{
    type: string;
    id: string;
  }>;
}

export interface PerkTree {
  treeId: string;
  treeName: string;
  treeDescription: string;
  category: string;
  perks: PerkNode[];
}

export interface PerkNode {
  perkId: string; // Unique perk ID
  perkName: string;
  perkDescription: string;
  level: number;
  ranks: number;
  isPlayable: boolean;
  isHidden: boolean;
  position: {
    x: number;
    y: number;
    horizontal: number;
    vertical: number;
    index: number;
  };
  connections: number[];
  effects: PerkEffect[];
  prerequisites: PerkPrerequisite;
  uniquenessFactors: string[];
  // Additional fields for our app
  currentRank: number;
  selected: boolean;
  skill: string; // Will be set from tree data
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
