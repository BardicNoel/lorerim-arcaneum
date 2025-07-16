import { useState, useEffect } from "react";
import type { PerkNode, PerkPlan, Skill } from "../types";

export function usePerks() {
  const [perks, setPerks] = useState<PerkNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerks = async () => {
      try {
        const response = await fetch("/data/perks.json");
        if (!response.ok) {
          throw new Error("Failed to load perks data");
        }
        const data = await response.json();

        // Transform the data to match our PerkNode interface
        const transformedPerks: PerkNode[] = data.map(
          (perk: Record<string, unknown>) => ({
            ...perk,
            skill: perk.category, // Map category to skill for now
            currentRank: 0,
            selected: false,
            position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
          })
        );

        setPerks(transformedPerks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadPerks();
  }, []);

  return { perks, loading, error };
}

export function usePerkPlan() {
  const [perkPlan, setPerkPlan] = useState<PerkPlan>({
    selectedPerks: {},
    minLevels: {},
    totalPerks: 0,
  });

  const togglePerk = (perkId: string, skill: string) => {
    setPerkPlan((prev) => {
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.id === perkId);

      if (perkIndex >= 0) {
        // Remove perk
        const newSkillPerks = skillPerks.filter((p) => p.id !== perkId);
        const newSelectedPerks = {
          ...prev.selectedPerks,
          [skill]: newSkillPerks,
        };

        return {
          ...prev,
          selectedPerks: newSelectedPerks,
          totalPerks: prev.totalPerks - 1,
        };
      } else {
        // Add perk - we need to find the perk data
        // This would need to be implemented with the actual perk data
        return prev;
      }
    });
  };

  const updatePerkRank = (perkId: string, skill: string, newRank: number) => {
    setPerkPlan((prev) => {
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.id === perkId);

      if (perkIndex >= 0) {
        const updatedPerks = [...skillPerks];
        updatedPerks[perkIndex] = {
          ...updatedPerks[perkIndex],
          currentRank: Math.max(
            0,
            Math.min(newRank, updatedPerks[perkIndex].maxRank)
          ),
        };

        return {
          ...prev,
          selectedPerks: {
            ...prev.selectedPerks,
            [skill]: updatedPerks,
          },
        };
      }

      return prev;
    });
  };

  const clearSkill = (skill: string) => {
    setPerkPlan((prev) => {
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
    setPerkPlan({
      selectedPerks: {},
      minLevels: {},
      totalPerks: 0,
    });
  };

  return {
    perkPlan,
    togglePerk,
    updatePerkRank,
    clearSkill,
    clearAll,
  };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  // Mock skills data - this would come from a proper data source
  useEffect(() => {
    const mockSkills: Skill[] = [
      {
        id: "archery",
        name: "Archery",
        icon: "🏹",
        description: "Master the bow and arrow",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "smithing",
        name: "Smithing",
        icon: "⚒️",
        description: "Craft weapons and armor",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "destruction",
        name: "Destruction",
        icon: "🔥",
        description: "Master destructive magic",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "restoration",
        name: "Restoration",
        icon: "✨",
        description: "Healing and protective magic",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "alteration",
        name: "Alteration",
        icon: "🔄",
        description: "Transform and manipulate",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "conjuration",
        name: "Conjuration",
        icon: "👻",
        description: "Summon creatures and bound weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "illusion",
        name: "Illusion",
        icon: "🎭",
        description: "Mind manipulation and invisibility",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "enchanting",
        name: "Enchanting",
        icon: "💎",
        description: "Imbue items with magical properties",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "alchemy",
        name: "Alchemy",
        icon: "🧪",
        description: "Brew potions and poisons",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "light_armor",
        name: "Light Armor",
        icon: "🥋",
        description: "Master light armor techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "heavy_armor",
        name: "Heavy Armor",
        icon: "🛡️",
        description: "Master heavy armor techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "block",
        name: "Block",
        icon: "🛡️",
        description: "Defensive blocking techniques",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "two_handed",
        name: "Two-Handed",
        icon: "⚔️",
        description: "Master two-handed weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "one_handed",
        name: "One-Handed",
        icon: "🗡️",
        description: "Master one-handed weapons",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "sneak",
        name: "Sneak",
        icon: "👤",
        description: "Stealth and subterfuge",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "lockpicking",
        name: "Lockpicking",
        icon: "🔓",
        description: "Pick locks and disarm traps",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "pickpocket",
        name: "Pickpocket",
        icon: "👛",
        description: "Steal from others unnoticed",
        selectedPerks: 0,
        minLevel: 0,
      },
      {
        id: "speech",
        name: "Speech",
        icon: "💬",
        description: "Persuasion and bartering",
        selectedPerks: 0,
        minLevel: 0,
      },
    ];

    setSkills(mockSkills);
  }, []);

  return { skills };
}
