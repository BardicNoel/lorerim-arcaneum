import { validatePerkTree, validatePerkTrees, isPerkTree, isPerkTrees } from "./types";

// Test data that matches the new structure
const testPerkTree = {
  treeId: "AVSmithing",
  treeName: "Smithing",
  treeDescription: "The art of creating and improving weapons and armor from raw materials.",
  category: "Combat",
  perks: [
    {
      edid: "REQ_Smithing_Craftsmanship",
      name: "Craftsmanship",
      ranks: [
        {
          rank: 1,
          edid: "REQ_Smithing_Craftsmanship",
          name: "Craftsmanship",
          description: {
            base: "You've read The Armorer's Encyclopedia and know how to properly use all kinds of tools.",
            subtext: "You now also understand the secondary material properties of Iron and Steel weapons."
          },
          prerequisites: {
            items: [
              {
                type: "INGR",
                id: "0x8C35B997"
              }
            ]
          }
        }
      ],
      totalRanks: 1,
      connections: {
        parents: [],
        children: [
          "REQ_Smithing_AdvancedLightArmors",
          "REQ_Smithing_DwarvenSmithing"
        ]
      },
      isRoot: true,
      position: {
        x: 4,
        y: 2,
        horizontal: -0.08571399748325348,
        vertical: -0.08571399748325348
      }
    }
  ]
};

// Test invalid data
const invalidPerkTree = {
  treeId: "Invalid",
  treeName: "Invalid Tree",
  perks: [
    {
      edid: "INVALID",
      name: "Invalid Perk",
      // Missing required fields
    }
  ]
};

// Test functions
export function testPerkSchema() {
  console.log("Testing Perk Schema Validation...");
  
  // Test successful validation
  try {
    const validated = validatePerkTree(testPerkTree);
    console.log("✅ Valid perk tree:", validated.treeName);
  } catch (error) {
    console.error("❌ Validation failed:", error);
  }
  
  // Test safe validation
  const safeResult = isPerkTree(testPerkTree);
  console.log("✅ Safe validation result:", safeResult);
  
  // Test invalid data
  try {
    validatePerkTree(invalidPerkTree);
    console.log("❌ Invalid data should have failed validation");
  } catch (error) {
    console.log("✅ Invalid data correctly rejected:", error);
  }
  
  // Test array validation
  try {
    const validatedArray = validatePerkTrees([testPerkTree]);
    console.log("✅ Valid perk trees array:", validatedArray.length, "trees");
  } catch (error) {
    console.error("❌ Array validation failed:", error);
  }
}

// Make test function available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testPerkSchema = testPerkSchema;
} 