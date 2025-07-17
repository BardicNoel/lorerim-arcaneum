import { useState, useEffect, useCallback } from "react";
import type { PerkPlan, Skill, PerkTree } from "../types";

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

  // Helper function to get all prerequisites for a perk (recursive)
  const getAllPrerequisites = (perkId: string, visited = new Set<string>()): string[] => {
    if (!tree || visited.has(perkId)) return []; // Prevent cycles
    visited.add(perkId);
    
    const perk = tree.perks.find(p => p.perkId === perkId);
    if (!perk || !perk.prerequisites?.perks) return [];
    
    const prerequisites: string[] = [];
    perk.prerequisites.perks.forEach(prereq => {
      if (prereq.type === "PERK") {
        // Check if this prerequisite exists in our tree
        const existsInTree = tree.perks.some(p => p.perkId === prereq.id);
        if (existsInTree) {
          prerequisites.push(prereq.id);
          // Recursively get prerequisites of prerequisites
          const subPrereqs = getAllPrerequisites(prereq.id, visited);
          prerequisites.push(...subPrereqs);
        }
      }
    });
    
    return [...new Set(prerequisites)]; // Remove duplicates
  };

  // Helper function to get all descendants of a perk (recursive)
  const getAllDescendants = (perkId: string, visited = new Set<string>()): string[] => {
    if (!tree || visited.has(perkId)) return []; // Prevent cycles
    visited.add(perkId);
    
    const descendants: string[] = [];
    
    // Find all perks that have this perk as a prerequisite
    tree.perks.forEach(perk => {
      if (perk.prerequisites?.perks?.some(prereq => 
        prereq.type === "PERK" && prereq.id === perkId
      )) {
        descendants.push(perk.perkId);
        // Recursively get descendants of descendants
        const subDescendants = getAllDescendants(perk.perkId, visited);
        descendants.push(...subDescendants);
      }
    });
    
    return [...new Set(descendants)]; // Remove duplicates
  };

  // Toggle selection for a perk in the current tree
  const togglePerk = useCallback((perkId: string) => {
    if (!tree) return;
    console.log(`togglePerk called for ${perkId} in tree ${tree.treeName}`);
    setPerkPlan((prev) => {
      const skill = tree.treeName;
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.perkId === perkId);
      const perk = tree.perks.find((p) => p.perkId === perkId);
      
      if (!perk) return prev;
      
      if (perkIndex >= 0) {
        // Perk is already selected - handle based on rank
        const currentPerk = skillPerks[perkIndex];
        
        if (perk.ranks > 1) {
          // Multi-rank perk: cycle through ranks
          const currentRank = currentPerk.currentRank || 0;
          const nextRank = (currentRank + 1) % (perk.ranks + 1); // 0 -> 1 -> 2 -> 3 -> 0
          
          if (nextRank === 0) {
            // Cycling to rank 0 - remove this perk and all descendants
            const descendants = getAllDescendants(perkId);
            const perksToRemove = new Set([perkId, ...descendants]);
            const selectedPerksToRemove = skillPerks.filter(p => perksToRemove.has(p.perkId));
            const newSkillPerks = skillPerks.filter((p) => !perksToRemove.has(p.perkId));
            
            console.log(`Cycling to rank 0, removing ${selectedPerksToRemove.length} perks:`, selectedPerksToRemove.map(p => p.perkName));
            return {
              ...prev,
              selectedPerks: { ...prev.selectedPerks, [skill]: newSkillPerks },
              totalPerks: prev.totalPerks - selectedPerksToRemove.length,
            };
          } else {
            // Update rank
            const updatedPerks = [...skillPerks];
            updatedPerks[perkIndex] = { ...currentPerk, currentRank: nextRank };
            console.log(`Cycling ${perk.perkName} to rank ${nextRank}`);
            return {
              ...prev,
              selectedPerks: { ...prev.selectedPerks, [skill]: updatedPerks },
            };
          }
        } else {
          // Single-rank perk: remove perk and all descendants
          const descendants = getAllDescendants(perkId);
          const perksToRemove = new Set([perkId, ...descendants]);
          const selectedPerksToRemove = skillPerks.filter(p => perksToRemove.has(p.perkId));
          const newSkillPerks = skillPerks.filter((p) => !perksToRemove.has(p.perkId));
          
          console.log(`Removing ${selectedPerksToRemove.length} perks:`, selectedPerksToRemove.map(p => p.perkName));
          return {
            ...prev,
            selectedPerks: { ...prev.selectedPerks, [skill]: newSkillPerks },
            totalPerks: prev.totalPerks - selectedPerksToRemove.length,
          };
        }
      } else {
        // Perk is not selected - add perk and all prerequisites
        const prerequisites = getAllPrerequisites(perkId);
        const perksToAdd = new Set([perkId, ...prerequisites]);
        
        // Get all perks to add (including prerequisites)
        const newPerks = Array.from(perksToAdd)
          .map(id => tree.perks.find(p => p.perkId === id))
          .filter((perk): perk is NonNullable<typeof perk> => perk !== undefined)
          .map(perk => {
            // If this is the clicked perk and it's multi-rank, set rank to 1
            // If this is a prerequisite that's multi-rank, set rank to 1 (minimum)
            // Otherwise, set rank to 0
            const shouldHaveRank = perk.perkId === perkId || (perk.ranks > 1 && perksToAdd.has(perk.perkId));
            return {
              ...perk, 
              selected: true,
              currentRank: shouldHaveRank && perk.ranks > 1 ? 1 : 0
            };
          });
        
        // Combine with existing perks, avoiding duplicates
        const existingPerkIds = new Set(skillPerks.map(p => p.perkId));
        const uniqueNewPerks = newPerks.filter(perk => !existingPerkIds.has(perk.perkId));
        
        const newSkillPerks = [...skillPerks, ...uniqueNewPerks];
        console.log(`Adding ${uniqueNewPerks.length} perks:`, uniqueNewPerks.map(p => p.perkName));
        return {
          ...prev,
          selectedPerks: { ...prev.selectedPerks, [skill]: newSkillPerks },
          totalPerks: prev.totalPerks + uniqueNewPerks.length,
        };
      }
    });
  }, [tree]);

  const updatePerkRank = useCallback((perkId: string, newRank: number) => {
    if (!tree) return;
    setPerkPlan((prev) => {
      const skill = tree.treeName;
      const skillPerks = prev.selectedPerks[skill] || [];
      const perkIndex = skillPerks.findIndex((p) => p.perkId === perkId);
      const perk = tree.perks.find(p => p.perkId === perkId);
      
      if (!perk) return prev;
      
      if (perkIndex >= 0) {
        // Perk is already selected, update its rank
        const updatedPerks = [...skillPerks];
        
        // For multi-rank perks, ensure rank is within bounds
        const validRank = perk.ranks > 1 
          ? Math.max(0, Math.min(newRank, perk.ranks))
          : 0;
          
        updatedPerks[perkIndex] = {
          ...updatedPerks[perkIndex],
          currentRank: validRank,
        };
        
        console.log(`Updated ${perk.perkName} rank to ${validRank}`);
        return {
          ...prev,
          selectedPerks: { ...prev.selectedPerks, [skill]: updatedPerks },
        };
      } else {
        // Perk is not selected yet, but we're trying to set its rank
        // This shouldn't happen with our current logic, but handle it gracefully
        console.log(`Attempted to update rank for unselected perk: ${perk.perkName}`);
        return prev;
      }
    });
  }, [tree]);

  const clearSkill = useCallback(() => {
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
  }, [tree]);

  const clearAll = useCallback(() => {
    setPerkPlan({ selectedPerks: {}, minLevels: {}, totalPerks: 0 });
  }, []);

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
