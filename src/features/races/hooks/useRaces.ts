import { useState, useMemo } from "react";
import type { Race, RaceFilters } from "../types";
import raceData from "../../../../public/data/races.json";

export function useRaces() {
  const [filters, setFilters] = useState<RaceFilters>({
    search: "",
    type: "",
    tags: [],
  });

  // Use imported data directly
  const races = raceData as Race[];

  // Filter races based on current filters
  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          race.name.toLowerCase().includes(searchLower) ||
          race.description.toLowerCase().includes(searchLower) ||
          race.traits.some(
            (trait) =>
              trait.name.toLowerCase().includes(searchLower) ||
              trait.description.toLowerCase().includes(searchLower)
          );
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type) {
        const raceType = getRaceType(race.name);
        if (raceType !== filters.type) return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const raceTags = race.traits.map((trait) => trait.effect.type);
        const hasMatchingTag = filters.tags.some((tag) => {
          switch (tag) {
            case "Resistance":
              return raceTags.includes("resistance");
            case "Ability":
              return raceTags.includes("ability");
            case "Passive":
              return raceTags.includes("passive");
            default:
              return false;
          }
        });
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [races, filters]);

  return {
    races: filteredRaces,
    allRaces: races,
    loading: false,
    error: null,
    filters,
    setFilters,
  };
}

function getRaceType(raceName: string): string {
  const humanRaces = ["Nord", "Breton", "Imperial", "Redguard"];
  const elfRaces = ["Altmer", "Bosmer", "Dunmer", "Orsimer"];
  const beastRaces = ["Khajiit", "Argonian"];

  if (humanRaces.includes(raceName)) return "Human";
  if (elfRaces.includes(raceName)) return "Elf";
  if (beastRaces.includes(raceName)) return "Beast";

  return "Unknown";
}
