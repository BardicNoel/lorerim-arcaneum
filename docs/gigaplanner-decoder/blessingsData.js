const blessingsData = [
//0
	{name : "None", shrine: "-", follower : "-", devotee : "-",
     tenents: "-", race: "-", starting: "", req: "-"},	  
	 
//1 - DIVINES
	{name: "&mdash; Divines &mdash;"},

//2
	{name : "Akatosh", shrine: "Dragon Slayer: 15 % magic resistance", follower : "Father of Dragons: Attacks, spells, scrolls, shouts and enchantments are X% better against dragons (based on favor with Akatosh).", devotee : "Turn the Hourglass: Praying to Akatosh resets the cooldown of your most recently used shout and power.",
     tenents: "Fulfill your destiny by saving Tamriel. Raise your character level. Absorb dragon souls. Never openly break the laws of Skyrim.", race: "All", starting: "Breton / Imperial / Khajiit / Nord", req: "None"},	  
//3
	{name : "Arkay", shrine: "Fortify Health: Increases your Health by 40 points.", follower : "Chalice of Life: Regenerate up to 5% of your maximum Health per second based on missing Health. Can perform Arkay's Rites.", devotee : "Arkayn Cycle: Revive with full Health upon taking fatal damage. Must pray to use this ability again. Costs 15% favor.",
     tenents: "Slay the undead and their summoners. Perform Arkay's Rites. Never openly break the laws of Skyrim. Never summon the undead or become one of them.", race: "All", starting: "Breton / Imperial / Nord / Bosmer", req: "None"},
//4
	{name : "Dibella", shrine: "Fortify Speech: Prices are 20% better.", follower : "Afterglow: Lover's Comfort (gained by sleeping with one's spouse) also improves all skills by 5%.", devotee : "Dibellan Arts: Activate a person in combat to make them unequip their items and follow you for 90 seconds. Costs 5% favor.",
     tenents: "Persuade others. Receive the blessing of Lover's Comfort. Find a new Sybil for my Temple. Pray only in the nude. Never openly break the laws of Skyrim.", race: "All", starting: "Breton / Imperial / Nord", req: "None"},
//5
	{name : "Julianos", shrine: "Fortify Magicka: Increases your Magicka by 40 points.", follower : "Divine Scholar: Spells cost X% less to cast (based on favor with Julianos).", devotee : "Temple of Logic: Spells and scrolls are X% more effective (based on favor with Julianos).",
     tenents: "Master the skills of the Mage. Strive to raise your Magicka. Never openly break the laws of Skyrim.", race: "All", starting: "Imperial", req: "None"},
//6
	{name : "Kynareth", shrine: "Fortify Stamina: Increases your Stamina by 40 points.", follower : "Windspeaker: The fierce spirit of Kyne increases movement speed by 15% in combat.", devotee : "Kynareth’s Emissary: Pray to Kynareth to summon a sacred Sabre Cat mount.",
     tenents: "Explore new locations. Strive to raise your Stamina. Receive the Voice of the Sky. Pray only outdoors. Never openly break the laws of Skyrim.", race: "All", starting: "Imperial / Khajiit / Nord", req: "None"},
//7
	{name : "Mara", shrine: "Fortify Restoration: Restoration spells cost 10% less to cast.", follower : "Increases your health regeneration by 1. Pray to Mara to cure all diseases affecting you or allies within 40 feet.", devotee : "Aura of Peace: Living allies within 40 feet are healed X points per second (based on favor with Mara).",
     tenents: "Be married. Own one or more houses. Be generous to beggars and children. Receive the blessing of Lover's Comfort. Never openly break the laws of Skyrim.", race: "All", starting: "Breton / Imperial / Nord / Bosmer", req: "None"},
//8
	{name : "Stendarr", shrine: "Fortify Block: Block 10% more damage.", follower : "Sacred Resolve: Take X% less attack damage from daedra and undead (based on favor with Stendarr).", devotee : "Channel Divinity: During prayer, you may spend 10% favor to gain X% improved attack, defense and healing (based on favor with Stendarr) for 60 minutes or 5 battles.",
     tenents: "Clear dungeons of evil. Slay daedra and the undead. Complete side quests for the people of Skyrim. Never openly break the laws of Skyrim. Never practice the foul summoning arts.", race: "All", starting: "Breton / Altmer / Imperial / Nord / Bosmer", req: "-"},
//9
	{name : "Talos", shrine: "Fortify Shouts: Time between shouts is reduced 20%.", follower : "Stormlord: Attacks and shouts against elves are increased by x%, while attacks against all other enemies are increased by half as much (based on favor with Talos).", devotee : "Dragon of the North: Your remaining shout cooldown is halved whenever an enemy dies within 50 feet.",
     tenents: "Bring the Civil War to a conclusion. Learn the dragon tongue. Absorb dragon souls. Slay elves and the Thalmor. Never openly break the laws of Skyrim.", race: "All", starting: "Imperial / Nord", req: "None"},
//10
	{name : "Zenithar", shrine: "Fortify Smithing: Able to improve items 5% better.", follower : "Work Ethic: Smithing, Alchemy and Enchanting are better (based on favor with Zenithar).", devotee : "Invisible Hand: Pray to Zenithar to buy and sell items directly.",
     tenents: "Invest in stores and merchants. Seek out skill training. Make weapons and armor. Never openly break the laws of Skyrim.", race: "All", starting: "Breton / Imperial / Nord", req: "None"},

//11 - Daedric princes 
		{name: "&mdash; Daedric Princes &mdash;"},
		
//12
	{name : "Azura", shrine: "Resist Magic: Resist 10% of magic.", follower : "Twilight Shroud: Foes within 40 feet suffer X% reduced magic resistance (based on favor with Azura) and can't absorb spells.", devotee : "Perfume of Moonshadow: Activate a person in combat below X% Health (based on favor with Azura) to paralyze them with 1 Health. Costs 5% favor.",
     tenents: "Trap souls in my name. Explore new locations. Pray only at twilight, preferably outside. Dark Elves and those skilled in Illusion are most deserving of my favor.", race: "Dunmer / Khajiit / everyone who completed 'The Black Star'", starting: "Dunmer / Khajiit", req: "Quest - The Black Star"},
//13
	{name : "Boethia", shrine: "Fortify One-Handed: You are 10% more effective with one-handed weapons.", follower : "Blood Throne: Your attacks deal X% more damage when fighting only one opponent (based on favor with Boethiah).", devotee : "Assassinate: During prayer, you may invoke superior Daedric Invisibility for 90 seconds. If broken by a sneak attack, it deals 25% more damage. Costs 10% favor.",
     tenents: "Murder the innocent. Strike unseen with sneak attacks. Poison your weapons. Dark Elves are most deserving of my favor.", race: "Dunmer / everyone who completed 'Boethiah's Calling'", starting: "Dunmer", req: "Quest - Boethiah’s Calling"},
//14
	{name : "Clavicus Vile", shrine: "Fortify Conjuration: Conjuration spells cost 10% less to cast.", follower : "Pactmaker: Conjuration spells and effects last 10% longer. Pray to make a Pact to gain favor with Clavicus Vile.", devotee : "Wishmaster: Pray to make a Wish, permanently gaining an additional perk point. Costs 30% favor.",
     tenents: "Pray to accept a Pact and complete it as written within the allotted time. Never break or ignore my Pacts", race: "Dunmer / everyone who completed 'A Daedra's Best Friend'", starting: "Dunmer", req: "Quest - A Daedra’s Best Friend"},
//15
	{name : "Hermaeus Mora", shrine: "Fortify Corpus: Spells and effects you cast on yourself last 15% longer.", follower : "Demon of Knowledge: Find Eldritch Pages on corpses. Similar pages can be bound at a tanning rack to create Eldritch Tomes that improve your magic and shouts.", devotee : "Omniscience: Pray to permanently raise a skill of your choice by one level. Costs 5% favor.",
     tenents: "Read Eldritch Pages and bind them into Eldritch Tomes. Read books that teach new skills. Become my Champion at the Summit of Apocrypha.", race: "Bosmer / Everyone who completed 'Discerning the Transmundane'", starting: "None", req: "-"},
//16
	{name : "Hircine", shrine: "Regenerate Stamina: Regenerate 2% of your maximum Stamina per second.", follower : "Bitter Mercy: Hircine's gift doubles attack damage to living targets with X% or less Health (based on favor with Hircine).", devotee : "Posting of the Hunt: During prayer, invoke a Hunt against the living within 500 feet, revealing them and exposing them to Bitter Mercy. Costs 10% favor.",
     tenents: "Slay the living in open combat, especially those stronger than you. Live as a werewolf. Pray in the wild. Those skilled in Light Armor are most deserving of my favor.", race: "Breton / Bosmer / Werewolf / everyone who completed 'Ill Met by Moonlight'", starting: "Bosmer", req: "-"},
//17
	{name : "Jyggalag", shrine: "Daedra Slayer: Deal 15% more attack damage and critical damage against daedra.", follower : "Obelisks of Order: Generates 8 Obelisks of Order in Skyrim. Activating one grants 15 points of Health, Magicka and Stamina.", devotee : "Stasis: Activate an opponent in combat to trap them in an inert but invulnerable state for 15 seconds. Costs 5% favor.",
     tenents: "Activate my Obelisks of Order. Clear dungeons of evil. Slay daedra. Never serve Sheogorath. Those skilled in Heavy Armor are most deserving of my favor.", race: "All", starting: "None", req: "-"},
//18
	{name : "Malacath", shrine: "Fortify Power Attacks: Your power attacks cost 10% less Stamina.", follower : "Deathbringer: Your power attacks deal X% more damage (based on favor with Malacath).", devotee : "Bloodsoaked Triumph: When an enemy dies within 40 feet, their killer is healed by X% of the amount of overkill damage dealt (based on favor with Malacath).",
     tenents: "Defeat epic foes. Improve weapons and armor. Never commit a crime against the strongholds. Orsimers and those skilled in Smithing are most deserving of my favor.", race: "Dunmer / Orsimer / everyone who completed 'The Cursed Tribe'", starting: "Dunmer / Orsimer", req: "-"},
//19
	{name : "Mehrunes Dagon", shrine: "Amplify Destruction: Destruction spells are 10% more effective.", follower : "Self-Immolation: Daedric fire burns your spirit as you pray, draining Magicka. Stop praying at 20% or less to gain more favor and Burning Path activations.", devotee : "Burning Path: Nearby foes burn for X damage and explode on death for X damage (based on favor with Mehrunes Dagon). Pray to recharge.",
     tenents: "Slay people who stand in your way. Defile the shrines of my enemies. Those skilled in Destruction are most deserving of my favor.", race: "Dunmer / Khajiit / everyone who completed 'Pieces of the Past'", starting: "Dunmer / Khajiit", req: "-"},
//20
	{name : "Mephala", shrine: "Fortify Poisons: Poisons you mix are 15% more effective.", follower : "Secret Murder: Sneak attacks deal X% more damage from behind (based on favor with Mephala).", devotee : "Whispers of Betrayal: During prayer, seize control of the nearest person within 75 feet to fight for you. Costs 5% favor.",
     tenents: "Poison your weapons. Strike unseen with sneak attacks. Intimidate the weak. Dark Elves are most deserving of my favor.", race: "Dunmer / Khajiit / everyone who completed 'The Whispering Door'", starting: "Dunmer / Khajiit", req: "-"},
//21
	{name : "Meridia", shrine: "Amplify Restoration: Restoration spells are 10% more effective.", follower : "Purification: Attacks, spells, scrolls, shouts and enchantments are X% better against undead (based on favor with Meridia).", devotee : "Supreme Light: Activate an undead opponent in combat to call down a solar strike to deal X damage (based on favor with Meridia) and half to nearby undead. Costs 10% favor.",
     tenents: "Slay the undead. Never summon the undead or become one of them. High Elves and those skilled in Restoration are most deserving of my favor.", race: "Altmer / everyone who completed 'The Break of Dawn'", starting: "None", req: "-"},
//22
	{name : "Molag Bal", shrine: "Fortify Destruction: Destruction spells cost 10% less to cast.", follower : "Eye of the Storm: Absorbs X Magicka and Stamina per second (based on favor with Molag Bal) from nearby enemies in combat.", devotee : "Dragged to Oblivion: Activate a person in combat to banish them to Coldharbour. Pray to request the items. Costs 15% favor.",
     tenents: "Slay people who stand in your way. Trap souls in my name. Live as a vampire and never seek a cure. Those skilled in Destruction are most deserving of my favor.", race: "Dunmer / vampire / everyone who completed 'The House of Horrors'", starting: "Dunmer", req: "-"},
//23
	{name : "Namira", shrine: "Resist Disease: Increases Disease Resistance by 25%.", follower : "Creeping Decay: Reduces Poison Resist of all within 40 feet by X% (based on favor with Namira).", devotee : "Necrophages: Poisoning a person or putting a Human Heart or Flesh into their inventory attracts insects, reducing armor by X% and dealing X disease damage (based on favor with Namira).",
     tenents: "Murder the innocent. Poison your weapons. Eat the corpses of the dead with my Ring. Be generous to beggars.", race: "Dunmer / everyone who completed 'The Taste of Death'", starting: "None", req: "-"},
//24
	{name : "Nocturnal", shrine: "Fortify Sneak: You are 25% harder to detect.", follower : "Vanish in the Night: Praying clears non-violent crime bounties up to X gold (based on favor with Nocturnal).", devotee : "Raven's Watch: During the night, you are less likely to be detected and are more proficient with picking pockets. During prayer, you may astrally observe the nearest person within 300 feet.",
     tenents: "Pickpocket Mysterious Coinpurses. Pick locks successfully. Pray only at night, preferably in darkness. Those skilled in Sneak are most deserving of my favor.", race: "Dunmer / everyone who completed 'Darkness Returns'", starting: "None", req: "-"},
//25
	{name : "Peryite", shrine: "Resist Poison: Increases Poison Resistance by 50%.", follower : "Taskmaster: All skills are more efficient (based on favor with Peryite). Pray for Peryite's Gifts to gain favor.", devotee : "Green Dragon’s Breath: Activate a living opponent in combat to inflict all of Peryite's Gifts you have on the target, plus 5 disease damage per second for each gift. Pray to recharge.",
     tenents: "Catch as many diseases as you can. Accept my Gifts of pestilence. Pray only while diseased. Never accept a cure for your afflictions.", race: "Diseased / everyone who completed 'The Only Cure'", starting: "None", req: "-"},
//26
	{name : "Sanguine", shrine: "Fortify Potions: Using beneficial potions and alchemical ingredients is 15% better.", follower : "Be Merry: Health, Magicka and Stamina regenerate 50% faster while a potion, food item or ingredient is active.", devotee : "Pandemonium: Can pray in combat, forcing the 5 nearest hostile people to dance for 20 seconds. Costs 10% favor.",
     tenents: "Make mischief and commit misdemeanors and crimes worthy of a bounty. Indulge in mead, wine and ale. Find your own way out of jail.", race: "Dunmer / everyone who completed 'A Night to Remember'", starting: "None", req: "-"},
//27
	{name : "Sheogorath", shrine: "???: Grants a random blessing!", follower : "Touch of Madness: Praying grants a random Touch of Madness. High favor with Sheogorath yields more beneficial effects.", devotee : "Lost to Madness: Receive a Touch of Madness whenever you enter combat.",
     tenents: "Pray often and receive Sheogorath's Touch of Madness. Never disrespect cheese.", race: "Dunmer / Khajiit / everyone who completed 'The Mind of Madness'", starting: "Dunmer / Khajiit", req: "-"},
//28
	{name : "Vaermina", shrine: "Fortify Illusion: Illusion spells cost 10% less to cast.", follower : "Night Terrors: Mind affecting illusion spells work on targets x levels higher and cost 50% less magicka while out of combat (based on favor with Vaermina).", devotee : "Phantasmagoria: Activate a sleeping person to summon an illusion to accompany you for an hour. Costs 5% favor.",
     tenents: "Witness the death of those under your mind affecting spells. Kill people in their sleep. Sleep to pray. Those skilled in Illusion are most deserving of my favor.", race: "Dunmer / everyone who completed 'Waking Nightmare'", starting: "None", req: "-"},

//29 - Elven ancestors
	{name: "&mdash; Elven Ancestors &mdash;"},

//30
{name : "Auriel", shrine: "Fortify Archery: You are 10% more effective with missile weapons.", follower : "Father of Mer: All skills are % more efficient (based on favor with Auriel).", devotee : "Path to Alaxon: Attaining level 100 in a skill improves that skill by X% (based on favor with Auriel).",
     tenents: "Fulfill your destiny by saving Tamriel. Master all skills. Become my Champion at my sacred Chantry. High Elves are most deserving of my favor.", race: "Breton / Altmer / Bosmer", starting: "Altmer / Bosmer", req: "-"},
//31
	{name : "Jephre", shrine: "Fortify Carry Weight: Carrying capacity increased by 50 points.", follower : "Forest Stride: The unbounded spirit of Jephre increases movement speed by 10% when out of combat.", devotee : "The Eternal Song: Stamina regenerates 25% faster in combat and 50% faster out of combat. Praying to Jephre brings clear weather.",
     tenents: "Explore new locations. Read the stories of others. Hunt animals. Wood Elves are most deserving of my favor.", race: "All", starting: "Altmer / Bosmer", req: "-"},
//32
	{name : "Magnus", shrine: "Spell Absorption: 10% chance to absorb a hostile spell and recharge your Magicka.", follower : "Sight, Light and Insight: Magicka does not regenerate, but praying rapidly replenishes Magicka. Spells cost 50% less to cast.", devotee : "Architect's Gift: Praying, automatically casts the (beneficial self targeted) spells in your hands for no Magicka and they last X% longer (based on favor with Magnus).",
     tenents: "Practice magic successfully while praying. Safeguard the Eye of Magnus. Create enchanted items.", race: "All", starting: "Breton / Altmer / Bosmer", req: "-"},
//33
	{name : "Phynaster", shrine: "Fortify Alchemy: Potions and poisons you mix are 10% stronger.", follower : "Shorter Strides: Health, Magicka and Stamina regenerate 200% faster when standing still but 100% slower when moving.", devotee : "Elvenpath: During prayer, you may teleport back to the last location where you prayed. Costs 2% favor.",
     tenents: "Explore new locations. Find the standing stones of Skyrim. Harvest the fruits of nature. Bretons are most deserving of my favor.", race: "Breton / Altmer / Bosmer", starting: "Breton / Altmer / Bosmer", req: "-"},
//34
	{name : "Syrabane", shrine: "Regenerate Magicka: Regenerate 2% of your maximum Magicka per second.", follower : "Knowledge Seeker: You are more likely to find spell tomes and scrolls on enemies you kill.", devotee : "Reach for the Stars: Spells cost X% less to cast (based on favor with Syrabane).",
     tenents: "Read books that teach new skills. Study a wide variety of spells. High Elves are most deserving of my favor.", race: "Breton / Altmer / Bosmer", starting: "Altmer", req: "-"},
//35
	{name : "Trinimac", shrine: "Fortify Two-Handed: You are 10% more effective with two-handed weapons.", follower : "Tears of Man: Attacks deal X% more damage and critical damage to humans (based on favor with Trinimac).", devotee : "Manifest Divinity: When praying, you may become ethereal and invulnerable until your next attack. Costs 5% favor.",
     tenents: "Slay humans. Defeat epic foes. Never accept Boethiah's blessing or serve her. Those skilled in Two-Handed are most deserving of my favor.", race: "Altmer / Orsimer / Bosmer", starting: "Altmer / Orsimer", req: "-"},
//36
	{name : "Xarxes", shrine: "Fortify Scrolls: Scrolls are 25% more effective.", follower : "Scribe’s Insight: If you read a Skill Book while praying, Xarxes grants you an extra Skill Point in that skill.", devotee : "Panopticon: During prayer, you may ascend in a trance, revealing all characters in a very large radius.",
     tenents: "Explore new locations. Read the stories of others. Study a wide variety of spells. Bretons are most deserving of my favor.", race: "Breton / Altmer / Bosmer", starting: "Breton / Altmer / Bosmer", req: "-"},
//37
	{name : "Z'en", shrine: "Fortify Alteration: Alteration spells cost 10% less to cast.", follower : "Traveler's Break: Beneficial potions, food and ingredients last 50% longer and are x% better (based on favor with Z'en).", devotee : "Merchant’s Knapsack: Pray to open an unlimited extradimensional storage space.",
     tenents: "Bribe people as needed. Harvest the fruits of nature. Eat as much food as you want. Those skilled in Speech are most deserving of my favor.", race: "Bosmer", starting: "Bosmer", req: "-"},

//38 - DUNMER TRIBUNAL
	{name: "&mdash; Dunmer Tribunal &mdash;"},

//39
	{name : "Almalexia", shrine: "Lady's Grace - Increases your health by 10 points.", follower : "Face-Snaked Queen - Attacks deal X% more damage to Nords and Argonians (based on favor with Almalexia).", devotee : "Ayem's Mercy - Healing in all forms is X% more effective (based on favor with Almalexia).",
     tenents: "Vanquish the threats facing Solstheim. Be generous to beggars and children. Receive the blessing of Lover's Comfort. Dark Elves are most deserving of my favor.", race: "Dunmer / everyone who completed 'Ghosts of the Tribunal'", starting: "Dunmer", req: "-"},
//40
	{name : "Sotha Sil", shrine: "Soul of Sotha Sil - Increases your magicka by 5 points.", follower : "Seht's Guidance - Items are enchanted X% stronger (based on favor with Sotha Sil).", devotee : "Seht's Brilliance - Using a filled soul gem or dynamo core, permanently summon a Dwarven automaton to fight for you. You may only have one active at a time.",
     tenents: "Uncover the secrets of Dwemer ruins. Create enchanted items. Master the skills of the Mage. Dark Elves and those skilled in Enchanting are most deserving of my favor.", race: "Dunmer / everyone who completed 'Ghosts of the Tribunal'", starting: "Dunmer", req: "-"},
//41
	{name : "Vivec", shrine: "Vivec's Mystery - Increases sneak by 5 points.", follower : "Vehk's Guile - Speech and Intimidate checks are X% easier (based on favor with Vivec).", devotee : "Might of the Armiger - Your power attacks deal X% more damage (based on favor with Vivec).",
     tenents: "Fulfill your destiny by saving Tamriel. Read the stories of others. Defeat epic foes. Dark Elves and those skilled in Speechcraft are most deserving of my favor.", race: "Dunmer / everyone who completed 'Ghosts of the Tribunal'", starting: "Dunmer", req: "-"},

//42 - YOKUDAN PANTHEON
	{name: "&mdash; Yokudan Pantheon &mdash;"},

//43
	{name : "Leki", shrine: "Fortify Light Armor: Armor rating of light armor pieces is increased by 10%.", follower : "Spirit Sword: Power attacks ignore X% of an opponent's armor (based on favor with Leki).", devotee : "Battle Meditation: During prayer, you may spend 5% favor to gain X% melee damage (based on favor with Leki) for 60 minutes or 10 battles. Costs 5% favor.",
     tenents: "Bring the Civil War to a conclusion. Make and improve weapons. Master the skills of the Warrior.", race: "Redguard", starting: "Redguard", req: "-"},
//44
	{name : "Morwha", shrine: "Fortify Healing: Healing spells restore 15% more Health.", follower : "Healer of the Sands: Meditation restores x Health per second for you and nearby allies (based on favor with Morwha).", devotee : "Fertile Growth: Praying to Morwha blesses you with enchanted fruit that restores or fortifies an attribute.",
     tenents: "Be married. Receive the blessing of Lover's Comfort. Harvest the fruits of nature. Eat as much food as you want.", race: "Redguard", starting: "Redguard", req: "-"},
//45
	{name : "Satakal", shrine: "Regenerate Health: Regenerate 2% of your maximum Health per second.", follower : "World Egg: Shrine blessings from other gods are X% more effective and last X% longer (based on favor with Satakal).", devotee : "Ouroboros: Pray to become reborn as a different person, moving points between your attributes. Costs 15% favor.",
     tenents: "Fulfill your destiny by saving Tamriel. Strive to raise your Health. Absorb dragon souls.", race: "Redguard", starting: "Redguard", req: "-"},
//46
	{name : "Tall Papa", shrine: "Fortify Enchanting: Items are enchanted 10% stronger.", follower : "Metaphysical Insight: Weapon enchantments drain X% less charge (based on favor with Tall Papa).", devotee : "Glimpse the Shores: On death, enter an ethereal ascended state. If combat ends within X seconds, brings you back to life (based on favor with Tall Papa) for 5% favor. Pray to reset.",
     tenents: "Touch the Fractures scattered around Skyrim. Create enchanted items. Those skilled in Enchanting are most deserving of my favor.", race: "Redguard", starting: "Redguard", req: "-"},
//47
	{name : "The HoonDing", shrine: "Fortify Stagger: Stagger from attacks and bashes is 50% more effective.", follower : "Make Way: Staggering an opponent reduces armor by X points for 5 seconds (based on favor with the HoonDing).", devotee : "Perseverance: Grants immunity to stagger from attacks and bashes.",
     tenents: "Slay your foes in open combat, especially those stronger than you. Those skilled in One-Handed are most deserving of my favor.", race: "Redguard", starting: "Redguard", req: "-"},

//48 - KHAJIITI PANTHEON
	{name: "&mdash; Khajitti Pantheon &mdash;"},

//49
	{name : "Rajhin", shrine: "Fortify Lockpicking: Lockpicking is 10% easier.", follower : "Rajhin’s Tales: Find additional gold in many containers, with a chance to find a large amount of additional gold.", devotee : "Prayer of Unlocking: Pray to Rajhin to break a lock within 20 feet. Costs 5% favor. No effect on locks that can’t be picked.",
     tenents: "Explore new locations. Bribe people as needed. Pick locks successfully. Those skilled in Lockpicking are most deserving of my favor.", race: "Khajiit", starting: "Khajiit", req: "-"},
//50
	{name : "Riddle'Thar", shrine: "Fortify Unarmed Damage: Unarmed strikes do 20 additional damage.", follower : "Path to Llesw’er: All skills are % more efficient (based on favor with Riddle'Thar).", devotee : "Beseech the Manes: During prayer, an ancient Mane will grant a blessing they believe to be appropriate for the challenges you are about to face.",
     tenents: "Master the skills of the Warrior, Thief and Mage. Strive to raise your Health, Magicka and Stamina. Each is as important as the others. Pray only at night.", race: "Khajiit", starting: "Khajiit", req: "-"},

//51 - MISCELLANEOUS DEITIES
	{name: "&mdash; Miscellaneous Deities &mdash;"},

//52
	{name : "Baan Dar", shrine: "Fortify Pickpocket: Pickpocketing is 10% easier.", follower : "Pariah: Selling to fences is x% more lucrative. Pickpocketing is x% easier (based on favor with Baan Dar).", devotee : "Skooma Trick: Put skooma bottles in people's inventory, then pray to Baan Dar to ignite them within 200 feet for X damage (based on favor with Baan Dar). Costs 5% favor.",
     tenents: "Pick locks and pockets successfully. Khajiit and those skilled in Archery are most deserving of my favor.", race: "Khajiit / Bosmer", starting: "None", req: "-"},
//53
	{name : "Ebonarm", shrine: "Fortify Heavy Armor: Armor rating of heavy armor pieces is increased by 10%.", follower : "Enemy of the Daedra: Attacks and critical strikes are X% more effective against daedra and those who summon them (based on favor with Ebonarm).", devotee : "Raven’s Harvest: Reduces the armor of enemies within 40 feet by X points (based on favor with Ebonarm) and you gain the total amount. Doubled against daedra.",
     tenents: "Slay daedra. Defeat epic foes. Complete miscellaneous quests for the people of Skyrim. Those skilled in Block are most deserving of my favor.", race: "All", starting: "None", req: "-"},
//54
	{name : "Mannimarco", shrine: "Amplify Conjuration: Conjuration spells are 10% more effective.", follower : "Dark Moon: Undead conjured at night last X% longer (based on favor with Mannimarco).", devotee : "Nocturne: Allied conjured undead deal X% more attack damage and regenerate Health (based on favor with Mannimarco).",
     tenents: "Trap souls in my name. Pray only at night. Never accept Arkay's blessing. Those skilled in Conjuration are most deserving of my favor.", race: "All", starting: "None", req: "-"},
//55
	{name : "Shor", shrine: "Elf Slayer: Deal 15% more attack damage and critical damage against elves.", follower : "Another Name for Freedom: Take X% less attack damage and stagger from elves (based on favor with Shor).", devotee : "Destiny: When entering combat with a mighty foe, Shor sends a Shield-Thane to assist you. Pray to recharge.",
     tenents: "Fulfill your destiny by saving Tamriel. Master the skills of the Warrior. Slay elves. Defeat epic foes.", race: "Breton / Imperial / Nord / Redguard", starting: "Nord", req: "-"},
//56
	{name : "Sithis", shrine: "Fortify Sneak Attacks: Sneak attacks deal 15% more damage.", follower : "Primal Darkness: Up to 25% harder to detect by those within 30 feet. Chance to find Human Hearts on people you kill.", devotee : "Call of the Void: While sneaking, activate a door to briefly turn it into a Void portal. Targets within 60 feet who are not detecting you are pulled in and killed. Costs 5% favor.",
     tenents: "Murder the innocent. Pray while sacrificing a Human Heart or Human Flesh. Send your victims to the Void. Argonians are most deserving of my favor.", race: "Argonian / everyone who completed 'Innocence Lost'", starting: "Argonian", req: "-"},
//57
	{name : "St. Alessia", shrine: "Fortify Followers: Followers within 20 feet gain 50 points of armor and 10% magic resistance.", follower : "Covenant of Man: Pray for a Divine blessing of your choice. Divine blessings are X% better (based on favor with St. Alessia).", devotee : "Dragonblood Empress: While under the effects of a Divine blessing, can talk to most non-hostile humans to make them a friend and potential follower. Costs 10% favor.",
     tenents: "Have a follower at your side. Slay elves. Receive the blessing of a Divine.", race: "Breton / Imperial / Nord / Redguard", starting: "None", req: "-"},
//58
	{name : "The All-Maker", shrine: "Animal Hunter: Deal 15% more attack damage and critical damage against animals.", follower : "Wellspring of Life: Healing spells restore X% more Health (based on favor with the All-Maker).", devotee : "World Shaman: After using an All-Maker Stone power, pray to the All-Maker to have it restored to you.",
     tenents: "Cleanse the All-Maker Stones. Hunt animals. Explore new locations. Pray only outdoors. Nords are most deserving of my favor.", race: "Breton / Imperial / Nord / Redguard", starting: "None", req: "-"},
//59
	{name : "The Hist", shrine: "Fortify Armor: Tough scales increase armor by 50 points.", follower : "Symbiosis: Pray to gain a X point bonus to all attributes for X seconds (based on favor with the Hist).", devotee : "Deep Roots: Absorb X% of the Magicka and Stamina of dead creatures and people within 60 feet (based on favor with the Hist).",
     tenents: "Explore new locations. Slay daedra. Pray only outdoors. Never summon a daedra.", race: "Argonian", starting: "Argonian", req: "-"},
//60
	{name : "The Magna-Ge", shrine: "Amplify Alteration: Alteration spells are 10% more effective.", follower : "Shimmering Light: Gain 5 points of weapon charge per second, up to their charge level when last equipped or recharged.", devotee : "Starlit Path: During prayer, you may let the Magna-Ge carry you to a location within line of sight. Costs 4% favor.",
     tenents: "Create enchanted items. Explore new locations. Pray only outdoors at night. High Elves and those skilled in Alteration are most deserving of our favor.", race: "All", starting: "None", req: "-"},
//61
	{name : "The Old Ways", shrine: "Animal Slayer: Deal 15% more attack damage and critical damage against animals.", follower : "Totem Worship: Pray while sacrificing 100 gold worth of gemstones to assume the powers of an animal god.", devotee : "Dragon Cult: Able to assume the powers of the Dragon. Costs 2% favor per hour.",
	 tenents: "Slay people who stand in your way. Absorb dragon souls. Assume our powers through prayer. Nords are most deserving of our favor.", race: "Breton / Nord", starting: "None", req: "-"},
  ];
