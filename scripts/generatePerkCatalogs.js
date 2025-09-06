/**
 * Script to generate perk catalogs from the actual perk-trees.json data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the perk trees data
const perkTreesPath = path.join(__dirname, '../public/data/perk-trees.json');
const perkTreesData = JSON.parse(fs.readFileSync(perkTreesPath, 'utf8'));

// Skill tree ID mappings to compact codes
const SKILL_TREE_CODES = {
  'AVSmithing': 'SMG',
  'AVDestruction': 'DST',
  'AVEnchanting': 'ENC',
  'AVRestoration': 'RES',
  'AVMysticism': 'MYS',
  'AVConjuration': 'CNJ',
  'AVAlteration': 'ALT',
  'AVSpeechcraft': 'SPC',
  'AVAlchemy': 'ALC',
  'AVSneak': 'SNK',
  'AVLockpicking': 'LCK',
  'AVPickpocket': 'PKP',
  'AVLightArmor': 'LAR',
  'AVHeavyArmor': 'HAR',
  'AVBlock': 'BLK',
  'AVMarksman': 'MRK',
  'AVTwoHanded': 'TWH',
  'AVOneHanded': 'OHD',
  'AVIllusion': 'ILL',
};

// Generate catalogs
const PERK_CATALOGS = {};

perkTreesData.forEach(tree => {
  const skillCode = SKILL_TREE_CODES[tree.treeId];
  if (skillCode) {
    const edids = tree.perks.map(perk => perk.edid);
    PERK_CATALOGS[skillCode] = edids;
    console.log(`${skillCode} (${tree.treeName}): ${edids.length} perks`);
  }
});

// Generate TypeScript code
const generateTypeScript = () => {
  let output = `// Generated perk catalogs from actual data\n`;
  output += `export const PERK_CATALOGS = {\n`;
  
  Object.entries(PERK_CATALOGS).forEach(([code, edids]) => {
    output += `  // ${perkTreesData.find(t => SKILL_TREE_CODES[t.treeId] === code)?.treeName}\n`;
    output += `  ${code}: [\n`;
    edids.forEach(edid => {
      output += `    '${edid}',\n`;
    });
    output += `  ],\n\n`;
  });
  
  output += `} as const\n`;
  
  return output;
};

// Write to file
const outputPath = path.join(__dirname, '../src/shared/data/generatedPerkCatalogs.ts');
fs.writeFileSync(outputPath, generateTypeScript());

console.log(`\nGenerated perk catalogs written to: ${outputPath}`);
console.log(`Total skill trees: ${Object.keys(PERK_CATALOGS).length}`);
console.log(`Total perks: ${Object.values(PERK_CATALOGS).reduce((sum, edids) => sum + edids.length, 0)}`);
