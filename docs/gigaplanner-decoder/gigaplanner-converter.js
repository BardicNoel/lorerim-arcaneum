/**
 * GigaPlanner Bidirectional Converter
 * 
 * This module provides complete functionality to:
 * 1. Decode GigaPlanner URLs into structured character data
 * 2. Encode character data back into GigaPlanner URLs
 * 3. Provide mappings between IDs and names for all game elements
 */

class GigaPlannerConverter {
    constructor() {
        // Load hardcoded data - these need to be loaded from the data files
        this.initializeData();
        
        // Create lookup maps for efficient name/ID conversion
        this.createLookupMaps();
    }

    initializeData() {
        // This would normally import the data files, but for now we'll define them inline
        // In a real implementation, you'd load these from the separate data files
        
        // For now, we'll need to populate these from the actual data files
        this.perksList = [];
        this.racesList = [];
        this.gameMechanicsList = [];
        this.standingStonesList = [];
        this.blessingsList = [];
        this.presetList = [];
    }

    createLookupMaps() {
        // Races
        this.raceNameToId = {};
        this.raceIdToName = {};
        this.racesList.forEach((race, index) => {
            this.raceNameToId[race.name] = index;
            this.raceIdToName[index] = race.name;
        });

        // Standing Stones
        this.stoneNameToId = {};
        this.stoneIdToName = {};
        this.standingStonesList.forEach((stone, index) => {
            this.stoneNameToId[stone.name] = index;
            this.stoneIdToName[index] = stone.name;
        });

        // Blessings
        this.blessingNameToId = {};
        this.blessingIdToName = {};
        this.blessingsList.forEach((blessing, index) => {
            this.blessingNameToId[blessing.name] = index;
            this.blessingIdToName[index] = blessing.name;
        });

        // Perk Lists (Subclasses)
        this.perkListNameToId = {};
        this.perkListIdToName = {};
        this.perksList.forEach((perkList) => {
            this.perkListNameToId[perkList.name] = perkList.id;
            this.perkListIdToName[perkList.id] = perkList.name;
        });

        // Game Mechanics
        this.mechanicsNameToId = {};
        this.mechanicsIdToName = {};
        this.gameMechanicsList.forEach((mechanics) => {
            this.mechanicsNameToId[mechanics.name] = mechanics.id;
            this.mechanicsIdToName[mechanics.id] = mechanics.name;
        });
    }

