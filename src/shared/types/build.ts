export interface BuildState {
  v: number; // Schema version
  name: string; // Character name
  notes: string; // RP flavor text
  race: string | null; // EDID
  stone: string | null; // EDID
  religion: string | null; // EDID
  traits: string[]; // Array of EDIDs
  skills: {
    major: string[]; // Array of EDIDs
    minor: string[]; // Array of EDIDs
  };
  equipment: string[]; // Array of EDIDs
}

export const DEFAULT_BUILD: BuildState = {
  v: 1,
  name: "",
  notes: "",
  race: null,
  stone: null,
  religion: null,
  traits: [],
  skills: {
    major: [],
    minor: []
  },
  equipment: []
}; 