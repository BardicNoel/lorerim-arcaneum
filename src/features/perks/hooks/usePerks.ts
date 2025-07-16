import { useState, useEffect } from "react";
import type { PerkNode, PerkPlan, Skill, PerkTree } from "../types";

export function usePerks() {
  const [perkTrees, setPerkTrees] = useState<PerkTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/perk-trees.json`
        );
        if (!response.ok) {
          throw new Error("Failed to load perk trees data");
        }
        const data: PerkTree[] = await response.json();
        // Add selection/rank state to each perk
        const treesWithState = data.map((tree) => ({
          ...tree,
          perks: tree.perks.map((perk) => ({
            ...perk,
            currentRank: 0,
            selected: false,
          })),
        }));
        setPerkTrees(treesWithState);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    loadPerks();
  }, []);

  // Helper to get a tree by id
  const getTreeById = (treeId: string) =>
    perkTrees.find((tree) => tree.treeId === treeId);

  return { perkTrees, getTreeById, loading, error };
}

// Perk plan state is now per-tree
export function usePerkPlan(tree: PerkTree | undefined) {
  const [perkPlan, setPerkPlan] = useState<PerkPlan>({
    selectedPerks: {},
    minLevels: {},
    totalPerks: 0,
  });

  // Toggle selection for a perk in the current tree
  const togglePerk = (perkId: string) => {
    if (!tree) return;
    setPerkPlan((prev) => {
      const skill = tree.treeName;
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.perkId === perkId);
      if (perkIndex >= 0) {
        // Remove
        const newSkillPerks = skillPerks.filter((p) => p.perkId !== perkId);
        return {
          ...prev,
          selectedPerks: { ...prev.selectedPerks, [skill]: newSkillPerks },
          totalPerks: prev.totalPerks - 1,
        };
      } else {
        // Add
        const perkToAdd = tree.perks.find((p) => p.perkId === perkId);
        if (perkToAdd) {
          const newSkillPerks = [
            ...skillPerks,
            { ...perkToAdd, selected: true },
          ];
          return {
            ...prev,
            selectedPerks: { ...prev.selectedPerks, [skill]: newSkillPerks },
            totalPerks: prev.totalPerks + 1,
          };
        }
        return prev;
      }
    });
  };

  const updatePerkRank = (perkId: string, newRank: number) => {
    if (!tree) return;
    setPerkPlan((prev) => {
      const skill = tree.treeName;
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.perkId === perkId);
      if (perkIndex >= 0) {
        const updatedPerks = [...skillPerks];
        updatedPerks[perkIndex] = {
          ...updatedPerks[perkIndex],
          currentRank: Math.max(
            0,
            Math.min(newRank, updatedPerks[perkIndex].ranks)
          ),
        };
        return {
          ...prev,
          selectedPerks: { ...prev.selectedPerks, [skill]: updatedPerks },
        };
      }
      return prev;
    });
  };

  const clearSkill = () => {
    if (!tree) return;
    setPerkPlan((prev) => {
      const skill = tree.treeName;
      const skillPerks = prev.selectedPerks[skill] || [];
      const newSelectedPerks = { ...prev.selectedPerks };
      delete newSelectedPerks[skill];
      return {
        ...prev,
        selectedPerks: newSelectedPerks,
        totalPerks: prev.totalPerks - skillPerks.length,
      };
    });
  };

  const clearAll = () => {
    setPerkPlan({ selectedPerks: {}, minLevels: {}, totalPerks: 0 });
  };

  return { perkPlan, togglePerk, updatePerkRank, clearSkill, clearAll };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  // Map tree names to our skill names
  useEffect(() => {
    const skillMapping: Record<string, Skill> = {
      Smithing: {
        id: "smithing",
        name: "Smithing",
        icon: "⚒️",
        description: "Craft weapons and armor",
        selectedPerks: 0,
        minLevel: 0,
      },
      Destruction: {
        id: "destruction",
        name: "Destruction",
        icon: "🔥",
        description: "Master destructive magic",
        selectedPerks: 0,
        minLevel: 0,
      },
      Enchanting: {
        id: "enchanting",
        name: "Enchanting",
        icon: "💎",
        description: "Imbue items with magical properties",
        selectedPerks: 0,
        minLevel: 0,
      },
      Restoration: {
        id: "restoration",
        name: "Restoration",
        icon: "✨",
        description: "Healing and protective magic",
        selectedPerks: 0,
        minLevel: 0,
      },
      Mysticism: {
        id: "mysticism",
        name: "Mysticism",
        icon: "🔮",
        description: "Master mystical arts",
        selectedPerks: 0,
        minLevel: 0,
      },
      Conjuration: {
        id: "conjuration",
        name: "Conjuration",
        icon: "👻",
        description: "Summon creatures and bound weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
      Alteration: {
        id: "alteration",
        name: "Alteration",
        icon: "🔄",
        description: "Transform and manipulate",
        selectedPerks: 0,
        minLevel: 0,
      },
      Speechcraft: {
        id: "speechcraft",
        name: "Speechcraft",
        icon: "💬",
        description: "Persuasion and bartering",
        selectedPerks: 0,
        minLevel: 0,
      },
      Alchemy: {
        id: "alchemy",
        name: "Alchemy",
        icon: "🧪",
        description: "Brew potions and poisons",
        selectedPerks: 0,
        minLevel: 0,
      },
      Sneak: {
        id: "sneak",
        name: "Sneak",
        icon: "👤",
        description: "Stealth and subterfuge",
        selectedPerks: 0,
        minLevel: 0,
      },
      Lockpicking: {
        id: "lockpicking",
        name: "Lockpicking",
        icon: "🔓",
        description: "Pick locks and disarm traps",
        selectedPerks: 0,
        minLevel: 0,
      },
      Pickpocket: {
        id: "pickpocket",
        name: "Pickpocket",
        icon: "👛",
        description: "Steal from others unnoticed",
        selectedPerks: 0,
        minLevel: 0,
      },
      "Light Armor": {
        id: "light_armor",
        name: "Light Armor",
        icon: "🥋",
        description: "Master light armor techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      "Heavy Armor": {
        id: "heavy_armor",
        name: "Heavy Armor",
        icon: "🛡️",
        description: "Master heavy armor techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      Block: {
        id: "block",
        name: "Block",
        icon: "🛡️",
        description: "Defensive blocking techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      Marksman: {
        id: "marksman",
        name: "Marksman",
        icon: "🏹",
        description: "Master the bow and arrow",
        selectedPerks: 0,
        minLevel: 0,
      },
      "Two Handed": {
        id: "two_handed",
        name: "Two-Handed",
        icon: "⚔️",
        description: "Master two-handed weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
      "One Handed": {
        id: "one_handed",
        name: "One-Handed",
        icon: "🗡️",
        description: "Master one-handed weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
    };

    setSkills(Object.values(skillMapping));
  }, []);

  return { skills };
}