    /**
     * Decode a GigaPlanner URL into structured character data
     * @param {string} url - The GigaPlanner URL
     * @returns {Object} Structured character data with names instead of IDs
     */
    decodeUrl(url) {
        try {
            const urlObj = new URL(url);
            const buildCode = urlObj.searchParams.get('b');
            const presetNum = urlObj.searchParams.get('p');

            if (!buildCode) {
                throw new Error('No build code found in URL');
            }

            const characterData = this.decodeBuildCode(buildCode);
            const preset = presetNum ? this.presetList[parseInt(presetNum)] : null;

            return {
                success: true,
                preset: preset ? preset.name : null,
                character: characterData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Decode a build code string into character data
     * @param {string} buildCode - The base64url encoded build code
     * @returns {Object} Character data with names
     */
    decodeBuildCode(buildCode) {
        // Convert base64url to base64
        let code = buildCode.replace(/-/g, "+").replace(/_/g, "/");
        
        // Decode base64 to binary string
        code = atob(code);
        
        const version = code.charCodeAt(0);
        
        // Parse configuration
        const perkListId = code.charCodeAt(1);
        const gameMechanicsId = code.charCodeAt(3);
        
        const perkList = this.perksList.find(p => p.id === perkListId);
        const gameMechanics = this.gameMechanicsList.find(g => g.id === gameMechanicsId);
        
        if (!perkList) {
            throw new Error(`Invalid perk list ID: ${perkListId}`);
        }
        if (!gameMechanics) {
            throw new Error(`Invalid game mechanics ID: ${gameMechanicsId}`);
        }

        // Parse character data
        const character = {
            level: code.charCodeAt(5),
            hmsIncreases: {
                health: code.charCodeAt(6),
                magicka: code.charCodeAt(7),
                stamina: code.charCodeAt(8)
            },
            skillLevels: [],
            oghmaChoice: this.parseOghmaChoice(code.charCodeAt(27), version),
            race: this.raceIdToName[code.charCodeAt(28)] || 'Unknown',
            standingStone: this.stoneIdToName[code.charCodeAt(29)] || 'Unknown',
            blessing: this.blessingIdToName[code.charCodeAt(30)] || 'Unknown',
            perks: this.parsePerks(code, perkList),
            configuration: {
                perkList: perkList.name,
                gameMechanics: gameMechanics.name
            }
        };

        // Parse skill levels
        for (let i = 0; i < 18; i++) {
            character.skillLevels.push({
                skill: perkList.skillNames[i],
                level: code.charCodeAt(9 + i)
            });
        }

        // Version 2 specific handling
        if (version === 2) {
            character.skillLevels.push({
                skill: 'Level',
                level: character.level
            });
        }

        return character;
    }

    /**
     * Parse Oghma choice from encoded value
     */
    parseOghmaChoice(encodedValue, version) {
        let choice = encodedValue;
        if (version === 2) {
            choice = choice >> 4;
        }
        
        const choices = ['None', 'Health', 'Magicka', 'Stamina'];
        return choices[choice] || 'None';
    }

    /**
     * Parse perks from binary data
     */
    parsePerks(buildCode, perkList) {
        const perks = [];
        
        for (let i = 0; i < perkList.perks.length; i++) {
            const byteIndex = 31 + Math.floor(i / 8);
            const bitOffset = 7 - (i % 8);
            const hasPerk = (buildCode.charCodeAt(byteIndex) & (1 << bitOffset)) > 0;
            
            if (hasPerk) {
                perks.push(perkList.perks[i].name);
            }
        }
        
        return perks;
    }

    /**
     * Encode character data back to a GigaPlanner URL
     * @param {Object} characterData - Character data with names
     * @param {string} baseUrl - Base URL for GigaPlanner
     * @returns {string} GigaPlanner URL
     */
    encodeUrl(characterData, baseUrl = 'https://gigaplanner.com') {
        try {
            const buildCode = this.encodeBuildCode(characterData);
            const presetNum = this.findPresetNumber(characterData.configuration.perkList);
            
            let url = `${baseUrl}?b=${buildCode}`;
            if (presetNum !== null) {
                url += `&p=${presetNum}`;
            }
            
            return url;
        } catch (error) {
            throw new Error(`Failed to encode URL: ${error.message}`);
        }
    }

    /**
     * Encode character data to build code
     */
    encodeBuildCode(characterData) {
        const version = 2;
        let code = String.fromCodePoint(version);
        
        // Configuration IDs
        const perkListId = this.perkListNameToId[characterData.configuration.perkList];
        const gameMechanicsId = this.mechanicsNameToId[characterData.configuration.gameMechanics];
        
        if (perkListId === undefined) {
            throw new Error(`Unknown perk list: ${characterData.configuration.perkList}`);
        }
        if (gameMechanicsId === undefined) {
            throw new Error(`Unknown game mechanics: ${characterData.configuration.gameMechanics}`);
        }
        
        code += String.fromCodePoint(perkListId);
        code += String.fromCodePoint(0); // Race list always 0
        code += String.fromCodePoint(gameMechanicsId);
        code += String.fromCodePoint(0); // Blessing list always 0
        
        // Character data
        code += String.fromCodePoint(characterData.level);
        code += String.fromCodePoint(characterData.hmsIncreases.health);
        code += String.fromCodePoint(characterData.hmsIncreases.magicka);
        code += String.fromCodePoint(characterData.hmsIncreases.stamina);
        
        // Skill levels
        const perkList = this.perksList.find(p => p.id === perkListId);
        for (let i = 0; i < 18; i++) {
            const skillLevel = characterData.skillLevels.find(s => s.skill === perkList.skillNames[i]);
            code += String.fromCodePoint(skillLevel ? skillLevel.level : 0);
        }
        
        // Oghma choice
        const oghmaChoices = ['None', 'Health', 'Magicka', 'Stamina'];
        const oghmaIndex = oghmaChoices.indexOf(characterData.oghmaChoice);
        code += String.fromCodePoint(oghmaIndex << 4);
        
        // Race, standing stone, blessing
        code += String.fromCodePoint(this.raceNameToId[characterData.race] || 0);
        code += String.fromCodePoint(this.stoneNameToId[characterData.standingStone] || 0);
        code += String.fromCodePoint(this.blessingNameToId[characterData.blessing] || 0);
        
        // Perks
        const perksTaken = this.encodePerks(characterData.perks, perkList);
        code += perksTaken;
        
        // Encode to base64url
        code = btoa(code);
        code = code.replace(/\+/g, "-").replace(/\//g, "_");
        if (code.indexOf("=") !== -1) {
            code = code.substring(0, code.indexOf("="));
        }
        
        return code;
    }

    /**
     * Encode perks to binary format
     */
    encodePerks(perkNames, perkList) {
        let code = '';
        let character = 0;
        
        for (let i = 0; i < perkList.perks.length; i++) {
            const hasPerk = perkNames.includes(perkList.perks[i].name);
            character = (character << 1) | (hasPerk ? 1 : 0);
            
            if (i % 8 === 7) {
                code += String.fromCodePoint(character);
                character = 0;
            }
        }
        
        // Handle remaining bits
        const remainingBits = perkList.perks.length % 8;
        if (remainingBits > 0) {
            const paddingNeeded = 8 - remainingBits;
            code += String.fromCodePoint(character << paddingNeeded);
        }
        
        return code;
    }

    /**
     * Find preset number for a perk list
     */
    findPresetNumber(perkListName) {
        const preset = this.presetList.find(p => p.perks === this.perkListNameToId[perkListName]);
        return preset ? this.presetList.indexOf(preset) : null;
    }

    /**
     * Get all available data mappings
     */
    getDataMappings() {
        return {
            perkLists: this.perksList.map(p => ({ id: p.id, name: p.name })),
            races: this.racesList.map((r, i) => ({ id: i, name: r.name })),
            gameMechanics: this.gameMechanicsList.map(g => ({ id: g.id, name: g.name })),
            standingStones: this.standingStonesList.map((s, i) => ({ id: i, name: s.name })),
            blessings: this.blessingsList.map((b, i) => ({ id: i, name: b.name })),
            presets: this.presetList.map((p, i) => ({ id: i, name: p.name }))
        };
    }

    /**
     * Get all perks for a specific perk list
     */
    getPerksForList(perkListName) {
        const perkList = this.perksList.find(p => p.name === perkListName);
        if (!perkList) return [];
        
        return perkList.perks.map((perk, index) => ({
            id: index,
            name: perk.name,
            skill: perkList.skillNames[perk.skill],
            skillReq: perk.skillReq,
            description: perk.description
        }));
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GigaPlannerConverter;
}

// Export for browser
if (typeof window !== 'undefined') {
    window.GigaPlannerConverter = GigaPlannerConverter;
}
