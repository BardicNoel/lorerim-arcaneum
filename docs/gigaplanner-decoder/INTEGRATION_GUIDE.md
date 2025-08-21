# GigaPlanner Converter Integration Guide

This guide explains how to integrate the GigaPlanner converter into your build planner system for bidirectional data exchange.

## Directory Contents

The `gigaplanner-decoder` directory contains only the essential files:

- `gigaplanner-converter.js` - Main converter class
- `perkListData.js` - Complete perk definitions (149KB)
- `raceListData.js` - Race definitions and stats
- `standingStoneData.js` - Standing stone definitions
- `blessingsData.js` - Blessing definitions
- `gameMechanicsData.js` - Game mechanics configuration
- `presetData.js` - Preset definitions

## Quick Start

### 1. Load the Converter

**Node.js:**

```javascript
const GigaPlannerConverter = require("./gigaplanner-decoder/gigaplanner-converter.js");
const converter = new GigaPlannerConverter();
```

**Browser:**

```html
<script src="gigaplanner-decoder/gigaplanner-converter.js"></script>
<script>
  const converter = new GigaPlannerConverter();
</script>
```

### 2. Import from GigaPlanner URL

```javascript
// Decode a GigaPlanner URL
const gigaplannerUrl =
  "https://gigaplanner.com/?b=AgAAAAAAAAUKBQUFCggICAkKCgoJCQoJCgkJCQkJCgkJCQkJCQoPDwAAA...";
const result = converter.decodeUrl(gigaplannerUrl);

if (result.success) {
  const character = result.character;

  // Access character data
  console.log(`Race: ${character.race}`);
  console.log(`Standing Stone: ${character.standingStone}`);
  console.log(`Blessing: ${character.blessing}`);
  console.log(`Level: ${character.level}`);
  console.log(`Perks: ${character.perks.join(", ")}`);

  // Map to your system here
  mapToYourSystem(character);
} else {
  console.error("Failed to decode:", result.error);
}
```

### 3. Export to GigaPlanner URL

```javascript
// Create character data in the expected format
const characterData = {
  level: 50,
  hmsIncreases: {
    health: 10,
    magicka: 5,
    stamina: 15,
  },
  skillLevels: [
    { skill: "Smithing", level: 100 },
    { skill: "Heavy Armor", level: 75 },
    // ... other skills
  ],
  oghmaChoice: "Health",
  race: "Nord",
  standingStone: "The Warrior",
  blessing: "Blessing of Talos",
  perks: ["Advanced Armors", "Dwarven Smithing", "Steel Smithing"],
  configuration: {
    perkList: "LoreRim v4",
    gameMechanics: "LoreRim v4",
  },
};

// Generate GigaPlanner URL
try {
  const url = converter.encodeUrl(characterData);
  console.log("Generated URL:", url);
} catch (error) {
  console.error("Failed to encode:", error.message);
}
```

## Character Data Structure

The converter returns character data in this format:

```javascript
{
    level: 50,
    hmsIncreases: {
        health: 10,    // Health increases from leveling
        magicka: 5,    // Magicka increases from leveling
        stamina: 15    // Stamina increases from leveling
    },
    skillLevels: [
        { skill: "Smithing", level: 100 },
        { skill: "Heavy Armor", level: 75 },
        // ... 18 skills total
    ],
    oghmaChoice: "Health",  // "None", "Health", "Magicka", or "Stamina"
    race: "Nord",
    standingStone: "The Warrior",
    blessing: "Blessing of Talos",
    perks: ["Advanced Armors", "Dwarven Smithing", "Steel Smithing"],
    configuration: {
        perkList: "LoreRim v4",      // Subclass/perk list
        gameMechanics: "LoreRim v4"  // Game mechanics version
    }
}
```

## Available Data Mappings

Get all available options:

```javascript
const mappings = converter.getDataMappings();

// Available races
mappings.races.forEach((race) => {
  console.log(`Race ID ${race.id}: ${race.name}`);
});

// Available standing stones
mappings.standingStones.forEach((stone) => {
  console.log(`Stone ID ${stone.id}: ${stone.name}`);
});

// Available blessings
mappings.blessings.forEach((blessing) => {
  console.log(`Blessing ID ${blessing.id}: ${blessing.name}`);
});

// Available perk lists (subclasses)
mappings.perkLists.forEach((perkList) => {
  console.log(`Perk List ID ${perkList.id}: ${perkList.name}`);
});
```

Get perks for a specific subclass:

```javascript
const perks = converter.getPerksForList("LoreRim v4");
perks.forEach((perk) => {
  console.log(`${perk.name} (${perk.skill})`);
});
```

## Integration Patterns

### 1. One-Way Import

```javascript
function importFromGigaPlanner(url) {
  const result = converter.decodeUrl(url);
  if (result.success) {
    // Map to your internal character format
    const myCharacter = {
      name: "Imported Character",
      race: result.character.race,
      level: result.character.level,
      // ... map other fields
    };

    saveToMySystem(myCharacter);
    return myCharacter;
  }
  throw new Error(`Import failed: ${result.error}`);
}
```

### 2. Two-Way Sync

```javascript
class CharacterSync {
  constructor() {
    this.converter = new GigaPlannerConverter();
  }

  importFromGigaPlanner(url) {
    const result = this.converter.decodeUrl(url);
    if (!result.success) throw new Error(result.error);

    // Store original URL for round-trip capability
    const character = this.mapToInternalFormat(result.character);
    character._gigaplannerUrl = url;
    return character;
  }

  exportToGigaPlanner(character) {
    const gigaData = this.mapToGigaFormat(character);
    return this.converter.encodeUrl(gigaData);
  }

  mapToInternalFormat(gigaCharacter) {
    // Transform GigaPlanner format to your format
    return {
      // Your mapping logic
    };
  }

  mapToGigaFormat(myCharacter) {
    // Transform your format to GigaPlanner format
    return {
      // Your reverse mapping logic
    };
  }
}
```

## Error Handling

Always handle potential errors:

```javascript
// URL decoding
const result = converter.decodeUrl(url);
if (!result.success) {
  console.error("Decode error:", result.error);
  // Handle invalid URL, missing build code, etc.
}

// URL encoding
try {
  const url = converter.encodeUrl(characterData);
} catch (error) {
  console.error("Encode error:", error.message);
  // Handle missing required fields, invalid data, etc.
}
```

## Common Issues

1. **Missing Required Fields**: Ensure all required character data fields are present
2. **Invalid Names**: Use exact names from the data mappings (case-sensitive)
3. **Perk List Mismatch**: Ensure perks belong to the specified perk list
4. **Skill Count**: Must have exactly 18 skill levels for most perk lists

## Data Validation

```javascript
function validateCharacterData(character) {
  const mappings = converter.getDataMappings();

  // Check race exists
  if (!mappings.races.find((r) => r.name === character.race)) {
    throw new Error(`Invalid race: ${character.race}`);
  }

  // Check standing stone exists
  if (
    !mappings.standingStones.find((s) => s.name === character.standingStone)
  ) {
    throw new Error(`Invalid standing stone: ${character.standingStone}`);
  }

  // Validate skill levels count
  if (character.skillLevels.length !== 18) {
    throw new Error(`Expected 18 skills, got ${character.skillLevels.length}`);
  }

  return true;
}
```

This converter provides a complete solution for bidirectional GigaPlanner integration with minimal dependencies.
