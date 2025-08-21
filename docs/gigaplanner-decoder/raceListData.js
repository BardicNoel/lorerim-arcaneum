//to do - add starting move speed to speed bonus, add racial bonus


const raceListData = [
	{ 
	 name: "Argonian", 
     startingHMS: [140,120,100], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.20,1.10,1.60], 
     unarmedDam: 32,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       10,       //Evasion
                       10,       //Sneak
                       10,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       15,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       0,       //Destruction
                       10,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits
	 desc: "Argonians are the reptilian denizens of Black Marsh. Years of defending their borders have made them experts in stealth and evasion, and their natural abilities make them equally at home in water and on land. They are resistant to diseases and poisons and enjoy raw meat. Their Histskin allows them to quickly heal their wounds.",
	 bonus: "&#x2022; Waterbreathing: Your Argonian lungs can breathe underwater, while you also find it much easier to swim than members of other races. You can breathe underwater, swimming is 20% faster, swimming is 75% less exhausting.<br> &#x2022; Claws: Bestial claws are extremely sharp - sharp enough to easily shred through flesh, making them much more lethal than normal hands. Unarmed damage is increased by 20.<br> &#x2022; Histskin: Argonians can nautrally regenerate health faster than others, and their metabolism increases the effect of alchemical substances. Regenerate 1 health per second, potions are 10% more effective and last longer.<br> &#x2022; Resist Poison and Disease: Your Argonian blood greatly reduces the effect of poison and disease. Poison deals 75% less damage to you, you are 75% less likely to contract diseases. <br> &#x2022; Strong Stomach: Your metabolism can digest raw food without food poisoning.",
    },
    {
     name: "Breton", 
     startingHMS: [120,140,100], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.15,1.15,1.60], 
     unarmedDam: 12,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       0,       //One-handed
                       0,       //Marksman
                       0,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       10,       //Speech
                       10,       //Alchemy
                       10,       //Illusion
                       15,       //Conjuration
                       0,       //Destruction
                       10,       //Restoration
                       0,       //Alteration
                       10,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits
	 desc: "Bretons, the inhabitants of the province of High Rock, are the human descendants of the Elves and the ancient race of the Nedes. While Bretons are physically weak, they can tap on magicka more than any other human race and they are particularly capable in the school of Conjuration. Their magic resistance blocks one fifth of incoming spell damage and their Dragonskin ability can fully absorb harmful magic by chance.",
	 bonus: "&#x2022; Magic Resistance: Your Breton blood reduces damage taken from all magical sources. Magic deals 15% less damage to you.<br> &#x2022; Dragonskin: Bretons can naturally absorb harmful magic by chance. Increases chance to absorb the magicka from hostile spells by 10%.",
    },
    {
     name: "Dunmer", 
     startingHMS: [100,140,120], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.20,1.10,1.60], 
     unarmedDam: 13,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       10,       //Evasion
                       10,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       0,       //Alchemy
                       10,       //Illusion
                       10,       //Conjuration
                       15,       //Destruction
                       0,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],      //Traits
	 desc: "The Dunmer, or Dark Elves, are the ash-skinned, red-eyed, Elven people of Vvardenfell. They combine powerful intellects with strong and agile physiques, producing excellent warriors and evokers. They are extremely resistant to fire, blocking half of incoming fire damage. They're particularly skilled in Destruction and Conjuration magic, and can imbue more power into associated spells.",
	 bonus: "&#x2022; Resist Fire: Tempered in the flames of the Red Mountain and the heat of the Ashlands, your Dunmer blood greatly reduces all fire damage dealt to you. Fire deals 50% less damage to you.<br> &#x2022; Ashlander: Dunmer are naturally talented evokers and conjurers. Destruction and Conjuration spells are 10% more powerful and last longer.",
    },
    {
     name: "Altmer", 
     startingHMS: [100,160,100], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.15,1.20,1.55], 
     unarmedDam: 12,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       0,       //One-handed
                       0,       //Marksman
                       0,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       0,       //Alchemy
                       10,       //Illusion
                       10,       //Conjuration
                       10,       //Destruction
                       10,       //Restoration
                       15,       //Alteration
                       10,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits
	 desc: "The Altmer of Summerset Isle are called 'High' Elves in the Empire, describing both their physical appearance and their snobbish personality. The arcane ability of High Elves surpasses all other races in Tamriel. Their Highborn ability grants them increased magicka and spell power. They are weak in physical combat, however, and their magic affinity makes them more susceptible to elemental damage.",
	 bonus: "&#x2022; Weakness to Elements: High elves are more vulnerable to elements compared to other races. Fire, frost, and shock deal 10% more damage to you.<br> &#x2022; Highborn: High elf blood grants great affinity to magicka as well as resistance to diseases. Magicka regenerates 50% faster, spells are 5% more powerful and last longer, you are 50% less likely to contract diseases.",
    },
    {
     name: "Imperial", 
     startingHMS: [120,120,120], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.20,1.10,1.60], 
     unarmedDam: 13,
     startingSkills : [0,       //Smithing
                       10,       //Heavy Armor
                       10,       //Block
                       0,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       0,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       15,       //Speech
                       0,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       10,       //Destruction
                       10,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "The cosmopolitan citizens of Cyrodiil are descended from the founders of the glorious Empire that has influenced Tamriel's history throughout the eras. Imperials are talented leaders and traders among society, skilled in both magic and combat thanks to martial and academic education of the schools of Cyrodiil. Their leadership can encourage their followers to fight well in combat.",
	 bonus: "&#x2022; Voice of the Emperor: Imperials are talented leaders and traders among society. Speech skill is 15 higher, prices are 15% more favorable, magicka and stamina of nearby allies increase by 25.<br> &#x2022; Imperial Diversity: Imperial education involves various martial and academical trainings, producing citizens with variety of skills. Health, magicka, and stamina regenerate 25% faster.",
    },
    {
     name: "Khajiit", 
     startingHMS: [100,100,160], 
     startingCW: 200, speedBonus: 9,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.15,1.05,1.70], 
     unarmedDam: 32,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       10,       //Evasion
                       15,       //Sneak
                       10,       //Wayfarer
                       10,       //Finesse
                       0,       //Speech
                       10,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       0,       //Destruction
                       0,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "The Khajiit are a race of feline humanoids hailing from the province of Elsweyr, well-known as great merchants but also as smugglers and thieves. They are very fast and outrun all other races which, combined with a high stamina reserve, makes them fearsome skirmishers. However, they are seldom gifted with the skill to harness magical forces. All Khajiit can see in the dark at will, eat raw meat, resist the harmful effects of Skooma and their sharp claws are as lethal as knives.",
	 bonus: "&#x2022; Night Eye: Your eyes are exceptionally versatile and can become extremely sensitive to light, allowing a much better sight in dark areas.<br>&#x2022; Claws: Bestial claws are extremely sharp - sharp enough to easily shred through flesh, making them much more lethal than normal hands. Unarmed damage is increased by 20.<br>&#x2022; Feline Agility: Khajiits are very agile and can fall long heights without taking critical damage. Movement is 10% faster, sneaking is 20% faster, fall damage is reduced by 75%.<br>&#x2022; Strong Stomach: Your metabolism can digest raw food without food poisoning.<br>&#x2022; Fingersmith: Khajiits have keen senses and dexterity, making them much more proficient in thievery. Lockpicking expertise is increased by 2, lockpicks are 20% more durable, pickpocketing is 20% more likely to succeed, you are 20% harder to detect.",
    },
    {
     name: "Nord", 
     startingHMS: [140,100,120], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.25,1.00,1.65], 
     unarmedDam: 14,
     startingSkills : [10,       //Smithing
                       10,       //Heavy Armor
                       10,       //Block
                       15,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       10,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       0,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       0,       //Destruction
                       0,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "Skyrim's Nords are tall and fair, with a culture which values honor, glory, and loyalty to family and community. Nords have come to distrust magic, but excel in physical warfare. They are greatly resistant to frost. Nords also have innate ability to use Shouts, and can unleash immense power through the words of power when mastered.",
	 bonus: "&#x2022; Resist Frost: Your Nord blood halves all taken frost damage. Frost deals 50% less damage. <br>&#x2022; Ancient Tongues: Nords have inherent ability to Shout, and can unleash immense power through the Voice. Shouts are 10% more powerful and last longer, Shouts can be used 10% more often.<br>&#x2022; Barbaric Strength: Nords are fierce and strong, skilled with all melee weapons. Melee weapons deal 5% more damage.",
    },
    {
     name: "Orsimer", 
     startingHMS: [160,100,100], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.25,1.00,1.65], 
     unarmedDam: 14,
     startingSkills : [10,       //Smithing
                       15,       //Heavy Armor
                       10,       //Block
                       10,       //Two-handed
                       10,       //One-handed
                       0,       //Marksman
                       0,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       0,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       10,       //Destruction
                       0,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "The Orsimer or 'Pariah Folk', commonly called Orcs, come from Orsinium in the west. Their savage appearance and customs sometimes cause fear, but they have won acceptance for their distinguished service in the Legion. Orcs' superior strength makes them formidable warriors, though use of magic requires extensive training. Their incredible endurance grants them resistance to both magical and physical harm.",
	 bonus: "&#x2022; Bulwark: Orcs have incredible strength and endurance, resistant to all types of damage. Armor rating increases by 150, magic deals 15% less damage to you.<br>&#x2022; Strong Stomach: Your metabolism can digest raw food without food poisoning.",
    },
    {
     name: "Redguard", 
     startingHMS: [120,100,140], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.20,1.00,1.70], 
     unarmedDam: 13,
     startingSkills : [10,       //Smithing
                       0,       //Heavy Armor
                       10,       //Block
                       10,       //Two-handed
                       15,       //One-handed
                       10,       //Marksman
                       10,       //Evasion
                       0,       //Sneak
                       0,       //Wayfarer
                       0,       //Finesse
                       0,       //Speech
                       0,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       0,       //Destruction
                       0,       //Restoration
                       0,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "The dark-skinned, wiry-haired Redguards of Hammerfell seem born for battle, though their proud and independent spirits suit free-ranging heroism more. They have a hardy constitution and natural resistance to poison and disease, but tend to shun their magic. They are full of stamina and naturally skilled in melee combat, making them one of the strongest warriors in Tamriel.",
	 bonus: "&#x2022; Resist Poison and Disease: Your Redguard blood, tempered in the deserts of Hammerfell, grants you a very strong resistance to poisons and diseases. Poison deals 50% less damage to you, you are 50% less likely to contract diseases.<br>&#x2022; Adrenaline Rush: Redguards are granted increased stamina, and can sprint much longer without being exhausted. Stamina regeneration is increased, sprinting costs 1 less stamina per second.<br>&#x2022; Martial Prowess: Redguards are naturally skilled in martial arts, and can wield their weapons with great precision. Armor penetration with melee weapons is increased by 5.",
    },
    {
     name: "Bosmer", 
     startingHMS: [100,120,140], 
     startingCW: 200, speedBonus: 0,
     hmsBonus: [0,0,0], 
     startingHMSRegen: [0.15,1.10,1.65], 
     unarmedDam: 12,
     startingSkills : [0,       //Smithing
                       0,       //Heavy Armor
                       0,       //Block
                       0,       //Two-handed
                       0,       //One-handed
                       15,       //Marksman
                       10,       //Evasion
                       10,       //Sneak
                       0,       //Wayfarer
                       10,       //Finesse
                       0,       //Speech
                       10,       //Alchemy
                       0,       //Illusion
                       0,       //Conjuration
                       0,       //Destruction
                       0,       //Restoration
                       10,       //Alteration
                       0,       //Enchanting
                        1,       //Destiny
                        0],		 // Traits	
	 desc: "The Bosmer, or Wood Elves, originate from the sacred forest of Valenwood. Their culture is highly carnivorous and even cannibalistic, derived from the Green Pact with the forest, in which they harm no plant. Their dexterity makes them excellent scouts and thieves, and there are no finer archers in all of Tamriel. They have a natural resistance to poison, disease and shock.",
	 bonus: "&#x2022; Resist Poison and Disease: Your Bosmer blood grants you resistance to poison and diseases. Poison deals 25% less damage to you, you are 50% less likely to contract diseases.<br>&#x2022; Grounded: In harmony with nature and the earth, the Bosmer have honed their bodies to be conduits of elemental potential. +25% shock resist<br>&#x2022; Eye of the Hunt: The Bosmer are naturally skilled in marksmanship, and can aim their bows more precisely. Armor penetration with ranged weapons is increased by 5.<br>&#x2022; Strong Stomach: Your metabolism can digest raw food without food poisoning.",
    },
]

