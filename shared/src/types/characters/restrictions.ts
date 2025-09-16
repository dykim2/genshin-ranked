import { CHARACTERS } from "./names";

type CharMap = {
   [index in CHARACTERS]:  CharacterRestriction
}
type CharacterRestriction = {
    limit: number;
    differences: number[];
    restrictions: string[];
}

export const CHARACTER_RESTRICTIONS: CharMap = {
	[CHARACTERS.NoBan]: {
		limit: 0,
		differences: [],
		restrictions: [],
	},
	[CHARACTERS.None]: {
		limit: 0,
		differences: [],
		restrictions: [],
	},
	[CHARACTERS.Random]: {
		limit: 6,
		differences: [-1],
		restrictions: ["Random characters don't have restrictions!"]
	},
	[CHARACTERS.Aino]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Albedo]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Alhaitham]: {
		limit: 4,
		differences: [2, 3, 4],
		restrictions: [
			"Any 5* Weapon | R3+ Wolf-Fang",
			"Wolf-Fang | Harbinger of Dawn",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Aloy]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Amber]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Arlecchino]: {
		limit: 2,
		differences: [1, 2],
		restrictions: ["Any 5* Weapon, Ballad of Fjords, Deathmatch, Lithic Spear", "Any 3* Weapon"],
	},
	[CHARACTERS.Ayaka]: {
		limit: 6,
		differences: [2, 3, 4],
		restrictions: [
			"No Restrictions",
			"Any 5* Weapon | R3+ Wolf-Fang",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Ayato]: {
		limit: 6,
		differences: [3, 6],
		restrictions: [
			"Haran Geppaku Futsu | Jade Cutter",
			"Any 4* Weapon | Harbinger of Dawn",
		],
	},
	[CHARACTERS.Baizhu]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Weapon"],
	},
	[CHARACTERS.Barbara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Beidou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Bennett]: {
		limit: 6,
		differences: [5],
		restrictions: [
			"Freedom-Sworn",
		],
	},
	[CHARACTERS.Candace]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Charlotte]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Chasca]: {
		limit: 3,
		differences: [0, 1, 2, 3],
		restrictions: [
			"Astral Vulture's Crimson Plumage",
			"Any 5* Weapon | Scion of The Blazing Sun | Flower-Wreathed Feathers | Range Gauge",
			"Any 3* Weapon,\nAllowed: Sacrificial Bow | End of the Line",
			"Any 2* Weapon"
		],
	},
	[CHARACTERS.Chevreuse]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Chiori]: {
		limit: 3,
		differences: [3],
		restrictions: ["Peak Patrol Song | Uraku Misugiri"],
	},
	[CHARACTERS.Chongyun]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Citlali]: {
		limit: 1,
		differences: [-1],
		restrictions: [],
	},
	[CHARACTERS.Clorinde]: {
		limit: 2,
		differences: [1, 2],
		restrictions: [
			"Any 5* Weapon | R3+ The Black Sword,\nAllowed: Splendor of Tranquil Waters, Azurelight",
			"Any 4* Weapon,\nAllowed: Sword of Narzissenkreuz, The Flute",
		],
	},
	[CHARACTERS.Collei]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Cyno]: {
		limit: 6,
		differences: [3, 6],
		restrictions: [
			"Staff of Scarlet Sands | Primorial Jade-Winged Spear",
			"Any 4* Weapon | White Tassel,\nAllowed: Favonius Lance",
		],
	},
	[CHARACTERS.Dahlia]: {
		limit: 6,
		differences: [-1],
		restrictions: [""]
	},
	[CHARACTERS.Dehya]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Diluc]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Diona]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Dori]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Emilie]: {
		limit: 3,
		differences: [1, 2, 3],
		restrictions: [
			"Lumidouce Elegy",
			"Any 4* Weapon",
			"White Tassel"
		],
	},
	[CHARACTERS.Escoffier]: {
		limit: 2,
		differences: [0, 1, 2],
		restrictions: [
			"Symphonist of Scents",
			"Any 4* Weapon",
			"Any 2* Weapon"
		]
	},
	[CHARACTERS.Eula]: {
		limit: 5,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Faruzan]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Fischl]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Flins]: {
		limit: 1,
		differences: [0, 1],
		restrictions: ["Unknown", "Unknown"]
	},
	[CHARACTERS.Freminet]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Furina]: {
		limit: 2,
		differences: [2],
		restrictions: ["Any 3* Weapon\nTeams may no longer manipulate HP between bosses after the first boss."],
	},
	[CHARACTERS.Gaming]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Ganyu]: {
		limit: 6,
		differences: [1, 3, 4, 6],
		restrictions: [
			"Astral Vulture's Crimson Plumage",
			"Any 5* Weapon | R3+ Scion of The Blazing Sun | R3+ Flower-wreathed Feathers",
			"Any 4* Weapon",
			"Any 3* Weapon"
		],
	},
	[CHARACTERS.Gorou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.HuTao]: {
		limit: 6,
		differences: [3, 6],
		restrictions: ["Staff of Homa", "Any 4* Weapon"],
	},
	[CHARACTERS.Iansan]: {
		limit: 6,
		differences: [-1],
		restrictions: []
	},
	[CHARACTERS.Ifa]: {
		limit: 6,
		differences: [-1],
		restrictions: []
	},
	[CHARACTERS.Ineffa]: {
		limit: 2,
		differences: [1, 2],
		restrictions: ["Fractured Halo", "Any 5* Weapon"]
	},
	[CHARACTERS.Itto]: {
		limit: 6,
		differences: [5, 6],
		restrictions: [
			"Redhorn Stonethresher | R3+ Serpent Spine",
			"Any 4* Weapon | White Iron Greatsword | Ferrous Shadow,\nAllowed: Favonius Greatsword",
		],
	},
	[CHARACTERS.Jean]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kachina]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kazuha]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Weapon"],
	},
	[CHARACTERS.Kaeya]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kaveh]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Keqing]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Kinich]: {
		limit: 1,
		differences: [1, 2, 3],
		restrictions: ["Any 5* Weapon | Serpent Spine", "Any 4* Weapon | Bloodtainted Greatsword | Debate Club | Any 2* Weapon"],
	},
	[CHARACTERS.Kirara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Klee]: {
		limit: 6,
		differences: [2, 6],
		restrictions: ["Any 5* Weapon | R3+ Solar Pearl", "Solar Pearl"],
	},
	[CHARACTERS.Kokomi]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.KujouSara]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.KukiShinobu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lauma]: {
		limit: 1,
		differences: [0, 1],
		restrictions: ["NO restrictions", "Nightweaver's Looking Glass"],
	},
	[CHARACTERS.LanYan]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Layla]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lisa]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lynette]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Lyney]: {
		limit: 2,
		differences: [1, 2],
		restrictions: ["Astral Vulture's Crimson Plumage | The First Great Magic | Thundering Pulse | Aqua Simulacra", "Any 4* Weapon, Slingshots"],
	},
	[CHARACTERS.Mika]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Mizuki]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Elemental Mastery Weapon | Sacrificial Fragments | Wandering Evenstar"],
	},
	[CHARACTERS.Mona]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Mavuika]: {
		limit: 2,
		differences: [0, 1, 2],
		restrictions: [
			"A Thousand Blazing Suns",
			"Any 4* Weapon,\nAllowed: Earth Shaker | Prototype Archaic | Favonius Greatsword",
			"Any 3* Weapon"
		],
	},
	[CHARACTERS.Mualani]: {
		limit: 2,
		differences: [1, 2],
		restrictions: [
			"Any 5* Weapon | Prototype Amber | Waveriding Whirl",
			"Any 3* Weapon,\nAllowed: Emerald Orb",
		],
	},
	[CHARACTERS.Nahida]: {
		limit: 6,
		differences: [3, 4, 6],
		restrictions: [
			"Thousand Floating Dreams",
			"Any 5* Weapon | Wandering Evenstar",
			"Any 3* Weapon",
		],
	},
	[CHARACTERS.Navia]: {
		limit: 1,
		differences: [1, 2],
		restrictions: ["Verdict, A Thousand Blazing Suns", "Any 4* Weapon"],
	},
	[CHARACTERS.Neuvillette]: {
		limit: 1,
		differences: [0, 1],
		restrictions: [
			"Tome of The Eternal Flow | Surf's Up",
			"Any 4* Weapon, Thrilling Tales of Dragon Slayers"
		],
	},
	[CHARACTERS.Nilou]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 5* Weapon | R3+ Wolf Fang"],
	},
	[CHARACTERS.Ningguang]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Noelle]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Ororon]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Qiqi]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Raiden]: {
		limit: 6,
		differences: [4, 6],
		restrictions: [
			"Any 5* Weapon | Wavebreaker's Fin | Deathmatch",
			"The Catch | Ballad of The Fjords",
		],
	},
	[CHARACTERS.Razor]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Rosaria]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sayu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sethos]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Shenhe]: {
		limit: 5,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Heizou]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Sigewinne]: {
		limit: 5,
		differences: [4, 5],
		restrictions: ["Silvershow Heartstrings", "Aqua Simulacra"],
	},
	[CHARACTERS.Skirk]: {
		limit: 2,
		differences: [1, 2],
		restrictions: ["Any 5* Weapon", "Any 3* Weapon"],
	},
	[CHARACTERS.Sucrose]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Tartaglia]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Thoma]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Tighnari]: {
		limit: 5,
		differences: [2, 4],
		restrictions: [
			"Hunter's Path",
			"Any 5* Weapon | Scion of The Blazing Sun | R3+ Flower-Wreathed Feathers",
		],
	},
	[CHARACTERS.Traveler]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Varesa]: {
		limit: 1,
		differences: [0, 1],
		restrictions: ["Vivid Notions", "Any Crit 5* Weapon | Crane's Echoing Call"]
	},
	[CHARACTERS.Venti]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Wanderer]: {
		limit: 6,
		differences: [6],
		restrictions: ["Any 4* Weapon | Twin Nephrite"],
	},
	[CHARACTERS.Wriothesley]: {
		limit: 3,
		differences: [1, 2, 3],
		restrictions: ["Cashflow Supervision | Tulaytullah's Remembrance", "Any 5* Weapon", "Any 4* Weapon"],
	},
	[CHARACTERS.Xiangling]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xianyun]: {
		limit: 6,
		differences: [2],
		restrictions: ["Any 3* Weapon"],
	},
	[CHARACTERS.Xiao]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xilonen]: {
		limit: 1,
		differences: [0],
		restrictions: ["Peak Patrol Song"],
	},
	[CHARACTERS.Xingqiu]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Xinyan]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.YaeMiko]: {
		limit: 6,
		differences: [4, 6],
		restrictions: ["Kagura's Verity", "Any Crit 4* Weapon, Mappa Mare, Hakushin Ring, Oathsworn Eye"],
	},
	[CHARACTERS.Yanfei]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Yaoyao]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Yelan]: {
		limit: 3,
		differences: [2, 3],
		restrictions: ["Any 5* Weapon", "Any 3* Weapon"],
	},
	[CHARACTERS.Yoimiya]: {
		limit: 6,
		differences: [4, 6],
		restrictions: ["Thundering Pulse", "Any 5* Weapon | Rust | Slingshot"],
	},
	[CHARACTERS.YunJin]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
	[CHARACTERS.Zhongli]: {
		limit: 6,
		differences: [-1],
		restrictions: [""],
	},
};