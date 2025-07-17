import { useMemo } from "react";
import type { Religion } from "../types";

interface UseFuzzySearchResult {
  filteredReligions: Religion[];
}

export function useFuzzySearch(
  religions: Religion[],
  query: string
): UseFuzzySearchResult {
  const filteredReligions = useMemo(() => {
    if (!query.trim()) {
      return religions;
    }

    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);

    return religions.filter((religion) => {
      const searchableText = [
        religion.name,
        religion.type,
        religion.tenet?.description || "",
        religion.tenet?.header || "",
        religion.blessing?.spellName || "",
        ...(religion.favoredRaces || []),
        ...(religion.worshipRestrictions || []),
        ...(religion.tenet?.effects?.map(
          (effect) =>
            `${effect.effectName} ${effect.effectDescription} ${effect.effectType}`
        ) || []),
        ...(religion.blessing?.effects?.map(
          (effect) =>
            `${effect.effectName} ${effect.effectDescription} ${effect.effectType}`
        ) || []),
        ...(religion.boon1?.effects?.map(
          (effect) =>
            `${effect.effectName} ${effect.effectDescription} ${effect.effectType}`
        ) || []),
        ...(religion.boon2?.effects?.map(
          (effect) =>
            `${effect.effectName} ${effect.effectDescription} ${effect.effectType}`
        ) || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [religions, query]);

  return { filteredReligions };
}
