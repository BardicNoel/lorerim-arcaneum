//To do: add bonuses to derrAts
const standingStoneData = [
	//0
{name: "None", group: "", 
description: "", 
bonus: ""},
	//1
{name: "Warrior", group: "The Warrior is the first Guardian Constellation and he protects his charges during their seasons. The Warrior's own season is Last Seed when his strength is needed for the harvest.", 
description: "Those under the sign of the Warrior have increased strength and endurance.", 
bonus: "Health increases by 50, all weapons deal 10% more damage, armor penetration with all weapons is increased by 5 (doubling when the corresponding weapon skill is mastered), unarmed strikes do 10 additional damage"},
	//2
{name: "Lady", group: "The Lady is one of the Warrior's Charges and her season is Heartfire.", 
description: "Those under the sign of the Lady have increased vitality.", 
bonus: "Health and stamina increase by 25, health and stamina regenerate 40 pecent faster (doubling when a warrior skill is mastered), you can run and swim without exhaustion."},
	//3
{name: "Lord", group: "The Lord's season is First Seed and he oversees all of Tamriel during the planting.", 
description: "The Stone of the Lord grants natural regeneration and weakened hostile spells, but also afflicts them with the Trollkin curse.", 
bonus: "10% magic resist, 150 armor rating, 25% weakness to fire if you have not mastered a warrior skill."},
	//4
{name: "Steed", group: "The Steed is one of the Warrior's Charges, and her season is Mid Year.", 
description: "Those under the sign of the Steed have increased speed.", 
bonus: "Movement is 10 percent faster, sprinting is 10% faster, carry weight increases by 25, stamina increased by 50, most slow effects don't affect you. Restore 1 stamina per second if you have mastered a warrior skill."},
	//5
{name: "Mage", group: "The Mage is a Guardian Constellation whose season is Rain's Hand when magicka was first used by men.", 
description: "Those under the sign of the Mage have increased magicka reserves and cast more potent spells.", 
bonus: "Magicka increases by 150, spells are 10% stronger, doubling up to 20% when you master the relevant magic skill."},
	//6
{name: "Apprentice", group: "The Apprentice's season is Sun's Height.", 
description: "Those under the sign of the Apprentice have increased magicka and faster regeneration, but also have a weakness to magic.", 
bonus: "Magicka increases by 100, magicka regenerates an extra 5 per second, magic deals 25% more damage to you if you have not mastered any magical skills."},
	//7
{name: "Atronach", group: "The Atronach is one of the Mage's Charges. Its season is Sun's Dusk", 
description: "Those under the sign of the Atronach have deep reserves of magicka and can absorb harmful magic, but cannot generate magicka on their own.", 
bonus: "Magicka increases by 200, increasing up to 300 when you have mastered a magic skill, you do not lose magicka when hit, increases chance to absorb magicka from hostile spells by 30%, you cannot regenerate magicka by yourself or non-magical sources."},
	//8
{name: "Ritual", group: "The Ritual is one of the Mage's Charges and its season is Morning Star.", 
description: "Those under the sign of the Ritual have various abilities depending on the aspect of the moons and Divines.", 
bonus: "You receive Blessed Fire, Dead Horde and Salvation powers. Enchanting is 10% stronger when you master enchanting."},
	//9
{name: "Thief", group: "The Thief is the last Guardian Constellation, and her season is the darkest month of Evening Star.", 
description: "Those under the sign of the Thief have increased dexterity.", 
bonus: "Lockpicks are 30% more durable, lockpicking expertise is increased by 2, pickpocketing is 30% more likely to succeed, you are 30% harder to detect, you can sneak without proficiency, gain 10% chance to avoid physical damage. After mastering alchemy, able to apply 1 extra poison dose."},
	//10
{name: "Lover", group: "The Lover is one of the Thief's Charges and her season is Sun's Dawn", 
description: "Those under the sign of the Lover have increased agility and natural charm.", 
bonus: "Stamina regeneration increases by 40%, increases chance to avoid physical damage by 25%, speech skill is 25 higher, shout cooldown is reduced by 5%, and an additional 5% after mastering speechcraft."},
	//11
{name: "Shadow", group: "The Shadow's season is Second Seed.", 
description: "Those under the sign of the Shadow are naturally skilled at stealth and can hide in the shadows once a day.", 
bonus: "You are 50% harder to detect, you can sneak without proficiency, movement noise is 30% quieter, you receive Moonshadow power. Gain 5% armor penetration upon mastering sneak, wayfarer or finesse."},
	//12
{name: "Tower", group: "The Tower is one of the Thief's Charges and its season is Frostfall.", 
description: "Those under the sign of the Tower have nimble hands and a knack for finding fortune.", 
bonus: "Prices are 20% more favorable, 50 more carry weight, lockpicks are 40% more durable, lockpicking expertise is increased by 4, you can pick effortless locks in plain sight without being noticed. Reflect 10% damage upon mastering a defensive skill."},
	//13
{name: "Serpent",group: "The Serpent wanders about in the sky and has no Season, though its motions are predictable to a degree.", 
description: "Those under the sign of the Serpent have improved precision, resistance to poison and paralysis, and can cast Serpent's Curse once a day.", 
bonus: "Armor penetration with all weapons is increased by 15, poison deals 50% less damage to you, doubling at level 40, most paralysis effects don't adversely affect you, you receive Serpent's Curse power."}
];
